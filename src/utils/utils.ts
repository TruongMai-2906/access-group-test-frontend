export const formatDate = (date: Date, option?: Intl.DateTimeFormatOptions) => {
  const options = option || {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};
