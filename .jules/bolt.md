## 2025-05-15 - Data Access Layer Optimization
**Learning:** High-frequency calls to `getAllFormulas` (especially during search `input` events) cause significant overhead due to repeated tree traversal and object reconstruction. Map-based indexing provides ~O(1) lookups for IDs and Names, significantly improving cross-linking and formula retrieval.
**Action:** Implement lazy-initialized memoization and Map-based indexes in `data.js`.
