import { BoardAction } from "../types/boardActionTypes";
import { BoardGet } from "../types/boardTypes";

export const reducer = (state: BoardGet[], action: BoardAction) => {
  switch (action.type) {
    case "populate_boards": {
      return action.boards;
    }
    case "update_board": {
      return state.map((board) => {
        if (board.id === action.id) {
          return { ...board, [action.field]: action.value };
        }
        return board;
      });
    }
  }
};
