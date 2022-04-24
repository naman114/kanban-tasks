import { Errors, Overwrite } from "./common";

export type BoardCreate = {
  title: string;
  description: string;
};

export type BoardGet = {
  id: number;
  title: string;
  description: string;
  created_date: string;
  modified_date: string;
};

export type BoardUpdate = BoardCreate & { id: number };

export type StatusGet = {
  id: number;
  title: string;
  description: string;
  created_date: string;
  modified_date: string;
};

export type TaskGet = {
  id: number;
  status: number;
  title: string;
  description: string;
  board_object: BoardGet;
  status_object: StatusGet;
  created_date: string;
  modified_date: string;
  board: number;
};

export type TaskGroupByStatus = {
  status: number;
  tasks: TaskGet[];
};

export type TaskCreate = {
  status: number;
  title: string;
  description: string;
  board: number;
};

export const validateTask = (task: TaskCreate) => {
  const errors: Errors<TaskCreate> = {};
  if (task.title.length < 1) {
    errors.title = "Title is Required";
  }
  if (task.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }
  if (task.description.length < 1) {
    errors.description = "Description is required";
  }
  return errors;
};

export type BoardDetailState = {
  title: string;
  tasksGroups: TaskGroupByStatus[];
};

export const validateBoard = (board: BoardCreate) => {
  const errors: Errors<BoardCreate> = {};
  if (board.title.length < 1) {
    errors.title = "Title is Required";
  }
  if (board.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }
  if (board.description.length < 1) {
    errors.description = "Description is required";
  }
  return errors;
};
