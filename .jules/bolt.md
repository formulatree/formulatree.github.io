## 2026-06-28 - Optimized formula retrieval and indexing in data.js
**Learning:** O(N) linear scans in frequently called utility functions (like `getAllFormulas` and `resolveGlobalRelated`) can cause UI lag and inefficient lookups as the dataset grows (e.g., 333 items). Replacing these with Map-based hash lookups and memoizing the flattened dataset results in ~100x-300x speedup.
**Action:** Always prefer Map-based indexing for ID and name lookups when functional parity (like first-match-wins) can be preserved.
