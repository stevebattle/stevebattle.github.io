function Vehicle(img,w,l,o) {
  Thing.call(this,img,w,l,random(width-200)+100,random(height-200)+100,random(TAU),o);
  this.prototype = Object.create(Thing.prototype);
  this.super = this.prototype;
  // window diagonal
  this.diagonal = sqrt(pow(width,2),pow(height,2));
  
  // vehicles leave a visible path
  this.PATH_LENGTH=1000;
  this.path = new Array(this.PATH_LENGTH);
  this.pathIndex = 0;

  // vehicle must clear edge + margin for a visually clean exit
  this.MARGIN = 50;
  
  // calculate end-point coordinates given origin, angle and length
  // p5.Vector origin, float angle, float len
  this.endPoint = function(origin, angle, len) {
    return createVector(origin.x + len * cos(-angle), origin.y + len * sin(-angle));
  };
  
  this.endPointTo = function(len) {
    return this.endPoint(this.position, this.angle, len);
  };
  
  this.clearPath = function() {
    this.path = new Array(this.PATH_LENGTH);
    this.pathIndex = 0;
  };
  
  this.drawPath = function() {
    // add current position to path
    var p = this.corner(this.offset,0);
    //this.path[this.pathIndex] = createVector(this.position.x,this.position.y);
    //console.log(p);
    this.path[this.pathIndex] = p;
    this.pathIndex = (this.pathIndex+1)%this.PATH_LENGTH;
    
    for (var i=0; i<this.PATH_LENGTH-1; i++) {     
      var p1 = this.path[(this.pathIndex+i)%this.PATH_LENGTH];
      stroke(0); fill(0);
      if (p1!=null) ellipse(p1.x,p1.y,2,2);
    }
  };
  
  this.checkBorders = function() {
    // keep the vehicle on-screen
    if (this.position.x+this.MARGIN<0 || 
      this.position.x - this.MARGIN>width || 
      this.position.y + this.MARGIN<0 || 
      this.position.y - this.MARGIN>height) {
        
      this.clearPath();
      this.setPosition(random(width)/2, random(height)/2);
      this.angle = radians(random(360));
    }
  };

}