import chalk from 'chalk';
import CliCommandRegistry from './cli-command-registry.js';
import {ILogger} from '../../common/logger/logger.interface.js';
import ConsoleLoggerService from '../../common/logger/console-logger.service.js';

type ParsedCommandLine = Record<string, string[]>;

export default class CliApplication {
  private commandRegistry: CliCommandRegistry;
  private logger: ILogger;

  constructor(commandRegistry: CliCommandRegistry) {
    this.commandRegistry = commandRegistry;
    this.logger = new ConsoleLoggerService();
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

    this.logger.info(chalk.hex(commandResult.colorHex)(commandResult.result));
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
