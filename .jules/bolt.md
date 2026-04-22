## 2025-04-22 - Data Access Optimization in `data.js`

**Learning:** Data retrieval in `data.js` was using $O(n)$ array scans and reconstructing large data structures on every call. By implementing lazy-initialized memoization and Map-based indexing, significant performance gains were achieved for frequently called functions like `getAllFormulas`, `getFormulaById`, and `resolveGlobalRelated`.

**Action:** Always check if core data access functions in static-data-driven applications are performing redundant work or using inefficient search algorithms. Use Maps for ID and name lookups to provide $O(1)$ access times.
