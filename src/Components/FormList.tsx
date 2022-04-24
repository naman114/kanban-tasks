import React, { useContext, useEffect, useReducer, useState } from "react";
import { navigate, useQueryParams } from "raviger";
import { reducer } from "../actions/formListActions";
import { FormListState } from "../types/formListTypes";
import Modal from "../common/Modal";
import CreateForm from "./CreateForm";
import { listForms } from "../utils/apiUtils";
import { ReceivedForm, FormData } from "../types/formTypes";
import { deleteForm } from "../utils/apiUtils";
import Paginate from "../common/Paginate";
import { Pagination } from "../types/common";
import { userContext } from "../utils/formUtils";
import ShareForm from "./ShareForm";
import { showNotification } from "../utils/notifUtils";
import Loading from "../common/Loading";

const initialState = (): FormListState => {
  const formListState: FormListState = {
    formData: [],
    searchString: "",
  };
  return formListState;
};

export default function FormList() {
  const [{ search }, setSearchQP] = useQueryParams();
  const [{ page }, setPageQP] = useQueryParams();
  const [state, dispatch] = useReducer(reducer, null, () => initialState());
  const [newForm, setNewForm] = useState(false);
  const [pageNum, setPageNum] = useState<number>(page ?? 1);
  const [count, setCount] = useState(0);
  const currentUser = useContext(userContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageQP({ page: pageNum });
  }, [pageNum]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchForms();
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data: Pagination<ReceivedForm> = await listForms({
        offset: (pageNum - 1) * 5,
        limit: 5,
      });
      setLoading(false);
      setCount(data.count);
      const forms: FormListState = {
        formData: data.results.map((result) => {
          const form: FormData = {
            id: result.id,
            title: result.title,
            formFields: [],
          };
          return form;
        }),
        searchString: "",
      };
      forms.formData.sort((field1: FormData, field2: FormData) =>
        field1.id < field2.id ? -1 : 1
      );
      dispatch({ type: "populate_form_list", forms });
      // console.log(data);
    } catch (error) {
      console.error(error);
      showNotification("danger", "Error occured in fetching forms");
    }
  };

  useEffect(() => {
    fetchForms();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteForm = async (id: number) => {
    dispatch({ type: "remove_form", id });
    setCount(count - 1);
    await deleteForm(id);
    showNotification("success", "Form deleted successfully");
  };
  return (
    <div className="flex flex-col gap-5 divide-y-2 divide-dotted">
      <form
        className="flex justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          setSearchQP({ search: state.searchString });
        }}
      >
        <input
          className="mr-4 w-full rounded-2xl bg-slate-100 p-3 focus:outline-none"
          type="text"
          name="search"
          placeholder="Enter string to search"
          value={state.searchString}
          onChange={(e) => {
            dispatch({
              type: "save_search_string",
              searchString: e.target.value,
            });
          }}
        />
        <input
          className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
          value="Search"
        />
      </form>
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          <ul>
            {state.formData
              .filter((form) =>
                form.title.toLowerCase().includes(search?.toLowerCase() || "")
              )
              .map((form) => (
                <li
                  key={form.id}
                  className="flex items-center justify-between rounded-xl border-2 px-4"
                  tabIndex={0}
                >
                  <div className="flex flex-col py-1">
                    <p className=" text-lg ">{form.title}</p>
                    <p className=" text-slate-700 ">
                      {/* {form.formFields.length} Questions */}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      disabled={!currentUser || !currentUser?.username}
                      type="button"
                      onClick={(_) => {
                        navigate(`/preview/${form.id}`);
                      }}
                      className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300"
                    >
                      Preview
                    </button>
                    <button
                      disabled={!currentUser || !currentUser?.username}
                      onClick={(_) => {
                        navigate(`/forms/${form.id}`);
                      }}
                      type="button"
                      className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300"
                    >
                      Edit
                    </button>
                    <button
                      disabled={!currentUser || !currentUser?.username}
                      type="button"
                      className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300"
                      onClick={(_) => handleDeleteForm(form.id)}
                    >
                      Delete
                    </button>
                    <ShareForm formID={form.id} />
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
      <Paginate
        itemsPerPage={5}
        count={count}
        pageNum={pageNum}
        setPageCB={setPageNum}
      />
      <div className="flex space-x-2">
        <button
          disabled={!currentUser || !currentUser?.username}
          className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300"
          onClick={(_) => {
            setNewForm(true);
          }}
        >
          Add New Form
        </button>
      </div>
      <Modal open={newForm} closeCB={() => setNewForm(false)}>
        <CreateForm />
      </Modal>
    </div>
  );
}
