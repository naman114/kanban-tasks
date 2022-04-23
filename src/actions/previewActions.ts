import { FormResponse } from "../types/previewTypes";
import { PreviewAction } from "../types/previewActionTypes";

export const reducer = (state: FormResponse, action: PreviewAction) => {
  switch (action.type) {
    case "save_user_input": {
      return {
        ...state,
        formData: {
          ...state.formData,
          formFields: state.formData.formFields.map((field) => {
            if (field.id === action.questionId)
              return {
                ...field,
                value: action.value,
              };
            return field;
          }),
        },
      };
    }
    case "save_multiselect_values": {
      return {
        ...state,
        multiSelectValues: action.options,
      };
    }
    case "save_current_question": {
      return {
        ...state,
        questionId: action.questionId,
        multiSelectValues: state.formData.formFields
          .find((formField) => {
            return formField.id === action.questionId;
          })!
          .value.split(",")
          .filter((i) => i)
          .map((o) => {
            return { value: o, label: o };
          }),
      };
    }
    case "save_submission_status": {
      return {
        ...state,
        isSubmitted: action.isSubmitted,
      };
    }
    case "populate_form_fields": {
      return {
        ...state,
        formData: {
          ...state.formData,
          formFields: action.fields,
        },
      };
    }
    case "save_question_id": {
      return {
        ...state,
        questionId: action.id,
      };
    }
  }
};
