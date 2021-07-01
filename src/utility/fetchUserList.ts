/*global chrome*/

import { UserData } from "../types/APITypes";

const nextMidnight = new Date().setHours(24, 0, 0, 0);

interface FetchTypes extends UserData {
  anime: Array<UserData>,
  watched_episodes?: number,
  episodes: number,
  status: number
  image_url: string
}

const fetchWatching = (username:string):Promise<FetchTypes> =>
  fetch(`https://api.jikan.moe/v3/user/${username}/animelist/watching`).then(
    (response) => {
      if (response.ok) return response.json();
      else return Promise.reject({ status: response.status });
    }
  );

const getFullScheudleForList = async (username:string): Promise<Array<FetchTypes>> => {
  const today:Date = new Date();
  const days:Array<string> = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  let userListScheudle:Array<any> = [];

  const animeList = await fetchWatching(username);

  for (const day of days) {
    const capitalizeDay:string = day.charAt(0).toUpperCase() + day.slice(1);
    const scheudle:Array<FetchTypes> = await fetch(`https://api.jikan.moe/v3/schedule/${day}`)
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

export const fetchUserList = async (username:string):Promise<{status: number}> => {
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
