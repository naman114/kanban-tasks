import React from "react";
import { User } from "../types/userTypes";

export const userContext = React.createContext<User>({
  username: "",
  name: "",
  url: "",
  status: "NOT_AUTHENTICATED",
});
