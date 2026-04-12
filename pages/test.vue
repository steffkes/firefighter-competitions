<template>
  <div class="container">
    <ClientOnly>
      <div style="height: 100vh; width: 100%">
        <l-map :use-global-leaflet="false" v-model:zoom="zoom" :center="center">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          ></l-tile-layer>

          <l-marker
            :lat-lng="[47.72015628181953, 10.311698913574219]"
            draggable
            @moveend="console.log"
          >
            <l-tooltip> lol </l-tooltip>
          </l-marker>

          <l-marker v-for="item in data" :lat-lng="item.latlng">
            <l-tooltip>
              {{ item.label }}
            </l-tooltip>
          </l-marker>
        </l-map>
      </div>
    </ClientOnly>
  </div>
</template>

<style>
.leaflet-popup-content {
  min-width: 200px;
  line-height: initial;
  font-size: initial;
}
</style>

<script setup>
import { LMap, LMarker, LTooltip, LTileLayer } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

const zoom = ref(5);
const center = ref([47.3749871, 10.270242]);
const activeNavbar = ref(false);
const activeModal = ref(false);

const log = (a) => {
  console.log(a);
};

const data = [
  {
    latlng: [47.72015628181953, 10.311698913574219],
    label: "Kempten (Allgäu)",
  },
  {
    latlng: [48.229246955743626, 9.872589111328127],
    label: "Laupheim",
  },
  {
    latlng: [48.157876, 11.4533243],
    label: "München Pasing",
  },
  {
    latlng: [50.8281039, 12.0926954],
    label: "Gera Liebschwitz",
  },
];
</script>
