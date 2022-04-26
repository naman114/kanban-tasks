import { navigate } from "raviger";
import { BoardCreate, TaskCreate } from "../types/boardTypes";
import { PaginationParams } from "../types/common";
import { StatusCreate } from "../types/statusTypes";
import { CreateUser } from "../types/userTypes";
import { showNotification } from "./notifUtils";

const API_BASE_URL = "https://api-kanbantasks.herokuapp.com/api";
// const API_BASE_URL = "http://127.0.0.1:8000/api";

type RequestMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export const request = async (
  endpoint: string,
  method: RequestMethod = "GET",
  data: any = {}
) => {
  let url;
  let payload: string;

  if (method === "GET") {
    const requestParams = data
      ? `?${Object.keys(data)
          .map((key) => `${key}=${data[key]}`)
          .join("&")}`
      : "";
    url = `${API_BASE_URL}${endpoint}${requestParams}`;
    payload = "";
  } else {
    url = `${API_BASE_URL}${endpoint}`;
    payload = data ? JSON.stringify(data) : "";
  }

  // Token Authentication
  const token = localStorage.getItem("token");
  const auth = token ? "Token " + localStorage.getItem("token") : "";

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: method !== "GET" ? payload : null,
  });

  if (response.ok) {
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const json = isJson ? await response.json() : null;
    return json;
  } else if (response.status === 403) {
    localStorage.removeItem("token");
    navigate("/");
  } else {
    const errorJson = await response.json();
    showNotification("danger", "Something went wrong");
    throw Error(errorJson);
  }
};

export const login = (username: string, password: string) => {
  return request("/auth-token/", "POST", { username, password });
};

export const register = (data: CreateUser) => {
  return request("/auth/registration/", "POST", data);
};

export const me = () => {
  return request("/users/me/", "GET", {});
};

export const createBoard = (board: any) => {
  return request("/boards/", "POST", board);
};

export const listBoards = (pageParams: PaginationParams) => {
  return request("/boards/", "GET", pageParams);
};

export const getBoard = (boardId: number) => {
  return request(`/boards/${boardId}/`, "GET");
};

export const patchBoard = (boardId: number, data: BoardCreate) => {
  return request(`/boards/${boardId}/`, "PATCH", data);
};

export const deleteBoard = (boardId: number) => {
  return request(`/boards/${boardId}/`, "DELETE");
};

export const listBoardTasks = (boardId: number) => {
  return request(`/boards/${boardId}/tasks/`, "GET");
};

export const listStatus = () => {
  return request("/status/", "GET");
};

export const createStatus = (status: StatusCreate) => {
  return request("/status/", "POST", status);
};

export const createTask = (boardId: number, task: TaskCreate) => {
  return request(`/boards/${boardId}/tasks/`, "POST", task);
};

export const patchStatus = (statusId: number, status: StatusCreate) => {
  return request(`/status/${statusId}/`, "PATCH", {
    title: status.title,
  });
};

export const deleteStatus = (statusId: number) => {
  return request(`/status/${statusId}/`, "DELETE");
};

export const patchTask = (
  boardId: number,
  taskId: number,
  task: TaskCreate
) => {
  return request(`/boards/${boardId}/tasks/${taskId}/`, "PATCH", task);
};

export const deleteTask = (boardId: number, taskId: number) => {
  return request(`/boards/${boardId}/tasks/${taskId}/`, "DELETE");
};
