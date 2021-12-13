import React from "react";
import { IoClose } from "react-icons/io5";
import styled from "styled-components";
import * as APIData from "../types/APIData";

const Wrapper = styled.div`
  display: flex;
  background: #2c2c2c;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const ImgWrapper = styled.div`
  width: 50px;
  height: auto;
  margin-right: 0.5rem;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
`;

const Desc = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: fit-content;
  padding-right: 1.15rem;
`;

const Title = styled.h4`
  font-size: 1.15rem;
`;

const Aired = styled.p`
  margin: 0;
  color: ${(props) => props.theme.secondaryColor};
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 1rem;
  color: #fff;
  z-index: 2;
  background: none;
  border: 0;
`;

interface PropTypes extends APIData.Notification {
  deleteNotification(id: number): void;
}

const Notification = ({
  id,
  imgSrc,
  title,
  aired,
  deleteNotification,
}: PropTypes) => {
  const airedDateString = new Date(aired).toLocaleString("en-us", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return (
    <Wrapper>
      <DeleteButton onClick={() => deleteNotification(id)}>
        <IoClose />
      </DeleteButton>
      <ImgWrapper>
        <img src={imgSrc} alt="" />
      </ImgWrapper>
      <Desc>
        <Title>{title}</Title>
        <Aired>Aired: {airedDateString}</Aired>
      </Desc>
    </Wrapper>
  );
};

export default Notification;
