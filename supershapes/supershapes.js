/* 
  Supershapes (Superformula)
  http://paulbourke.net/geometry/supershape/
*/

var rotation = 90;

/* returns the radius of the supershape for given angle phi */
function supershape(a, b, m, n1, n2, n3, phi) {
  var t1 = pow(abs(cos(m/4 * phi) / a), n2);
  var t2 = pow(abs(sin(m/4 * phi) / b), n3);
  return 1 / pow(t1 + t2, 1/n1);
}

function setup() {
  canvas = createCanvas(500,500);
  // parent <div> in the html
  try { canvas.parent('sketch'); } catch(err) {}

  // draw is called at 10Hz
  frameRate(10);
  colorMode(HSB);
  m = 0;
}

function draw() {
  // white background
  background(255);
  // move origin from top-left to centre
  translate(width/2,height/2);
  // derive angular index from frame count
  var t = radians(frameCount % 360);
  
  var hue = frameCount % 180 * 255/180;
  stroke(hue, 255, 0);
  fill(hue, 255, 255);
    
  beginShape();
  if (frameCount % 360 == 90 || frameCount % 360 == 270) m += 2;
  for (var phi=0.0001; phi<2*PI; phi+=0.01) {
    // use trig functions to obtain continuous function of t
    var r = supershape(0.99, 5, m, abs(cos(t)), 0.2 - abs(sin(t)), abs(sin(t)), phi);
    vertex(100 * r * cos(phi+radians(rotation)), 100 * r * sin(phi+radians(rotation)));
  }
  endShape();
}
