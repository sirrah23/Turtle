var Tokenizer = require('../public/Tokenizer.js');
var Parser = require('../public/Parser.js');
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

describe('Parser', function(){
    it('should generate a program node with one child', function(){
      var t_tokenizer = new Tokenizer("F13");
      var t_parser = new Parser(t_tokenizer);
      var program_node = t_parser.parse();
      assert.equal("PROGRAM", program_node.type);
      assert.equal(null, program_node.attribute);
      assert.equal(1, program_node.children.length);
      assert.equal("F", program_node.children[0].type);
      assert.equal(13, program_node.children[0].attribute);
    });

    it('should generate a program node with two children', function(){
      var t_tokenizer = new Tokenizer("F13    L92");
      var t_parser = new Parser(t_tokenizer);
      var program_node = t_parser.parse();
      assert.equal("PROGRAM", program_node.type);
      assert.equal(null, program_node.attribute);
      assert.equal(2, program_node.children.length);
      assert.equal("F", program_node.children[0].type);
      assert.equal(13, program_node.children[0].attribute);
      assert.equal("L", program_node.children[1].type);
      assert.equal(92, program_node.children[1].attribute);
    });

    it('should generate a program node with two children', function(){
      var t_tokenizer = new Tokenizer("F13    L92");
      var t_parser = new Parser(t_tokenizer);
      var program_node = t_parser.parse();
      assert.equal("PROGRAM", program_node.type);
      assert.equal(null, program_node.attribute);
      assert.equal(2, program_node.children.length);
      assert.equal("F", program_node.children[0].type);
      assert.equal(13, program_node.children[0].attribute);
      assert.equal("L", program_node.children[1].type);
      assert.equal(92, program_node.children[1].attribute);
    });

    it('should generate a program node that has a replica node', function(){
      var t_tokenizer = new Tokenizer("X50{F10 L5}");
      var t_parser = new Parser(t_tokenizer);
      var program_node = t_parser.parse();
      assert.equal("PROGRAM", program_node.type);
      assert.equal(null, program_node.attribute);
      assert.equal(1, program_node.children.length);
      assert.equal("X", program_node.children[0].type);
      assert.equal(50, program_node.children[0].attribute);
      assert.equal(2, program_node.children[0].children.length);
      assert.equal("F", program_node.children[0].children[0].type);
      assert.equal(10, program_node.children[0].children[0].attribute);
      assert.equal("L", program_node.children[0].children[1].type);
      assert.equal(5, program_node.children[0].children[1].attribute);
    });

    it('should see brace related syntax errors', function(){
      var t_tokenizer = new Tokenizer("X50}F10 L5{");
      var t_parser = new Parser(t_tokenizer);
      assert.throws(
      t_parser.parse.bind(t_parser),
      /Syntax error/,
      "Did not throw syntax error");
    });
});
