/**
 * Blitzen
 * 
 * by Steve Battle
 *
 * A simple animated game (c) 2016
 *
 */

const BORDER = 12; // width/height of the border
const GROUND = 4; // height of ground in pixels
const CLEARANCE = 5; // clearance below the plane
const GAP = 2; // gap between buildings
const SPACE = 100; // space before first building
const STEP = 5; // pixels traversed in one step
const FONT_SIZE = 36;
const BONUS = 10;
const SPACEBAR = 32;

var SKY_COLOUR, GROUND_COLOUR, TEXT_COLOUR;

var sleigh, forest, prezzie, font, block;
var level = 0, score = 0, best = 0;
var images = [];

try {
  if (localStorage.getItem('BlitzenBest')!=null) {
    best = parseInt(localStorage.getItem('BlitzenBest'));
  }
} catch (error) {}

function preload() {
  
  // load font
  font = loadFont("data/CHECKBK0.TTF");
  
  // load images
  // sleigh
  images[0] = loadImage("data/santa0.gif");
  images[1] = loadImage("data/santa1.gif");
  images[2] = loadImage("data/santa2.gif");
  images[3] = loadImage("data/santa3.gif");
  
  // forest
  images[4] = loadImage("data/trunk.gif");
  images[5] = loadImage("data/treetop.gif");
  images[6] = loadImage("data/felled.gif");
  
  // prezzie
  images[7] = loadImage("data/prezzie.gif");
  
  // load sounds
  trill = loadSound('data/trill.wav');
  boing = loadSound('data/boing.wav');
  crash = loadSound('data/crash.wav');
  explosion = loadSound('data/explosion.wav');
  jingle = loadSound('data/jingle.wav');
  hohoho = loadSound('data/hohoho.wav');
}

function drawGround() {
  fill(GROUND_COLOUR);
  stroke(GROUND_COLOUR);
  rect(BORDER, height -BORDER -GROUND, width - 2*BORDER, GROUND);
}

function drawScore() {
  fill(TEXT_COLOUR);
  textSize(FONT_SIZE);
  text("SCORE "+score,BORDER,BORDER+36);
}

function drawBest() {
  fill(TEXT_COLOUR);
  textSize(FONT_SIZE);
  text("BEST "+best,width/2,BORDER+36);
}

function setup() {
  block = images[4];
  
  // create a 'jingle bell' sound loop, but don't play automatically
  try { 
    jingle.loop();
    jingle.stop(); 
  } catch (error) {}

  SKY_COLOUR = color(0,0,255); // dark skies
  GROUND_COLOUR = color(255,255,255); // snow white
  TEXT_COLOUR = color(255,0,0); // blue

  createCanvas(450,300).position(50,50);
  textFont(font);
  
  startGame();
}

function startGame() {
  frameRate(30);

  // calculate maximum city height
  var forestHeight = height -2*BORDER -GROUND -images[0].height -CLEARANCE;
  
  sleigh = new Sleigh(images.slice(0,4), forestHeight);
  forest = new Forest(images.slice(4,7), forestHeight, level++);
  prezzie = new Prezzie(images[7]);  
}

function draw() {
  background(SKY_COLOUR);
  drawGround();
  drawScore();
  drawBest();
  forest.draw();
  prezzie.draw();
  prezzie.step();
  sleigh.draw();
  if (!sleigh.landed) sleigh.step();
  else startGame();
  
  if ((mouseIsPressed || touchIsDown || keyIsPressed) && !prezzie.falling) {
    if (sleigh.crashed) {
      level = score = 0;
      startGame();
    }
    else if (forest.count>0) sleigh.drop(prezzie);
  }
  if (score>best) best = score;
}
