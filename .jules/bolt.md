## 2026-04-02 - Data Access Memoization & Map Indexing
**Learning:** Initial data traversal in `data.js` was O(N) for each call to `getAllFormulas()`, `getFormulaById()`, and `resolveGlobalRelated()`. For ~333 formulas, this overhead adds up during search and navigation.
**Action:** Implemented lazy-initialized memoization for the full formula list and added Map-based indexing for IDs and name-based lookups, reducing average access time from ~0.1ms to <0.002ms.
