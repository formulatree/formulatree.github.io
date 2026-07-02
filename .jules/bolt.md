## 2025-07-02 - O(N) scans in data retrieval
**Learning:** O(N) scans in frequently called utility functions (like `find` on a dataset of ~300 items) can escalate to $O(N^2)$ or worse when called within loops or high-frequency event listeners (e.g., `input` events). Replacing linear scans with Map-based hash lookups and memoizing results provides immediate, dramatic performance gains.
**Action:** Always identify if a function performing linear searches is called in a loop or event listener, and replace it with a Map-based lookup or memoized cache if the data is relatively static.
