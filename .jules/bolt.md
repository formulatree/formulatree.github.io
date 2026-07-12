## 2026-07-12 - O(N) scans in large data files
**Learning:** O(N) scans in frequently called utility functions (like `find` on a dataset of ~300 items) can escalate to $O(N^2)$ or worse when called within loops or high-frequency event listeners (e.g., `input` events). Replacing linear scans with Map-based hash lookups and memoizing results provides immediate, dramatic performance gains.
**Action:** Always prefer Map-based indexing for repetitive lookups by ID or unique names, and memoize flattened representations of nested data structures.
