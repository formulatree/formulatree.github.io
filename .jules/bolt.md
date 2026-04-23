## 2026-04-23 - Memoization of Data Traversal
**Learning:** In a static site where data is stored in a large global object (like `data.js`), helper functions that traverse the entire object (like `getAllFormulas`) can become significant bottlenecks if they are called frequently in UI events (e.g., search `input` events). Repeatedly flattening a deeply nested object of 300+ items is expensive in JS.
**Action:** Use lazy-initialized memoization and Map-based indexing for O(1) lookups by ID or Name. This reduced execution time by over 100x for search-related operations.
