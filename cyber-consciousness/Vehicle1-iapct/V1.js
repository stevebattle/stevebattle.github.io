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
// X is the sensor, Y is the distance
var pXY = new Array(BUCKETS).fill(new Array(BUCKETS).fill(0));
var qY = new Array(BUCKETS).fill(0); //baseline probability

var epoch_count = 0;
const EPOCH_STABILISATION = 300;
var iXY = 0;
var hY = 0;
var hYQ = 0;
var kl = 0;

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
  Y_max = sqrt(sq(width/2)*2);
  pXY = new Array(BUCKETS);
  for (var xi=0; xi<BUCKETS; xi++) {
    pXY[xi] = new Array(BUCKETS).fill(0);
  } 
  v.ll = 0;
  v.dd = 0;
  
  // determine priors Q(Y)
  let pos = src.position;
  for (let x=0; x<50; x++) {
    for (let y=0; y<50; y++) {
      //v.setPosition(x/100*width,y/100*height);
      let d = sqrt(pow(x/50*width-400,2)+pow(y/50*height-400,2));
      //console.log(d);
      let i = floor(map(d,Y_min,Y_max,0,BUCKETS));
      if (i==BUCKETS) { i--; }
      qY[i]++ ;
    }
  }
  normalise(qY);
  console.log("baseline:",qY);
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
  textSize(30);
  text('  H(Y,W) = '+ hYQ.toFixed(2), 20, 50); 
  text('  H(Y) = '+ hY.toFixed(2), 52, 100); 
  text("I(X;Y) = " + iXY.toFixed(2), 554, 50); 
  text("KL(Y||W) = " + kl.toFixed(2), 510, 100);
  
  textSize(20);
  // for baseline see: https://www.iguazio.com/glossary/baseline-models/#:~:text=A%20random%20baseline%20generates%20predictions,not%2Dspam%20with%20equal%20probability.
  text("W: distance baseline  X: eye  Y: distance",50, 770);
}

function analysis(v) {
  //var a = v.a % TAU;
  var xi = ceil(map(v.ll,X_min,X_max,0,BUCKETS))-1;
  //console.log("check brightness", v.dd, v.ll, xi);
  var yi = floor(map(v.dd,Y_min,Y_max,0,BUCKETS));
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
  //let pX = marginalX(pXY);
  let pY = marginalY(pXY);
  //console.log("P(X)",pX);
  console.log("P(Y)",pY);
  console.log("");
  
  // mutual information
  iXY = mutualInfo(pXY);
  hY = entropy(pY);
  hYQ = crossEntropy(pY,qY);
  // KL (Kullback–Leibler divergence) is cross entropy - entropy
  // the KL divergence is the average number of extra bits needed to encode the data
  // due to the fact that we used distribution q to encode the data instead of the true distribution p
  kl = hYQ-hY;
  console.log("H(Y) = ",hY,"I(X;Y) = ",iXY);
  console.log("H(Y,W) = ",hYQ,"KL(Y||W) = ",kl);
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

function entropy(p) {
  var H = 0;
  for (let i=0; i<BUCKETS; i++) {
    let t = log2(p[i]);
    if (isFinite(t) && !isNaN(t)) {
      H += p[i] * t;
    }
  }
  return -H;
}

function crossEntropy(p,q) {
  var H = 0;
  for (let i=0; i<BUCKETS; i++) {
    let t = p[i] * log2(q[i]);
    if (isFinite(t) && !isNaN(t)) {
      H += t;
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