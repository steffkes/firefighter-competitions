<template>
  <div class="mt-2">
    <div
      v-if="results"
      v-for="(result, index) in results"
      :class="{ 'has-background-white-bis': index % 2 }"
    >
      <FirefitFormattedTime
        :class="[
          isPersonalBest(result.time) ? 'is-dark' : 'is-transparent',
          'mr-1',
        ]"
        :time="result.time"
      ></FirefitFormattedTime>
      <span class="is-size-7">
        {{ flag(result.competition.location.country_code) }}
        {{ result.competition.location.city }}
        (<FormattedDate
          :date="result.competition.date.start"
          :formatter="formatDate"
        />)
      </span>
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
const { participant } = defineProps(["participant", "isPersonalBest"]);
const emit = defineEmits(["receivedResults"]);

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

watch(results, (results) => emit("receivedResults", results));
</script>
