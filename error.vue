<template>
  <section class="section">
    <div class="container content">
      <h1 class="title">👨‍🚒 {{ title }}</h1>
      <p>{{ message }}</p>
      <p>
        <button class="button is-link is-light" @click="handleError">
          Zur Startseite
        </button>
      </p>
      <p class="has-text-grey is-size-7">Fehlercode {{ error.statusCode }}</p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({ error: Object });

const title = computed(() => {
  if (props.error.statusCode === 404) {
    return "Seite nicht gefunden";
  }
  if (props.error.statusCode === 503) {
    return "Gerade nicht verfügbar";
  }
  return "Da ist etwas schiefgelaufen";
});

const message = computed(() => {
  if (props.error.statusCode === 404) {
    return "Diese Seite gibt es leider nicht.";
  }
  return "Die Seite kann gerade nicht angezeigt werden. Bitte versuche es später noch einmal.";
});

const handleError = () => clearError({ redirect: "/" });

useHead({ title: "Feuerwehr Wettkämpfe" });
</script>
