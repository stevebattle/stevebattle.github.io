/* @pjs preload="source.png, vehicle1.png, vehicle2a.png, vehicle2b.png, vehicle2c.png, bg800x800.jpg";
 */

/*
   Braitenberg Vehicles simulation
 
   Copyright 2013 Steve Battle
 
   This work is licensed under a Creative Commons Attribution 3.0 Unported License.
   
   You may obtain a copy of the License at
 
       http://creativecommons.org/licenses/by/3.0
*/

int RATE=25;
int VWIDTH=55, VLENGTH=85, VSIDE=50;

PImage bg;
Thing src;
Vehicle vehicle, v1, v2a, v2b, v2c, v6a, v6b;

void setup() {
  size(800,800);
  frameRate(RATE);
  imageMode(CENTER);
  
  // java alternative (generates image)
  //bg = createImage(width, height, RGB);
  //backgroundImage(bg,new PVector(width/2,height/2));
  //bg.save("data/bg800x800.jpg");
  
  // javascript alternative
  bg = loadImage("bg800x800.jpg");
  
  background(bg); 
  
  src = new Source("source.png",VSIDE,width/2,height/2);
  v1  = new Vehicle1("vehicle1.png",30,VLENGTH);
  v2a = new Vehicle2a("vehicle2a.png",VWIDTH,VLENGTH);
  v2b = new Vehicle2b("vehicle2b.png",VWIDTH,VLENGTH);
  v2c = new Vehicle2c("vehicle2c.png",VWIDTH,VLENGTH);
  v6a = new Vehicle6a("vehicle6.png",VWIDTH,VLENGTH);
  v6b = new Vehicle6b("vehicle6.png",VWIDTH,VLENGTH);
  //setVehicle(initialise);
  setVehicle("6b");
}

void setVehicle(String v) {
  PVector p=null;
  float a = radians(random(360));
  if (vehicle!=null) {
    p = vehicle.position;
    a = vehicle.angle;
  }
  if (v=="1") vehicle = v1;
  else if (v=="2a") vehicle = v2a;
  else if (v=="2b") vehicle = v2b;
  else if (v=="2c") vehicle = v2c;
  else if (v=="6a") vehicle = v6a;
  else if (v=="6b") vehicle = v6b;
  if (p!=null) {
    vehicle.position = p;
    vehicle.angle = a;
  }
}

void backgroundImage(PImage img, PVector v) {
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
  
  src.draw();
  src.solve(null);

  if (vehicle!=null) {
    vehicle.trace();
    vehicle.draw();
    vehicle.solve(src.position);
    vehicle.borders();
  }
}

void mouseClicked() {
  vehicle.event(mouseX,mouseY);
}
class Homeostat {
    
    // k: fraction of current sent to milliammeter (-1<=k<=+1)
    //    less frictional force, assumed proportional to velocity of y, per unit velocity (viscosity)
    // l: force on needle given by unit current in milliammeter coil 
    //    proportional to potential on grid per unit deviation of y
    //    less force of spring, or gravitation, tending to restore needle, per unit deviation
    // m: mass of needle & coil, or inertial equivalent
    // p,q : potentials at the ends of the trough
    // y: position of the needle
    
    int n;
    float h, j, p, q, y, z;
    boolean[] u;
    float[] a;
    // r: enable relay, t: trigger next step
    boolean r = true, t=false;
    
    // n is number of inputs including self
    
    public Homeostat(int n, float h, float j, float p, float q) {
        this.n = n;
        this.h = h;
        this.j = j;
        this.p = p;
        this.q = q;
        u = new boolean[n];
        for (int i=0; i<n; i++) {
          u[i] = true;
        }
        a = new float[n];      
    }

    
    // randomize weights subject to the uniselector

    void randomize(float min, float max) {
      for (int i=0; i<n; i++) {
        if (u[i]) {
          a[i] = random(max - min) +min;
        }
      }
    }
    
    // client should at least set the weight on the recurrent self-input
    // other weights may be set manually
    
    void setWeight(int i, float w) {
      a[i] = w;
      u[i] = false;
    }
    
    void unset(int i, float min, float max) {
      u[i] = true;
      a[i] = random(max - min) +min;
    }

    // reverse the commutator on input i
    void reverse(int i) {
      a[i] = -a[i];
      u[i] = false;
    }
    
    // set relay to false to 'short' the relay, preventing it from activating the uniselectors
    void setRelay(boolean relay) {
      r = relay;
    }
        
