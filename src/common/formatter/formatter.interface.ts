export interface IFormatter<T> {
  format(t: T): string;
}
