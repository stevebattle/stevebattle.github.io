SIZE = 800;
CELLS = 1000;
R = 50;
HORIZON = 350;
CODES = [90^1,90^4,90^32,90^128,90^2,90^8,90^16,90^64] // codes 1 bit difference from 90
// 90^1 radial spokes
// 90^2 clockwise spiral
// 90^4 petals
// 90^8 sierpinski 2
// 90^16 anticlockwise spiral
// 90^32 sierpinski petals
// 90^64 sierpinski 3
// 90^128 sierpinski bauble

index = 0;

function setup() {
  createCanvas(SIZE, SIZE);
  colorMode(HSB,360,100,100);
  background(50,100,100);
  ca = new CA(CODES[index]).initialise(CELLS).regular(6);
  rad = 1;
  radius = R*Math.acosh(1);
}

function plot(radius,z,value) {
  sat = value ? 100*cos(radius/HORIZON) : 255;
  fill(index*45, sat, 100);
  stroke(index*45, sat, 100);
  cx = SIZE/2;
  cy = SIZE/2;
  angle = z/CELLS * TAU;
  x = cx + radius*cos(angle);
  y = cy + radius*sin(angle);
  ellipse(x,y,1,1);
}

function draw() {
  if (index>CODES.length) return;
  for (let i=0; i<ca.cell.length; i++) {
    if (ca.cell[i]) {
      plot(rad,i,ca.cell[i]);
    }
  }
  if (rad>=radius) {
    ca.generate();
    radius = R*Math.acosh(ca.generation);
    rad = min(rad+1,radius);
  } else rad++;
  if (rad>HORIZON) {
    index++;
    ca.setCode(CODES[index]).initialise(CELLS).regular(6);
    rad = 1;
    radius = R*Math.acosh(1);
  }
}

function mouseClicked() {
  save("mandala.png");
}
