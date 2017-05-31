function isLetter(str){
  return str.length === 1 && str.match(/[a-z]/i);
}

function isDigit(str){
  return str.length === 1 
  && str.charCodeAt(0) >= 48
  && str.charCodeAt(0) <= 57;
}

function Token(type, value){
  this.type = type;
  this.value = value;
}

function Tokenizer(text){
    this.text = text;
    this.pos = 0;
    this.current_char = this.text.charAt(this.pos);
}

Tokenizer.prototype.get_next_token = function(){
  while (this.current_char){

    if (isLetter(this.current_char)) {
      var char = this.current_char;
      this.advance();
      return new Token("CHARACTER", char);
    }

    if (this.current_char === "{"){
      this.advance();
      return new Token("LBRACE", "{");
    }

    if (this.current_char === "}"){
      this.advance();
      return new Token("RBRACE", "}");
    }

    if (this.current_char === ' '){
      this.skip_white_space();
      continue;
    }

    if(isDigit(this.current_char)){
        var num = this.get_number();
        return new Token("NUMBER", num);
    }

    throw "Unexpected character: " + this.current_char;

  }
  return new Token("EOF", null);
}

Tokenizer.prototype.skip_white_space = function(){
  while (this.current_char && this.current_char === ' '){
    this.advance();
  }
}

Tokenizer.prototype.advance = function(){
  this.pos += 1;
  if (this.pos < this.text.length){
    this.current_char = this.text.charAt(this.pos)
  } else {
    this.current_char = null;
  }
}

Tokenizer.prototype.get_number = function(){
    curr_num = ""
    while (this.current_char && isDigit(this.current_char)){
        curr_num += this.current_char;
        this.advance();
    }
    return parseInt(curr_num);
}

if(typeof window === 'undefined'){
     module.exports = Tokenizer
}
