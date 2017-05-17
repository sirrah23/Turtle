var Tokenizer = require('../public/Tokenizer.js');
var assert = require('assert');

describe('Tokenizer', function(){
  it('should see one movement token', function(){
    t_tokenizer = new Tokenizer("F50");
    token = t_tokenizer.get_next_token();
    assert.equal("F", token.type);
    assert.equal(50, token.attribute);
    token = t_tokenizer.get_next_token();
    assert.equal(null, token);
  });

  it('should see two movement tokens', function(){
    t_tokenizer = new Tokenizer("F50 L15");
    token = t_tokenizer.get_next_token();
    assert.equal("F", token.type);
    assert.equal(50, token.attribute);
    token = t_tokenizer.get_next_token();
    assert.equal("L", token.type);
    assert.equal(15, token.attribute);
  });

  it('should skip spaces and see two movement tokens', function(){
    t_tokenizer = new Tokenizer("       F50     L15     ");
    token = t_tokenizer.get_next_token();
    assert.equal("F", token.type);
    assert.equal(50, token.attribute);
    token = t_tokenizer.get_next_token();
    assert.equal("L", token.type);
    assert.equal(15, token.attribute);
  });

  it('should detect repeat token', function(){
    t_tokenizer = new Tokenizer("X14{F50}");
    token = t_tokenizer.get_next_token();
    assert.equal("X", token.type);
    assert.equal(14, token.attribute);
    token = t_tokenizer.get_next_token();
    assert.equal("LBRACE", token.type);
    token = t_tokenizer.get_next_token();
    assert.equal("F", token.type);
    assert.equal(50, token.attribute);
    token = t_tokenizer.get_next_token();
    assert.equal("RBRACE", token.type);
    token = t_tokenizer.get_next_token();
    assert.equal(null, token);
  });
});
