function Turtle(x, y){
    this.pos = createVector(x, y);
    this.dir = createVector(0,-1);
    this.angle = 0;
    this.size = 30;
}

Turtle.prototype.show = function(){
    angleMode(DEGREES);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    fill(255, 0, 0)
    ellipse(0, 0 - 20,  this.size/2, this.size/2);  // head
    fill(0, 255, 0);
    ellipse(-15, -6, this.size/2, this.size/2);     // left hand
    ellipse(15, -6, this.size/2, this.size/2);      // right hand
    ellipse(-15, 15, this.size/2, this.size/2);     // left leg
    ellipse(15, 15, this.size/2, this.size/2);      // right leg
    ellipse(0, 0, this.size, this.size);            // body
    pop();
}

Turtle.prototype.move_forward = function (pixels){
    var move_vec = this.dir.copy()
    this.pos.add(move_vec.mult(pixels));
}

Turtle.prototype.rotate = function(angle){
    angleMode(DEGREES);
    this.angle += angle;
    this.dir.rotate(angle);
}