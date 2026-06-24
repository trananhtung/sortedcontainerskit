# sortedcontainerskit

[![npm](https://img.shields.io/npm/v/sortedcontainerskit)](https://www.npmjs.com/package/sortedcontainerskit)
[![CI](https://github.com/trananhtung/sortedcontainerskit/actions/workflows/ci.yml/badge.svg)](https://github.com/trananhtung/sortedcontainerskit/actions)
[![license](https://img.shields.io/npm/l/sortedcontainerskit)](LICENSE)

Sorted containers for TypeScript/JavaScript: **SortedList** (with duplicates), **SortedSet**, **SortedMap**. Zero dependencies.

Port of Python's [`sortedcontainers`](https://grantjenks.com/docs/sortedcontainers/) — the same clean API, now on npm with full TypeScript types.

```bash
npm install sortedcontainerskit
```

## Why?

- **`sorted-btree`** (475k downloads/week) doesn't allow duplicate keys and lacks index-based access.
- **Java's `TreeMap`/`TreeSet`** and **Python's `SortedList`** have no true npm equivalent.
- All three containers give you **O(log n) bisect, rank, floor, ceiling, and range queries** over sorted data.

## SortedList — duplicates allowed

```ts
import { SortedList, numericCmp } from "sortedcontainerskit";

const sl = new SortedList([5, 1, 3, 1, 2], { comparator: numericCmp });
// [1, 1, 2, 3, 5]

sl.add(2);              // insert 2 in sorted position
sl.count(1);            // 2 — count occurrences
sl.rank(3);             // 3 — elements strictly less than 3
sl.at(0);               // 1 — element at index 0
sl.at(-1);              // 5 — last element
sl.floor(2.5);          // 2 — largest ≤ query
sl.ceiling(2.5);        // 3 — smallest ≥ query
sl.lower(3);            // 2 — largest < query
sl.higher(3);           // 5 — smallest > query
sl.countRange(1, 3);    // 4 — elements in [1, 3]
[...sl.irange(2, 4)];  // [2, 2, 3] — values in range

sl.remove(1);           // remove first occurrence, throws if absent
sl.discard(99);         // no-op if absent
```

## SortedSet — unique values

```ts
import { SortedSet, numericCmp } from "sortedcontainerskit";

const s = new SortedSet([3, 1, 2, 1, 3], { comparator: numericCmp });
// [1, 2, 3]

s.has(2);               // true
s.delete(2);            // true — returns whether it existed
s.rank(3);              // 1 — elements strictly less than 3 (after delete)
s.floor(2.5);           // 1
s.ceiling(2.5);         // 3
s.at(0);                // 1

// Set algebra — returns new SortedSet
s.union(new SortedSet([4, 5], { comparator: numericCmp }));
s.intersection(new SortedSet([1, 3, 5], { comparator: numericCmp }));
s.difference(new SortedSet([3], { comparator: numericCmp }));
```

## SortedMap — map with sorted keys

```ts
import { SortedMap, numericCmp } from "sortedcontainerskit";

const m = new SortedMap([[3, "c"], [1, "a"], [2, "b"]], { comparator: numericCmp });
// keys: [1, 2, 3]

m.get(2);               // "b"
m.floor(2.5);           // [2, "b"] — [key, value] with largest key ≤ query
m.ceiling(2.5);         // [3, "c"]
m.lower(2);             // [1, "a"]
m.higher(2);            // [3, "c"]
m.firstEntry();         // [1, "a"]
m.lastEntry();          // [3, "c"]

[...m.irange(1, 2)];   // [[1, "a"], [2, "b"]]
[...m.keys()];          // [1, 2, 3]
[...m.values()];        // ["a", "b", "c"]
[...m.entries()];       // [[1,"a"], [2,"b"], [3,"c"]]
```

## Custom comparators

```ts
import { SortedSet } from "sortedcontainerskit";

// Sort strings by length, then lexicographically
const s = new SortedSet(["foo", "a", "hello", "ab"], {
  comparator: (a, b) => a.length - b.length || a.localeCompare(b),
});
// ["a", "ab", "foo", "hello"]
```

## Bisect utilities (exported)

```ts
import { bisectLeft, bisectRight, numericCmp } from "sortedcontainerskit";

const arr = [1, 2, 2, 3, 5];
bisectLeft(arr, 2, numericCmp);  // 1 — leftmost insert position (like Python bisect.bisect_left)
bisectRight(arr, 2, numericCmp); // 3 — rightmost insert position
```

## Complexity

| Operation | SortedList | SortedSet | SortedMap |
|-----------|-----------|-----------|-----------|
| `add` / `set` | O(n) | O(n) | O(n) |
| `delete` / `remove` | O(n) | O(n) | O(n) |
| `has` / `get` | O(log n) | O(log n) | O(log n) |
| `rank` / `floor` / `ceiling` | O(log n) | O(log n) | O(log n) |
| `count` / `countRange` | O(log n) | O(log n) | — |
| `at` (index access) | O(1) | O(1) | — |
| `irange` iteration | O(log n + k) | O(log n + k) | O(log n + k) |

> Backing store is a sorted array. Suitable for up to ~100k elements. For larger sets, consider a B-tree implementation.

## License

MIT
