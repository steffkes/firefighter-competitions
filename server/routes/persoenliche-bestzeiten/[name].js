import { defineEventHandler, sendRedirect, getRouterParam } from "h3"; // needed for test

export default defineEventHandler(async (event) => {
  const requestedName = decodeURIComponent(
    getRouterParam(event, "name", { decode: false }),
  );
  const today = new Date();

  return sendRedirect(
    event,
    "/persoenliche-bestzeiten/" + requestedName + "/" + today.getFullYear(),
    307,
  );
});
