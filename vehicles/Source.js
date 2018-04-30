/* light source */

function Source(img,d,x,y) {
  Thing.call(this,img,d,d,x,y,0,0);
  this.prototype = Object.create(Thing.prototype);

  this.F = 0.01;
    
  this.solve = function() {
    this.angle = (this.angle + this.F) % TAU;
  };
  
  // circle-line intersection
  // a, b : p5.Vector
  this.intersection = function(a,b,scale) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    
    var c = this.position;
    var cx = c.x - a.x;
    var cy = c.y - a.y;
    
    var a = sq(dx)+sq(dy);
    var b2 = dx*cx + dy*cy;
    
    var r = scale*this.w/2;
    var c2 = sq(cx) + sq(cy) - sq(r);
    
    var p = b2 / a;
    var q = c2 / a;
    var d = sq(p) - q;
    
    return d>=0 & p>=0 ;
  };
}
