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

export type Errors<T> = Partial<Record<keyof T, string>>;

// https://stackoverflow.com/questions/49285864/is-there-a-valueof-similar-to-keyof-in-typescript
type ValueOf<T> = T[keyof T];
