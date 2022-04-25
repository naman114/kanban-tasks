import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { StatusGet, TaskGroupByStatus, TaskUpdate } from "../types/boardTypes";
import { StatusUpdate } from "../types/statusTypes";
import BoardDetailTask from "./BoardDetailTask";

export default function BoardDetailStatus(props: {
  taskGroup: TaskGroupByStatus;
  statusList: StatusGet[];
  setStatusToUpdateCB: (status: StatusUpdate) => void;
  handleDeleteStatusCB: (statusId: number) => void;
  openStatusUpdateModalCB: () => void;
  setTaskToUpdateCB: (task: TaskUpdate) => void;
  openTaskUpdateModalCB: () => void;
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
                  handler: () => {
                    props.handleDeleteStatusCB(props.taskGroup.status);
                  },
                },
              ].map((item, idx) => {
                return (
                  <li key={idx} className="hover:bg-stone-500">
                    <button
                      onClick={item.handler}
                      className="flex space-x-2 px-2 py-2"
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
          <BoardDetailTask
            task={task}
            setTaskToUpdateCB={props.setTaskToUpdateCB}
            openTaskUpdateModalCB={props.openTaskUpdateModalCB}
          />
        ))}
      </div>
    </div>
  );
}
