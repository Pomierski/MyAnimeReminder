import React from "react";
import Button from "../components/Button";
import Heading from "../components/Header/Heading";
import { IoClose } from "react-icons/io5";
import Header from "../components/Header/Header";
import HeaderButtons from "../components/Header/HeaderButtons";
import Drawer from "../components/Drawer";

interface PropTypes {
  logout(): void;
  showSettings: boolean;
  toggleSettings(): void;
  loggedInUser: string | null;
}

const Settings = ({ logout, showSettings, toggleSettings, loggedInUser }:PropTypes) => {
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "100%" },
  };

  return (
    <Drawer
      animate={showSettings ? "open" : "closed"}
      transition={{ duration: 0.5 }}
      variants={variants}
    >
      <Header>
        <Heading>Settings</Heading>
        <HeaderButtons>
          <Button icon onClick={toggleSettings} aria-label="close">
            <IoClose />
          </Button>
        </HeaderButtons>
      </Header>
      <p>Logged as {loggedInUser}</p>
      <Button primary onClick={logout}>
        Logout
      </Button>
    </Drawer>
  );
};

export default Settings;
