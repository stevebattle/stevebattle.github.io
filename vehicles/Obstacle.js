function Obstacle(img,d,x,y)  {
  // extends Thing
  Thing.call(this,img,d,d,x,y,0,0);
  this.prototype = Object.create(Thing.prototype);

  // The Liang-Barsky algorithm for line-rectangle collisions
  // https://gist.github.com/ChickenProp/3194723
  
  // p5.Vector a, p5.Vector b
  this.collision = function(a,b) {
    // deltas
    var vx = b.x - a.x, vy = b.y - a.y;
    var p = [ -vx, vx, -vy, vy ];
    var q = [ a.x - this.left(), this.right() - a.x, a.y - this.top(), this.bottom() - a.y ];
    
    var u1 = -Infinity, u2 = Infinity;
    
    for (var i=0; i<4; i++) {
      // if p[i]==0 the line is parallel to the boundary and there is no intersection
      if (p[i]==0) {
        if (q[i]<0) return null;
      }
      else {
        var t = q[i] / p[i];
        // if p[i]<0 the line crosses from outside to the inside
        if (p[i]<0 && u1<t) u1 = t;
        else if (p[i] > 0 && u2 > t) u2 = t;
      }
    }
    if (u1 > u2 || u1 > 1 || u1 < 0) return null;
    // point of collision
    else return new p5.Vector(a.x + u1*vx, a.y + u1*vy);
  }
  
  // calculate (inverse) proximity of thing to this obstacle
  // The obstacle is a rectangle aligned with the x,y axes
  // p5.Vector a, p5.Vector b
  this.proximity = function(a,b) {
    var c = this.collision(a,b);
    // the proximity is inversely proportional to the distance.
    if (c!=null) return 1- this.distance(a,c) / this.distance(a,b);
    else return 0;
  }

}
