import { ofetch } from "ofetch";
import { defineEventHandler } from "h3";

const reverseName = (name) => name.split(", ").reverse().join(" ");

const data = (
  await Promise.allSettled(
    [9].map(
      async (contest) =>
        new Promise(async (resolve) => {
          const { data } = await ofetch(
            "https://my1.raceresult.com/267314/RRPublish/data/list",
            {
              query: {
                key: "e9de69adb513973efb142494b4cf6628",
                listname: "rr Timing|Teilnehmerliste_Feuerwehrlauf",
                contest,
              },
            }
          );
          return resolve(Object.values(data)[0]);
        })
    )
  )
)
  .flatMap(({ value }) => value)
  .map(([_bib, _team, name1, name2, _byear1, _byear2, _gender1, _gender2]) => [
    reverseName(name1),
    reverseName(name2),
  ]);

export const teams = () => data;
export const participants = () => teams().flat();
export const count = () => participants().length;

export default defineEventHandler(async (event) => await count());
