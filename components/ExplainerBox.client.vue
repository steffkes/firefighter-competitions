<template>
  <article
    class="message is-info"
    :class="{
      'is-hidden': !state,
    }"
  >
    <div class="message-header">
      <p>Info</p>
      <button @click="remove" class="delete" aria-label="delete"></button>
    </div>
    <div class="message-body">
      <p>
        Damit ihr euch zurecht findet, eine kurze Erklärung was hier was ist:
      </p>

      <table class="table mt-3" style="background-color: transparent">
        <tbody>
          <tr>
            <td class="exp">
              <span
                :title="kind['FSR'].title"
                :class="['tag', kind['FSR'].type]"
                >FSR</span
              >
            </td>
            <td>
              <b>F</b>irefighter <b>S</b>tair <b>R</b>un / Feuerwehr-Treppenlauf
            </td>
          </tr>
          <tr>
            <td class="exp">
              <span :title="kind.FCC.title" :class="['tag', kind.FCC.type]"
                >FCC</span
              >
            </td>
            <td>
              <b>F</b>irefighter <b>C</b>ombat <b>C</b>hallenge (oder ähmlicher
              Wettkampf)
            </td>
          </tr>
          <tr>
            <td class="exp">
              <span class="tag">
                {{ flag("DE") }}
                Musterhausen</span
              >
            </td>
            <td>Ort bzw. Land der Veranstaltung</td>
          </tr>
          <tr>
            <td class="exp">
              <span class="tag is-dark"> ⏰ {{ formatDate(new Date()) }} </span>
            </td>
            <td>Datum zu dem die Anmeldung öffnet</td>
          </tr>
          <tr>
            <td class="exp"><span class="tag">👨‍🚒 42</span></td>
            <td>Bislang angemeldete Teilnehmer</td>
          </tr>

          <tr>
            <td class="exp">❌</td>
            <td>Diese Veranstaltung wurde abgesagt</td>
          </tr>

          <tr>
            <td class="exp">❓</td>
            <td>Der Termin dieser Veranstaltung ist noch nicht endgültig</td>
          </tr>
        </tbody>
      </table>

      <p class="has-text-right">
        <button @click="remove" class="button is-info">
          Nicht mehr anzeigen
        </button>
      </p>
    </div>
  </article>
</template>

<style scoped>
table {
  color: inherit;
}
table .exp {
  text-align: right !important;
}
</style>

<script setup>
const kind = {
  FCC: {
    title: "Firefighter Combat Challenge",
    type: "is-warning",
  },
  FSR: {
    title: "Firefighter Stair Run",
    type: "is-info",
  },
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("de-DE", {
    weekday: "short",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });

const flag = (countryCode) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));

const state = ref(
  JSON.parse(localStorage.getItem("explainerBox/state")) ?? true
);
const remove = () => {
  localStorage.setItem("explainerBox/state", false);
  state.value = false;
};
</script>
