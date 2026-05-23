export interface responseInterface<T> {
  code: number;
  data: T;
  meta: { [key: string]: any };
  message: string;
}