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
var obs_visible = true;

function preload() {
  bg_image = loadImage("data/bg800x800.jpg");
  src_image = loadImage("data/source.png");
  obs_image = loadImage("data/obstacle.png");
  v5a_image = loadImage("data/vehicle5a.png");
  v5b_image = loadImage("data/vehicle5b.png");
  v5c_image = loadImage("data/vehicle5c.png");
}

function setup() {
  var canvas = createCanvas(800,800);
  // parent <div> in the html
  try { canvas.parent('sketch'); } catch(err) {}
  frameRate(RATE);
  src = new Source(src_image,VSIDE,width/2,height/2);
    
  // create obstacles
  obs = [];
  for (var i=0; i<OBSTACLES; i++) {
    obs[i] = new Obstacle(obs_image,OSIDE,random(width),random(height));
  }
  
  v = new Vehicle5a(v5a_image,VWIDTH,VLENGTH,RATE);
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
  
  // create obstacles
  obs = [];
  for (var i=0; i<OBSTACLES; i++) {
    obs[i] = new Obstacle(obs_image,OSIDE,random(width),random(height));
  }
}

function startVehicle(id) {
  switch (id) {
    case "5a": 
    v = new Vehicle5a(v5a_image,VWIDTH,VLENGTH);
    break;
    case "5b": 
    v = new Vehicle5b(v5b_image,VWIDTH,VLENGTH);
    break;
    case "5c": 
    v = new Vehicle5c(v5c_image,VWIDTH,VLENGTH);
  }
}
