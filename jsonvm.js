var util = require('util');
var Opcode = require('./opcode');

function JSONVM(linker) {
  this.stack = [];
  this.linker = linker;
  this.pc = 0;
  var _self = this;

  this.run = function(instruction_list) {
    _self.instructions = instruction_list;

    for(; this.pc < instruction_list.length; this.pc++) {
      var instruction = instruction_list[this.pc];
      var opcode = linker.lookupSymbol(instruction.opcode);

      opcode.execute(this, instruction.operands);
    }
  }

  return this;
}

function JSONLD() {
  this.symbol_table = {};
  var _self = this;

  this.registerOpcode = function(op_name, opcode) {
    if(_self.symbol_table[op_name] === undefined) {
      _self.symbol_table[op_name] = opcode;
    } else {
      throw "Duplicate symbol: opcode '" + op_name + "'";
    }
  }

  this.lookupSymbol = function(symbol) {
    var tmp = symbol;
    if((symbol = _self.symbol_table[symbol]) === undefined) {
      throw "Undefined symbol: '" + tmp + "'";
    }

    return symbol;
  }

  this.loadModule = function(_module) {
    for(var index in _module.opcodes) {
      var opcode = _module.opcodes[index];
      _self.registerOpcode(opcode.opcode, new Opcode(opcode.opcode,
        opcode.num_operands, opcode.execute));
    }
  }

  return this;
}

var Ret = new Opcode('.ret', 0, function(vm, operands) {});

var Import = new Opcode('.import', 1, function(vm, operands) {
  var path = operands[0];
  var lib = require(path);
  vm.linker.loadModule(lib);
});

var ld = new JSONLD();

ld.registerOpcode('.import', Import);

var vm = new JSONVM(ld);
vm.run(
  [
    {
      "opcode": ".import",
      "operands": [
        "./libs/core"
      ]
    },
    {
      "opcode": ".alias",
      "operands": [
        "HELLO"
      ]
    },
    {
      "opcode": ".push",
      "operands": [
        "Hello, World!"
      ]
    },
    {
      "opcode": ".puts",
      "operands": []
    },
    {
      "opcode": ".ret",
      "operands": []
    },
    {
      "opcode": "HELLO",
      "operands": []
    }
  ]
);
