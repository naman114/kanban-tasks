import { Overwrite } from "./common";

export type FormData = {
  id: number;
  title: string;
  formFields: formField[];
};

export type Form = {
  id?: number;
  title: string;
  description?: string;
  is_public?: boolean;
};

export type receivedForm = {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  created_by: number;
  created_date: string;
  modified_date: string;
};

export type updateForm = Partial<Form>;

export type createFormField = {
  label: string;
  kind: "TEXT" | "DROPDOWN" | "RADIO" | "GENERIC";
  options?: string[];
  meta?: { textFieldType?: string; kind?: string };
};

export type updateFormField = Partial<createFormField>;

export type receivedFormField = createFormField & { id: number };

export type ReceivedForm = Overwrite<Form, { id: number }>;

export type Errors<T> = Partial<Record<keyof T, string>>;

export const validateForm = (form: Form) => {
  const errors: Errors<Form> = {};
  if (form.title.length < 1) {
    errors.title = "Title is Required";
  }
  if (form.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }
  return errors;
};

export const validateField = (field: any) => {
  const errors: Errors<formField> = {};
  if (field.label.length < 1) {
    errors.label = "Field is required";
  }
  if (field.label.length > 100) {
    errors.label = "Field must be less than 100 characters";
  }
  return errors;
};

export type textFieldTypes = "text" | "email" | "date";

export type TextField = {
  kind: "text";
  id: number;
  label: string;
  fieldType: textFieldTypes;
  value: string;
};

export type DropDownField = {
  kind: "dropdown";
  id: number;
  label: string;
  options: string[];
  value: string;
};

export type RadioField = {
  kind: "radio";
  id: number;
  label: string;
  options: string[];
  value: string;
};

export type TextAreaField = {
  kind: "textarea";
  id: number;
  label: string;
  value: string;
};

export type MultiSelectField = {
  kind: "multiselect";
  id: number;
  label: string;
  options: string[];
  value: string;
};

export type formFieldKind =
  | "text"
  | "dropdown"
  | "radio"
  | "textarea"
  | "multiselect";

export type formField =
  | TextField
  | DropDownField
  | RadioField
  | TextAreaField
  | MultiSelectField;

export type FormSubmission = {
  answers: Array<{
    form_field: number;
    value: string;
  }>;
};
