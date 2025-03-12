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

    <FirefitPreviousResults
      :participant="participant"
      :isPersonalBest="isPersonalBest"
      @receivedResults="handleResults"
    />
  </div>
</template>

<style scoped>
.is-transparent {
  background-color: transparent;
}
</style>

<script setup>
const { participant } = defineProps(["participant"]);

const results = ref([]);
const times = computed(() => results.value.map(({ time }) => time).toSorted());

// `time` needs to be truncated. database only stores one decimal point!
const isPersonalBest = (time) => times.value.indexOf(time.slice(0, 10)) === 0;

const flag = (countryCode) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));

// participants result gets added here, because otherwise `times` already contains
// it - before results are loaded. hence the current result would always be the
// best .. until other results are loaded.
const handleResults = (fetchedResults) => {
  results.value = [].concat(fetchedResults, [participant.result]);
};
</script>
