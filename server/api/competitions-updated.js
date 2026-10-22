import { fetchCompetitionData } from "../utils/competitions.js";

// when the competition data was last fetched from Airtable;
// reads the shared cache, so it never costs an extra Airtable call by itself
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const { fetchedAt } = await fetchCompetitionData(config.AIRTABLE_API_KEY);
  return { fetchedAt };
});
