export interface IBaseResponse<T> {
  data: T | null;
  error: string | null;
}
