## 2025-05-14 - Map-based Indexing for Formula Data
**Learning:** Frequent traversals of nested data structures (like the SUBJECTS object) for search and cross-referencing cause measurable UI lag. Memoizing the flattened list and creating Map-based indexes (ID, Name, Subject|Name) reduces lookup time from O(N) to O(1).
**Action:** Use lazy-initialized Maps for high-frequency data access patterns in client-side data modules.

## 2025-05-14 - Handle CRLF in automated replacements
**Learning:** This repository uses CRLF line endings. Standard string replacements in Python or `sed` can fail if they don't account for `\r\n`, and `replace_with_git_merge_diff` is also sensitive to exact whitespace.
**Action:** When performing automated text updates, use binary mode (`rb`/`wb`) and explicit `\r\n` normalization if string matching fails.
