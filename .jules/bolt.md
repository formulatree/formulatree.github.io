## 2025-07-05 - Map-based Indexing for Large Static Datasets
**Learning:** O(N) scans in frequently called utility functions (like `find` on a dataset of ~300 items) can escalate to (N^2)$ or worse when called within loops or high-frequency event listeners (e.g., `input` events). Replacing linear scans with Map-based hash lookups and memoizing results provides immediate, dramatic performance gains.
**Action:** Always identify O(N) search patterns in data-heavy scripts and consider lazy Map-based indexing if the data is static or infrequently changed.
