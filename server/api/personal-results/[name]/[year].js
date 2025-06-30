import { defineEventHandler } from "h3"; // needed for test
import competitionProvider from "@/competition-provider.js";
import pg from "pg";

export default defineEventHandler(async (event) => {
  const requestedName = decodeURIComponent(
    getRouterParam(event, "name", { decode: false }),
  );
  const requestedYear = getRouterParam(event, "year");

  const competitions = Object.fromEntries(
    (await competitionProvider()).map((competition) => [
      competition.id,
      competition,
    ]),
  );

  const client = new pg.Client({
    connectionString: useRuntimeConfig(event)["DB_DSN"],
  });
  await client.connect();

  const result = await client.query(
    `SELECT competition_id, duration, type, names, ranks
FROM results
WHERE $1 = ANY(names)`,
    [requestedName],
  );
  await client.end();

  return result.rows
    .filter(({ competition_id }) =>
      competitions[competition_id]?.date?.start?.startsWith(requestedYear),
    )
    .toSorted((a, b) =>
      competitions[a.competition_id].date.start.localeCompare(
        competitions[b.competition_id].date.start,
      ),
    );
});
