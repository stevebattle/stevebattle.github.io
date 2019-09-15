// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// Figure 3, pages 56-57

// Rose curves:
// https://en.wikipedia.org/wiki/Rose_(mathematics)

var npoints = 991 ; // number of points in a display
var steps = 50 ; // steps before switching to next pattern
var radius = 120 ; // radius
var xcenter, ycenter ;
var RD=1, TD=0 ;

function setRD(rd) {
  RD = rd ;
}

function setTD(td) {
  TD = td ;
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
  x = time / PI ;
  td = floor(x%9) ; 
  rd = floor(x/9%9)+1 ;
  setTD(td) ;
  setRD(rd) ;
  text("RD="+rd+" TD="+td,10,30) ;
  
  for (var p=1; p<=npoints; p++) {
    // offset time by 9/2 to phase TD change when off-screen
    var c = tan(time+9/2) ;
    var n = RD ;
    var d = TD + 1 ;
    var k = n / d ;
    // How many complete revolutions complete the Rose curve?
    // Expressed as a function of k (factor is smallest prime)
    var t = p / npoints * TAU * 83*k ;

    // add offset constant c for animation
    var r = (cos(k*t) + c) * radius ;    
    var x = r * cos(t) + xcenter ;    
    var y = r * sin(t) + ycenter ;
    
    point(x,y) ;
  }
}
