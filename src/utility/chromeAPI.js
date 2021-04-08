/* global chrome */

export const clearStorage = () => {
  chrome.storage.sync.remove(["MARData"]);
};

export const clearNotifications = () => {
  chrome.storage.sync.remove(["MARNotifications"]);
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
  const data = await getStorageData(["MARNotifications"]);
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
