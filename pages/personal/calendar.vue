<template>
  <div class="container is-max-desktop">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/"> 👨‍🚒 </a>
      </div>
    </nav>

    <p class="title is-3 has-text-centered">{{ name }}</p>

    <div class="tabs is-fullwidth">
      <ul>
        <li>
          <NuxtLink
            :to="{
              name: 'personal-results',
              params: { name, year: new Date().getFullYear() },
            }"
            >🥇️ Persönliche Bestzeiten</NuxtLink
          >
        </li>
        <li class="is-active">
          <a>📅 Persönlicher Kalender</a>
        </li>
      </ul>
    </div>

    <PersonalCalendar :name="name"></PersonalCalendar>
  </div>

  <footer class="footer mt-6">
    <div class="content has-text-centered">
      <div class="container is-max-desktop">
        <div class="columns">
          <div class="column">
            <div>
              <p>Du möchtest deinen eigenen Kalender sehen?</p>
              <form @submit.prevent="handleForm">
                <div class="field">
                  <p class="control is-expanded">
                    <input
                      v-model="custom_name"
                      class="input"
                      placeholder="Vollständiger Name"
                    />
                  </p>
                  <p class="control">
                    <button class="button is-fullwidth is-info">
                      Meinen Persönlichen Kalender anzeigen
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
          <div class="column">
            <p>
              Hast du Fragen zu den Ergebnissen? Oder weißt von Wettkämpfen die
              hier noch fehlen?<br />
              Melde dich bitte bei <strong>Stefan</strong>:
              <a href="tel:004916097048114">📞 0160 970 48 114</a>&nbsp;
              <a href="mailto:stefan@mathe.is">✉️ stefan@mathe.is</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
definePageMeta({
  path: "/persoenlicher-kalender/:name",
});

const { name: route_name, params } = useRoute();
const { name } = params;

const custom_name = ref("");
const handleForm = async (event) => {
  await navigateTo({
    name: route_name,
    params: { ...params, name: custom_name.value },
  });
};

useSeoMeta({
  title: "Persönlicher Kalender (" + name + ")",
});
</script>
