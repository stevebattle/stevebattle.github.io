function setup() {
  canvas = createCanvas(500,500) ;
  icebreaker = loadFont("data/Icebreaker.otf", 32);
}

function draw() {
  // black background
  background(0) ;
  textSize(100) ;
  textFont(icebreaker);
  fill('magenta') ;
  noStroke();
  text("MATRIX",45,200) ;
}