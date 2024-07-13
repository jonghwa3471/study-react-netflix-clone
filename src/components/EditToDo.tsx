import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { cardState, editModalState, toDoState, TRELLO_TODO } from "../atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useForm } from "react-hook-form";

const Wrapper = styled.div`
  width: 320px;
  height: 220px;
  padding: 40px;
  background-color: #f5f5f5;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  border-radius: 5px;
  box-shadow: 1px 5px 30px rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const EditToDoTitle = styled.h2`
  text-align: center;
  font-size: 24px;
`;

const EditToDoForm = styled.form`
  width: 100%;
  input {
    width: 100%;
    border-radius: 5px;
    margin-bottom: 20px;
    padding: 20px 10px;
    border: none;
  }
`;

const DeleteButton = styled.div`
  width: 25px;
  height: 25px;
  background-color: #d3d3d3;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 20px;
  right: 20px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  > svg {
    color: white;
  }
`;

interface IForm {
  editToDo: string;
}

function EditToDo() {
  const setEditState = useSetRecoilState(editModalState);
  const [card, setCard] = useRecoilState(cardState);
  const setAllToDos = useSetRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onButtonClick = () => {
    setEditState((currVal) => !currVal);
  };
  const onValid = ({ editToDo }: IForm) => {
    setAllToDos((oldToDos) => {
      const cardKey = Object.keys(card)[0];
      const cardValue = Object.values(card)[0];
      const editedToDo = {
        id: cardValue,
        text: editToDo,
      };
      const toDoArray = oldToDos[cardKey];
      const copyToDoArray = [...toDoArray];
      const toDoIndex = toDoArray.findIndex((toDo) => toDo.id === cardValue);
      copyToDoArray.splice(toDoIndex, 1, editedToDo);
      const newToDos = {
        ...oldToDos,
        [cardKey]: copyToDoArray,
      };
      localStorage.setItem(TRELLO_TODO, JSON.stringify(newToDos));

      return newToDos;
    });
    setCard({});
    setValue("editToDo", "");
    setEditState((currVal) => !currVal);
  };
  return (
    <Wrapper>
      <EditToDoTitle>할 일 수정</EditToDoTitle>
      <DeleteButton onClick={onButtonClick}>
        <FontAwesomeIcon icon={faXmark} />
      </DeleteButton>
      <EditToDoForm onSubmit={handleSubmit(onValid)}>
        <input
          {...register("editToDo", { required: true })}
          placeholder="할 일을 수정하세요."
          autoFocus
        />
      </EditToDoForm>
    </Wrapper>
  );
}

export default EditToDo;
