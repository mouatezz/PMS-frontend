import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  @media only screen and (max-width: 500px) {
    width: 100%;
    font-size: 1.2rem;
  }

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;

    @media only screen and (max-width: 500px) {
      margin-bottom: 0.7rem;
    }
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;

    @media only screen and (max-width: 500px) {
      justify-content: center;
    }
  }
`;

function ConfirmDelete({ resource, onConfirm, disabled, onCloseModal }: any) {
  function handleConfirmClick() {
    onConfirm();
  }

  return (
    <StyledConfirmDelete>
      <Heading type="h3">Delete {resource}</Heading>
      <p>
        Are you sure you want to delete this {resource} permanently? This action
        cannot be undone.
      </p>

      <div>
        <Button variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button
          variation="danger"
          onClick={handleConfirmClick}
          disabled={disabled}
        >
          Delete
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
