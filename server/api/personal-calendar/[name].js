import { defineEventHandler } from "h3"; // needed for test
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import glob from "fast-glob";
import competitionProvider from "@/competition-provider.js";
import { DuckDBInstance } from "@duckdb/node-api";

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

  const { motherduckApiToken } = useRuntimeConfig(event);
  const instance = await DuckDBInstance.create(
    "md:?motherduck_token=" + motherduckApiToken,
  );
  const connection = await instance.connect();

  const statement = await connection.prepare(
    `FROM firefighter_competitions.main.participants
SELECT competition_id, teams
WHERE $1 in teams`,
  );
  statement.bindVarchar(1, requestedName);
  const reader = await statement.runAndReadAll();

  const data = reader
    .getRows()
    .reduce((state, [competition_id, { items: teams }]) => {
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
