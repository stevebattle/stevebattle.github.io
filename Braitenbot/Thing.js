function Thing(img,w,l,x,y,a) {
  this.img = img;
  this.w = w;
  this.l = l;
  this.position = createVector(x,y);
  this.angle = a;
  
  // p5.Vector a, b
  this.distance = function(a, b) {
    return sqrt(pow(a.x-b.x,2)+pow(a.y-b.y,2));
  };
  
  this.distanceTo = function(b) {
    return this.distance(this.position,b);
  };
  
  // PVector a, PVector b
  this.angleBetweenPoints = function(a,b) { 
    var dx = b.x - a.x; 
    var dy = b.y - a.y; 
    return atan2(dy, dx); 
  };
  
  this.draw = function() {
    push();
    translate(this.position.x,this.position.y);
    // rotate the coordinate frame in the opposite direction
    rotate(-this.angle);
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
  
  // x,y min & max assuming angle of zero degrees
  
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

}
