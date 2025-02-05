<template>
  <nav class="pagination is-small is-centered" role="navigation">
    <ul class="pagination-list">
      <li v-for="i in [2022, 2023, 2024, 2025]">
        <NuxtLink
          :to="{
            name: route_name,
            params: { ...params, year: i },
          }"
          class="pagination-link"
          :class="{ 'is-current': i == params.year }"
          >{{ i }}</NuxtLink
        >
      </li>
    </ul>
  </nav>
</template>

<script setup>
defineProps(["route_name", "params"]);
</script>
