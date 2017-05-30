var Tokenizer = require('../public/Tokenizer.js');
var Parser = require('../public/Parser.js');
var Interpreter = require('../public/Interpreter.js');
var Interpreter = require('../public/Manager.js');
var assert = require('assert');

describe('Tokenizer', function(){
  it('should see one two tokens - character and number', function(){
    var t_tokenizer = new Tokenizer("F50");
    var token = t_tokenizer.get_next_token();
    assert.equal(token.type, "CHARACTER");
    assert.equal(token.value, "F");
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "NUMBER");
    assert.equal(token.value, 50);
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "EOF");
    assert.equal(token.value, null);
  });

  it('should see four tokens - character, number pairs', function(){
    var t_tokenizer = new Tokenizer("F50 L15");
    var token = t_tokenizer.get_next_token();
    assert.equal(token.type, "CHARACTER");
    assert.equal(token.value, "F");
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "NUMBER");
    assert.equal(token.value, 50);
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "CHARACTER");
    assert.equal(token.value, "L");
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "NUMBER");
    assert.equal(token.value, 15);
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "EOF");
    assert.equal(token.value, null);
  });

  it('should skip spaces and see two movement tokens', function(){
    var t_tokenizer = new Tokenizer("F50 L15");
    var token = t_tokenizer.get_next_token();
    assert.equal(token.type, "CHARACTER");
    assert.equal(token.value, "F");
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "NUMBER");
    assert.equal(token.value, 50);
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "CHARACTER");
    assert.equal(token.value, "L");
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "NUMBER");
    assert.equal(token.value, 15);
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "EOF");
    assert.equal(token.value, null);
  });

  it('should detect repeat token', function(){
    var t_tokenizer = new Tokenizer("X14{F50}");
    var token = t_tokenizer.get_next_token();
    assert.equal(token.type, "CHARACTER");
    assert.equal(token.value, "X");
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "NUMBER");
    assert.equal(token.value, 14);
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "LBRACE");
    assert.equal(token.value, "{");
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "CHARACTER");
    assert.equal(token.value, "F");
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "NUMBER");
    assert.equal(token.value, 50);
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "RBRACE");
    assert.equal(token.value, "}");
    token = t_tokenizer.get_next_token();
    assert.equal(token.type, "EOF");
    assert.equal(token.value, null);
  });
});

