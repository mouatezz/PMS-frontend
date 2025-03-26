import styled, { css } from "styled-components";

const Heading: any = styled.h1`
  ${(props: any) =>
    props.type === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}
  ${(props: any) =>
    props.type === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}
    ${(props: any) =>
    props.type === "h3" &&
    css`
      font-size: 2rem;
      font-weight: 400;
    `}
    ${(props: any) =>
    props.type === "h4" &&
    css`
      font-size: 2.5rem;
      font-weight: 600;
      text-align: center;
    `}

    @media only screen and (max-width: 500px) {
    font-size: 1.75rem;
  }
`;

export default Heading;

// import styled, { css } from "styled-components";

// // const test = css`
// //   text-align: center;
// //   ${10 > 5 && "background-color: yellow"}
// // `;

// const Heading = styled.h1`
//   ${(props) =>
//     props.as === "h1" &&
//     css`
//       font-size: 3rem;
//       font-weight: 600;
//     `}

//   ${(props) =>
//     props.as === "h2" &&
//     css`
//       font-size: 2rem;
//       font-weight: 600;
//     `}

//     ${(props) =>
//     props.as === "h3" &&
//     css`
//       font-size: 2rem;
//       font-weight: 500;
//     `}

//   line-height: 1.4;
// `;

// export default Heading;
