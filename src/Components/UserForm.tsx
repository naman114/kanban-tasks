import React, { useState, useEffect, useRef, useReducer } from "react";
import LabelledInput from "./LabelledInput";
import { parseOptions } from "../utils/formUtils";
import { Link } from "raviger";
import {
  FormData,
  formField,
  textFieldTypes,
  formFieldKind,
  validateField,
  Errors,
  createFormField,
  receivedFormField,
  receivedForm,
} from "../types/formTypes";
import LabelledDropdownInput from "./LabelledDropdownInput";
import LabelledTextAreaInput from "./LabelledTextAreaInput";
import { reducer } from "../actions/formActions";
import { Pagination } from "../types/common";
import {
  createField,
  deleteFormField,
  getForm,
  getFormFields,
  patchForm,
  patchFormField,
} from "../utils/apiUtils";
import { showNotification } from "../utils/notifUtils";
import Loading from "../common/Loading";

export const initialFormFields: formField[] = [
  { kind: "text", id: 1, label: "Name", fieldType: "text", value: "" },
  { kind: "text", id: 3, label: "Email", fieldType: "email", value: "" },
  { kind: "text", id: 4, label: "Date of Birth", fieldType: "date", value: "" },
  {
    kind: "dropdown",
    id: 5,
    label: "Priority",
    options: ["High", "Low"],
    value: "",
  },
  {
    kind: "radio",
    id: 6,
    label: "Language",
    options: ["Python", "JS", "Java"],
    value: "",
  },
  {
    kind: "textarea",
    id: 7,
    label: "Brief about yourself",
    value: "",
  },
  {
    kind: "multiselect",
    id: 8,
    label: "Cars",
    options: ["BMW", "Audi", "Mercedes"],
    value: "",
  },
];

const inputTypes = {
  text: "Text",
  dropdown: "Dropdown",
  radio: "Radio",
  textarea: "Text Area",
  multiselect: "Multi Select",
};

const initialState = (formId: number): FormData => {
  const newForm: FormData = {
    id: Number(new Date()),
    title: "Untitled Form",
    formFields: [],
  };

  return newForm;
};

