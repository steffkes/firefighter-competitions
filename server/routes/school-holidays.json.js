// School holidays of all German states, from OpenHolidays (open data,
// https://www.openholidaysapi.org). Fetched on the server, so visitors'
// browsers never talk to a third party. The CDN keeps the response for a day
// (Cache-Control below) instead of Nitro's swr, which never refreshed on Vercel.
const toDate = (date) => date.toISOString().substring(0, 10);

// "Osterferien" => "Ostern", "Weihnachtsferien" => "Weihnachten", ...
const shortNames = {
  Osterferien: "Ostern",
  Weihnachtsferien: "Weihnachten",
  Pfingstferien: "Pfingsten",
  Frühjahrsferien: "Frühjahr",
  Fastnachtsferien: "Fastnacht",
  Halbjahresferien: "Halbjahr",
};
const shortName = (name) =>
  shortNames[name] || name.replace(/ferien$/i, "").trim() || name;

export default defineEventHandler(async (event) => {
  setResponseHeader(
    event,
    "Cache-Control",
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600",
  );

  const from = new Date();
  from.setMonth(from.getMonth() - 1);
  const to = new Date();
  to.setMonth(to.getMonth() + 24);

  const holidays = await $fetch("https://openholidaysapi.org/SchoolHolidays", {
    query: {
      countryIsoCode: "DE",
      languageIsoCode: "DE",
      validFrom: toDate(from),
      validTo: toDate(to),
    },
    headers: { Accept: "application/json" },
  });

  const byState = {};
  for (const holiday of holidays) {
    const name =
      (holiday.name.find(({ language }) => language == "DE") || holiday.name[0])
        ?.text || "Ferien";
    for (const { code } of holiday.subdivisions || []) {
      const state = code.replace(/^DE-/, "");
      (byState[state] ||= []).push({
        name: shortName(name),
        start: holiday.startDate,
        end: holiday.endDate,
      });
    }
  }
  for (const list of Object.values(byState)) {
    list.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
  }
  return byState;
});
