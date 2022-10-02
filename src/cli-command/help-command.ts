import CliCommand from './cli-command.abstract.js';
import {CommandResult} from './command-result.js';

export default class HelpCommand extends CliCommand {
  private static FULL_NAME = 'help';
  private static SHORT_NAME = 'h';

  private static HELP_MSG = `Программа для подготовки данных для REST API сервера.

        Пример:
            main.js --<command> [--arguments]

        Команды:
            --version:                   # выводит номер версии
            --help:                      # печатает этот текст
            --import <path>:             # импортирует данные из TSV
            --generator <n> <path> <url> # генерирует произвольное количество тестовых данных`;

  private static HELP_MSG_COLOR = '#5AAFCF';

  constructor() {
    super(HelpCommand.FULL_NAME, HelpCommand.SHORT_NAME);
  }

  public async execute(): Promise<CommandResult> {
    return {
      result: HelpCommand.HELP_MSG,
      colorHex: HelpCommand.HELP_MSG_COLOR
    };
  }
}
