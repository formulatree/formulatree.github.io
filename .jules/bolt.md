## 2025-05-14 - Initial Journal
**Learning:** Found that `getAllFormulas` is called repeatedly by multiple functions (`getFormulaById`, `resolveGlobalRelated`, search handlers) and reconstructs the entire 333-formula array on every call, leading to O(N^2) or worse behavior during page load and search.
**Action:** Implement lazy-initialized memoization and Map-based indexing in `data.js` to reduce lookups to O(1) and avoid redundant array allocations.
