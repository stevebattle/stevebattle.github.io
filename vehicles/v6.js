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
  v6_image = loadImage("data/vehicle6.png");
}

function setup() {
  var canvas = createCanvas(800,800);
  // parent <div> in the html
  try { canvas.parent('sketch'); } catch(err) {}
  frameRate(RATE);
  src = new Source(src_image,VSIDE,width/2,height/2);  
  v = new Vehicle6(v6_image,VWIDTH,VLENGTH,RATE);
}

function draw() {
  background(bg_image);
  src.draw();
  
  // draw vehicle
  v.drawPath();   
  v.draw();
  
  // movement
  src.solve();
  v.solve(RATE,src.position);
  v.checkBorders();
}

function mouseClicked() {
  v.reset();
}
