## 2025-05-14 - [Maintaining Parity with Duplicate IDs]
**Learning:** The codebase contains duplicate formula IDs across different subject sections (e.g., 'hyd1' in both Inorganic and Organic Chemistry). The original linear traversal implicitly implemented a "first-match-wins" priority.
**Action:** When implementing Map-based indexes, use `if (!map.has(key)) map.set(key, value)` to ensure functional parity with the original search behavior.

## 2025-05-14 - [Benchmarking Browser-Side Data Files in Node.js]
**Learning:** To benchmark browser-side JS files like 'data.js' in Node.js, top-level 'const' or 'let' declarations do not attach to the context object in the 'vm' module.
**Action:** Use `code.replace('const SUBJECTS =', 'var SUBJECTS =')` or explicitly attach variables to the context to make them accessible for benchmarking iterations.
