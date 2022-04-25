import React, { useEffect, useReducer, useState } from "react";
import { Icon } from "@iconify/react";
import { reducer } from "../actions/boardDetailActions";
import Loading from "../common/Loading";
import Modal from "../common/Modal";
import {
  BoardGet,
  BoardDetailState,
  TaskGet,
  TaskGroupByStatus,
  StatusGet,
  TaskUpdate,
} from "../types/boardTypes";
import { Pagination } from "../types/common";
import {
  deleteStatus,
  getBoard,
  listBoardTasks,
  listStatus,
} from "../utils/apiUtils";
import { showNotification } from "../utils/notifUtils";
import Content from "./Content";
import CreateStatus from "./CreateStatus";
import CreateTask from "./CreateTask";
import Sidebar from "./Sidebar";
import BoardDetailStatus from "./BoardDetailStatus";
import { StatusCreate, StatusUpdate } from "../types/statusTypes";
import UpdateStatus from "./UpdateStatus";
import UpdateTask from "./UpdateTask";

const initialState = (): BoardDetailState => {
  const state: BoardDetailState = {
    title: "",
    tasksGroups: [],
    statusList: [],
  };
  return state;
};

export default function BoardDetail(props: { boardId: number }) {
  const [state, dispatch] = useReducer(reducer, null, () => initialState());
  const [loading, setLoading] = useState(false);
  const [isCreateStatusModalOpen, setIsCreateStatusModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);

  const [statusToUpdate, setStatusToUpdate] = useState<StatusUpdate>({
    id: -1,
    title: "",
    description: "",
  });
  const [taskToUpdate, setTaskToUpdate] = useState<TaskUpdate>({
    id: -1,
    oldStatusId: -1,
    newStatusId: -1,
    title: "",
    description: "",
  });

  useEffect(() => {
    console.log(state);
  }, [state]);

  const fetchStatusAndTasks = async () => {
    try {
      setLoading(true);
      const board: BoardGet = await getBoard(props.boardId);
      const taskList: Pagination<TaskGet> = await listBoardTasks(props.boardId);
      const statusList: Pagination<StatusGet> = await listStatus();
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
        title: board.title,
        taskGroups,
        statusList: statusList.results,
      });
    } catch (error) {
      console.error(error);
      showNotification("danger", "Error occured in fetching board");
    }
  };

  useEffect(() => {
    fetchStatusAndTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const handleBoardUpdate = (id: number, data: BoardCreate) => {
  //   const { title, description } = data;
  //   // dispatch({ type: "update_board", id, field: "title", value: title });
  //   // dispatch({
  //   //   type: "update_board",
  //   //   id,
  //   //   field: "description",
  //   //   value: description,
  //   // });
  // };

  // const handleBoardDelete = async (id: number) => {
  //   // dispatch({ type: "delete_board", id });
  //   // setCount(count - 1);
  //   await deleteBoard(id);
  //   showNotification("success", "Form deleted successfully");
  // };

  const handleAddStatus = (createdStatus: StatusGet) => {
    dispatch({
      type: "add_new_status",
      statusId: createdStatus.id,
      tasks: [],
      createdStatus,
    });
  };

  const handleAddTask = (createdTask: TaskGet) => {
    dispatch({
      type: "add_new_task",
      statusId: createdTask.status_object.id,
      createdTask,
    });
  };

  const handleUpdateStatus = (statusId: number, data: StatusCreate) => {
    dispatch({ type: "update_status", statusId, newTitle: data.title });
  };

  const handleDeleteStatus = async (statusId: number) => {
    dispatch({ type: "delete_status", statusId });
    await deleteStatus(statusId);
    showNotification("success", "Status deleted successfully");
  };

  const handleUpdateTask = (oldStatusId: number, task: TaskGet) => {
    console.log({ task });
    dispatch({
      type: "update_task",
      oldStatusId,
      newStatusId: task.status_object.id,
      taskId: task.id,
      updatedTask: task,
    });
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
                disabled={state.tasksGroups.length === 0}
                onClick={(_) => {
                  setIsCreateTaskModalOpen(true);
                }}
                className="group relative flex items-center justify-center gap-2 rounded border-2 border-zinc-500 py-2 px-4 text-sm text-gray-500 hover:bg-slate-200 focus:outline-none disabled:border-zinc-200 disabled:text-gray-200"
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
                <BoardDetailStatus
                  taskGroup={taskGroup}
                  statusList={state.statusList}
                  setStatusToUpdateCB={(status: StatusUpdate) => {
                    setStatusToUpdate(status);
                  }}
                  openStatusUpdateModalCB={() =>
                    setIsUpdateStatusModalOpen(true)
                  }
                  handleDeleteStatusCB={handleDeleteStatus}
                  setTaskToUpdateCB={(task: TaskUpdate) => {
                    setTaskToUpdate(task);
                  }}
                  openTaskUpdateModalCB={() => setIsUpdateTaskModalOpen(true)}
                />
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
          handleAddTaskCB={handleAddTask}
          closeModalCB={() => setIsCreateTaskModalOpen(false)}
        />
      </Modal>
      <Modal
        open={isUpdateTaskModalOpen}
        closeCB={() => setIsUpdateTaskModalOpen(false)}
      >
        <UpdateTask
          boardId={props.boardId}
          taskToUpdate={taskToUpdate}
          handleTaskUpdateCB={handleUpdateTask}
          closeModalCB={() => setIsUpdateTaskModalOpen(false)}
        />
      </Modal>
      <Modal
        open={isCreateStatusModalOpen}
        closeCB={() => setIsCreateStatusModalOpen(false)}
      >
        <CreateStatus
          boardId={props.boardId}
          handleAddStatusCB={handleAddStatus}
          closeModalCB={() => setIsCreateStatusModalOpen(false)}
        />
      </Modal>
      <Modal
        open={isUpdateStatusModalOpen}
        closeCB={() => setIsUpdateStatusModalOpen(false)}
      >
        <UpdateStatus
          statusToUpdate={statusToUpdate}
          handleStatusUpdateCB={handleUpdateStatus}
          closeModalCB={() => setIsUpdateStatusModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
