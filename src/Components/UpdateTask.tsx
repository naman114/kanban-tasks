import React, { useEffect, useState } from "react";
import Loading from "../common/Loading";
import {
  StatusGet,
  TaskCreate,
  TaskGet,
  TaskUpdate,
  validateTask,
} from "../types/boardTypes";
import { Errors, Pagination } from "../types/common";
import { listStatus, patchTask } from "../utils/apiUtils";
import { showNotification } from "../utils/notifUtils";

export default function UpdateTask(props: {
  boardId: number;
  taskToUpdate: TaskUpdate;
  handleTaskUpdateCB: (oldStatusId: number, task: TaskGet) => void;
  closeModalCB: () => void;
}) {
  const [task, setTask] = useState<TaskUpdate>({
    id: props.taskToUpdate.id,
    oldStatusId: props.taskToUpdate.oldStatusId,
    newStatusId: props.taskToUpdate.newStatusId,
    title: props.taskToUpdate.title,
    description: props.taskToUpdate.description,
    is_completed: props.taskToUpdate.is_completed,
  });
  const [statusString, setStatusString] = useState("");
  const [statusList, setStatusList] = useState<
    Array<{ id: number; title: string }>
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchStatusList = async () => {
    setLoading(true);
    const statusListFetched: Pagination<StatusGet> = await listStatus();
    const currentBoardStatuses: StatusGet[] = statusListFetched.results.filter(
      (result) => Number(result.description.split("#")[1]) === props.boardId
    );
    const statusListToSet = currentBoardStatuses.map((s) => {
      return { id: s.id, title: s.title };
    });
    setLoading(false);
    setStatusList(statusListToSet);
    setStatusString(
      statusListToSet.filter(
        (status) => props.taskToUpdate.oldStatusId === status.id
      )[0].title
    );
  };

  useEffect(() => {
    fetchStatusList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //   useEffect(() => {
  //     console.log(task);
  //   }, [task]);

  const [errors, setErrors] = useState<Errors<TaskCreate>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: TaskCreate = {
      status: task.newStatusId,
      title: task.title,
      description: task.description,
      board: props.boardId,
      is_completed: task.is_completed,
    };
    const validationErrors = validateTask(payload);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const data: TaskGet = await patchTask(
          props.boardId,
          props.taskToUpdate.id,
          payload
        );
        props.handleTaskUpdateCB(props.taskToUpdate.oldStatusId, data);
        showNotification("success", "Task updated successfully");
        props.closeModalCB();
      } catch (error) {
        console.log(error);
        showNotification("danger", "Something went wrong");
      }
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="w-full max-w-lg divide-y divide-gray-200">
      <h1 className="text2xl my-2 text-gray-700">Create Task</h1>
      <form onSubmit={handleSubmit} className="py-4">
        <div className="mb-4">
          <label
            htmlFor="title"
            className={`${errors.title ? "text-red-500" : ""}`}
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={task.title}
            onChange={(e) => {
              setTask({ ...task, title: e.target.value });
            }}
            className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className={`${errors.description ? "text-red-500" : ""}`}
          >
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            value={task.description}
            onChange={(e) => {
              setTask({ ...task, description: e.target.value });
            }}
            className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="status"
            className={`${errors.status ? "text-red-500" : "mr-3"}`}
          >
            Status
          </label>
          <select
            value={statusString}
            onChange={(e) => {
              setStatusString(e.target.value);
              setTask({
                ...task,
                newStatusId: statusList.filter(
                  (s) => s.title === e.target.value
                )[0].id,
              });
            }}
          >
            {statusList.map((option, index) => (
              <option key={index} value={option.title}>
                {option.title}
              </option>
            ))}
          </select>
          {errors.status && <p className="text-red-500">{errors.status}</p>}
        </div>
        <button
          type="submit"
          className="mt-4 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
