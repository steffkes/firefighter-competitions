<template>
  <div class="modal" :class="{ 'is-active': activeModal }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <img src="/qr-code.svg" />
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="activeModal = false"
    ></button>
  </div>

  <div class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/"> 👨‍🚒 </a>

        <a
          href="//www.instagram.com/firefighter_competitions"
          class="navbar-item"
        >
          <img src="/instagram.svg" />
        </a>
        <a
          href="//whatsapp.com/channel/0029VbC7AG5CnA7orIZ6Xc0p"
          class="navbar-item"
        >
          <img src="/whatsapp.svg" />
        </a>
        <a class="navbar-item is-hidden-desktop" @click="activeModal = true"
          ><img src="/qr-code.svg" style="opacity: 0.1"
        /></a>
      </div>
    </nav>

    <div class="columns">
      <div class="column">
        <div v-if="competitionsError" class="notification is-danger is-light">
          <p class="has-text-weight-bold">
            Die Wettkampftermine können gerade nicht geladen werden.
          </p>
          <p>
            Bitte versuche es später noch einmal. Wenn das Problem bleibt, melde
            dich gerne (Kontakt ganz unten).
          </p>
        </div>

        <ExplainerBox />

        <template v-if="upcomingRegistrations.length">
          <div class="tabs mb-3">
            <ul>
              <li class="is-active"><a>Anmeldung öffnet bald</a></li>
            </ul>
          </div>

          <table class="table is-fullwidth is-striped is-hoverable mb-3">
            <tbody>
              <CompetitionRow
                v-for="competition in upcomingRegistrations"
                :key="competition.id"
                :competition="competition"
              />
            </tbody>
          </table>

          <p class="has-text-grey is-size-7 mb-6">
            Bei diesen Wettkämpfen öffnet die Anmeldung innerhalb der nächsten
            vier Wochen.
          </p>
        </template>

        <div v-if="!competitionsError && years.length" class="tabs mb-3">
          <ul>
            <li
              v-for="year in years"
              :key="year"
              :class="{ 'is-active': year == activeYear }"
            >
              <a @click="selectedYear = year">{{ year }}</a>
            </li>
          </ul>
        </div>

        <table
          v-if="!competitionsError"
          class="table is-fullwidth is-striped is-hoverable"
        >
          <tbody>
            <tr v-if="!competitionsOfYear.length" class="has-text-grey-light">
              <td colspan="2">
                Mit der getroffenen Auswahl gibt es keine Wettkämpfe.
              </td>
            </tr>

            <CompetitionRow
              v-for="competition in competitionsOfYear"
              :key="competition.id"
              :competition="competition"
            />
          </tbody>
        </table>
      </div>
      <div class="column">
        <ClientOnly>
          <div style="height: 100vh; width: 100%">
            <l-map
              :use-global-leaflet="false"
              v-model:zoom="zoom"
              :center="center"
            >
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              ></l-tile-layer>
              <CompetitionPopup
                v-for="competition in filteredCompetitions.filter(
                  ({ location: { coordinates } }) => coordinates,
                )"
                :competition="competition"
              />
            </l-map>
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>

  <footer class="footer mt-6">
    <div class="content has-text-centered">
      <p>
        Hast du Fragen zum Kalender? Oder weißt von Wettkämpfen die hier noch
        fehlen?<br />
        Melde dich bitte bei <strong>Stefan</strong>:
        <a href="tel:004916097048114">📞 0160 970 48 114</a>&nbsp;
        <a href="mailto:stefan@mathe.is">✉️ stefan@mathe.is</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
footer a {
  white-space: nowrap;
}
</style>

<style>
.leaflet-popup-content {
  min-width: 200px;
  line-height: initial;
  font-size: initial;
}
</style>

<script setup>
import { differenceInDays, parseISO as parseIsoDate } from "date-fns";

const displayPastCompetitions = ref(false);
const competitionFilter = ref({
  FCC: true,
  FSR: true,
});
const kind = {
  FCC: {
    title: "Firefighter Combat Challenge",
    type: "is-warning is-light",
  },
  FSR: {
    title: "Firefighter Stair Run",
    type: "is-info is-light",
  },
};

const getDateFromDate = (date) => date.toISOString().substring(0, 10);

const isPast = (competition) =>
  getDateFromDate(new Date()) > getDateFromDate(new Date(competition.date.end));

const { data: competitions, error: competitionsError } =
  await useFetch("/competitions.json");

const filteredCompetitions = computed(() => {
  let filteredCompetitions = competitions.value || [];
  if (!displayPastCompetitions.value) {
    filteredCompetitions = filteredCompetitions.filter(
      (competition) => !isPast(competition),
    );
  }

  if (!competitionFilter.value.FSR) {
    filteredCompetitions = filteredCompetitions.filter(
      ({ kind }) => kind != "FSR",
    );
  }

  if (!competitionFilter.value.FCC) {
    filteredCompetitions = filteredCompetitions.filter(
      ({ kind }) => kind != "FCC",
    );
  }

  filteredCompetitions = filteredCompetitions.map((competition) => {
    return {
      ...competition,
      has_registration_pending:
        competition.date.registration_opens &&
        new Date().toISOString().split("T")[0] <=
          new Date(competition.date.registration_opens)
            .toISOString()
            .split("T")[0],
      has_registration_open:
        new Date().toISOString().split("T")[0] >=
        new Date(competition.date.registration_opens)
          .toISOString()
          .split("T")[0],
    };
  });

  return filteredCompetitions;
});

const getYear = (competition) => new Date(competition.date.start).getFullYear();

const years = computed(() => [
  ...new Set(filteredCompetitions.value.map(getYear)),
]);

const selectedYear = ref(null);
const activeYear = computed(() =>
  years.value.includes(selectedYear.value)
    ? selectedYear.value
    : years.value[0],
);

const competitionsOfYear = computed(() =>
  filteredCompetitions.value.filter(
    (competition) => getYear(competition) == activeYear.value,
  ),
);

const upcomingRegistrations = computed(() => {
  return filteredCompetitions.value.filter(
    ({ date: { registration_opens } }) => {
      if (!registration_opens) {
        return false;
      }
      const diffDays = differenceInDays(
        parseIsoDate(registration_opens),
        new Date(),
      );
      return diffDays >= 0 && diffDays < 7 * 4;
    },
  );
});

const calendarPath = computed(
  () =>
    Object.keys(kind)
      .filter((kind) => competitionFilter.value[kind])
      .join("-")
      .toLowerCase() + ".ics",
);

useHead({
  title: "Feuerwehr Wettkämpfe",
  meta: [
    {
      name: "description",
      content: "Alle Termine deutschlandweit & darüber hinaus.",
    },
    {
      property: "og:image",
      content:
        "https://firefighter-competitions.vercel.app/firefighter-competitions.jpg",
    },
  ],
});

import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

const zoom = ref(5);
const center = ref([47.3749871, 10.270242]);
const activeNavbar = ref(false);
const activeModal = ref(false);
</script>
