var RATE = 2;
var BASE = 60;
var SPEED = 10;
var length = BASE/2;
var angle = 0;
var img;
var position = new p5.Vector(720/2,116);

/* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
// vl,vr = velocity of left/right wheels, b = wheelbase

function solve(vl, vr, b) {
  // change over time
  var dt = 1.0/RATE;
  
  // change in orientation over time
  var da = (vr - vl)/b;
  
  // average wheel speed is forward velocity
  var v = (vr + vl)/2;
  
  // change in position over time
  var dx = v * cos(-angle);
  var dy = v * sin(-angle);
  
  addPosition(dx*dt, dy*dt);
  addOrientation(da*dt);
}

function addPosition(x, y) {
  position.add(x,y,0);
}

function addOrientation(a) {
  angle = (angle + a) % TAU;
}

function preload() {
  img = loadImage("images/1basic_720.png");
}

function setup() {
  createCanvas(720,712);
}

function draw() {
  image(img,0,0);
  
  // calculate sensor position
  var p = position.copy();
  var q = p5.Vector.fromAngle(-angle).mult(length);
  p.add(q);
  
  var t = red(img.get(round(p.x),round(p.y)))==0;

  // draw robot
  ellipse(position.x,position.y,BASE,BASE);
  stroke(1);
  line(position.x,position.y,p.x,p.y);
  
  // move robot
  if (t) solve(0,SPEED,BASE);
  else solve(SPEED,0,BASE);
  fill(255); stroke(0);  
}