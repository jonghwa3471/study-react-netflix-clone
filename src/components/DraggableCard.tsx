import { faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  cardState,
  editModalState,
  IToDo,
  toDoState,
  TRELLO_TODO,
} from "../atoms";

const Card = styled.div<{ $isDragging: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 15px;
  background-color: ${(props) =>
    props.$isDragging ? "rgba(85, 239, 196, 0.6)" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.$isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.3)" : "none"};
  border: 3px solid
    ${(props) =>
      props.$isDragging ? "rgba(85, 239, 196, 1)" : props.theme.cardColor};
  span {
    color: ${({ $isDragging }) => ($isDragging ? "white" : "darkgray")};
  }
`;

const CardBtn = styled.div<{ $isDragging: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 25px;
  height: 25px;
  border-radius: 3px;
  background-color: ${({ $isDragging }) =>
    $isDragging ? "white" : "rgba(178, 190, 195,1.0)"};
  color: ${({ $isDragging }) =>
    $isDragging ? "rgba(178, 190, 195,1.0)" : "white"};
  font-size: 12px;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
  toDos: IToDo[];
}

function DraggableCard({
  toDos,
  boardId,
  toDoId,
  toDoText,
  index,
}: IDraggableCardProps) {
  const setTodos = useSetRecoilState(toDoState);
  const editState = useSetRecoilState(editModalState);
  const setCard = useSetRecoilState(cardState);
  const onEditClick = () => {
    setCard({ [boardId]: toDoId });
    editState((currVal) => !currVal);
  };
  const onDeleteClick = () => {
    setTodos((oldTodos) => {
      const newToDos = toDos.filter((toDo) => toDoId !== toDo.id);
      const result = {
        ...oldTodos,
        [boardId]: newToDos,
      };
      localStorage.setItem(TRELLO_TODO, JSON.stringify(result));
      return result;
    });
  };
  return (
    <Draggable draggableId={String(toDoId)} index={index}>
      {(provided, snapshot) => (
        <Card
          $isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <span>{toDoText}</span>
          <Wrapper>
            <CardBtn $isDragging={snapshot.isDragging} onClick={onEditClick}>
              <FontAwesomeIcon icon={faPencil} />
            </CardBtn>
            <CardBtn $isDragging={snapshot.isDragging} onClick={onDeleteClick}>
              <FontAwesomeIcon icon={faXmark} />
            </CardBtn>
          </Wrapper>
        </Card>
      )}
    </Draggable>
  );
}

export default memo(DraggableCard);
