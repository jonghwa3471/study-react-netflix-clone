import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser } from "@fortawesome/free-solid-svg-icons";

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(210, 25, 25, 0.5);
  box-shadow: 1px 5px 20px rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 10%;
  right: 0px;
  margin: 50px;
  transition: all 0.2s ease-in-out;
  > svg {
    color: white;
    font-size: 24px;
    font-weight: 600;
  }
  &:hover {
    cursor: pointer;
    background-color: rgba(211, 22, 22, 0.959);
    transform: scale(1.2);
  }
`;

function ClearButton() {
  const onButtonClick = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <Button onClick={onButtonClick}>
      <FontAwesomeIcon icon={faEraser} />
    </Button>
  );
}

export default ClearButton;
