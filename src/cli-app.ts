#!/usr/bin/env node

import CliCommandRegistry from './app/cli/cli-command-registry.js';
import HelpCommand from './cli-command/help-command.js';
import ImportCommand from './cli-command/import-command.js';
import VersionCommand from './cli-command/version-command.js';
import CliApplication from './app/cli/cli-application.js';
import GenerateCommand from './cli-command/generate-command.js';

const commandRegistry = new CliCommandRegistry();
commandRegistry.registerCommands([
  new HelpCommand(), new ImportCommand(), new VersionCommand(), new GenerateCommand()
]);

const cliApp = new CliApplication(commandRegistry);
await cliApp.processCommandLine(process.argv.slice(2));
