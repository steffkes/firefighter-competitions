<template>
  <div class="column">
    <div class="tags mb-2">
      <span class="tag">{{ flag(participant.country) }}</span>
      <span class="tag">{{
        { male: "♂️", female: "♀️" }[participant.gender]
      }}</span>
      <span class="tag">42</span>

      <span class="is-pulled-right">
        <FirefitFormattedTime
          :class="[
            isPersonalBest(participant.result.time) ? 'is-dark' : 'is-success',
          ]"
          :time="participant.result.time"
        ></FirefitFormattedTime>
        <span v-if="participant.result.penalty" class="tag is-danger ml-1"
          >+{{ participant.result.penalty }}s</span
        >
      </span>
    </div>

    <p>
      <strong>{{ participant.name }}</strong>
    </p>
    <p>
      {{ participant.team }}
    </p>

    <div class="mt-2">
      <div
        v-for="(result, index) in participant.previousResults"
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

const times = []
  .concat([participant.result], participant.previousResults)
  .map(({ time }) => time)
  .toSorted();
const isPersonalBest = (time) => times.indexOf(time) == 0;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("de-DE", {
    month: "short",
    year: "2-digit",
  });

const flag = (countryCode) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
</script>
