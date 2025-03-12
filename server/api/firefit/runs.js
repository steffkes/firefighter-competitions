import axios from "axios";
import { parseContent } from "@/src/firefit/RunParser";

export default defineEventHandler(async (event) => {
  const { data } = await axios.get("https://firefit-europe.eu/en/runs/");
  return parseContent(data);
});
