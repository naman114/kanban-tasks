import { BoardAction } from "../types/boardActionTypes";
import { BoardDetailAction } from "../types/boardDetailActionTypes";
import { BoardDetailState, BoardGet } from "../types/boardTypes";

export const reducer = (state: BoardDetailState, action: BoardDetailAction) => {
  switch (action.type) {
    case "populate_board_detail": {
      return { ...state, [action.field]: action.value };
    }
  }
};
