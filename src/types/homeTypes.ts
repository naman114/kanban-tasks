import { BoardGet, TaskGroupByStatus } from "./boardTypes";

export type BoardData = {
  board: BoardGet;
  data: TaskGroupByStatus[];
};
