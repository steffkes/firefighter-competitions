import { defineEventHandler } from "h3"; // needed for test
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import glob from "fast-glob";
import competitionProvider from "@/competition-provider.js";

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

  const eventsMapperFn = async (path) => {
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
      return {};
    }
  };

  const events = await Promise.all(
    (await glob(["./data/data/participants/*.json"])).map(eventsMapperFn),
  );

  const today = new Date().toISOString();

  return events.filter(
    ({ competition, teams }) =>
      teams?.length && competition?.date?.start >= today,
  );
});
