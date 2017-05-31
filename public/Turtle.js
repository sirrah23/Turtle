function Turtle(x, y){
    this.pos = createVector(x, y);
    this.initial_pos = this.pos.copy();
    this.dir = createVector(0,-1);
    this.angle = 0;
    this.size = 20;
}

Turtle.prototype.show = function(){
    angleMode(DEGREES);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    fill(255, 0, 0)
    ellipse(0, 0 - (this.size-10),  this.size/2, this.size/2);  // head
    fill(0, 255, 0);
    ellipse(-this.size/2, -this.size/5, this.size/2, this.size/2);     // left hand
    ellipse(this.size/2, -this.size/5, this.size/2, this.size/2);      // right hand
    ellipse(-this.size/2, this.size/2, this.size/2, this.size/2);     // left leg
    ellipse(this.size/2, this.size/2, this.size/2, this.size/2);      // right leg
    ellipse(0, 0, this.size, this.size);            // body
    pop();
}

Turtle.prototype.move = function(move_node){ 
    var action = move_node.value.action;
    switch(action){
        case "MOVE_FORWARD":
            this.move_forward(move_node.value.attribute);
            break;
        case "ROTATE_LEFT":
            this.rotate(-1 * move_node.value.attribute);
            break;
        case "ROTATE_RIGHT":
            this.rotate(move_node.value.attribute);
            break;
        default:
            throw "Invalid action " + action;
    }

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

Turtle.prototype.setPos = function(pos){
    this.pos = pos.copy();
}

Turtle.prototype.reset = function(){
    this.pos = this.initial_pos.copy();
    this.angle = 0;
    this.dir = createVector(0, -1);
}