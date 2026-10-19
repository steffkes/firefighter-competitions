<template>
  <div class="tags mt-1 mb-0">
    <span class="mr-2 mb-2 has-text-grey-dark is-size-7">
      {{ flag(competition.location.country_code) }}
      {{ competition.location.city }}
      <template v-if="withDate">
        · <CompetitionDate :competition="competition"
      /></template>
    </span>
    <span v-if="competition.date.is_canceled" class="tag is-danger is-light"
      >Abgesagt</span
    >
    <span v-else-if="competition.date.is_draft" class="tag is-light"
      >Termin vorläufig</span
    >
    <span
      v-if="!competition.date.is_canceled && (isOpen || count)"
      class="tag is-success is-light"
    >
      <template v-if="isOpen">Anmeldung offen</template>
      <template v-if="isOpen && count">&nbsp;·&nbsp;</template>
      <template v-if="count">👨‍🚒 {{ count }}</template>
    </span>
    <SingleboerseCounter
      v-if="singleboerse[competition.id]"
      :id="singleboerse[competition.id]"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  competition: { type: Object, required: true },
  withDate: { type: Boolean, default: false },
});

const today = () => new Date().toISOString().substring(0, 10);

const isOpen = computed(() => {
  const opens = props.competition.date.registration_opens;
  return Boolean(
    opens &&
      opens.substring(0, 10) <= today() &&
      props.competition.date.end.substring(0, 10) >= today(),
  );
});

const count = computed(() => props.competition.participants?.count);

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
