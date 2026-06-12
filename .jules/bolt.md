## 2026-06-12 - Initial Performance Assessment
**Learning:** The current `data.js` implementation relies on linear scans (O(n)) for all retrieval operations. `getAllFormulas` is called repeatedly (especially by `getFormulaById` and `resolveGlobalRelated`), leading to redundant iterations over the 333-formula dataset.
**Action:** Implement lazy indexing with Maps and memoization for `getAllFormulas` to achieve O(1) lookups.

**Baseline Metrics (1000 iterations):**
- `getAllFormulas`: 327ms
- `getFormulaById` (last element): 108ms
- `resolveGlobalRelated` (last element): 140ms

## 2026-06-12 - Optimization Results
**Learning:** Lazy indexing with Maps significantly reduces lookup times from O(n) to O(1). Memoizing the `getAllFormulas` array further eliminates redundant object creation and traversal.
**Impact:**
- `getAllFormulas`: ~327ms -> ~4ms (per 1000 calls)
- `getFormulaById`: ~108ms -> ~0.3ms (per 1000 calls)
- `resolveGlobalRelated`: ~140ms -> ~1ms (per 1000 calls)
Speedup: ~80x to ~360x faster retrieval.
