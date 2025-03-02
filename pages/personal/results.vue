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
        <li class="is-active"><a>🥇️ Persönliche Bestzeiten</a></li>
        <li>
          <NuxtLink
            :to="{
              name: 'personal-calendar',
              params: { name },
            }"
            >📅 Persönlicher Kalender</NuxtLink
          >
        </li>
      </ul>
    </div>

    <PersonalResultsNavigation
      :route_name="route_name"
      :params="params"
    ></PersonalResultsNavigation>

    <PersonalResults :name="name" :year="year"></PersonalResults>

    <PersonalResultsNavigation
      :route_name="route_name"
      :params="params"
    ></PersonalResultsNavigation>
  </div>

  <footer class="footer mt-6">
    <div class="content has-text-centered">
      <div class="container is-max-desktop">
        <div class="columns">
          <div class="column">
            <div>
              <p>Du möchtest deine eigenen Ergebnisse sehen?</p>
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
                      Meine Persönlichen Ergebnisse anzeigen
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
  path: "/persoenliche-bestzeiten/:name/:year",
});

const { name: route_name, params } = useRoute();
const { name, year } = params;

const custom_name = ref("");
const handleForm = async (event) => {
  await navigateTo({
    name: route_name,
    params: { ...params, name: custom_name.value },
  });
};

useSeoMeta({
  title: "Persönliche Bestzeiten (" + name + " @ " + year + ")",
});
</script>
