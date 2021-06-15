const currentDate = new Date();

export const setTimeToMidnight = (date) => {
  const fixedDate = new Date(date);
  fixedDate.setHours(0, 0, 0, 0);
  return fixedDate;
};

export const parseDate = (date) => {
  date = new Date(date);
  date = setTimeToMidnight(date);
  const parsedDate = date.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return parsedDate;
};

export const getEndDateForAnime = (startDate, totalEpisodes) => {
  startDate = setTimeToMidnight(startDate);
  const startDateLocalized = startDate.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const endDate = startDate;
  endDate.setDate(endDate.getDate() + parseInt(totalEpisodes) * 7);

  const endDateLocalized = endDate.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const airingDay =
    (Math.ceil((currentDate - startDate + 1) / 86400000) % 7) * -1;
  return {
    startDateLocalized: startDateLocalized,
    endDateLocalized: endDateLocalized,
    airingDay: airingDay,
  };
};
