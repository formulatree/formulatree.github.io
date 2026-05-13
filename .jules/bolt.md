## 2025-05-15 - Duplicate ID and Subject Priority in Map Indexing
**Learning:** In a dataset with duplicate IDs across subjects (e.g., 'hyd1' in Physics and Chemistry), a simple Map lookup will lose data unless the indexing logic strictly follows the original traversal order. Using 'first occurrence wins' (if (!map.has(id)) map.set(id, formula)) preserves the functional parity with original Array.find() logic.
**Action:** Always verify if IDs are truly unique before implementing a Map index; if not, ensure the Map is populated in a way that respects existing traversal-based priorities.

## 2025-05-15 - Prefix Search Fallback Efficiency
**Learning:** Implementing a full prefix tree (Trie) for a small dataset (333 items) exceeds the 50-line constraint and adds unnecessary complexity. Maintaining a linear scan as a fallback for the rare prefix-search case in 'resolveGlobalRelated' is a pragmatic trade-off.
**Action:** Prioritize O(1) for common paths (ID/Exact Name) and keep fallback paths simple if they are rarely hit and the dataset is small.
