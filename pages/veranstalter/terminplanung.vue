<template>
  <div class="container px-4 py-5">
    <h1 class="title is-4 mb-1">Wann finden die Treppenläufe statt?</h1>
    <p class="subtitle is-6 has-text-grey mt-1 mb-4">
      Jede Zeile ein Jahr, 1. Januar bis 31. Dezember. Jeder wiederkehrende
      Treppenlauf hat eine eigene Farbe, Linien verbinden ihn über die Jahre.
      Antippen hebt ihn hervor.
    </p>

    <div v-if="error" class="notification is-danger is-light">
      {{
        error.data?.message ||
        "Die Wettkampftermine können gerade nicht geladen werden."
      }}
    </div>
    <PlanningTimeline v-else-if="competitions" :competitions="competitions" />
  </div>
</template>

<script setup>
// planning view for organizers: not linked from the site and kept out of
// search engines
useHead({
  title: "Terminplanung · Feuerwehr-Wettkämpfe",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const { data: competitions, error } = await useFetch("/competitions.json");
</script>