    void setTrigger(boolean trigger) {
      t = trigger;
    }
    
    // solve for y,z using Euler's method and return y
    
    float solve(float[] x, float dt) {
      float ax = 0;
      for (int i=0; i<n; i++) {
        ax += a[i]*x[i];
      }
      float dy = z, dz = h*ax - j*z;    
      y += dy*dt;
      z += dz*dt;
      
      // velocity becomes zero when the essential variable goes out of bounds
      y = saturation(y);
      return y;
    }
    
    float saturation(float y) {
      return min(p, max(q, y));
    }
    
    // check the inputs to the relay
    // if the needle setting y is outside the bounds [q,p] then the relay 
    boolean step() {
      if (t || (r && (y<=q || y>=p))) {
        t = false;
        for (int i=0; i<n; i++) {
          if (u[i]) {
            a[i] = random(p - q) +q; // [-1,+1]
          }
        }
        y = z = 0;
        return true;
      }
      else return false;
    }
    
  }

/*** light source ***/

class Source extends Thing {
  float F = 0.01;
  
  Source(String filename, int d, float x, float y) {
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
    angle = random(TAU);
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
  
  void trace() {
  }
  
  void solve(PVector v) {
  }
  
  void setPosition(int x, int y) {
    position = new PVector(x,y);
  }
  
  void addPosition(float x, float y) {
    position.add(x,y,0);
  }
  
  void setAngle(float a) {
    angle = a;
  }
  

  
}
class Vehicle extends Thing {
  int PATH_LENGTH=1000;
  int MARGIN = 50;

  int pathIndex;
  PVector[] path = new PVector[PATH_LENGTH];
  color pathColour = 0;
  
  Vehicle(String filename, int w, int l) {
    super(filename, w, l, random(width), random(height));    
  }
  
  void clearPath() {
    path = new PVector[PATH_LENGTH];
  }
  
  void setPathColour(color c) {
    pathColour = c;
  }
  
  void trace() {
    // add current position to path
    path[pathIndex] = new PVector(position.x,position.y);
    pathIndex = (pathIndex+1)%PATH_LENGTH;
    
    for (int i=0; i<PATH_LENGTH-1; i++) {     
      PVector p1 = path[(pathIndex+i)%PATH_LENGTH];
      stroke(pathColour); fill(pathColour);
      if (p1!=null) ellipse(p1.x,p1.y,2,2);
    }
  }
  
  void borders() {
    // keep the vehicle on-screen
    if (position.x+MARGIN<0 || position.x-MARGIN>width || position.y+MARGIN<0 || position.y-MARGIN>height) {
      clearPath();
      position.x = (position.x + 3*MARGIN +width) % (width + 2*MARGIN) -MARGIN;
      position.y = (position.y + 3*MARGIN +height) % (height + 2*MARGIN) -MARGIN;
    }
  }
  
  void event(int x, int y) {
    clearPath();
    setPosition(x,y);
  }

}
class Vehicle1 extends Vehicle {
  int F = 100, A=360;
  
  Vehicle1(String filename, int w, int l) {
    super(filename, w, l);    
  }
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  void solve(PVector src) {
    // calculate inverse distance from light source
    float d = (width/2)/distance(position,src);
    
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
    addPosition(dx*dt,dy*dt);
  }
  
}
class Vehicle2a extends Vehicle {
  int F = 600, DISPARITY = 45;
  float left, right;
  
  Vehicle2a(String filename, int w, int l) {
    super(filename, w, l);    
    left = radians(DISPARITY);
    right = -left;
  }
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  void solve(PVector src) {
    // calculate angle to light source
    float a = (TAU - angleBetweenPoints(position,src)) % TAU ;
    
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
    addPosition(dx*dt,dy*dt);
  }
  
}
class Vehicle2b extends Vehicle {
  int F = 300, DISPARITY = 45;
  float left, right;
  
