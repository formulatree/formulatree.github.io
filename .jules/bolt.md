## 2025-05-22 - Memoize static data flattening
**Learning:** The 'getAllFormulas()' function in 'data.js' was flattening the entire 'SUBJECTS' object (333 formulas) on every call. Since 'SUBJECTS' is a static constant, this caused redundant CPU cycles and object allocations during frequent operations like search-as-you-type.
**Action:** Memoize results of expensive operations performed on static data structures to achieve O(1) performance after the initial computation.
