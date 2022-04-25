import React, { useEffect, useState } from "react";
import AppRouter from "./router/AppRouter";
import { User } from "./types/userTypes";
import { me } from "./utils/apiUtils";
import { userContext } from "./utils/userUtils";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const getCurrentUser = async (setCurrentUser: (currentUser: User) => void) => {
  const currentUser = await me();
  const { username, name, url } = currentUser;
  const user: User = {
    username,
    name,
    url,
    status: username === "" ? "NOT_AUTHENTICATED" : "AUTHENTICATED",
  };
  setCurrentUser(user);
};

function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    username: "",
    name: "",
    url: "",
    status: "NOT_AUTHENTICATED",
  });

  useEffect(() => {
    try {
      getCurrentUser(setCurrentUser);
    } catch (error) {
      console.log("removing token");
      localStorage.removeItem("token");
      console.log(error);
    }
  }, []);

  return (
    <userContext.Provider value={currentUser}>
      <ReactNotifications />
      <AppRouter />
    </userContext.Provider>
  );
}

export default App;
