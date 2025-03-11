import competitionProvider from "@/competition-provider.js";
import pg from "pg";

export default defineEventHandler(async (event) => {
  const requestedNames = decodeURIComponent(
    getRouterParam(event, "names", { decode: false }),
  ).split("/");

  const client = new pg.Client({
    connectionString: useRuntimeConfig(event)["DB_DSN"],
  });
  await client.connect();

  const result = await client.query(
    `SELECT competition_id, duration, type, names, ranks
FROM results
WHERE names = $1::varchar[]`,
    [requestedNames],
  );
  await client.end();

  const competitions = Object.fromEntries(
    (await competitionProvider()).map((competition) => [
      competition.id,
      competition,
    ]),
  );

  const results = result.rows
    .map(({ competition_id, duration: time, ranks }) => ({
      competition: competitions[competition_id],
      time,
      ranks,
    }))
    .toReversed();

  return results;
});
