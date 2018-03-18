function Vehicle6(img,w,l,rate) {
  // extends Vehicle
  Vehicle.call(this,img,w,l);
  this.prototype = Object.create(Vehicle.prototype);
  
  this.F = 300;
  this.G = 0.5;
  
  // eyes project from centre through front corners
  this.left = radians(45);
  this.right = -this.left;
  
  // two homeostatic units: left motor, right motor
  // three parameters: left eye, right eye, inverse speed, proximity
  this.N=2;
  this.P=3;
  
  // interval counter
  this.INTERVAL = 1.0/3.0; // check relays once every three seconds
  this.COUNT = int(rate/this.INTERVAL);
  this.count = this.COUNT;
      
  // configure N homeostat units with additional input parameters P
  this.h = [];
  for (var i=0; i<this.N; i++) {
      this.h[i] = new Homeostat(this.N+this.P,1,1,1,-1);
      this.h[i].setWeight(i,-0.5); // recurrent connection
      this.h[i].setWeight(this.N+2,1); // essential variable : distance
      this.h[i].randomize(-1,1); // randomize remaining weights
  }
  
  // unit output
  this.x = []; // length N+P
  for (var i=0; i<this.N; i++) this.x[i]=0;
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  // floate rate, p5.Vector src
  this.solve = function(rate,src) {
    // calculate angle to light source
    var a = this.angleWith(src);
    
    // cosine distance
    var l = cos(a - this.left);
    var r = cos(a - this.right);
            
    // calculate distance to light source
    var ds = this.distanceTo(src)/(width/2);
 
    // leave x[0..N-1] as they were from previous solve()
    this.x[this.N] = l;
    this.x[this.N+1] = r;
    this.x[this.N+2] = ds>1 ? 1 : 0;
    
    var dt = 1.0/rate;

    // solve for y
    var y = []; // length N+P
    for (var i=0; i<this.N; i++) {
      y[i] = this.h[i].solve(this.x,dt);
    }
    for (var i=0; i<this.N; i++) {
      this.x[i] = y[i];
    }
    
    // check step function when interval is up
    if (this.count-- == 0) {
      if (this.step()) {
        this.stable = 0;
        this.setPosition(int(random(width)),int(random(height)));
        this.angle = random(TAU);
        this.clearPath();
      }
      this.count = this.COUNT; // restart the count
    }
    
    // motor velocity
    var vl = this.F*this.x[0], vr = this.F*this.x[1];
    
    // change in orientation over time
    var da = (vr-vl)/(2*this.w);
    
    // overall velocity is average of the 2 wheels
    var v = (vr+vl)/2;
        
    this.angle = (this.angle + da*dt) % TAU;
    
    // change in position over time
    var dx = v*cos(-this.angle);
    var dy = v*sin(-this.angle);
    this.addPosition(dx*dt,dy*dt,0);
  }
  
  // do any homeostat units trigger a step?
  this.step = function() {
    var s = false;
    for (var i=0; i<this.N; i++) {
      if (this.h[i].step()) {
        this.x[i] = 0;
        s = true;
      }
    }
    return s;
  }
  
  this.reset = function() {
    this.clearPath();
    this.setPosition(random(width)/2, random(height)/2);
    this.angle = radians(random(360));
      
    // trigger all units
    for (var i=0; i<this.N; i++) {
       this.h[i].setTrigger(true);
       //this.x[i]=0;
    }
    this.step();
  }

  this.checkBorders = function() {
    // keep the vehicle on-screen
    if (this.position.x+this.MARGIN<0 || 
      this.position.x - this.MARGIN>width || 
      this.position.y + this.MARGIN<0 || 
      this.position.y - this.MARGIN>height) {
        this.reset();
    }
  };
  
}
