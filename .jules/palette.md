## 2025-05-14 - Global Keyboard and Platform-Aware UX
**Learning:** For static sites with custom interactive components (like cards and headers), a global keyboard listener in a shared script (like data.js) is a highly efficient way to implement Enter/Space activation without duplicating logic. Additionally, platform-specific shortcut hints (Ctrl+K vs ⌘K) significantly improve the "feel" for non-Mac users.
**Action:** Use a centralized keyboard handler for ARIA-roled elements and implement a DOMContentLoaded listener for environment-based UI adjustments.
