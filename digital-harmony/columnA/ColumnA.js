// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// https://archive.org/stream/DigitalHarmony_201611/Digital%20Harmony#page/n137/mode/1up
// PROGRAM COLUMNA
// Figure (1) column A - Differential points on a straight line modulus
// Adapted from original source - copyright 5/25/80 by John Whitney - prepared by Paul Rother

var npoints = 60 ; // number of points in a display
var nframes = 9 ; // number of frames for this run
var stepstart = 0 ; // step at the first frame
var stepend = 1/60 ; // step at the last frame

var length = 400 ; // length
var xleft = 50 ; // x left
var ybottom = 50 ; // y bottom
  
function setup() {
  canvas = createCanvas(500,500) ;
  // draw is called at 10Hz
  frameRate(10) ;
}

function draw() {
  // black background
  background(0) ;
  
  // invert y axis
  scale(1,-1) ;
  translate(0,-height) ;
  
  // cycle after nframes as in column A
  // var time = (frameCount-1)%nframes / (nframes-1) ;
  
  // continuous version
  var time = (frameCount-1) / (nframes-1) ;
  
  // step in overall cycle (1 = full cycle)
  var step = stepstart + (time * (stepend - stepstart)) ;
  
  for (p=1; p<=npoints; p++) {
    var x = xleft + length * p/npoints ;
    var y = length * p * step ;
    // modulo function within field
    y =  ybottom + (round(y) % round(length)) ;
    
    fill('white') ;
    ellipse(round(x),round(y),5,5) ;
  }
}
