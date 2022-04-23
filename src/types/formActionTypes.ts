import { textFieldTypes, formFieldKind, formField } from "../types/formTypes";

export type RemoveAction = {
  type: "remove_field";
  id: number;
};

export type AddAction = {
  type: "add_field";
  label: string;
  kind: formFieldKind;
  fieldType: textFieldTypes;
  options: string[];
};

export type UpdateTitleAction = {
  type: "update_title";
  title: string;
};

export type UpdateFieldLabel = {
  type: "update_field_label";
  id: number;
  label: string;
};

export type UpdateTextFieldType = {
  type: "update_textfield_type";
  id: number;
  textFieldType: textFieldTypes;
};

export type UpdateOptions = {
  type: "update_options";
  id: number;
  options: string;
};

export type PopulateFormFields = {
  type: "populate_form_fields";
  fields: formField[];
};

export type FormAction =
  | AddAction
  | RemoveAction
  | UpdateTitleAction
  | UpdateFieldLabel
  | UpdateTextFieldType
  | UpdateOptions
  | PopulateFormFields;
