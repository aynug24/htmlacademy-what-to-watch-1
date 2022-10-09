import CliCommand from './cli-command.abstract.js';
import {promises as fs} from 'fs';
import {CommandResult} from './command-result.js';

export default class VersionCommand extends CliCommand {
  private static outputColor = '#EFEC2C';

  constructor() {
    super('version', 'v');
  }

  public async execute(): Promise<CommandResult> {
    const packageJsonContent = await fs.readFile('./package.json', 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    return {
      result: packageJson.version,
      colorHex: VersionCommand.outputColor
    };
  }
}
