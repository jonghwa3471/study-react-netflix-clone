import styled from "styled-components";
import { FcEmptyTrash, FcFullTrash } from "react-icons/fc";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TrashCan = styled.div<{
  $isDraggingOver: boolean;
  $draggingFromThisWith: boolean;
}>`
  font-size: 110px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  padding: 10px;
  background-color: ${({ $isDraggingOver, $draggingFromThisWith }) =>
    $isDraggingOver
      ? "rgba(223, 230, 233,0.3)"
      : $draggingFromThisWith
      ? "rgba(225, 112, 85,0.5)"
      : "transparent"};
`;

function DroppableTrashCan() {
  return (
    <Container>
      <Droppable droppableId="trashCan">
        {(provided, snapshot) => (
          <TrashCan
            ref={provided.innerRef}
            {...provided.droppableProps}
            $isDraggingOver={snapshot.isDraggingOver}
            $draggingFromThisWith={!!snapshot.draggingFromThisWith}
          >
            {snapshot.isDraggingOver ? <FcFullTrash /> : <FcEmptyTrash />}
          </TrashCan>
        )}
      </Droppable>
    </Container>
  );
}

export default DroppableTrashCan;
