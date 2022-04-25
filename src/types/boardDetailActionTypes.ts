import { ValueOf } from "raviger/dist/types";
import {
  TaskGet,
  BoardDetailState,
  StatusGet,
  TaskGroupByStatus,
} from "./boardTypes";

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

export type BoardDetailAction =
  | PopulateBoardDetail
  | AddNewStatus
  | UpdateStatus
  | DeleteStatus
  | AddNewTask;
