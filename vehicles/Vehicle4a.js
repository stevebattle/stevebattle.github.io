function Vehicle4a(img,w,l)  {
  // extends Vehicle
  Vehicle.call(this,img,w,l,0);
  this.prototype = Object.create(Vehicle.prototype);
  
  this.F = 500;
  this.OFFSET = 0.2;
  this.LOFF = 0.5 + this.OFFSET;
  this.ROFF = 0.5 - this.OFFSET;
  
  // sensor range
  this.RANGE = width/6;
  
  // configuration of radial basis functions
  this.SCALE = 25;
  this.LBIAS = cos(radians(-135));
  this.RBIAS = cos(radians(-45));
  
  // fixed angles of left and right eyes relative to body
  this.DISPARITY = 45
  this.left = radians(this.DISPARITY);
  this.right = -this.left;
  
  // function for the normal distribution provides radial basis function
  this.normal = function(x,e) {
    return exp(-e*x*x);
  }
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  // p5.Vector src
  this.solve = function(rate,src,obstacles) {
    // calculate angle to light source
    var a = this.angleWith(src);
            
    // radial basis of cosine distance
    // angle runs from 0 (directly pointing towards src) to pi (directly away from src), anticlockwise
    // angle runs from 0 (directly pointing towards src) through 0 to -pi (directly away from src), clockwise
    var l = this.normal(cos(a-this.left)-this.LBIAS,this.SCALE);
    var r = this.normal(cos(a-this.right)-this.RBIAS,this.SCALE);
    
    // motor velocity proportional to input
    // vehicle 4a heads directly towards the light
    var e = (l-r);
    var vl = (this.LOFF-e)*this.F, vr = (this.ROFF-e)*this.F;
        
    // change in orientation over time
    var dt = 1.0/rate;
    var da = (vr-vl)/(2*this.w);
    
    // overall velocity is average of the 2 wheels
    var s = (vr+vl)/2;
    
    // The angle changes by da
    this.angle = (this.angle + da*dt) % TAU;
    
    // change in position over time
    var dx = s*cos(-this.angle);
    var dy = s*sin(-this.angle);
    this.addPosition(dx*dt,dy*dt);
  };
  
}
