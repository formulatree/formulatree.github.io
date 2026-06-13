## 2025-05-15 - Data Retrieval Indexing
**Learning:** Linear O(N) traversal of nested 'SUBJECTS' object was a significant bottleneck during frequent search input events and cross-referencing. Implementing Map-based indexing and memoization yielded >40x performance gains.
**Action:** Use Map-based lookups and lazy-initialized indexing for static data sets that are frequently queried by ID or name.
