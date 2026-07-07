## 2025-07-07 - O(N) linear scans in data retrieval
**Learning:** O(N) scans in frequently called utility functions (like `find` on a dataset of ~300 items) can escalate to O(N²) or worse when called within loops (e.g., rendering related formulas). Replacing linear scans with Map-based hash lookups and memoizing results provides immediate, dramatic performance gains (up to 300x in this codebase).
**Action:** Always check for linear array searches in core data retrieval paths and replace with Map/Set indexing for O(1) access.

## 2025-07-07 - Scope issues with eval() in Node scripts
**Learning:** When using `eval()` in Node.js utility scripts to load a browser-targeted JS file like `data.js`, `let` declarations are block-scoped and won't be visible to the calling script if they aren't part of the global object.
**Action:** Replace 'let ' with 'var ' in the source string before calling `eval()` to ensure internal state variables are accessible for verification and benchmarking.
