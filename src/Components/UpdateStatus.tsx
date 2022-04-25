import React, { useState } from "react";
import { Errors } from "../types/common";
import {
  StatusCreate,
  StatusUpdate,
  validateStatus,
} from "../types/statusTypes";
import { patchStatus } from "../utils/apiUtils";
import { showNotification } from "../utils/notifUtils";

export default function UpdateStatus(props: {
  statusToUpdate: StatusUpdate;
  handleStatusUpdateCB: (id: number, data: StatusCreate) => void;
  closeModalCB: () => void;
}) {
  const [status, setStatus] = useState<StatusCreate>({
    title: props.statusToUpdate.title,
    description: props.statusToUpdate.description,
  });

  const [errors, setErrors] = useState<Errors<StatusCreate>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateStatus(status);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const data: StatusCreate = {
          title: status.title,
          description: status.description,
        };
        props.handleStatusUpdateCB(props.statusToUpdate.id, data);
        await patchStatus(props.statusToUpdate.id, status);
        showNotification("success", "Status updated successfully");
        props.closeModalCB();
      } catch (error) {
        console.log(error);
        showNotification("danger", "Something went wrong");
      }
    }
  };

  return (
    <div className="w-full max-w-lg divide-y divide-gray-200">
      <h1 className="text2xl my-2 text-gray-700">Update Status</h1>
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
            value={status.title}
            onChange={(e) => {
              setStatus({ ...status, title: e.target.value });
            }}
            className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
