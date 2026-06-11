## 2025-05-15 - [Optimized formula retrieval with Map-based indexing]
**Learning:** The `getAllFormulas` function was performing a full object traversal on every call, and other retrieval functions were performing linear searches on the resulting array. By implementing a lazy-initialized indexing system using `Map`, lookups were improved from O(n) to O(1).
**Action:** Use Map-based lookups and lazy-initialized caches for frequently accessed data structures derived from large static objects.
