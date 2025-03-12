<template>
  <div class="container is-max-tablet">
    <div v-for="([p1, p2], index) in pairs" class="columns is-mobile my-1">
      <FirefitParticipantElement
        :participant="p1"
        :class="'has-background-warning' + (active != index ? '-light' : '')"
        :active="active == index"
        @click="active = index"
      ></FirefitParticipantElement>
      <FirefitParticipantElement
        :participant="p2"
        :class="'has-background-danger' + (active != index ? '-light' : '')"
        :active="active == index"
        @click="active = index"
      ></FirefitParticipantElement>
    </div>
  </div>
</template>

<style>
html {
  font-size: 13px;
}
</style>

<script setup>
const { data: pairs } = await useFetch("/api/firefit/runs");

const active = ref(0);
</script>
