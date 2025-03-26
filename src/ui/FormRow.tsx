import { FieldError } from "react-hook-form";
import styled, { css } from "styled-components";

const StyledFormRow: any = styled.div`
  display: grid;
  align-items: center;

  @media only screen and (max-width: 500px) {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    justify-content: space-between;
  }

  grid-template-columns: ${(props: any) =>
    props.orientation === "vertical" ? "1fr" : "24rem 1fr 1.2fr"};
  gap: ${(props: any) =>
    props.orientation === "vertical" ? "0.8rem" : "2.4rem"};

  padding: 1.2rem 0;

  @media only screen and (max-width: 500px) {
    &:has(button) {
      padding-top: 1rem;
      justify-content: center;
    }
  }

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: ${(props: any) =>
      props.orientation === "vertical"
        ? "none"
        : "1px solid var(--color-grey-100)"};
  }

  /* Special treatment if the row contains buttons, and if it's NOT a vertical row */
  ${(props: any) =>
    props.orientation !== "vertical" &&
    css`
      &:has(button) {
        display: flex;
        justify-content: flex-end;
        gap: 1.2rem;

        @media only screen and (max-width: 1024px) {
          justify-content: flex-start;
        }
      }
      /* @media only screen and (max-width: 500px) {
        justify-content: stretch;
      } */
    `}
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

interface IFormRow {
  label?: string;
  error?: any;
  children: any;
  orientation?: string;
}

function FormRow({ label, error, children, orientation }: IFormRow) {
  return (
    <StyledFormRow orientation={orientation}>
      {label && <Label htmlFor={children.props.id}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRow;
