## 2026-06-03 - Optimized formula retrieval in data.js
**Learning:** Initial linear traversal in `getAllFormulas`, `getFormulaById`, and `resolveGlobalRelated` was a significant bottleneck (~313ms for 1000 `getAllFormulas` calls). Implementing lazy indexing with `Map` and a results cache reduced this to ~5ms.
**Action:** Use lazy initialization and `Map` for lookups in data-heavy modules. Return shallow copies of cached arrays to prevent accidental mutation.
