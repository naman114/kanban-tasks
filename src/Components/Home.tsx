import moment from "moment";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { BoardData } from "../types/homeTypes";
import { userContext } from "../utils/userUtils";
import Content from "./Content";
import Sidebar from "./Sidebar";
import { reducer } from "../actions/homeActions";
import { Pagination } from "../types/common";
import {
  BoardGet,
  StatusGet,
  TaskGet,
  TaskGroupByStatus,
} from "../types/boardTypes";
import { listBoards, listBoardTasks, listStatus } from "../utils/apiUtils";
import { showNotification } from "../utils/notifUtils";
import Loading from "../common/Loading";

const initialState = (): BoardData[] => {
  const boards: BoardData[] = [];
  return boards;
};

const statusClassName = {
  active:
    "mb-[-2px] border-b-4 border-zinc-500 px-3 pt-2 font-bold text-zinc-500",
  inactive: "px-3 pt-2 font-medium text-zinc-500",
};

export default function Home() {
  const currentUser = useContext(userContext);
  const [state, dispatch] = useReducer(reducer, null, () => initialState());
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(-1);
  const [statusList, setStatusList] = useState<StatusGet[]>([]);
  const [taskProgress, setTaskProgress] = useState({
    completedTasks: 0,
    incompleteTasks: 0,
    totalTasks: 0,
  });

  const fetchBoardData = async () => {
    const boards: BoardData[] = [];
    try {
      let completedTasks = 0;
      let incompleteTasks = 0;
      let totalTasks = 0;
      setLoading(true);
      const boardList: Pagination<BoardGet> = await listBoards({});
      for (const board of boardList.results) {
        const taskList: Pagination<TaskGet> = await listBoardTasks(board.id);
        totalTasks += taskList.results.length;
        for (const task of taskList.results) {
          if (task.is_completed) completedTasks++;
          else incompleteTasks++;
        }
        const statusList: Pagination<StatusGet> = await listStatus();
        setStatusList(statusList.results);
        const currentBoardStatuses: StatusGet[] = statusList.results.filter(
          (result) => Number(result.description.split("#")[1]) === board.id
        );

        const taskGroups: TaskGroupByStatus[] = currentBoardStatuses.map(
          (result) => {
            console.log({ result });
            const group: TaskGroupByStatus = {
              status: result.id,
              tasks: [],
            };
            return group;
          }
        );

        for (const task of taskList.results) {
          for (const group of taskGroups) {
            if (group.status === task.status_object.id) {
              group.tasks.push(task);
            }
          }
        }

        boards.push({ board, data: taskGroups });
      }
      setLoading(false);
      dispatch({
        type: "populate_board_data",
        data: boards,
      });
      setCurrentStatus(
        boards.length === 0 || boards[0].data.length === 0
          ? -1
          : boards[0].data[0].status
      );
      setTaskProgress({
        completedTasks,
        incompleteTasks,
        totalTasks,
      });
    } catch (error) {
      console.error(error);
      showNotification("danger", "Error occured in fetching board");
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, []);
  useEffect(() => {
    console.log({ state });
  }, [state]);

  return loading ? (
    <Loading />
  ) : (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Content>
        <div className="flex h-screen flex-col space-y-4 px-16 py-6">
          <div className="mb-8 flex flex-col gap-1">
            <p className="text-[16px] text-slate-900">
              {moment().format("dddd, MMMM D")}
            </p>
            <p className="text-[32px] text-slate-900">
              {generateGreetings()}, {currentUser.username}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded border-2 bg-white">
              <div className="mx-8 my-3 flex">
                <div className="flex flex-col">
                  <p className="mb-8 text-slate-900">Completed Tasks</p>
                  <p className="text-lg font-bold text-slate-900">
                    {taskProgress.completedTasks}
                  </p>
                  <p className="text-zinc-500">Task Count</p>
                </div>
              </div>
            </div>
            <div className="rounded border-2 bg-white">
              <div className="mx-8 my-3 flex">
                <div className="flex flex-col">
                  <p className="mb-8 text-slate-900">Incomplete Tasks</p>
                  <p className="text-lg font-bold text-slate-900">
                    {taskProgress.incompleteTasks}
                  </p>
                  <p className="text-zinc-500">Task Count</p>
                </div>
              </div>
            </div>
            <div className="rounded border-2 bg-white">
              <div className="mx-8 my-3 flex">
                <div className="flex flex-col">
                  <p className="mb-8 text-slate-900">Total Tasks</p>
                  <p className="text-lg font-bold text-slate-900">
                    {taskProgress.totalTasks}
                  </p>
                  <p className="text-zinc-500">Task Count</p>
                </div>
              </div>
            </div>
          </div>
          <h1 className="pt-10 text-2xl font-medium text-slate-900">
            My Tasks
          </h1>
          {currentStatus === -1 ? (
            <p className="text-slate-900">No tasks!</p>
          ) : (
            <div className="flex flex-col">
              <div className="flex w-full gap-4 border-b-2">
                {state.map((boardData) => {
                  return boardData.data.map((group) => {
                    return (
                      <button
                        className={
                          group.status === currentStatus
                            ? statusClassName.active
                            : statusClassName.inactive
                        }
                        onClick={() => setCurrentStatus(group.status)}
                      >
                        {
                          statusList.filter(
                            (status) => status.id === group.status
                          )[0].title
                        }
                      </button>
                    );
                  });
                })}
              </div>
              <div className="mb-2 flex max-h-56 flex-col gap-2 overflow-scroll pt-3">
                {state.map((boardData) => {
                  return boardData.data
                    .filter((group) => group.status === currentStatus)
                    .map((group) => {
                      return group.tasks.map((task) => {
                        return (
                          <div className="w-full rounded bg-stone-200">
                            <p className="px-8 py-4 font-medium text-zinc-500">
                              {task.title}
                            </p>
                          </div>
                        );
                      });
                    });
                })}
              </div>
            </div>
          )}
        </div>
      </Content>
    </div>
  );
}

const generateGreetings = () => {
  const currentHour = Number(moment().format("HH"));

  if (currentHour >= 0 && currentHour < 12) {
    return "Good Morning";
  } else if (currentHour >= 12 && currentHour < 15) {
    return "Good Afternoon";
  } else if (currentHour >= 15 && currentHour <= 23) {
    return "Good Evening";
  }
};
