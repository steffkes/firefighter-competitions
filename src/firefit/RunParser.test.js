import { parseContent, parseInfo, parseResult } from "./RunParser";
import { readFileSync } from "node:fs";

describe("parse content", () => {
  test("parse 01", () => {
    expect(
      parseContent(
        readFileSync("./src/firefit/fixtures/01.html", {
          encoding: "utf-8",
        }),
      ),
    ).toStrictEqual(
      JSON.parse(
        readFileSync("./src/firefit/fixtures/01.json", {
          encoding: "utf-8",
        }),
      ),
    );
  });
});

describe("parse info", () => {
  test.each([
    ["[DE] men", { country: "DE", gender: "M" }],
    ["[DE] women", { country: "DE", gender: "F" }],
    [undefined, null],
    ["[NL] men", { country: "NL", gender: "M" }],
    ["[CZ] men", { country: "CZ", gender: "M" }],
    ["[IE] women", { country: "IE", gender: "F" }],
    ["[HU] women", { country: "HU", gender: "F" }],
  ])("given %p returns %p", (input, expectedResult) => {
    expect(parseInfo(input)).toEqual(expectedResult);
  });
});

describe("parse result", () => {
  test.each([
    [
      "country: Germany\n" +
        "department: Firesports Basaltbrecher\n" +
        "result: finished\n" +
        "time total: 1:57,80\n" +
        "time on clock: 1:57,80\n" +
        "penalty: 0 s",
      { status: "OK", time: "00:01:57.80" },
    ],
    [
      "country: Germany\n" +
        "department: Bielefeld\n" +
        "result: finished\n" +
        "time total: 3:22,70\n" +
        "time on clock: 3:22,70\n" +
        "penalty: 0 s",
      { status: "OK", time: "00:03:22.70" },
    ],
    [
      "country: Germany\n" +
        "department: Berlin\n" +
        "result: finished\n" +
        "time total: 2:08,29\n" +
        "time on clock: 2:06,29\n" +
        "penalty: 2 s",
      { status: "OK", time: "00:02:08.29", penalty: 2 },
    ],
    [
      "country: Germany\n" +
        "department: Feuerwehr Scharbeutz Wache 80\n" +
        "result: disqualified\n" +
        "time total: -:--,--\n" +
        "time on clock: -:--,--\n" +
        "penalty: 0 s",
      { status: "DSQ" },
    ],
    [
      "country: Germany\n" +
        "department: Stadt Petershagen\n" +
        "result: did not finish\n" +
        "time total: 7:30,78\n" +
        "time on clock: 7:30,78\n" +
        "penalty: 0 s",
      { status: "DNF" },
    ],
  ])("given %p returns %p", (input, expectedResult) => {
    expect(parseResult(input)).toEqual(expectedResult);
  });
});
