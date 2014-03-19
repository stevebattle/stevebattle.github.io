/* @pjs preload="optics_angel.jpg, head3.gif, neck1.gif, torso3.gif, upper_arm3.gif, forearm3.gif, upper_leg3.gif, lower_leg3.gif" */

int HEAD = 0;
int LEFT_SHOULDER = 1;
int LEFT_ELBOW = 2;
int LEFT_WRIST = 3;
int RIGHT_SHOULDER = 4;
int RIGHT_ELBOW = 5;
int RIGHT_WRIST = 6;
int LEFT_HIP = 7;
int LEFT_KNEE = 8;
int LEFT_ANKLE = 9;
int RIGHT_HIP = 10;
int RIGHT_KNEE = 11;
int RIGHT_ANKLE = 12;

String[] data;
PVector[] cache;
int points, frames;
int frame=0;

PImage bg;
Head head;
Part torso, upperArm, forearm, upperLeg, lowerLeg, neck;

PVector point(int frameIndex, int pointIndex) {
  int i = 2 + frameIndex*points*2 + pointIndex*2;
  int x = int(data[i]);
  int y = int(data[i+1]);
  PVector p = new PVector(x,y);
  
  if (x==0 && y==0) p = cache[pointIndex];
  else cache[pointIndex] = p;
  return p;
}

void setup() {
  // needs to be the same size as the background image
  size(700,525);
  bg = loadImage("optics_angel.jpg");
  
  data = loadStrings("walk");
  points = int(data[0]);
  frames = int(data[1]);
  frameRate(25);
  
  head = new Head("head3.gif",0.15);
  neck = new Part("neck1.gif",0.5);
  torso = new Part("torso3.gif",0.13);
  upperArm = new Part("upper_arm3.gif",0.15);
  forearm = new Part("forearm3.gif",0.15);
  upperLeg = new Part("upper_leg3.gif",0.15);
  lowerLeg = new Part("lower_leg3.gif",0.15);
  
  cache = new PVector[points];
}

void draw() {
  // in processingjs imageMode() applies to the background image
  imageMode(CORNER);
  background(bg);
  imageMode(CENTER);


  // The right-elbow is occluded
  forearm.draw(point(frame,LEFT_ELBOW),point(frame,RIGHT_WRIST));
  lowerLeg.draw(point(frame,RIGHT_KNEE),point(frame,RIGHT_ANKLE));
  upperLeg.draw(point(frame,LEFT_HIP),point(frame,RIGHT_KNEE));
  lowerLeg.draw(point(frame,LEFT_KNEE),point(frame,LEFT_ANKLE));
  upperLeg.draw(point(frame,LEFT_HIP),point(frame,LEFT_KNEE));
  neck.draw(point(frame,HEAD),point(frame,LEFT_SHOULDER));
  head.draw(point(frame,HEAD),point(frame,LEFT_SHOULDER));
  torso.draw(point(frame,LEFT_SHOULDER),point(frame,LEFT_HIP));
  forearm.draw(point(frame,LEFT_ELBOW),point(frame,LEFT_WRIST));
  upperArm.draw(point(frame,LEFT_SHOULDER),point(frame,LEFT_ELBOW));
  
//  for (int i=0; i<points; i++) {
//    PVector p = point(frame,i);
//    fill(0);
//    if (p!=null) ellipse(p.x,p.y,5,5);
//  }

  frame = (frame+1) % frames;
}
class Head {
  PImage img;
  float scaling;
  
  Head(String filename, float scaling) {
    img = loadImage(filename);
    this.scaling = scaling;
  }
  
  void draw(PVector head, PVector shoulder) {
    if (head!=null && shoulder!=null) {
      pushMatrix();
      translate(head.x,head.y);
      scale(scaling);
      image(img,0,0);
      popMatrix();
    }
  }
  
}
class Part {
  PImage img;
  float scaling;
  
  Part(String filename, float scaling) {
    img = loadImage(filename);
    this.scaling = scaling;
  }
  
  PVector midpoint(PVector a, PVector b) {
    return new PVector((a.x+b.x)/2,(a.y+b.y)/2);
  }
  
  float angleBetween(PVector a, PVector b) { 
    double xDiff = b.x - a.x; 
    double yDiff = b.y - a.y; 
    return (float) Math.atan2(yDiff, xDiff); 
  }
  
  void draw(PVector a, PVector b) {
    if (a!=null && b!=null) {
      pushMatrix();
      PVector m = midpoint(a,b);
      translate(m.x,m.y);
      scale(scaling);
      rotate(angleBetween(a,b)-PI/2);
      image(img,0,0);
      popMatrix();
    }
  }
  
}

