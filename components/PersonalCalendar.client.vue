<template>
  <table v-if="calendar.length" class="table is-striped is-fullwidth">
    <tbody>
      <tr v-for="item in calendar">
        <td class="date py-4">
          <CompetitionDate :competition="item.competition" />
        </td>
        <td class="py-4">
          <div class="columns">
            <div class="column">
              {{ item.competition.name }}
              <CompetitionTags :competition="item.competition" />
            </div>
            <div class="column">
              <p v-if="item.teams.length > 1">
                {{ item.teams.length }}× insgesamt
              </p>
              <p v-for="result in item.teams">
                1× mit
                <template v-if="result.length">
                  <template v-for="(name, index) in result">
                    <template v-if="index">, </template>
                    <NuxtLink
                      :to="{
                        name: 'persoenlicher-kalender-name',
                        params: { name },
                      }"
                      >{{ name }}</NuxtLink
                    ></template
                  >
                </template>
              </p>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <article v-else class="message">
    <div class="message-body">
      {{ name }} hat bislang noch nichts vor - vielleicht könnt ihr ja zusammen
      einen Wettkampf bestreiten?
    </div>
  </article>
</template>

<style scoped>
table th.date,
table td.date {
  text-align: right !important;
  font-variant-numeric: tabular-nums;
}

@media screen and (max-width: 1024px) {
  table .date {
    width: 10%;
  }
}
@media screen and (min-width: 1024px) {
  table .date {
    width: 15%;
  }
}
</style>

<script setup>
const { name } = defineProps(["name"]);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("de-DE", {
    month: "2-digit",
    day: "2-digit",
  });

const calendar = await $fetch(
  "/api/personal-calendar/" + encodeURIComponent(name),
);
</script>
