const { expect } = require("@jest/globals");
const { RV, getContainerWidth, maxValueKey } = require("./rv");

function pair(a, b) {
  return [a, b];
}

const examples = [
  pair(
    true,

    [true, true, true, true, true]
  ),
  pair(
    [true, null, null, false],

    [true, false, false, false, false]
  ),
  pair(
    10,

    [10, 10, 10, 10, 10]
  ),
  pair(
    [10, 20, null, null, 40],

    [10, 20, 40, 40, 40]
  ),
  pair(
    [null, 10, null, 20, null],

    [10, 10, 20, 20, 20]
  ),
  pair(
    "right",

    ["right", "right", "right", "right", "right"]
  ),
  pair(
    ["left", null, "center"],
    ["left", "center", "center", "center", "center"]
  ),
  pair(
    [{ a: 1 }, null, { b: 2 }],
    [{ a: 1 }, { b: 2 }, { b: 2 }, { b: 2 }, { b: 2 }]
  ),
];

describe("RV.js", () => {
  it("should work fine", () => {
    for (const [input, desiredOutput] of examples) {
      const myOutput = new RV(input).values(5);
      expect(myOutput.length).toEqual(5);
      expect(myOutput).toEqual(desiredOutput);
    }
  });
});

describe("add", () => {
  it("should work", () => {
    const r = new RV([10, null, 20]).map(
      new RV([null, 30, 40]),
      (a, b) => a + b
    );
    expect(r).toEqual([40, 50, 60]);
  });
});

describe("getContainerWidth", () => {
  it("getContainerWidth(1)", () => {
    const r = getContainerWidth(
      new RV([null, 10, null, 20]),
      new RV([true, null, false])
    );
    expect(r).toEqual(["100%", "calc(100% - 5px)", null, "calc(100% - 10px)"]);
  });
  it("getContainerWidth(2)", () => {
    const r = getContainerWidth(new RV(100), new RV([null, true, null, false]));
    expect(r).toEqual([null, "100%", null, "calc(100% - 50px)"]);
  });
});

describe("maxValueKey", () => {
  // - `maxValueKey([{ a: 1, b: 2}, null, { a: 1, c: 3}]) = ["b", null, "c"])`
  // - `maxValueKey([{ a: 1, b: 2}, { d: 5 }, { a: 1, c: 3, d: 8}]) = ["b", "d", "d"] = ["b", null, "d"]`
  // - `maxValueKey([{ a: 4, b: 2}, { c: 3, a: 5}, { a: 1, b: 0 }]) = ["a", "a", "a"] = "a"`
  it("works(1)", () => {
    const r = maxValueKey(new RV([{ a: 1, b: 2 }, null, { a: 1, c: 3 }]));
    expect(r).toEqual(["b", null, "c"]);
  });
  it("works(2)", () => {
    const r = maxValueKey(
      new RV([{ a: 1, b: 2 }, { d: 5 }, { a: 1, c: 3, d: 8 }])
    );
    expect(r).toEqual(["b", null, "d"]);
  });
  it("works(3)", () => {
    const r = maxValueKey(
      new RV([
        { a: 4, b: 2 },
        { c: 3, a: 5 },
        { a: 1, b: 0 },
      ])
    );
    expect(r).toEqual("a");
  });
});
