#!/usr/bin/env node
import { Command } from 'commander';
import { initProject } from './cli/init.js';
import { addModule } from './cli/addModule.js';
import { listModules } from './cli/listModules.js';
import { generateResource } from './cli/generate.js';
import { createModule } from './cli/createModule.js';
const program = new Command();
program
    .name('jshipster')
    .description('JSHipster CLI: Build modular TypeScript backends with an interactive experience.')
    .version('1.0.0');
program
    .command('init')
    .description('Initialize a new JSHipster project (interactive)')
    .action(initProject);
program
    .command('add [moduleName]')
    .description('Add a new module to the project (interactive if omitted)')
    .action(addModule);
program
    .command('list [searchTerm]')
    .description('List all available TypeScript module templates with optional search term')
    .action(listModules);
program
    .command('generate')
    .description('Generate a resource (e.g., service, controller) in TypeScript')
    .action(generateResource);
program
    .command('create [moduleName]')
    .description('Create a new module on npm')
    .action(createModule);
program.parse(process.argv);
