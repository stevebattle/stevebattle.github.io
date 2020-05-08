function setup() {
  createCanvas(400,400);
}

function draw() {
  translate(200,200);
  angleMode(DEGREES);
  rectMode(CENTER);
  fill('red');
  ellipse(0,0,100,100);
  
  for(i = 0; i< 8; i++) {
    fill('yellow')
    rect(0, -110, 40, 100);
    rotate(180/3)
  }
  
  rotate(60);
  translate(-65,0);
  for(i=0; i < 2; i++) {
    
    fill('blue')
    beginShape();
    translate(130,0)
    vertex(0,0)
    vertex(110,-40);
    vertex(110, 40);
    endShape(CLOSE)
    rotate(180/1)
  }
}