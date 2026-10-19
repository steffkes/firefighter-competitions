<template>
  <time class="date-block" :class="variantClass" :datetime="start">
    <span class="date-block-small">{{ weekday }}</span>
    <span class="date-block-day" :class="{ 'is-range': endDate }">{{
      day
    }}</span>
    <span class="date-block-small">{{ month }}</span>
  </time>
</template>

<style scoped>
.date-block {
  width: 3.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 6px;
  padding: 0.2rem 0;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
}
.date-block-small {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}
.date-block-day {
  font-size: 1.2rem;
  font-weight: 700;
  white-space: nowrap;
}
.date-block-day.is-range {
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>

<script setup>
const props = defineProps({
  start: { type: String, required: true },
  end: { type: String, default: null },
  variant: { type: String, default: "light" },
});

const WEEKDAYS = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];
const MONTHS = [
  "JAN",
  "FEB",
  "MÄR",
  "APR",
  "MAI",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OKT",
  "NOV",
  "DEZ",
];

// dates come as "YYYY-MM-DD", read them as UTC so the day never shifts
const parse = (value) => new Date(value.substring(0, 10) + "T00:00:00Z");
const pad = (number) => String(number).padStart(2, "0");

const startDate = computed(() => parse(props.start));
const endDate = computed(() =>
  props.end && props.end.substring(0, 10) != props.start.substring(0, 10)
    ? parse(props.end)
    : null,
);

const weekday = computed(() =>
  endDate.value
    ? WEEKDAYS[startDate.value.getUTCDay()] +
      "–" +
      WEEKDAYS[endDate.value.getUTCDay()]
    : WEEKDAYS[startDate.value.getUTCDay()],
);
const day = computed(() =>
  endDate.value
    ? pad(startDate.value.getUTCDate()) + "–" + pad(endDate.value.getUTCDate())
    : pad(startDate.value.getUTCDate()),
);
const month = computed(() => {
  const startMonth = MONTHS[startDate.value.getUTCMonth()];
  if (!endDate.value) return startMonth;
  const endMonth = MONTHS[endDate.value.getUTCMonth()];
  return startMonth == endMonth ? startMonth : startMonth + "–" + endMonth;
});

const variantClass = computed(() =>
  props.variant == "warning"
    ? "has-background-white has-text-warning-dark"
    : "has-background-light has-text-grey-darker",
);
</script>
