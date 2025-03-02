import type { RouterConfig } from "@nuxt/schema";

export default {
  routes: (routes) => [
    {
      path: "/persoenlicher-kalender/:name",
      redirect: ({ params }) => ({ name: "personal-calendar", params }),
    },
    {
      path: "/persoenliche-bestzeiten/:name/:year",
      redirect: ({ params }) => ({ name: "personal-results", params }),
    },
    ...routes,
  ],
} satisfies RouterConfig;
