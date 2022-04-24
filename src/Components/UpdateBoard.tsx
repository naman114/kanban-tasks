import { navigate } from "raviger";
import React, { useState } from "react";
import { BoardCreate, BoardUpdate, validateBoard } from "../types/boardTypes";
import { Errors } from "../types/common";
import { patchBoard } from "../utils/apiUtils";
import { showNotification } from "../utils/notifUtils";

export default function UpdateBoard(props: {
  boardToUpdate: BoardUpdate;
  handleBoardUpdateCB: (id: number, data: BoardCreate) => void;
  closeModalCB: () => void;
}) {
  const [board, setBoard] = useState<BoardCreate>({
    title: props.boardToUpdate.title,
    description: props.boardToUpdate.description,
  });

  const [errors, setErrors] = useState<Errors<BoardCreate>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateBoard(board);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const data: BoardCreate = {
          title: board.title,
          description: board.description,
        };
        props.handleBoardUpdateCB(props.boardToUpdate.id, data);
        await patchBoard(props.boardToUpdate.id, board);
        showNotification("success", "Board updated successfully");
        props.closeModalCB();
      } catch (error) {
        console.log(error);
        showNotification("danger", "Something went wrong");
      }
    }
  };

  return (
    <div className="w-full max-w-lg divide-y divide-gray-200">
      <h1 className="text2xl my-2 text-gray-700">Update Board</h1>
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
            value={board.title}
            onChange={(e) => {
              setBoard({ ...board, title: e.target.value });
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
            value={board.description}
            onChange={(e) => {
              setBoard({ ...board, description: e.target.value });
            }}
            className="my-2 w-full flex-1 rounded-lg border-2 border-gray-200 p-2"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
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
