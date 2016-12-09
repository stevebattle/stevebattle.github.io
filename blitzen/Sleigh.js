const BOUNCE = 7;

function Sleigh(images, forestHeight) {
  
  // attributes
  this.images = images;
  this.tree;
  this.state = 0;
  this.altitude = int(forestHeight/block.height)+1; // height in floors
  this.x = -this.images[0].width;
  this.y = height -BORDER -GROUND -this.altitude*block.height - CLEARANCE -this.images[0].height;
  this.y1 = this.t = 0;
  this.landed = this.crashed = false;
  
  jingle.play();
  
  this.draw = function() {
    var s = min(this.state,3); // maximum image is 3
    image(this.images[s],this.x,this.y+this.y1);
  }
  
  this.drop = function(prezzie) {
    if (this.x>=0 && this.x<(width-this.images[0].width/2)) {
      prezzie.drop(int(this.x+this.images[0].width/2), int(this.y+this.images[0].height/2));
    }
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
        crash.play();
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
        else if (this.y+this.images[0].height==height-BORDER-GROUND) { // landing
          frameRate(20); // slo-mo bounce
          this.y1 = min(0,-BOUNCE*this.t + this.t*this.t++);
          this.landed = this.x-STEP>width;
          
          // no time for the bounce
          //if (this.landed && jingle.isPlaying()) hohoho.play();
          // otherwise play on bounce
          //if (this.y1<0 && !hohoho.isPlaying()) 
          if (jingle.isPlaying()) {
            jingle.stop();
            hohoho.play();
          }
        }
      }
      break;
      
      case 1: // crashing
      jingle.stop();
      this.state++;
      this.x = forest.getTreeCentre(this.tree) +block.width/2 -this.images[this.state].width;
      this.y += this.images[this.state-1].height -this.images[this.state].height;
      break;
      
      case 2: // crashed
      this.state++;
      this.y += this.images[this.state-1].height -this.images[this.state].height;
      this.crashed = true;
      break;

      case 3: // wait in case bomb is in flight after crash
      if (!prezzie.falling) this.state++;
      break;

      case 4: // save high score
      try { 
        localStorage.setItem('BlitzenBest', best);
      } catch (error) {}
      this.state++;
      break;

      default:
      // do nothing
    }
  }
  
}
