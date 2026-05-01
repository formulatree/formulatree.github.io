## 2025-05-14 - Optimized Data Access in data.js
**Learning:** Returning cached object references directly from Map lookups can lead to state corruption if the caller mutates the objects. The original implementation implicitly returned fresh copies by reconstructing objects in a loop.
**Action:** When implementing memoization for data collections, return shallow copies of both the collection (e.g., `[...array]`) and individual items (e.g., `{...item}`) to maintain data isolation while benefiting from O(1) lookups.
