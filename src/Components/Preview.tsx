import { Link } from "raviger";
import React, { useEffect, useReducer, useState } from "react";
import {
  formField,
  FormSubmission,
  receivedFormField,
  TextField,
  textFieldTypes,
} from "../types/formTypes";
import { FormResponse } from "../types/previewTypes";
import Select from "react-select";
import { reducer } from "../actions/previewActions";
import { Pagination } from "../types/common";
import { createSubmission, getFormFields } from "../utils/apiUtils";
import { showNotification } from "../utils/notifUtils";
import Loading from "../common/Loading";

const initialState = (formId: number): FormResponse => {
  return {
    id: Number(new Date()),
    formData: {
      id: formId,
      title: "Untitled Form",
      formFields: [],
    },
    multiSelectValues: [],
    // questionId: currentFormData.formFields[0]?.id || -1,
    questionId: -1,
    isSubmitted: false,
  };
};

export default function Preview(props: { formId: number }) {
  const [state, dispatch] = useReducer(reducer, null, () =>
    initialState(props.formId)
  );
  const [loading, setLoading] = useState(true);

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

    if (convertedFields.length > 0) {
      dispatch({ type: "save_question_id", id: convertedFields[0].id });
    }
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

  const handleSubmit = async () => {
    dispatch({ type: "save_submission_status", isSubmitted: true });

    const payload: FormSubmission = {
      answers: state.formData.formFields.map((field) => {
        return {
          form_field: field.id,
          value: field.value,
        };
      }),
    };

    const data = await createSubmission(props.formId, payload);
    showNotification("success", "Form response was saved");
    console.log(data);
  };

  const getQuestionLabel = () =>
    state.formData.formFields.find((field) => field.id === state.questionId)
      ?.label;

  const getQuestionFieldType = () =>
    (
      state.formData.formFields.find(
        (field) => field.id === state.questionId
      ) as TextField
    )?.fieldType;

  const hasPreviousQuestion = (): boolean => {
    const index = state.formData.formFields.findIndex((formField) => {
      return formField.id === state.questionId;
    });
    return index > 0;
  };

  const hasNextQuestion = (): boolean => {
    const index = state.formData.formFields.findIndex((formField) => {
      return formField.id === state.questionId;
    });
    return index < state.formData.formFields.length - 1;
  };

  const showPreviousQuestion = () => {
    const index = state.formData.formFields.findIndex((formField) => {
      return formField.id === state.questionId;
    });
    dispatch({
      type: "save_current_question",
      questionId: state.formData.formFields[index - 1].id,
    });
  };

  const showNextQuestion = () => {
    const index = state.formData.formFields.findIndex((formField) => {
      return formField.id === state.questionId;
    });
    dispatch({
      type: "save_current_question",
      questionId: state.formData.formFields[index + 1].id,
    });
  };

  const renderQuestion = () => {
    const field = state.formData.formFields.find(
      (field) => field.id === state.questionId
    )!;
    switch (field.kind) {
      case "text":
        return (
          <input
            className="mr-4 w-full rounded-2xl bg-slate-100 p-3 focus:outline-none"
            type={getQuestionFieldType()}
            value={
              state.formData.formFields.find(
                (field) => field.id === state.questionId
              )?.value
            }
            onChange={(e) => {
              dispatch({
                type: "save_user_input",
                value: e.target.value,
                questionId: state.questionId,
              });
            }}
          />
        );
      case "dropdown":
        return (
          <select
            value={field.value}
            onChange={(e) => {
              dispatch({
                type: "save_user_input",
                value: e.target.value,
                questionId: state.questionId,
              });
            }}
          >
            <option value="">Select an option</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div>
            {field.options.map((option, index) => {
              return (
                <React.Fragment key={index}>
                  <div className="ml-1 flex items-center space-x-2">
                    <input
                      type="radio"
                      name={field.label}
                      value={option}
                      onChange={(e) =>
                        dispatch({
                          type: "save_user_input",
                          value: e.target.value,
                          questionId: state.questionId,
                        })
                      }
                    />
                    <label htmlFor={field.label}>{option}</label>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        );

      case "textarea":
        return (
          <textarea
            name={field.label}
            cols={4}
            rows={5}
            onChange={(e) =>
              dispatch({
                type: "save_user_input",
                value: e.target.value,
                questionId: state.questionId,
              })
            }
          ></textarea>
        );

      case "multiselect":
        return (
          <Select
            isMulti
            onChange={(opt) => {
              dispatch({ type: "save_multiselect_values", options: opt });
              dispatch({
                type: "save_user_input",
                value: opt.map((o) => o.label).join(","),
                questionId: state.questionId,
              });
            }}
            options={field.options.map((option) => {
              return { label: option, value: option };
            })}
            value={state.multiSelectValues}
          />
        );
    }
  };

  return loading ? (
    <Loading />
  ) : state.questionId === -1 ? (
    <div>
      <p tabIndex={0} className="my-2">
        This form is empty!
      </p>
      <Link
        className="group relative my-4 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        href="/"
      >
        View More Forms
      </Link>
    </div>
  ) : !state.isSubmitted ? (
    <div className="flex flex-col gap-4 divide-y-2 divide-dotted">
      <label className="mt-2 ml-1">{getQuestionLabel()}</label>
      {renderQuestion()}
      <div className="flex justify-between">
        {hasPreviousQuestion() ? (
          <button
            onClick={showPreviousQuestion}
            className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Previous
          </button>
        ) : (
          <button className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-slate-200 py-2 px-4 text-sm font-extrabold text-white">
            Previous
          </button>
        )}
        {hasNextQuestion() ? (
          <button
            onClick={showNextQuestion}
            className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        ) : (
          <button
            onClick={(e) => {
              handleSubmit();
            }}
            className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  ) : (
    <div tabIndex={0} className="flex flex-col gap-4">
      Thanks for filling out the form!
      <br />
      Here's what we got:
      <br />
      <br />
      {state.formData.formFields.map((field) => (
        <React.Fragment key={field.id}>
          <p>
            {field.label}: {field.value}
          </p>
        </React.Fragment>
      ))}
      <Link
        className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        href="/"
      >
        View More Forms
      </Link>
    </div>
  );
}
