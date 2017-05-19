var Tokenizer = require('../public/Tokenizer.js');
var assert = require('assert');

describe('Tokenizer', function(){
  it('should see one movement token', function(){
    var t_tokenizer = new Tokenizer("F50");
    var token = t_tokenizer.get_next_token();
    assert.equal("F", token.type);
    assert.equal(50, token.attribute);
    var token = t_tokenizer.get_next_token();
    assert.equal(null, token);
  });

  it('should see two movement tokens', function(){
    var t_tokenizer = new Tokenizer("F50 L15");
    var token = t_tokenizer.get_next_token();
    assert.equal("F", token.type);
    assert.equal(50, token.attribute);
    var token = t_tokenizer.get_next_token();
    assert.equal("L", token.type);
    assert.equal(15, token.attribute);
  });

  it('should skip spaces and see two movement tokens', function(){
    var t_tokenizer = new Tokenizer("       F50     L15     ");
    var token = t_tokenizer.get_next_token();
    assert.equal("F", token.type);
    assert.equal(50, token.attribute);
    var token = t_tokenizer.get_next_token();
    assert.equal("L", token.type);
    assert.equal(15, token.attribute);
  });

  it('should detect repeat token', function(){
    var t_tokenizer = new Tokenizer("X14{F50}");
    var token = t_tokenizer.get_next_token();
    assert.equal("X", token.type);
    assert.equal(14, token.attribute);
    var token = t_tokenizer.get_next_token();
    assert.equal("LBRACE", token.type);
    var token = t_tokenizer.get_next_token();
    assert.equal("F", token.type);
    assert.equal(50, token.attribute);
    var token = t_tokenizer.get_next_token();
    assert.equal("RBRACE", token.type);
    var token = t_tokenizer.get_next_token();
    assert.equal(null, token);
  });
});
