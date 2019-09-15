// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274

var npoints = 30 ; // number of points in a display
var steps = 10 ; // step at the last frame
//var side = 50 ; // figure 10
var side = 200 ; // figure 11
var radius = 100 ;
var xcenter, ycenter ;

function setup() {
  canvas = createCanvas(500,500) ;
  // draw is called at 24Hz
  frameRate(24) ;
  xcenter = width/2 ;
  ycenter = height/2 ;
  noFill();
}

function draw() {
  // lissajous parameters "figure of 8"
  a=2, b=1 ;

  // black background
  background(0) ;
  stroke('white') ;

  // step in overall cycle (1 = full cycle)
  var time = (frameCount-1) / steps ;
  
  for (var p=1; p<=npoints; p++) {
    // t indicates position along lissajous
    var t = p/npoints * time ;
    var x = radius * cos(t) + xcenter ;    
    var y = radius * sin(t) + ycenter ;
    var s = p/npoints * side ;
    ellipse(x,y,s,s) ;
  }
}
