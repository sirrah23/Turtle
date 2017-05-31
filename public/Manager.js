var RUNNING = "RUNNING",
    STOPPED = "STOPPED";

function Manager(turtle){
    this.turtle = turtle;
    this.turtle_initial_pos = this.turtle.pos.copy();
    this.points = [];
    this.add_point();
    this.stat = STOPPED;
    this.move_generator = null;
}

Manager.prototype.setProgram = function(program){
    this.move_generator = new Interpreter(new Parser(new Tokenizer(program))).get_move_generator();
    this.stat = RUNNING;
}

Manager.prototype.step = function(){
    if(!this.move_generator){
        return;
    }
    if(this.stat === STOPPED){
        return;
    }
    var next_move = this.move_generator.next(); 
    if (next_move.value.action === "STOP"){
       this.stat = STOPPED
      return;
    }
    this.turtle.move(next_move);
    //If all the turtle did was rotate then we don't need to add 
    //a new point for that...
    if(!this.turtle.pos.equals(this.points[this.points.length-1]))
        this.add_point();
}

Manager.prototype.add_point = function(){
    this.points.push(this.turtle.pos.copy());
    return;
}

Manager.prototype.show = function(){
    this.draw_points();
    this.turtle.show();
}

Manager.prototype.reset = function(){
    this.turtle.reset();
    this.points = [];
    this.add_point();
}

Manager.prototype.draw_points = function(){
    if(this.points.length <= 1){
        return;
    }
    push();
    stroke(0);
    for(var i = 0; i < this.points.length-1; i++){
       line(this.points[i].x, this.points[i].y, this.points[i+1].x, this.points[i+1].y);
    }
    pop();
}
