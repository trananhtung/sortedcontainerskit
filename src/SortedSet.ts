import { bisectLeft, bisectRight, defaultCmp, type Comparator } from "./bisect.js";

export interface SortedSetOptions<T> {
  comparator?: Comparator<T>;
}

/**
 * Sorted set — unique values in sorted order.
 * O(log n) has/rank/floor/ceiling; O(n) add/delete.
 *
 * Inspired by Python's `sortedcontainers.SortedSet` / Java's `TreeSet`.
 */
export class SortedSet<T> implements Iterable<T> {
  private _arr: T[] = [];
  private readonly _cmp: Comparator<T>;

  constructor(iterable?: Iterable<T>, options?: SortedSetOptions<T>) {
    this._cmp = options?.comparator ?? defaultCmp;
    if (iterable) for (const v of iterable) this.add(v);
  }

  get size(): number { return this._arr.length; }
  get length(): number { return this._arr.length; }

  add(value: T): this {
    const i = bisectLeft(this._arr, value, this._cmp);
    if (i < this._arr.length && this._cmp(this._arr[i], value) === 0) return this; // already present
    this._arr.splice(i, 0, value);
    return this;
  }

  delete(value: T): boolean {
    const i = bisectLeft(this._arr, value, this._cmp);
    if (i < this._arr.length && this._cmp(this._arr[i], value) === 0) {
      this._arr.splice(i, 1);
      return true;
    }
    return false;
  }

  has(value: T): boolean {
    const i = bisectLeft(this._arr, value, this._cmp);
    return i < this._arr.length && this._cmp(this._arr[i], value) === 0;
  }

  /** Number of elements strictly less than value. */
  rank(value: T): number { return bisectLeft(this._arr, value, this._cmp); }

  /** Element at given index (0-based). Supports negative indexing. */
  at(index: number): T | undefined {
    const i = index < 0 ? this._arr.length + index : index;
    return this._arr[i];
  }

  get min(): T | undefined { return this._arr[0]; }
  get max(): T | undefined { return this._arr[this._arr.length - 1]; }

  /** Largest value ≤ query, or undefined. */
  floor(value: T): T | undefined {
    const i = bisectRight(this._arr, value, this._cmp) - 1;
    return i >= 0 ? this._arr[i] : undefined;
  }

  /** Smallest value ≥ query, or undefined. */
  ceiling(value: T): T | undefined {
    const i = bisectLeft(this._arr, value, this._cmp);
    return i < this._arr.length ? this._arr[i] : undefined;
  }

  /** Largest value < query, or undefined. */
  lower(value: T): T | undefined {
    const i = bisectLeft(this._arr, value, this._cmp) - 1;
    return i >= 0 ? this._arr[i] : undefined;
  }

  /** Smallest value > query, or undefined. */
  higher(value: T): T | undefined {
    const i = bisectRight(this._arr, value, this._cmp);
    return i < this._arr.length ? this._arr[i] : undefined;
  }

  /** Count elements in [lo, hi] (inclusive). */
  countRange(lo: T, hi: T): number {
    return bisectRight(this._arr, hi, this._cmp) - bisectLeft(this._arr, lo, this._cmp);
  }

  *irange(minVal: T, maxVal: T, inclusive: [boolean, boolean] = [true, true]): Iterable<T> {
    const lo = inclusive[0] ? bisectLeft(this._arr, minVal, this._cmp) : bisectRight(this._arr, minVal, this._cmp);
    const hi = inclusive[1] ? bisectRight(this._arr, maxVal, this._cmp) : bisectLeft(this._arr, maxVal, this._cmp);
    for (let i = lo; i < hi; i++) yield this._arr[i];
  }

  /** Set union (returns new SortedSet). */
  union(other: Iterable<T>): SortedSet<T> {
    return new SortedSet([...this, ...other], { comparator: this._cmp });
  }

  /** Set intersection (returns new SortedSet). */
  intersection(other: Iterable<T>): SortedSet<T> {
    const otherSet = new SortedSet(other, { comparator: this._cmp });
    return new SortedSet(this._arr.filter(v => otherSet.has(v)), { comparator: this._cmp });
  }

  /** Set difference: this − other (returns new SortedSet). */
  difference(other: Iterable<T>): SortedSet<T> {
    const otherSet = new SortedSet(other, { comparator: this._cmp });
    return new SortedSet(this._arr.filter(v => !otherSet.has(v)), { comparator: this._cmp });
  }

  toArray(): T[] { return this._arr.slice(); }
  clear(): this { this._arr = []; return this; }
  [Symbol.iterator](): Iterator<T> { return this._arr[Symbol.iterator](); }
}
