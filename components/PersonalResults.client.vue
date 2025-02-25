<template>
  <table
    v-if="Object.values(groupedResults).length"
    class="table is-striped is-fullwidth"
  >
    <tbody>
      <tr v-for="item in groupedResults">
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
              <div v-for="result in item.results" class="mb-2">
                <time :duration="result.duration">{{ result.duration }}</time>
                <template v-if="result.names.length">
                  (<template v-for="(name, index) in result.names">
                    <template v-if="index">, </template>
                    <NuxtLink
                      :to="{
                        name: 'persoenliche-bestzeiten-name-year',
                        params: { name, year },
                      }"
                      >{{ name }}</NuxtLink
                    ></template
                  >)
                </template>

                <div
                  v-if="result.ranks.length"
                  class="field is-grouped is-grouped-multiline"
                >
                  <div v-for="rank of result.ranks" class="control">
                    <div class="tags has-addons">
                      <span
                        class="tag is-dark"
                        :style="{ backgroundColor: rankColors[rank.rank] }"
                        >{{ rank.rank }}.</span
                      >
                      <span class="tag">{{ rank.label ?? "Gesamt" }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <article v-else class="message">
    <div class="message-body">
      {{ name }} hat {{ year }} (noch) keine Wettkämpfe besucht.
    </div>
  </article>
</template>

<script setup>
const { name, year } = defineProps(["name", "year"]);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("de-DE", {
    month: "2-digit",
    day: "2-digit",
  });

const competitions = Object.fromEntries(
  (await $fetch("/api/competitions")).map((competition) => [
    competition.id,
    competition,
  ]),
);

const results = await $fetch(
  "/api/personal-results/" + encodeURIComponent(name.trim()) + "/" + year,
);

const filteredNames = (names) => names.filter((item) => item != name.trim());

const groupedResults = computed(() =>
  results.reduce((state, result) => {
    const id = result.date + "_" + result.competition_id;
    if (!(id in state)) {
      state[id] = {
        competition: competitions[result.competition_id],
        results: [],
      };
    }
    result.names = filteredNames(result.names);
    state[id].results.push(result);
    return state;
  }, {}),
);

const rankColors = {
  1: "#C9B037", // 🥇
  2: "#B4B4B4", // 🥈
  3: "#AD8A56", // 🥉
};
</script>
