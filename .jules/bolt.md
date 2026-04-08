## 2025-05-24 - [Data Retrieval Optimization]
**Learning:** Frequent O(N) traversals of the hierarchical `SUBJECTS` object were causing measurable lag in search and related-formula resolution. Each lookup for a related formula or a search result was re-flattening the entire data tree.
**Action:** Implement lazy-initialized memoization for the flattened formula list and O(1) Map-based indexing for ID and Name lookups. This achieved a ~260x speedup for data retrieval and ~45x speedup for relation resolution. Always remove benchmark scripts before submitting.
