import styled, { css } from "styled-components";
import { Logout } from "../features/authentication/Logout";
import { HeaderMenu } from "./HeaderMenu";
import { UserAvatar } from "../features/authentication/UserAvatar";
import { IoMenu, IoClose } from "react-icons/io5";
import { useDarkMode } from "../context/DarkModeContext";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  align-items: center;
  gap: 2.4rem;
  justify-content: flex-end;

  @media only screen and (max-width: 500px) {
    padding: 1.2rem 2rem;
  }
`;
const Icon: any = styled.div`
  /* background-color: var(--color-grey-0); */
  margin: 0 1.4rem;
  visibility: hidden;

  @media only screen and (max-width: 1024px) {
    visibility: visible;
    display: block;
  }
  & svg {
    ${(props: any) =>
      props.darkMode === true &&
      css`
        @media only screen and (max-width: 1024px) {
          color: #e099e0;
        }
      `}

    ${(props: any) =>
      props.darkMode === false &&
      css`
        @media only screen and (max-width: 1024px) {
          color: #691069;
        }
      `}


    @media only screen and (max-width: 1024px) {
      width: 3.35rem;
      height: 3.35rem;
    }
  }
`;
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-grey-0);
`;

function Header({
  openHamburger,
  setOpenHamburger,
}: {
  openHamburger: boolean;
  setOpenHamburger: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // return <StyledHeader>HEADER</StyledHeader>;
  const { isDarkMode } = useDarkMode();

  return (
    <Flex>
      <Icon darkMode={isDarkMode}>
        {openHamburger ? (
          <IoMenu onClick={() => setOpenHamburger(false)} />
        ) : (
          <IoClose onClick={() => setOpenHamburger(true)} />
        )}
      </Icon>
      <StyledHeader>
        <UserAvatar />
        <HeaderMenu />
      </StyledHeader>
    </Flex>
  );
}

export default Header;
