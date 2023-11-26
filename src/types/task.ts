export interface Task<T, O> {
  execute(input: T): Promise<O>;
}
