import { defineEventHandler } from "h3"; // needed for test
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import glob from "fast-glob";
import competitionProvider from "@/competition-provider.js";
import pg from "pg";

export default defineEventHandler(async (event) => {
  const requestedName = decodeURIComponent(
    getRouterParam(event, "name", { decode: false }),
  );

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
    `SELECT competition_id, teams
FROM participants
WHERE $1 = ANY(teams)`,
    [requestedName],
  );
  await client.end();

  const data = result.rows.reduce((state, { competition_id, teams }) => {
    if (!(competition_id in state)) {
      state[competition_id] = {
        competition: competitions[competition_id],
        teams: [],
      };
    }

    state[competition_id]["teams"].push(
      teams.filter((name) => name != requestedName),
    );

    return state;
  }, {});

  const today = new Date().toISOString();
  return Object.values(data)
    .filter(
      ({ competition, teams }) =>
        teams?.length && competition?.date?.start >= today,
    )
    .toSorted((a, b) =>
      a.competition.date.start.localeCompare(b.competition.date.start),
    );
});
