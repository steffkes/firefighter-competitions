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
        <CompetitionDateBlock
          :start="competition.date.start"
          :end="competition.date.end"
        />
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
.competition-popup :deep(.date-block) {
  flex-shrink: 0;
  margin: 0;
}
.is-canceled :deep(.competition-name) {
  text-decoration: line-through;
}
</style>

<script setup>
defineProps(["competition"]);

import { LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
</script>
