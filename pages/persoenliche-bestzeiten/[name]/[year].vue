<template>
  <div class="container is-max-desktop">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/"> 👨‍🚒 </a>
      </div>
    </nav>

    <p class="title is-3 has-text-centered">Persönliche Bestzeiten</p>
    <p class="subtitle is-5 has-text-centered">{{ name }} ({{ year }})</p>

    <table
      v-if="Object.values(groupedResults).length"
      class="table is-striped is-fullwidth"
    >
      <tbody>
        <tr v-for="item in groupedResults">
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
                <p v-for="result in item.results">
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
                </p>
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

    <p>
      <NuxtLink
        :to="{
          name: 'persoenlicher-kalender-name',
          params: { name },
        }"
        >Persönlicher Kalender von {{ name }}</NuxtLink
      >
    </p>
  </div>

  <footer class="footer mt-6">
    <div class="content has-text-centered">
      <p>
        Hast du Fragen zu den Ergebnissen? Oder weißt von Wettkämpfen die hier
        noch fehlen?<br />
        Melde dich bitte bei <strong>Stefan</strong>:
        <a href="tel:004916097048114">📞 0160 970 48 114</a>&nbsp;
        <a href="mailto:stefan@mathe.is">✉️ stefan@mathe.is</a>
      </p>
    </div>
  </footer>
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
const formatDate = (date) =>
  new Date(date).toLocaleDateString("de-DE", {
    month: "2-digit",
    day: "2-digit",
  });

const {
  params: { name, year },
} = useRoute();

const { data: competitionsList } = await useFetch("/api/competitions");
const competitions = Object.fromEntries(
  competitionsList.value.map((competition) => [competition.id, competition]),
);

const { data: results } = await useFetch(
  "/api/personal-results/" + encodeURIComponent(name) + "/" + year,
);

const filteredNames = (names) => names.filter((item) => item != name);

const groupedResults = computed(() =>
  results.value.reduce((state, result) => {
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

useSeoMeta({
  title: "Persönliche Bestzeiten (" + name + " @ " + year + ")",
});
</script>
