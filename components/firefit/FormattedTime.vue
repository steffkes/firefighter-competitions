<template>
  <time class="tag" :time="rawTime" v-html="formattedTime" />
</template>

<style scoped>
time {
  font-variant-numeric: tabular-nums;
}

time :deep(span) {
  font-size: 0.6rem;
}
</style>

<script setup>
const { time: rawTime } = defineProps(["time"]);

const formattedTime = computed(() =>
  rawTime.replace(/\d+:(\d+):(\d+)\.(\d+)/, "$1:$2<span>.$3</span>"),
);
</script>
