import { useLayoutEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import { theme } from "./styles/theme";
import * as APIData from "./types/APIData";
import * as chromeAPI from "./utility/chromeAPI";
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
  const [userData, setUserData] = useState<APIData.APIData | null>(null);
  const [userLogged, setUserLogged] = useState(false);
  const [userNotifications, setUserNotifications] =
    useState<APIData.Notifications | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getUserData = async (): Promise<void> => {
    const [savedData, savedNotifications] = await Promise.all([
      chromeAPI.getStorageData(chromeAPI.userDataKey),
      chromeAPI.getStorageData(chromeAPI.notificationsKey),
    ]);
    if (Object.keys(savedData).length) {
      setUserData(savedData);
      setUserLogged(true);
    }
    if (Object.keys(savedNotifications).length)
      setUserNotifications(savedNotifications);
  };

  useLayoutEffect(() => {
    getUserData();
  }, []);

  const refreshData = async (): Promise<void> => {
    if (userData?.username) {
      setUserData(null);
      await fetchUserList(userData.username);
      getUserData();
    }
  };

  const clearBadgeText = (): void => {
    chromeAPI.clearNotifications();
    setUserNotifications(null);
  };

  const toggleSettings = (): void => {
    setShowSettings(!showSettings);
  };

  const toggleNotifications = (): void => {
    setShowNotifications(!showNotifications);
  };

  const deleteNotification = async (id: number): Promise<void> => {
    setUserNotifications(await chromeAPI.deleteNotification(id));
  };

  const logout = () => {
    chromeAPI.clearStorage();
    setUserLogged(false);
    setShowSettings(false);
    chromeAPI.clearNotifications();
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
                loggedInUser={userData?.username || null}
              />
              <Main
                toggleSettings={toggleSettings}
                toggleNotifications={toggleNotifications}
                badgeText={userNotifications?.notifications?.length || null}
                animeList={userData?.animeList || null}
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
