#!/usr/bin/env node

import CliCommandRegistry from './app/cli/cli-command-registry.js';
import HelpCommand from './cli-command/help-command.js';
import ImportCommand from './cli-command/import-command.js';
import VersionCommand from './cli-command/version-command.js';
import CliApplication from './app/cli/cli-application.js';

const commandRegistry = new CliCommandRegistry();
commandRegistry.registerCommands([
  new HelpCommand(), new ImportCommand(), new VersionCommand()
]);

const cliApp = new CliApplication(commandRegistry);
await cliApp.processCommandLine(process.argv.slice(2));
