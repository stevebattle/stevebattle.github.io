// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// https://archive.org/stream/DigitalHarmony_201611/Digital%20Harmony#page/n139/mode/1up
// PROGRAM ARABSEQUE
// Figure (13)
// Adapted from original source - copyright 5/25/80 by John Whitney - prepared by Paul Rother

var npoints = 60 ; // number of points in a display
var nframes = 9 ; // number of frames for this run
var stepstart = 0 ; // step at the first frame
var stepend = 1/60 ; // step at the last frame

var radius = 60 ; // radius
var xcenter, ycenter ;

function setup() {
  canvas = createCanvas(500,500) ;
  // draw is called at 10Hz
  frameRate(10) ;
  angleMode(DEGREES) ;

  xcenter = width/2 ; // x center
  ycenter = height/2 ; // y center
}

function draw() {
  // black background
  background(0) ;
  
  // invert y axis
  scale(1,-1) ;
  translate(0,-height) ;
  
  // cycle after nframes for column D
  var time = (frameCount-1)%nframes / (nframes-1);
  
  // continuous version column C
  // time = (frameCount-1) / (nframes-1);

  // step in overall cycle (1 = full cycle)
  var step = stepstart + (time * (stepend - stepstart)) ;
  
  for (var p=1; p<=npoints; p++) {
    var a = -90 + 360 * p / npoints ;
    
    var r = 3 * radius ;
    var x = cos(a) * radius + p * step * r ;
    x = xcenter - (r/2) + ( round(x+(r/2)) % round(r) ) ;
    
    var y = ycenter + sin(a) * radius ;
    
    fill('white') ;
    ellipse(round(x),round(y),5,5) ;
  }    
}
