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
  obs_image = loadImage("data/obstacle.png");
  v3a_image = loadImage("data/vehicle3a.png");
  v3b_image = loadImage("data/vehicle3b.png");
  v3c_image = loadImage("data/vehicle3c.png");
}

function setup() {
  var canvas = createCanvas(800,800);
  // parent <div> in the html
  // canvas.parent('sketch');
  frameRate(RATE);
  src = new Source(src_image,VSIDE,width/2,height/2);
  v = new Vehicle3a(v3a_image,VWIDTH,VLENGTH,RATE);
}

function draw() {
  background(bg_image);
  src.draw();
  v.drawPath();
  v.draw();
  src.solve();
  v.solve(src.position);
  v.checkBorders();
}

function mouseClicked() {
  v.clearPath();
  v.setPosition(int(random(width)),int(random(height)));
  v.angle = radians(random(360));
}

function startVehicle(id) {
  switch (id) {
    case "3a": 
    v = new Vehicle3a(v3a_image,VWIDTH,VLENGTH,RATE);
    break;
    case "3b": 
    v = new Vehicle3b(v3b_image,VWIDTH,VLENGTH,RATE);
    break;
    case "3c":
    v = new Vehicle3c(v3c_image,obs_image,VWIDTH,VLENGTH,RATE);
  }
}
