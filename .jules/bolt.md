## 2025-05-15 - [Data Structure Priority and Duplicate IDs]
**Learning:** The `data.js` file contains duplicate formula IDs and names across different chapters. The original linear search implementation implicitly prioritized the first occurrence.
**Action:** When implementing Map-based indexing, ensure the first occurrence is preserved in the Map (using `if (!map.has(key)) map.set(key, val)`) to maintain functional parity with original O(N) lookup.
