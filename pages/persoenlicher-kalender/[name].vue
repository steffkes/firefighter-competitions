<template>
  <div class="container is-max-desktop">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/"> 👨‍🚒 </a>
      </div>
    </nav>

    <p class="title is-3 has-text-centered">Persönlicher Kalender</p>
    <p class="subtitle is-5 has-text-centered">{{ name }}</p>

    <table class="table is-striped is-fullwidth">
      <tbody>
        <tr v-for="item in calendar">
          <td class="py-4">
            <time class="button is-outlined">{{
              formatDate(item.competition.date.start)
            }}</time>
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
                  <NuxtLink
                    :to="{
                      name: 'persoenlicher-kalender-name',
                      params: { name: result.join(', ') },
                    }"
                  >
                    {{ result.join(", ") }}
                  </NuxtLink>
                </p>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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
time {
  background-color: transparent;
  font-variant-numeric: tabular-nums;
}
</style>

<script setup>
const formatDate = (date) =>
  new Date(date).toLocaleDateString("de-DE", {
    month: "2-digit",
    day: "2-digit",
  });

const {
  params: { name },
} = useRoute();

const { data: calendar } = await useFetch(
  "/api/personal-calendar/" + encodeURIComponent(name),
);

useSeoMeta({
  title: "Persönlicher Kalender (" + name + ")",
});
</script>
