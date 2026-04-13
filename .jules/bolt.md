## 2026-04-13 - Memoization and Map-based indexing in data.js
**Learning:** O(N) linear scans through large nested objects (like SUBJECTS) in frequently called functions (search, related links) cause measurable latency (~0.35ms per scan).
**Action:** Use lazy-initialized memoization for full list retrieval and Maps for O(1) ID/Name lookups to achieve near-instantaneous response times for data access.
