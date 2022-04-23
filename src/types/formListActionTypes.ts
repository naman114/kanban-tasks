import { FormListState } from "../types/formListTypes";

export type PopulateFormList = {
  type: "populate_form_list";
  forms: FormListState;
};

export type RemoveAction = {
  type: "remove_form";
  id: number;
};

export type SaveSearchString = {
  type: "save_search_string";
  searchString: string;
};

export type FormListAction = PopulateFormList | RemoveAction | SaveSearchString;
