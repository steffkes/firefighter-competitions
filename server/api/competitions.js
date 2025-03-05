import { defineEventHandler } from "h3"; // needed for test
import competitionProvider from "@/competition-provider";
import pg from "pg";

export default defineEventHandler(async (event) => {
  const data = await competitionProvider();

  const client = new pg.Client({
    connectionString: useRuntimeConfig(event)["DB_DSN"],
  });
  await client.connect();

  const result = await client.query(
    `SELECT competition_id, sum(array_length(teams, 1)) as participants_count
FROM participants
GROUP BY competition_id`,
  );
  await client.end();

  const participantsCount = result.rows.reduce(
    (state, entry) => ({
      ...state,
      [entry["competition_id"]]: parseInt(entry["participants_count"], 10),
    }),
    {},
  );

  return data.map((event) => {
    event["participants"]["count"] = participantsCount[event["id"]];
    return event;
  });
});
