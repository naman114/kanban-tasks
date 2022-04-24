import { navigate } from "raviger";
import React, { useContext, useEffect, useState } from "react";
import { register } from "../utils/apiUtils";
import { CreateUser, validateUser } from "../types/userTypes";
import { login } from "../utils/apiUtils";
import { userContext } from "../utils/formUtils";
import { Errors } from "../types/common";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState<Errors<CreateUser>>({});

  const currentUser = useContext(userContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: CreateUser = {
      username,
      email,
      password1,
      password2,
    };
    const validationErrors = validateUser(payload);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await register(payload);
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
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
        <h3 className="text-xl">Sign Up</h3>
        <form onSubmit={handleSubmit} className="mt-8" action="#" method="POST">
          <div>
            <label
              htmlFor="username"
              className={`${errors.username ? "text-red-500" : ""}`}
            >
              Username
            </label>
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
            {errors.username && (
              <p className="text-red-500">{errors.username}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className={`${errors.email ? "text-red-500" : ""}`}
            >
              Email
            </label>
            <input
              id="email"
              name="text"
              type="text"
              required
              className="mb-7 block w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-900"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <br />
          <div>
            <label
              htmlFor="password1"
              className={`${errors.password1 ? "text-red-500" : ""}`}
            >
              Password
            </label>
            <input
              id="password1"
              name="password1"
              type="password"
              required
              className="mb-7 block w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-900"
              value={password1}
              onChange={(e) => {
                setPassword1(e.target.value);
              }}
            />
            {errors.password1 && (
              <p className="text-red-500">{errors.password1}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password2"
              className={`${errors.password2 ? "text-red-500" : ""}`}
            >
              Re-enter Password
            </label>
            <input
              id="password2"
              name="password2"
              type="password"
              required
              className="mb-7 block w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-900"
              value={password2}
              onChange={(e) => {
                setPassword2(e.target.value);
              }}
            />
            {errors.password2 && (
              <p className="text-red-500">{errors.password2}</p>
            )}
          </div>
          <button
            type="submit"
            className="group relative mb-4 mt-8 flex w-full justify-center rounded-lg border border-transparent bg-red-500 py-3 px-4 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
        <div>
          <a href="/login">Already signed up? Login</a>
        </div>
      </div>
    </div>
  );
}
