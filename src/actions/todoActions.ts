import { TaskGet } from "../types/boardTypes";
import { TodoAction } from "../types/todoTypes";

// Display incomplete tasks before completed ones
const arrangeTasks = (task1: TaskGet, task2: TaskGet) => {
  if (task1.is_completed && !task2.is_completed) return 1;
  else if (!task1.is_completed && task2.is_completed) return -1;
  return 0;
};

export const reducer = (state: TaskGet[], action: TodoAction): TaskGet[] => {
  switch (action.type) {
    case "populate_todo_tasks": {
      return [...state, ...action.tasks].sort(arrangeTasks);
    }
    case "update_task": {
      return state
        .map((task) => {
          if (task.id === action.taskId) {
            return {
              ...task,
              is_completed: action.is_completed,
            };
          }
          return task;
        })
        .sort(arrangeTasks);
    }
  }
};
