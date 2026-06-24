import { SortedList, numericCmp } from "../src/index.js";

describe("SortedList", () => {
  describe("basic operations", () => {
    it("starts empty", () => {
      const sl = new SortedList<number>();
      expect(sl.length).toBe(0);
      expect(sl.size).toBe(0);
    });

    it("constructs from iterable", () => {
      const sl = new SortedList([3, 1, 4, 1, 5], { comparator: numericCmp });
      expect(sl.toArray()).toEqual([1, 1, 3, 4, 5]);
    });

    it("allows duplicates", () => {
      const sl = new SortedList<number>(undefined, { comparator: numericCmp });
      sl.add(2).add(2).add(2);
      expect(sl.length).toBe(3);
      expect(sl.toArray()).toEqual([2, 2, 2]);
    });

    it("maintains sorted order on add", () => {
      const sl = new SortedList<number>(undefined, { comparator: numericCmp });
      sl.add(5).add(1).add(3).add(2).add(4);
      expect(sl.toArray()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("remove / discard", () => {
    it("removes first occurrence", () => {
      const sl = new SortedList([1, 2, 2, 3], { comparator: numericCmp });
      sl.remove(2);
      expect(sl.toArray()).toEqual([1, 2, 3]);
    });

    it("throws on remove of missing value", () => {
      const sl = new SortedList([1, 2, 3], { comparator: numericCmp });
      expect(() => sl.remove(99)).toThrow();
    });

    it("discard is no-op when absent", () => {
      const sl = new SortedList([1, 2, 3], { comparator: numericCmp });
      expect(() => sl.discard(99)).not.toThrow();
      expect(sl.length).toBe(3);
    });
  });

  describe("query methods", () => {
    let sl: SortedList<number>;
    beforeEach(() => { sl = new SortedList([1, 2, 2, 3, 5, 5, 8], { comparator: numericCmp }); });

    it("includes / has", () => {
      expect(sl.includes(2)).toBe(true);
      expect(sl.has(99)).toBe(false);
    });

    it("count", () => {
      expect(sl.count(2)).toBe(2);
      expect(sl.count(5)).toBe(2);
      expect(sl.count(1)).toBe(1);
      expect(sl.count(99)).toBe(0);
    });

    it("indexOf", () => {
      expect(sl.indexOf(2)).toBe(1);
      expect(sl.indexOf(99)).toBe(-1);
    });

    it("rank = bisect_left", () => {
      expect(sl.rank(1)).toBe(0);
      expect(sl.rank(2)).toBe(1);
      expect(sl.rank(4)).toBe(4);
      expect(sl.rank(0)).toBe(0);
      expect(sl.rank(9)).toBe(7);
    });

    it("at with positive and negative index", () => {
      expect(sl.at(0)).toBe(1);
      expect(sl.at(2)).toBe(2);
      expect(sl.at(-1)).toBe(8);
      expect(sl.at(100)).toBeUndefined();
    });

    it("min / max", () => {
      expect(sl.min).toBe(1);
      expect(sl.max).toBe(8);
    });
  });

  describe("floor / ceiling / lower / higher", () => {
    let sl: SortedList<number>;
    beforeEach(() => { sl = new SortedList([10, 20, 30, 40], { comparator: numericCmp }); });

    it("floor returns largest ≤ query", () => {
      expect(sl.floor(25)).toBe(20);
      expect(sl.floor(20)).toBe(20);
      expect(sl.floor(5)).toBeUndefined();
    });

    it("ceiling returns smallest ≥ query", () => {
      expect(sl.ceiling(25)).toBe(30);
      expect(sl.ceiling(20)).toBe(20);
      expect(sl.ceiling(99)).toBeUndefined();
    });

    it("lower returns largest < query", () => {
      expect(sl.lower(25)).toBe(20);
      expect(sl.lower(20)).toBe(10);
      expect(sl.lower(10)).toBeUndefined();
    });

    it("higher returns smallest > query", () => {
      expect(sl.higher(25)).toBe(30);
      expect(sl.higher(40)).toBeUndefined();
    });
  });

  describe("countRange / irange / slice", () => {
    let sl: SortedList<number>;
    beforeEach(() => { sl = new SortedList([1, 2, 3, 4, 5, 6, 7, 8], { comparator: numericCmp }); });

    it("countRange", () => {
      expect(sl.countRange(3, 6)).toBe(4);
      expect(sl.countRange(1, 8)).toBe(8);
      expect(sl.countRange(5, 5)).toBe(1);
    });

    it("irange inclusive", () => {
      expect([...sl.irange(3, 6)]).toEqual([3, 4, 5, 6]);
    });

    it("irange exclusive start", () => {
      expect([...sl.irange(3, 6, [false, true])]).toEqual([4, 5, 6]);
    });

    it("irange exclusive end", () => {
      expect([...sl.irange(3, 6, [true, false])]).toEqual([3, 4, 5]);
    });

    it("slice by index", () => {
      expect(sl.slice(2, 5)).toEqual([3, 4, 5]);
    });
  });

  describe("iteration and clear", () => {
    it("iterates in sorted order", () => {
      const sl = new SortedList([5, 3, 1], { comparator: numericCmp });
      expect([...sl]).toEqual([1, 3, 5]);
    });

    it("clear empties the list", () => {
      const sl = new SortedList([1, 2, 3], { comparator: numericCmp });
      sl.clear();
      expect(sl.length).toBe(0);
      expect([...sl]).toEqual([]);
    });
  });

  describe("string comparator (default)", () => {
    it("sorts strings lexicographically by default", () => {
      const sl = new SortedList(["banana", "apple", "cherry"]);
      expect(sl.toArray()).toEqual(["apple", "banana", "cherry"]);
    });
  });
});
