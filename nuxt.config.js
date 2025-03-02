export default defineNuxtConfig({
  css: ["@/node_modules/bulma/css/bulma.min.css"],
  nitro: {
    devServer: {
      watch: [
        "./calendar-provider.js",
        "./competition-provider.js",
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
  },
});
