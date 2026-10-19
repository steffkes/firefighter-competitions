<template>
  <tr
    :id="competition.id"
    :class="{
      'has-text-grey-light': competition.date.is_draft,
      'is-selected': isCurrent(competition),
      'is-canceled': competition.date.is_canceled,
    }"
  >
    <td class="date-cell">
      <CompetitionDate :competition="competition" :with-year="false" />
    </td>
    <td>
      <CompetitionName :competition="competition" />
      <CompetitionStatus :competition="competition" />
    </td>
  </tr>
</template>

<style scoped>
.date-cell {
  /* the same width in every month's table, so the names line up; a
     multi-day range breaks into one line per day */
  width: 8rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.date-cell :deep(span) {
  white-space: nowrap;
}
td {
  vertical-align: middle;
}
.is-canceled .competition-name {
  text-decoration: line-through;
}
tr:target {
  background-color: #00d1b2 !important;
  color: #fff;
}
</style>

<script setup>
defineProps(["competition"]);

const getDateFromDate = (date) => date.toISOString().substring(0, 10);

const isCurrent = (competition) =>
  getDateFromDate(new Date()) >=
    getDateFromDate(new Date(competition.date.start)) &&
  getDateFromDate(new Date()) <=
    getDateFromDate(new Date(competition.date.end));
</script>
