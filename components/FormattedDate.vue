<template>
  <time :datetime="date">
    {{ formatDate(date, { withYear }) }}
  </time>
</template>

<style scoped>
time {
  font-variant-numeric: tabular-nums;
}
</style>

<script setup>
import { formatDate } from "../util";

defineProps({
  date: { type: String, required: true },
  withYear: { type: Boolean, default: true },
});
</script>
