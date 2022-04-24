import { BoardGet } from "./boardTypes";

export type PopulateBoards = {
  type: "populate_boards";
  boards: BoardGet[];
};

export type UpdateBoard = {
  type: "update_board";
  id: number;
  field: string;
  value: string;
};

export type DeleteBoard = {
  type: "delete_board";
  id: number;
};

export type BoardAction = PopulateBoards | UpdateBoard | DeleteBoard;
