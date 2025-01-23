<template>
  <div class="container is-max-desktop">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/"> 👨‍🚒 </a>
      </div>
    </nav>

    <p class="title is-3 has-text-centered">Persönlicher Kalender</p>
    <p class="subtitle is-5 has-text-centered">{{ name }}</p>

    <PersonalCalendar :name="name"></PersonalCalendar>

    <p>
      <NuxtLink
        :to="{
          name: 'persoenliche-bestzeiten-name-year',
          params: { name, year: new Date().getFullYear() },
        }"
        >Persönliche Bestzeiten von {{ name }}</NuxtLink
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

<script setup>
const {
  params: { name },
} = useRoute();

useSeoMeta({
  title: "Persönlicher Kalender (" + name + ")",
});
</script>
