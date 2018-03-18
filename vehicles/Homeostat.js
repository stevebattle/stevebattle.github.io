function Homeostat(n, h, j, p, q) {
  // n is number of inputs including self
  this.n = n;
  
  // h is factor controlling force on needle
  this.h = h;
  
  // needle inertia, j
  // mass of needle & coil, or inertial equivalent
  this.j = j;
  
  // float min, p, and max q, positions of needle
  // p,q : voltage potentials at the ends of the water trough
  this.p = p;
  this.q = q;
  this.r = true; // boolean r: enable relay
      
  // boolean array of uniselector setting, u
  this.u = [];
  for (var i=0; i<n; i++) {
    this.u[i] = true;
  }
  
  // float array of input weights, a
  this.a = [];
  
  // y: position of the needle
  this.y=0;
  
  // z: force on needle
  this.z=0;
  
  // boolean t: trigger next step
  this.t=false;
       
  // randomize weights subject to the uniselector
  // float min, max
  this.randomize = function(min, max) {
    for (var i=0; i<this.n; i++) {
      if (this.u[i]) {
        this.a[i] = random(max - min) +min;
      }
    }
  }
    
  // client should at least set the weight on the recurrent self-input
  // other weights may be set manually
  
  // set fixed weight, and disable uniselector for this input
  this.setWeight = function(i, w) {
    this.a[i] = w;
    this.u[i] = false;
  }

  // reverse the commutator on input i and disable the uniselector
  this.reverse = function(i) {
    this.a[i] = -this.a[i];
    this.u[i] = false;
  }
    
  // set relay to false to 'short' the relay, preventing it from activating the uniselectors
  // boolean relay
  this.setRelay = function(relay) {
    this.r = relay;
  }
  
  // boolean trigger
  this.setTrigger = function(trigger) {
    this.t = trigger;
  }
    
  // solve for y,z using Euler's method and return y
  // float[] x, float dt
  this.solve = function(x, dt) {
    // sum weighted, a, inputs, x
    var ax = 0;
    for (var i=0; i<this.n; i++) {
      ax += this.a[i]*x[i];
    }
    
    var dy = this.z;

    // l: force on needle given by unit current in milliammeter coil 
    //    proportional to potential on grid per unit deviation of y
    //    less force of spring, or gravitation, tending to restore needle, per unit deviation
    // k: fraction of current sent to milliammeter (-1<=k<=+1)
    //    less frictional force, assumed proportional to velocity of y, per unit velocity (viscosity)
    var dz = this.h*ax - this.j*this.z;
    
    // y is position of the needle
    this.y += dy*dt;
    this.z += dz*dt;
      
    // velocity becomes zero when the essential variable goes out of bounds
    this.y = this.saturation(this.y);
    return this.y;
  }
  
  // float needle position, y
  this.saturation = function(y) {
    return min(this.p, max(this.q, y));
  }
    
  // check the inputs to the relay
  // if the needle setting y is outside the bounds [q,p] then the relay is energised
  this.step = function() {
    // the unit may be set to trigger, t, regardless of y
    // the relay, r, may disable the uniselector
    if (this.t || (this.r && (this.y<=this.q || this.y>=this.p))) {
      this.t = false;
      // randomize weights, a
      for (var i=0; i<this.n; i++) {
        if (this.u[i]) {
          this.a[i] = random(this.p - this.q) + this.q; // [-1,+1]
        }
      }
      this.y = 0;
      this.z = 0;
      return true;
    }
    else return false;
  }
    
}
