function Vehicle5b(img,w,l)  {
  // extends Vehicle
  Vehicle.call(this,img,w,l,0);
  this.prototype = Object.create(Vehicle.prototype);
  
  this.F = 200;
  this.PFACTOR=0.5;
  
  this.SLOPE = 50;
  this.BIAS = 0.5;
  
  // Matsuoka parameters
  this.TA = 12.0; // time constant controls frequency
  this.TR = 1.0 // integration time constant
  this.S = 2.9 // constant tonic stimulus
  this.B = 5.0 // neural adaptation factor
  this.A = 1.5 // strength of mutual inhibition

  // sensor range
  this.RANGE = width/6;
  
  // fixed angles of left and right eyes relative to body
  this.DISPARITY = 45;
  this.left = radians(this.DISPARITY);
  this.right = -this.left;
  
  this.time=millis();
  this.turn = 0;
  
  this.drawBox = false;
  
  // tip of sensor
  this.tip = this.endPointTo(this.RANGE);
  
  //* activation function defined by the sigmoid function 
  // with slope f. eg. sigmoid(0, F) = 0.5 */
  this.sigmoid = function(x) {
    return 1/(1+exp(-this.SLOPE*x));
  }
  
  // activation function passed to the adaptive neuron
  this.saturatingLinearFunction = function(x) {
    return min(max(x,0),1);
  }
  
  this.an0 = new AdaptiveNeuron(this.saturatingLinearFunction, random(1));
  this.an1 = new AdaptiveNeuron(this.saturatingLinearFunction, random(1));
  
  // determine minimum proximity
  this.proximity = function(obstacles) {
    // sensor line
    var p1 = this.position, p2 = this.tip;
    var p = 0;
    for (var i=0; i<obstacles.length; i++) {
      p = max(p, obstacles[i].proximity(p1,p2));
    }
    return p;
  }
  
  this.contact = function(obstacles) {
    // bounding box
    var tl = this.topLeft();
    var tr = this.topRight();
    var bl = this.bottomLeft();
    var br = this.bottomRight();
    
    var c = { left: 0, right: 0 };
   
    for (var i=0; i<obstacles.length; i++) {
      // find contact point along front and split centrally between left & right
      var f = obstacles[i].collision(tr,br); 
      if (f!=null) {
        var d = this.distance(tr,f) / this.distance(tr,br);
        if (f<0.5) c.left = 1;
        else c.right = 1;
      }
      if (obstacles[i].collision(tl,tr)!=null) c.left = 1;
      if (obstacles[i].collision(bl,br)!=null) c.right = 1;
    }
    this.drawBox = c.left | c.right;
    return c;
  }
    
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  // p5.Vector src
  this.solve = function(rate,src,obstacles) {
    
    // calculate angle to light source
    var a = this.angleWith(src);
    
    // cosine distance shifted into the range [0,1]
    var l = cos(a-this.left)/2 +0.5;
    var r = cos(a-this.right)/2 +0.5;
    
    var p = this.proximity(obstacles);
    var c = this.contact(obstacles);

    // bias = 0
    // TA, TR are time constants
    // S is a tonic input
    // B is the adaptation factor
    // final argument is the inhibitory and weighted, by A, impulse rate of its twin
    this.an0.solve(0,this.TA,this.TR,this.S,this.B,-this.an1.output*this.A);
    this.an1.solve(0,this.TA,this.TR,this.S,this.B,-this.an0.output*this.A);
  
    // obstruction when head is looking either left or right
    var nearLeft = this.sigmoid(p + this.an0.output -1.1);
    var nearRight = this.sigmoid(p + this.an1.output -1.1);
    
    // output is the firing rate of neurons a and b
    // The difference between the outputs approximates a sinewave
    var oscillator = this.an0.output - this.an1.output;
    // use oscillator output to drive proximity sensor servo
    this.turn = oscillator*radians(45);  

    // motor velocity proportional to input
    // vehicle 4b avoids obstacles by turning on contact
    var vl = (r - 2*nearLeft  - 2*c.left)*this.F;
    var vr = (l - 2*nearRight - 2*c.right)*this.F;

    // change in orientation over time
    var dt = 1.0/rate;
    var da = (vr-vl)/(2*this.w);

    // overall velocity is average of the 2 wheels
    var s = (vr+vl)/2;
    
    this.angle = (this.angle + da*dt) % TAU;
    
    // change in position over time
    var dx = s*cos(-this.angle);
    var dy = s*sin(-this.angle);
    this.addPosition(dx*dt,dy*dt);
    
    // step the activation functions
    this.t = millis()-this.time;
    this.time = millis();
    this.an0.step(this.t/100.0);
    this.an1.step(this.t/100.0);
    
    // scan proximity sensor
    var p1 = this.position, p2 = this.endPointTo(this.RANGE);
    
    // rotate sensor end-point p2 around centre p1
    var xoff = p2.x - p1.x;
    var yoff = p2.y - p1.y;
    this.tip = new p5.Vector(
      xoff*cos(this.turn) - yoff*sin(this.turn) + p1.x,
      xoff*sin(this.turn) + yoff*cos(this.turn) + p1.y);
  };
  
  // save shadowed super.draw()
  this.super_draw = this.draw;
  
  this.draw = function() {
    this.super_draw();
    
    // draw sensor line
    var p1 = this.position, p2 = this.tip;    
    stroke(0,255,0);
    line(p1.x,p1.y,p2.x,p2.y);
    
    // draw bounding box
    if (this.drawBox) {
      var tl = this.topLeft();
      var tr = this.topRight();
      var bl = this.bottomLeft();
      var br = this.bottomRight();
      line(tl.x,tl.y,tr.x,tr.y);
      line(tr.x,tr.y,br.x,br.y);
      line(br.x,br.y,bl.x,bl.y);
      line(bl.x,bl.y,tl.x,tl.y);
    }
  };
  
}
