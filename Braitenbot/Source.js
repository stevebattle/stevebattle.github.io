/* light source */

function Source(img,d,x,y) {
  this.F = 0.01;
  
  Thing.call(this,img,d,d,x,y,0);
  this.prototype = Object.create(Thing.prototype);
    
  this.solve = function() {
    this.angle = (this.angle + this.F) % TAU;
  };
}
