/* global chrome */

const getDayStringFromDate = (date) =>
  date.toLocaleString("en-us", { weekday: "long" }).toLowerCase();

const fetchScheulde = (day) =>
  fetch(`https://api.jikan.moe/v3/schedule/${day}`).then((response) =>
    response.json().then((response) => {
      const optimizedData = response[day].map(
        ({ mal_id, title, airing_start, image_url }) => ({
          mal_id,
          title,
          airing_start,
          image_url,
        })
      );
      return optimizedData;
    })
  );

const fetchAnimeList = (username) =>
  fetch(
    `https://api.jikan.moe/v3/user/${username}/animelist/watching`
  ).then((response) => response.json());

const setExtensionBadgeText = (text) => {
  chrome.browserAction.setBadgeBackgroundColor({
    color: "#F00",
  });
  chrome.browserAction.setBadgeText({
    text: text,
  });
};

const getStorageData = (key) =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, (result) =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(key in result ? result[key] : result)
    )
  );

const setNextUpdateDate = () => {
  const nextMidnight = new Date().setHours(24, 0, 0, 0);
  chrome.storage.sync.get(["MARData"], (result) => {
    chrome.storage.sync.set({
      MARData: {
        username: result["MARData"].username,
        animeList: result["MARData"].animeList,
        listLastUpdateDate: nextMidnight,
      },
    });
  });
};

const updateNotifications = (notifications) => {
  chrome.storage.sync.set({
    MARNotifications: {
      notifications: notifications,
    },
  });
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const currentDate = new Date();
const dateWeekAgo = new Date();
dateWeekAgo.setDate(dateWeekAgo.getDate() - 7);

chrome.runtime.onStartup.addListener(async () => {
  const data = await getStorageData("MARData");
  if ("listLastUpdateDate" in data) {
    let listLastUpdateDate = new Date(data.listLastUpdateDate);
    const newNotifications = [];

    if (listLastUpdateDate < dateWeekAgo) listLastUpdateDate = dateWeekAgo;

    while (listLastUpdateDate < currentDate) {
      const [scheudle, animeList] = await Promise.all([
        fetchScheulde(getDayStringFromDate(listLastUpdateDate)),
        fetchAnimeList(data.username),
      ]);
      const animesAiringToday = scheudle.filter(
        (scheudleItem) =>
          animeList.anime.filter(
            (animeListItem) => animeListItem.mal_id === scheudleItem.mal_id
          ).length
      );

      animesAiringToday.forEach((item) => {
        item.aired = listLastUpdateDate.toISOString();
        item.id = Math.random().toString(36).substr(2, 9);
      });

      newNotifications.push(...animesAiringToday);
      listLastUpdateDate.setDate(listLastUpdateDate.getDate() + 1);
      //JikanAPI Rate Limiting
      await timer(500);
    }

    if (newNotifications.length) {
      const notificationsData = await getStorageData("MARNotifications");
      let prevNotifications = [];

      if ("notifications" in notificationsData)
        prevNotifications = notificationsData.notifications;

      const mergedNotificationsArray = [
        ...newNotifications,
        ...prevNotifications,
      ];

      setExtensionBadgeText(mergedNotificationsArray.length.toString());
      setNextUpdateDate();
      updateNotifications(mergedNotificationsArray);
    }
  }
});
