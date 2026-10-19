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
      <CompetitionDateBlock
        :start="competition.date.start"
        :end="competition.date.end"
      />
    </td>
    <td>
      <a
        class="is-block has-text-weight-semibold"
        :href="competition.url || '#' + competition.id"
        @click.prevent="$emit('select', competition)"
        >{{ competition.name }}</a
      >
      <CompetitionStatus :competition="competition" />
    </td>
  </tr>
</template>

<style scoped>
.date-cell {
  width: 4rem;
  padding-left: 0;
}
td {
  vertical-align: middle;
}
.is-canceled a {
  text-decoration: line-through;
}
tr:target {
  background-color: #00d1b2 !important;
  color: #fff;
}
</style>

<script setup>
defineProps(["competition"]);
defineEmits(["select"]);

const getDateFromDate = (date) => date.toISOString().substring(0, 10);

const isCurrent = (competition) =>
  getDateFromDate(new Date()) >=
    getDateFromDate(new Date(competition.date.start)) &&
  getDateFromDate(new Date()) <=
    getDateFromDate(new Date(competition.date.end));
</script>
