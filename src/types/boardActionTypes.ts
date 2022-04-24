import { BoardGet } from "./boardTypes";

export type PopulateBoards = {
  type: "populate_boards";
  boards: BoardGet[];
};

export type BoardAction = PopulateBoards;
