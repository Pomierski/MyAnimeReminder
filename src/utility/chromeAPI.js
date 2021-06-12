/* global chrome */

export const userDataKey = "MARData";
export const notificationsKey = "MARNotifications";
export const scheudleKey = "MARScheudle";

export const clearStorage = () => {
  chrome.storage.sync.remove([userDataKey]);
};

export const clearScheudle = () => {
  chrome.storage.sync.remove([scheudleKey]);
};

export const clearNotifications = () => {
  chrome.storage.sync.remove([notificationsKey]);
  chrome.browserAction.setBadgeText({
    text: "",
  });
};

export const getStorageData = (key) =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, (result) =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(key in result ? result[key] : result)
    )
  );

export const deleteNotification = async (id) => {
  const data = await getStorageData([notificationsKey]);
  data.notifications = data.notifications.filter((el) => el.id !== id);

  chrome.storage.sync.set({
    MARNotifications: {
      notifications: data.notifications,
    },
  });

  chrome.browserAction.setBadgeText({
    text: data.notifications.length ? data.notifications.length.toString() : "",
  });

  return data;
};
