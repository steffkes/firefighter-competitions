import { fetchCompetitions } from "../utils/competitions.js";
import pg from "pg";

export default defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig(event);
    const competitions = await fetchCompetitions(config.AIRTABLE_API_KEY);

    // Temporarily keep DB merge for participant counts until data service is ready
    let participantsCount = {};
    try {
      const client = new pg.Client({
        connectionString: config.DB_DSN,
      });
      await client.connect();

      const result = await client.query(
        `SELECT competition_id, sum(array_length(teams, 1)) as participants_count
FROM participants
GROUP BY competition_id`,
      );
      await client.end();

      participantsCount = result.rows.reduce(
        (state, entry) => ({
          ...state,
          [entry["competition_id"]]: parseInt(entry["participants_count"], 10),
        }),
        {},
      );
    } catch (error) {
      console.warn("Database unavailable, serving competitions without participant counts");
    }

    return competitions.map((competition) => {
      competition.participants.count = participantsCount[competition.id] || null;
      return competition;
    });
  },
  { maxAge: 60 * 60 /* 1 hour */ }
);
