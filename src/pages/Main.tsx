import React from "react";
import Heading from "../components/Header/Heading";
import AnimeCard from "../components/AnimeCard";
import { BiCog, BiBell } from "react-icons/bi";
import { IoMdRefresh } from "react-icons/io";
import Button from "../components/Button";
import Header from "../components/Header/Header";
import HeaderButtons from "../components/Header/HeaderButtons";
import Badge from "../components/NotificationBadge";
import { formatDateToDateString } from "../utility/formatDateToDateString";
import { UserData } from "../types/APITypes";


interface PropTypes {
  toggleSettings(): void;
  toggleNotifications(): void;
  badgeText: number | null;
  refreshData(): void;
  animeList: Array<UserData> | null
}

const Main = ({
  toggleSettings,
  toggleNotifications,
  badgeText,
  animeList,
  refreshData,
}:PropTypes) => {
  return (
    <>
      <Header>
        <Heading>Watching</Heading>
        <HeaderButtons>
          <Button icon onClick={refreshData} aria-label="refresh">
            <IoMdRefresh />
          </Button>
          <Button icon onClick={toggleNotifications} aria-label="notifications">
            <Badge>{badgeText}</Badge>
            <BiBell />
          </Button>
          <Button icon onClick={toggleSettings} aria-label="settings">
            <BiCog />
          </Button>
        </HeaderButtons>
      </Header>
      {animeList && animeList.length ? (
        animeList.map(
          ({
            mal_id,
            title,
            image_url,
            watched_episodes,
            episodes,
            airingDay,
            airingDate,
            type,
          }) => {
            return (
              <AnimeCard
                mal_id={mal_id}
                key={mal_id}
                title={title}
                imgUrl={image_url}
                progress={watched_episodes}
                progressMax={episodes}
                airingDay={airingDay}
                airingDate={airingDate}
                type={type}
                airingDateString={formatDateToDateString(airingDate)}
              />
            );
          }
        )
      ) : (
        <p>No airing animes found on list</p>
      )}
    </>
  );
};

export default Main;
