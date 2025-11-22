#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
    .name('orchestrator-cli')
    .description('CLI to interact with the Drone Orchestrator')
    .version('0.1.0');

program.parse(process.argv);
