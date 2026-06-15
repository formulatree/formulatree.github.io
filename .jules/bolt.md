## 2024-06-15 - [O(1) Data Retrieval Optimization]
**Learning:** The previous implementation of `getAllFormulas` was creating a new flattened array on every call, leading to O(N) overhead even for simple lookups like `getFormulaById`. Lazy-initialized indexing with Maps significantly improves performance without upfront cost.
**Action:** Always check if frequently called retrieval functions are performing redundant data transformations or linear searches when a Map-based index could be used.
