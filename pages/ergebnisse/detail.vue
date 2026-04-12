<template>
  <div>
    <p>Ergebnisse/detail</p>
    <pre>competition: {{ competition }}</pre>
  </div>
</template>

<script setup>
definePageMeta({
  path: "/ergebnisse/:date(\\d{6})-:location-:competition_id(rec\\w+)",
  validate: async ({ params: { competition_id } }) => {
    const { data: competitions } = await useFetch("/api/competitions");
    return (
      competitions.value.filter(({ id }) => competition_id == id).length == 1
    );
  },
});

const route = useRoute();
const {
  params: { competition_id },
} = route;

const { data: competitions } = await useFetch("/api/competitions");
const competition = computed(
  () => competitions.value.filter(({ id }) => competition_id == id)[0],
);
</script>
