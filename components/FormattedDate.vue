<template>
  <time :datetime="date">
    {{ formatter(date) }}
  </time>
</template>

<style scoped>
time {
  font-variant-numeric: tabular-nums;
}
</style>

<script setup>
import { formatDate } from "../util";

const { formatter = formatDate } = defineProps(["date", "formatter"]);
</script>
