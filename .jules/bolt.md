
## 2026-07-14 - Lazy Indexing for Global Formula Data
**Learning:** O(N) linear scans on large data objects (like SUBJECTS) in frequently called utility functions can cause significant cumulative delay. Replacing these with lazy-initialized Map-based lookups provides O(1) performance while keeping the initial load fast.
**Action:** Always check if utility functions are re-computing results or performing full scans on every call. Use Maps for IDs and names, and ensure the indexing logic preserves original object property order and search priority.
