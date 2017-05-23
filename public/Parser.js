var Tokenizer = require('./Tokenizer.js');

function ASTNode(type, attribute, children){
    this.type = type;
    this.attribute = attribute;
    this.children = children;
}

function Parser(tokenizer){
  this.tokenizer = tokenizer;
  this.current_token = this.tokenizer.get_next_token();
}

Parser.prototype.program = function(){
    children_list = this.children_list();
    if (this.current_token && this.current_token.type !== "EOF"){
        throw "Syntax error";
    }
    return new ASTNode("PROGRAM", null, children_list);
}

Parser.prototype.children_list = function(){
    var children_list = [];
    var break_flag = false;
    while(this.current_token && this.current_token.type !== "EOF"){
      switch(this.current_token.type){
          case "CHARACTER":
            children_list.push(this.character_node());
            break;
          case "NUMBER":
            throw "Syntax error"; //Characters before numbers!
            break;
          case "LBRACE":
            throw "Syntax error"; //Left brace comes after the "X"
            break;
          case "RBRACE":
            break_flag = true;
            break;
          default:
            throw "Syntax error";
      }
      if(break_flag){return children_list;}
    }
    return children_list;
}

Parser.prototype.character_node = function(){
    if (this.current_token.value !== "X"){
      return this.movement_node();
    } else {
      return this.replica_node();
    }
}

Parser.prototype.movement_node = function(){
  if (!["F", "L", "R"].includes(this.current_token.value)){
    throw "Syntax error";
  }
  var char_token = this.current_token;
  this.eat(["CHARACTER"]);
  var num_token = this.current_token;
  this.eat(["NUMBER"]);
  return new ASTNode(char_token.value, num_token.value, []);
}

Parser.prototype.replica_node = function(){
    var char_token = this.current_token;
    if (char_token.value !== "X"){
      throw "Syntax error";
    }
    this.eat(["CHARACTER"]);
    var num_token = this.current_token;
    this.eat(["NUMBER"])
    this.eat(["LBRACE"]);
    var children_list = this.children_list();
    this.eat(["RBRACE"]);
    return new ASTNode(
      char_token.value,
      num_token.value,
      children_list
    );
}

Parser.prototype.eat = function(token_type_list){
  if (!token_type_list.includes(this.current_token.type)){
      throw "Syntax error";
  }
  this.current_token = this.tokenizer.get_next_token();
}

Parser.prototype.parse = function(){
    return this.program();
}

if(typeof window !== 'undefined'){
    window.Parser = Parser;
} else {
     module.exports = Parser;
}
