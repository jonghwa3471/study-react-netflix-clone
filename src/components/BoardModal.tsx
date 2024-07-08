import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import {
  boardModalState,
  boardOrderState,
  toDoState,
  TRELLO_ORDER,
  TRELLO_TODO,
} from "../atoms";
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

const AddBoardTitle = styled.h2`
  text-align: center;
  font-size: 24px;
`;

const AddBoardForm = styled.form`
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
  boardId: string;
}

function BoardModal() {
  const setBoardOrder = useSetRecoilState(boardOrderState);
  const setModalState = useSetRecoilState(boardModalState);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IForm>();
  const onButtonClick = () => {
    setModalState((currVal) => !currVal);
  };
  const onValid = ({ boardId }: IForm) => {
    if (toDos[boardId]) {
      return setError("boardId", {
        message: "이미 존재하는 보드입니다.",
      });
    }
    const stringBoardId = String(boardId);
    setToDos((oldToDos) => {
      const newTodos = { ...oldToDos, [stringBoardId]: [] };
      localStorage.setItem(TRELLO_TODO, JSON.stringify(newTodos));
      return newTodos;
    });
    setBoardOrder((oldOrder) => {
      const orderResult = [...oldOrder, stringBoardId];
      localStorage.setItem(TRELLO_ORDER, JSON.stringify(orderResult));
      return orderResult;
    });
    setModalState((currVal) => !currVal);
  };

  return (
    <Wrapper>
      <AddBoardTitle>보드 추가</AddBoardTitle>
      <DeleteButton onClick={onButtonClick}>
        <FontAwesomeIcon icon={faXmark} />
      </DeleteButton>
      <AddBoardForm onSubmit={handleSubmit(onValid)}>
        <input
          {...register("boardId", { required: true })}
          placeholder="보드를 추가하세요."
          autoFocus
        />
        <span>{errors.boardId?.message}</span>
      </AddBoardForm>
    </Wrapper>
  );
}

export default BoardModal;
