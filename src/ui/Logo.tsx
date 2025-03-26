import styled from "styled-components";
import { useDarkMode } from "../context/DarkModeContext";

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;

  @media only screen and (max-width: 1024px) {
    height: 7.5rem;
    width: auto;
  }
  @media only screen and (max-width: 500px) {
    height: 5rem;
  }
`;

function Logo() {
  const { isDarkMode } = useDarkMode();

  const logo = isDarkMode ? "/logo-dark.png" : "/logo-light.png";
  return (
    <StyledLogo>
      <Img src={logo} alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
