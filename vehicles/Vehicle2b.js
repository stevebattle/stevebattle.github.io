function Vehicle2b(img,w,l)  {
  // extends Vehicle
  Vehicle.call(this,img,w,l,0);
  this.prototype = Object.create(Vehicle.prototype);
  this.LUM = 1E3;
  this.F = 20; //600;
  
  // fixed angles of left and right eyes relative to body
  //this.DISPARITY = 45
  //this.left = radians(this.DISPARITY);
  //this.right = -this.left;
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  // p5.Vector src
  this.solve = function(rate,src) {
    // calculate  distance from light source
    var d = this.distanceTo(src);

    // apparent brightness b
    var b = this.LUM/d;

    // calculate angle to light source
    var a = this.angleWith(src);
    
    // Lambert's cosine law shifted into positive range
    var l = sin(a + PI/4)+1;
    var r = cos(a + PI/4)+1;
    
    // motor velocity proportional to input
    // vehicle 2b runs away from the light
    var vl = b*r*this.F, vr = b*l*this.F;
    
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
  }
  
}
