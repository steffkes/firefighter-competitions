<template>
  <div class="modal is-active" @keydown.esc="$emit('close')">
    <div class="modal-background" @click="$emit('close')"></div>
    <div class="modal-card" role="dialog" :aria-label="competition.name">
      <header class="modal-card-head">
        <p class="modal-card-title is-size-5">{{ competition.name }}</p>
        <button
          class="delete"
          aria-label="Schließen"
          @click="$emit('close')"
        ></button>
      </header>
      <section class="modal-card-body">
        <table class="table is-fullwidth is-narrow mb-0">
          <tbody>
            <tr>
              <th>Datum</th>
              <td>{{ dateText }}</td>
            </tr>
            <tr>
              <th>Ort</th>
              <td>
                {{ flag(competition.location.country_code) }}
                {{ competition.location.city }}
              </td>
            </tr>
            <tr>
              <th>Anmeldung</th>
              <td>{{ registrationText }}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <footer class="modal-card-foot buttons">
        <a
          v-if="competition.url"
          class="button is-link is-fullwidth"
          :href="competition.url"
          >Zur Website des Veranstalters</a
        >
        <button class="button is-fullwidth" @click="share">
          {{ shared ? "Link kopiert" : "Teilen" }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
th {
  width: 7rem;
}
.modal-card-foot.buttons {
  flex-direction: column;
}
.modal-card-foot.buttons .button {
  margin-left: 0;
  margin-right: 0;
}
@media screen and (max-width: 768px) {
  .modal {
    justify-content: flex-end;
  }
  .modal-card {
    width: 100%;
    margin: 0;
    max-height: calc(100vh - 3rem);
  }
  .modal-card-foot {
    border-radius: 0;
  }
}
</style>

<script setup>
const { competition } = defineProps(["competition"]);
defineEmits(["close"]);

const longDate = (value) =>
  new Date(value.substring(0, 10) + "T00:00:00Z").toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

const dateText = computed(() => {
  const { start, end } = competition.date;
  return start.substring(0, 10) == end.substring(0, 10)
    ? longDate(start)
    : longDate(start) + " – " + longDate(end);
});

const today = () => new Date().toISOString().substring(0, 10);

const registrationText = computed(() => {
  const { registration_opens, is_canceled } = competition.date;
  const count = competition.participants?.count;
  if (is_canceled) return "Der Wettkampf wurde abgesagt";
  if (registration_opens && registration_opens.substring(0, 10) > today())
    return "öffnet am " + longDate(registration_opens);
  if (registration_opens)
    return "Offen" + (count ? ", " + count + " angemeldet" : "");
  return "Siehe Website des Veranstalters";
});

const flag = (countryCode) =>
  (countryCode || "")
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));

const shared = ref(false);
const share = async () => {
  const url = location.origin + location.pathname + "#" + competition.id;
  try {
    if (navigator.share) {
      await navigator.share({ title: competition.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      shared.value = true;
    }
  } catch {
    // the share sheet was closed, nothing to do
  }
};
</script>
