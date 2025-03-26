import { useNavigate } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import styled from "styled-components";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProtectedRoute = ({ children }: { children: any }) => {
  const navigate = useNavigate();
  // load authenticated user
  const { isLoading, isAuthenticated } = useUser();
  // if no auth user, redirect to /login

  // call navigate hook inside a fn, thats why we used useEffect.
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/login");
    },
    [isAuthenticated, isLoading, navigate]
  );

  // while loading, show spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />{" "}
      </FullPage>
    );

  // if authenticated, render app
  if (isAuthenticated) return children;
};
