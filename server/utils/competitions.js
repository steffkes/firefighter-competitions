import { createError } from "h3";

// Airtable returns at most 100 records per request, follow `offset` until done
const fetchAllRecords = async (url, apiKey) => {
  const records = [];
  let offset;
  let requests = 0;
  do {
    requests++;
    const res = await $fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      params: {
        "sort[0][field]": "Datum",
        "sort[0][direction]": "desc",
        ...(offset && { offset }),
      },
    });
    records.push(...res.records);
    offset = res.offset;
  } while (offset);
  return { records, requests };
};

const fetchCompetitionsFromAirtable = async (apiKey) => {
  if (!apiKey) {
    throw new Error("AIRTABLE_API_KEY not configured");
  }

  const mapperFn = (record, kind) => {
    let coordinates = null;
    const tmpCoordinates = record.fields?.Koordinaten;
    if (tmpCoordinates) {
      const [lat, lng] = tmpCoordinates.split(",");
      coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };
    }

    return {
      id: record.id,
      kind,
      name: record.fields.Name,
      url: record.fields.Webseite || null,
      participants: { count: null },
      date: {
        start: record.fields.Datum,
        end: record.fields["Datum bis"] || record.fields.Datum,
        is_draft: record.fields.Vorläufig || false,
        is_canceled: record.fields.Abgesagt || false,
        registration_opens: record.fields.Anmeldestart || null,
      },
      location: {
        city: record.fields.Ort || null,
        country_code: record.fields.Land || null,
        coordinates,
      },
    };
  };

  let stairrunsRes, challengesRes;
  try {
    [stairrunsRes, challengesRes] = await Promise.all([
      fetchAllRecords(
        "https://api.airtable.com/v0/appU8k3LUgeNrpcJg/tbl7nlGCJYqn3uF7C",
        apiKey,
      ),
      fetchAllRecords(
        "https://api.airtable.com/v0/appU8k3LUgeNrpcJg/tblRWTfwwmzoImHq1",
        apiKey,
      ),
    ]);
  } catch (error) {
    // e.g. PUBLIC_API_BILLING_LIMIT_EXCEEDED once the monthly quota is used up
    const reason = error?.data?.errors?.[0]?.error || error?.data?.error?.type;
    console.error(
      `Airtable request failed (${error?.statusCode || "?"} ${reason || error?.message})`,
    );
    throw createError({
      statusCode: 503,
      statusMessage: "Service Unavailable",
      message:
        "Die Wettkampftermine können gerade nicht geladen werden. Bitte versuche es später noch einmal.",
      data: { reason: reason || null },
    });
  }

  // one line per actual Airtable fetch, to compare against the API quota
  console.info(
    `Airtable fetched (${stairrunsRes.requests + challengesRes.requests} requests)`,
  );

  const stairruns = stairrunsRes.records.map((record) =>
    mapperFn(record, "FSR"),
  );
  const challenges = challengesRes.records.map((record) =>
    mapperFn(record, "FCC"),
  );

  const competitions = [...stairruns, ...challenges]
    .filter((comp) => comp.date.start) // Ensure date exists
    .sort((a, b) => {
      const dateA = new Date(a.date.start);
      const dateB = new Date(b.date.start);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      return a.name.localeCompare(b.name);
    });

  return { fetchedAt: new Date().toISOString(), competitions };
};

const CACHE_KEY = "airtable-competitions";
// stored without a TTL, only used when Airtable fails
const FALLBACK_KEY = "airtable-competitions:last-known-good";
const TTL = 60 * 60 * 24;

let pending = null;

// Airtable is asked at most once a day: the cached copy expires after 24h
// (Redis TTL) and the next request fetches and stores a fresh one.
// `fetchedAt` records when Airtable was actually asked, not when a page rendered.
export const fetchCompetitionData = async (apiKey) => {
  const storage = useStorage("cache");

  const cached = await storage.getItem(CACHE_KEY).catch((error) => {
    console.error("Cache read failed", error);
    return null;
  });
  // the in-memory storage (no CACHE_REDIS_URL) ignores TTLs, so check the age too
  if (cached && Date.now() - new Date(cached.fetchedAt) < TTL * 1000) {
    return cached;
  }

  // concurrent requests on this instance share one Airtable fetch
  pending ??= (async () => {
    try {
      const data = await fetchCompetitionsFromAirtable(apiKey);
      await Promise.all([
        storage.setItem(CACHE_KEY, data, { ttl: TTL }),
        storage.setItem(FALLBACK_KEY, data),
      ]).catch((error) => console.error("Cache write failed", error));
      return data;
    } catch (error) {
      const fallback = await storage.getItem(FALLBACK_KEY).catch(() => null);
      if (fallback) {
        console.warn("Serving the last known good competitions");
        return fallback;
      }
      throw error;
    }
  })().finally(() => {
    pending = null;
  });

  return pending;
};

export const fetchCompetitions = async (apiKey) =>
  (await fetchCompetitionData(apiKey)).competitions;
