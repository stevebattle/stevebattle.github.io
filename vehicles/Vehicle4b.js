function Vehicle4b(img,w,l)  {
  // extends Vehicle
  Vehicle.call(this,img,w,l);
  this.prototype = Object.create(Vehicle.prototype);
  
  this.F = 300;
  this.PFACTOR=0.5;
  
  this.SLOPE = 50;
  this.BIAS = 0.5;

  
  // sensor range
  this.RANGE = width/6;
  
  // fixed angles of left and right eyes relative to body
  this.DISPARITY = 45
  this.left = radians(this.DISPARITY);
  this.right = -this.left;
  
  /* The activation value is modulated by the sigmoid function 
   with slope f. eg. sigmoid(0, F) = 0.5 */

  this.sigmoid = function(x,f) {
    return 1/(1+exp(-f*x));
  }
  
  // determine minimum proximity
  this.proximitySensor = function(obstacles) {
    // sensor line
    var p1 = this.position, p2 = this.endPointTo(this.RANGE);
    var p = 0;
    for (var i=0; i<obstacles.length; i++) {
      p = max(p, obstacles[i].proximity(p1,p2));
    }
    return p;
  }
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  // p5.Vector src
  this.solve = function(rate,src,obstacles) {
    // calculate angle to light source
    var a = this.angleWith(src);
    
    // cosine distance shifted into the range [0,1]
    var l = cos(a-this.left)/2 +0.5;
    var r = cos(a-this.right)/2 +0.5;
    
    // threshold function using sigmoid
    var p = this.sigmoid(this.proximitySensor(obstacles)-this.BIAS, this.SLOPE);
    
    // motor velocity proportional to input
    // vehicle 4b avoids obstacles by turning on contact
    var ratio = 0.3;
    var vl = ((1-ratio)*r -ratio*l +this.PFACTOR*p)*this.F;
    var vr = ((1-ratio)*l -ratio*r -this.PFACTOR*p)*this.F;

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
  };
  
  // save shadowed super.draw()
  this.super_draw = this.draw;
  
  this.draw = function() {
    this.super_draw();
    
    // draw sensor line
    var p1 = this.position, p2 = this.endPointTo(this.RANGE);
    stroke(0,255,0);
    line(p1.x,p1.y,p2.x,p2.y);    
  };
  
}
