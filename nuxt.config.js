export default defineNuxtConfig({
  css: ["@/node_modules/bulma/css/bulma.min.css"],

  nitro: {
    devServer: {
      watch: ["./calendar-provider.js", "./app/router.options.ts"],
    },

    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },

  routeRules: {
    // refresh feeds once a day, serve the stale copy while refreshing
    "/fcc.ics": { swr: 60 * 60 * 24 },
    "/fsr.ics": { swr: 60 * 60 * 24 },
    "/fcc-fsr.ics": { swr: 60 * 60 * 24 },
  },

  runtimeConfig: {
    DB_DSN: process.env.DB_DSN,
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
  },

  compatibilityDate: "2026-04-12",
});
