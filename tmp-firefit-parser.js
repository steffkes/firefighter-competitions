import { parseContent } from "./src/firefit/RunParser.js";
import { readFileSync } from "node:fs";

console.log(
  JSON.stringify(
    parseContent(
      readFileSync("./src/firefit/fixtures/01.html", {
        encoding: "utf-8",
      }),
    ),
    null,
    4,
  ),
);
