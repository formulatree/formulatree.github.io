## 2025-05-15 - Initial Performance Pass
**Learning:** Found that `getAllFormulas()` is O(N) and called on every search keystroke and multiple times during formula resolution. It recreates all formula objects every time.
**Action:** Implement lazy indexing with Maps for O(1) lookups and memoize the formula list to avoid redundant object creation and iteration.
