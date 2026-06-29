## 2026-06-29 - Map-based Indexing for Large Datasets
**Learning:** O(N) linear scans on datasets of ~300+ items (like `getAllFormulas().find()`) significantly impact performance when called within frequent event listeners (like `input` events). Memoizing the full list and using Map-based hash lookups for ID and name matches provides massive (100x-300x) speedups.
**Action:** Always prefer Map-based indexing over repeated `.find()` or `.filter()` on static datasets. Ensure "first-match-wins" parity by checking `Map.has()` before inserting.
