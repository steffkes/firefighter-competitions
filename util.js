export const formatDate = (date, { withYear = true } = {}) =>
  new Date(date).toLocaleDateString("de-DE", {
    weekday: "short",
    month: "2-digit",
    day: "2-digit",
    ...(withYear && { year: "2-digit" }),
  });
