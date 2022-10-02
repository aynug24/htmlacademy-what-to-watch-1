import CliCommand from './cli-command.abstract.js';
import {promises as fs} from 'fs';
import {CommandResult} from './command-result.js';

export default class VersionCommand extends CliCommand {
  private static FULL_NAME = 'version';
  private static SHORT_NAME = 'v';

  private static RES_COLOR = '#EFEC2C';

  constructor() {
    super(VersionCommand.FULL_NAME, VersionCommand.SHORT_NAME);
  }

  public async execute(): Promise<CommandResult> {
    const packageJsonContent = await fs.readFile('./package.json', 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    return {
      result: packageJson.version,
      colorHex: VersionCommand.RES_COLOR
    };
  }
}
