/**
 * Blitz Resurrection
 * 
 * by Steve Battle
 *
 * A simple animated game.
 *
 */

/* @pjs preload="block.gif,plane0.gif,plane1.gif,plane2.gif,plane3.gif,bomb.gif"; font="CHECKBK0.TTF"; */

color SKY_COLOUR = color(135,206,255); // sky blue 1
color GROUND_COLOUR = color(124,242,0); // lawn green
color TEXT_COLOUR = color(74,112,139); // sky blue 4
int BORDER = 12; // width/height of the border
int GROUND = 4; // height of ground in pixels
int CLEARANCE = 5; // clearance below the plane
int GAP = 2; // gap between buildings
int SPACE = 100; // space before first building
int STEP = 5; // pixels traversed in one step
int FONT_SIZE = 36;
int BONUS = 10;

Plane plane;
City city;
Bomb bomb;
PFont font;

int level = 0;
int score = 0, best = 0;

void drawGround() {
  fill(GROUND_COLOUR);
  stroke(GROUND_COLOUR);
  rect(BORDER, height -BORDER -GROUND, width -2*BORDER, GROUND);
}

void drawScore() {
  fill(TEXT_COLOUR);
  textSize(FONT_SIZE);
  text("SCORE "+score,BORDER,BORDER+36);
}

void drawBest() {
  fill(TEXT_COLOUR);
  textSize(FONT_SIZE);
  text("BEST "+best,width/2,BORDER+36);
}

void setup() {
  size(450,300);
  //font = loadFont("Checkbook-48.vlw");
  font = createFont("CHECKBK0.TTF",36);
  textFont(font);
  plane = new Plane();
  city = new City();
  bomb = new Bomb();
  startGame();
}
  
void startGame() {
  frameRate(30);

  // calculate maximum city height
  int cityHeight = height -2*BORDER -GROUND -plane.images[0].height -CLEARANCE;
  city.initialise(cityHeight, level++);  
  plane.initialise(cityHeight);
}

void draw() {
  background(SKY_COLOUR);
  drawGround();
  drawScore();
  drawBest();
  city.draw();
  bomb.draw();
  bomb.step();
  plane.draw();
  if (!plane.landed) plane.step();
  else startGame();
  
  if (mousePressed && !bomb.falling) {
    if (plane.crashed) {
      level = score = 0;
      startGame();
    }
    else if (city.count>0) plane.drop(bomb);
  }
  if (score>best) best = score;
}
class Bomb {
  int FUSE = 5; // bomb can destroy this many floors
  
  PImage bombImage;
  boolean falling = false;
  int building;
  int x,y;
  int minimum;
  
  Bomb() {
    bombImage = loadImage("bomb.gif");
  }
  
  void drop(int x, int y) {
    building = city.getBuilding(x);
    this.x = building<0 ? x : city.getBuildingCentre(building);
    this.y = y;
    falling = true;
    minimum = max(0,building>=0?city.floors[building]-FUSE:0);
  }
  
  void draw() {
    if (falling) {
      image(bombImage,x-bombImage.width/2,y-bombImage.height/2);
    }
  }
  
  int altitude() {
    return int((height -BORDER -GROUND -y)/city.block.height);
  }
  
  void step() {
    if (falling) {
      y += STEP;
      int a = altitude();
      if (building>=0) city.bomb(building,a);
      if (a<=minimum) falling = false;
    }
  }
}

class City {
  float DEVIATION = 0.25;
  float BIAS = 0.5;
  
  PImage block;
  PImage[] images = new PImage[2];
  int buildings, margin, maxFloors;
  int[] floors, tops;
  int built;
  int count;
  
  City() {
    block = loadImage("block.gif");
    images[0] = loadImage("roof.gif");
    images[1] = loadImage("razed.gif");
  }
  
