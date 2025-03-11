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

    <FirefitPreviousResults :participant="participant" />
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
  .concat([participant.result])
  .map(({ time }) => time)
  .toSorted();
const isPersonalBest = (time) => times.indexOf(time) == 0;

const flag = (countryCode) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
</script>
