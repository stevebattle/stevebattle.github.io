function Vehicle1(img,w,l,rate) {
  this.F = 100;
  
  Vehicle.call(this,img,w,l);
  this.prototype = Object.create(Vehicle.prototype);
    
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  this.solve = function(src) {
    // calculate inverse distance from light source
    var d = (width/2) / this.distanceTo(src); 
  
    // motor velocity proportional to input
    // vehicle 1 is activated by light
    var s = d*this.F;
    
    // change in orientation over time
    var dt = 1.0/rate;
    var da = radians(random(360)-180);
    
    this.angle = (this.angle + da*dt) % TAU;
    
    // change in position over time
    var dx = s*cos(-this.angle);
    var dy = s*sin(-this.angle);
    this.addPosition(dx*dt,dy*dt);
  };
  
}
