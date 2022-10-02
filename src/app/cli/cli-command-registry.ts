import HelpCommand from '../../cli-command/help-command.js';
import CliCommand from '../../cli-command/cli-command.abstract.js';

export default class CliCommandRegistry {
  private shortNamesToCommands: Record<string, CliCommand> = {};
  private fullNamesToCommands: Record<string, CliCommand> = {};

  private defaultCommand = new HelpCommand();

  public registerCommands(commands: CliCommand[]): void {
    for (const command of commands) {
      if (command.FullName !== undefined) {
        this.fullNamesToCommands[command.FullName] = command;
      }
      if (command.ShortName !== undefined) {
        this.shortNamesToCommands[command.ShortName] = command;
      }
    }
  }

  public getCommand(commandName: string | undefined): CliCommand | undefined {
    if (commandName === undefined) {
      return this.defaultCommand;
    }

    const fullCommandName = commandName.slice(2);
    if (commandName.startsWith('--') && this.fullNamesToCommands[fullCommandName] !== undefined) {
      return this.fullNamesToCommands[fullCommandName];
    }
    const shortCommandName = commandName.slice(1);
    if (commandName.startsWith('-') && this.shortNamesToCommands[shortCommandName] !== undefined) {
      return this.shortNamesToCommands[shortCommandName];
    }
    return undefined;
  }
}
