function Vehicle1(img,w,l) {
  // extends Vehicle
  Vehicle.call(this,img,w,l,0);
  this.prototype = Object.create(Vehicle.prototype);
  this.LUM = 2E2;
  this.SATURATION = 10;
  this.F = 100; //500;

  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  this.solve = function(rate,src) {
    // calculate  distance from light source
    var d = this.distanceTo(src);

    // apparent brightness b
    var b = this.LUM/d;

    // angle to light source
    var a = this.angleWith(src);

    // Lambert's cosine law with half-rectification
    var l = cos(a)>0 ? cos(a) : 0;
  
    // motor velocity proportional to input with saturation
    // vehicle 1 is activated by light
    var s = min(b*l,this.SATURATION)*this.F;
    //var s = l*this.F;
    
    // change in orientation over time
    var dt = 1.0/rate;
    var da = 3*(random(TAU)-PI);
    
    // save data for analysis
    this.ll = l;
    this.dd = d; // distance from light source
    
    this.angle = (this.angle + da*dt) % TAU;
    
    // change in position over time
    var dx = s*cos(-this.angle);
    var dy = s*sin(-this.angle);
    this.addPosition(dx*dt,dy*dt);
  };
  
}
