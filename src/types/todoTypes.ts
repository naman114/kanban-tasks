import { TaskGet } from "./boardTypes";

export type PopulateTodoTasks = {
  type: "populate_todo_tasks";
  tasks: TaskGet[];
};

export type UpdateTask = {
  type: "update_task";
  taskId: number;
  is_completed: boolean;
};

export type TodoAction = PopulateTodoTasks | UpdateTask;
