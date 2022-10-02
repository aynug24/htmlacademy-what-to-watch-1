import {CommandResult} from './command-result.js';

export default abstract class CliCommand {
  public readonly FullName?: string;
  public readonly ShortName?: string;

  protected constructor(fullName?: string, shortName?: string) {
    if (fullName === undefined && shortName === undefined) {
      throw new Error('At least one of full and short command names should be specified');
    }

    this.FullName = fullName;
    this.ShortName = shortName;
  }

  public abstract execute(...parameters: string[]): Promise<CommandResult>;
}
