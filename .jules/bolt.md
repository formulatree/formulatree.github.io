## 2025-10-14 - Map Indexing Parity with Array.prototype.find
**Learning:** In data structures where IDs may be duplicated across distinct chapters (such as `hyd1` to `hyd9` in this dataset), Map-based caching (`_idMap.set(id, item)`) must only record the first occurrence (`if (!_idMap.has(id))`) to preserve exact functional parity with original baseline lookups using `Array.prototype.find`.
**Action:** Always check for duplicate keys in dataset arrays before replacing linear `Array.prototype.find` scans with Map indexes.
