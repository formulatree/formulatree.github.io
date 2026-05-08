## 2025-05-14 - [Data Retrieval Optimization]
**Learning:** Linear traversal of large static data structures in every retrieval function (like `getAllFormulas`) causes significant overhead, especially when functions are called frequently during search (on every keystroke) or related item resolution.
**Action:** Use lazy-initialized Map-based indexes and memoized arrays to achieve $O(1)$ lookups and avoid redundant allocations. Always return shallow copies from these caches to prevent state mutation.
