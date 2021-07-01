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
