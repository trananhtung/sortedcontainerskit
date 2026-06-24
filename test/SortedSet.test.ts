import { SortedSet, numericCmp } from "../src/index.js";

describe("SortedSet", () => {
  it("deduplicates on add", () => {
    const s = new SortedSet([3, 1, 2, 1, 3], { comparator: numericCmp });
    expect(s.toArray()).toEqual([1, 2, 3]);
    expect(s.size).toBe(3);
  });

  it("delete returns true when removed, false when absent", () => {
    const s = new SortedSet([1, 2, 3], { comparator: numericCmp });
    expect(s.delete(2)).toBe(true);
    expect(s.toArray()).toEqual([1, 3]);
    expect(s.delete(99)).toBe(false);
  });

  it("has", () => {
    const s = new SortedSet([10, 20, 30], { comparator: numericCmp });
    expect(s.has(20)).toBe(true);
    expect(s.has(15)).toBe(false);
  });

  it("rank", () => {
    const s = new SortedSet([10, 20, 30, 40], { comparator: numericCmp });
    expect(s.rank(10)).toBe(0);
    expect(s.rank(25)).toBe(2);
    expect(s.rank(50)).toBe(4);
  });

  it("at", () => {
    const s = new SortedSet([10, 20, 30], { comparator: numericCmp });
    expect(s.at(0)).toBe(10);
    expect(s.at(-1)).toBe(30);
    expect(s.at(10)).toBeUndefined();
  });

  it("floor / ceiling / lower / higher", () => {
    const s = new SortedSet([10, 20, 30], { comparator: numericCmp });
    expect(s.floor(25)).toBe(20);
    expect(s.ceiling(25)).toBe(30);
    expect(s.lower(20)).toBe(10);
    expect(s.higher(20)).toBe(30);
    expect(s.floor(5)).toBeUndefined();
    expect(s.ceiling(99)).toBeUndefined();
  });

  it("countRange", () => {
    const s = new SortedSet([1, 3, 5, 7, 9], { comparator: numericCmp });
    expect(s.countRange(3, 7)).toBe(3);
  });

  it("irange", () => {
    const s = new SortedSet([1, 2, 3, 4, 5], { comparator: numericCmp });
    expect([...s.irange(2, 4)]).toEqual([2, 3, 4]);
    expect([...s.irange(2, 4, [false, false])]).toEqual([3]);
  });

  it("union", () => {
    const a = new SortedSet([1, 3, 5], { comparator: numericCmp });
    const b = new SortedSet([2, 3, 4], { comparator: numericCmp });
    expect(a.union(b).toArray()).toEqual([1, 2, 3, 4, 5]);
  });

  it("intersection", () => {
    const a = new SortedSet([1, 2, 3, 4], { comparator: numericCmp });
    const b = new SortedSet([2, 4, 6], { comparator: numericCmp });
    expect(a.intersection(b).toArray()).toEqual([2, 4]);
  });

  it("difference", () => {
    const a = new SortedSet([1, 2, 3, 4], { comparator: numericCmp });
    const b = new SortedSet([2, 4], { comparator: numericCmp });
    expect(a.difference(b).toArray()).toEqual([1, 3]);
  });

  it("iterates in sorted order", () => {
    const s = new SortedSet([5, 3, 1, 4, 2], { comparator: numericCmp });
    expect([...s]).toEqual([1, 2, 3, 4, 5]);
  });

  it("min / max", () => {
    const s = new SortedSet([5, 1, 3], { comparator: numericCmp });
    expect(s.min).toBe(1);
    expect(s.max).toBe(5);
  });

  it("clear", () => {
    const s = new SortedSet([1, 2], { comparator: numericCmp });
    s.clear();
    expect(s.size).toBe(0);
  });
});
