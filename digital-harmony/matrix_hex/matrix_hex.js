// John Whitney’s Digital Harmony – On the Complementarity of Music and Visual Art
// https://www.dataisnature.com/?p=2274
// https://archive.org/stream/DigitalHarmony_201611/Digital%20Harmony#mode/1up

var npoints = 24 ; // number of points in the display
var rate = 20 ; // draw is called at 20Hz
var minSide = 10;
var maxSide = 100 ;
var radius = 150 ;
var xcenter, ycenter ;

function setup() {
  canvas = createCanvas(500,500) ;
  background(0) ;
  frameRate(rate) ;
  xcenter = width/2 ;
  ycenter = height/2 ;
}

// source: https://processing.org/examples/regularpolygon.html

function polygon(x, y, radius, npoints) {
  var angle = TAU / npoints ;
  beginShape();
  for (var a = 0 ; a < TAU ; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// lissajous figure

function lissajous(a,b,t,delta,r,f) {
  // delta provides an offset to animate the lissajous
  var x = r * sin(a*t + delta) + xcenter ;    
  var y = r * sin(b*t) + ycenter ; 
  f(x,y);
}

function draw() {
  // lissajous parameters
  var a=3, b=2 ;

  // black background
  background(0) ;
  stroke('white') ;

  // time = seconds into the animation
  var time = frameCount / rate ;
  
  side = min(max(floor(5*time-90),minSide),maxSide);

  for (var p=1; p<=npoints; p++) {
    // t is position along lissajous
    var t = p / npoints * time ;    
    lissajous(a,b,t,0,radius, function(x,y) { 
      // circle or hexagon
      if (side==minSide) {
        fill(255);
        ellipse(x,y,minSide,minSide) ;
      }
      else {
        noFill();
        polygon(x,y,p/npoints*side,6) ;
      }
    }) ;
  }
}
