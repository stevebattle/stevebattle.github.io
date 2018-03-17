 /*
   Braitenberg Vehicles simulation
 
   Copyright 2013 Steve Battle
 
   This work is licensed under a Creative Commons Attribution 3.0 Unported License.
   
   You may obtain a copy of the License at
 
       http://creativecommons.org/licenses/by/3.0
*/

var RATE = 25;
var V1WIDTH=30, VWIDTH=55, VLENGTH=85, VSIDE=50;
var OBSTACLES=10;

// obstacle dimension
var OSIDE = 60;
var obs_visible = false;

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
  canvas.parent('sketch');
  frameRate(RATE);
  src = new Source(src_image,VSIDE,width/2,height/2);
    
  // create obstacles
  obs = [];
  for (var i=0; i<OBSTACLES; i++) {
    obs[i] = new Obstacle(obs_image,OSIDE,random(width),random(height));
  }
  
  v = new Vehicle3a(v3a_image,VWIDTH,VLENGTH,RATE);
}

function draw() {
  background(bg_image);
  src.draw();
  
  // draw obstacles behind
  for (var i=0; obs_visible && i<OBSTACLES; i++) {
    obs[i].draw();
  }
  
  // draw vehicle
  v.drawPath();   
  v.draw();
  
  // movement
  src.solve();
  v.solve(RATE,src.position,obs);
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
    v = new Vehicle3a(v3a_image,VWIDTH,VLENGTH);
    obs_visible = false;
    break;
    case "3b": 
    v = new Vehicle3b(v3b_image,VWIDTH,VLENGTH);
    obs_visible = false;
    break;
    case "3c":
    v = new Vehicle3c(v3c_image,VWIDTH,VLENGTH);
    obs_visible = true;
  }
}
