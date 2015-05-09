module.exports = function(op_name, num_operands, exec_func) {
  this.op_name = op_name;
  this.num_operands = num_operands;

  this.execute = function(vm, operands) {
    if(operands === undefined && num_operands > 0) {
      throw "Expected " + num_operands + ", received none";
    } else if(operands.length != num_operands) {
      throw "Opcode '" + op_name + "' expects " +
        num_operands + " operands, received " + operands.length;
    }

    exec_func(vm, operands);
  }

  return this;
}
