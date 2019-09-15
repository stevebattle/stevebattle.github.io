// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// https://archive.org/stream/DigitalHarmony_201611/Digital%20Harmony#page/n52/mode/1up
// Figure (1) columns D & E - Differential triangles on a polar coordinate field
// Adapted from John Whitney

var npoints = 24 ; // number of points in a display
var nframes = 9 ; // number of frames for this run
var stepstart = 0 ; // step at the first frame
var stepend = 1/60 ; // step at the last frame

var radius = 100 ; // radius
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
  stroke('white') ;
  noFill() ;
  translate (xcenter, ycenter) ;
  rotate(radians(-90));
  
  // continuous cycle for column E
  var time = (frameCount-1) / (nframes-1);

  // step in overall cycle (1 = full cycle)
  step = stepstart + (time * (stepend - stepstart)) ;
  
  // column E
  //step = 0 ;
  //step = 1/8 ;
  //step = 1/4 ;
  //step = 3/8 ;
  //step = 1/2 ;
  //step = 5/8 ;
  //step = 3/4 ;
  //step = 7/8 ;
  //step = 1;
  
  for (p=1; p<=npoints; p++) {
    var a = 360 * step * p ;
    // + = CCW rotation
    var x = cos(radians(a)) * radius ;
    var y = sin(radians(a)) * radius ;
    
    // aligned with circumradius
    push() ;
    translate(round(x),round(y)) ; // triangle centre
    var cr = p/npoints * radius ; // circumradius
    var s = 3 * cr / sqrt(3) ; // side
    var ir = cr / 2; // inradius
    triangle(ir,s/2,ir,-s/2,-cr,0) ;
    pop() ;
  }  
}
