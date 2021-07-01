export interface UserData {
    mal_id?: string;
    imgUrl?: string;
    title?: string;
    airingDay?: string;
    type?: string;
    watched_episodes?: number;
    episodes?: number;
    username?: string;
    image_url?: string;
    airingDate: Date;
    progress?: number;
    progressMax?: number;
    animeList?: Array<UserData>
    airingDateString: string;
    prevState?: null
}

export interface Notification {
    id: number;
    imgSrc?: string;
    title: string;
    aired: string;
    image_url?: string;
    prevState?: null;
  }

export interface Notifications {
    notifications: Array<Notification>;
    prevState?: null
}