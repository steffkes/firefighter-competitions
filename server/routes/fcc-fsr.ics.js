import { appendHeader } from "h3";
import calendarProvider from "@/calendar-provider";

export default defineEventHandler(async (event) => {
  appendHeader(event, "Content-Type", "text/calendar");
  return await calendarProvider(
    ["FCC", "FSR"],
    useRuntimeConfig(event).AIRTABLE_API_KEY,
  );
});
