export interface ILogger {
  info(message: string, ...args: object[]): void;
  warn(message: string, ...args: object[]): void;
  error(message: string, ...args: object[]): void;
  debug(message: string, ...args: object[]): void;
}
