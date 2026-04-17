# Bolt's Performance Journal

## 2025-05-14 - Data retrieval bottleneck in data.js
**Learning:** The 'getAllFormulas' function was performing a full nested traversal of the large 'SUBJECTS' object on every call. Since this was used by search and related formula lookups, it caused significant (N)$ overhead and UI lag during rapid interactions.
**Action:** Implement lazy-initialized memoization and Map-based indexing for IDs and names to achieve (1)$ lookups and avoid redundant traversals.
