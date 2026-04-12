import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import glob from "fast-glob";

const requestedName = process.argv[2] ?? "Stefan Matheis";

const competitionsList = JSON.parse(
  readFileSync("./data/data/competitions.json", "utf-8"),
);
const competitions = Object.fromEntries(
  competitionsList.map((competition) => [competition.id, competition]),
);

const foo = await Promise.all(
  (await glob(["./data/data/participants/*.json"])).map(async (path) => {
    try {
      const { competition_id, teams } = JSON.parse(
        readFileSync(resolve(path), "utf-8"),
      );

      const filteredTeams = teams
        .filter((team) => team.includes(requestedName))
        .map((team) => team.filter((name) => name != requestedName));

      return {
        competition: competitions[competition_id],
        teams: filteredTeams,
      };
    } catch (error) {
      return { teams: [] };
    }
  }),
);

const today = new Date().toISOString();

const filtered = foo.filter(
  ({ competition, teams }) => teams.length && competition?.date?.start >= today,
);

console.dir({ filtered }, { maxArrayLength: null, depth: null });
