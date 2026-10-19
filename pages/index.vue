<template>
  <div class="modal" :class="{ 'is-active': activeModal }">
    <div class="modal-background" @click="activeModal = false"></div>
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
    <div class="columns is-gapless mb-0">
      <div class="column page-list">
        <header class="px-4 pt-4">
          <div class="page-header mb-1">
            <h1 class="title is-4 mb-0">Feuerwehr-Wettkämpfe</h1>
            <div class="page-header-links">
              <a
                href="//www.instagram.com/firefighter_competitions"
                class="button is-white px-2"
                aria-label="Instagram"
              >
                <img src="/instagram.svg" alt="" width="22" height="22" />
              </a>
              <a
                href="//whatsapp.com/channel/0029VbC7AG5CnA7orIZ6Xc0p"
                class="button is-white px-2"
                aria-label="WhatsApp-Kanal"
              >
                <img src="/whatsapp.svg" alt="" width="22" height="22" />
              </a>
              <button
                class="button is-white px-2 is-hidden-desktop"
                aria-label="QR-Code zeigen"
                @click="activeModal = true"
              >
                <img
                  src="/qr-code.svg"
                  alt=""
                  width="22"
                  height="22"
                  style="opacity: 0.3"
                />
              </button>
            </div>
          </div>
          <p class="subtitle is-6 has-text-grey">
            Alle Treppenläufe und Combat Challenges für Feuerwehrleute, in
            Deutschland und darüber hinaus.
          </p>
        </header>

        <div class="filter-bar px-4">
          <div class="tabs mb-0">
            <ul>
              <li
                v-for="option in kindOptions"
                :key="option.key"
                :class="{ 'is-active': kindFilter == option.key }"
              >
                <a
                  :href="'#' + option.key"
                  @click.prevent="kindFilter = option.key"
                  ><span class="is-hidden-mobile">{{ option.label }}</span
                  ><span class="is-hidden-tablet">{{
                    option.shortLabel || option.label
                  }}</span></a
                >
              </li>
            </ul>
          </div>
          <button
            class="button is-white is-hidden-tablet"
            aria-label="Karte"
            @click="showMap = true"
          >
            <span class="icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" />
                <path d="M9 4v14M15 6v14" />
              </svg>
            </span>
          </button>
        </div>

        <div class="px-4 pt-4">
          <div v-if="competitionsError" class="notification is-danger is-light">
            <p class="has-text-weight-bold">
              Die Wettkampftermine können gerade nicht geladen werden.
            </p>
            <p>
              Bitte versuche es später noch einmal. Wenn das Problem bleibt,
              melde dich gerne (Kontakt ganz unten).
            </p>
          </div>

          <article
            v-if="upcomingRegistrations.length"
            class="message is-warning mb-5"
          >
            <div class="message-header">
              <p>Anmeldung öffnet bald</p>
            </div>
            <div class="message-body px-3 py-2">
              <p class="is-size-7 mb-1">
                Das Datum links zeigt, wann die Anmeldung öffnet.
              </p>
              <table class="table is-fullwidth mb-0 soon-table">
                <tbody>
                  <tr
                    v-for="competition in upcomingRegistrations"
                    :key="competition.id"
                  >
                    <td class="date-cell">
                      <FormattedDate
                        :date="competition.date.registration_opens"
                      />
                    </td>
                    <td>
                      <CompetitionName :competition="competition" />
                      <CompetitionStatus :competition="competition" with-date />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <template v-if="!competitionsError">
            <section v-for="group in months" :key="group.key" class="mb-4">
              <h2 class="title is-5 mb-2">
                {{ group.month }}
                <span class="has-text-grey-light">{{ group.year }}</span>
              </h2>
              <table class="table is-fullwidth is-striped is-hoverable mb-0">
                <tbody>
                  <CompetitionRow
                    v-for="competition in group.competitions"
                    :key="competition.id"
                    :competition="competition"
                  />
                </tbody>
              </table>
            </section>

            <p v-if="!months.length" class="has-text-grey py-5">
              Mit dieser Auswahl gibt es keine Wettkämpfe.
            </p>
          </template>
        </div>

        <footer class="footer page-footer mt-5 mx-4 mb-4 px-4 py-5">
          <div class="content has-text-centered">
            <div class="mb-2">
              <ExplainerBox />
            </div>
            <p>
              Hast du Fragen zum Kalender? Oder weißt von Wettkämpfen die hier
              noch fehlen?<br />
              Melde dich bitte bei <strong>Stefan</strong>:
              <a href="tel:004916097048114">📞 0160 970 48 114</a>&nbsp;
              <a href="mailto:stefan@mathe.is">✉️ stefan@mathe.is</a>
            </p>
          </div>
        </footer>
      </div>

      <div class="column is-hidden-mobile page-map">
        <CompetitionMap :competitions="filteredCompetitions" />
      </div>
    </div>
  </div>

  <div v-if="showMap" class="modal is-active">
    <div class="modal-card map-card">
      <header class="modal-card-head py-3 px-4">
        <p class="modal-card-title is-size-5">Karte · {{ kindLabel }}</p>
        <button
          class="delete is-medium"
          aria-label="Zur Liste"
          @click="showMap = false"
        ></button>
      </header>
      <section class="modal-card-body p-0">
        <CompetitionMap :competitions="filteredCompetitions" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.page-header .title {
  flex: 1;
  min-width: 0;
}
.page-header-links {
  display: flex;
  flex-shrink: 0;
}
.soon-link {
  text-decoration: none;
}
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 5;
  background: #fff;
  display: flex;
  align-items: flex-end;
  gap: 0.25rem;
}
.filter-bar .tabs {
  flex: 1;
}
.filter-bar .button {
  margin-bottom: 0.25rem;
}
.page-footer {
  border-radius: 6px;
}
.message-body .table {
  background: transparent;
}
.soon-table td {
  vertical-align: middle;
}
.soon-table .date-cell {
  width: 9.5rem;
  white-space: nowrap;
  text-align: right;
}
.map-card {
  width: 100%;
  height: 100%;
  max-height: none;
  margin: 0;
}
.map-card .modal-card-head {
  border-radius: 0;
}
@media screen and (min-width: 769px) {
  .page-map {
    position: sticky;
    top: 0;
    height: 100vh;
  }
}
</style>

