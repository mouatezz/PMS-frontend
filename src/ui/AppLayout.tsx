import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled, { css } from "styled-components";
import { useState } from "react";

const Main = styled.main`
  background-color: var(--color-grey-100);
  padding: 4rem 4.8rem 6.4rem;
  overflow: scroll;

  @media only screen and (max-width: 768px) {
    padding: 4rem 1.7rem 4rem;
  }
`;

const StyledAppLayout: any = styled.div`
  display: grid;
  grid-template-columns: 25rem 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;

  @media only screen and (max-width: 1024px) {
    grid-template-columns: 15rem 1fr;

    ${(props: any) =>
      props.hamburger === true &&
      css`
        grid-template-columns: 0rem 1fr;
        /* justify-content: space-between;
      align-items: center; */
      `}
  }
  @media only screen and (max-width: 500px) {
    grid-template-columns: 10.5rem 1fr;

    ${(props: any) =>
      props.hamburger === true &&
      css`
        grid-template-columns: 0rem 1fr;
        /* justify-content: space-between;
      align-items: center; */
      `}
  }
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const AppLayout = () => {
  const [openHamburger, setOpenHamburger] = useState(true);

  return (
    <StyledAppLayout hamburger={openHamburger}>
      <Header
        openHamburger={openHamburger}
        setOpenHamburger={setOpenHamburger}
      />
      <Sidebar
        openHamburger={openHamburger}
        setOpenHamburger={setOpenHamburger}
      />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
};

// const Main = styled.main`
//   background-color: var(--color-grey-50);
//   padding: 4rem 4.8rem 6.4rem;
// `;

// function AppLayout() {
//   return (
//     <StyledAppLayout>
//       <Header />
//       <Sidebar />
//       <Main>
//         <Outlet />
//       </Main>
//     </StyledAppLayout>
//   );
// }

export default AppLayout;
