<template>
  <div>
    <div v-for="[p1, p2] in pairs" class="columns is-mobile my-1">
      <FirefitParticipantElement
        :participant="p1"
        class="has-background-warning"
      ></FirefitParticipantElement>
      <FirefitParticipantElement
        :participant="p2"
        class="has-background-danger-light"
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
const pairs = [
  [
    {
      name: "Till Schmidt",
      gender: "male",
      country: "DE",
      team: "Firesports Basaltbrecher",
      result: {
        status: "OK",
        time: "00:01:57.80",
        penalty: null,
      },
      previousResults: [
        {
          competitionId: "recEY5SuiOFvtcF24",
          time: "00:02:05.9",
          ranks: [
            { type: "category", rank: 20, label: "M individual" },
            { type: "age_group", rank: 10, label: "over 30" },
          ],
        },
        {
          competitionId: "rec5N3iDX27EQsEF4",
          time: "00:02:16.5",
          ranks: [
            { type: "category", rank: 43, label: "M individual" },
            { type: "age_group", rank: 22, label: "over 30" },
          ],
        },
        {
          competitionId: "recLoyMFpbemMbfvi",
          time: "00:01:57.2",
          ranks: [
            { type: "category", rank: 36, label: "M individual" },
            { type: "age_group", rank: 21, label: "over 30" },
          ],
        },
        {
          competitionId: "recN4o1TpaciUpXE5",
          time: "00:01:55.6",
          ranks: [
            { type: "category", rank: 18, label: "M individual" },
            { type: "age_group", rank: 9, label: "over 30" },
          ],
        },
        {
          competitionId: "recqYhG0KpSxOiq0G",
          time: "00:01:52.6",
          ranks: [
            { type: "category", rank: 21, label: "M individual" },
            { type: "age_group", rank: 10, label: "over 30" },
          ],
        },
      ],
    },
    {
      name: "Frieder Schulz",
      gender: "male",
      country: "DE",
      team: "HanseFighters - Feuerwehr Bremen",
      result: {
        status: "OK",
        time: "00:01:57.80",
        penalty: null,
      },
      previousResults: [
        {
          competitionId: "recfbLmSUmkXDLptv",
          time: "00:02:18.0",
          ranks: [
            { type: "category", rank: 49, label: "M individual" },
            { type: "age_group", rank: 9, label: "M" },
          ],
        },
        {
          competitionId: "rec5N3iDX27EQsEF4",
          time: "00:02:09.8",
          ranks: [
            { type: "category", rank: 36, label: "M individual" },
            { type: "age_group", rank: 14, label: "under 30" },
          ],
        },
        {
          competitionId: "recCZ6Npaxk5Glzo2",
          time: "00:02:04.8",
          ranks: [
            { type: "category", rank: 68, label: "M individual" },
            { type: "age_group", rank: 13, label: "M" },
          ],
        },
        {
          competitionId: "recN4o1TpaciUpXE5",
          time: "00:02:07.0",
          ranks: [
            { type: "category", rank: 24, label: "M individual" },
            { type: "age_group", rank: 12, label: "under 30" },
          ],
        },
        {
          competitionId: "recqYhG0KpSxOiq0G",
          time: "00:02:06.5",
          ranks: [
            { type: "category", rank: 32, label: "M individual" },
            { type: "age_group", rank: 14, label: "under 30" },
          ],
        },
      ],
    },
  ],
  [
    {
      name: "Pascal Kosfeld",
      gender: "male",
      country: "DE",
      team: "FSV Köln/Feuerwehr Gütersloh",
      result: {
        status: "OK",
        time: "00:01:50.12",
        penality: null,
      },
      previousResults: [
        {
          competitionId: "rec50IHAZaTlKnHIg",
          time: "00:02:03.2",
          ranks: [
            { type: "category", rank: 37, label: "M individual" },
            { type: "age_group", rank: 11, label: "under 30" },
          ],
        },
        {
          competitionId: "recfbLmSUmkXDLptv",
          time: "00:02:19.4",
          ranks: [
            { type: "category", rank: 53, label: "M individual" },
            { type: "age_group", rank: 12, label: "M" },
          ],
        },
        {
          competitionId: "recLoyMFpbemMbfvi",
          time: "00:01:57.9",
          ranks: [
            { type: "category", rank: 39, label: "M individual" },
            { type: "age_group", rank: 11, label: "under 30" },
          ],
        },
        {
          competitionId: "recN4o1TpaciUpXE5",
          time: "00:01:51.5",
          ranks: [
            { type: "category", rank: 14, label: "M individual" },
            { type: "age_group", rank: 5, label: "under 30" },
          ],
        },
        {
          competitionId: "rec040T1tj4CCrza1",
          time: "00:01:58.8",
          ranks: [
            { type: "category", rank: 43, label: "M individual" },
            { type: "age_group", rank: 9, label: "M" },
          ],
        },
        {
          competitionId: "recYjHBrXmVkygStd",
          time: "00:01:54.9",
          ranks: [
            { type: "category", rank: 51, label: "M individual" },
            { type: "age_group", rank: 13, label: "M" },
          ],
        },
        {
          competitionId: "recqYhG0KpSxOiq0G",
          time: "00:01:48.4",
          ranks: [
            { type: "category", rank: 16, label: "M individual" },
            { type: "age_group", rank: 7, label: "under 30" },
          ],
        },
        {
          competitionId: "recw6BxYhaiNq4W9r",
          time: "00:01:53.2",
          ranks: [
            { type: "category", rank: 19, label: "M individual" },
            { type: "age_group", rank: 5, label: "M" },
          ],
        },
      ],
    },
    {
      name: "Tobias Kohlmeier",
      gender: "male",
      country: "DE",
      team: "Berufsfeuerwehr Minden",
      result: {
        status: "OK",
        time: "00:02:16.90",
        penalty: null,
      },
      previousResults: [
        {
          competitionId: "rec50IHAZaTlKnHIg",
          time: "00:02:23.5",
          ranks: [
            { type: "category", rank: 54, label: "M individual" },
            { type: "age_group", rank: 20, label: "under 30" },
          ],
        },
        {
          competitionId: "rec5N3iDX27EQsEF4",
          time: "00:02:17.2",
          ranks: [
            { type: "category", rank: 44, label: "M individual" },
            { type: "age_group", rank: 18, label: "under 30" },
          ],
        },
        {
          competitionId: "recgPu6oDw47z8d2X",
          time: "00:02:07.8",
          ranks: [
            { type: "category", rank: 11, label: "M individual" },
            { type: "age_group", rank: 7, label: "under 30" },
          ],
        },
        {
          competitionId: "recLoyMFpbemMbfvi",
          time: "00:02:13.9",
          ranks: [
            { type: "category", rank: 59, label: "M individual" },
            { type: "age_group", rank: 19, label: "under 30" },
          ],
        },
        {
          competitionId: "recN4o1TpaciUpXE5",
          time: "00:02:17.1",
          ranks: [
            { type: "category", rank: 32, label: "M individual" },
            { type: "age_group", rank: 17, label: "under 30" },
          ],
        },
        {
          competitionId: "recqYhG0KpSxOiq0G",
          time: "00:02:20.3",
          ranks: [
            { type: "category", rank: 49, label: "M individual" },
            { type: "age_group", rank: 23, label: "under 30" },
          ],
        },
      ],
    },
  ],
  [
    {
      name: "Katrin Bagdahn",
      gender: "female",
      country: "DE",
      team: "BF Bremen HanseFighters",
      result: {
        status: "OK",
        time: "00:04:31.95",
        penalty: null,
      },
      previousResults: [
        {
          competitionId: "recfbLmSUmkXDLptv",
          time: "00:05:24.2",
          ranks: [
            { type: "category", rank: 14, label: "W individual" },
            { type: "age_group", rank: 4, label: "W" },
          ],
        },
        {
          competitionId: "rec5N3iDX27EQsEF4",
          time: "00:05:05.3",
          ranks: [{ type: "category", rank: 6, label: "W individual" }],
        },
        {
          competitionId: "recHp6Zi1pZTZ1BXW",
          time: "00:04:36.6",
          ranks: [
            { type: "category", rank: 11, label: "W individual" },
            { type: "age_group", rank: 4, label: "W" },
          ],
        },
        {
          competitionId: "recLoyMFpbemMbfvi",
          time: "00:04:05.6",
          ranks: [
            { type: "category", rank: 11, label: "W individual" },
            { type: "age_group", rank: 7, label: "under 30" },
          ],
        },
        {
          competitionId: "recV0B8sEyuoCmvux",
          time: "00:04:38.1",
          ranks: [
            { type: "category", rank: 10, label: "W individual" },
            { type: "age_group", rank: 4, label: "W30" },
          ],
        },
        {
          competitionId: "recYjHBrXmVkygStd",
          time: "00:04:08.5",
          ranks: [
            { type: "category", rank: 18, label: "W individual" },
            { type: "age_group", rank: 8, label: "W30" },
          ],
        },
        {
          competitionId: "recqYhG0KpSxOiq0G",
          time: "00:04:16.3",
          ranks: [
            { type: "category", rank: 11, label: "W individual" },
            { type: "age_group", rank: 7, label: "under 30" },
          ],
        },
        {
          competitionId: "recw6BxYhaiNq4W9r",
          time: "00:04:03.0",
          ranks: [
            { type: "category", rank: 14, label: "W individual" },
            { type: "age_group", rank: 6, label: "W30" },
          ],
        },
      ],
    },
    {
      name: "Stefanie Reich",
      gender: "female",
      country: "DE",
      team: "Laufen für krebskranke Kinder e.V.",
      result: {
        status: "OK",
        time: "00:04:46.50",
        penalty: 2,
      },
      previousResults: [
        {
          competitionId: "recLoyMFpbemMbfvi",
          time: "00:07:10.1",
          ranks: [
            { type: "category", rank: 15, label: "W individual" },
            { type: "age_group", rank: 6, label: "over 30" },
          ],
        },
      ],
    },
  ],
];
</script>
