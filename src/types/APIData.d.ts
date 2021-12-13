export interface APIData {
  mal_id?: string;
  imgUrl?: string;
  title?: string;
  airingDay?: string;
  type?: string;
  watched_episodes?: number;
  episodes?: number;
  username?: string;
  image_url?: string;
  airingDate?: string | number;
  progress?: number;
  progressMax?: number;
  animeList?: APIData[];
  airingDateString?: string;
  prevState?: null;
}

export interface Notification {
  id: number;
  imgSrc?: string;
  title: string;
  aired: string;
  image_url?: string;
  prevState?: null;
  airing_start?: string;
}

export interface Notifications {
  notifications?: Notification[];
  prevState?: null;
}

export interface UserList {
  anime: APIData[];
}

export interface Status {
  status: number;
}
