## 2024-07-16 - Lazy Indexing for Performance
**Learning:** In applications where data is static and lookups are frequent (like searching or resolving related links), replacing O(N) linear scans with lazy-initialized Map-based indexing provides significant performance gains (>100x speedup) with minimal architectural complexity.
**Action:** Always look for O(N) array scans (like `.find()` or `.filter()`) in performance-critical paths and consider introducing a Map/Set cache if the data is stable.
