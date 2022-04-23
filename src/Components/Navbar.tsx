import React from "react";

export default function Navbar() {
  return (
    <div className="flex justify-between px-4 py-2">
      {/* Searchbar */}
      <form
        className="flex justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          //   setSearchQP({ search: state.searchString });
        }}
      >
        <input
          className="mr-4 w-full rounded-2xl bg-slate-100 p-3 focus:outline-none"
          type="text"
          name="search"
          placeholder="Enter string to search"
          //   value={state.searchString}
          //   onChange={(e) => {
          //     dispatch({
          //       type: "save_search_string",
          //       searchString: e.target.value,
          //     });
          //   }}
        />
        <input
          className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
          value="Search"
        />
      </form>
      <div className="flex gap-5">
        {/* User's Name */}
        <div className="flex items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white ">
            NG
          </div>
          <p>Naman Gogia</p>
        </div>
        {/* Logout Button */}
        <input
          className="group relative my-2 flex justify-center rounded-lg border border-transparent bg-blue-500 py-2 px-4 text-sm font-extrabold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="button"
          value="Logout"
        />
      </div>
    </div>
  );
}
