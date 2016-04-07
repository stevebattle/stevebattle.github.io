/*
  Supershapes (Superformula)
  http://paulbourke.net/geometry/supershape/
 */
var aSlider, gSlider, bSlider;
var x=100, y = 30, yStep = 30;
var label = [], l=0;
var textHeight = 15;

function Slider(_caption, _min, _max, _precision, _value) {
  this.caption = _caption;
  this.x = x;
  this.y = y;
  var p = pow(10,_precision);
  this.control = createSlider(_min * p, _max * p, _value * p);
  this.control.position(x+30,y);
  y += yStep;
  this.precision = _precision;
}

Slider.prototype.draw = function() {
  text(this.caption, this.x, this.y + textHeight);
  text(this.getValue(),this.x + 180, this.y + textHeight);
}

Slider.prototype.getValue = function() {
  return this.control.value() / pow(10,this.precision);
}

/* returns the radius of the supershape for given angle phi */
function supershape(a, b, m, n1, n2, n3, phi) {
  t1 = pow(abs(cos(m/4 * phi)/a), n2);
  t2 = pow(abs(sin(m/4 * phi)/b), n3);
  return 1/pow(t1 + t2, 1/n1);
}

function addSlider(name, min, max, value) {
  //s = createSlider(min, max, value);
  //s.position(130, y);
  label[l++] = new Label(name,100,y);
  y+= yStep;
  return s;
}

function setup() {
  // create canvas
  createCanvas(400, 600);
  textSize(15)

  // add sliders
  aSlider = new Slider("a",0,10,2,0);
  bSlider = new Slider("b",0,10,2,5);
  mSlider = new Slider("m",1,10,0,1);  
  n1Slider = new Slider("n1",-100,100,2,100);  
  n2Slider = new Slider("n2",-100,100,2,-100);  
  n3Slider = new Slider("n3",-100,100,2,0);  
  rSlider = new Slider("r",0,360,0,0);  
  sSlider = new Slider("s",0,width,2,100);
}

function draw() {
  // white background
  background(255);
  
  // draw labels
  aSlider.draw();
  bSlider.draw();
  mSlider.draw();
  n1Slider.draw();
  n2Slider.draw();
  n3Slider.draw();
  rSlider.draw();
  sSlider.draw();
  
  push();
  translate(width/2,(height-y)/2+y);

  var a = aSlider.getValue();
  var b = bSlider.getValue();
  var m = int(mSlider.getValue())*2;
  var n1 = n1Slider.getValue();
  var n2 = n2Slider.getValue();
  var n3 = n3Slider.getValue();
  var ro = rSlider.getValue();
  var sc = sSlider.getValue();

  beginShape();
  for (var d=0; d<=360; d++) {
    // add angular offset to avoid zero
    var phi = radians((d+0.01) % 360.0);
    // use trig functions to obtain continuous function of t
    var r = sc * supershape(a, b, m, n1, n2, n3, phi);
    vertex(r*cos(phi+radians(ro)), r*sin(phi+radians(ro)));
  }
  endShape();
  pop();
}
