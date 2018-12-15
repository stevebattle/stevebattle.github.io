/* 
  Supershape-designer (Superformula)
  http://paulbourke.net/geometry/supershape/
*/

var y = 2;
var yStep = 22;

/* returns the radius of the supershape for given angle phi */
function supershape(a, b, m, n1, n2, n3, phi) {
  var t1 = pow(abs(cos(m/4 * phi)/a), n2);
  var t2 = pow(abs(sin(m/4 * phi)/b), n3);
  return 1/pow(t1 + t2, 1/n1);
}

function addSlider(name, min, max, precision, value) {
  
  cp5.addSlider(name)
     .setCaptionLabel(name)
     .setPosition(20,y)
     .setSize(width-40,20)
     .setRange(min,max)
     .setColorCaptionLabel(0)
     .setDecimalPrecision(precision)
     .setValue(value);
  y+=yStep;
}

function getSlider(name) {
  return cp5.getController(name).getValue();
}

function setup() {
  //createDiv("a");
  createCanvas(500,500);
  a = createSlider(-100,100,3);
  a.parent("a");
  b = createSlider(-10,10,0);
  b.parent("b");
  m = createSlider(0,100,100,2);
  m.parent("m");
  n1 = createSlider(-200,200,25); 
  n1.parent("n1");
  n2 = createSlider(-100,100,-5);
  n2.parent("n2");
  n3 = createSlider(-100,100,0);
  n3.parent("n3");
  rot = createSlider(0,360,0,0);
  rot.parent("rot");
  sca = createSlider(0,width,width/2);
  sca.parent("sca");
}

function draw() {
  // white background
  background(255);
  // move origin from top-left to centre
  push();
  translate(width/2,(height-y)/2+y);
  // m must be even to enusure the shape is closed after 360 degrees.

  fill(0, 255, 255);
  beginShape();
  for (var d=0; d<=360; d++) {
    // add angular offset to avoid zero
    var phi = radians((d+0.01) % 360);
    // use trig functions to obtain continuous function of t
    var r = sca.value() * supershape(a.value(), b.value(), m.value(), n1.value(), n2.value(), n3.value(), phi);
    vertex(r*cos(phi+radians(rot.value())), r*sin(phi+radians(rot.value())));
  }
  endShape();
  pop();
}
