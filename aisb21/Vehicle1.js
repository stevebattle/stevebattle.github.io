function Vehicle1(img,w,l) {
  // extends Vehicle
  Vehicle.call(this,img,w,l,0);
  this.prototype = Object.create(Vehicle.prototype);
  
  this.F = 500;

  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  this.solve = function(rate,src) {
    // calculate inverse distance from light source
    var d = 1 - (this.distanceTo(src)/(this.diagonal/2));
    // angle of light source
    var l = cos(this.angleWith(src))/2 +0.5;
  
    // motor velocity proportional to input
    // vehicle 1 is activated by light
    var s = d*l*this.F;
    
    // change in orientation over time
    var dt = 1.0/rate;
    var da = 2*(random(TAU)-PI);
    
    this.angle = (this.angle + da*dt) % TAU;
    
    // change in position over time
    var dx = s*cos(-this.angle);
    var dy = s*sin(-this.angle);
    this.addPosition(dx*dt,dy*dt);
  };
  
}
