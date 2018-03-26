function Vehicle5a(img,w,l)  {
  // extends Vehicle
  Vehicle.call(this,img,w,l);
  this.prototype = Object.create(Vehicle.prototype);
  
  this.F = 200;
  this.PFACTOR=0.5;
  
  this.SLOPE = 50;
  this.BIAS = 0.25;

  // sensor range
  this.RANGE = width/6;
  
  // fixed angles of left and right eyes relative to body
  this.DISPARITY = 45;
  this.left = radians(this.DISPARITY);
  this.right = -this.left;
  
  this.drawBox = false;
  this.drawProximity = false;
  
  //* activation function defined by the sigmoid function 
  // with slope f. eg. sigmoid(0, F) = 0.5 */
  this.sigmoid = function(x) {
    return 1/(1+exp(-this.SLOPE*x));
  }
  
  // determine minimum proximity
  this.proximity = function(obstacles) {
    // sensor line
    var p1 = this.position, p2 = this.endPointTo(this.RANGE);
    var p = 0;
    for (var i=0; i<obstacles.length; i++) {
      p = max(p, obstacles[i].proximity(p1,p2));
    }
    if (p>0) this.drawProximity = true;
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

    var tip = this.endPointTo(this.RANGE);
    var p = this.sigmoid(this.proximity(obstacles,tip)-this.BIAS);
    //var p = this.proximity(obstacles);
    var c = this.contact(obstacles);

    // feed-forward neural network
    
    // demonstrate use of Comparators, based on heaviside threshold function
    var leftBrighter = l-r >= 0;
    var rightBrighter = r-l >= 0;
  
    // demonstrate use of OR gates (disjunction) with threshold 0.5
    var leftObstruction = c.left + p -0.5 >= 0;
    var rightObstruction = c.right + p -0.5 >= 0;

    // demonstrate use of AND gates (conjunction) with threshold 0.9
    var leftDrive = rightBrighter - leftObstruction -0.9 >= 0;
    var rightDrive = leftBrighter - rightObstruction -0.9 >=0;
      
    // motor velocity proportional to input
    // vehicle 4b avoids obstacles by turning on contact
    var vl = (leftDrive  - 2*leftObstruction)*this.F;
    var vr = (rightDrive - 2*rightObstruction)*this.F;

    // change in orientation over time
    var dt = 1.0/rate;
    var da = (vr-vl)/(2*this.w);
    
    // add 'Brownian' motion
    da += (random(TAU)-PI)/2;

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
    if (this.drawProximity) {
      var p1 = this.position, p2 = this.endPointTo(this.RANGE);
      stroke(0,255,0);
      line(p1.x,p1.y,p2.x,p2.y);
      this.drawProximity = false;
    }
    
    // draw bounding box
    if (this.drawBox) {
      var tl = this.topLeft();
      var tr = this.topRight();
      var bl = this.bottomLeft();
      var br = this.bottomRight();
      stroke(0,255,0);
      line(tl.x,tl.y,tr.x,tr.y);
      line(tr.x,tr.y,br.x,br.y);
      line(br.x,br.y,bl.x,bl.y);
      line(bl.x,bl.y,tl.x,tl.y);
    }
  };
  
}
