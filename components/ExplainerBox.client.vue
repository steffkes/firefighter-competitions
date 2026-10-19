<template>
  <button class="button is-text is-small px-0" @click="open = true">
    Was bedeutet was?
  </button>

  <div v-if="open" class="modal is-active" @keydown.esc="open = false">
    <div class="modal-background" @click="open = false"></div>
    <div
      class="modal-card has-text-left"
      role="dialog"
      aria-label="Was bedeutet was?"
    >
      <header class="modal-card-head">
        <p class="modal-card-title is-size-5">Was bedeutet was?</p>
        <button
          class="delete"
          aria-label="Schließen"
          @click="open = false"
        ></button>
      </header>
      <section class="modal-card-body has-text-left">
        <table class="table is-fullwidth is-narrow mb-3">
          <tbody>
            <tr>
              <td>
                <span class="tag is-success is-light">Anmeldung offen</span>
              </td>
              <td>Du kannst dich jetzt anmelden</td>
            </tr>
            <tr>
              <td><span class="tag is-success is-light">👨‍🚒 42</span></td>
              <td>Bislang angemeldete Teilnehmer</td>
            </tr>
            <tr>
              <td><span class="tag is-link">🤚 42</span></td>
              <td>Offene Gesuche für eine/n Laufpartner/in</td>
            </tr>
            <tr>
              <td><span class="tag is-light">Termin vorläufig</span></td>
              <td>Der Termin ist noch nicht endgültig</td>
            </tr>
            <tr>
              <td><span class="tag is-danger is-light">Abgesagt</span></td>
              <td>Der Wettkampf findet nicht statt</td>
            </tr>
          </tbody>
        </table>
        <p class="is-size-7 has-text-grey">
          Treppenläufe sind Firefighter Stair Runs (FSR), Challenges sind
          Firefighter Combat Challenges (FCC) oder ähnliche Wettkämpfe.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
td {
  vertical-align: middle;
}
</style>

<script setup>
const open = ref(false);
</script>
