function Thing(img,w,l,x,y,a,o) {
  this.img = img;
  this.w = w;
  this.l = l;
  this.position = createVector(x,y);
  this.angle = a;
  this.offset = o;
  
  // p5.Vector a, b
  this.distance = function(a, b) {
    return sqrt(pow(a.x-b.x,2)+pow(a.y-b.y,2));
  };
  
  this.distanceTo = function(b) {
    return this.distance(this.position,b);
  };
  
  // p5.Vector a, p5.Vector b
  this.angleBetweenPoints = function(a,b) { 
    var dx = b.x - a.x; 
    var dy = b.y - a.y; 
    return atan2(dy, dx); 
  };
  
  // p5.Vector b
  this.angleTo = function(b) { 
    return this.angleBetweenPoints(this.position,b); 
  };
  
  // p5.Vector b
  // take into account angle of this Thing
  this.angleWith = function(b) { 
    return (TAU - this.angleTo(b)) % TAU - this.angle; 
  };
  
  this.draw = function() {
    push();
    translate(this.position.x,this.position.y);
    // rotate the coordinate frame in the opposite direction
    rotate(-this.angle);
    translate(this.offset,0);
    imageMode(CENTER);
    image(this.img,0,0,this.l,this.w);
    pop();
  };
  
  // int x, y
  this.setPosition = function(x,y) {
    this.position.x = x;
    this.position.y = y;
  };
  
  // float x, float y
  this.addPosition = function(x,y) {
    this.position.x += x;
    this.position.y += y;
  };

  // x,y min & max for zero degrees (fixed obstacles)
  
  this.left = function() {
    return this.position.x - this.l/2;
  };
  
  this.right = function() {
    return this.position.x + this.l/2;
  };

  this.top = function() {
    return this.position.y - this.w/2;
  };
  
  this.bottom = function() {
    return this.position.y + this.w/2;
  };
  
  // bounding box corners
  
  this.corner = function(xoff,yoff) {
    return new p5.Vector(
      xoff*cos(-this.angle) - yoff*sin(-this.angle) + this.position.x,
      xoff*sin(-this.angle) + yoff*cos(-this.angle) + this.position.y);
  }
 
  this.topLeft = function() {
    return this.corner(-this.l/2+this.offset,-this.w/2);
  }
  
  this.topRight = function() {
    return this.corner(this.l/2+this.offset,-this.w/2);
  }
  
  this.bottomLeft = function() {
    return this.corner(-this.l/2+this.offset,this.w/2);
  }
  
  this.bottomRight = function() {
    return this.corner(this.l/2+this.offset,this.w/2);
  }

  this.encloses = function(x,y) {
    return this.left()<=x && x<=this.right() && this.top()<= y && y <= this.bottom();
  }
}