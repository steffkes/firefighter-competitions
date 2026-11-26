// Whether to show school holidays, and for which German state. The visitor's
// own choice is kept in localStorage and wins; without one we guess the state
// from the IP address (see server/api/region.js) and preselect it.
export const states = [
  { code: "BW", name: "Baden-Württemberg" },
  { code: "BY", name: "Bayern" },
  { code: "BE", name: "Berlin" },
  { code: "BB", name: "Brandenburg" },
  { code: "HB", name: "Bremen" },
  { code: "HH", name: "Hamburg" },
  { code: "HE", name: "Hessen" },
  { code: "MV", name: "Mecklenburg-Vorpommern" },
  { code: "NI", name: "Niedersachsen" },
  { code: "NW", name: "Nordrhein-Westfalen" },
  { code: "RP", name: "Rheinland-Pfalz" },
  { code: "SL", name: "Saarland" },
  { code: "SN", name: "Sachsen" },
  { code: "ST", name: "Sachsen-Anhalt" },
  { code: "SH", name: "Schleswig-Holstein" },
  { code: "TH", name: "Thüringen" },
];

const storageKey = "school-holidays";

const readStored = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored && typeof stored.enabled == "boolean") return stored;
  } catch {}
  return null;
};

const writeStored = (value) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {}
};

export const useSchoolHolidays = () => {
  const enabled = useState("school-holidays-enabled", () => false);
  const state = useState("school-holidays-state", () => "");
  const byState = useState("school-holidays-data", () => null);

  // always loaded (the CDN keeps it), so we know whether to offer the switch;
  // a failed request leaves it hidden
  const load = async () => {
    if (byState.value) return;
    try {
      byState.value = await $fetch("/school-holidays.json");
    } catch {
      byState.value = {};
    }
  };

  // runs in the browser only, after hydration
  const init = async () => {
    const stored = readStored();
    if (stored) {
      enabled.value = stored.enabled;
      state.value = stored.state || "";
    } else {
      try {
        const { country, region } = await $fetch("/api/region");
        if (country == "DE" && states.some(({ code }) => code == region)) {
          state.value = region;
          enabled.value = true;
        }
      } catch {}
    }
    await load();
  };

  // called from the checkbox and the dropdown: the visitor decided
  const choose = async (changes) => {
    if ("enabled" in changes) enabled.value = changes.enabled;
    if ("state" in changes) state.value = changes.state;
    writeStored({ enabled: enabled.value, state: state.value });
  };

  const holidays = computed(() =>
    enabled.value && state.value && byState.value
      ? byState.value[state.value] || []
      : [],
  );

  // the switch is only offered once there are holidays to show
  const available = computed(() =>
    Object.values(byState.value || {}).some((list) => list.length),
  );

  return { enabled, state, holidays, available, init, choose };
};