describe('Parser', function(){
    it('should generate a program node with one child', function(){
      var t_tokenizer = new Tokenizer("F13");
      var t_parser = new Parser(t_tokenizer);
      var tree = t_parser.parse();
      assert.equal(tree.type, "PROGRAM");
      assert.equal(tree.attribute, null);
      assert.equal(tree.children.length, 1);
      assert.equal(tree.children[0].type, "MOVE_FORWARD");
      assert.equal(tree.children[0].attribute, 13);
    });

    it('should generate a program node with two children', function(){
      var t_tokenizer = new Tokenizer("F13    R92");
      var t_parser = new Parser(t_tokenizer);
      var tree = t_parser.parse();
      assert.equal(tree.type, "PROGRAM");
      assert.equal(tree.attribute, null);
      assert.equal(tree.children.length, 2);
      assert.equal(tree.children[0].type, "MOVE_FORWARD");
      assert.equal(tree.children[0].attribute, 13);
      assert.equal(tree.children[1].type, "ROTATE_RIGHT");
      assert.equal(tree.children[1].attribute, 92);
    });

    it('should generate a program node with two children', function(){
      var t_tokenizer = new Tokenizer("F13    L92");
      var t_parser = new Parser(t_tokenizer);
      var tree = t_parser.parse();
      assert.equal(tree.type, "PROGRAM");
      assert.equal(tree.attribute, null);
      assert.equal(tree.children.length, 2);
      assert.equal(tree.children[0].type, "MOVE_FORWARD");
      assert.equal(tree.children[0].attribute, 13);
      assert.equal(tree.children[1].type, "ROTATE_LEFT");
      assert.equal(tree.children[1].attribute, 92);
    });

    it('should generate a program node that has a replica node', function(){
      var t_tokenizer = new Tokenizer("X50{F10 L5}");
      var t_parser = new Parser(t_tokenizer);
      var tree = t_parser.parse();
      assert.equal(tree.type, "PROGRAM");
      assert.equal(tree.attribute, null);
      assert.equal(tree.children.length, 1);
      assert.equal(tree.children[0].type, "REPLICATE");
      assert.equal(tree.children[0].attribute, 50);
      assert.equal(tree.children[0].children.length, 2);
      assert.equal(tree.children[0].children[0].type, "MOVE_FORWARD");
      assert.equal(tree.children[0].children[0].attribute, 10);
      assert.equal(tree.children[0].children[1].type, "ROTATE_LEFT");
      assert.equal(tree.children[0].children[1].attribute, 5);
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
      assert.equal(move.value.action, "MOVE_FORWARD");
      assert.equal(move.value.attribute, 100);
      move = move_generator.next();
      assert.equal(move.value.action, "STOP");
      assert.equal(move.value.attribute, null);
  });

  it("should return move forward and rotate actions", function(){
      var t_tokenizer = new Tokenizer("F100 R12");
      var t_parser = new Parser(t_tokenizer);
      var t_interpreter = new Interpreter(t_parser);
      var move_generator = t_interpreter.get_move_generator();
      var move = move_generator.next();
      assert.equal(move.value.action, "MOVE_FORWARD");
      assert.equal(move.value.attribute, 100);
      move = move_generator.next();
      assert.equal(move.value.action, "ROTATE_RIGHT");
      assert.equal(move.value.attribute, 12);
      move = move_generator.next();
      assert.equal(move.value.action, "STOP");
      assert.equal(move.value.attribute, null);
  });

  it("should replicate action set", function(){
      var t_tokenizer = new Tokenizer("X2{F50 L12}");
      var t_parser = new Parser(t_tokenizer);
      var t_interpreter = new Interpreter(t_parser);
      var move_generator = t_interpreter.get_move_generator();
      var move = move_generator.next();
      assert.equal(move.value.action, "MOVE_FORWARD");
      assert.equal(move.value.attribute, 50);
      move = move_generator.next();
      assert.equal(move.value.action, "ROTATE_LEFT");
      assert.equal(move.value.attribute, 12);
      move = move_generator.next();
      assert.equal(move.value.action, "MOVE_FORWARD");
      assert.equal(move.value.attribute, 50);
      move = move_generator.next();
      assert.equal(move.value.action, "ROTATE_LEFT");
      assert.equal(move.value.attribute, 12);
      move = move_generator.next();
      assert.equal(move.value.action, "STOP");
      assert.equal(move.value.attribute, null);
  });

  it("should mix moves and replication action set", function(){
      var t_tokenizer = new Tokenizer("R19 F13 L14 X2{F50 L12}");
      var t_parser = new Parser(t_tokenizer);
      var t_interpreter = new Interpreter(t_parser);
      var move_generator = t_interpreter.get_move_generator();
      var move = move_generator.next();
      assert.equal(move.value.action, "ROTATE_RIGHT");
      assert.equal(move.value.attribute, 19);
      move = move_generator.next();
      assert.equal(move.value.action, "MOVE_FORWARD");
      assert.equal(move.value.attribute, 13);
      move = move_generator.next();
      assert.equal(move.value.action, "ROTATE_LEFT");
      assert.equal(move.value.attribute, 14);
      move = move_generator.next();
      assert.equal(move.value.action, "MOVE_FORWARD");
      assert.equal(move.value.attribute, 50);
      move = move_generator.next();
      assert.equal(move.value.action,"ROTATE_LEFT");
      assert.equal(move.value.attribute, 12);
      move = move_generator.next();
      assert.equal(move.value.action, "MOVE_FORWARD");
      assert.equal(move.value.attribute, 50);
      move = move_generator.next();
      assert.equal(move.value.action,"ROTATE_LEFT");
      assert.equal(move.value.attribute, 12);
      move = move_generator.next();
      assert.equal(move.value.action, "STOP");
      assert.equal(move.value.attribute, null);
  });

});
