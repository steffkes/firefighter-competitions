<template>
  <div class="planning">
    <div class="planning-bar">
      <div class="planning-legend">
        <span
          ><i class="sw sw-series"></i>Treppenlauf (eine Farbe pro Lauf)</span
        >
        <span><i class="sw sw-once"></i>bisher nur einmal</span>
        <span><i class="sw sw-forecast"></i>erwartet (aus Vorjahr)</span>
        <span><i class="sw sw-fcc"></i>Combat Challenge</span>
        <span><i class="sw sw-canceled"></i>abgesagt</span>
        <span><i class="sw sw-today"></i>heute</span>
      </div>
      <label class="checkbox">
        <input v-model="showChallenges" type="checkbox" />
        Combat Challenges zeigen
      </label>
    </div>

    <div class="planning-filters">
      <div class="select is-small">
        <select v-model="country" aria-label="Land">
          <option value="">Alle Länder</option>
          <option v-for="c in countries" :key="c.code" :value="c.code">
            {{ flag(c.code) }} {{ c.code }} ({{ c.count }})
          </option>
        </select>
      </div>
      <div class="select is-small">
        <select :value="''" aria-label="Lauf hinzufügen" @change="addSeries">
          <option value="">Lauf hervorheben …</option>
          <option
            v-for="s in pickableSeries"
            :key="s.key"
            :value="s.key"
            :disabled="selected.includes(s.key)"
          >
            {{ s.name }} ({{ s.city }})
          </option>
        </select>
      </div>
      <span
        v-for="info in selectedInfos"
        :key="info.key"
        class="tag is-white planning-chip"
        :style="{ borderColor: info.color }"
      >
        <i class="dot" :style="{ background: info.color }"></i>
        {{ info.name }} · {{ info.city }} · {{ info.count }}× seit
        {{ info.since }}
        <button
          class="delete is-small"
          :aria-label="`${info.name} entfernen`"
          @click="toggleSeries(info.key)"
        ></button>
      </span>
      <a v-if="selected.length > 1" class="is-size-7" @click="selected = []"
        >Auswahl aufheben</a
      >
    </div>

    <div ref="chart" class="planning-chart"></div>

    <p class="planning-note">
      {{ realCount }} Wettkämpfe ab {{ minYear }}, davon
      {{ planning.recurring.length }} Treppenläufe, die mindestens zweimal
      stattfanden.
    </p>

    <button
      class="button is-small is-light"
      :class="{ 'is-loading': exporting }"
      @click="exportPng"
    >
      Als Bild speichern (PNG)
    </button>

    <div
      v-if="tip"
      class="planning-tip"
      :style="{ left: tip.left + 'px', top: tip.top + 'px' }"
    >
      <strong>{{ tip.name }}</strong>
      <span>{{ tip.text }}</span>
    </div>
  </div>
</template>

<script setup>
import {
  buildPlanning,
  parseDate,
  yearOf,
  yearFraction,
} from "~/utils/planning-series.js";

const props = defineProps({
  competitions: { type: Array, required: true },
  minYear: { type: Number, default: 2022 },
});

const MONTHS = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];
const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
// series get colours in calendar order, so runs close together in the year
// never share one
const PALETTE = [
  "#1f77b4",
  "#e8590c",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#17becf",
  "#bcbd22",
  "#3d3d8f",
];
const ONCE = "#a9b4bf";
const CHALLENGE = "#e4e4e4";
const NS = "http://www.w3.org/2000/svg";

const today = new Date().toISOString().substring(0, 10);
const planning = computed(() =>
  buildPlanning(props.competitions, today, props.minYear),
);
const colors = computed(() =>
  Object.fromEntries(
    planning.value.recurring.map(([key], i) => [
      key,
      PALETTE[i % PALETTE.length],
    ]),
  ),
);
const realCount = computed(
  () => planning.value.items.filter((c) => c.status != "forecast").length,
);

const route = useRoute();
const router = useRouter();

const showChallenges = ref(true);
// highlighted series and country filter live in the URL (?land=DE&lauf=…),
// so a filtered view can be shared as a link
const fromQuery = (value) => (Array.isArray(value) ? value[0] : value) || "";
const country = ref(fromQuery(route.query.land).toUpperCase());
const selected = ref(
  fromQuery(route.query.lauf)
    .split(",")
    .filter(Boolean)
    .map((key) => `FSR:${key}`),
);
watch([country, selected], () =>
  router.replace({
    query: {
      ...route.query,
      land: country.value || undefined,
      lauf:
        selected.value.map((key) => key.replace(/^FSR:/, "")).join(",") ||
        undefined,
    },
  }),
);

