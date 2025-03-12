import { parse as parseHtml } from "node-html-parser";

export const parseResult = (content) => {
  if (!content) return null;

  const [, raw_status] = content.match(/result:\s+(.+)/);
  const raw_time = content.match(/time total:\s+(\d{1,2}):(\d{2}),(\d{2})/);
  const [, raw_penalty] = content.match(/penalty:\s+(\d)\ss/);

  const status = {
    finished: "OK",
    disqualified: "DSQ",
    "did not finish": "DNF",
  }[raw_status];

  const result = { status };

  if (status == "OK") {
    const [, time_minutes, time_seconds, time_milliseconds] = raw_time;
    const pad = (number) => number.padStart(2, "0");
    result["time"] = [
      "00",
      ":",
      pad(time_minutes),
      ":",
      pad(time_seconds),
      ".",
      pad(time_milliseconds),
    ].join("");

    const penalty = parseInt(raw_penalty, 10);
    if (penalty) {
      result["penalty"] = penalty;
    }
  }

  return result;
};

export const parseInfo = (content) => {
  if (!content) return null;

  const [_, country, genderChar] = content.match(/\[(\w{2})\]\s([mw])/);
  return {
    country,
    gender: { m: "M", w: "F" }[genderChar],
  };
};

export const parseContent = (content) => {
  const dom = parseHtml(content);

  const pairs = dom
    .querySelector(".match-container")
    .querySelectorAll(".match")
    .map((match) => {
      return match.querySelectorAll(".opponent").map((participant) => {
        const { gender = null, country = null } =
          parseInfo(
            (participant.querySelector(".desc div") || {}).textContent,
          ) || {};
        const team = participant.querySelectorAll(
          ".member-data .searchable",
        )[1];
        const result = parseResult(
          (participant.querySelector(".info-box") || {}).textContent,
        );

        return {
          name: participant.querySelector(".name").textContent || null,
          gender,
          country,
          team: team ? team.textContent.trim() : null,
          result,
        };
      });
    });

  return pairs;
};
