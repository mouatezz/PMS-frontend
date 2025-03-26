import styled, { css } from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";

const StyledSidebar: any = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);

  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  @media only screen and (max-width: 1024px) {
    padding: 2rem 1.2rem;
    border-right: none;
    ${(props: any) =>
      props.hamburger === false &&
      css`
        border-right: 1px solid var(--color-grey-100);
      `}
  }
`;

function Sidebar({
  openHamburger,
  setOpenHamburger,
}: {
  openHamburger: boolean;
  setOpenHamburger: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <StyledSidebar hamburger={openHamburger}>
      <Logo />
      <MainNav />

      {/* <Uploader /> */}
    </StyledSidebar>
  );
}

export default Sidebar;
