import { BoardAction } from "../types/boardActionTypes";
import { BoardGet } from "../types/boardTypes";

export const reducer = (state: BoardGet[], action: BoardAction) => {
  switch (action.type) {
    case "populate_boards": {
      return action.boards;
    }
  }
};