const toggleSeries = (key) => {
  selected.value = selected.value.includes(key)
    ? selected.value.filter((k) => k != key)
    : [...selected.value, key];
};
const addSeries = (event) => {
  const key = event.target.value;
  event.target.value = "";
  if (key && !selected.value.includes(key))
    selected.value = [...selected.value, key];
};

const flag = (code) =>
  code.length == 2
    ? code
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(127397 + char.charCodeAt()),
        )
    : "";

// countries with stair runs first, by number of stair runs
const countries = computed(() => {
  const counts = {};
  for (const c of planning.value.items) {
    if (!c.country || c.status == "forecast") continue;
    counts[c.country] ||= { code: c.country, count: 0 };
    counts[c.country].count++;
  }
  return Object.values(counts).sort(
    (a, b) => b.count - a.count || a.code.localeCompare(b.code),
  );
});

const seriesInfo = (key) => {
  const real = (planning.value.series[key] || []).filter(
    (c) => c.status != "forecast",
  );
  if (!real.length) return null;
  return {
    key,
    name: real[0].name,
    city: real[0].city,
    country: real[0].country,
    count: real.length,
    since: yearOf(real[0].start),
    color: colors.value[key] || ONCE,
  };
};
const pickableSeries = computed(() =>
  planning.value.recurring
    .map(([key]) => seriesInfo(key))
    .filter((s) => !country.value || s.country == country.value)
    .sort((a, b) => a.name.localeCompare(b.name, "de")),
);
const selectedInfos = computed(() =>
  selected.value.map(seriesInfo).filter(Boolean),
);
const tip = ref(null);
const chart = ref(null);

const shortDate = (s) => {
  const d = parseDate(s);
  return `${WEEKDAYS[d.getUTCDay()]} ${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.`;
};
const longDate = (s) =>
  parseDate(s).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });

const showTip = (event, c) => {
  const days =
    c.end != c.start
      ? `${longDate(c.start)} – ${longDate(c.end)}`
      : longDate(c.start);
  const status =
    c.status == "canceled"
      ? " · abgesagt"
      : c.status == "draft"
        ? " · vorläufig"
        : c.status == "forecast"
          ? ` · erwartet (Vorjahr ${shortDate(c.basedOn)})`
          : "";
  tip.value = {
    name: c.name,
    text: `${days} · ${c.city}${c.country ? ` (${c.country})` : ""}${status}`,
    left: Math.min(event.clientX + 12, window.innerWidth - 280),
    top: event.clientY + 14,
  };
};

const el = (name, attrs, parent) => {
  const node = document.createElementNS(NS, name);
  for (const key in attrs) node.setAttribute(key, attrs[key]);
  parent?.appendChild(node);
  return node;
};

