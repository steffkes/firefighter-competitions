import { defineEventHandler, sendNoContent } from "h3";
import { readFileSync } from "fs";
import { resolve, normalize } from "node:path";

export default defineEventHandler(async (event) => {
  const {
    context: {
      params: { ident },
    },
  } = event;
  const path = resolve("./data/teams/" + normalize(ident));

  try {
    if (!path.startsWith(resolve("."))) {
      throw new Exception("path outside of application");
    }
    const { count } = JSON.parse(readFileSync(path));

    return count;
  } catch (error) {
    return sendNoContent(event);
  }
});
