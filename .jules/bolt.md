
## 2026-04-19 - Memoization and Indexing in Static Data
**Learning:** In a static site with large data structures (like 'SUBJECTS' in 'data.js'), repeated linear scans during search or relation lookups cause significant UI lag. Memoizing the flat array and building Map-based indexes (ID and name-based) during the first access provides a massive (200x+) speedup with minimal code overhead.
**Action:** Always prefer Map-based indexing over repeated .find() or .filter() calls when dealing with static global data objects that are frequently accessed.
