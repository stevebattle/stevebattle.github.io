function Forest(images, forestHeight, level) {
  const DEVIATION = 0.25;
  const BIAS = 0.5;
  
  this.images = [];
  // buildings, margin, maxFloors;
  this.floors = [];
  this.tops = [];
  // built;
  // count;
  
  this.images = images.slice(1,3);

  this.maxFloors = int(forestHeight/block.height);
  this.trees = int((width -SPACE)/(block.width+GAP));
  this.margin = int((width -this.trees*(block.width+GAP) +GAP) /2);
  this.floors = [];
  this.tops = [];
  var scale = this.maxFloors + 2*level; // add two floors per additional level
  this.count=0;
  for (var i=0; i<this.trees; i++) {
    var r = randomGaussian()*DEVIATION +BIAS;
    this.floors[i] = max(min(int(r*scale), this.maxFloors),0);
    this.count += this.floors[i];
    this.tops[i] = 0; // topped by a roof
  }
  this.built=0;

  this.draw = function() {
    for (var i=0; i<this.trees; i++) {
      var x = i*(block.width+GAP) +this.margin;
      var f = min(this.floors[i],this.built);
      for (var j=1; j<f; j++) {
        image(block,x,height -BORDER -GROUND -j*block.height);
      }
      // top it off
      if (f>0 && this.tops[i]>=0) {
        image(this.images[this.tops[i]],x,height -BORDER -GROUND -(f-1)*block.height -this.images[this.tops[i]].height);
      }
    }
    if (this.built<this.maxFloors) this.built++;
  }
  
  this.getTree = function(x) {
    if (x<this.margin) return -1;
    var r1 = this.margin, r2 = this.margin+this.trees*(block.width+GAP);
    var r3 = 0, r4 = this.trees;
    var i = int(map(x,r1,r2,r3,r4));
    return i<this.trees ? i : -1;
  }
  
  this.getTreeHeight = function(i) {
    return this.floors[i];
  }
  
  this.getTreeCentre = function(i) {
    return i*(block.width+GAP) +this.margin +int(block.width/2);
  }
  
  this.crash = function(i) {
    this.tops[i] = -1;
  }
  
  this.destroy = function(i, altitude) {
    if (this.floors[i]-1>=altitude) {
      var points = this.floors[i] - max(0,altitude);
      score += points;
      this.count -= points;
      this.floors[i] -= points;
      this.tops[i] = 1;
    }
  }
  
}
