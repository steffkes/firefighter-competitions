<template>
  <tr
    :key="competition.id"
    :id="competition.id"
    :class="{
      'has-text-grey-lighter': isPast(competition),
      'has-text-grey-light': competition.date.is_draft,
      'has-text-weight-light': competition.date.is_draft,
      'has-text-grey-lighter': competition.date.is_canceled,
      'is-selected': isCurrent(competition),
      'is-canceled': competition.date.is_canceled,
    }"
  >
    <td class="date">
      <CompetitionDate :competition="competition" />

      <p>
        <span
          :class="{
            tag: true,
            'is-success':
              formatDate(competition.date.registration_opens) !=
              formatDate(new Date()),
            'is-dark':
              formatDate(competition.date.registration_opens) ==
              formatDate(new Date()),
          }"
          v-if="competition.has_registration_pending"
          style="cursor: help"
          :title="
            'Anmeldung startet am ' +
            formatDate(competition.date.registration_opens)
          "
        >
          ⏰
          <FormattedDate
            :date="competition.date.registration_opens"
            class="ml-1"
          />
        </span>
      </p>
    </td>
    <td>
      <div>
        <a v-if="competition.url" class="is-block" :href="competition.url">{{
          competition.name
        }}</a>
        <div v-else>{{ competition.name }}</div>
      </div>

      <CompetitionTags :competition="competition" />
    </td>
  </tr>
</template>

<style scoped>
table th.date,
table td.date {
  text-align: right !important;
  font-variant-numeric: tabular-nums;
}

.is-canceled td {
  text-decoration: line-through;
}

tr:target {
  background-color: #00d1b2 !important;
  color: #fff;
}

@media screen and (max-width: 1024px) {
  table .date {
    width: 10%;
  }
}
@media screen and (min-width: 1024px) {
  table .date {
    width: 40%;
  }
}
</style>

<script setup>
import { differenceInDays, parseISO as parseIsoDate } from "date-fns";
import { formatDate } from "../util";

defineProps(["competition"]);

const getDateFromDate = (date) => date.toISOString().substring(0, 10);

const isPast = (competition) =>
  getDateFromDate(new Date()) > getDateFromDate(new Date(competition.date.end));

const isCurrent = (competition) =>
  getDateFromDate(new Date()) >=
    getDateFromDate(new Date(competition.date.start)) &&
  getDateFromDate(new Date()) <=
    getDateFromDate(new Date(competition.date.end));
</script>
