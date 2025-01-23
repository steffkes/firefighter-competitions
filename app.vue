<template>
  <NuxtPage />
</template>

<script setup>
useHead({
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  script: [
    {
      src: "https://plausible.io/js/script.js",
      "data-domain": "firefighter-competitions.vercel.app",
      defer: true,
    },
  ],
});
</script>
