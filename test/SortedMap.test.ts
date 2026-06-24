import { SortedMap, numericCmp } from "../src/index.js";

describe("SortedMap", () => {
  it("constructs from entries", () => {
    const m = new SortedMap([[3, "c"], [1, "a"], [2, "b"]], { comparator: numericCmp });
    expect([...m.keys()]).toEqual([1, 2, 3]);
    expect([...m.values()]).toEqual(["a", "b", "c"]);
  });

  it("set and get", () => {
    const m = new SortedMap<number, string>(undefined, { comparator: numericCmp });
    m.set(1, "one").set(2, "two").set(3, "three");
    expect(m.get(1)).toBe("one");
    expect(m.get(2)).toBe("two");
    expect(m.get(99)).toBeUndefined();
  });

  it("update existing key", () => {
    const m = new SortedMap<number, string>(undefined, { comparator: numericCmp });
    m.set(1, "old");
    m.set(1, "new");
    expect(m.size).toBe(1);
    expect(m.get(1)).toBe("new");
  });

  it("has and delete", () => {
    const m = new SortedMap([[1, "a"], [2, "b"]], { comparator: numericCmp });
    expect(m.has(1)).toBe(true);
    expect(m.delete(1)).toBe(true);
    expect(m.has(1)).toBe(false);
    expect(m.delete(99)).toBe(false);
  });

  it("floor / ceiling / lower / higher", () => {
    const m = new SortedMap([[10, "a"], [20, "b"], [30, "c"]], { comparator: numericCmp });
    expect(m.floor(25)).toEqual([20, "b"]);
    expect(m.floor(20)).toEqual([20, "b"]);
    expect(m.floor(5)).toBeUndefined();
    expect(m.ceiling(25)).toEqual([30, "c"]);
    expect(m.ceiling(20)).toEqual([20, "b"]);
    expect(m.ceiling(99)).toBeUndefined();
    expect(m.lower(20)).toEqual([10, "a"]);
    expect(m.lower(10)).toBeUndefined();
    expect(m.higher(20)).toEqual([30, "c"]);
    expect(m.higher(30)).toBeUndefined();
  });

  it("firstEntry / lastEntry", () => {
    const m = new SortedMap([[5, "e"], [1, "a"], [3, "c"]], { comparator: numericCmp });
    expect(m.firstEntry()).toEqual([1, "a"]);
    expect(m.lastEntry()).toEqual([5, "e"]);
  });

  it("firstEntry / lastEntry on empty map", () => {
    const m = new SortedMap<number, string>(undefined, { comparator: numericCmp });
    expect(m.firstEntry()).toBeUndefined();
    expect(m.lastEntry()).toBeUndefined();
  });

  it("irange inclusive", () => {
    const m = new SortedMap([[1,"a"],[2,"b"],[3,"c"],[4,"d"],[5,"e"]], { comparator: numericCmp });
    expect([...m.irange(2, 4)]).toEqual([[2,"b"],[3,"c"],[4,"d"]]);
  });

  it("irange exclusive", () => {
    const m = new SortedMap([[1,"a"],[2,"b"],[3,"c"],[4,"d"],[5,"e"]], { comparator: numericCmp });
    expect([...m.irange(2, 4, [false, false])]).toEqual([[3,"c"]]);
  });

  it("entries iterates in key order", () => {
    const m = new SortedMap([[3,"c"],[1,"a"],[2,"b"]], { comparator: numericCmp });
    expect([...m.entries()]).toEqual([[1,"a"],[2,"b"],[3,"c"]]);
  });

  it("[Symbol.iterator] same as entries", () => {
    const m = new SortedMap([[2,"b"],[1,"a"]], { comparator: numericCmp });
    expect([...m]).toEqual([[1,"a"],[2,"b"]]);
  });

  it("forEach iterates in key order", () => {
    const m = new SortedMap([[3,"c"],[1,"a"],[2,"b"]], { comparator: numericCmp });
    const result: string[] = [];
    m.forEach((v) => result.push(v));
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("clear", () => {
    const m = new SortedMap([[1,"a"],[2,"b"]], { comparator: numericCmp });
    m.clear();
    expect(m.size).toBe(0);
    expect([...m]).toEqual([]);
  });

  it("string keys sorted lexicographically by default", () => {
    const m = new SortedMap([["banana", 2], ["apple", 1], ["cherry", 3]]);
    expect([...m.keys()]).toEqual(["apple", "banana", "cherry"]);
  });
});
