import { useLayoutEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import * as chromeAPI from "./utility/chromeAPI";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import { fetchUserList } from "./utility/fetchUserList";

const Container = styled.div`
  width: 400px;
  height: 600px;
  background-color: ${(props) => props.theme.bgColor};
  margin: 0 auto;
  padding: 0.5rem 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  color: ${(props) => props.theme.mainColor};
`;

function App() {
  const [userData, setUserData] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const [userNotifications, setUserNotifications] = useState(null);
  const [userScheudle, setUserScheudle] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getUserData = async () => {
    const [savedData, savedNotifications, savedScheudle] = await Promise.all([
      chromeAPI.getStorageData([chromeAPI.userDataKey]),
      chromeAPI.getStorageData([chromeAPI.notificationsKey]),
      chromeAPI.getStorageData([chromeAPI.scheudleKey]),
    ]);
    if (Object.keys(savedData).length) {
      setUserData(savedData);
      setUserLogged(true);
    }
    if (Object.keys(savedNotifications).length)
      setUserNotifications(savedNotifications);
    if (Object.keys(savedScheudle).length) {
      setUserScheudle(savedScheudle);
    }
  };

  useLayoutEffect(() => {
    getUserData();
  }, []);

  const refreshData = async () => {
    setUserData(null);
    await fetchUserList(userData.username);
    getUserData();
  };

  const clearBadgeText = () => {
    chromeAPI.clearNotifications();
    setUserNotifications(null);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const deleteNotification = async (id) => {
    setUserNotifications(await chromeAPI.deleteNotification(id));
  };

  const logout = () => {
    chromeAPI.clearStorage();
    setUserLogged(false);
    setShowSettings(false);
    chromeAPI.clearNotifications();
    chromeAPI.clearScheudle();
  };
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container>
          {!userLogged ? (
            <Login setUserLogged={setUserLogged} getUserData={getUserData} />
          ) : (
            <>
              <Notifications
                toggleNotifications={toggleNotifications}
                showNotifications={showNotifications}
                clearBadgeText={clearBadgeText}
                userNotifications={userNotifications}
                deleteNotification={deleteNotification}
              />
              <Settings
                showSettings={showSettings}
                logout={logout}
                toggleSettings={toggleSettings}
                loggedInUser={userData ? userData.username : null}
              />
              <Main
                toggleSettings={toggleSettings}
                toggleNotifications={toggleNotifications}
                badgeText={
                  userNotifications
                    ? userNotifications.notifications.length
                    : null
                }
                animeList={userData ? userData.animeList : null}
                scheudle={userScheudle}
                refreshData={refreshData}
              />
            </>
          )}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
