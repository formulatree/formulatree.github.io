## 2024-07-19 - Lazily-indexed formula searches
**Learning:** Initializing Map-based indexes lazily upon the first query in data.js yields tremendous speedups while avoiding extra upfront processing when pages load.
**Action:** Always prefer lazy index initialization and cached lookup lists for dataset searches over repeating O(N) array scans.
