import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSetRecoilState } from "recoil";
import { boardModalState } from "../atoms";

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(178, 190, 195, 0.5);
  position: fixed;
  right: 0px;
  margin: 50px;
  box-shadow: 1px 5px 30px rgba(0, 0, 0, 0.5);
  transition: all 0.1s ease-in-out;
  > svg {
    color: white;
    font-size: 24px;
    font-weight: 600;
  }
  &:hover {
    cursor: pointer;
    background-color: rgba(178, 190, 195, 0.1);
    transform: scale(1.2);
  }
`;

function AddBoardButton() {
  const setModalState = useSetRecoilState(boardModalState);
  const onButtonClick = () => {
    setModalState((currVal) => !currVal);
  };
  return (
    <Button onClick={onButtonClick}>
      <FontAwesomeIcon icon={faPlus} />
    </Button>
  );
}

export default AddBoardButton;
