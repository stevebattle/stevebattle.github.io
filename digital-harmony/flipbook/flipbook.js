// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// Figure 5, pages 70-71

// Rose curves:
// https://en.wikipedia.org/wiki/Rose_(mathematics)

var npoints = 991 ; // number of points in a display
var steps = 100 ; // steps before switching to next pattern
var radius = 200 ; // radius
var xcenter, ycenter ;
var RD=1, TD=1 ;
var SLOPE = 25 ;
// figure 5 transitions from one integer rose to another.
var INTERVAL = 1 ;
var RDSTEP=0 ;
var TDSTEP=0 ;
var OFFSET=0; // angular offset to invert figure

// sigmoid function with slope f. eg. sigmoid(0, F) = 0.5
   
function sigmoid(x, f) {
  return 1/(1+exp(-f*x)) ;
}

function setup() {
  canvas = createCanvas(500,500) ;
  // draw is called at 10Hz
  frameRate(20) ;

  xcenter = width/2 ; // x center
  ycenter = height/2 ; // y center
}

function draw() {    
  // black background
  background(0) ;
  stroke('white') ;
  textSize(20) ;
  fill(255) ;

  var time = (frameCount-1) / steps ;
  
  // default angular offset to stabilise rotation
  var a = 0 ;
  
  // col 1 (add PI to offset to invert figure)
  //rd = 1 ; td = 0 ; TDSTEP=-2 ; a=PI ;
  
  // col 2
  //rd = 1 ; td = 0 ; TDSTEP=-1 ; a=PI ;
    
  // col 3
  //rd = 1 ; td = 2; RDSTEP=2 ; TDSTEP=-2 ; a=PI ;
  
  // col 4
  //rd = 1 ; td = 1 ; TDSTEP=1 ; a=PI ;
  
  // col 5
  //rd = 2 ; td = 1 ; TDSTEP=-1 ;
  
  // col 6
  //rd = 3 ; td = 0 ; TDSTEP=2 ;

  // col 7 RD=1,TD=1 to RD=1,TD=0 (flip-book)
  rd = 1 ; td = 1 ; TDSTEP=-1 ;
  
  // col 8
  //rd = 3 ; td = 4; TDSTEP=1 ;
  
  // Use twice the interval to reflect loop at th extrema
  // Sigmoid function adds acceleration and deceleration at the integers
  var i = floor(time%(2*INTERVAL)) + sigmoid(time%1-0.5,SLOPE)%1 ;
  i = INTERVAL - abs(i - INTERVAL) ;
  
  td = td + i*TDSTEP ;
  rd = rd + i*RDSTEP ;
  
  text("RD = "+floor(rd*1000)/1000,10,30) ;
  text("TD = "+ceil(td*1000)/1000,10,60) ;
  
  var n = rd ;
  var d = td + 1 ;
  var k = n / d ;

  for (var p=1; p<=npoints; p++) {

    // d revolutions of the Rose curve
    var t = p/npoints * TAU*d ;
    var r = sin(k*t) * radius ;
    
    // stabilise rotation by subtracting td*PI
    var x = r * cos(t - td*PI + a) + xcenter ;    
    var y = r * sin(t - td*PI + a) + ycenter ;
    point(x,y) ;
  }
}
