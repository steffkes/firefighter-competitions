<template>
  <div
    v-if="headline || parts.length"
    class="registration is-size-7"
    :title="status?.details"
  >
    <strong v-if="headline" class="headline" :class="headline.color">{{
      headline.text
    }}</strong>
    <span v-if="parts.length" class="parts"
      ><template v-for="(part, index) in parts" :key="index"
        ><template v-if="index && !parts[index - 1].tag"> · </template
        ><span :class="part.tag ? ['tag', part.tag, 'mr-1'] : part.color">{{
          part.text
        }}</span></template
      ></span
    >
  </div>
</template>

<style scoped>
.registration {
  color: hsl(0, 0%, 29%);
}
.registration > * {
  white-space: nowrap;
}
/* on one line (popups, upcoming box), separate the two halves */
.headline + .parts::before {
  content: " · ";
}
.registration[title] {
  cursor: help;
}
.is-soon {
  color: hsl(217, 71%, 45%);
}
.is-open {
  color: hsl(153, 53%, 33%);
}
.tag {
  height: 1.5em;
  font-size: inherit;
  vertical-align: baseline;
}
.tag.is-success {
  background-color: hsl(153, 53%, 90%);
  color: hsl(153, 53%, 25%);
}
.tag.is-warning {
  background-color: hsl(36, 100%, 85%);
  color: hsl(30, 90%, 28%);
}
.is-few {
  color: hsl(30, 90%, 38%);
}
.is-closed {
  color: hsl(348, 86%, 43%);
}
</style>

<script setup>
import { formatDate } from "../util";
import { registrationStatus } from "../registration";

const props = defineProps({
  competition: { type: Object, required: true },
  withOpening: { type: Boolean, default: true },
});

const status = computed(() => registrationStatus(props.competition));

const headline = computed(() => {
  const { kind } = status.value || {};
  if (kind === "soon" && props.withOpening) {
    return { text: "Anmeldung ab", color: "is-soon" };
  }
  if (kind === "closed") return { text: "Anmeldung zu", color: "is-closed" };
  if (kind === "open") return { text: "Anmeldung offen", color: "is-open" };
  if (kind === "few") return { text: "Anmeldung offen", color: "is-few" };
  return null;
});

const parts = computed(() => {
  const { kind, left, opens } = status.value || {};
  const count = props.competition.participants?.count;
  return [
    kind === "soon" &&
      props.withOpening && { text: formatDate(opens), color: "is-soon" },
    kind === "few" && { text: `nur ${left} frei`, tag: "is-warning" },
    kind === "open" && left && { text: `${left} frei`, tag: "is-success" },
    count && { text: `${count} angemeldet` },
  ].filter(Boolean);
});
</script>
