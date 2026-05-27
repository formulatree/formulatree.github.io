## 2025-05-15 - Optimizing Static Data Retrieval with Lazy Indexing

**Learning:** Re-traversing large nested objects on every data access call (O(n)) can be a significant bottleneck even with a relatively small dataset (~333 items). Lazy-initialized Maps provide O(1) lookups while minimizing memory overhead by only building the index once upon first use.

**Action:** Identify expensive traversal patterns in static data files and replace them with lazily-indexed Maps for ID and name lookups. Always return shallow copies to prevent accidental mutation of the cached data.
