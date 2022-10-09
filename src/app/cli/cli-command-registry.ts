import HelpCommand from '../../cli-command/help-command.js';
import CliCommand from '../../cli-command/cli-command.abstract.js';

export default class CliCommandRegistry {
  private shortNamesToCommands: Record<string, CliCommand> = {};
  private fullNamesToCommands: Record<string, CliCommand> = {};

  private defaultCommand = new HelpCommand();

  public registerCommands(commands: CliCommand[]): void {
    for (const command of commands) {
      if (command.fullName) {
        this.fullNamesToCommands[command.fullName] = command;
      }
      if (command.shortName) {
        this.shortNamesToCommands[command.shortName] = command;
      }
    }
  }

  public getCommand(commandName?: string): CliCommand | undefined {
    if (!commandName) {
      return this.defaultCommand;
    }

    const fullCommandName = commandName.slice(2);
    if (commandName.startsWith('--') && this.fullNamesToCommands[fullCommandName]) {
      return this.fullNamesToCommands[fullCommandName];
    }

    const shortCommandName = commandName.slice(1);
    if (commandName.startsWith('-') && this.shortNamesToCommands[shortCommandName]) {
      return this.shortNamesToCommands[shortCommandName];
    }

    return undefined;
  }
}
