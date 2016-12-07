function Sleigh(images, forestHeight) {
  
  const BOUNCE = 7;
  
  // state;
  this.images = images;
  // altitude; // height in floors
  // x,y,y1,t;
  // building;
  // landed, crashed;
  
  this.state = 0;
  this.altitude = int(forestHeight/block.height)+1;
  this.x = -this.images[0].width;
  this.y = height -BORDER -GROUND -this.altitude*block.height - CLEARANCE -this.images[0].height;
  this.y1 = this.t = 0;
  this.landed = this.crashed = false;
  
  this.draw = function() {
    image(this.images[this.state],this.x,this.y+this.y1);
  }
  
  this.drop = function(prezzie) {
    prezzie.drop(this.x+this.images[0].width/2, this.y+this.images[0].height/2);
  }
  
  this.step = function() {
    switch (this.state) {
      case 0: // flying
      this.x += STEP;
      if (this.x > width +this.images[0].width) { 
          // move the sleigh to the start of the next layer
          this.x = -this.images[0].width;
          if (forest.count>0) {
            this.y += block.height;
            this.altitude -= 1;
          }
      }
      this.tree = forest.getTree(this.x+sleigh.images[0].width);
      if (this.tree>=0 && forest.getTreeHeight(this.tree)>this.altitude) {
        this.state++; // crash
        frameRate(10); // slo-mo
        this.x = forest.getTreeCentre(this.tree) +block.width/2 -this.images[this.state].width;
        this.y += CLEARANCE +this.images[this.state-1].height -this.images[this.state].height;
        forest.crash(this.tree);
      }
      if (forest.count===0) { // safe to land
        if (this.y+this.images[0].height<height-BORDER-GROUND) {
          this.y++; // descent
          if (this.y%block.height===0) score += BONUS;
        }
        else if (this.y+this.images[0].height==height-BORDER-GROUND) { // bounce
          frameRate(20); // slo-mo
          this.y1 = min(0,-BOUNCE*this.t + this.t*this.t++);
          this.landed = this.x-STEP>width;
        }
      }
      break;
      
      case 1: // crashing
      this.state++;
      this.x = forest.getTreeCentre(this.tree) +block.width/2 -this.images[this.state].width;
      this.y += this.images[this.state-1].height -this.images[this.state].height;
      break;
      
      case 2: // crashed
      this.state++;
      this.y += this.images[this.state-1].height -this.images[this.state].height;
      this.crashed = true;
      break;
    }
  }
  
}
