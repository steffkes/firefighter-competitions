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

  return competitions;
};

// every route shares this one copy, so Airtable is asked at most once a day;
// a failed refresh keeps serving the previous copy
export const fetchCompetitions = defineCachedFunction(
  fetchCompetitionsFromAirtable,
  {
    name: "airtable-competitions",
    getKey: () => "all",
    maxAge: 60 * 60 * 24,
    swr: true,
  },
);
