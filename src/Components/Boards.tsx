import { Icon } from "@iconify/react";
import { useQueryParams } from "raviger";
import React, { useEffect, useReducer, useState } from "react";
import { reducer } from "../actions/boardActions";
import Loading from "../common/Loading";
import Modal from "../common/Modal";
import Paginate from "../common/Paginate";
import { BoardGet, BoardCreate } from "../types/boardTypes";
import { Pagination } from "../types/common";
import { listBoards, patchBoard } from "../utils/apiUtils";
import { showNotification } from "../utils/notifUtils";
import BoardListItem from "./BoardListItem";
import Content from "./Content";
import CreateBoard from "./CreateBoard";
import Sidebar from "./Sidebar";

const initialState = (): BoardGet[] => {
  return [];
};

export default function Boards() {
  const [state, dispatch] = useReducer(reducer, null, () => initialState());
  const [newBoard, setNewBoard] = useState(false);
  const [{ page }, setPageQP] = useQueryParams();
  const [pageNum, setPageNum] = useState<number>(page ?? 1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageQP({ page: pageNum });
  }, [pageNum]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchBoards();
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const data: Pagination<BoardGet> = await listBoards({
        offset: (pageNum - 1) * 6,
        limit: 6,
      });
      console.log(data);
      setLoading(false);
      setCount(data.count);
      const boards: BoardGet[] = data.results.map((result) => {
        const { id, title, description, created_date, modified_date } = result;
        const board: BoardGet = {
          id,
          title,
          description,
          created_date,
          modified_date,
        };
        return board;
      });
      dispatch({ type: "populate_boards", boards });
    } catch (error) {
      console.error(error);
      showNotification("danger", "Error occured in fetching boards");
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBoardUpdate = (id: number, data: BoardCreate) => {
    const { title, description } = data;
    dispatch({ type: "update_board", id, field: "title", value: title });
    dispatch({
      type: "update_board",
      id,
      field: "description",
      value: description,
    });
    patchBoard(id, { title, description });
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Content>
        <div className="m-10">
          <h1 className="text-5xl font-medium text-slate-900">My Boards</h1>
          <div className="my-6 flex justify-between">
            <button className="group relative flex items-center justify-center gap-2 rounded border-2 border-zinc-500 py-2 px-4 text-sm text-gray-500 hover:bg-slate-200 focus:outline-none">
              <p>Filter</p>
              <Icon icon="akar-icons:chevron-down" />
            </button>
            <button
              onClick={(_) => {
                setNewBoard(true);
              }}
              className="group relative flex items-center justify-center gap-2 rounded border-2 border-zinc-500 py-2 px-4 text-sm text-gray-500 hover:bg-slate-200 focus:outline-none"
            >
              <Icon
                icon="ant-design:plus-square-outlined"
                className="text-xl"
              />
              <p>New Board</p>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {state.map((board) => {
              return (
                <BoardListItem
                  id={board.id}
                  board={board}
                  handleBoardUpdateCB={handleBoardUpdate}
                />
              );
            })}
          </div>
          <Paginate
            itemsPerPage={6}
            count={count}
            pageNum={pageNum}
            setPageCB={setPageNum}
          />
        </div>
      </Content>
      <Modal open={newBoard} closeCB={() => setNewBoard(false)}>
        <CreateBoard />
      </Modal>
    </div>
  );
}