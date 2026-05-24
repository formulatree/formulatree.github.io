# Bolt's Performance Journal

## 2026-05-24 - Data Retrieval Optimization in data.js
**Learning:** Linear search in `getAllFormulas`, `getFormulaById`, and `resolveGlobalRelated` becomes a bottleneck as the dataset grows (333 formulas). Repeatedly traversing the entire SUBJECTS object is inefficient.
**Action:** Implement lazy-initialized Map-based indexes and memoization to achieve O(1) lookups and O(n) once-per-app-lifecycle traversal.
