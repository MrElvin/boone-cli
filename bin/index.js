#!/usr/bin/env node
const process = require('process')
const program = require('commander')
const pkg = require('../package')
const initProject = require('../command/initProject')
const listTemplate = require('../command/listTemplate')

program
  .version(pkg.version, '-v, --version')

program
  .command('init')
  .description('init project')
  .alias('i')
  .action(initProject)

program
  .command('list')
  .description('list templates')
  .alias('l')
  .action(listTemplate)

program.parse(process.argv)
