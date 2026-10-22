import redisDriver from "unstorage/drivers/redis";

// on Vercel every function instance has its own memory, so the in-memory
// cache is lost on each cold start. keep it in Redis when configured,
// so all instances share the one daily Airtable fetch
export default defineNitroPlugin(async () => {
  const url = process.env.CACHE_REDIS_URL;
  if (!url) {
    return;
  }

  const storage = useStorage();
  await storage.unmount("cache");
  storage.mount(
    "cache",
    redisDriver({ url, base: "firefighter-competitions:cache" }),
  );
  console.info("Nitro cache stored in Redis");
});
