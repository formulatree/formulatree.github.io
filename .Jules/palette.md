## 2026-06-13 - Platform-aware shortcut hints
**Learning:** Hardcoded keyboard shortcut hints (like '⌘K') can be confusing for non-Mac users. A simple DOMContentLoaded listener can detect the platform via 'navigator.platform' and normalize these hints.
**Action:** Use a global listener in shared JS to update <kbd> elements across the site for better cross-platform UX.
