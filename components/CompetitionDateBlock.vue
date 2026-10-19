<template>
  <time class="date-block" :datetime="start">
    <span class="tags has-addons">
      <span class="tag" :class="dayClass">{{ weekday }}</span>
      <span class="tag" :class="dateClass">{{ date(startDate) }}</span>
    </span>
    <span v-if="endDate" class="tags has-addons">
      <span class="tag date-block-until">bis</span>
      <span class="tag" :class="dateClass">{{ date(endDate) }}</span>
    </span>
  </time>
</template>

<style scoped>
.date-block {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  font-variant-numeric: tabular-nums;
}
.date-block .tags {
  flex-wrap: nowrap;
  margin-bottom: 0;
}
.date-block .tags + .tags {
  margin-top: 0.25rem;
}
.date-block .tag {
  margin-bottom: 0;
}
.date-block .date-block-until {
  background: transparent;
  color: inherit;
  opacity: 0.6;
}
</style>

<script setup>
const props = defineProps({
  start: { type: String, required: true },
  end: { type: String, default: null },
  variant: { type: String, default: "light" },
});

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

// dates come as "YYYY-MM-DD", read them as UTC so the day never shifts
const parse = (value) => new Date(value.substring(0, 10) + "T00:00:00Z");
const pad = (number) => String(number).padStart(2, "0");
const date = (value) =>
  pad(value.getUTCDate()) + "." + pad(value.getUTCMonth() + 1) + ".";

const startDate = computed(() => parse(props.start));
const endDate = computed(() =>
  props.end && props.end.substring(0, 10) != props.start.substring(0, 10)
    ? parse(props.end)
    : null,
);

const weekday = computed(() => WEEKDAYS[startDate.value.getUTCDay()]);

const dayClass = computed(() =>
  props.variant == "warning" ? "is-warning" : "is-dark",
);
const dateClass = computed(() =>
  props.variant == "warning" ? "is-warning is-light" : "is-link is-light",
);
</script>
