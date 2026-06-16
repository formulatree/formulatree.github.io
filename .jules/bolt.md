## 2025-05-15 - Map-based Indexing for Large Data Objects
**Learning:** Linear search (O(N)) on large data objects (like formula lists) becomes a significant bottleneck when triggered on every keystroke in search interfaces. Map-based lookups (O(1)) provide massive speedups (~250x) with minimal memory overhead.
**Action:** Always prefer lazy-initialized Map indexes for frequent lookups by ID or name in data-heavy static applications.
