/* This example requires Tailwind CSS v2.0+ */
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

const buttonClassNames = {
  active:
    "relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600",
  inactive:
    "relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50",
};

export default function Pagination(props: {
  count: number;
  pageNum: number;
  setPageCB: (pageNum: number) => void;
}) {
  // console.log(typeof props.pageNum);
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={props.pageNum <= 1}
          onClick={() => props.setPageCB(Number(props.pageNum) - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          disabled={props.pageNum * 5 >= props.count}
          onClick={() => props.setPageCB(Number(props.pageNum) + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {props.count > 0 ? 1 + 5 * (props.pageNum - 1) : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(props.count, 5 * props.pageNum)}
            </span>{" "}
            of <span className="font-medium">{props.count}</span> results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
              disabled={props.pageNum <= 1}
              onClick={() => props.setPageCB(Number(props.pageNum) - 1)}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
            {Array.from(
              { length: Math.ceil(props.count / 5) },
              (_, i) => i + 1
            ).map((elementInArray, index) => {
              return (
                <button
                  key={index}
                  className={
                    Number(props.pageNum) === Number(elementInArray)
                      ? buttonClassNames.active
                      : buttonClassNames.inactive
                  }
                  onClick={() => {
                    props.setPageCB(Number(elementInArray));
                  }}
                >
                  {elementInArray}
                </button>
              );
            })}
            <button
              className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
              disabled={props.pageNum * 5 >= props.count}
              onClick={() => props.setPageCB(Number(props.pageNum) + 1)}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
