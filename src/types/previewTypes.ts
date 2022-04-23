import { MultiValue } from "react-select";
import { FormData } from "./formTypes";

export type FormResponse = {
  id: number;
  formData: FormData;
  multiSelectValues: MultiValue<{ value: string; label: string }>;
  questionId: number;
  isSubmitted: boolean;
};
