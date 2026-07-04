## 2026-07-04 - Map-based Indexing for Formula Retrieval
**Learning:** Linear O(N) scans on a dataset of ~330 items, when performed repeatedly (e.g., in a loop or search listener), create a noticeable performance bottleneck (~200ms per 1000 calls). Memoizing the flat array and building Map-based indexes (ID, name, and prefix) reduces this to O(1) and provides a ~30x-300x speedup.
**Action:** Always prefer hash-based lookups for static or slowly changing datasets that are queried frequently by key.
