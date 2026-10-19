<template>
  <a
    v-if="competition.url"
    class="competition-name is-block has-text-weight-semibold"
    :href="competition.url"
    >{{ competition.name }}</a
  >
  <span v-else class="competition-name is-block has-text-weight-semibold">{{
    competition.name
  }}</span>
</template>

<script setup>
defineProps(["competition"]);
</script>
