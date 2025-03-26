// import { create } from "domain";
import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import UseOutsideClick from "../hooks/useControlModalHook";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList: any = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props: any) => props.position.x}px;
  top: ${(props: any) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenuContext = createContext({});

function Menus({ children }: any) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState(null);
  // const setMenu = (id) => setOpenId(id);
  const open = setOpenId;
  const close = () => setOpenId("");

  return (
    <MenuContext.Provider
      value={{ openId, open, close, position, setPosition }}
    >
      {children}
    </MenuContext.Provider>
  );
}

function Toggle({ id, children }: { id: string; children?: JSX.Element }) {
  const { openId, open, close, setPosition }: any = useContext(MenuContext);

  const handleClick = (e: any) => {
    e.stopPropagation();
    console.log("click");
    openId === "" || openId !== id ? open(id) : close();
    const rect = e.target.closest("button").getBoundingClientRect(); //get the x and y position of the button
    console.log(rect);
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
  };

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }: any) {
  const { openId, position, close }: any = useContext(MenuContext);
  // const ref = useRef();
  const ref = UseOutsideClick(close, false);

  // useEffect(
  //   function () {
  //     const handleClick = (e) => {
  //       if (ref.current && !ref.current.contains(e.target)) {
  //         close();
  //       }
  //     };
  //     document.addEventListener("click", handleClick, true);

  //     return () => document.removeEventListener("click", handleClick, true);
  //   },
  //   [close]
  // );

  if (id !== openId) return null;

  return createPortal(
    <StyledList ref={ref} position={position}>
      {children}
    </StyledList>,
    document.body
  );
}

function Button({ children, icon, onClick }: any) {
  const { close }: any = useContext(MenuContext);
  const handleClick = () => {
    onClick?.();
    close();
  };
  return (
    <StyledButton onClick={handleClick}>
      {children} {icon}
    </StyledButton>
  );
}

Menus.Toggle = Toggle;
Menus.List = List;
Menus.Menu = Menu;
Menus.Button = Button;

export default Menus;
