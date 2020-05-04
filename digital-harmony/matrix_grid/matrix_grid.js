// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// https://archive.org/stream/DigitalHarmony_201611/Digital%20Harmony#mode/1up

var npoints = 24 ; // number of points in a display
var rate = 20 ;
var minSide = 10, maxSide = 120 ;
var radius = 160 ;
var xcenter, ycenter ;
var startTime = 60;
var timeOffset = 17; // time of switch
var timeScale = 6;

// lissajous parameters "figure of 8"
var a=1, b=2 ;

function setup() {
  canvas = createCanvas(500,500) ;
  background(0) ;
  // draw is called at 24Hz
  frameRate(rate) ;
  xcenter = width/2 ;
  ycenter = height/2 ;
}

// lissajous figure

function lissajous(a,b,t,delta,r,f) {
  // delta provides an offset to animate the lissajous
  var x = r * sin(a*t + delta) + xcenter ;    
  var y = 0.5*r * sin(b*t) + ycenter ; 
  f(x,y);
}

function draw() {
  // black background
  background(0) ;
  stroke('white') ;

  // step in overall cycle (1 = full cycle)
  var time = frameCount / rate + startTime;
  var side = min(max(timeScale*(60-time+timeOffset),minSide),maxSide);

  for (var p=1; p<=npoints; p++) {
    // t indicates position along lissajous
    var t = p / npoints * time ;    
    lissajous(a,b,t,0,radius, function(x,y) {
      // circle or vertical grid
      if (side==minSide) {
        fill(255);
        ellipse(x,y,minSide,minSide) ;
      }
      else {
        strokeWeight(2);
        line(x,y+side/2,x,y-side/2) ;
      }
    }) ;
  }
}
