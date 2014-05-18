/* @pjs preload="sun.png, vehicle1.png, vehicle2a.png, vehicle2b.png, bg.jpg";
 */

/*
   Braitenberg Vehicles simulation
 
   Copyright 2013 Steve Battle
 
   This work is licensed under a Creative Commons Attribution 3.0 Unported License.
   
   You may obtain a copy of the License at
 
       http://creativecommons.org/licenses/by/3.0
*/

int RATE=20;
int VWIDTH=50, VLENGTH=75, VSIDE=50;

PImage bg;
Thing vehicle, v1, v2a, v2b, lamp;

void setup() {
  size(600,400);
  frameRate(RATE);
  imageMode(CENTER);
  
  //bg = createImage(width, height, RGB);
  //backgroundPixels(bg);
  //bg.save("data/bg.jpg");
  bg = loadImage("bg.jpg");
  lamp = new Lamp("sun.png",VSIDE,width/2,height/2);
  v1  = new Vehicle1("vehicle1.png",30,VLENGTH);
  v2a = new Vehicle2a("vehicle2a.png",VWIDTH,VLENGTH);
  v2b = new Vehicle2b("vehicle2b.png",VWIDTH,VLENGTH);
  setVehicle(initialise);
}

void setVehicle(String v) {
  if (v=="1") vehicle = v1;
  else if (v=="2a") vehicle = v2a;
  else if (v=="2b") vehicle = v2b;
}

void backgroundPixels(PImage img, PVector v) {
  img.loadPixels();
  float dmax = sqrt(pow(img.width,2)+pow(img.height,2))/2;
  // pythagorean distance: sqrt(dx^2 + dy^2)
  for (int y=0; y<img.height; y++) {
    // dy^2 is constant for this row
    float dy2 = pow(y-v.y,2);
    for (int x=0; x<img.width; x++) {
      float dx2 = pow(x-v.x,2);
      float d = sqrt(dx2+dy2)/dmax;
      float l = 255.0*(1-d);
      img.pixels[x+y*img.width] = color(l,l,l);
    }
  }
  img.updatePixels();
}

void draw() {
  // in processingjs imageMode() applies to the background image
  imageMode(CORNER);
  background(bg);
  imageMode(CENTER);
  
  lamp.draw();
  if (vehicle!=null) vehicle.draw();
  lamp.solve(null);
  if (vehicle!=null) vehicle.solve(lamp.position);
}

void mouseClicked() {
  vehicle.setPosition(mouseX,mouseY);
}
class Lamp extends Thing {
  float F = 0.01;
  
  Lamp(String filename, int d, float x, float y) {
    super(filename, d, d, x, y);
  }
    
  void solve(PVector v) {
    angle = (angle + F) % TAU;
  }
  
}
abstract class Thing {
  PImage img;
  PVector position;
  float angle, TAU = 2*PI;
  int w, l;
  
  Thing(String filename, int w, int l, float x, float y) {
    img = loadImage(filename);
    position = new PVector(x,y);
    this.w = w; 
    this.l = l;
  }
  
  float distance(PVector a, PVector b) {
    return sqrt(pow(a.x-b.x,2)+pow(a.y-b.y,2));
  }

  float angleBetweenPoints(PVector a, PVector b) { 
    float dx = b.x - a.x; 
    float dy = b.y - a.y; 
    return atan2(dy, dx); 
  }
  
  void draw() {
    pushMatrix();
    translate(position.x,position.y);
    // rotate the coordinate frame in the opposite direction
    rotate(-angle);
    image(img,0,0,l,w);
    popMatrix();
  }
  
  void solve(PVector v) {
  }
  
  void setPosition(int x, int y) {
      position = new PVector(mouseX,mouseY);
  }
  
}
class Vehicle1 extends Thing {
  int F = 50, A=360;
  
  Vehicle1(String filename, int w, int l) {
    super(filename, w, l, random(width), random(height));    
  }
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  void solve(PVector v) {
    // calculate distance from lamp
    //float a = (TAU - angleBetweenPoints(position,v)) % TAU ;
    float d = (width/2)/distance(position,v);
    
    // cosine distance shifted into the range [0,1]
    //float d = cos(a-angle)/2 +0.5;
    
    // motor velocity proportional to input
    // vehicle 1 is activated by light
    float s = d*F;
    
    // change in orientation over time
    float dt = 1.0/RATE;
    float da = radians(random(A)-A/2);
    
    angle = (angle + da*dt) % TAU;
    
    // change in position over time
    float dx = s*cos(-angle);
    float dy = s*sin(-angle);
    position.add(dx*dt,dy*dt,0);
    
    // keep the vehicle on-screen
    int m = 50;
    position.x = (position.x + 3*m +width) % (width + 2*m) -m;
    position.y = (position.y + 3*m +height) % (height + 2*m) -m;
  }
  
}
class Vehicle2a extends Thing {
  int F = 400;
  float left, right;
  
  Vehicle2a(String filename, int w, int l) {
    super(filename, w, l, random(width), random(height));    
    // eyes project from centre through front corners
    left = atan2(w,l);
    right = -left;
  }
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  void solve(PVector v) {
    // calculate angle to lamp
    float a = (TAU - angleBetweenPoints(position,v)) % TAU ;
    
    // cosine distance shifted into the range [0,1]
    float l = cos(a-angle-left)/2 +0.5;
    float r = cos(a-angle-right)/2 +0.5;
    
    // motor velocity proportional to input
    // vehicle 2b runs away from the light
    float vl = l*F, vr = r*F;
    
    // change in orientation over time
    float dt = 1.0/RATE;
    float da = (vr-vl)/(2*w);
    
    // overall velocity is average of the 2 wheels
    float s = (vr+vl)/2;
    
    angle = (angle + da*dt) % TAU;
    
    // change in position over time
    float dx = s*cos(-angle);
    float dy = s*sin(-angle);
    position.add(dx*dt,dy*dt,0);
    
    // keep the vehicle on-screen
    int m = 50;
    position.x = (position.x + 3*m +width) % (width + 2*m) -m;
    position.y = (position.y + 3*m +height) % (height + 2*m) -m;
  }
  
}
class Vehicle2b extends Thing {
  int F = 100;
  float left, right;
  
  Vehicle2b(String filename, int w, int l) {
    super(filename, w, l, random(width), random(height));    
    // eyes project from centre through front corners
    left = atan2(w,l);
    right = -left;
  }
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  void solve(PVector v) {
    // calculate angle to lamp
    float a = (TAU - angleBetweenPoints(position,v)) % TAU ;
    
    // cosine distance shifted into the range [0,1]
    float l = cos(a-angle-left)/2 +0.5;
    float r = cos(a-angle-right)/2 +0.5;
    
    // motor velocity proportional to input
    // vehicle 2b runs towards the light
    float vl = r*F, vr = l*F;
    
    // change in orientation over time
    float dt = 1.0/RATE;
    float da = (vr-vl)/(2*w);
    
    // overall velocity is average of the 2 wheels
    float s = (vr+vl)/2;
    
    angle = (angle + da*dt) % TAU;
    
    // change in position over time
    float dx = s*cos(-angle);
    float dy = s*sin(-angle);
    position.add(dx*dt,dy*dt,0);
  }
  
}

