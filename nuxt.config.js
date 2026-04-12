export default defineNuxtConfig({
  css: ["@/node_modules/bulma/css/bulma.min.css"],

  nitro: {
    devServer: {
      watch: [
        "./calendar-provider.js",
        "./app/router.options.ts",
      ],
    },
    prerender: {
      routes: ["/fcc.ics", "/fsr.ics", "/fcc-fsr.ics"],
    },

    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },

  runtimeConfig: {
    DB_DSN: process.env.DB_DSN,
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
  },

  compatibilityDate: "2026-04-12",
});