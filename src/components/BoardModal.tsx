import styled from "styled-components";

const Wrapper = styled.div`
  width: 320px;
  height: 200px;
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
    margin-bottom: 5px;
    padding: 20px 10px;
    border: none;
  }
`;

function BoardModal() {
  return (
    <Wrapper>
      <AddBoardTitle>보드 추가</AddBoardTitle>
      <AddBoardForm>
        <input type="text" placeholder="보드를 추가하세요." />
      </AddBoardForm>
    </Wrapper>
  );
}

export default BoardModal;
