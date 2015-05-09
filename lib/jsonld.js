var Opcode = require('./opcode');

module.exports = function(loadCore) {
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

  if(loadCore) {
    var core = require('../lib/core');
    this.loadModule(core);
  }

  return this;
}
