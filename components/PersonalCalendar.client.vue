<template>
  <table v-if="calendar.length" class="table is-striped is-fullwidth">
    <tbody>
      <tr v-for="item in calendar">
        <td class="py-4">
          <div class="columns">
            <div class="column is-2 has-text-right-desktop">
              <CompetitionDate :competition="item.competition" />
            </div>
            <div class="column">
              {{ item.competition.name }}
              <CompetitionTags :competition="item.competition" />
            </div>
            <div class="column">
              <p v-if="item.teams.length > 1">
                {{ item.teams.length }}× insgesamt
              </p>
              <p v-for="result in item.teams">
                1×
                <template v-if="result.length">
                  mit
                  <template v-for="(name, index) in result">
                    <template v-if="index">, </template>
                    <NuxtLink
                      :to="{
                        name: 'personal-calendar',
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
