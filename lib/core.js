var Opcode = require('./opcode');

module.exports = {
  opcodes: [
    {
      opcode: ".push",
      num_operands: 1,
      execute: function(vm, operands) {
        vm.stack.push(operands[0]);
      }
    },
    {
      opcode: ".pop",
      num_operands: 0,
      execute: function(vm, operands) {
        vm.stack.pop();
      }
    },
    {
      opcode: ".stack",
      num_operands: 0,
      execute: function(vm, operands) {
        console.log(vm.stack);
      }
    },
    {
      opcode: ".puts",
      num_operands: 0,
      execute: function(vm, operands) {
        var val = vm.stack.pop();
        console.log(val);
      }
    },
    {
      opcode: ".alias",
      num_operands: 1,
      execute: function(vm, operands) {
        var start_index = vm.pc + 1;
        var instruction;
        while(true) {
          instruction = vm.instructions[vm.pc];

          if(instruction === null || instruction === undefined) {
            throw "Reached end of instruction set without finding closing '.ret' instruction";
          } else if(instruction['opcode'] === '.ret') {
            var end_index = vm.pc;
            vm.linker.registerOpcode(operands[0], new Opcode(operands[0], 0, function(vm, operands) {
              var tmp = vm.instructions;
              var pc = vm.pc;
              var instruction_slice = tmp.slice(start_index, end_index);

              vm.pc = 0;
              vm.run(instruction_slice);
              vm.instructions = tmp;
              vm.pc = pc;
            }));

            break;
          }

          vm.pc += 1;
        }
      }
    },
    {
      opcode: ".ret",
      num_operands: 0,
      execute: function(vm, operands) { /*NO-OP*/ }
    }
  ]
};
