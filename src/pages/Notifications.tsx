import React from "react";
import { IoClose } from "react-icons/io5";
import Button from "../components/Button";
import Drawer from "../components/Drawer";
import Header from "../components/Header/Header";
import HeaderButtons from "../components/Header/HeaderButtons";
import Heading from "../components/Header/Heading";
import Notification from "../components/Notification";
import * as APIData from "../types/APIData";

interface PropTypes {
  showNotifications: boolean;
  toggleNotifications(): void;
  clearBadgeText(): void;
  userNotifications: APIData.Notifications | null;
  deleteNotification(id: number): Promise<void>;
}

const Notifications = ({
  showNotifications,
  toggleNotifications,
  clearBadgeText,
  userNotifications,
  deleteNotification,
}: PropTypes) => {
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  return (
    <Drawer
      animate={showNotifications ? "open" : "closed"}
      transition={{ duration: 0.5 }}
      variants={variants}
    >
      <Header>
        <Heading>Notifications</Heading>
        <HeaderButtons>
          <Button icon onClick={toggleNotifications} aria-label="close">
            <IoClose />
          </Button>
        </HeaderButtons>
      </Header>
      {userNotifications && userNotifications?.notifications?.length ? (
        <>
          {userNotifications?.notifications?.map(
            ({ image_url, title, aired, id }) => (
              <Notification
                imgSrc={image_url}
                title={title}
                aired={aired}
                id={id}
                deleteNotification={deleteNotification}
              />
            )
          )}
          <Button primary onClick={clearBadgeText} margin="0 0 1rem 0">
            Delete all
          </Button>
        </>
      ) : null}
    </Drawer>
  );
};

export default Notifications;
