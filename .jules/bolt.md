## 2026-06-07 - Optimized formula retrieval with indexing and memoization
**Learning:** The previous implementation of data retrieval in `data.js` was performing a full object traversal and flattening of the `SUBJECTS` object on every call to `getAllFormulas()`. This led to (N)$ performance for simple retrievals and (N^2)$ for related formula lookups in `resolveGlobalRelated`, causing noticeable UI lag during search and page transitions as the formula count grew.

**Action:** Replaced linear searches with Map-based hash lookups ((1)$) and memoized the flattened formula list. Future performance tasks should prioritize lazy-initialized indexing for static data structures to maintain low latency during user interactions.
