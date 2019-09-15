// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// Figure 4, pages 58-59

// Rose curves:
// https://en.wikipedia.org/wiki/Rose_(mathematics)

var npoints = 991 ; // number of points in a display
var steps = 600 ; // steps before switching to next pattern
var radius = 200 ; // radius
var xcenter, ycenter ;
var RD=1, TD=1 ;
var SLOPE = 25 ;
// figure 4 covers intervals between 1 and 8
var INTERVAL = 1 ;

function setRD(rd) {
  RD = rd ;
}

function setTD(td) {
  TD = td ;
}

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
  
  // RD starts at 1 and increases over time
  // TD decreases over time to 0
  
  // Use twice the interval to reflect loop at th extrema
  // Sigmoid function adds acceleration and deceleration at the integers
  var i = floor(time%(2*INTERVAL)) + sigmoid(time%1-0.5,SLOPE)%1 ;
  i = INTERVAL - abs(i - INTERVAL) ;
  rd = i + 1 ; 
  td = INTERVAL - i ;
  setTD(td) ;
  setRD(rd) ;
  text("RD = "+floor(rd*1000)/1000,10,30) ;
  text("TD = "+ceil(td*1000)/1000,10,60) ;
  
  for (var p=1; p<=npoints; p++) {
    var n = RD ;
    var d = TD + 1 ;
    var k = n / d ;
    // How many complete revolutions complete the Rose curve?
    // Expressed as a function of k (factor is smallest prime)
    var t = p / npoints * TAU * 200*k ;

    var r = cos(k*t) * radius ;    
    var x = r * cos(t) + xcenter ;    
    var y = r * sin(t) + ycenter ;
    
    point(x,y) ;
  }
}
