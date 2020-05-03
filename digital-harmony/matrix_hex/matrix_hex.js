// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// https://archive.org/stream/DigitalHarmony_201611/Digital%20Harmony#mode/1up

var npoints = 24 ; // number of points in a display
var steps = 20 ; // step at the last frame
var side = 100 ;
var radius = 150 ;
var xcenter, ycenter ;

function setup() {
  canvas = createCanvas(500,500) ;
  background(0) ;
  // draw is called at 24Hz
  frameRate(24) ;
  xcenter = width/2 ;
  ycenter = height/2 ;
  noFill();
}

// source: https://processing.org/examples/regularpolygon.html

function polygon(x, y, radius, npoints) {
  var angle = TAU / npoints ;
  beginShape();
  for (var a = 0 ; a < TAU ; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// lissajous figure

function lissajous(a,b,t,delta,r,s) {
  // delta provides an offset to animate the lissajous
  var x = r * sin(a*t + delta) + xcenter ;    
  var y = r * sin(b*t) + ycenter ; 
  // hexagon
  polygon(x,y,s,6) ;
}

function draw() {
  // lissajous parameters "figure of 8"
  //a=2, b=1 ;
  a=3, b=2 ;

  // black background
  background(0) ;
  stroke('white') ;

  // step in overall cycle (1 = full cycle)
  var time = (frameCount-1) / steps + 30;
  
  for (var p=1; p<=npoints; p++) {
    // t indicates position along lissajous
    var t = p / npoints * time ;    
    lissajous(a,b,t,0,radius,p/npoints*side) ;
  }
}
