function Vehicle2a(img,w,l,rate)  {
  // extends Vehicle
  Vehicle.call(this,img,w,l);
  this.prototype = Object.create(Vehicle.prototype);
  
  this.F = 600;
  
  // fixed angles of left and right eyes relative to body
  this.DISPARITY = 45
  this.left = radians(this.DISPARITY);
  this.right = -this.left;
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  // p5.Vector src
  this.solve = function(src) {
    // calculate angle to light source
    var a = this.angleWith(src);
    
    // cosine distance shifted into the range [0,1]
    var l = cos(a-left)/2 +0.5;
    var r = cos(a-right)/2 +0.5;
    
    // motor velocity proportional to input
    // vehicle 2b runs away from the light
    var vl = l*F, vr = r*F;
    
    // change in orientation over time
    var dt = 1.0/rate;
    var da = (vr-vl)/(2*this.w);
    
    // overall velocity is average of the 2 wheels
    var s = (vr+vl)/2;
    
    this.angle = (this.angle + da*dt) % TAU;
    
    // change in position over time
    var dx = s*cos(-angle);
    var dy = s*sin(-angle);
    this.addPosition(dx*dt,dy*dt);
  }
  
}