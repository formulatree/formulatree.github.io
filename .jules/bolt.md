## 2026-04-05 - Data Access Optimization
**Learning:** Initial data access in 'data.js' was O(N) due to repeated construction of the full list.
**Action:** Use lazy-initialized memoization and Map-based indexing to achieve O(1) lookups for IDs and names. Verified ~400x speedup in Node.js benchmarks.
