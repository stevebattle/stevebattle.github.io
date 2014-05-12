/* @pjs preload="sun.png, vehicle2b.png, bg.jpg" */

/*
   Braitenberg Vehicle 2b: Getting Around - crossover
 
   Copyright 2013 Steve Battle
 
   This work is licensed under a Creative Commons Attribution 3.0 Unported License.
   
   You may obtain a copy of the License at
 
       http://creativecommons.org/licenses/by/3.0
*/

/* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */

int RATE = 20, F=100;
int WIDTH = 50, LENGTH = 75;
float vr, vl;
float TAU = 2*PI;

PVector position, light;
float angle, left, right;
PImage bot, sun, bg;

void setup() {
  size(600,400);
  frameRate(RATE);
  imageMode(CENTER);
  sun = loadImage("sun.png");
  bot = loadImage("vehicle2b.png");

  position = new PVector(random(width),random(height));
  light = new PVector(width/2,height/2);
  
  // eyes project from centre through front corners
  left = atan2(WIDTH,LENGTH);
  right = -left;
  
  //bg = createImage(width, height, RGB);
  //backgroundPixels(bg);
  //bg.save("data/bg.jpg");
  bg = loadImage("bg.jpg");
}

float angleBetweenPoints(PVector a, PVector b) { 
  float dx = b.x - a.x; 
  float dy = b.y - a.y; 
  return atan2(dy, dx); 
}

void backgroundPixels(PImage img) {
  img.loadPixels();
  float dmax = sqrt(pow(img.width,2)+pow(img.height,2))/2;
  // pythagorean distance: sqrt(dx^2 + dy^2)
  for (int y=0; y<img.height; y++) {
    // dy^2 is constant for this row
    float dy2 = pow(y-light.y,2);
    for (int x=0; x<img.width; x++) {
      float dx2 = pow(x-light.x,2);
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

  image(sun,light.x,light.y,50,50);
  
  // calculate angle to lamp
  float a = (TAU - angleBetweenPoints(position,light)) % TAU ;
  float l = cos(a-angle-left)/2 +0.5;
  float r = cos(a-angle-right)/2 +0.5;
  
  // motor velocity proportional to input
  // vehicle 2b runs towards the light
  vl = r*F;
  vr = l*F;

  // change in orientation over time
  float dt = 1.0/RATE;
  float da = (vr-vl)/(2*WIDTH);
  angle = (angle + da*dt) % TAU;
  
  // overall velocity is average of the 2 wheels
  float s = (vr+vl)/2;
  
  // change in position over time
  float dx = s*cos(-angle);
  float dy = s*sin(-angle);
  position.add(dx*dt,dy*dt,0);
  
  translate(position.x,position.y);
  // rotate the coordinate frame in the opposite direction
  rotate(-angle);
  image(bot,0,0,LENGTH,WIDTH);
}

void mouseClicked() {
  position = new PVector(mouseX,mouseY);
}

