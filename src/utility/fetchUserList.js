/*global chrome*/

const nextMidnight = new Date().setHours(24, 0, 0, 0);

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

const fetchWatching = (username) =>
  fetch(`https://api.jikan.moe/v3/user/${username}/animelist/watching`).then(
    (response) => {
      if (response.ok) return response.json();
      else return Promise.reject({ status: response.status });
    }
  );

export const fetchUserList = async (username) => {
  const animeList = await getFullScheudleForList(username);

  if (animeList) {
    chrome.storage.sync.set({
      MARData: {
        username: username,
        animeList: animeList,
        listLastUpdateDate: nextMidnight,
      },
    });

    return { status: 200 };
  } else return Promise.reject({ status: 400 });
};
