import { PaginationParams } from "../types/common";
import {
  createFormField,
  Form,
  FormSubmission,
  updateForm,
  updateFormField,
} from "../types/formTypes";
import { CreateUser } from "../types/userTypes";
import { showNotification } from "./notifUtils";

const API_BASE_URL = "http://localhost:8000/api";

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

export const createForm = (form: Form) => {
  return request("/forms/", "POST", form);
};

export const listForms = (pageParams: PaginationParams) => {
  return request("/forms/", "GET", pageParams);
};

export const deleteForm = (id: number) => {
  return request(`/forms/${id}/`, "DELETE");
};

export const getForm = (id: number) => {
  return request(`/forms/${id}/`, "GET");
};

export const createField = (formId: number, field: createFormField) => {
  return request(`/forms/${formId}/fields/`, "POST", field);
};

export const getFormFields = (formId: number) => {
  return request(`/forms/${formId}/fields/`, "GET");
};

export const deleteFormField = (formId: number, fieldId: number) => {
  return request(`/forms/${formId}/fields/${fieldId}/`, "DELETE");
};

export const patchFormField = (
  formId: number,
  fieldId: number,
  data: updateFormField
) => {
  return request(`/forms/${formId}/fields/${fieldId}/`, "PATCH", data);
};

export const patchForm = (formId: number, data: updateForm) => {
  return request(`/forms/${formId}/`, "PATCH", data);
};

export const createSubmission = (formId: number, data: FormSubmission) => {
  return request(`/forms/${formId}/submission/`, "POST", data);
};

export const createBoard = (board: any) => {
  return request("/boards/", "POST", board);
};

export const listBoards = (pageParams: PaginationParams) => {
  return request("/boards/", "GET", pageParams);
};
