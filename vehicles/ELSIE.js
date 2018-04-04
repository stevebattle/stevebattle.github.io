function ELSIE(img,w,l)  {
  // extends Vehicle
  Vehicle.call(this,img,w,l);
  this.prototype = Object.create(Vehicle.prototype);
  
  this.F = 90;
  this.PFACTOR=0.5;
  
  this.SLOPE = 50;
  this.BIAS = 0.5;
  
  // Matsuoka parameters
  this.TA = 12.0; // time constant controls frequency
  this.TR = 1.0 // integration time constant
  this.S = 2.9 // constant tonic stimulus
  this.B = 5.0 // neural adaptation factor
  this.A = 1.5 // strength of mutual inhibition

  // sensor range
  this.RANGE = width;
  
  // fixed angles of left and right eyes relative to body
  this.DISPARITY = 45;
  this.left = radians(this.DISPARITY);
  this.right = -this.left;
  
  this.time=millis();
  this.turn = 0;
  
  this.drawBox = false;
  
  this.SCAN = PI/2;
  this.OFFSET = 28;
  this.CONTACT = 1000;
  this.DARK = 0.01;
  this.BRIGHT = 0.9;
  this.BATTERY_MAX = 100;
  this.SCREEN_MARGIN = 20;
  this.TEXTX = width-40;
  this.TEXTY = 37;
  this.BATTERY_LOW = 50;

  
  this.leftContact = 0;
  this.rightContact = 0;
  this.frontContact = 0;
  this.rearContact = 0;
  this.battery = this.BATTERY_MAX;
  
  // stem & tip of sensor
  this.stem = this.endPointTo(this.OFFSET);
  this.tip = this.endPointTo(this.RANGE);
  
  // p1, p2: p5.Vector
  this.frameCollision = function(p1,p2) {
    return p1.x<0 && p2.x>=0 || 
      p2.x<0 && p1.x>=0 ||
      p1.y<0 && p2.y>=0 || 
      p2.y<0 && p1.y>=0 ||
      p1.x<width && p2.x>=width || 
      p2.x<width && p1.x>=width ||
      p1.y<height && p2.y>=height || 
      p2.y<height && p1.y>=height ;
  }
  
  this.contact = function(obstacles) {
    // bounding box
    var tl = this.topLeft();
    var tr = this.topRight();
    var bl = this.bottomLeft();
    var br = this.bottomRight();
       
    for (var i=0; i<obstacles.length; i++) {
      if (obstacles[i].collision(tl,tr)!=null) this.leftContact = max(this.leftContact,this.CONTACT);
      if (obstacles[i].collision(bl,br)!=null) this.rightContact = max(this.rightContact,this.CONTACT);
      if (obstacles[i].collision(tr,br)!=null) this.frontContact = max(this.frontContact,this.CONTACT);
      if (obstacles[i].collision(tl,bl)!=null) this.rearContact = max(this.rearContact,this.CONTACT);
    }
    // collision with window frame
    if (this.frameCollision(tl,tr)) this.leftContact = max(this.leftContact,this.CONTACT);
    if (this.frameCollision(bl,br)) this.rightContact = max(this.rightContact,this.CONTACT);
    if (this.frameCollision(tr,br)) this.frontContact = max(this.frontContact,this.CONTACT);
    if (this.frameCollision(tl,bl)) this.rearContact = max(this.rearContact,this.CONTACT);
    
    this.drawBox = this.leftContact>0 | this.rightContact>0 | this.frontContact>0 | this.rearContact>0 ;
  };
  
  // [0,-pi] to port, [0,pi] to starboard
  this.normaliseAngle = function(angle) {
    return atan2(sin(angle), cos(angle));
  };
    
  /* differential steering based on http://rossum.sourceforge.net/papers/DiffSteer/ */
  
  // p5.Vector src
  this.solve = function(rate,src,obstacles) {
    // save time
    var t=millis();
    var elapsed = t - this.time;
    this.time = t;
    this.charging = false;
    
    // change in orientation over time
    var dt = 1.0/rate;
    
    // sensor line
    var p1 = this.stem, p2 = this.tip;

    // calculate inverse distance from light dropping to 0 at full range
    var d = this.distance(this.stem,src.position);
    var inv = d<this.RANGE ? 1-(d/this.RANGE) : 0;
    var l = src.intersection(p1,p2,4) ? inv : 0;

    // shell contact
    this.contact(obstacles);
    
    var scan = 0;
    var drive = 0;
    
    // text properties
    textSize(32);
    fill(0, 255, 0);
    strokeWeight(1);
    
    if (this.leftContact>0 | this.rightContact>0 | this.frontContact>0 | this.rearContact>0) { // pattern O: obstacle avoidance
      text('O', this.TEXTX, this.TEXTY);
      
      // The Drive and scan motors alternate between full and half power. 
      this.leftContact = max(0,this.leftContact-elapsed);
      this.rightContact = max(0,this.rightContact-elapsed);
      this.frontContact = max(0,this.frontContact-elapsed);
      this.rearContact = max(0,this.rearContact-elapsed);
      if (this.time%1000 < 300) { // one third of the time on 'steer-hard-push-gently'
        drive = 0.5;
        scan = 1;        
      }
      else { // two thirds 'push-hard-steer-gently'.
        drive = 1;
        scan = 0.5;
      }
      // override driving _into_ obstacles, equal and opposite reaction
      if (this.leftContact>0 & this.turn<0 |
          this.rightContact>0 & this.turn>=0 |
          this.frontContact>0 & abs(this.turn)<PI/2 |
          this.rearContact>0 & abs(this.turn)>=PI/2 ) drive = -drive;
    }
    else if(this.battery<this.BATTERY_MAX-1 && src.encloses(this.position.x,this.position.y)) { // pattern R: recharge
      text('R', this.TEXTX, this.TEXTY);
      drive = 0;
      scan = 0;
      this.battery = min(this.BATTERY_MAX, this.battery+4*elapsed/1000);     
      this.charging = true;
    }
    else if (l<this.DARK) { // pattern E: slow drive / fast scan
      text('E', this.TEXTX, this.TEXTY);
      drive = 0.5;
      scan = 1;
    }
    else if (l<this.BRIGHT || this.battery<this.BATTERY_LOW) { // pattern P: fast drive / no scan
      if (this.battery>0) text('P', this.TEXTX, this.TEXTY);
      drive = 1;
      scan = 0;
    }
    else { // pattern N: fast drive / slow scan
      text('N', this.TEXTX, this.TEXTY);
      drive = 1 ;
      scan = 0.5;
    }
      
    // direction of rotation of the scan, which is clockwise for ELMER, and counter-clockwise for ELSIE
    this.turn = this.normaliseAngle(this.turn - scan*this.SCAN*dt);
    
    // drive wheel
    var v = drive*this.F;
    
    // flat battery?
    if (this.battery==0) {
      v=0;
    }
    
    // change in position over time using steering model
    var dx = v * cos(-this.turn) * cos(-this.angle);
    var dy = v * cos(-this.turn) * sin(-this.angle);
    this.addPosition(dx*dt,dy*dt);
    
    var da = v/this.OFFSET * sin(-this.turn);
    this.angle = (this.angle + da*dt) % TAU;
    
    // scan proximity sensor
    //var p1 = this.position;
    var p1 = this.endPointTo(this.OFFSET);
    var p2 = this.endPointTo(this.RANGE);
    
    // rotate sensor end-point p2 around centre p1
    var xoff = p2.x - p1.x;
    var yoff = p2.y - p1.y;
    this.stem = p1;
    this.tip = new p5.Vector(
      xoff*cos(this.turn) - yoff*sin(this.turn) + p1.x,
      xoff*sin(this.turn) + yoff*cos(this.turn) + p1.y);
    
    // deplete battery
    this.battery = max(0, this.battery-elapsed/1000);
    
    // prevent broder crossing
    if (this.position.x<-100 ||
        this.position.y<-100 ||
        this.position.x>width+100 ||
        this.position.y>height+100)
    this.position = createVector(random(width-200)+100,random(height-200)+100);
  };
  
  // save shadowed super.draw()
  this.super_draw = this.draw;
  
  this.draw = function() {
    strokeWeight(1);
    this.super_draw();

    // draw bounding box
    if (this.drawBox || this.charging) {
      var tl = this.topLeft();
      var tr = this.topRight();
      var bl = this.bottomLeft();
      var br = this.bottomRight();
      strokeWeight(2);
      if (this.charging) stroke(255,0,0);
      else stroke(0,255,0);
      line(tl.x,tl.y,tr.x,tr.y);
      line(tr.x,tr.y,br.x,br.y);
      line(br.x,br.y,bl.x,bl.y);
      line(bl.x,bl.y,tl.x,tl.y);
      this.drawBox = false;
    }
    strokeWeight(1);
    
    // draw sensor line
    if (this.battery>0 && !this.charging) {
      var p1 = this.stem;
      var p2 = this.tip;    
      stroke(0,255,0);
      line(p1.x,p1.y,p2.x,p2.y);
    }
    
    // draw battery bar
    stroke(0,255,0);
    strokeWeight(20);
    var margin = 25;
    var b = this.battery / this.BATTERY_MAX * (width-3*margin);
    line(margin,margin,margin+b,margin);
  };
  
}
