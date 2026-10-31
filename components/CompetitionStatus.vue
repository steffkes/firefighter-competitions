<template>
  <div class="tags mt-1 mb-0">
    <span class="mr-2 mb-2 has-text-grey-dark is-size-7">
      {{ flag(competition.location.country_code) }}
      {{ competition.location.city }}
    </span>
    <span v-if="withDate" class="mr-2 mb-2 has-text-grey-dark is-size-7">
      📅 <CompetitionDate :competition="competition" />
    </span>
    <span v-if="competition.date.is_canceled" class="tag is-danger is-light"
      >Abgesagt</span
    >
    <span v-else-if="competition.date.is_draft" class="tag is-light"
      >Termin vorläufig</span
    >
    <SingleboerseCounter
      v-if="singleboerse[competition.id]"
      :id="singleboerse[competition.id]"
    />
    <CompetitionRegistration
      v-if="withRegistration"
      class="registration-line"
      :competition="competition"
      :with-opening="withOpening"
    />
  </div>
</template>

<style scoped>
.registration-line {
  flex-basis: 100%;
  margin-bottom: 0.5rem;
}
</style>

<script setup>
const props = defineProps({
  competition: { type: Object, required: true },
  withDate: { type: Boolean, default: false },
  withOpening: { type: Boolean, default: true },
  // rows show the registration line on its own, across both columns
  withRegistration: { type: Boolean, default: true },
});

const singleboerse = {
  recyC5LmxecehTxWD: "240511-schonach",
  reckHSB1eG9Su8fxx: "240907-radebeul",
  receyIQyNivMbfVe4: "250208-ulm",
};

const flag = (countryCode) =>
  (countryCode || "")
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
</script>
