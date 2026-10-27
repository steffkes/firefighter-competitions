export default defineNuxtConfig({
  css: ["@/node_modules/bulma/css/bulma.min.css"],

  nitro: {
    devServer: {
      watch: ["./app/router.options.ts"],
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
