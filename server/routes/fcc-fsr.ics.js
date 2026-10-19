import { appendHeader } from "h3";
import calendarProvider from "../utils/calendar-provider.js";

export default defineEventHandler(async (event) => {
  appendHeader(event, "Content-Type", "text/calendar");
  return await calendarProvider(
    ["FCC", "FSR"],
    useRuntimeConfig(event).AIRTABLE_API_KEY,
  );
});
