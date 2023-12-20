/*
   Braitenberg Vehicles simulation
 
 Copyright 2013 Steve Battle
 
 This work is licensed under a Creative Commons Attribution 3.0 Unported License.
 
 You may obtain a copy of the License at
 
 http://creativecommons.org/licenses/by/3.0
 */

const PI = 3.14159265358979;
const TAU = 2*PI;
var RATE = 25;
var V1WIDTH=30, VWIDTH=55, VLENGTH=85, VSIDE=50;
const BUCKETS = 3;//5;
var X = new Array(BUCKETS).fill(0);
var Y = new Array(BUCKETS).fill(0);
const Xmin = 0;
const Xmax = 1;
const Ymin = 0;
const Ymax = 1;
const Zmin = -PI;
const Zmax = PI;
const EPOCH = 600; // needs multiple epochs because there is >1 stable state
var epoch = EPOCH;
var pXYZ = null;
var epoch_count = 0;
const EPOCH_STABILISATION = 300;
var iXY = 0;
var cXYZ = 0;
var iXYZ = 0;
var hZ = 0;

function preload() {
  bg_image = loadImage("data/bg800x800.jpg");
  src_image = loadImage("data/source.png");
  v2a_image = loadImage("data/vehicle2a.png");
  v2b_image = loadImage("data/vehicle2b.png");
}

function setup() {
  var canvas = createCanvas(800, 800);
  textSize(30);
  textFont('Helvetica');
  frameRate(RATE);
  // parent <div> in the html
  try {
    canvas.parent('sketch');
  }
  catch(err) {
  }
  src = new Source(src_image, VSIDE, width/2, height/2);
  //v = new Vehicle2a(v2a_image,VWIDTH,VLENGTH);
  v = new Vehicle2b(v2b_image, VWIDTH, VLENGTH);

  // initialise P(X,Y,Z)
  pXYZ = new Array(BUCKETS);
  for (var xi=0; xi<BUCKETS; xi++) {
    pXYZ[xi] = new Array(BUCKETS);
    for (var yi=0; yi<BUCKETS; yi++) {
      pXYZ[xi][yi] = new Array(BUCKETS).fill(0);
    }
  }
}

function draw() {
  background(bg_image);
  src.draw();
  v.drawPath();
  v.draw();
  src.solve();
  v.solve(RATE, src.position);
  v.checkBorders();
  analysis(v);
  fill("white");
  text('  H(Z) = '+ hZ.toFixed(2), 20, 100); 
  text("I(X;Y) = " + iXY.toFixed(2), 20, 50); 
  text("I(X;Y | Z) = " + cXYZ.toFixed(2), 550, 50); 
  text("  I(X;Y;Z) = " + iXYZ.toFixed(2), 550, 100); 
}

function analysis(v) {
  var xi = floor(map(v.ll, Xmin, Xmax, 0, BUCKETS));
  var yi = floor(map(v.rr, Ymin, Ymax, 0, BUCKETS));
  var zi = floor(map(v.rad, Zmin, Zmax, 0, BUCKETS));
  if (zi<0) {
    yi = 0;
  }
  if (zi>=BUCKETS) {
    zi = BUCKETS-1;
  }
  if (epoch <= EPOCH_STABILISATION) {
    pXYZ[xi][yi][zi]++;
  }
  if (--epoch == 0) {
    nextEpoch();
  } // next epoch
}

function marginalY2(pXY) {
  p = new Array(BUCKETS).fill(0);
  for (var xi=0; xi<BUCKETS; xi++) {
    for (var yi=0; yi<BUCKETS; yi++) {
      p[yi] += pXY[xi][yi];
    }
  }
  return normalise1(p);
}

function marginalX2(pXY) {
  p = new Array(BUCKETS).fill(0);
  for (var xi=0; xi<BUCKETS; xi++) {
    for (var yi=0; yi<BUCKETS; yi++) {
      p[xi] += pXY[xi][yi];
    }
  }
  return normalise1(p);
}


function marginalY3(pXYZ) {
  let p = new Array(BUCKETS).fill(0);
  for (var xi=0; xi<BUCKETS; xi++) {
    for (var yi=0; yi<BUCKETS; yi++) {
      for (var zi=0; zi<BUCKETS; zi++) {
        p[yi] += pXYZ[xi][yi][zi];
      }
    }
  }
  return normalise1(p);
}

