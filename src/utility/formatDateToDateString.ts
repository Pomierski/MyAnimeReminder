export const setTimeToMidnight = (date: string | Date): Date => {
  const fixedDate = new Date(date);
  fixedDate.setHours(0, 0, 0, 0);
  return fixedDate;
};

export const formatDateToDateString = (date: string | Date): string => {
  date = new Date(date);
  date = setTimeToMidnight(date);
  const formatedDate = date.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formatedDate;
};
