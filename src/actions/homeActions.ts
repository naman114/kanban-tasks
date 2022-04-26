import { HomeAction } from "../types/homeActionTypes";
import { BoardData } from "../types/homeTypes";

export const reducer = (
  state: BoardData[],
  action: HomeAction
): BoardData[] => {
  switch (action.type) {
    case "populate_board_data": {
      return [...state, ...action.data];
    }
  }
};
