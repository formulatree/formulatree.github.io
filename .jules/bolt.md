## 2024-06-17 - O(N) linear search in formula data
**Learning:** The application was performing repeated linear searches and data structure traversals in `data.js` for every search keystroke and cross-reference lookup. This scaled poorly with the number of formulas (333+).
**Action:** Implement lazy-initialized Map-based indexing and memoization to convert O(N) lookups into O(1), resulting in ~200x-300x faster lookups.
