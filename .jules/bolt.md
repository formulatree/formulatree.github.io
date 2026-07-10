## 2026-07-10 - O(N) to O(1) Data Retrieval in data.js
**Learning:** In applications with static data files (like data.js), linear scans (O(N)) using `.find()` can become a performance bottleneck when called frequently (e.g., during search input events). Lazy initialization of Map-based indexes provides immediate, dramatic performance gains (~200x) while preserving the simple structure of the source data.
**Action:** Always look for repeated traversals of large objects/arrays and replace them with memoized collections or hash-based lookups.
