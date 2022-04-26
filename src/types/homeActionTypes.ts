import { BoardData } from "./homeTypes";

export type PopulateBoardData = {
  type: "populate_board_data";
  data: BoardData[];
};

export type HomeAction = PopulateBoardData;