function marginalX3(pXYZ) {
  let p = new Array(BUCKETS).fill(0);
  for (var xi=0; xi<BUCKETS; xi++) {
    for (var yi=0; yi<BUCKETS; yi++) {
      for (var zi=0; zi<BUCKETS; zi++) {
        p[xi] += pXYZ[xi][yi][zi];
      }
    }
  }
  return normalise1(p);
}

function marginalZ3(pXYZ) {
  let p = new Array(BUCKETS).fill(0);
  for (var xi=0; xi<BUCKETS; xi++) {
    for (var yi=0; yi<BUCKETS; yi++) {
      for (var zi=0; zi<BUCKETS; zi++) {
        p[zi] += pXYZ[xi][yi][zi];
      }
    }
  }
  return normalise1(p);
}

function jointXY3(pXYZ) {
  let p = new Array(BUCKETS);
  for (i=0; i<BUCKETS; i++) {
    p[i] = new Array(BUCKETS).fill(0);
  }
  for (var xi=0; xi<BUCKETS; xi++) {
    for (var yi=0; yi<BUCKETS; yi++) {
      for (var zi=0; zi<BUCKETS; zi++) {
        p[xi][yi] += pXYZ[xi][yi][zi];
      }
    }
  }
  return normalise2(p);
}

function jointXZ3(pXYZ) {
  let p = new Array(BUCKETS);
  for (i=0; i<BUCKETS; i++) {
    p[i] = new Array(BUCKETS).fill(0);
  }
  for (var xi=0; xi<BUCKETS; xi++) {
    for (var yi=0; yi<BUCKETS; yi++) {
      for (var zi=0; zi<BUCKETS; zi++) {
        p[xi][zi] += pXYZ[xi][yi][zi];
      }
    }
  }
  return normalise2(p);
}

function jointYZ3(pXYZ) {
  let p = new Array(BUCKETS);
  for (i=0; i<BUCKETS; i++) {
    p[i] = new Array(BUCKETS).fill(0);
  }
  for (var xi=0; xi<BUCKETS; xi++) {
    for (var yi=0; yi<BUCKETS; yi++) {
      for (var zi=0; zi<BUCKETS; zi++) {
        p[yi][zi] += pXYZ[xi][yi][zi];
      }
    }
  }
  return normalise2(p);
}

function normalise1(p) {
  var sum = 0;
  for (let i=0; i<BUCKETS; i++) {
    sum += p[i];
  }
  for (let i=0; i<BUCKETS; i++) {
    p[i] /= sum ;
  }
  return p;
}

function normalise2(p) {
  var sum = 0;
  for (let i=0; i<BUCKETS; i++) {
    for (let j=0; j<BUCKETS; j++) {
      sum += p[i][j];
    }
  }
  for (let i=0; i<BUCKETS; i++) {
    for (let j=0; j<BUCKETS; j++) {
      p[i][j] /= sum ;
    }
  }
  return p;
}

  function nextEpoch() {
    // mutual information
    let pXY = jointXY3(pXYZ);
    iXY = mutualInfo2(pXY);
    
    console.log("P(X,Y)");
    print2(pXY);
    console.log("P(X,Z)");
    print2(jointXZ3(pXYZ));
    console.log("P(Y,Z)");
    print2(jointYZ3(pXYZ));
    console.log("P(Z)");
    let pZ = marginalZ3(pXYZ);
    print1(pZ);
    hZ = entropy(pZ);
    console.log("H(Z) = ",hZ);
    
    cXYZ = conditionalInfo3(pXYZ);
    iXYZ = mutualInfo3(pXYZ);
    console.log(++epoch_count, "I(X;Y) =",iXY,"I(X;Y|Z) =",cXYZ,"I(X;Y;Z) =",iXYZ, "I(X;Y) - I(X;Y|Z) =",iXY-cXYZ);

    epoch = EPOCH;
    v.clearPath();
    v.setPosition(int(random(width)), int(random(height)));
    v.angle = radians(random(360));
  }
 
