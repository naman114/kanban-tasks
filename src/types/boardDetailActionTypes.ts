import { TaskGet, StatusGet, TaskGroupByStatus } from "./boardTypes";

export type PopulateBoardDetail = {
  type: "populate_board_detail";
  title: string;
  taskGroups: TaskGroupByStatus[];
  statusList: StatusGet[];
};

export type AddNewStatus = {
  type: "add_new_status";
  statusId: number;
  tasks: TaskGet[];
  createdStatus: StatusGet;
};

export type UpdateStatus = {
  type: "update_status";
  statusId: number;
  newTitle: string;
};

export type DeleteStatus = {
  type: "delete_status";
  statusId: number;
};

export type AddNewTask = {
  type: "add_new_task";
  statusId: number;
  createdTask: TaskGet;
};

export type UpdateTask = {
  type: "update_task";
  oldStatusId: number;
  newStatusId: number;
  taskId: number;
  updatedTask: TaskGet;
};

export type DeleteTask = {
  type: "delete_task";
  statusId: number;
  taskId: number;
};

export type BoardDetailAction =
  | PopulateBoardDetail
  | AddNewStatus
  | UpdateStatus
  | DeleteStatus
  | AddNewTask
  | UpdateTask
  | DeleteTask;
