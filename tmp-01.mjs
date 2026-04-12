import { defineEventHandler } from "h3"; // needed for test
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import glob from "fast-glob";
import Database from "better-sqlite3";
import competitionProvider from "./competition-provider.js";

const requestedName = "Stefan Matheis"; /*decodeURIComponent(
    getRouterParam(event, "name", { decode: false }),
  );*/

const competitions = Object.fromEntries(
  (await competitionProvider()).map((competition) => [
    competition.id,
    competition,
  ]),
);

const db = new Database("./data/data/firefighter-competitions.db");
db.pragma("journal_mode = WAL");

const cleanTeam = (team) => team.filter((name) => name != requestedName);

const events = db
  .prepare(
    `SELECT participants.competition_id, participants.teams
FROM participants, json_each(participants.teams)
WHERE json_each.value = ?`,
  )
  .all(requestedName)
  .reduce((state, { competition_id, teams }) => {
    if (!(competition_id in state)) {
      state[competition_id] = [];
    }
    state[competition_id].push(cleanTeam(JSON.parse(teams)));
    return state;
  }, {});

const today = new Date().toISOString();

const foo = Object.entries(events)
  .map(([competition_id, teams]) => {
    return {
      competition: competitions[competition_id],
      teams,
    };
  })
  .filter(
    ({ competition, teams }) =>
      teams?.length && competition?.date?.start >= today,
  )
  .toSorted((a, b) =>
    a.competition?.date?.start.localeCompare(b.competition?.date?.start),
  );
console.dir({ foo }, { depth: null, maxArrayLength: null });
