<template>
  <l-marker
    :id="competition.id"
    :lat-lng="[
      competition.location.coordinates.lat,
      competition.location.coordinates.lng,
    ]"
  >
    <l-popup>
      <div
        class="competition-popup"
        :class="{
          'has-text-grey-light': competition.date.is_draft,
          'is-canceled': competition.date.is_canceled,
        }"
      >
        <div class="competition-popup-date">
          <CompetitionDate :competition="competition" />
        </div>
        <div>
          <CompetitionName :competition="competition" />
          <CompetitionStatus :competition="competition" />
        </div>
      </div>
    </l-popup>
  </l-marker>
</template>

<style scoped>
.competition-popup {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.competition-popup-date {
  flex-shrink: 0;
  width: min-content;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.competition-popup-date :deep(span) {
  white-space: nowrap;
}
.is-canceled :deep(.competition-name) {
  text-decoration: line-through;
}
</style>

<script setup>
defineProps(["competition"]);

import { LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
</script>
