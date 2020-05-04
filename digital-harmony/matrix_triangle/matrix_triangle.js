// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// https://archive.org/stream/DigitalHarmony_201611/Digital%20Harmony#page/n52/mode/1up
// Figure (6) from Matrix III p75
// Adapted from John Whitney

var npoints = 32 ; // number of points in a display
var rate = 20 ; // draw is called at 20Hz
var nframes = 40 ; // number of frames for this run
var stepRate = 1/150 ; // step at the last frame

var radius = 100 ; // radius
var xcenter, ycenter ;

function setup() {
  canvas = createCanvas(500,500) ;
  background(0) ;
  frameRate(rate) ;
  xcenter = width/2 ; // x center
  ycenter = height/2 ; // y center
}

function draw() {
  // black background
  background(0) ;
  noFill() ;
  translate (xcenter, ycenter) ;
  rotate(-PI/2);
  
  var time = frameCount / rate;

  // step in overall cycle
  step = time * stepRate ;
  
  for (p=1; p<=npoints; p++) {
    var a ;
    if (p%2==0) { // even (clockwise)
      a = TAU * step * p +PI/2 ;
      stroke('red') ;
    }
    else { // odd (counter-clockwise)
      // + = CCW rotation
      a = -TAU * step * p -PI/2 ;
      stroke('white') ;
    }
    
    var x = cos(a) * radius ;
    var y = sin(a) * radius ;
    
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
