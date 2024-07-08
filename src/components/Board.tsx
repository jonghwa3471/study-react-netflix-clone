import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import {
  IToDo,
  TRELLO_ORDER,
  TRELLO_TODO,
  boardOrderState,
  toDoState,
} from "../atoms";
import { useSetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  padding: 20px 5px;
  background-color: rgba(245, 245, 245, 0.8);
  border-radius: 5px;
  min-height: 270px;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 20px;
`;

interface IAreaProps {
  $isDraggingOver: boolean;
  $isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.$isDraggingOver
      ? "#2d3436"
      : props.$isDraggingFromThis
      ? "#636e72"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 10px 20px;
`;

const Form = styled.form`
  width: 100%;
  padding: 10px 20px;
  input {
    width: 100%;
    border-radius: 5px;
    margin-bottom: 5px;
    padding: 20px 10px;
    border: none;
  }
`;

const BoardDeleteButton = styled.div`
  width: 20px;
  height: 20px;
  background-color: #d3d3d3;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 15px;
  top: 15px;
  > svg {
    color: white;
  }
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;
interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const setBoardOrder = useSetRecoilState(boardOrderState);
  const deleteBoard = () => {
    setToDos((oldToDos) => {
      const copiedToDos = { ...oldToDos };
      delete copiedToDos[boardId];
      const result = copiedToDos;
      localStorage.setItem(TRELLO_TODO, JSON.stringify(result));
      return result;
    });
    setBoardOrder((prev) => {
      const copiedBoardOrder = [...prev];
      const result = copiedBoardOrder.filter((id) => id !== boardId);
      localStorage.setItem(TRELLO_ORDER, JSON.stringify(result));
      return result;
    });
  };
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      const result = {
        ...allBoards,
        [boardId]: [...toDos, newToDo],
      };
      localStorage.setItem(TRELLO_TODO, JSON.stringify(result));
      return result;
    });
    setValue("toDo", "");
  };
  return (
    <Wrapper>
      <BoardDeleteButton onClick={deleteBoard}>
        <FontAwesomeIcon icon={faXmark} />
      </BoardDeleteButton>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder="할 일을 추가하세요."
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            $isDraggingOver={snapshot.isDraggingOver}
            $isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                toDoId={toDo.id}
                toDoText={toDo.text}
                boardId={boardId}
                toDos={toDos}
                index={index}
              />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
