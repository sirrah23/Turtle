var RUNNING = "RUNNING",
    STOPPED = "STOPPED";

function Manager(turtle, program){
    this.turtle = turtle;
    this.points = [];
    this.move_generator = new Interpreter(new Parser(new Tokenizer(program))).get_move_generator();
    this.points.push(this.turtle.pos);
    this.stat = RUNNING;
}

Manager.prototype.step = function(){
    if(this.stat === STOPPED){
        return;
    }
    var next_move = this.move_generator.next(); 
    if (next_move.value.action === "STOP"){
       this.stat = STOPPED
      return;
    }
    this.turtle.move(next_move);
    this.points.push(this.turtle.pos);
}

Manager.prototype.show = function(){
    this.turtle.show();
    this.draw_points();
}

Manager.prototype.draw_points = function(){
    //TODO: Draw a line across all points...p5 has a way to do this
}
