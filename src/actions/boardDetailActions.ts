import { BoardAction } from "../types/boardActionTypes";
import { BoardDetailAction } from "../types/boardDetailActionTypes";
import { BoardDetailState, BoardGet } from "../types/boardTypes";

export const reducer = (state: BoardDetailState, action: BoardDetailAction) => {
  switch (action.type) {
    case "populate_board_detail": {
      return {
        ...state,
        title: action.title,
        tasksGroups: action.taskGroups,
        statusList: action.statusList,
      };
    }
    case "add_new_status": {
      return {
        ...state,
        tasksGroups: [
          ...state.tasksGroups,
          { status: action.statusId, tasks: [] },
        ],
        statusList: [...state.statusList, action.createdStatus],
      };
    }
  }
};
