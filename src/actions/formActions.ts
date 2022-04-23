import { parseOptions } from "../utils/formUtils";
import { FormAction } from "../types/formActionTypes";
import { FormData, formField, textFieldTypes } from "../types/formTypes";

export const reducer = (state: FormData, action: FormAction) => {
  switch (action.type) {
    case "add_field": {
      const newField = getNewField(
        action.kind,
        action.label,
        action.fieldType,
        action.options
      );
      if (
        action.label === "" ||
        (["dropdown", "radio", "multiselect"].includes(action.kind) &&
          action.options.length === 0)
      )
        return state;

      return { ...state, formFields: [...state.formFields, newField] };
    }
    case "remove_field": {
      return {
        ...state,
        formFields: state.formFields.filter((field) => field.id !== action.id),
      };
    }
    case "update_title": {
      return {
        ...state,
        title: action.title,
      };
    }
    case "update_field_label": {
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id) {
            return {
              ...field,
              label: action.label,
            };
          }
          return field;
        }),
      };
    }

    case "update_textfield_type": {
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id) {
            return {
              ...field,
              fieldType: action.textFieldType,
            };
          }
          return field;
        }),
      };
    }
    case "update_options": {
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id) {
            return {
              ...field,
              options: parseOptions(action.options),
            };
          }
          return field;
        }),
      };
    }
    case "populate_form_fields": {
      return {
        ...state,
        formFields: action.fields,
      };
    }
  }
};

const getNewField = (
  kind: string,
  label: string,
  fieldType: textFieldTypes,
  options: string[]
): formField => {
  switch (kind) {
    case "text":
      return {
        kind: kind,
        id: Number(new Date()),
        label: label,
        fieldType: fieldType,
        value: "",
      };

    case "dropdown":
    case "radio":
    case "multiselect":
      return {
        kind: kind,
        id: Number(new Date()),
        label: label,
        options: options,
        value: "",
      };

    case "textarea":
      return {
        kind: kind,
        id: Number(new Date()),
        label: label,
        value: "",
      };
  }
  return {
    kind: "text",
    id: Number(new Date()),
    label: label,
    fieldType: fieldType,
    value: "",
  };
};
