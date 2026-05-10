## 2025-05-15 - Indexing with Priority and CRLF handling
**Learning:** In static datasets with duplicate IDs/names across categories, O(1) Map-based indexing must strictly follow the original traversal order (first-occurrence-wins) to maintain functional parity. Additionally, CRLF line endings in legacy files can cause standard diff tools to fail; using Python in binary mode for replacements is a reliable workaround.
**Action:** Always verify for duplicates before choosing an indexing strategy and use robust binary-mode tools for editing files with non-standard line endings.
