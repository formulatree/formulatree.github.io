## 2025-05-14 - Data Access Optimization in data.js
**Learning:** Repeatedly traversing the nested SUBJECTS object to flatten it (via getAllFormulas) was a significant bottleneck, especially during real-time search. Lazy-initialized memoization and Map-based indexing provided a ~190x speedup for data retrieval and ~8x for related formula resolution.
**Action:** Use lazy-initialized memoization and Map-based indexes for static datasets that are frequently queried by ID or Name.
