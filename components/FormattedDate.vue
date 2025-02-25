<template>
  <time :datetime="date">
    {{ formatDate(date) }}
  </time>
</template>

<style scoped>
time {
  font-variant-numeric: tabular-nums;
}
</style>

<script setup>
import { formatDate } from "../util";

defineProps(["date"]);
</script>
