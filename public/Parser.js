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
    return new ASTNode("PROGRAM", null, children_list);
}

Parser.prototype.children_list = function(){
    var children_list = [];
    var break_flag = false;
    while(this.current_token){
      switch(this.current_token.type){
          case "F":
          case "R":
          case "L":
            children_list.push(this.movement_node());
            break;
          case "LBRACE":
            children_list.push(this.replica_node());
            break;
          case "RBRACE":
            break_flag = true;
          default:
            throw "Syntax error";
      }
      if(break_flag){return children_list;}
    }
    return children_list;
}

Parser.prototype.movement_node = function(){
  var token = this.current_token;
  this.eat(["F", "R", "L"]);
  return ASTNode(token.type, token.attribute, []);
}

Parser.prototype.replica_node = function(){
    this.eat(["LBRACE"]);
    var replica_token = this.current_token;
    this.eat(["X"])
    var children_list = this.children_list();
    this.eat(["RBRACE"]);
    return ASTNode(
      replica_token.type,
      replica_token.attribute,
      children_list()
    );
}

Parser.prototype.eat = function(token_type_list){
  if (!token_type_list.includes(this.current_token.type)){
      throw "Syntax error"
  }
  this.current_token = this.parser.get_next_token();
}

Parser.prototype.parse = function(){
    return this.program();
}

if(typeof window !== 'undefined'){
    window.Parser = Parser;
} else {
     module.exports = Parser;
}