// draws into the page by default; the export passes its own node and width
const render = (host = chart.value, width = null) => {
  if (!host) return;
  host.innerHTML = "";

  const { items, series, recurring } = planning.value;
  const color = colors.value;
  const colorOf = (c) =>
    c.kind == "FCC" ? CHALLENGE : color[c.series] || ONCE;

  const W = width || Math.max(host.clientWidth, 320);
  const narrow = W < 600;
  const L = narrow ? 30 : 48;
  const plotW = W - L - 8;
  const LANE = narrow ? 6 : 8;
  const FCC_LANE = narrow ? 3 : 4;
  const GAP = 1;
  const PAD = 6;
  const dayW = plotW / 365;
  const x = (s) => L + yearFraction(s) * plotW;

  const isOn = (key) => selected.value.includes(key);
  const anySelected = selected.value.length > 0;
  const visible = items.filter(
    (c) =>
      (c.kind == "FSR" || showChallenges.value) &&
      (!country.value || c.country == country.value),
  );
  const years = [...new Set(visible.map((c) => yearOf(c.start)))].sort(
    (a, b) => b - a,
  );

  // stack events that overlap within a year instead of drawing them on top
  // of each other
  const stack = (list, height) => {
    const ends = [];
    for (const c of list) {
      const x0 = x(c.start);
      const x1 = Math.max(x(c.end) + dayW, x0 + 3);
      let lane = ends.findIndex((end) => end <= x0 - 0.5);
      if (lane < 0) lane = ends.push(0) - 1;
      ends[lane] = x1;
      Object.assign(c, { _x0: x0, _x1: x1, _lane: lane, _h: height });
    }
    return ends.length;
  };
  const byStart = (a, b) => a.start.localeCompare(b.start);
  const rows = years.map((year) => {
    const fsr = visible
      .filter((c) => c.kind == "FSR" && yearOf(c.start) == year)
      .sort(byStart);
    const fcc = visible
      .filter((c) => c.kind == "FCC" && yearOf(c.start) == year)
      .sort(byStart);
    const fsrH = stack(fsr, LANE) * (LANE + GAP);
    const fccLanes = stack(fcc, FCC_LANE);
    const fccH = fccLanes * (FCC_LANE + GAP);
    return {
      year,
      fsr,
      fcc,
      fsrH,
      h: Math.max(24, fsrH + fccH + PAD * 2 + (fccLanes ? 3 : 0)),
    };
  });

  const TOP = 22;
  const rowsH = rows.reduce((sum, row) => sum + row.h, 0);
  const H = TOP + rowsH + 4;
  const svg = el(
    "svg",
    { viewBox: `0 0 ${W} ${H}`, width: W, height: H },
    host,
  );
  const pattern = el(
    "pattern",
    {
      id: "planning-hatch",
      width: 4,
      height: 4,
      patternUnits: "userSpaceOnUse",
      patternTransform: "rotate(45)",
    },
    el("defs", {}, svg),
  );
  el("rect", { width: 4, height: 4, fill: "#fff" }, pattern);
  el("rect", { width: 2, height: 4, fill: "#bbb" }, pattern);
  svg.addEventListener("click", (event) => {
    if (event.target == svg || event.target.dataset.background)
      selected.value = [];
  });

  // months, measured on a non-leap year
  for (let m = 0; m < 12; m++) {
    const a =
      L + ((Date.UTC(2025, m, 1) - Date.UTC(2025, 0, 1)) / 864e5 / 365) * plotW;
    const b =
      L +
      ((Date.UTC(2025, m + 1, 1) - Date.UTC(2025, 0, 1)) / 864e5 / 365) * plotW;
    if (m % 2)
      el(
        "rect",
        {
          x: a,
          y: TOP,
          width: b - a,
          height: rowsH,
          fill: "#fafafa",
          "data-background": 1,
        },
        svg,
      );
    el(
      "line",
      { x1: a, x2: a, y1: TOP, y2: TOP + rowsH, stroke: "#ededed" },
      svg,
    );
    el(
      "text",
      {
        x: (a + b) / 2,
        y: TOP - 8,
        "text-anchor": "middle",
        "font-size": narrow ? 9 : 11,
        fill: "#7a7a7a",
      },
      svg,
    ).textContent = narrow ? MONTHS[m][0] : MONTHS[m];
  }

  let top = TOP;
  for (const row of rows) {
    for (const c of row.fsr) {
      c._y = top + PAD + c._lane * (LANE + GAP);
      c._cy = c._y + LANE / 2;
    }
    for (const c of row.fcc) {
      c._y = top + PAD + row.fsrH + 3 + c._lane * (FCC_LANE + GAP);
      c._cy = c._y + FCC_LANE / 2;
    }
    row.top = top;
    top += row.h;
    el(
      "line",
      { x1: L, x2: L + plotW, y1: top, y2: top, stroke: "#dbdbdb" },
      svg,
    );
    el(
      "text",
      {
        x: L - 6,
        y: row.top + PAD + row.fsrH / 2 + 4,
        "text-anchor": "end",
        "font-size": narrow ? 10 : 12,
        "font-weight": 600,
        fill: row.year == planning.value.forecastYear ? "#1d5f99" : "#363636",
      },
      svg,
    ).textContent = narrow ? "’" + String(row.year).slice(2) : row.year;
  }

  // lines joining the same run from one year to the next
  const shownYears = new Set(years);
  const lines = el("g", {}, svg);
  for (const [key, list] of recurring) {
    const points = list.filter((c) => shownYears.has(yearOf(c.start)));
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      if (yearOf(b.start) - yearOf(a.start) > 2) continue;
      const ax = (a._x0 + a._x1) / 2;
      const bx = (b._x0 + b._x1) / 2;
      const on = isOn(key);
      // a big jump means the event moved: keep that line faint so the
      // steady runs stand out
      const moved = Math.abs(ax - bx) > 45 * dayW;
      el(
        "line",
        {
          x1: ax,
          y1: a._cy,
          x2: bx,
          y2: b._cy,
          stroke: color[key],
          "stroke-width": on ? 2.5 : 1.2,
          opacity: anySelected && !on ? 0.08 : on ? 1 : moved ? 0.18 : 0.6,
          "stroke-dasharray": b.status == "forecast" ? "3 2" : "",
        },
        lines,
      );
    }
  }

  const marks = el("g", {}, svg);
  for (const row of rows) {
    for (const c of [...row.fcc, ...row.fsr]) {
      const dim = anySelected && !isOn(c.series);
      const fill = colorOf(c);
      const attrs = {
        x: c._x0,
        y: c._y,
        width: c._x1 - c._x0,
        height: c._h,
        rx: 1.5,
        opacity: dim ? 0.15 : 1,
      };
      if (c.status == "canceled")
        Object.assign(attrs, {
          fill: "url(#planning-hatch)",
          stroke: "#aaa",
          "stroke-width": 0.6,
        });
      else if (c.status == "forecast" || c.status == "draft")
        Object.assign(attrs, {
          fill: "#fff",
          stroke: fill,
          "stroke-width": 1.3,
          "stroke-dasharray": "2 1.5",
        });
      else attrs.fill = fill;
      const rect = el("rect", attrs, marks);
      rect.style.cursor = "pointer";
      rect.addEventListener("mousemove", (event) => showTip(event, c));
      rect.addEventListener("mouseleave", () => (tip.value = null));
      rect.addEventListener("click", (event) => {
        event.stopPropagation();
        // tapping a run adds it to the highlighted runs, tapping again removes it
        if (c.kind == "FSR") toggleSeries(c.series);
        showTip(event, c);
      });
    }
  }

  // dates next to every occurrence of the highlighted runs; a label that
  // would overlap an earlier one moves to the other side, or below
  const shown = new Set(visible);
  const placed = [];
  const fontSize = narrow ? 10 : 11;
  const fits = (box) =>
    box.x0 >= L &&
    box.x1 <= L + plotW &&
    !placed.some(
      (p) => box.x0 < p.x1 && box.x1 > p.x0 && box.y0 < p.y1 && box.y1 > p.y0,
    );
  for (const c of selected.value.flatMap((key) => series[key] || [])) {
    if (!shown.has(c)) continue;
    const text = (c.status == "forecast" ? "~ " : "") + shortDate(c.start);
    const w = text.length * fontSize * 0.6;
    const candidates = [0, 1, -1, 2, -2].flatMap((shift) => {
      const y = c._cy + 4 + shift * (fontSize + 2);
      return [
        { anchor: "start", x: c._x1 + 4, x0: c._x1 + 4, x1: c._x1 + 4 + w, y },
        { anchor: "end", x: c._x0 - 4, x0: c._x0 - 4 - w, x1: c._x0 - 4, y },
      ];
    });
    const spot = candidates
      .map((b) => ({ ...b, y0: b.y - fontSize, y1: b.y + 2 }))
      .find(fits) || { ...candidates[0], y0: 0, y1: 0 };
    placed.push(spot);
    el(
      "text",
      {
        x: spot.x,
        y: spot.y,
        "text-anchor": spot.anchor,
        "font-size": fontSize,
        "font-weight": 600,
        fill: color[c.series] || ONCE,
        stroke: "#fff",
        "stroke-width": 3,
        "paint-order": "stroke",
      },
      svg,
    ).textContent = text;
  }

  const todayRow = rows.find((row) => row.year == yearOf(today));
  if (todayRow) {
    const tx = x(today);
    el(
      "line",
      {
        x1: tx,
        x2: tx,
        y1: todayRow.top + 1,
        y2: todayRow.top + todayRow.h - 1,
        stroke: "#f14668",
        "stroke-width": 2,
      },
      svg,
    );
  }
  return { svg, W, H };
};

