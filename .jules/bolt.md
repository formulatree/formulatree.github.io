## 2024-06-22 - [Map-based Indexing]
**Learning:** For datasets with high-frequency lookups (like search and cross-references), lazy-initialized Map-based indexes provide a massive performance boost (~30-200x) over linear array scans. Maintaining "first-match-wins" parity is critical when duplicate IDs exist.
**Action:** Use `Map` for ID and name lookups and `memoize` expensive results for data retrieval functions.
