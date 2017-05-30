function Movement(action, attribute){
  this.action = action;
  this.attribute = attribute;
}

function Interpreter(parser){
  this.parser=parser;
  this.ast = this.parser.parse();
}

Interpreter.prototype.get_move_generator = function(){
  return this.move_generator.bind(this)();
}

Interpreter.prototype.move_generator = function*(children){
    var next_move;
    if (!children){
      var move_obtainer = this.get_next_move(this.ast.children);
    } else {
      var move_obtainer = this.get_next_move(children);
    }
    while(true){
      next_move = move_obtainer.next();
      if(!next_move.done){
        yield next_move.value;
      }else{
        break;
      }
    }
    yield new Movement("STOP", null);
}

Interpreter.prototype.get_next_move = function*(children){
  for(var i = 0; i < children.length; i++){
    switch(children[i].type){
      case "MOVE_FORWARD":
          yield new Movement("MOVE_FORWARD", children[i].attribute)
          break;
      case "ROTATE_LEFT":
          yield new Movement("ROTATE_LEFT", children[i].attribute)
          break;
      case "ROTATE_RIGHT":
          yield new Movement("ROTATE_RIGHT", children[i].attribute)
          break;
      case "REPLICATE":
        var mgen, next_move;
        for(var j = 0; j < children[i].attribute; j++){
          mgen = this.get_next_move(children[i].children);
          next_move = mgen.next();
          while(!next_move.done){
            yield next_move.value;
            next_move = mgen.next();
          }
        }
        break;
      default:
    }
  }
}

if(typeof window === 'undefined'){
     module.exports = Interpreter;
}
