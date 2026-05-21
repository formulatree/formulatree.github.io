## 2025-05-14 - Map-based Indexing for Multi-Subject Data
**Learning:** In a dataset with duplicate keys across different categories (e.g., formula IDs shared between Physics and Mathematics), a simple global Map lookup can break functional parity if the original implementation used linear traversal with specific priority.
**Action:** Use composite keys (e.g., `subj:id`) or check existence before insertion (`if (!map.has(key)) map.set(key, val)`) to preserve the "first occurrence wins" logic of the original traversal.
