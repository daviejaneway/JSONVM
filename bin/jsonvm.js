#!/usr/bin/env node

var util = require('util');
var pjson = require('../package.json');
var JSONVM = require('../lib/jsonvm');
var JSONLD = require('../lib/jsonld');
var Opcode = require('../lib/opcode');

var Import = new Opcode('.import', 1, function(vm, operands) {
  var path = operands[0];
  var lib = require(path);
  vm.linker.loadModule(lib);
});

function initialiseProgram() {
  var program = require('commander');

  program.version(pjson.version);
  program.loadCore = true;

  program
    .command('run <module>')
    .description('Execute the given module')
    .option('-s, --strip', 'Run without linking against core.js, leaving only the .import opcode.')
    .action(function(cmd, options) {
      program.cmd = 'run';
      program.module = cmd;
      program.loadCore = !options.strip;
    });

  program.parse(process.argv);

  return program;
}

function runModule(vm, program) {
  var module = require(program.module);
  vm.run(module._instructions);
}

function initialise() {
  var program = initialiseProgram();


  var ld = new JSONLD(program.loadCore);
  var vm = new JSONVM(ld);

  ld.registerOpcode('.import', Import);

  if(program.cmd === 'run') {
    runModule(vm, program);
  }
}

try {
  initialise();
} catch(e) {
  console.log(e);
  process.exit(1);
}
