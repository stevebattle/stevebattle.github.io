// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// https://archive.org/stream/DigitalHarmony_201611/Digital%20Harmony#mode/1up

var npoints = 24 ; // number of points in a display
var steps = 20 ; // step at the last frame
var side = 120 ;
var radius = 160 ;
var xcenter, ycenter ;
var startTime = 25;

function setup() {
  canvas = createCanvas(500,500) ;
  background(0) ;
  // draw is called at 24Hz
  frameRate(24) ;
  xcenter = width/2 ;
  ycenter = height/2 ;
  noFill();
}


// lissajous figure

function lissajous(a,b,t,delta,r,s) {
  // delta provides an offset to animate the lissajous
  var x = r * sin(a*t + delta) + xcenter ;    
  var y = 0.5*r * sin(b*t) + ycenter ; 
  // vertical bar
  strokeWeight(2);
  line(x,y+side/2,x,y-side/2) ;
}

function draw() {
  // lissajous parameters "figure of 8"
  a=1, b=2 ;

  // black background
  background(0) ;
  stroke('white') ;

  // step in overall cycle (1 = full cycle)
  var time = (frameCount-1) / steps +startTime;

  for (var p=1; p<=npoints; p++) {
    // t indicates position along lissajous
    var t = p / npoints * time ;    
    lissajous(a,b,t,0,radius,p/npoints*side) ;
  }
}
