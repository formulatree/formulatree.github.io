## 2025-05-14 - Optimized Data Retrieval in data.js
**Learning:** Linear searches in frequently called data retrieval functions (like `getAllFormulas`, `getFormulaById`, and `resolveGlobalRelated`) create a performance bottleneck as the dataset grows. Memoization and Map-based lookups provide a significant speedup.
**Action:** Use lazy-initialized Map indexes for O(1) lookups and memoize complex array constructions.
