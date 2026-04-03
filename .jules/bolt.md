## 2025-05-15 - [O(1) Formula Lookups]
**Learning:** The `getAllFormulas()` function was being called multiple times per request (e.g., once for searching, and potentially once for each 'related' formula link generation). Since it performed a full recursive traversal of the `SUBJECTS` object, this created an O(N^2) or O(N*M) bottleneck as the dataset grew.
**Action:** Implement lazy-initialized memoization and Map-based indexing for IDs and names to reduce lookup complexity to O(1) for exact matches and O(N) for initial data load.
