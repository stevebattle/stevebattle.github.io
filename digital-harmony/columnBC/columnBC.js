// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// https://archive.org/stream/DigitalHarmony_201611/Digital%20Harmony#page/n138/mode/1up
// PROGRAM COLUMNBC
// Figure (1) columns B & C - Differential points on a polar coordinate field
// Adapted from original source - copyright 5/25/80 by John Whitney - prepared by Paul Rother

var npoints = 60 ; // number of points in a display
var nframes = 9 ; // number of frames for this run
var stepstart = 0 ; // step at the first frame
var stepend = 1/60 ; // step at the last frame

var radius = 200 ; // radius
var xcenter, ycenter ;

function setup() {
  canvas = createCanvas(500,500) ;
  // draw is called at 10Hz
  frameRate(10) ;

  xcenter = width/2 ; // x center
  ycenter = height/2 ; // y center
}

function draw() {
  // black background
  background(0) ;
  fill('white') ;
  
  var time = (frameCount-1) / (nframes-1);
  
  // column B
  //time = 0 ; // row 1
  //time = 1/8 ; // row 2
  //time = 2/8 ; // row 3
  //time = 3/8 ; // row 4
  //time = 4/8 ; // row 5
  //time = 5/8 ; // row 6
  //time = 6/8 ; // row 7
  //time = 7/8 ; // row 8
  //time = 1 ; // row 9

  // step in overall cycle (1 = full cycle)
  var step = stepstart + (time * (stepend - stepstart)) ;
  
  // column C
  //step = 0 ; // row 1
  //step = 1/8 ; // row 2
  //step = 1/4 ; // row 3
  //step = 3/8 ; // row 4
  //step = 1/2 ; // row 5
  //step = 5/8 ; // row 6
  //step = 3/4 ; // row 7
  //step = 7/8 ; // row 8
  //step = 1; // row 9
  
  for (p=1; p<=npoints; p++) {
    var a = 360 * step * p ;
    // + = CCW rotation
    var x = xcenter + cos(radians(a)) * (p/npoints) * radius ;
    var y = ycenter + sin(radians(a)) * (p/npoints) * radius ;
    ellipse(round(x),round(y),5,5) ;
  }  
}
