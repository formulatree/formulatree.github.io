## 2026-07-11 - Optimized data retrieval in data.js
**Learning:** O(N) scans in frequently called utility functions (like search helpers) can be a major performance bottleneck even for relatively small datasets (~300 items) when they involve redundant object creation and nested iterations. Map-based indexing and lazy-loading of caches provide immediate, massive speedups (~200x in this case).
**Action:** Identify central data-access functions and replace linear scans with Map lookups or memoized results.
