import { faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { IToDo, toDoState, TRELLO_TODO } from "../atoms";

const Card = styled.div<{ $isDragging: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 15px;
  background-color: ${(props) =>
    props.$isDragging ? "#6c5ce7" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.$isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.3)" : "none"};
`;

const CardBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 25px;
  height: 25px;
  background-color: #b1bec2;
  border-radius: 3px;
  color: white;
  font-size: 12px;
  &:nth-child(2):hover {
    cursor: pointer;
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
  const onBtnClick = () => {
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
            <CardBtn>
              <FontAwesomeIcon icon={faPencil} />
            </CardBtn>
            <CardBtn onClick={onBtnClick}>
              <FontAwesomeIcon icon={faXmark} />
            </CardBtn>
          </Wrapper>
        </Card>
      )}
    </Draggable>
  );
}

export default memo(DraggableCard);
