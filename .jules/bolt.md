## 2026-07-23 - Lazy Map-Based Indexing with Order and Multi-Match Parity
**Learning:** Dynamic object scans across nested arrays in `data.js` (`getAllFormulas()`, `getFormulaById()`, `resolveGlobalRelated()`) cause severe O(N) linear-time bottlenecks under frequent lookups. Implementing a static Map cache is highly effective but introduces subtle functional parity constraints:
- Duplicate IDs (like `hyd1`–`hyd9`) must resolve to the first encountered instance to match `Array.prototype.find()`.
- Search priority fallback order in `resolveGlobalRelated` must match the original exact and prefix lookups.
- Object property key order (e.g. inserting `section` between `subject` and `chapter` for section-based subjects) must be preserved to satisfy strict serialization tests.
**Action:** Always construct lazy-loaded Map lookups using the exact sequential traversal of the original function to capture priority fallback sequence and first-match behavior natively, preserving key order in mapped objects.
