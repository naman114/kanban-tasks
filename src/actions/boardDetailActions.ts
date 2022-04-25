import { BoardDetailAction } from "../types/boardDetailActionTypes";
import { BoardDetailState } from "../types/boardTypes";

export const reducer = (
  state: BoardDetailState,
  action: BoardDetailAction
): BoardDetailState => {
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
    case "add_new_task": {
      return {
        ...state,
        tasksGroups: state.tasksGroups.map((group) => {
          if (group.status === action.statusId) {
            return {
              ...group,
              tasks: [...group.tasks, action.createdTask],
            };
          }
          return group;
        }),
      };
    }
    case "update_status": {
      return {
        ...state,
        statusList: state.statusList.map((status) => {
          if (status.id === action.statusId) {
            return {
              ...status,
              title: action.newTitle,
            };
          }
          return status;
        }),
      };
    }
    case "delete_status": {
      return {
        ...state,
        tasksGroups: state.tasksGroups.filter(
          (group) => group.status !== action.statusId
        ),
        statusList: state.statusList.filter(
          (status) => status.id !== action.statusId
        ),
      };
    }
    case "update_task": {
      return {
        ...state,
        tasksGroups: state.tasksGroups
          .filter((group) => {
            if (group.status === action.oldStatusId) {
              return {
                ...group,
                tasks: group.tasks.filter((task) => task.id !== action.taskId),
              };
            }
            return group;
          })
          .map((group) => {
            if (group.status === action.newStatusId) {
              return {
                ...group,
                tasks: [...group.tasks, action.updatedTask],
              };
            }
            return group;
          }),
      };
    }
  }
};
