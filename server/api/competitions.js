import { fetchCompetitionData } from "../utils/competitions.js";
import pg from "pg";

export default defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig(event);
    const { fetchedAt, competitions } = await fetchCompetitionData(
      config.AIRTABLE_API_KEY,
    );
    // when Airtable was last asked; the homepage footer reads this header
    setResponseHeader(
      event,
      "Last-Modified",
      new Date(fetchedAt).toUTCString(),
    );

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
      console.warn(
        "Database unavailable, serving competitions without participant counts",
      );
    }

    return competitions.map((competition) => {
      competition.participants.count =
        participantsCount[competition.id] || null;
      return competition;
    });
  },
  { swr: true, maxAge: 60 * 60 * 24 },
);
