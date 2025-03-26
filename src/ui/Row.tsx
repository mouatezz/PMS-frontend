import styled, { css } from "styled-components";

const Row: any = styled.div`
  display: flex;

  ${(props: any) =>
    props.type === "horizontal" &&
    css`
      justify-content: space-between;
      align-items: center;
    `}

  ${(props: any) =>
    props.type === "vertical" &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}

    @media only screen and (max-width: 1024px) {
    flex-wrap: wrap;
  }
`;

Row.defaultProps = {
  type: "vertical",
};

export default Row;