  Vehicle2b(String filename, int w, int l) {
    super(filename, w, l);
    left = radians(DISPARITY);
    right = -left;
  }
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  void solve(PVector src) {
    // calculate angle to light source
    float a = (TAU - angleBetweenPoints(position,src)) % TAU ;
    
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
class Vehicle2c extends Vehicle {
  int F = 200, A = 360, DISPARITY = 45;
  float left, right;
  
  Vehicle2c(String filename, int w, int l) {
    super(filename, w, l);    
    left = radians(DISPARITY);
    right = -left;
  }
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  void solve(PVector src) {
    // calculate angle to light source
    float a = (TAU - angleBetweenPoints(position,src)) % TAU ;
    
    // cosine distance shifted into the range [0,1]
    float l = cos(a-angle-left)/2 +0.5;
    float r = cos(a-angle-right)/2 +0.5;
    
    // motor velocity proportional to input
    // vehicle 2b runs towards the light
    float vl = (l+r)*F, vr = (l+r)*F;
    
    // change in orientation over time
    float dt = 1.0/RATE;
    float da = (vr-vl)/(2*w);
    
    // add 'Brownian' motion
    da += radians(random(A)-A/2);
        
    // overall velocity is average of the 2 wheels
    float s = (vr+vl)/2;
    
    angle = (angle + da*dt) % TAU;
    
    // change in position over time
    float dx = s*cos(-angle);
    float dy = s*sin(-angle);
    addPosition(dx*dt,dy*dt);
  }
  
}
class Vehicle6a extends Vehicle {
  int F = 300;
  float G = 0.5;
  int MAX_TRIALS = 20, MAX_RESULTS = 100;
  float left, right;
  float INTERVAL = 1.0/3.0f; // check relays once every three seconds
  float dt = 1.0/RATE;
  int stable, trials, result;
  int[] results;
  
  // two homeostatic units: left motor, right motor
  // three parameters: left eye, right eye, inverse speed, proximity
  int N=4, P=3;
  Homeostat[] h = new Homeostat[N];
  float[] x, y; // unit output
  int COUNT = int(RATE/INTERVAL), count = COUNT;
  
  Vehicle6a(String filename, int w, int l) {
    super(filename, w, l);    
    // eyes project from centre through front corners
    left = radians(45);
    right = -left;
    
    // configure homeostat units N with additional input parameters P
    for (int i=0; i<N; i++) {
      h[i] = new Homeostat(N+P,1f,1f,1f,-1f);
      h[i].setWeight(i,-0.5f); // recurrent connection -1
      h[i].setWeight(N+2,1); // essential variable : distance
      h[i].randomize(-1f,1f); // randomize remaining weights
    }
    x = new float[N+P];
    y = new float[N+P];
    results = new int[MAX_RESULTS];
  }
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  void solve(PVector src) {
    // calculate angle to light source
    float a = (TAU - angleBetweenPoints(position,src)) % TAU ;
    
    // cosine distance
    float l = cos(a-angle-left);
    float r = cos(a-angle-right);
            
    // calculate distance from light source
    float ds = distance(position,src)/(width/2);
 
    x[N] = l;
    x[N+1] = r;
    x[N+2] = ds>1 ? 1 : 0;
       
    // solve for y
    for (int i=0; i<N; i++) {
      y[i] = h[i].solve(x,dt);
    }
    for (int i=0; i<N; i++) {
      x[i] = y[i];
    }
    
    // end of epoch: enable step function
    if (count-- == 0) {
      trials++;
      stable++;
      if (step()) {
        stable = 0;
        // reposition
        setPosition(int(random(width)),int(random(height)));
        setAngle(random(TAU));
        clearPath();
      }
      // euthenize the robot after being stable for MAX EPOCHS 
      if (stable>=MAX_TRIALS) {
        if (result<MAX_RESULTS) {
          results[result++] = trials - stable;
        }
        printResults();
        for (int i=0; i<N; i++) {
         h[i].setTrigger(true);
        }
        step();
        // ensure independence between trials
        setPosition(int(random(width)),int(random(height)));
        setAngle(random(TAU));
        trials = 0;
        stable=0;
        clearPath();
      }
      count = COUNT; // restart the count
    }
    
    // motor velocity
    float vl = F*x[0], vr = F*x[1];
    
    // change in orientation over time
    float dt = 1.0/RATE;
    float da = (vr-vl)/(2*w);
    
    // overall velocity is average of the 2 wheels
    float v = (vr+vl)/2;
        
    angle = (angle + da*dt) % TAU;
    
    // change in position over time
    float dx = v*cos(-angle);
    float dy = v*sin(-angle);
    position.add(dx*dt,dy*dt,0);
  }
  
  boolean step() {
      boolean s = false;
      for (int i=0; i<N; i++) {
         if (h[i].step()) {
           x[i] = 0;
           s = true;
         }
      }
      return s;
  }
  
  void event(int x, int y) {
     for (int i=0; i<N; i++) {
       h[i].setTrigger(true);
     }
     setPosition(x,y);
     angle = random(TAU);
     step();
  }
  
  void printResults() {
    println();
    print(result);
    println(" RESULTS:");
    for (int i=0; i<result; i++) {
      println(results[i]);
    }
  }
  
}
class Vehicle6b extends Vehicle {
  // javascipt scoping differs
  int RATE=25;

  int F = 300;
  float G = 0.5;
  int MAX_TRIALS = 20, MAX_RESULTS=100;
  boolean crossed = false;

  float left, right;
  float INTERVAL = 1.0/3.0f; // check relays once every three seconds
  float dt = 1.0f/RATE;
  int stable, trials, result;
  int[] results;
  
  // two homeostatic units: left motor, right motor
  // three parameters: left eye, right eye, distance

  int N=2, P=3;
  Homeostat[] h = new Homeostat[N];
  float[] x, y; // unit output
  int COUNT = int(RATE/INTERVAL), count = COUNT;
  
  Vehicle6b(String filename, int w, int l) {
    super(filename, w, l);    
    // eyes project forwards at 90 degrees from each other
    left = radians(45);
    right = -left;
    
    // configure homeostat units N with additional input parameters P
    for (int i=0; i<N; i++) {
      h[i] = new Homeostat(N+P,1f,1f,1f,-1f);
      h[i].setWeight(i,-0.5f); // recurrent connection
      h[i].setWeight(N+2,1); // essential variable
      h[i].randomize(-1f,1f); // randomize remaining weights      
    }
    // sever links between units
    h[0].setWeight(1,0);
    h[1].setWeight(0,0);
    
    x = new float[N+P];
    y = new float[N+P];
    results = new int[MAX_RESULTS];
  }
  
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  void solve(PVector src) {
    // calculate angle to light source
    float a = (TAU - angleBetweenPoints(position,src)) % TAU ;
    
    // cosine distance
    float l = cos(a-angle-left);
    float r = cos(a-angle-right);
        
    // calculate distance from light source
    float ds = distance(position,src)/(width/2);
 
    if (crossed) {
      x[N] = r;
      x[N+1] = l;
    }
    else {
      x[N] = l;
      x[N+1] = r;
    }
    x[N+2] = ds>1 ? 1 : 0;
           
    // solve for y
    for (int i=0; i<N; i++) {      
      y[i] = h[i].solve(x,dt);
    }
    for (int i=0; i<N; i++) {
      x[i] = y[i];
    }
        
    // step function at end of trial
    if (count-- == 0) {
      trials++;
      stable++;
      if (step()) {
        stable = 0;
        setPathColour(crossed?color(255,0,0):0);

        // reposition if too far out
        if (ds>1) {
          setPosition(int(random(width)),int(random(height)));
          setAngle(random(TAU));
        }
        clearPath();
      } 
 
      // euthenize the robot after being stable for MAX TRIALS 
      if (stable>=MAX_TRIALS) {
        setPathColour(color(0,255,0));
//        if (result<MAX_RESULTS) {
//          results[result++] = trials - stable;
//        }
//        printResults();
//        for (int i=0; i<N; i++) {
//         h[i].setTrigger(true);
//        }
//        step();
//        // ensure independence between trials
//        setPosition(int(random(width)),int(random(height)));
//        setAngle(random(TAU));
//        trials = 0;
//        stable=0;
//        clearPath();
      } 
      count = COUNT; // restart the count
    }
  
    // motor velocity
    float vl = F*x[0], vr = F*x[1];
    
    float da = (vr-vl)/(2*w);
    
    // overall velocity is average of the 2 wheels
    float v = (vr+vl)/2;
    
    angle = (angle + da*dt) % TAU;
    
    // change in position over time
    float dx = v*cos(-angle);
    float dy = v*sin(-angle);
    addPosition(dx*dt,dy*dt);
  }
  
  boolean step() {
      boolean s = false;
      for (int i=0; i<N; i++) {
         if (h[i].step()) {
           x[i] = 0;
           s = true;
         }
      }
      return s;
  }
   
  void event(int x, int y) {
     crossed = !crossed;
     if (crossed) setPathColour(color(255,0,0));
     else setPathColour(0);
     stable=0;
  }
     
  void printResults() {
    println();
    print(result);
    println(" RESULTS:");
    for (int i=0; i<result; i++) {
      println(results[i]);
    }
  }
    
}

