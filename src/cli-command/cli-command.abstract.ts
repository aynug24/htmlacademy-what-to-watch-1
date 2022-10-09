import {CommandResult} from './command-result.js';

export default abstract class CliCommand {
  public readonly fullName: string;
  public readonly shortName?: string;

  protected constructor(fullName: string, shortName?: string) {
    this.fullName = fullName;
    this.shortName = shortName;
  }

  public abstract execute(...parameters: string[]): Promise<CommandResult>;
}
