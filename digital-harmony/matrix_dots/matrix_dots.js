// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274

var npoints = 24 ; // number of points in a display
var steps = 100 ; // step at the last frame
var stepend = 1/2 ;
var side = 90 ;
var radius = 120 ;
var xcenter, ycenter ;

function setup() {
  canvas = createCanvas(500,500) ;
  // draw is called at 20Hz
  frameRate(24) ;
  xcenter = width/2 ;
  ycenter = height/2 ;
  rectMode(CENTER);
  //noFill();
}

// 3D lissajous

function lissajous(a,b,t,delta,r) {
  // add PI to bring the initial state to the front
  // delta provides an offset to animate the lissajous
  var x = r * sin(a*t + delta +PI) + xcenter ;    
  var y = r * sin(b*t +PI) + ycenter ;
  //var z = sin((t+delta+PI)/2) ;
  
  //push() ;
  //translate(x,y) ;
  //rotate(t) ;
  // z determines size of square (false perspective)
  //rect(0,0,side*z,side*z) ;
  circle(x,y,10) ;
  //pop() ;
}

function draw() {
  // lissajous parameters
  a=3, b=2 ;

  // black background
  background(0) ;
  stroke('white') ;

  // step in overall cycle (1 = full cycle)
  var time = (frameCount-1) / steps ;
  
  // step in overall cycle (1 = full cycle)
  step = time * stepend ;
  delta = 0 ;
  
  for (var p=1; p<=npoints; p++) {
    // t indicates position [0,1] along lissajous
    var t = p / npoints * TAU * step;    
    lissajous(a,b,t,delta,radius) ;
  }
}
