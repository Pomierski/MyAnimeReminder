/*global chrome*/

const nextMidnight = new Date().setHours(24, 0, 0, 0);

const fetchScheudle = () =>
  fetch(`https://api.jikan.moe/v3/schedule`)
    .then((response) => response.json())
    .then((response) => {
      let allDaysScheudle = [];
      const daysArray = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      daysArray.forEach((el) => {
        allDaysScheudle = [...allDaysScheudle, ...response[el]];
      });
      return allDaysScheudle;
    });

const fetchWatching = (username) =>
  fetch(`https://api.jikan.moe/v3/user/${username}/animelist/watching`).then(
    (response) => {
      if (response.ok) return response.json();
      else return Promise.reject({ status: response.status });
    }
  );

export const fetchUserList = async (username) => {
  const [animeList, scheudle] = await Promise.all([
    fetchWatching(username),
    fetchScheudle(),
  ]);
  if (animeList && scheudle) {
    const optimizedData = [];
    const animeListWithCorrectData = scheudle.filter(
      (scheudleItem) =>
        animeList.anime.filter((animeListItem) => {
          if (animeListItem.mal_id === scheudleItem.mal_id) {
            scheudleItem.watched_episodes = animeListItem.watched_episodes;
            return true;
          }
          return false;
        }).length
    );

    animeListWithCorrectData.forEach((el) => {
      optimizedData.push({
        mal_id: el.mal_id,
        title: el.title,
        url: el.url,
        image_url: el.image_url,
        airing_start: el.airing_start,
        episodes: el.episodes,
        watched_episodes: el.watched_episodes,
        type: el.type,
      });
    });

    chrome.storage.sync.set({
      MARData: {
        username: username,
        animeList: optimizedData,
        listLastUpdateDate: nextMidnight,
      },
    });

    return { status: 200 };
  } else return Promise.reject({ status: 400 });
};
