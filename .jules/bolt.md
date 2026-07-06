## 2024-07-06 - Optimized Formula Retrieval with Lazy Indexing
**Learning:** O(N) linear scans in frequently called data retrieval functions (like `find` on a dataset of ~300 items) can become a bottleneck when scaled or called in loops (e.g., related formula resolution). Replacing these with Map-based hash lookups provides dramatic speedups.
**Action:** Always prefer Map-based indexing for ID or name-based lookups in static datasets. Use lazy initialization to avoid upfront costs if the data isn't always needed.
