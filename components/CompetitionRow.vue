<template>
  <tr
    :id="competition.id"
    :class="{
      'has-text-grey-light': competition.date.is_draft,
      'is-selected': isCurrent(competition),
      'is-canceled': competition.date.is_canceled,
      ['registration-' + status?.kind]: status,
    }"
  >
    <td>
      <div class="competition-grid">
        <div class="date-cell">
          <CompetitionDate :competition="competition" :with-year="false" />
        </div>
        <div>
          <CompetitionName :competition="competition" />
          <CompetitionStatus
            :competition="competition"
            :with-registration="false"
          />
        </div>
        <CompetitionRegistration
          class="registration-line"
          :competition="competition"
        />
      </div>
    </td>
  </tr>
</template>

<style scoped>
.competition-grid {
  /* the same date column in every month's table, so the names line up;
     a multi-day range breaks into one line per day */
  display: grid;
  grid-template-columns: calc(8rem - 1.5em) 1fr;
  column-gap: 1.5em;
}
/* the registration line keeps the two columns: status under the date,
   numbers under the name */
.registration-line {
  display: contents;
}
.registration-line :deep(.headline) {
  grid-column: 1;
  text-align: right;
  margin-bottom: 0.25rem;
}
.registration-line :deep(.parts) {
  grid-column: 2;
  margin-bottom: 0.25rem;
}
.registration-line :deep(.parts)::before {
  content: none;
}
.date-cell {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.date-cell :deep(span) {
  white-space: nowrap;
}
.is-canceled .competition-name {
  text-decoration: line-through;
}
/* a coloured edge per registration status */
.registration-soon td:first-child {
  box-shadow: inset 4px 0 0 hsl(217, 71%, 53%);
}
.registration-open td:first-child {
  box-shadow: inset 4px 0 0 hsl(153, 53%, 53%);
}
.registration-few td:first-child {
  box-shadow: inset 4px 0 0 hsl(36, 100%, 50%);
}
.registration-closed td:first-child {
  box-shadow: inset 4px 0 0 hsl(348, 86%, 61%);
}
tr:target {
  background-color: #00d1b2 !important;
  color: #fff;
}
</style>

<script setup>
import { registrationStatus } from "../registration";

const props = defineProps(["competition"]);
const status = computed(() => registrationStatus(props.competition));

const getDateFromDate = (date) => date.toISOString().substring(0, 10);

const isCurrent = (competition) =>
  getDateFromDate(new Date()) >=
    getDateFromDate(new Date(competition.date.start)) &&
  getDateFromDate(new Date()) <=
    getDateFromDate(new Date(competition.date.end));
</script>
