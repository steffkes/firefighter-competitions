<template>
  <div class="mt-2">
    <div
      v-if="results"
      v-for="(result, index) in results"
      :class="{ 'has-background-white-bis': index % 2 }"
    >
      <FirefitFormattedTime
        :class="[isPersonalBest(result.time) ? 'is-dark' : 'is-transparent']"
        :time="result.time"
      ></FirefitFormattedTime>
      <span class="tag is-transparent">
        {{ flag(result.competition.location.country_code) }}
        {{ result.competition.location.city }}</span
      >
      <FormattedDate
        :date="result.competition.date.start"
        :formatter="formatDate"
        class="tag is-transparent"
      />
    </div>
    <div v-else class="skeleton-lines">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.is-transparent {
  background-color: transparent;
}
</style>

<script setup>
const { participant } = defineProps(["participant"]);

const isPersonalBest = () => false;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("de-DE", {
    month: "short",
    year: "2-digit",
  });

const flag = (countryCode) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));

const { status, data: results } = useFetch(
  "/api/firefit/results/" + encodeURIComponent(participant["name"].trim()),
  { lazy: true, server: false },
);
</script>
