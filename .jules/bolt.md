## 2025-05-15 - Data Indexing and Property Order Parity
**Learning:** In static applications where data retrieval is performed via linear search on every interaction (like search inputs), implementing lazy-initialized Map-based indexes provides massive performance gains (e.g., ~220x for ID lookups). However, when validating parity with an original implementation, the order of properties in reconstructed objects (e.g., `{ subject, chapter, ...f }`) must match exactly to pass strict deep equality checks and maintain consistent JSON serialization.

**Action:** Always verify object construction order when replacing linear search with index-based retrieval to ensure perfect functional parity and avoid validation failures in downstream consumers that might rely on property iteration order.
