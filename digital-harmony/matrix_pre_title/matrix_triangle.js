// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// https://archive.org/stream/DigitalHarmony_201611/Digital%20Harmony#page/n52/mode/1up
// Adapted from John Whitney

var npoints = 31 ; // number of points in a display
var nframes = 1000 ; // number of frames for this run
var stepstart = 0 ; // step at the first frame
var stepend = 1/60 ; // step at the last frame

var radius = 180 ; // radius
var xcenter, ycenter ;

function setup() {
  canvas = createCanvas(500,500) ;
  background(0) ;
  // draw is called at 10Hz
  frameRate(24) ;

  xcenter = width/2 ; // x center
  ycenter = height/2; // y center
}

function draw() {
  // black background
  background(0) ;
  noFill() ;
  translate (xcenter, ycenter) ;
  rotate(-PI/2);
  
  // continuous cycle for column E
  var time = (frameCount-1) / (nframes-1);

  // step in overall cycle (1 = full cycle)
  step = stepstart + (time * (stepend - stepstart)) ;
  
  for (p=1; p<=npoints; p++) {
    var a ;
    var cr;
    if (p%2==0) { // even (clockwise)
      a = TAU * step * p ;
      stroke('white') ;
      cr = p/npoints * radius ; // circumradius
    }
    else { // odd (counter-clockwise)
      // + = CCW rotation
      a = -TAU * step * p ;
      stroke('red') ;
      cr = (p-1)/npoints * radius*cos(time) ; // circumradius
    }
    
    // aligned with circumradius
    var s = 3 * cr / sqrt(3) ; // side
    var ir = cr / 2; // inradius
    triangle(ir,s/2,ir,-s/2,-cr,0) ;
  }  
}
