PImage head, body;
PVector[] position;
int n = 7;
color red = color(255,0,0);

void setup() {
  size(500,500);
  frameRate(10);
  head = loadImage("head.gif");
  body = loadImage("body.gif");
  position = new PVector[n];
}

void draw() {
  background(#BFE2F2);
  imageMode(CENTER);
  position[frameCount%n] = new PVector(mouseX,mouseY);

  for (int i=1 ; i<=n; i++) {
    PVector p = position[(frameCount+i)%n];
    if (p==null) continue;
    
    pushMatrix();
    translate(p.x,p.y);
    //if (i>=5) {
    //  fill(red); stroke(red);
    //  ellipse(0,0,10,10);
    //}
    //else {
      rotate((mouseX-p.x)/width * PI);
      println((mouseX-p.x)/width);
      image(body,0,0);
    //}
    popMatrix();
  }
  image(head,mouseX,mouseY);
}