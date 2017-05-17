function Token(type, attribute){
  this.type = type;
  if(attribute){
    this.attribute = attribute;
  }
}

function Tokenizer(text){
    this.text = text;
    this.pos = 0;
    this.current_char = this.text.charAt(this.pos);
}

Tokenizer.prototype.get_next_token = function(){
  while (this.current_char){

    if (this.current_char === "X") {
      this.advance();
      num = this.get_number();
      return new Token("X", num);
    }

    if (this.current_char === "F") {
      this.advance();
      num = this.get_number();
      return new Token("F", num);
    }

    if (this.current_char === "L"){
      this.advance();
      num = this.get_number();
      return new Token("L", num);
    }

    if (this.current_char === "R"){
      this.advance();
      num = this.get_number();
      return new Token("R", num);
    }

    if (this.current_char === "{"){
      this.advance();
      return new Token("LBRACE");
    }

    if (this.current_char === "}"){
      this.advance();
      return new Token("RBRACE");
    }

    if (this.current_char === ' '){
      this.skip_white_space();
    }

  }
  return null;
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
    while (this.current_char && !isNaN(this.current_char)){
        curr_num += this.current_char;
        this.advance();
    }
    return parseInt(curr_num);
}

if(typeof window !== 'undefined'){
    window.Tokenizer = Tokenizer;
} else {
     module.exports = Tokenizer
}
