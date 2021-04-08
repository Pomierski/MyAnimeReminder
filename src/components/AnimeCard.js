import React from "react";
import styled, { keyframes } from "styled-components";
import ProgressBar from "./ProgressBar";

const fadeIn = keyframes`
  from {
    opacity: 0%;
    transform: translateY(-10px);
  }
  to {
    opacity: 100%;
    transform: translateY(0px);
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 8rem;
  display: grid;
  grid-template-columns: 80px 1fr;
  grid-template-rows: fit-content(38px) min-content max-content;
  grid-column-gap: 1rem;
  grid-row-gap: 0.5rem;
  margin-bottom: 1rem;
  opacity: 0;
  animation: ${fadeIn};
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
`;

const CardImg = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;

  & > img {
    width: 100%;
    height: 100%;
  }
`;

const CardHeader = styled.h3`
  color: ${(props) => props.theme.accentColor};
  grid-row: 1;
  grid-column: 2;
  margin: 0;
  padding: 0;
  line-height: 100%;
  vertical-align: top;
  overflow: hidden;
  max-height: 37px;
  text-overflow: ellipsis;
`;

const ProgressBarWrapper = styled.div`
  grid-row: 3;
  grid-column: 2;
`;

const Desc = styled.div`
  grid-row: 2;
  grid-column: 2;
  font-size: 0.8rem;
  color: ${(props) => props.theme.secondaryColor};

  > p {
    margin: 0;
  }
`;

const StyledA = styled.a`
  text-decoration: none;
  color: inherit;

  &:hover {
    color: inherit;
  }
`;

const AnimeCard = ({
  animeUrl,
  imgUrl,
  title,
  progress,
  progressMax,
  aired,
  endDate,
  type,
}) => (
  <Wrapper>
    <CardImg>
      <img src={imgUrl} alt="Anime poster" />
    </CardImg>
    <CardHeader>
      <StyledA
        href={animeUrl}
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        {title}
      </StyledA>
    </CardHeader>
    <Desc>
      <p>Type: {type}</p>
      <p>Aired: {aired}</p>
      <p>Est. end date: {endDate}</p>
    </Desc>
    <ProgressBarWrapper>
      <ProgressBar progress={progress} max={progressMax} />
    </ProgressBarWrapper>
  </Wrapper>
);

export default AnimeCard;
