// Groups competitions into recurring series (the same event across years) and
// projects next year's date for runs that have not announced one yet.

// Events that were renamed at some point, mapped onto their current name
const ALIASES = {
  münsterturmlauf: "münsterturmlaufulm",
  feuerwehrlaufnordschwarzwaldtrophy: "nordschwarzwaldtrophy",
  treppenlaufoberhof: "lottothüringentreppenlauf",
  sächsischermteveresttreppenmarathon: "mteveresttreppenmarathon",
  wildbad345treppenlauf: "wildbadtreppenlauf",
  wildbad311treppenlauf: "wildbadtreppenlauf",
  stairrunwilhelmsfeld: "teltschikturmfest",
  treppenlaufhalle: "saalerun",
};

const DAY = 864e5;
const normalize = (s) => (s || "").toLowerCase().replace(/[^a-z0-9äöüß]/g, "");

export const parseDate = (s) => new Date(s.substring(0, 10) + "T00:00:00Z");
export const yearOf = (s) => parseInt(s.substring(0, 4), 10);
export const yearLength = (y) =>
  (Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1)) / DAY;
export const dayOfYear = (date) =>
  (date - Date.UTC(date.getUTCFullYear(), 0, 1)) / DAY;
// position within the year from 0 (1 Jan) to 1 (end of 31 Dec)
export const yearFraction = (s) =>
  dayOfYear(parseDate(s)) / yearLength(yearOf(s));

export const seriesKey = (kind, name, city) => {
  const key = normalize(name);
  return kind == "FSR"
    ? `FSR:${ALIASES[key] || key}`
    : `FCC:${key}:${normalize(city)}`;
};

const toIso = (date) => date.toISOString().substring(0, 10);

/**
 * @param competitions entries as served by /competitions.json
 * @param today        ISO date (YYYY-MM-DD)
 * @param minYear      first year to include
 */
export const buildPlanning = (competitions, today, minYear) => {
  const forecastYear = yearOf(today) + 1;
  const seen = new Set();
  const items = [];
  for (const c of competitions) {
    if (!c.date?.start || yearOf(c.date.start) < minYear) continue;
    const item = {
      id: c.id,
      kind: c.kind,
      name: (c.name || "").trim(),
      start: c.date.start.substring(0, 10),
      end: (c.date.end || c.date.start).substring(0, 10),
      city: (c.location?.city || "").trim(),
      country: c.location?.country_code || "",
      status: c.date.is_canceled ? "canceled" : c.date.is_draft ? "draft" : "",
      series: seriesKey(c.kind, c.name, c.location?.city),
    };
    // the same event entered twice for the same day
    const dupe = item.series + item.start;
    if (seen.has(dupe)) continue;
    seen.add(dupe);
    items.push(item);
  }

  const series = {};
  for (const item of items.filter(({ kind }) => kind == "FSR")) {
    (series[item.series] ||= []).push(item);
  }

  for (const list of Object.values(series)) {
    list.sort((a, b) => a.start.localeCompare(b.start));
    const last = list[list.length - 1];
    // ran this year but no date for next year yet: expect it 52 weeks later,
    // which keeps the weekday
    if (yearOf(last.start) == forecastYear - 1) {
      const ghost = {
        ...last,
        id: last.id + ":forecast",
        start: toIso(new Date(parseDate(last.start).getTime() + 364 * DAY)),
        end: toIso(new Date(parseDate(last.end).getTime() + 364 * DAY)),
        status: "forecast",
        basedOn: last.start,
      };
      list.push(ghost);
      items.push(ghost);
    }
  }

  const typical = (list) => {
    const real = list.filter(({ status }) => status != "forecast");
    return (
      real.reduce((sum, { start }) => sum + yearFraction(start), 0) /
      real.length
    );
  };

  // only runs that really took place (or are announced) in two or more years
  const recurring = Object.entries(series)
    .filter(
      ([, list]) =>
        new Set(
          list
            .filter(({ status }) => status != "forecast")
            .map(({ start }) => yearOf(start)),
        ).size >= 2,
    )
    .sort((a, b) => typical(a[1]) - typical(b[1]));

  return { items, series, recurring, forecastYear };
};
