 /*
   Braitenberg Vehicles simulation
 
   Copyright 2013 Steve Battle
 
   This work is licensed under a Creative Commons Attribution 3.0 Unported License.
   
   You may obtain a copy of the License at
 
       http://creativecommons.org/licenses/by/3.0
*/

var RATE = 25;
var V1WIDTH=30, VWIDTH=55, VLENGTH=85, VSIDE=50;

const BUCKETS = 3;
var X = new Array(BUCKETS).fill(0);
var Y = new Array(BUCKETS).fill(0);
const X_min = 0;
const X_max = 1;
const Y_min = 0;
var Y_max = 0;
const EPOCH = 600; // needs multiple epochs because there is >1 stable state
var epoch = EPOCH;
var pXY = new Array(BUCKETS).fill(new Array(BUCKETS).fill(0));
var epoch_count = 0;
const EPOCH_STABILISATION = 300;
var iXY = 0;
var hY = 0;

function preload() {
  bg_image = loadImage("data/bg800x800.jpg");
  src_image = loadImage("data/source.png");
  v1_image = loadImage("data/vehicle1.png");
}

function setup() {
  var canvas = createCanvas(800,800);
  textSize(30);
  textFont('Helvetica');
  
  frameRate(RATE);
  // parent <div> in the html
  try { canvas.parent('sketch'); } catch(err) {}
  src = new Source(src_image,VSIDE,width/2,height/2);
  v = new Vehicle1(v1_image,V1WIDTH,VLENGTH);
  
  // initialise P(X,Y)
  Y_max = sqrt(sq(800)*2);
  pXY = new Array(BUCKETS);
  for (var xi=0; xi<BUCKETS; xi++) {
    pXY[xi] = new Array(BUCKETS).fill(0);
  } 
  v.ll = 0;
  v.dd = 0;
}

function draw() {
  background(bg_image);
  src.draw();
  v.drawPath();
  v.draw();
  src.solve();
  v.solve(RATE,src.position);
  v.checkBorders();
  analysis(v);
  fill("white");
  text('  H(Y) = '+ hY.toFixed(2), 20, 100); 
  text("I(X;Y) = " + iXY.toFixed(2), 20, 50); 
}

function analysis(v) {
  //var a = v.a % TAU;
  var xi = ceil(map(v.ll,X_min,X_max,0,BUCKETS))-1;
  var yi = round(map(v.dd,Y_min,Y_max,0,BUCKETS));
  if (xi<0) { xi = 0 ; }
  if (yi<0) { yi = 0; }
  if (yi>=BUCKETS) { yi = BUCKETS-1; }
  //console.log(xi,yi,v.rad);
  if (epoch <= EPOCH_STABILISATION) {
    pXY[xi][yi]++;
  }
  //console.log(epoch,v.lr,xi, v.rad,yi);
  if (--epoch == 0) { nextEpoch(); } // next epoch
}

function marginalY(pXY) {
  p = new Array(BUCKETS).fill(0);
  for (var xi=0; xi<BUCKETS; xi++) {
    for (var yi=0; yi<BUCKETS; yi++) {
      p[yi] += pXY[xi][yi];
    }
  }
  return normalise(p);
}

function marginalX(pXY) {
  p = new Array(BUCKETS).fill(0);
  for (var xi=0; xi<BUCKETS; xi++) {
    for (var yi=0; yi<BUCKETS; yi++) {
      p[xi] += pXY[xi][yi];
    }
  }
  return normalise(p);
}

function normalise(p) {
  var sum = 0;
  for (var i=0; i<BUCKETS; i++) sum += p[i];
  for (var i=0; i<BUCKETS; i++) p[i] /= sum ;
  return p;
}

function nextEpoch() {
  console.log(++epoch_count);
  
  let pY = marginalY(pXY);
  console.log("P(Y)");
  print1(pY);
  console.log("");
  
  // mutual information
  iXY = mutualInfo(pXY);
  hY = entropy(pY);
  console.log("H(Y) = ",hY,"I(X;Y) = ",iXY);
  console.log(" ");

  epoch = EPOCH;
  v.clearPath();
  v.setPosition(int(random(width)),int(random(height)));
  v.angle = radians(random(360));
}

function print1(p) {
  let line = "";
  for (var xi=0; xi<BUCKETS; xi++) {
      line += p[xi].toFixed(3) + " ";
  }
  console.log(line);
}

function entropy(pX) {
  var H = 0;
  for (let i=0; i<BUCKETS; i++) {
    let t = log2(pX[i]);
    if (isFinite(t) && !isNaN(t)) {
      H += pX[i] * t;
    }
  }
  return -H;
}

function mutualInfo(pXY) {
  // sum pXY to normalise
  var sum = 0;
  for (var xi=0; xi<BUCKETS; xi++) {
    for (var yi=0; yi<BUCKETS; yi++) {
      sum += pXY[xi][yi];
    }
  }
  var i = 0;
  pX = marginalX(pXY);
  pY = marginalY(pXY);
  for (var xi=0; xi<BUCKETS; xi++) {
    let line = "";
    for (var yi=0; yi<BUCKETS; yi++) {
      if (pXY[xi][yi]>0) {
        i += pXY[xi][yi]/sum * log2((pXY[xi][yi]/sum) / (pX[xi] * pY[yi]));
      }
      line += (pXY[xi][yi]/sum).toFixed(3) + " ";
    }
    console.log(line);
  }
  console.log("");
  return i;
}

function log2(n) {
  return log(n) / log(2);
}

function mouseClicked() {
  v.clearPath();
  v.setPosition(int(random(width)),int(random(height)));
  v.angle = radians(random(360));
}
