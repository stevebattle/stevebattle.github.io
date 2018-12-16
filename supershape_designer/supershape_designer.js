/* 
  Supershape-designer (Superformula)
  http://paulbourke.net/geometry/supershape/
*/

/* returns the radius of the supershape for given angle phi */
function supershape(a, b, m, n1, n2, n3, phi) {
  var t1 = pow(abs(cos(m/4 * phi)/a), n2);
  var t2 = pow(abs(sin(m/4 * phi)/b), n3);
  return 1/pow(t1 + t2, 1/n1);
}

function setup() {
  createCanvas(500,500);
  a = select("#a");
  b = select("#b");
  m = select("#m");
  n1 = select("#n1");
  n2 = select("#n2");
  n3 = select("#n3");
  rot = select("#rot");
  sca = select("#sca");
}

function draw() {
  // white background
  background(255);
  
  push();
  // move origin from top-left to centre
  translate(width/2,height/2);

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
