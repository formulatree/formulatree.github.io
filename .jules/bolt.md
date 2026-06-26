## 2026-06-26 - [Lazy Indexing for Data Retrieval]
**Learning:** For static datasets used frequently for lookups (like formula IDs and names), linear O(N) traversal in getter functions is a common bottleneck, especially when triggered on every keystroke in search.
**Action:** Use lazy-initialized Map-based indexing and memoization to convert O(N) searches into O(1) lookups while avoiding startup overhead.

## 2026-06-26 - [Parity and Benchmarking]
**Learning:** When refactoring core data retrieval logic, maintaining strict functional parity (including first-match priority for duplicate IDs/names) is critical.
**Action:** Always write and run explicit parity check scripts (`verify_parity.js`) and benchmarks (`benchmark.js`) to prove both correctness and performance gains before submission.
