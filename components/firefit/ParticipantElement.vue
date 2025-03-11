<template>
  <div class="column">
    <div class="tags mb-0">
      <span class="tag">{{ flag(participant.country) }}</span>
      <span class="tag">{{
        { male: "♂️", female: "♀️" }[participant.gender]
      }}</span>
      <span class="tag">42</span>

      <span class="is-pulled-right">
        <FirefitFormattedTime
          class="is-success"
          :time="participant.result.time"
        ></FirefitFormattedTime>
        <span v-if="participant.result.penalty" class="tag is-danger mr-1"
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

    <p v-for="result in participant.previousResults">
      <FirefitFormattedTime
        style="background-color: transparent"
        :time="result.time"
      ></FirefitFormattedTime>
    </p>
  </div>
</template>

<script setup>
defineProps(["participant"]);

const flag = (countryCode) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
</script>