  void initialise(int cityHeight, int level) {
    maxFloors = int(cityHeight/block.height);
    println(maxFloors);
    buildings = (width -SPACE)/(block.width+GAP);
    margin = (width -buildings*(block.width+GAP) +GAP) /2;
    floors = new int[buildings];
    tops = new int[buildings];
    float scale = maxFloors + 2*level; // add two floors per additional level
    count=0;
    for (int i=0; i<buildings; i++) {
      // float r = randomGaussian()*DEVIATION +BIAS;
      float r = randomNormal()*DEVIATION +BIAS;
      floors[i] = max(min(int(r*scale), maxFloors),0);
      count += floors[i];
      tops[i] = 0; // topped by a roof
    }
    built=0;
  }
  
  
float randomNormal() { 
  float x = 1.0, y = 1.0,  
  s = 2.0; // s = x^2 + y^2 
  while(s >= 1.0) { 
    x = random(-1.0f, 1.0f); 
    y = random(-1.0f, 1.0f); 
    s = x*x + y*y; 
  } 
  return x * sqrt(-2.0f * log(s)/s); 
} 

  
  void draw() {
    for (int i=0; i<buildings; i++) {
      int x = i*(block.width+GAP) +margin;
      int f = min(floors[i],built);
      for (int j=1; j<f; j++) {
        image(block,x,height -BORDER -GROUND -j*block.height);
      }
      // top it off
      if (f>0 && tops[i]>=0) {
        image(images[tops[i]],x,height -BORDER -GROUND -(f-1)*block.height -images[tops[i]].height);
      }
    }
    if (built<maxFloors) built++;
  }
  
  int getBuilding(int x) {
    if (x<margin) return -1;
    int i = int(map(x,margin,margin+buildings*(block.width+GAP),0,buildings));
    return i<buildings ? i : -1;
  }
  
  int getBuildingHeight(int i) {
    return floors[i];
  }
  
  int getBuildingCentre(int i) {
    return i*(block.width+GAP) +margin +city.block.width/2;
  }
  
  void crash(int i) {
    tops[i] = -1;
  }
  
  void bomb(int i, int altitude) {
    if (floors[i]-1>=altitude) {
      int points = floors[i] - max(0,altitude);
      score += points;
      count -= points;
      floors[i] -= points;
      tops[i] = 1;
    }
  }
  
}
class Plane {
  int BOUNCE = 7;
  
  int state;
  PImage[] images = new PImage[4];
  int altitude; // height in floors
  int x,y,y1,t;
  int building;
  boolean landed, crashed;
 
  Plane() {
    images[0] = loadImage("plane0.gif");
    images[1] = loadImage("plane1.gif");
    images[2] = loadImage("plane2.gif");
    images[3] = loadImage("plane3.gif");
  }
  
  void initialise(int cityHeight) {
    state = 0;
    altitude = int(cityHeight/city.block.height)+1;
    x = -images[0].width;
    y = height -BORDER -GROUND -altitude*city.block.height -CLEARANCE -images[0].height;
    y1 = t = 0;
    landed = crashed = false;
  }
  
  void draw() {
    image(images[state],x,y+y1);
  }
  
  void drop(Bomb bomb) {
    bomb.drop(x+images[0].width/2, y+images[0].height/2);
  }
  
  void step() {
    switch (state) {
      case 0: // flying
      x += STEP;
      if (x > width +plane.images[0].width) { 
          // move the plane to the start of the next layer
          x = -plane.images[0].width;
          if (city.count>0) {
            y += city.block.height;
            altitude -= 1;
          }
      }
      building = city.getBuilding(x+plane.images[0].width);
      if (building>=0 && city.getBuildingHeight(building)>altitude) {
        state++; // crash
        frameRate(10); // slo-mo
        x = city.getBuildingCentre(building) +city.block.width/2 -images[state].width;
        y += CLEARANCE +images[state-1].height -images[state].height;
        city.crash(building);
      }
      if (city.count==0) { // safe to land
        if (y+images[0].height<height-BORDER-GROUND) {
          y++; // descent
          if (y%city.block.height==0) score += BONUS;
        }
        else if (y+images[0].height==height-BORDER-GROUND) { // bounce
          frameRate(20); // slo-mo
          y1 = min(0,-BOUNCE*t + t*t++);
          landed = x-STEP>width;
        }
      }
      break;
      
      case 1: // crashing
      state++;
      x = city.getBuildingCentre(building) +city.block.width/2 -images[state].width;
      y += images[state-1].height -images[state].height;
      break;
      
      case 2: // crashed
      state++;
      y += images[state-1].height -images[state].height;
      crashed = true;
      break;
    }
  }
  
}

