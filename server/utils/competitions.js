export const fetchCompetitions = async (apiKey) => {
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

  const [stairrunsRes, challengesRes] = await Promise.all([
    $fetch(
      "https://api.airtable.com/v0/appF8BPHzWCy6OKVF/tbl7nlGCJYqn3uF7C",
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        params: { "sort[0][field]": "Datum", "sort[0][direction]": "desc" },
      }
    ),
    $fetch(
      "https://api.airtable.com/v0/appF8BPHzWCy6OKVF/tblRWTfwwmzoImHq1",
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        params: { "sort[0][field]": "Datum", "sort[0][direction]": "desc" },
      }
    ),
  ]);

  const stairruns = stairrunsRes.records.map((record) => mapperFn(record, "FSR"));
  const challenges = challengesRes.records.map((record) => mapperFn(record, "FCC"));

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