var Tokenizer = require('../public/Tokenizer.js');
var Parser = require('../public/Parser.js');
var Interpreter = require('../public/Interpreter.js');
var assert = require('assert');

describe('Tokenizer', function(){
  it('should see one two tokens - character and number', function(){
    var t_tokenizer = new Tokenizer("F50");
    var token = t_tokenizer.get_next_token();
    assert.equal("CHARACTER", token.type);
    assert.equal("F", token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("NUMBER", token.type);
    assert.equal(50, token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("EOF", token.type);
    assert.equal(null, token.value);
  });

  it('should see four tokens - character, number pairs', function(){
    var t_tokenizer = new Tokenizer("F50 L15");
    var token = t_tokenizer.get_next_token();
    assert.equal("CHARACTER", token.type);
    assert.equal("F", token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("NUMBER", token.type);
    assert.equal(50, token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("CHARACTER", token.type);
    assert.equal("L", token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("NUMBER", token.type);
    assert.equal(15, token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("EOF", token.type);
    assert.equal(null, token.value);
  });

  it('should skip spaces and see two movement tokens', function(){
    var t_tokenizer = new Tokenizer("F50 L15");
    var token = t_tokenizer.get_next_token();
    assert.equal("CHARACTER", token.type);
    assert.equal("F", token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("NUMBER", token.type);
    assert.equal(50, token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("CHARACTER", token.type);
    assert.equal("L", token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("NUMBER", token.type);
    assert.equal(15, token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("EOF", token.type);
    assert.equal(null, token.value);
  });

  it('should detect repeat token', function(){
    var t_tokenizer = new Tokenizer("X14{F50}");
    var token = t_tokenizer.get_next_token();
    assert.equal("CHARACTER", token.type);
    assert.equal("X", token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("NUMBER", token.type);
    assert.equal(14, token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("LBRACE", token.type);
    assert.equal("{", token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("CHARACTER", token.type);
    assert.equal("F", token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("NUMBER", token.type);
    assert.equal(50, token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("RBRACE", token.type);
    assert.equal("}", token.value);
    token = t_tokenizer.get_next_token();
    assert.equal("EOF", token.type);
    assert.equal(null, token.value);
  });
});

describe('Parser', function(){
    it('should generate a program node with one child', function(){
      var t_tokenizer = new Tokenizer("F13");
      var t_parser = new Parser(t_tokenizer);
      var tree = t_parser.parse();
      assert.equal("PROGRAM", tree.type);
      assert.equal(null, tree.attribute);
      assert.equal(1, tree.children.length);
      assert.equal("MOVE_FORWARD", tree.children[0].type);
      assert.equal(13, tree.children[0].attribute);
    });

    it('should generate a program node with two children', function(){
      var t_tokenizer = new Tokenizer("F13    R92");
      var t_parser = new Parser(t_tokenizer);
      var tree = t_parser.parse();
      assert.equal("PROGRAM", tree.type);
      assert.equal(null, tree.attribute);
      assert.equal(2, tree.children.length);
      assert.equal("MOVE_FORWARD", tree.children[0].type);
      assert.equal(13, tree.children[0].attribute);
      assert.equal("ROTATE_RIGHT", tree.children[1].type);
      assert.equal(92, tree.children[1].attribute);
    });

    it('should generate a program node with two children', function(){
      var t_tokenizer = new Tokenizer("F13    L92");
      var t_parser = new Parser(t_tokenizer);
      var tree = t_parser.parse();
      assert.equal("PROGRAM", tree.type);
      assert.equal(null, tree.attribute);
      assert.equal(2, tree.children.length);
      assert.equal("MOVE_FORWARD", tree.children[0].type);
      assert.equal(13, tree.children[0].attribute);
      assert.equal("ROTATE_LEFT", tree.children[1].type);
      assert.equal(92, tree.children[1].attribute);
    });

    it('should generate a program node that has a replica node', function(){
      var t_tokenizer = new Tokenizer("X50{F10 L5}");
      var t_parser = new Parser(t_tokenizer);
      var tree = t_parser.parse();
      assert.equal("PROGRAM", tree.type);
      assert.equal(null, tree.attribute);
      assert.equal(1, tree.children.length);
      assert.equal("REPLICATE", tree.children[0].type);
      assert.equal(50, tree.children[0].attribute);
      assert.equal(2, tree.children[0].children.length);
      assert.equal("MOVE_FORWARD", tree.children[0].children[0].type);
      assert.equal(10, tree.children[0].children[0].attribute);
      assert.equal("ROTATE_LEFT", tree.children[0].children[1].type);
      assert.equal(5, tree.children[0].children[1].attribute);
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

describe("Interpreter", function(){
  it("should return a move forward action", function(){
      var t_tokenizer = new Tokenizer("F100");
      var t_parser = new Parser(t_tokenizer);
      var t_interpreter = new Interpreter(t_parser);
      var move_generator = t_interpreter.get_move_generator();
      var move = move_generator.next();
      assert.equal("MOVE_FORWARD", move.value.action);
      assert.equal(100, move.value.attribute);
      move = move_generator.next();
      assert.equal("STOP", move.value.action);
      assert.equal(null, move.value.attribute);
  });

  it("should return move forward and rotate actions", function(){
      var t_tokenizer = new Tokenizer("F100 R12");
      var t_parser = new Parser(t_tokenizer);
      var t_interpreter = new Interpreter(t_parser);
      var move_generator = t_interpreter.get_move_generator();
      var move = move_generator.next();
      assert.equal("MOVE_FORWARD", move.value.action);
      assert.equal(100, move.value.attribute);
      move = move_generator.next();
      assert.equal("ROTATE_RIGHT", move.value.action);
      assert.equal(12, move.value.attribute);
      move = move_generator.next();
      assert.equal("STOP", move.value.action);
      assert.equal(null, move.value.attribute);
  });

  it("should replicate action set", function(){
      var t_tokenizer = new Tokenizer("X2{F50 L12}");
      var t_parser = new Parser(t_tokenizer);
      var t_interpreter = new Interpreter(t_parser);
      var move_generator = t_interpreter.get_move_generator();
      var move = move_generator.next();
      assert.equal("MOVE_FORWARD", move.value.action);
      assert.equal(50, move.value.attribute);
      move = move_generator.next();
      assert.equal("ROTATE_LEFT", move.value.action);
      assert.equal(12, move.value.attribute);
      move = move_generator.next();
      assert.equal("MOVE_FORWARD", move.value.action);
      assert.equal(50, move.value.attribute);
      move = move_generator.next();
      assert.equal("ROTATE_LEFT", move.value.action);
      assert.equal(12, move.value.attribute);
      move = move_generator.next();
      assert.equal("STOP", move.value.action);
      assert.equal(null, move.value.attribute);
  });

  it("should mix moves and replication action set", function(){
      var t_tokenizer = new Tokenizer("R19 F13 L14 X2{F50 L12}");
      var t_parser = new Parser(t_tokenizer);
      var t_interpreter = new Interpreter(t_parser);
      var move_generator = t_interpreter.get_move_generator();
      var move = move_generator.next();
      assert.equal("ROTATE_RIGHT", move.value.action);
      assert.equal(19, move.value.attribute);
      move = move_generator.next();
      assert.equal("MOVE_FORWARD", move.value.action);
      assert.equal(13, move.value.attribute);
      move = move_generator.next();
      assert.equal("ROTATE_LEFT", move.value.action);
      assert.equal(14, move.value.attribute);
      move = move_generator.next();
      assert.equal("MOVE_FORWARD", move.value.action);
      assert.equal(50, move.value.attribute);
      move = move_generator.next();
      assert.equal("ROTATE_LEFT", move.value.action);
      assert.equal(12, move.value.attribute);
      move = move_generator.next();
      assert.equal("MOVE_FORWARD", move.value.action);
      assert.equal(50, move.value.attribute);
      move = move_generator.next();
      assert.equal("ROTATE_LEFT", move.value.action);
      assert.equal(12, move.value.attribute);
      move = move_generator.next();
      assert.equal("STOP", move.value.action);
      assert.equal(null, move.value.attribute);
  });

});