export default function UserForm(props: { formId: number }) {
  const [state, dispatch] = useReducer(reducer, null, () =>
    initialState(props.formId)
  );
  const [newFieldKind, setNewFieldKind] = useState<formFieldKind>("text");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldOptions, setNewFieldOptions] = useState<string[]>([]);
  const [newFieldType, setNewFieldType] = useState("text" as textFieldTypes);
  const titleRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Errors<formField>>({});
  const [loading, setLoading] = useState(true);

  const fetchTitle = async () => {
    const data: receivedForm = await getForm(props.formId);
    dispatch({ type: "update_title", title: data.title });
  };

  useEffect(() => {
    console.log("Component is mounted");
    document.title = "User Form";
    titleRef.current?.focus();
    fetchTitle();
    return () => {
      document.title = "React App";
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let timeout = setTimeout(() => {
      patchForm(props.formId, { title: state.title });
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [state.title]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFormFields = async () => {
    try {
      setLoading(true);
      const data: Pagination<receivedFormField> = await getFormFields(
        props.formId
      );
      convertResponsePayload(data.results);
      setLoading(false);
    } catch (error) {
      console.error(error);
      showNotification("danger", "Error occured in fetching form");
    }
  };

  useEffect(() => {
    fetchFormFields();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    dispatch({
      type: "add_field",
      label: newFieldLabel,
      kind: newFieldKind,
      fieldType: newFieldType,
      options: newFieldOptions,
    });
    setNewFieldLabel("");
    setNewFieldOptions([]);

    const field: formField = {
      kind: newFieldKind,
      label: newFieldLabel,
      options: newFieldOptions,
      fieldType: newFieldType,
      id: Number(new Date()),
      value: "",
    };

    const fieldRequestPayload: createFormField = cleanRequestPayload(field);

    const validationErrors = validateField(fieldRequestPayload);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const data = await createField(props.formId, fieldRequestPayload);
        console.log(data);
        // console.log("hello");
      } catch (error) {
        console.log(error);
        showNotification("danger", "Error occured in adding field");
      }
    }
  };

  const cleanRequestPayload = (field: any): createFormField => {
    const validationErrors = validateField(field);
    setErrors(validationErrors);

    switch (field.kind) {
      case "text":
        return {
          label: field.label,
          kind: "TEXT",
          meta: {
            textFieldType: field.fieldType,
          },
        };
      case "dropdown":
        return {
          label: field.label,
          kind: "DROPDOWN",
          options: field.options,
        };
      case "radio":
        return {
          label: field.label,
          kind: "RADIO",
          options: field.options,
        };
      case "textarea":
        return {
          label: field.label,
          kind: "GENERIC",
          meta: {
            kind: "textarea",
          },
        };
      case "multiselect":
        return {
          label: field.label,
          kind: "GENERIC",
          meta: {
            kind: "multiselect",
          },
          options: field.options,
        };
    }

    return {
      label: field.label,
      kind: "TEXT",
      meta: {
        textFieldType: field.fieldType,
      },
    };
  };

  const convertResponsePayload = (fields: receivedFormField[]) => {
    const convertedFields: formField[] = fields.map((field) =>
      conversionHelper(field)
    );

    // Sort the fields by id (in order of creation)
    // Comparator asks: Should I swap them?
    convertedFields.sort((field1: formField, field2: formField) =>
      field1.id < field2.id ? -1 : 1
    );
    console.log(convertedFields);

    dispatch({ type: "populate_form_fields", fields: convertedFields });
  };

  const conversionHelper = (field: receivedFormField): formField => {
    switch (field.kind) {
      case "TEXT":
        return {
          id: field.id,
          kind: "text",
          label: field.label,
          fieldType: field.meta?.textFieldType as textFieldTypes,
          value: "",
        };
      case "DROPDOWN":
        return {
          id: field.id,
          kind: "dropdown",
          label: field.label,
          options: field.options!,
          value: "",
        };
      case "RADIO":
        return {
          id: field.id,
          kind: "radio",
          label: field.label,
          options: field.options!,
          value: "",
        };
      case "GENERIC": {
        switch (field.meta?.kind) {
          case "textarea":
            return {
              id: field.id,
              kind: "textarea",
              label: field.label,
              value: "",
            };
          case "multiselect":
            return {
              id: field.id,
              kind: "multiselect",
              label: field.label,
              options: field.options!,
              value: "",
            };
        }
      }
    }

    return {
      id: field.id,
      kind: "text",
      label: field.label,
      fieldType: field.meta?.textFieldType as textFieldTypes,
      value: "",
    };
  };

  const renderAdditionalInputs = () => {
    switch (newFieldKind) {
      case "text":
        return (
          <select
            className="focus:border-blueGray-500 focus:shadow-outline my-2 flex transform rounded-lg border-2 border-gray-200 bg-gray-100 p-2 ring-offset-2 ring-offset-current transition duration-500 ease-in-out focus:bg-white focus:outline-none focus:ring-2"
            onChange={(e) => {
              setNewFieldType(e.target.value as textFieldTypes);
            }}
            value={newFieldType}
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="date">Date</option>
          </select>
        );

      case "radio":
      case "multiselect":
      case "dropdown":
        return (
          <input
            type="text"
            className="focus:border-blueGray-500 focus:shadow-outline my-2 flex flex-1 transform rounded-lg border-2 border-gray-200 bg-gray-100 p-2 ring-offset-2 ring-offset-current transition duration-500 ease-in-out focus:bg-white focus:outline-none focus:ring-2"
            onChange={(e) => {
              setNewFieldOptions(parseOptions(e.target.value));
            }}
            value={newFieldOptions}
            placeholder="Enter options"
          />
        );
      case "textarea":
        return;
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-4 divide-y-2 divide-dotted">
      <input
        type="text"
        className="focus:border-blueGray-500 focus:shadow-outline my-2 flex flex-1 transform rounded-lg border-2 border-gray-200 bg-gray-100 p-2 ring-offset-2 ring-offset-current transition duration-500 ease-in-out focus:bg-white focus:outline-none focus:ring-2"
        onChange={(e) => {
          dispatch({
            type: "update_title",
            title: e.target.value,
          });
        }}
        value={state.title}
        ref={titleRef}
      />
      <div>
        {state.formFields.map((field) => {
          switch (field.kind) {
            case "text":
              return (
                <React.Fragment key={field.id}>
                  <LabelledInput
                    id={field.id}
                    label={field.label}
                    fieldType={field.fieldType}
                    value={field.value}
                    kind={inputTypes[field.kind]}
                    updateFieldTypeCB={(id: number, type: textFieldTypes) => {
                      dispatch({
                        type: "update_textfield_type",
                        id: id,
                        textFieldType: type,
                      });
                      patchFormField(props.formId, id, {
                        meta: {
                          textFieldType: type,
                        },
                      });
                    }}
                    removeFieldCB={(id) => {
                      dispatch({
                        type: "remove_field",
                        id: id,
                      });
                      deleteFormField(props.formId, id);
                    }}
                    updateInputFieldLabelCB={(id: number, label: string) => {
                      dispatch({
                        type: "update_field_label",
                        id: id,
                        label: label,
                      });
                      patchFormField(props.formId, id, {
                        label,
                      });
                    }}
                  />
                </React.Fragment>
              );

            case "radio":
            case "multiselect":
            case "dropdown":
              return (
                <React.Fragment key={field.id}>
                  <LabelledDropdownInput
                    id={field.id}
                    label={field.label}
                    options={field.options}
                    value={field.value}
                    kind={inputTypes[field.kind]}
                    updateOptionsCB={(id: number, options: string) => {
                      dispatch({
                        type: "update_options",
                        id: id,
                        options: options,
                      });
                      patchFormField(props.formId, id, {
                        options: parseOptions(options),
                      });
                    }}
                    removeFieldCB={(id) => {
                      dispatch({
                        type: "remove_field",
                        id: id,
                      });
                      deleteFormField(props.formId, id);
                    }}
                    updateInputFieldLabelCB={(id: number, label: string) => {
                      dispatch({
                        type: "update_field_label",
                        id: id,
                        label: label,
                      });
                      patchFormField(props.formId, id, {
                        label,
                      });
                    }}
                  />
                </React.Fragment>
              );

            case "textarea":
              return (
                <React.Fragment key={field.id}>
                  <LabelledTextAreaInput
                    id={field.id}
                    label={field.label}
                    value={field.value}
                    kind={inputTypes[field.kind]}
                    removeFieldCB={(id) =>
                      dispatch({
                        type: "remove_field",
                        id: id,
                      })
                    }
                    updateInputFieldLabelCB={(id: number, label: string) => {
                      dispatch({
                        type: "update_field_label",
                        id: id,
                        label: label,
                      });
                      patchFormField(props.formId, id, {
                        label,
                      });
                    }}
                  />
                </React.Fragment>
              );
          }
          return <div></div>;
        })}
      </div>
      <div className="flex gap-2">
        <select
          className="focus:border-blueGray-500 focus:shadow-outline my-2 flex transform rounded-lg border-2 border-gray-200 bg-gray-100 p-2 ring-offset-2 ring-offset-current transition duration-500 ease-in-out focus:bg-white focus:outline-none focus:ring-2"
          onChange={(e) => {
            setNewFieldKind(e.target.value as formFieldKind);
          }}
          value={newFieldKind}
        >
          {Object.entries(inputTypes).map((item, index) => {
            return (
              <React.Fragment key={index}>
                <option value={item[0]}>{item[1]}</option>;
              </React.Fragment>
            );
          })}
        </select>
        <input
          type="text"
          className="focus:border-blueGray-500 focus:shadow-outline my-2 flex flex-1 transform rounded-lg border-2 border-gray-200 bg-gray-100 p-2 ring-offset-2 ring-offset-current transition duration-500 ease-in-out focus:bg-white focus:outline-none focus:ring-2"
          onChange={(e) => {
            setNewFieldLabel(e.target.value);
          }}
          value={newFieldLabel}
          placeholder="Enter a label for the new field"
        />
        {renderAdditionalInputs()}
        <button
          onClick={(_) => {
            handleSubmit();
          }}
          className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Field
        </button>
      </div>
      {errors.label && showNotification("danger", errors.label)}
      <div className="flex space-x-2">
        <Link
          href={`/preview/${props.formId}`}
          className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Preview
        </Link>
        <Link
          href="/"
          className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Close Form
        </Link>
      </div>
    </div>
  );
}
