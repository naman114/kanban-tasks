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

export type BoardAction = PopulateBoards | UpdateBoard;
