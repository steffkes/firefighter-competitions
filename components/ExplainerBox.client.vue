<template>
  <div ref="root" class="dropdown is-right" :class="{ 'is-active': open }">
    <div class="dropdown-trigger">
      <button
        class="button is-info is-light is-small"
        aria-haspopup="true"
        aria-controls="explainer-box"
        :aria-expanded="open"
        @click="open = !open"
      >
        ℹ️ Info
      </button>
    </div>
    <div id="explainer-box" class="dropdown-menu" role="dialog">
      <div class="dropdown-content message is-info">
        <div class="message-body">
          <p>
            Damit ihr euch zurecht findet, eine kurze Erklärung was hier was
            ist:
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
                  <b>F</b>irefighter <b>S</b>tair <b>R</b>un /
                  Feuerwehr-Treppenlauf
                </td>
              </tr>
              <tr>
                <td class="exp">
                  <span :title="kind.FCC.title" :class="['tag', kind.FCC.type]"
                    >FCC</span
                  >
                </td>
                <td>
                  <b>F</b>irefighter <b>C</b>ombat <b>C</b>hallenge (oder
                  ähnlicher Wettkampf)
                </td>
              </tr>
              <tr>
                <td class="exp">
                  <span class="tag">
                    {{ flag("DE") }}
                    Musterhausen</span
                  >
                </td>
                <td>Ort und Land des Wettkampfes</td>
              </tr>
              <tr>
                <td class="exp">
                  <span class="tag is-dark">
                    ⏰ {{ formatDate(new Date()) }}
                  </span>
                </td>
                <td>Datum zu dem die Anmeldung öffnet</td>
              </tr>
              <tr>
                <td class="exp"><span class="tag">👨‍🚒 42</span></td>
                <td>Bislang angemeldete Teilnehmer</td>
              </tr>
              <tr>
                <td class="exp"><span class="tag is-link">🤚 42</span></td>
                <td>Offene Gesuche für eine/n Laufpartner/in</td>
              </tr>

              <tr>
                <td class="exp">❌</td>
                <td>Dieser Wettkampf wurde abgesagt</td>
              </tr>

              <tr>
                <td class="exp">❓</td>
                <td>Der Termin dieses Wettkampfes ist noch nicht endgültig</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-menu {
  width: min(28rem, calc(100vw - 2rem));
}
.dropdown-content {
  padding: 0;
}
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
    type: "is-warning is-light",
  },
  FSR: {
    title: "Firefighter Stair Run",
    type: "is-info is-light",
  },
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("de-DE", {
    weekday: "short",
    month: "2-digit",
    day: "2-digit",
  });

const flag = (countryCode) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));

const open = ref(false);
const root = ref(null);

const close = (event) => {
  if (
    event.type == "keydown"
      ? event.key == "Escape"
      : !root.value?.contains(event.target)
  ) {
    open.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", close);
  document.addEventListener("keydown", close);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", close);
  document.removeEventListener("keydown", close);
});
</script>
