## 2026-05-20 - Data Indexing and Memoization in Static Apps
**Learning:** In static data-driven applications, repeated linear traversals of a large nested object hierarchy (like SUBJECTS) introduce significant O(N) overhead for every lookup. Lazy-initialized Map-based indexing reduces lookup time to O(1) while maintaining a clean API.
**Action:** Always consider flattening and indexing hierarchical data if multiple lookups are performed during a single user session or search operation.
