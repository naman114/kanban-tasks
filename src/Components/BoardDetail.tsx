import { Icon } from "@iconify/react";
import moment from "moment";
import { useQueryParams } from "raviger";
import React, { useEffect, useReducer, useState } from "react";
import { reducer } from "../actions/boardDetailActions";
import Loading from "../common/Loading";
import Modal from "../common/Modal";
import Paginate from "../common/Paginate";
import {
  BoardGet,
  BoardCreate,
  BoardUpdate,
  BoardDetailState,
  TaskGet,
  TaskGroupByStatus,
  StatusGet,
} from "../types/boardTypes";
import { Pagination } from "../types/common";
import {
  deleteBoard,
  deleteForm,
  getBoard,
  listBoards,
  listBoardTasks,
  listStatus,
  patchBoard,
} from "../utils/apiUtils";
import { showNotification } from "../utils/notifUtils";
import BoardListItem from "./BoardListItem";
import Content from "./Content";
import CreateBoard from "./CreateBoard";
import CreateStatus from "./CreateStatus";
import CreateTask from "./CreateTask";
import Sidebar from "./Sidebar";
import UpdateBoard from "./UpdateBoard";

const initialState = (): BoardDetailState => {
  const state: BoardDetailState = {
    title: "",
    tasksGroups: [],
  };
  return state;
};

export default function BoardDetail(props: { boardId: number }) {
  const [state, dispatch] = useReducer(reducer, null, () => initialState());
  const [newBoard, setNewBoard] = useState(false);
  const [{ page }, setPageQP] = useQueryParams();
  const [pageNum, setPageNum] = useState<number>(page ?? 1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateStatusModalOpen, setIsCreateStatusModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [boardToUpdate, setBoardToUpdate] = useState<BoardUpdate>({
    id: -1,
    title: "",
    description: "",
  });
  const [statusList, setStatusList] = useState<Array<StatusGet>>();
  const [taskList, setTaskList] = useState<Array<TaskGet>>();

  const fetchTitle = async () => {
    const data: BoardGet = await getBoard(props.boardId);
    dispatch({
      type: "populate_board_detail",
      field: "title",
      value: data.title,
    });
  };

  useEffect(() => {
    console.log(state);
  }, [state]);

  const fetchStatusAndTasks = async () => {
    try {
      setLoading(true);
      const taskList: Pagination<TaskGet> = await listBoardTasks(props.boardId);
      const statusList: Pagination<StatusGet> = await listStatus();
      setTaskList(taskList.results);
      setStatusList(statusList.results);

      const currentBoardStatuses: StatusGet[] = statusList.results.filter(
        (result) => Number(result.description.split("#")[1]) === props.boardId
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
      setLoading(false);
      dispatch({
        type: "populate_board_detail",
        field: "tasksGroups",
        value: taskGroups,
      });
    } catch (error) {
      console.error(error);
      showNotification("danger", "Error occured in fetching board");
    }
  };

  useEffect(() => {
    fetchTitle();
    fetchStatusAndTasks();
  }, []);

  const handleBoardUpdate = (id: number, data: BoardCreate) => {
    const { title, description } = data;
    // dispatch({ type: "update_board", id, field: "title", value: title });
    // dispatch({
    //   type: "update_board",
    //   id,
    //   field: "description",
    //   value: description,
    // });
  };

  const handleBoardDelete = async (id: number) => {
    // dispatch({ type: "delete_board", id });
    setCount(count - 1);
    await deleteBoard(id);
    showNotification("success", "Form deleted successfully");
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex h-screen">
      <Sidebar />
      <Content>
        <div className="m-10">
          <h1 className="text-5xl font-medium text-slate-900">{state.title}</h1>
          <div className="my-6 flex justify-between">
            <button className="group relative flex items-center justify-center gap-2 rounded border-2 border-zinc-500 py-2 px-4 text-sm text-gray-500 hover:bg-slate-200 focus:outline-none">
              <p>Filter</p>
              <Icon icon="akar-icons:chevron-down" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={(_) => {
                  setIsCreateStatusModalOpen(true);
                }}
                className="group relative flex items-center justify-center gap-2 rounded border-2 border-zinc-500 py-2 px-4 text-sm text-gray-500 hover:bg-slate-200 focus:outline-none"
              >
                <Icon
                  icon="ant-design:plus-square-outlined"
                  className="text-xl"
                />
                <p>New Status</p>
              </button>
              <button
                onClick={(_) => {
                  setIsCreateTaskModalOpen(true);
                }}
                className="group relative flex items-center justify-center gap-2 rounded border-2 border-zinc-500 py-2 px-4 text-sm text-gray-500 hover:bg-slate-200 focus:outline-none"
              >
                <Icon
                  icon="ant-design:plus-square-outlined"
                  className="text-xl"
                />
                <p>New Task</p>
              </button>
            </div>
          </div>

          {/* <div className="w-96 gap-4 overflow-auto">
            {state.map((board) => {
              return (
                <BoardListItem
                  board={board}
                  setBoardToUpdateCB={(boardToUpdate: BoardUpdate) =>
                    setBoardToUpdate(boardToUpdate)
                  }
                  openUpdateModalCB={() => setIsUpdateModalOpen(true)}
                  handleDeleteBoardCB={handleBoardDelete}
                />
              );
            })}
          </div> */}
          <div className="mt-4 flex flex-grow space-x-6 overflow-auto">
            {state.tasksGroups.map((taskGroup) => {
              return (
                <div className="flex w-72 flex-shrink-0 flex-col bg-stone-100">
                  <div className="flex h-10 flex-shrink-0 items-center px-2">
                    <span className="block text-sm font-semibold">
                      {
                        statusList?.filter(
                          (status) => status.id === taskGroup.status
                        )[0].title
                      }
                    </span>
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded bg-white bg-opacity-30 text-sm font-semibold text-slate-900">
                      {taskGroup.tasks.length}
                    </span>
                    <button className="ml-auto flex h-6 w-6 items-center justify-center rounded text-slate-900 hover:bg-stone-300 hover:text-black">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-col overflow-auto p-2">
                    <hr className="mb-3 h-[] bg-zinc-500" />
                    {taskGroup.tasks.map((task) => (
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
            })}
          </div>
        </div>
      </Content>
      <Modal
        open={isCreateTaskModalOpen}
        closeCB={() => setIsCreateTaskModalOpen(false)}
      >
        <CreateTask
          boardId={props.boardId}
          closeModalCB={() => setIsCreateTaskModalOpen(false)}
        />
      </Modal>
      <Modal
        open={isCreateStatusModalOpen}
        closeCB={() => setIsCreateStatusModalOpen(false)}
      >
        <CreateStatus
          boardId={props.boardId}
          closeModalCB={() => setIsCreateStatusModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
