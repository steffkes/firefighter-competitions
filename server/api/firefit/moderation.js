export default defineEventHandler(async (event) => {
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
      },
    ],
  ];

  return pairs;
});