watch([planning, showChallenges, selected, country], () => render());
// redraw when the width changes; the element can appear after mount
const observer = import.meta.client ? new ResizeObserver(() => render()) : null;
watch(chart, (node, previous) => {
  if (previous) observer.unobserve(previous);
  if (node) observer.observe(node);
});
onMounted(() => chart.value && observer.observe(chart.value));

// --- PNG export: the chart at a fixed width with title, legend and date,
// so it reads well when sent around (e.g. via WhatsApp)
const exporting = ref(false);
const exportPng = async () => {
  exporting.value = true;
  try {
    const EXPORT_W = 1200;
    const M = 32;
    const { svg: chartSvg, H: chartH } = render(
      document.createElement("div"),
      EXPORT_W - 2 * M,
    );
    const legend = [
      ["#1f77b4", "Treppenlauf (eine Farbe pro Lauf)"],
      [ONCE, "bisher nur einmal"],
      ["forecast", "erwartet (aus Vorjahr)"],
      ...(showChallenges.value ? [[CHALLENGE, "Combat Challenge"]] : []),
      ["#f14668", "heute"],
    ];
    const infos = selectedInfos.value;
    const headH = 104 + (country.value || infos.length ? 24 : 0);
    const W = EXPORT_W;
    const H = headH + chartH + 56;
    const out = el("svg", {
      xmlns: NS,
      viewBox: `0 0 ${W} ${H}`,
      width: W,
      height: H,
      "font-family": "Helvetica, Arial, sans-serif",
    });
    el("rect", { width: W, height: H, fill: "#fff" }, out);
    el(
      "text",
      { x: M, y: M + 18, "font-size": 24, "font-weight": 700, fill: "#363636" },
      out,
    ).textContent = "Wann finden die Treppenläufe statt?";
    let lx = M;
    for (const [swatch, label] of legend) {
      const y = M + 44;
      if (swatch == "forecast")
        el(
          "rect",
          {
            x: lx,
            y,
            width: 14,
            height: 8,
            rx: 2,
            fill: "#fff",
            stroke: "#777",
            "stroke-dasharray": "2 1.5",
          },
          out,
        );
      else
        el(
          "rect",
          { x: lx, y, width: 14, height: 8, rx: 2, fill: swatch },
          out,
        );
      const t = el(
        "text",
        { x: lx + 20, y: y + 8, "font-size": 13, fill: "#4a4a4a" },
        out,
      );
      t.textContent = label;
      lx += 20 + label.length * 7 + 22;
    }
    if (country.value || infos.length) {
      const t = el(
        "text",
        { x: M, y: M + 90, "font-size": 15, fill: "#7a7a7a" },
        out,
      );
      if (country.value)
        el("tspan", { "font-weight": 700, fill: "#363636" }, t).textContent =
          `Nur ${country.value}` + (infos.length ? "   " : "");
      infos.forEach((info, i) => {
        el("tspan", { "font-weight": 700, fill: info.color }, t).textContent =
          info.name;
        el("tspan", {}, t).textContent =
          ` (${info.city})` + (i < infos.length - 1 ? " · " : "");
      });
    }
    const g = el("g", { transform: `translate(${M} ${headH})` }, out);
    g.appendChild(chartSvg);
    const stand = new Date().toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    el(
      "text",
      { x: M, y: H - 20, "font-size": 12, fill: "#7a7a7a" },
      out,
    ).textContent = `Feuerwehr-Wettkämpfe · Stand ${stand}`;

    const url = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(out)], {
        type: "image/svg+xml",
      }),
    );
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = W * 2;
    canvas.height = H * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    ctx.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    const filename = `terminplanung-${today}.png`;
    const file = new File([blob], filename, { type: "image/png" });

    // phones: open the share sheet (WhatsApp & co.), everything else: download
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Terminplanung" });
        return;
      } catch (error) {
        if (error?.name == "AbortError") return;
      }
    }
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  } finally {
    exporting.value = false;
  }
};
onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped>
.planning-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 20px;
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: #4a4a4a;
}
.planning-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
}
.planning-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.sw {
  display: inline-block;
  width: 14px;
  height: 8px;
  border-radius: 2px;
}
.sw-series {
  background: linear-gradient(
    90deg,
    #1f77b4 0 25%,
    #e8590c 25% 50%,
    #2ca02c 50% 75%,
    #9467bd 75%
  );
}
.sw-once {
  background: #a9b4bf;
}
.sw-forecast {
  border: 1.5px dashed #777;
}
.sw-fcc {
  background: #e4e4e4;
}
.sw-canceled {
  background: repeating-linear-gradient(45deg, #bbb 0 2px, #fff 2px 4px);
}
.sw-today {
  width: 2px;
  height: 12px;
  background: #f14668;
}
.planning-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
  margin-bottom: 8px;
}
.planning-filters .select select {
  max-width: 260px;
}
.planning-chip {
  gap: 6px;
  border: 1.5px solid;
  font-size: 0.75rem;
}
.planning-chip .dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.planning-selected {
  min-height: 26px;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #7a7a7a;
}
.planning-chart :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
}
.planning-note {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #7a7a7a;
}
.planning-tip {
  position: fixed;
  z-index: 5;
  max-width: 260px;
  padding: 6px 10px;
  font-size: 0.8rem;
  pointer-events: none;
  background: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.planning-tip strong {
  display: block;
}
.planning-tip span {
  color: #7a7a7a;
}
</style>
