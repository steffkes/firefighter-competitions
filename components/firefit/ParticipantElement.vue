<template>
  <div class="column">
    <template v-if="participant.result">
      <div class="tags mb-2">
        <span class="tag">{{ flag(participant.country) }}</span>
        <span class="tag">{{ { M: "♂️", F: "♀️" }[participant.gender] }}</span>
        <span class="tag">42</span>

        <template v-if="participant.result.status == 'OK'">
          <FirefitFormattedTime
            :class="[
              isPersonalBest(participant.result.time)
                ? 'is-dark'
                : 'is-success',
            ]"
            :time="participant.result.time"
          ></FirefitFormattedTime>
          <span
            v-if="participant.result.penalty"
            class="tag"
            :class="{
              'is-danger': !active,
              'is-danger-light': active,
              'has-text-danger': active,
            }"
            >+{{ participant.result.penalty }}s</span
          >
        </template>
        <template v-else>
          <span
            class="tag"
            :class="{
              'is-danger': participant.result.status == 'DSQ',
              'is-warning': participant.result.status == 'DNF',
            }"
            >{{ participant.result.status }}</span
          >
        </template>
      </div>

      <p>
        <strong>{{ participant.name }}</strong>
      </p>
      <p>
        {{ participant.team }}
      </p>

      <FirefitPreviousResults
        v-if="active"
        :participant="participant"
        :isPersonalBest="isPersonalBest"
        @receivedResults="handleResults"
      />
    </template>
    <template v-else> (empty) </template>
  </div>
</template>

<style scoped>
.is-transparent {
  background-color: transparent;
}
</style>

<script setup>
const { participant } = defineProps(["participant", "active"]);

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
