<template>
  <!-- isolate keeps leaflet's z-indexes from covering modals -->
  <div style="height: 100%; width: 100%; isolation: isolate">
    <l-map :use-global-leaflet="false" v-model:zoom="zoom" :center="center">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      ></l-tile-layer>
      <CompetitionPopup
        v-for="competition in competitions.filter(
          ({ location: { coordinates } }) => coordinates,
        )"
        :key="competition.id"
        :competition="competition"
      />
    </l-map>
  </div>
</template>

<script setup>
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

defineProps(["competitions"]);

const zoom = ref(5);
const center = ref([47.3749871, 10.270242]);
</script>

<style>
.leaflet-popup-content {
  min-width: 200px;
  line-height: initial;
  font-size: initial;
}
</style>
