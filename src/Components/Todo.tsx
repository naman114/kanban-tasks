import { Icon } from "@iconify/react";
import React, { useEffect, useReducer, useState } from "react";
import { reducer } from "../actions/todoActions";
import Loading from "../common/Loading";
import { BoardGet, TaskCreate, TaskGet } from "../types/boardTypes";
import { Pagination } from "../types/common";
import { listBoards, listBoardTasks, patchTask } from "../utils/apiUtils";
import { showNotification } from "../utils/notifUtils";
import Content from "./Content";
import Sidebar from "./Sidebar";

const initialState = (): TaskGet[] => {
  const tasks: TaskGet[] = [];
  return tasks;
};

export default function Todo() {
  const [view, setView] = useState("grid");
  const [state, dispatch] = useReducer(reducer, null, () => initialState());
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const tasks: TaskGet[] = [];
    try {
      setLoading(true);
      const boardList: Pagination<BoardGet> = await listBoards({});
      for (const board of boardList.results) {
        const taskList: Pagination<TaskGet> = await listBoardTasks(board.id);
        tasks.push(...taskList.results);
      }
      setLoading(false);
      dispatch({
        type: "populate_todo_tasks",
        tasks,
      });
    } catch (error) {
      console.error(error);
      showNotification("danger", "Error occured in fetching board");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    console.log(state);
  }, [state]);

  const updateTaskCompletion = async (task: TaskGet, is_completed: boolean) => {
    const payload: TaskCreate = {
      status: task.status_object.id,
      title: task.title,
      description: task.description,
      board: task.board,
      is_completed,
    };
    await patchTask(task.board_object.id, task.id, payload);
    showNotification("success", "Task updated successfully");
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex h-screen">
      <Sidebar />
      <Content>
        <div className="m-10">
          <h1 className="text-5xl font-medium text-slate-900">To Do</h1>
          <div className="my-6 flex justify-between">
            <button className="group invisible relative flex items-center justify-center gap-2 rounded border-2 border-zinc-500 py-2 px-4 text-sm text-gray-500 hover:bg-slate-200 focus:outline-none">
              <p>Filter</p>
              <Icon icon="akar-icons:chevron-down" />
            </button>
            <div className="flex gap-2">
              <button
                //   onClick={(_) => {
                //     setNewBoard(true);
                //   }}
                className="group relative flex items-center justify-center gap-2 rounded border-2 border-zinc-500 py-2 px-4 text-sm text-gray-500 hover:bg-slate-200 focus:outline-none"
              >
                <Icon
                  icon="ant-design:plus-square-outlined"
                  className="text-xl"
                />
                <p>Add New</p>
              </button>
              <div className="flex gap-2 rounded border-2 border-zinc-500">
                <button
                  className={
                    view === "grid" ? "rounded bg-slate-400 px-1" : "px-1"
                  }
                  onClick={() => {
                    setView("grid");
                  }}
                >
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1109 2.88867H4.33312C3.95003 2.88867 3.58263 3.04085 3.31174 3.31174C3.04085 3.58263 2.88867 3.95003 2.88867 4.33312V10.1109C2.88867 10.494 3.04085 10.8614 3.31174 11.1323C3.58263 11.4032 3.95003 11.5553 4.33312 11.5553H10.1109C10.494 11.5553 10.8614 11.4032 11.1323 11.1323C11.4032 10.8614 11.5553 10.494 11.5553 10.1109V4.33312C11.5553 3.95003 11.4032 3.58263 11.1323 3.31174C10.8614 3.04085 10.494 2.88867 10.1109 2.88867ZM4.33312 10.1109V4.33312H10.1109V10.1109H4.33312Z"
                      fill="black"
                    />
                    <path
                      d="M21.6666 2.88867H15.8888C15.5057 2.88867 15.1383 3.04085 14.8674 3.31174C14.5965 3.58263 14.4443 3.95003 14.4443 4.33312V10.1109C14.4443 10.494 14.5965 10.8614 14.8674 11.1323C15.1383 11.4032 15.5057 11.5553 15.8888 11.5553H21.6666C22.0496 11.5553 22.417 11.4032 22.6879 11.1323C22.9588 10.8614 23.111 10.494 23.111 10.1109V4.33312C23.111 3.95003 22.9588 3.58263 22.6879 3.31174C22.417 3.04085 22.0496 2.88867 21.6666 2.88867ZM15.8888 10.1109V4.33312H21.6666V10.1109H15.8888Z"
                      fill="black"
                    />
                    <path
                      d="M10.1109 14.4443H4.33312C3.95003 14.4443 3.58263 14.5965 3.31174 14.8674C3.04085 15.1383 2.88867 15.5057 2.88867 15.8888V21.6666C2.88867 22.0496 3.04085 22.417 3.31174 22.6879C3.58263 22.9588 3.95003 23.111 4.33312 23.111H10.1109C10.494 23.111 10.8614 22.9588 11.1323 22.6879C11.4032 22.417 11.5553 22.0496 11.5553 21.6666V15.8888C11.5553 15.5057 11.4032 15.1383 11.1323 14.8674C10.8614 14.5965 10.494 14.4443 10.1109 14.4443ZM4.33312 21.6666V15.8888H10.1109V21.6666H4.33312Z"
                      fill="black"
                    />
                    <path
                      d="M21.6666 14.4443H15.8888C15.5057 14.4443 15.1383 14.5965 14.8674 14.8674C14.5965 15.1383 14.4443 15.5057 14.4443 15.8888V21.6666C14.4443 22.0496 14.5965 22.417 14.8674 22.6879C15.1383 22.9588 15.5057 23.111 15.8888 23.111H21.6666C22.0496 23.111 22.417 22.9588 22.6879 22.6879C22.9588 22.417 23.111 22.0496 23.111 21.6666V15.8888C23.111 15.5057 22.9588 15.1383 22.6879 14.8674C22.417 14.5965 22.0496 14.4443 21.6666 14.4443ZM15.8888 21.6666V15.8888H21.6666V21.6666H15.8888Z"
                      fill="black"
                    />
                  </svg>
                </button>
                <button
                  className={
                    view === "list" ? "rounded bg-slate-400 px-1" : "px-1"
                  }
                  onClick={() => {
                    setView("list");
                  }}
                >
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.875 7.3125H21.125C21.987 7.3125 22.8136 7.65491 23.4231 8.2644C24.0326 8.8739 24.375 9.70055 24.375 10.5625V15.4375C24.375 16.2995 24.0326 17.1261 23.4231 17.7356C22.8136 18.3451 21.987 18.6875 21.125 18.6875H4.875C4.01305 18.6875 3.1864 18.3451 2.5769 17.7356C1.96741 17.1261 1.625 16.2995 1.625 15.4375V10.5625C1.625 9.70055 1.96741 8.8739 2.5769 8.2644C3.1864 7.65491 4.01305 7.3125 4.875 7.3125ZM4.875 8.9375C4.44402 8.9375 4.0307 9.10871 3.72595 9.41345C3.4212 9.7182 3.25 10.1315 3.25 10.5625V15.4375C3.25 15.8685 3.4212 16.2818 3.72595 16.5865C4.0307 16.8913 4.44402 17.0625 4.875 17.0625H21.125C21.556 17.0625 21.9693 16.8913 22.274 16.5865C22.5788 16.2818 22.75 15.8685 22.75 15.4375V10.5625C22.75 10.1315 22.5788 9.7182 22.274 9.41345C21.9693 9.10871 21.556 8.9375 21.125 8.9375H4.875ZM1.625 3.25C1.625 3.03451 1.7106 2.82785 1.86298 2.67548C2.01535 2.5231 2.22201 2.4375 2.4375 2.4375H23.5625C23.778 2.4375 23.9847 2.5231 24.137 2.67548C24.2894 2.82785 24.375 3.03451 24.375 3.25C24.375 3.46549 24.2894 3.67215 24.137 3.82452C23.9847 3.9769 23.778 4.0625 23.5625 4.0625H2.4375C2.22201 4.0625 2.01535 3.9769 1.86298 3.82452C1.7106 3.67215 1.625 3.46549 1.625 3.25ZM1.625 22.75C1.625 22.5345 1.7106 22.3278 1.86298 22.1755C2.01535 22.0231 2.22201 21.9375 2.4375 21.9375H23.5625C23.778 21.9375 23.9847 22.0231 24.137 22.1755C24.2894 22.3278 24.375 22.5345 24.375 22.75C24.375 22.9655 24.2894 23.1722 24.137 23.3245C23.9847 23.4769 23.778 23.5625 23.5625 23.5625H2.4375C2.22201 23.5625 2.01535 23.4769 1.86298 23.3245C1.7106 23.1722 1.625 22.9655 1.625 22.75Z"
                      fill="black"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {view === "grid" ? (
            <div className="grid grid-cols-3 gap-4">
              {state.map((task, index) => {
                console.log(task);
                return (
                  <div
                    key={index}
                    className={`flex flex-col rounded-xl  py-6 px-6 ${
                      task.is_completed ? "bg-stone-100" : "bg-stone-200"
                    }`}
                  >
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          dispatch({
                            type: "update_task",
                            taskId: task.id,
                            is_completed: task.is_completed ? false : true,
                          });
                          updateTaskCompletion(
                            task,
                            task.is_completed ? false : true
                          );
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-black bg-white"
                      >
                        <Icon
                          icon="charm:circle-tick"
                          className={`${task.is_completed ? "" : "hidden"}`}
                        />
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      <p
                        className={`text-lg font-semibold text-slate-900 ${
                          task.is_completed ? "line-through" : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <p
                        className={`text-zinc-500 ${
                          task.is_completed ? "line-through" : ""
                        }`}
                      >
                        {task.description}
                      </p>
                      <div className="flex justify-end">
                        <Icon
                          icon="mi:options-horizontal"
                          className="cursor-pointer text-xl"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {state.map((task, index) => {
                return (
                  <div
                    key={index}
                    className={`flex w-full items-center justify-between rounded-xl px-8 py-6 pl-8 ${
                      task.is_completed ? "bg-stone-100" : "bg-stone-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          dispatch({
                            type: "update_task",
                            taskId: task.id,
                            is_completed: task.is_completed ? false : true,
                          });
                          updateTaskCompletion(
                            task,
                            task.is_completed ? false : true
                          );
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-black bg-white"
                      >
                        <Icon
                          icon="charm:circle-tick"
                          className={`${task.is_completed ? "" : "hidden"}`}
                        />
                      </button>
                      <div className="flex max-w-xl flex-col">
                        <p
                          className={`px-8 text-lg font-semibold text-slate-900 ${
                            task.is_completed ? "line-through" : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        <p
                          className={`px-8 font-semibold text-zinc-500 ${
                            task.is_completed ? "line-through" : ""
                          }`}
                        >
                          {task.description}
                        </p>
                      </div>
                    </div>
                    <Icon
                      icon="mi:options-horizontal"
                      className="cursor-pointer text-xl"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Content>
    </div>
  );
}
