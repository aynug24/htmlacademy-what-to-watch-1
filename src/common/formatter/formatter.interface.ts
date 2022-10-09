export interface FormatterInterface<T> {
  format(t: T): string;
}
