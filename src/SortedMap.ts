import { bisectLeft, bisectRight, defaultCmp, type Comparator } from "./bisect.js";

export interface SortedMapOptions<K> {
  comparator?: Comparator<K>;
}

/**
 * Map with keys maintained in sorted order.
 * O(log n) get/has/floor/ceiling; O(n) set/delete.
 *
 * Inspired by Python's `sortedcontainers.SortedDict` / Java's `TreeMap`.
 */
export class SortedMap<K, V> implements Iterable<[K, V]> {
  private _keys: K[] = [];
  private _vals: V[] = [];
  private readonly _cmp: Comparator<K>;

  constructor(entries?: Iterable<[K, V]>, options?: SortedMapOptions<K>) {
    this._cmp = options?.comparator ?? defaultCmp;
    if (entries) for (const [k, v] of entries) this.set(k, v);
  }

  get size(): number { return this._keys.length; }

  set(key: K, value: V): this {
    const i = bisectLeft(this._keys, key, this._cmp);
    if (i < this._keys.length && this._cmp(this._keys[i], key) === 0) {
      this._vals[i] = value;
    } else {
      this._keys.splice(i, 0, key);
      this._vals.splice(i, 0, value);
    }
    return this;
  }

  get(key: K): V | undefined {
    const i = bisectLeft(this._keys, key, this._cmp);
    if (i < this._keys.length && this._cmp(this._keys[i], key) === 0) return this._vals[i];
    return undefined;
  }

  has(key: K): boolean {
    const i = bisectLeft(this._keys, key, this._cmp);
    return i < this._keys.length && this._cmp(this._keys[i], key) === 0;
  }

  delete(key: K): boolean {
    const i = bisectLeft(this._keys, key, this._cmp);
    if (i < this._keys.length && this._cmp(this._keys[i], key) === 0) {
      this._keys.splice(i, 1);
      this._vals.splice(i, 1);
      return true;
    }
    return false;
  }

  /** Entry [key, value] with largest key ≤ query, or undefined. */
  floor(key: K): [K, V] | undefined {
    const i = bisectRight(this._keys, key, this._cmp) - 1;
    return i >= 0 ? [this._keys[i], this._vals[i]] : undefined;
  }

  /** Entry [key, value] with smallest key ≥ query, or undefined. */
  ceiling(key: K): [K, V] | undefined {
    const i = bisectLeft(this._keys, key, this._cmp);
    return i < this._keys.length ? [this._keys[i], this._vals[i]] : undefined;
  }

  /** Entry with largest key < query, or undefined. */
  lower(key: K): [K, V] | undefined {
    const i = bisectLeft(this._keys, key, this._cmp) - 1;
    return i >= 0 ? [this._keys[i], this._vals[i]] : undefined;
  }

  /** Entry with smallest key > query, or undefined. */
  higher(key: K): [K, V] | undefined {
    const i = bisectRight(this._keys, key, this._cmp);
    return i < this._keys.length ? [this._keys[i], this._vals[i]] : undefined;
  }

  /** First [key, value] pair (minimum key), or undefined. */
  firstEntry(): [K, V] | undefined {
    return this._keys.length ? [this._keys[0], this._vals[0]] : undefined;
  }

  /** Last [key, value] pair (maximum key), or undefined. */
  lastEntry(): [K, V] | undefined {
    const n = this._keys.length;
    return n ? [this._keys[n - 1], this._vals[n - 1]] : undefined;
  }

  /** Iterate entries in [minKey, maxKey]. */
  *irange(minKey: K, maxKey: K, inclusive: [boolean, boolean] = [true, true]): Iterable<[K, V]> {
    const lo = inclusive[0] ? bisectLeft(this._keys, minKey, this._cmp) : bisectRight(this._keys, minKey, this._cmp);
    const hi = inclusive[1] ? bisectRight(this._keys, maxKey, this._cmp) : bisectLeft(this._keys, maxKey, this._cmp);
    for (let i = lo; i < hi; i++) yield [this._keys[i], this._vals[i]];
  }

  keys(): Iterable<K> { return this._keys.slice(); }
  values(): Iterable<V> { return this._vals.slice(); }

  *entries(): Iterable<[K, V]> {
    for (let i = 0; i < this._keys.length; i++) yield [this._keys[i], this._vals[i]];
  }

  forEach(cb: (value: V, key: K, map: this) => void): void {
    for (let i = 0; i < this._keys.length; i++) cb(this._vals[i], this._keys[i], this);
  }

  clear(): this { this._keys = []; this._vals = []; return this; }

  [Symbol.iterator](): Iterator<[K, V]> {
    return this.entries()[Symbol.iterator]();
  }
}
