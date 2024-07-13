import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import {
  boardModalState,
  boardOrderState,
  editModalState,
  toDoState,
  TRELLO_TODO,
} from "./atoms";
import Board from "./components/Board";
import AddBoardButton from "./components/AddBoardButton";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import BoardModal from "./components/BoardModal";
import EditToDo from "./components/EditToDo";

library.add(fas, fab, far);

const Wrapper = styled.div`
  display: flex;
  max-width: 1024px;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
`;

const Boards = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 20px;
`;

function App() {
  const boardOrder = useRecoilValue(boardOrderState);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const modalState = useRecoilValue(boardModalState);
  const editState = useRecoilValue(editModalState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        const dragEndResult = {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
        localStorage.setItem(TRELLO_TODO, JSON.stringify(dragEndResult));
        return dragEndResult;
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // cross board movement.
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        const dragEndResult = {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
        localStorage.setItem(TRELLO_TODO, JSON.stringify(dragEndResult));
        return dragEndResult;
      });
    }
  };
  return (
    <>
      <AddBoardButton />
      {editState ? <EditToDo /> : null}
      {modalState ? <BoardModal /> : null}
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {boardOrder.map((boardId) => (
              <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </>
  );
}

export default App;
