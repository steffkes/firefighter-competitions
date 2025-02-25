<template>
  <span><FormattedDate :date="competition.date.start" /></span>

  <span
    v-if="
      formatDate(competition.date.start) != formatDate(competition.date.end)
    "
    class="ml-1"
  >
    -
    <FormattedDate :date="competition.date.end" />
  </span>
</template>

<style scoped>
span {
  display: inline-block;
}
</style>

<script setup>
defineProps(["competition"]);

import { formatDate } from "../util";
</script>
