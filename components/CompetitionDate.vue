<template>
  <span
    ><FormattedDate :date="competition.date.start" :with-year="withYear"
  /></span>

  <span
    v-if="
      formatDate(competition.date.start) != formatDate(competition.date.end)
    "
    class="ml-1"
  >
    -
    <FormattedDate :date="competition.date.end" :with-year="withYear" />
  </span>
</template>

<style scoped>
span {
  display: inline-block;
}
</style>

<script setup>
defineProps({
  competition: { type: Object, required: true },
  withYear: { type: Boolean, default: true },
});

import { formatDate } from "../util";
</script>
