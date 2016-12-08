const FUSE = 5; // prezzie can destroy this many trunks

function Prezzie(img) {
  
  // attributes
  this.falling = false;
  this.x = this.y = 0;
  this.image = img;
  this.tree;
  this.minimum;
  this.missed;

  this.drop = function(x, y) {
    this.tree = forest.getTree(x);
    this.x = this.tree<0 ? x : forest.getTreeCentre(this.tree);
    this.y = y;
    this.falling = true;
    this.minimum = max(0,this.tree>=0?forest.floors[this.tree]-FUSE:0);
    this.missed = this.tree<0 || forest.floors[this.tree]===0;
  }
  
  this.draw = function() {
    if (this.falling) {
      image(this.image,this.x-this.image.width/2,this.y-this.image.height/2);
    }
  }
  
  this.altitude = function() {
    return int((height -BORDER -GROUND -this.y)/block.height);
  }
  
  this.step = function() {
    if (this.falling) {
      this.y += STEP;
      var a = this.altitude();
      if (this.tree>=0) forest.destroy(this.tree,a);
      if (a<=this.minimum) {
        if (this.missed) { // missed
          boing.play();
          if (score>0) score -= 1;
        }
        this.falling = false;
      }
    }
  }
}
