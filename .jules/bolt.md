## 2024-04-24 - Data Access Optimization in Static Data Stores

**Learning:** Static applications relying on large central data objects (like 'SUBJECTS' in data.js) often suffer from "O(n) death" where every lookup or search filter triggers a full traversal or flattening of the data. In this codebase, 'getAllFormulas' was being called on every search 'input' event and within every 'resolveGlobalRelated' call, leading to redundant work.

**Action:** Implement lazy-initialized memoization for the flattened data and build Map-based indexes (ID and Name) upon first access. This converts O(n) searches into O(1) lookups and drastically reduces UI latency during rapid search input.
