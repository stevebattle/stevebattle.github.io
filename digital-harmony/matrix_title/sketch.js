function setup() {
  canvas = createCanvas(500,500) ;
  icebreaker = loadFont("data/Icebreaker.otf", 32);
  frameRate = 30;
}

function draw() {
  // black background
  background(0) ;
  textSize(100) ;
  textFont(icebreaker);
  fill('red') ;
  noStroke();
  text("MATRIX",45,200) ;
  text("III",200,300) ;
  textSize(50) ;
  if (frameCount>90) text("rebooted",140,400)
}