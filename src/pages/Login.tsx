import { motion } from "framer-motion";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Button from "../components/Button";
import Header from "../components/Header/Header";
import Heading from "../components/Header/Heading";
import Input from "../components/Input";
import Loader from "../components/Loader";
import SubTitle from "../components/SubTitle";
import { fetchUserList } from "../utility/fetchUserList";

interface PropTypes {
  setUserLogged(boolean: boolean): void;
  getUserData(): void;
}

const StyledLoader = styled(Loader)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  opacity: inherit;
`;

const fadeIn = keyframes`
  from {
    opacity: 0%;
  }
  to {
    opacity: 100%;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin: 0;
  margin-bottom: 0.5rem;
`;

const Wrapper = styled.div`
  animation: ${fadeIn};
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
`;

const Login = ({ setUserLogged, getUserData }: PropTypes) => {
  const [inputValue, setInputValue] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleInput = (e: { target: HTMLInputElement }): void => {
    setInputValue(e.target.value);
    setShowError(false);
  };

  const handleButton = async (): Promise<void> => {
    setShowLoading(true);
    const userList = await fetchUserList(inputValue).catch((e) => e);
    if (userList.status !== 200) {
      setShowLoading(false);
      setShowError(true);
    }
    if (userList.status === 200) {
      getUserData();
      setUserLogged(true);
    }
  };
  return (
    <Wrapper>
      <Header>
        <Heading>Login</Heading>
      </Header>

      <motion.div animate={{ opacity: showLoading ? 1 : 0 }}>
        <StyledLoader />
      </motion.div>
      <motion.div animate={{ opacity: showLoading ? 0 : 1 }}>
        <SubTitle>
          Please enter your MyAnimeList username so we check what anime you are
          watching
        </SubTitle>
        <Input
          placeholder="Username"
          value={inputValue}
          onChange={handleInput}
        />
        {showError ? (
          <ErrorMessage>Username is invalid, please try again.</ErrorMessage>
        ) : null}
        <Button primary onClick={handleButton}>
          Login
        </Button>
      </motion.div>
    </Wrapper>
  );
};

export default Login;
