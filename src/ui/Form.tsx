import styled, { css } from "styled-components";

const Form: any = styled.form`
  ${(props: any) =>
    props.type === "regular" &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);
    `}

  ${(props: any) =>
    props.type === "modal" &&
    css`
      width: 80rem;
    `}

    @media only screen and (max-width: 500px) {
    ${(props: any) =>
      props.type === "modal" &&
      css`
        width: 27rem;
      `}
    ${(props: any) =>
      props.type !== "modal" &&
      css`
        padding: 2.4rem 2rem;
        width: 100%;
      `}
  }

  overflow: hidden;
  font-size: 1.4rem;
`;

Form.defaultProps = { type: "regular" };

export default Form;
