import { bisectLeft, bisectRight, numericCmp } from "../src/index.js";

describe("bisect", () => {
  const arr = [1, 2, 2, 3, 5, 5, 8];

  it("bisectLeft: returns index of leftmost insertion point", () => {
    expect(bisectLeft(arr, 2, numericCmp)).toBe(1);
    expect(bisectLeft(arr, 5, numericCmp)).toBe(4);
    expect(bisectLeft(arr, 0, numericCmp)).toBe(0);
    expect(bisectLeft(arr, 9, numericCmp)).toBe(7);
    expect(bisectLeft(arr, 4, numericCmp)).toBe(4);
  });

  it("bisectRight: returns index of rightmost insertion point", () => {
    expect(bisectRight(arr, 2, numericCmp)).toBe(3);
    expect(bisectRight(arr, 5, numericCmp)).toBe(6);
    expect(bisectRight(arr, 0, numericCmp)).toBe(0);
    expect(bisectRight(arr, 9, numericCmp)).toBe(7);
  });

  it("bisectLeft on empty array", () => {
    expect(bisectLeft([], 5, numericCmp)).toBe(0);
  });

  it("bisectRight on empty array", () => {
    expect(bisectRight([], 5, numericCmp)).toBe(0);
  });
});
