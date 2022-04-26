import { Icon } from "@iconify/react";
import React, { useContext } from "react";
import { userContext } from "../utils/userUtils";

export default function Navbar() {
  const currentUser = useContext(userContext);

  return (
    <div className="flex h-20 justify-between border-b-2 px-4 py-5">
      <form
        className="ml-6 flex justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          //   setSearchQP({ search: state.searchString });
        }}
      >
        <input
          className="mr-4 w-full rounded bg-slate-200 p-3 focus:outline-none"
          type="text"
          name="search"
          placeholder="🔍   Search for anything"
          //   value={state.searchString}
          //   onChange={(e) => {
          //     dispatch({
          //       type: "save_search_string",
          //       searchString: e.target.value,
          //     });
          //   }}
        />
        <input
          className="group relative flex justify-center rounded border-2 border-slate-600 py-2 px-4 text-sm text-gray-500 hover:bg-slate-200 focus:outline-none"
          type="submit"
          value="Search"
        />
      </form>
      <div className="flex gap-5">
        <div className="flex items-center gap-1">
          <p>{currentUser.username}</p>
        </div>
        <div
          onClick={(_) => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="flex cursor-pointer items-center"
        >
          <Icon icon="uiw:logout" className="text-2xl" />
        </div>
      </div>
    </div>
  );
}
