// A guess of the visitor's German state, from the headers Vercel adds to each
// request (derived from the IP address). Nothing is stored or logged; the
// visitor's own choice, kept in their browser, always wins over this guess.
import { getHeader, setResponseHeader } from "h3";

export default defineEventHandler((event) => {
  setResponseHeader(event, "Cache-Control", "private, no-store");
  return {
    country: getHeader(event, "x-vercel-ip-country") || null,
    region: getHeader(event, "x-vercel-ip-country-region") || null,
  };
});