function print1(p) {
  let line = "";
  for (var xi=0; xi<BUCKETS; xi++) {
      line += p[xi].toFixed(3) + " ";
  }
  console.log(line);
}

function print2(p) {
  for (var xi=0; xi<BUCKETS; xi++) {
    let line = "";
    for (var yi=0; yi<BUCKETS; yi++) {
      line += p[xi][yi].toFixed(3) + " ";
    }
    console.log(line);
  }  
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
  
function mutualInfo2(pXY) {
  var i = 0;
  pX = marginalX2(pXY);
  pY = marginalY2(pXY);
  for (var xi=0; xi<BUCKETS; xi++) {
    for (var yi=0; yi<BUCKETS; yi++) {
      let t = pXY[xi][yi] * log2(pXY[xi][yi] / (pX[xi] * pY[yi]));
      if (isFinite(t) && !isNaN(t)) {
        i += t;
      }
    }
  }
  return i;
}

  // see https://math.stackexchange.com/questions/943107/what-is-the-mutual-information-of-three-variables
  function mutualInfo3(pXYZ) {
    // sum pXYZ to normalise
    var norm = 0;
    for (let xi=0; xi<BUCKETS; xi++) {
      for (let yi=0; yi<BUCKETS; yi++) {
        for (let zi=0; zi<BUCKETS; zi++) {
          norm += pXYZ[xi][yi][zi];
        }
      }
    }
    var sum = 0;
    let pXY = jointXY3(pXYZ);
    let pXZ = jointXZ3(pXYZ);
    let pYZ = jointYZ3(pXYZ);
    let pX = marginalX3(pXYZ);
    let pY = marginalY3(pXYZ);
    let pZ = marginalZ3(pXYZ);

    for (let xi=0; xi<BUCKETS; xi++) {
      for (let yi=0; yi<BUCKETS; yi++) {
        for (let zi=0; zi<BUCKETS; zi++) {
          let num = pXY[xi][yi] * pXZ[xi][zi] * pYZ[yi][zi] ;
          let den = pXYZ[xi][yi][zi]/norm * pX[xi] * pY[yi] * pZ[zi];
          let t = pXYZ[xi][yi][zi]/norm * log2(num / den);
          if (isFinite(t) && !isNaN(t)) { // see https://stats.stackexchange.com/questions/73502/conditional-mutual-information-and-how-to-deal-with-zero-probabilities
            sum += t;
          }
        }
      }
    }
    return sum;
  }
  
  function conditionalInfo3(pXYZ) {
    // sum pXYZ to normalise
    var norm = 0;
    for (var xi=0; xi<BUCKETS; xi++) {
      for (var yi=0; yi<BUCKETS; yi++) {
        for (var zi=0; zi<BUCKETS; zi++) {
          norm += pXYZ[xi][yi][zi];
        }
      }
    }
    var sum = 0;
    let pXY = jointXY3(pXYZ);
    let pXZ = jointXZ3(pXYZ);
    let pYZ = jointYZ3(pXYZ);
    let pX = marginalX3(pXYZ);
    let pY = marginalY3(pXYZ);
    let pZ = marginalZ3(pXYZ);

    for (let xi=0; xi<BUCKETS; xi++) {
      for (let yi=0; yi<BUCKETS; yi++) {
        for (let zi=0; zi<BUCKETS; zi++) {
          let num = pXYZ[xi][yi][zi]/norm * pZ[zi];
          let den = pXZ[xi][zi] * pYZ[yi][zi] ;
          let t = pXYZ[xi][yi][zi]/norm * log2(num / den);
          if (isFinite(t) && !isNaN(t)) { // see https://stats.stackexchange.com/questions/73502/conditional-mutual-information-and-how-to-deal-with-zero-probabilities
            sum += t;
          }
        }
      }
    }
    return sum;
  }

  function log2(n) {
    return log(n) / log(2);
  }


  function mouseClicked() {
    v.clearPath();
    v.setPosition(int(random(width)), int(random(height)));
    v.angle = radians(random(360));
  }

  function startVehicle(id) {
    switch (id) {
    case "a":
      v = new Vehicle2a(v2a_image, VWIDTH, VLENGTH);
      break;
    case "b":
      v = new Vehicle2b(v2b_image, VWIDTH, VLENGTH);
    }
  }
