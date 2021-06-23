/* global chrome */

const fetchWatching = (username) =>
  fetch(`https://api.jikan.moe/v3/user/${username}/animelist/watching`).then(
    (response) => {
      if (response.ok) return response.json();
      else return Promise.reject({ status: response.status });
    }
  );

const getFullScheudleForList = async (username) => {
  const today = new Date();
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  let userListScheudle = [];

  const animeList = await fetchWatching(username);

  for (const day of days) {
    const capitalizeDay = day.charAt(0).toUpperCase() + day.slice(1);
    const scheudle = await fetch(`https://api.jikan.moe/v3/schedule/${day}`)
      .then((resp) => resp.json())
      .then((resp) => resp[day]);

    const episodeAiringDate = new Date();
    episodeAiringDate.setDate(
      episodeAiringDate.getDate() - today.getDay() + (days.indexOf(day) + 1)
    );
    userListScheudle = [
      ...userListScheudle,
      ...scheudle
        .filter(
          (scheudleItem) =>
            animeList.anime.filter((animeListItem) => {
              if (animeListItem.mal_id === scheudleItem.mal_id) {
                scheudleItem.watched_episodes = animeListItem.watched_episodes;
                return true;
              } else return false;
            }).length
        )
        .map((anime) => {
          return {
            mal_id: anime.mal_id,
            title: anime.title,
            image_url: anime.image_url,
            type: anime.type,
            airingDate: episodeAiringDate.getTime(),
            airingDay: capitalizeDay,
            episodes: anime.episodes,
            watched_episodes: anime.watched_episodes,
          };
        }),
    ];
  }

  return userListScheudle;
};

const chromeAPI = {
  userDataKey: "MARData",
  notificationsKey: "MARNotifications",
  getStorageData(key) {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get(key, (result) =>
        chrome.runtime.lastError
          ? reject(Error(chrome.runtime.lastError.message))
          : resolve(key in result ? result[key] : result)
      )
    );
  },
  setStorageData(value) {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.set(value, () =>
        chrome.runtime.lastError
          ? reject(Error(chrome.runtime.lastError.message))
          : resolve(resolve)
      )
    );
  },
};

const setExtensionBadgeText = (text) => {
  chrome.browserAction.setBadgeBackgroundColor({
    color: "#F00",
  });
  chrome.browserAction.setBadgeText({
    text: text,
  });
};

const setNextUpdateDate = async () => {
  const nextMidnight = new Date().setHours(24, 0, 0, 0);
  const data = await chromeAPI.getStorageData([chromeAPI.userDataKey]);
  chromeAPI.setStorageData({
    MARData: {
      username: data.username,
      animeList: data.animeList,
      listLastUpdateDate: nextMidnight,
    },
  });
};

const updateNotifications = async (newNotifications) => {
  const notificationsData = await chromeAPI.getStorageData(
    chromeAPI.notificationsKey
  );
  let notifications =
    "notifications" in notificationsData ? notificationsData.notifications : [];

  const mergedNotificationsArray = [...notifications, ...newNotifications];

  setExtensionBadgeText(mergedNotificationsArray.length.toString());

  chromeAPI.setStorageData({
    MARNotifications: {
      notifications: mergedNotificationsArray,
    },
  });
};

chrome.runtime.onStartup.addListener(async () => {
  const data = await chromeAPI.getStorageData(chromeAPI.userDataKey);
  if ("listLastUpdateDate" in data) {
    const currentDate = new Date();
    const lastMonday = new Date();
    lastMonday.setDate(lastMonday.getDate() - currentDate.getDay() + 1);
    let listLastUpdateDate = new Date(data.listLastUpdateDate);

    if (listLastUpdateDate < lastMonday) {
      await getFullScheudleForList(data.username);
    }

    while (listLastUpdateDate < currentDate) {
      const newNotifications = [];
      data.animeList.forEach((anime) => {
        const airingDate = new Date(anime.airingDate);
        if (airingDate.getDate() <= currentDate.getDate()) {
          anime.aired = airingDate.toISOString();
          anime.id = Math.random().toString(36).substr(2, 9);
          newNotifications.push(anime);
        }
      });

      if (newNotifications.length) {
        updateNotifications(newNotifications);
      }

      listLastUpdateDate.setDate(listLastUpdateDate.getDate + 1);
    }
    setNextUpdateDate();
  }
});
