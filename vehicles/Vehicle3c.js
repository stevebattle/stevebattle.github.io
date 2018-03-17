function Vehicle3c(img,obs_img,w,l,rate)  {
  // extends Vehicle
  Vehicle.call(this,img,w,l);
  this.prototype = Object.create(Vehicle.prototype);
  
  this.F = 500;
  this.OBSTACLES=10;
  this.PFACTOR=1.1;
  
  // obstacles
  this.obs = [];
  this.OSIDE = 60;
  this.obs_img = obs_img;
  
  // sensor range
  this.RANGE = width/6;
  
  // create obstacles
  for (var i=0; i<this.OBSTACLES; i++) {
    this.obs[i] = new Obstacle(this.obs_img,this.OSIDE,random(width),random(height));
  }
  
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
    var l = cos(a-this.left)/2 +0.5;
    var r = cos(a-this.right)/2 +0.5;
    
    // draw sensor line
    var p1 = this.position, p2 = this.endPointTo(this.RANGE);
    stroke(0,255,0);
    line(p1.x,p1.y,p2.x,p2.y);

    // determine minimum proximity
    var p = 0;
    for (var i=0; i<this.obs.length; i++) {
      p = max(p, this.obs[i].proximity(p1,p2));
    }
    
    // motor velocity proportional to input
    // vehicle 3c avoids obstacles
    var ratio = 0.3;
    var vl = (1-r)*this.F, vr = (1-l)*this.F;
    var vl = ((1-ratio)*r -ratio*l -this.PFACTOR*p)*this.F;
    var vr = ((1-ratio)*l -ratio*r -this.PFACTOR*p)*this.F;

    // change in orientation over time
    var dt = 1.0/rate;
    var da = (vr-vl)/(2*this.w);
    
    // add 'Brownian' motion
    da += radians(random(360)-180);
    
    // overall velocity is average of the 2 wheels
    var s = (vr+vl)/2;
    
    this.angle = (this.angle + da*dt) % TAU;
    
    // change in position over time
    var dx = s*cos(-this.angle);
    var dy = s*sin(-this.angle);
    this.addPosition(dx*dt,dy*dt);
  };
  
  this.draw = function() {
    //Thing.prototype.draw.call(this);
    push();
    translate(this.position.x,this.position.y);
    // rotate the coordinate frame in the opposite direction
    rotate(-this.angle);
    imageMode(CENTER);
    image(this.img,0,0,this.l,this.w);
    pop();
    
    console.log(this.obs.length);
    for (var i=0; i<this.obs.length; i++) {
      this.obs[i].draw();
      console.log("*");
    }
  };
  
}
