import { Errors } from "./common";

export type StatusCreate = {
  title: string;
  description: string;
};

export type StatusUpdate = StatusCreate & { id: number };

export const validateStatus = (status: StatusCreate) => {
  const errors: Errors<StatusCreate> = {};
  if (status.title.length < 1) {
    errors.title = "Title is Required";
  }
  if (status.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }
  if (status.description.length < 1) {
    errors.description = "Description is required";
  }
  return errors;
};
