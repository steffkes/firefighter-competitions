import { fetchCompetitionData } from "../utils/competitions.js";
import pg from "pg";

// A failed query yields no rows and ok: false, so the result is not cached
const query = async (client, sql) => {
  try {
    return { rows: (await client.query(sql)).rows, ok: true };
  } catch (error) {
    console.warn(`Query failed (${error.message})`);
    return { rows: [], ok: false };
  }
};

// Participant counts and remaining slots change more often than the
// Airtable data, so they are cached for an hour on their own.
// A failed connection throws and is not cached; a failed query is served
// for this request but not cached either.
const fetchDatabaseData = defineCachedFunction(
  async (dsn) => {
    const client = new pg.Client({ connectionString: dsn });
    await client.connect();

    let counts, slots;
    try {
      counts = await query(
        client,
        `SELECT competition_id, sum(array_length(teams, 1)) as participants_count
FROM participants
GROUP BY competition_id`,
      );
      slots = await query(
        client,
        `SELECT competition_id, label, slots
FROM registration
ORDER BY competition_id, label NULLS FIRST`,
      );
    } finally {
      await client.end();
    }

    const participantsCount = counts.rows.reduce(
      (state, entry) => ({
        ...state,
        [entry["competition_id"]]: parseInt(entry["participants_count"], 10),
      }),
      {},
    );

    const registration = {};
    for (const { competition_id, label, slots: amount } of slots.rows) {
      (registration[competition_id] ||= []).push({
        label: label || null,
        slots: Math.max(0, amount),
      });
    }

    return {
      participantsCount,
      registration,
      complete: counts.ok && slots.ok,
    };
  },
  {
    name: "competitions-database",
    maxAge: 60 * 60,
    getKey: () => "all",
    validate: (entry) => entry.value?.complete === true,
  },
);

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const { fetchedAt, competitions } = await fetchCompetitionData(
    config.AIRTABLE_API_KEY,
  );
  // when Airtable was last asked; the homepage footer reads this header
  setResponseHeader(event, "Last-Modified", new Date(fetchedAt).toUTCString());

  // Temporarily keep DB merge for participant counts until data service is ready
  let participantsCount = {};
  let registration = {};
  try {
    ({ participantsCount, registration } = await fetchDatabaseData(
      config.DB_DSN,
    ));
  } catch (error) {
    console.warn(
      "Database unavailable, serving competitions without participant counts",
    );
  }

  return competitions.map((competition) => ({
    ...competition,
    participants: {
      ...competition.participants,
      count: participantsCount[competition.id] || null,
    },
    // remaining slots per category, null when the scraper doesn't know them
    registration: registration[competition.id]
      ? { slots: registration[competition.id] }
      : null,
  }));
});
