import { ValueOf } from "raviger/dist/types";
import { TaskGet, BoardDetailState } from "./boardTypes";

export type PopulateBoardDetail = {
  type: "populate_board_detail";
  field: string;
  value: ValueOf<BoardDetailState>;
};

export type BoardDetailAction = PopulateBoardDetail;
