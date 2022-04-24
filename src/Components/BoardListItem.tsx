import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { BoardGet, BoardUpdate } from "../types/boardTypes";

export default function BoardListItem(props: {
  id: number;
  board: BoardGet;
  setBoardToUpdateCB: (boardToUpdate: BoardUpdate) => void;
  openUpdateModalCB: () => void;
  handleDeleteBoardCB: (id: number) => void;
}) {
  const [isActive, setIsActive] = useState(false);

  const toggle = () => {
    isActive ? setIsActive(false) : setIsActive(true);
  };

  const handleEdit = () => {
    props.setBoardToUpdateCB({
      id: props.id,
      title: props.board.title,
      description: props.board.description,
    });
    props.openUpdateModalCB();
  };

  const handleDelete = () => {};

  return (
    <div key={props.board.id} className="rounded-xl bg-stone-300">
      <div className="mx-6 mt-7 mb-16 flex flex-col gap-4">
        <div className="relative flex items-center justify-between ">
          <p className="text-lg font-medium text-slate-900">
            {props.board.title}
          </p>
          {isActive ? (
            <div
              onBlur={() => setIsActive(false)}
              className="absolute top-3 right-6 rounded-lg bg-stone-400"
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
                    handler: () => props.handleDeleteBoardCB(props.board.id),
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
            className="cursor-pointer text-xl"
            onClick={() => toggle()}
          />
        </div>
        <p>{props.board.description}</p>
      </div>
    </div>
  );
}
