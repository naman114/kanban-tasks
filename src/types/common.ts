export type Pagination<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type PaginationParams = {
  offset?: number;
  limit?: number;
};

// https://stackoverflow.com/questions/43080547/how-to-override-type-properties-in-typescript
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
