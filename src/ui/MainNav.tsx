import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineHomeModern,
  HiOutlineUsers,
} from "react-icons/hi2";
import { IconContext } from "react-icons";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  /* This works because react-router places the active class on the active NavLink */
  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

const StyledSpanText = styled.span`
  @media only screen and (max-width: 1024px) {
    display: none;
    /* font-size: 1.2rem; */
  }
`;

const Icon = styled.div`
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 1024px) {
    margin: 0 auto;
  }

  & svg {
    /* background-color: var(--color-grey-600); */

    @media only screen and (max-width: 1024px) {
      width: 5rem;
      height: 5rem;
      color: var(--color-${(props) => props.color}-700);
    }
    @media only screen and (max-width: 500px) {
      width: 3rem;
      height: 3rem;
      color: var(--color-${(props) => props.color}-700);
    }
  }
`;

function MainNav() {
  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard">
            <Icon>
              <HiOutlineHome />
            </Icon>
            <StyledSpanText>Home</StyledSpanText>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/bookings">
            <Icon>
              <HiOutlineCalendarDays />
            </Icon>
            <StyledSpanText>Bookings</StyledSpanText>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/cabins">
            <Icon>
              <HiOutlineHomeModern />
            </Icon>
            <StyledSpanText>Cabins</StyledSpanText>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/users">
            <Icon>
              <HiOutlineUsers />
            </Icon>
            <StyledSpanText>Users</StyledSpanText>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/settings">
            <Icon>
              <HiOutlineCog6Tooth />
            </Icon>
            <StyledSpanText>Settings</StyledSpanText>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;