<script setup>
const kindOptions = [
  { key: "all", label: "Alle" },
  { key: "FSR", label: "Treppenläufe" },
  { key: "FCC", label: "Combat Challenges", shortLabel: "Challenges" },
];
const kindFilter = ref("all");
const kindLabel = computed(
  () => kindOptions.find(({ key }) => key == kindFilter.value).label,
);

const showMap = ref(false);
const activeModal = ref(false);

const today = () => new Date().toISOString().substring(0, 10);

const isPast = (competition) =>
  today() > new Date(competition.date.end).toISOString().substring(0, 10);

const { data: competitions, error: competitionsError } =
  await useFetch("/competitions.json");

// ties are broken by name so server and browser render the same order;
// a comparator that never returns 0 lets each JS engine order ties its own
// way, which re-sorts the list during hydration
const compare = (x, y) => (x < y ? -1 : x > y ? 1 : 0);
const compareBy = (a, b, key) =>
  compare(key(a), key(b)) || compare(a.name, b.name) || compare(a.kind, b.kind);

const filteredCompetitions = computed(() =>
  (competitions.value || [])
    .filter((competition) => !isPast(competition))
    .filter(({ kind }) => kindFilter.value == "all" || kind == kindFilter.value)
    .sort((a, b) => compareBy(a, b, (c) => c.date.start)),
);

const monthName = (date) =>
  new Date(date.substring(0, 10) + "T00:00:00Z").toLocaleDateString("de-DE", {
    month: "long",
    timeZone: "UTC",
  });

const months = computed(() => {
  const groups = [];
  for (const competition of filteredCompetitions.value) {
    const key = competition.date.start.substring(0, 7);
    let group = groups.find((group) => group.key == key);
    if (!group) {
      group = {
        key,
        month: monthName(competition.date.start),
        year: competition.date.start.substring(0, 4),
        competitions: [],
      };
      groups.push(group);
    }
    group.competitions.push(competition);
  }
  return groups;
});

const upcomingRegistrations = computed(() =>
  filteredCompetitions.value
    .filter(({ date: { registration_opens, is_canceled } }) => {
      if (!registration_opens || is_canceled) return false;
      const opens = new Date(registration_opens.substring(0, 10));
      const days = (opens - new Date(today())) / (1000 * 60 * 60 * 24);
      return days >= 0 && days < 7 * 4;
    })
    .sort((a, b) => compareBy(a, b, (c) => c.date.registration_opens)),
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
</script>
