var head, body;
var position = [];
var n = 7;

function setup() {
  createCanvas(500,500);
  frameRate(10);
  head = loadImage("data/head.gif");
  body = loadImage("data/body.gif");
}

function draw() {
  background(135, 206, 235);
  imageMode(CENTER);
  x = 1;
  createVector(0,0);
  position[frameCount%n] = createVector(mouseX,mouseY);

  for (var i=1 ; i<=n; i++) {
    var p = position[(frameCount+i)%n];
    if (p==null) continue;
    
    push();
    translate(p.x,p.y);
    rotate((mouseX-p.x)/width * PI);
    image(body,0,0);
    pop();
  }
  image(head,mouseX,mouseY);
}
