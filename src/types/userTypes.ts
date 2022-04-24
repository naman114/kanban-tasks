import { Errors } from "./common";

export type User = {
  username: string;
  name: string;
  url: string;
  status: "NOT_AUTHENTICATED" | "AUTHENTICATED";
};

export type CreateUser = {
  username: string;
  email: string;
  password1: string;
  password2: string;
};

export const validateUser = (user: CreateUser) => {
  const errors: Errors<CreateUser> = {};
  if (user.username.length < 1) {
    errors.username = "Username is Required";
  }
  if (user.username.length > 150) {
    errors.username = "Username must be less than 150 characters";
  }
  if (user.email.length < 1) {
    errors.email = "Email is required";
  }
  if (user.password1.length < 1) {
    errors.password1 = "Password is required";
  } else if (user.password2.length < 1) {
    errors.password2 = "Please re-enter your password";
  } else if (user.password1 !== user.password2) {
    errors.password2 = "Passwords don't match";
  }
  return errors;
};
