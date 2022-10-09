import chalk from 'chalk';
import CliCommandRegistry from './cli-command-registry.js';

type ParsedCommandLine = Record<string, string[]>;

export default class CliApplication {
  private commandRegistry: CliCommandRegistry;

  constructor(commandRegistry: CliCommandRegistry) {
    this.commandRegistry = commandRegistry;
  }

  public async processCommandLine(argv: string[]): Promise<void> {
    const parsedCommandLine = this.parseCommandLine(argv);
    const [commandName] = Object.keys(parsedCommandLine);
    const command = this.commandRegistry.getCommand(commandName);
    if (!command) {
      throw new Error('Error while parsing command');
    }
    const commandArguments = parsedCommandLine[commandName] ?? [];
    const commandResult = await command.execute(...commandArguments);

    console.log(chalk.hex(commandResult.colorHex)(commandResult.result));
  }

  private parseCommandLine(cliArgs: string[]): ParsedCommandLine {
    const parsedCommandLine: ParsedCommandLine = {};
    let currentCommand: string | undefined = undefined;

    for (const arg of cliArgs) {
      if (arg.startsWith('-')) {
        currentCommand = arg;
        parsedCommandLine[currentCommand] = [];
      } else if (currentCommand) {
        parsedCommandLine[currentCommand].push(arg);
      } else {
        throw new Error('Options without -parameter are not supported');
      }
    }
    return parsedCommandLine;
  }
}
