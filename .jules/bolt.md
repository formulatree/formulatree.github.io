## 2025-05-22 - [Memoization of Static Formula Data]
**Learning:** In a static data-driven app (no backend), O(N) flattening and searching of the central data object on every search keystroke or link resolution is a major bottleneck.
**Action:** Use lazy-initialized Maps to cache the flattened data and provide O(1) lookups for IDs and names. This reduced execution time of key functions from ~1.2s to ~3ms for 10,000 iterations.
