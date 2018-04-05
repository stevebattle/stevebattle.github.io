 /*
   Interactive ELSIE
 
   Copyright 2018 Steve Battle
 
   This work is licensed under a Creative Commons Attribution 3.0 Unported License.
   
   You may obtain a copy of the License at
 
       http://creativecommons.org/licenses/by/3.0
*/

var RATE = 30;
// 1751 × 1246 image
var V1WIDTH=30, VLENGTH=85, VWIDTH=(1246/1751.0)*VLENGTH, VSIDE=50;

// obstacle dimension
var OSIDE = 60;
var obs_visible = true;
var lastX, lastY;

function preload() {
  bg_image = loadImage("data/bg800x800.jpg");
  src_image = loadImage("data/source.png");
  obs_image = loadImage("data/obstacle.png");
  elsie_image = loadImage("data/elsie.png");
}

function setup() {
  var canvas = createCanvas(800,800);
  frameRate(RATE);
  // parent <div> in the html
  try { canvas.parent('sketch'); } catch(err) {}
  src = new Source(src_image,VSIDE,width/2,height/2);
      
  // create obstacles array
  obs = [];
  v = new ELSIE(elsie_image,VWIDTH,VLENGTH);
}

function draw() {
  strokeWeight(1);
  background(bg_image);
  src.draw();
    
  // draw obstacles behind
  for (var i=0; obs_visible && i<obs.length; i++) {
    obs[i].draw();
  }
  
  v.drawPath();
  v.draw();
  src.solve();
  v.solve(RATE,src,obs);
  //v.checkBorders();
}

function mouseClicked() {
  if (mouseX==lastX && mouseY==lastY) return false;
  lastX = mouseX; lastY = mouseY;

  // delete existing obstacle?
  for (var i=0; i<obs.length; i++) {
    if (obs[i].encloses(mouseX,mouseY)) {
      obs.splice(i,1);
      return false;
    }
  }
  // otherwise create new obstacle
  obs[obs.length] = new Obstacle(obs_image,OSIDE,mouseX,mouseY);
  return false;
}

function touchEnded() {
  if (mouseX==lastX && mouseY==lastY) return false;
  lastX = mouseX; lastY = mouseY;

  // delete existing obstacle?
  for (var i=0; i<obs.length; i++) {
    if (obs[i].encloses(mouseX,mouseY)) {
      obs.splice(i,1);
      return false;
    }
  }
  // otherwise create new obstacle
  obs[obs.length] = new Obstacle(obs_image,OSIDE,mouseX,mouseY);
  return false; 
}