import CliCommand from './cli-command.abstract.js';
import {CommandResult} from './command-result.js';

export default class HelpCommand extends CliCommand {

  private static helpMessage = `Программа для подготовки данных для REST API сервера.

        Пример:
            main.js --<command> [--arguments]

        Команды:
            --version:                   # выводит номер версии
            --help:                      # печатает этот текст
            --import <path>:             # импортирует данные из TSV
            --generator <n> <path> <url> # генерирует произвольное количество тестовых данных`;

  private static helpMessageColor = '#5AAFCF';

  constructor() {
    super('help', 'h');
  }

  public async execute(): Promise<CommandResult> {
    return {
      result: HelpCommand.helpMessage,
      colorHex: HelpCommand.helpMessageColor
    };
  }
}
