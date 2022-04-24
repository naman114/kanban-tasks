import { Errors } from "./common";

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
