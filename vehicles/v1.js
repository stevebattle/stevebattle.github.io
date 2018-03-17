 /*
   Braitenberg Vehicles simulation
 
   Copyright 2013 Steve Battle
 
   This work is licensed under a Creative Commons Attribution 3.0 Unported License.
   
   You may obtain a copy of the License at
 
       http://creativecommons.org/licenses/by/3.0
*/

var RATE = 25;
var V1WIDTH=30, VWIDTH=55, VLENGTH=85, VSIDE=50;

function preload() {
  bg_image = loadImage("data/bg800x800.jpg");
  src_image = loadImage("data/source.png");
  v1_image = loadImage("data/vehicle1.png");
}

function setup() {
  createCanvas(800,800);
  frameRate(RATE);
  // parent <div> in the html
  try { canvas.parent('sketch'); } catch(err) {}
  src = new Source(src_image,VSIDE,width/2,height/2);
  v = new Vehicle1(v1_image,V1WIDTH,VLENGTH);
}

function draw() {
  background(bg_image);
  src.draw();
  v.drawPath();
  v.draw();
  src.solve();
  v.solve(RATE,src.position);
  v.checkBorders();
}

function mouseClicked() {
  v.clearPath();
  v.setPosition(int(random(width)),int(random(height)));
  v.angle = radians(random(360));
}
