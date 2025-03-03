import type { RouterConfig } from "@nuxt/schema";

export default {
  routes: (routes) => [
    {
      path: "/persoenlich/:name",
      redirect: ({ params }) => ({ name: "personal-calendar", params }),
    },
    {
      path: "/persoenlicher-kalender/:name",
      redirect: ({ params }) => ({ name: "personal-calendar", params }),
    },
    {
      path: "/persoenlich/:name/bestzeiten",
      redirect: ({ params }) => ({
        name: "personal-results",
        params: { ...params, year: new Date().getFullYear() },
      }),
    },
    {
      path: "/persoenliche-bestzeiten/:name/:year",
      redirect: ({ params }) => ({ name: "personal-results", params }),
    },
    ...routes,
  ],
} satisfies RouterConfig;
