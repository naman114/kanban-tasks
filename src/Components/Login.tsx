import { navigate } from "raviger";
import React, { useContext, useEffect, useState } from "react";
import { login } from "../utils/apiUtils";
import { userContext } from "../utils/formUtils";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const currentUser = useContext(userContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser.status === "AUTHENTICATED") {
      navigate("/");
      window.location.reload();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h2 className="mt-6 text-4xl font-bold text-gray-900">Kanban Tasks</h2>
        <br />
        <h3 className="text-xl">Login</h3>
        <form onSubmit={handleSubmit} className="mt-8" action="#" method="POST">
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mb-7 block w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-900"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <br />
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mb-7 block w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-900"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <button
            type="submit"
            className="group relative mb-4 mt-8 flex w-full justify-center rounded-lg border border-transparent bg-red-500 py-3 px-4 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <div>
          <a href="/register/">New here? Register</a>
        </div>
      </div>
    </div>
  );
}
