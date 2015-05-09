var Opcode = require('./opcode');

module.exports = function(linker) {
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
