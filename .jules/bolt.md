## 2025-05-14 - Map-based Indexing for Browser Data
**Learning:** For static data objects like `SUBJECTS`, implementing lazy-initialized Map-based indexes significantly reduces the time complexity of lookups from O(N) to O(1). In this codebase, `getAllFormulas` was being called frequently (e.g., on every search keystroke), and each call performed a full traversal and object allocation. Memoizing this collection and using Maps for ID and Name lookups provided speed gains of over 200x for individual lookups.
**Action:** Always check if frequently called data retrieval functions in static applications are performing redundant traversals, and implement lazy-initialized indexing.

## 2025-05-14 - Benchmarking Browser JS in Node.js
**Learning:** When using Node.js `vm` module to benchmark browser-side JavaScript, top-level `const` declarations are not automatically attached to the sandbox object.
**Action:** Use `var` instead of `const` for top-level variables during benchmarking, or ensure the execution context properly exposes the desired globals for test logic.
