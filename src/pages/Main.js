import React from "react";
import Heading from "../components/Header/Heading";
import AnimeCard from "../components/AnimeCard";
import { getEndDateForAnime } from "../utility/parseDate";
import { BiCog, BiBell } from "react-icons/bi";
import { IoMdRefresh } from "react-icons/io";
import Button from "../components/Button";
import Header from "../components/Header/Header";
import HeaderButtons from "../components/Header/HeaderButtons";
import Badge from "../components/NotificationBadge";

const Main = ({
  toggleSettings,
  toggleNotifications,
  badgeText,
  animeList,
  refreshData,
}) => {
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
            url,
            mal_id,
            title,
            image_url,
            airing_start,
            watched_episodes,
            episodes,
            type,
          }) => {
            const {
              startDateLocalized,
              endDateLocalized,
              airingDay,
            } = getEndDateForAnime(airing_start, episodes);

            return (
              <AnimeCard
                animeUrl={url}
                key={mal_id}
                title={title}
                imgUrl={image_url}
                aired={startDateLocalized}
                endDate={endDateLocalized}
                progress={watched_episodes}
                progressMax={episodes}
                airingDay={airingDay}
                type={type}
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
