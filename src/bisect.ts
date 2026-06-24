/**
 * Binary search primitives (mirrors Python's bisect module).
 * All operate on sorted arrays with a comparator returning negative/zero/positive.
 */

export type Comparator<T> = (a: T, b: T) => number;
export const numericCmp: Comparator<number> = (a, b) => a - b;
export const stringCmp: Comparator<string> = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
export const defaultCmp = <T>(a: T, b: T): number =>
  (a as unknown as string) < (b as unknown as string) ? -1 :
  (a as unknown as string) > (b as unknown as string) ? 1 : 0;

/** Index of leftmost position where value can be inserted keeping sort order (like Python bisect_left). */
export function bisectLeft<T>(arr: T[], value: T, cmp: Comparator<T>): number {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (cmp(arr[mid], value) < 0) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** Index of rightmost position where value can be inserted keeping sort order (like Python bisect_right). */
export function bisectRight<T>(arr: T[], value: T, cmp: Comparator<T>): number {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (cmp(arr[mid], value) <= 0) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
