import { bisectLeft, bisectRight, defaultCmp, type Comparator } from "./bisect.js";

export interface SortedListOptions<T> {
  /** Comparator function (default: lexicographic <). */
  comparator?: Comparator<T>;
}

/**
 * Sorted list that allows duplicate values.
 * O(log n) bisect/rank; O(n) insert/delete (sorted array backing store).
 * Suitable for up to ~100k elements; use a B-tree for larger sets.
 *
 * Inspired by Python's `sortedcontainers.SortedList`.
 */
export class SortedList<T> implements Iterable<T> {
  private _arr: T[] = [];
  private readonly _cmp: Comparator<T>;

  constructor(iterable?: Iterable<T>, options?: SortedListOptions<T>) {
    this._cmp = options?.comparator ?? defaultCmp;
    if (iterable) for (const v of iterable) this.add(v);
  }

  get length(): number { return this._arr.length; }
  get size(): number { return this._arr.length; }

  /** Add a value (duplicates allowed). */
  add(value: T): this {
    const i = bisectRight(this._arr, value, this._cmp);
    this._arr.splice(i, 0, value);
    return this;
  }

  /** Remove the first occurrence of value. Throws if not found. */
  remove(value: T): this {
    const i = this._indexOf(value);
    if (i === -1) throw new Error(`Value not found: ${String(value)}`);
    this._arr.splice(i, 1);
    return this;
  }

  /** Remove the first occurrence of value; no-op if absent. */
  discard(value: T): this {
    const i = this._indexOf(value);
    if (i !== -1) this._arr.splice(i, 1);
    return this;
  }

  /** Return true if value is present. */
  includes(value: T): boolean { return this._indexOf(value) !== -1; }
  has(value: T): boolean { return this.includes(value); }

  /** Count occurrences of value. */
  count(value: T): number {
    return bisectRight(this._arr, value, this._cmp) - bisectLeft(this._arr, value, this._cmp);
  }

  /** Index of first occurrence, or -1. */
  indexOf(value: T): number { return this._indexOf(value); }

  /**
   * Number of elements strictly less than value (= index of first occurrence).
   * Equivalent to Python bisect_left.
   */
  rank(value: T): number { return bisectLeft(this._arr, value, this._cmp); }

  /** Element at given index (0-based). Returns undefined if out of range. */
  at(index: number): T | undefined {
    const i = index < 0 ? this._arr.length + index : index;
    return this._arr[i];
  }

  /** Minimum value, or undefined if empty. */
  get min(): T | undefined { return this._arr[0]; }

  /** Maximum value, or undefined if empty. */
  get max(): T | undefined { return this._arr[this._arr.length - 1]; }

  /** All values in sorted order as array. */
  toArray(): T[] { return this._arr.slice(); }

  /** Slice by index range (same semantics as Array.slice). */
  slice(start?: number, end?: number): T[] { return this._arr.slice(start, end); }

  /**
   * Iterate values in [minVal, maxVal].
   * @param inclusive [includeMin, includeMax] — default [true, true]
   */
  *irange(minVal: T, maxVal: T, inclusive: [boolean, boolean] = [true, true]): Iterable<T> {
    const lo = inclusive[0] ? bisectLeft(this._arr, minVal, this._cmp) : bisectRight(this._arr, minVal, this._cmp);
    const hi = inclusive[1] ? bisectRight(this._arr, maxVal, this._cmp) : bisectLeft(this._arr, maxVal, this._cmp);
    for (let i = lo; i < hi; i++) yield this._arr[i];
  }

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

  clear(): this { this._arr = []; return this; }

  [Symbol.iterator](): Iterator<T> { return this._arr[Symbol.iterator](); }

  private _indexOf(value: T): number {
    const i = bisectLeft(this._arr, value, this._cmp);
    if (i < this._arr.length && this._cmp(this._arr[i], value) === 0) return i;
    return -1;
  }
}
