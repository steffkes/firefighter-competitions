<template>
  <time class="date-block" :class="variantClass" :datetime="start">
    <span class="date-block-small">{{ weekday }}</span>
    <span class="date-block-day">{{ day }}</span>
    <span class="date-block-small">{{ month }}</span>
    <span v-if="until" class="date-block-until">{{ until }}</span>
  </time>
</template>

<style scoped>
.date-block {
  width: 3.25rem;
  margin: 0 auto;
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
.date-block-until {
  align-self: stretch;
  margin-top: 0.2rem;
  padding-top: 0.15rem;
  border-top: 1px solid currentColor;
  font-size: 0.65rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  opacity: 0.8;
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

// the block always shows the first day; multi-day events add a small
// "bis DD.MM." line with the last day
const weekday = computed(() => WEEKDAYS[startDate.value.getUTCDay()]);
const day = computed(() => pad(startDate.value.getUTCDate()));
const month = computed(() => MONTHS[startDate.value.getUTCMonth()]);
const until = computed(() =>
  endDate.value
    ? "bis " +
      pad(endDate.value.getUTCDate()) +
      "." +
      pad(endDate.value.getUTCMonth() + 1) +
      "."
    : null,
);

const variantClass = computed(() =>
  props.variant == "warning"
    ? "has-background-white has-text-warning-dark"
    : "has-background-light has-text-grey-darker",
);
</script>
