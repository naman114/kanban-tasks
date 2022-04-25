import { Icon } from "@iconify/react";
import moment from "moment";
import React, { useState } from "react";
import { StatusGet, TaskGroupByStatus } from "../types/boardTypes";
import { StatusUpdate } from "../types/statusTypes";

export default function BoardDetailStatus(props: {
  taskGroup: TaskGroupByStatus;
  statusList: StatusGet[];
  setStatusToUpdateCB: (status: StatusUpdate) => void;
  handleDeleteStatusCB: (statusId: number) => void;
  openStatusUpdateModalCB: () => void;
}) {
  const [isActive, setIsActive] = useState(false);

  const toggle = () => {
    isActive ? setIsActive(false) : setIsActive(true);
  };

  const handleEdit = () => {
    props.setStatusToUpdateCB({
      id: props.taskGroup.status,
      title: props.statusList.filter(
        (status) => status.id === props.taskGroup.status
      )[0].title,
      description: props.statusList.filter(
        (status) => status.id === props.taskGroup.status
      )[0].description,
    });
    props.openStatusUpdateModalCB();
  };

  return (
    <div className="flex w-72 flex-shrink-0 flex-col bg-stone-100">
      <div className="relative flex h-10 flex-shrink-0 items-center justify-between px-2">
        <div className="flex">
          <span className="block text-sm font-semibold">
            {
              props.statusList.filter(
                (status) => status.id === props.taskGroup.status
              )[0].title
            }
          </span>
          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded bg-white bg-opacity-30 text-sm font-semibold text-slate-900">
            {props.taskGroup.tasks.length}
          </span>
        </div>
        {isActive ? (
          <div
            onBlur={() => setIsActive(false)}
            className="absolute top-3 right-6 z-10 rounded-lg bg-stone-400"
          >
            <ul>
              {[
                {
                  icon: "eva:edit-outline",
                  text: "Edit",
                  handler: () => handleEdit(),
                },
                {
                  icon: "ant-design:delete-outlined",
                  text: "Archive",
                  handler: () =>
                    props.handleDeleteStatusCB(props.taskGroup.status),
                },
              ].map((item, idx) => {
                return (
                  <li key={idx} className="hover:bg-stone-500">
                    <button
                      onClick={item.handler}
                      className="flex space-x-2 px-4 py-2"
                    >
                      <div />
                      <Icon icon={item.icon} className="text-2xl" />
                      <p>{item.text}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div></div>
        )}
        <Icon
          icon="mi:options-horizontal"
          className="cursor-pointer text-right text-xl"
          onClick={() => toggle()}
        />
      </div>
      <div className="flex flex-col overflow-auto p-2">
        <hr className="mb-3 h-[] bg-zinc-500" />
        {props.taskGroup.tasks.map((task) => (
          <div
            className="group relative mt-3 flex cursor-pointer flex-col items-start rounded-lg bg-stone-200 bg-opacity-90 p-4 hover:bg-opacity-100"
            draggable="true"
          >
            <button className="absolute top-0 right-0 mt-3 mr-2 hidden h-5 w-5 items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 group-hover:flex">
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            <span className="flex h-6 items-center rounded-full text-lg font-semibold text-slate-900">
              {task.title}
            </span>
            <h4 className="mt-3 text-sm font-medium text-zinc-500">
              {task.description}
            </h4>
            <div className="mt-3 flex w-full items-center text-xs font-medium text-gray-400">
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 fill-current text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1 leading-none">
                  {moment(task.modified_date).format("LLLL")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
