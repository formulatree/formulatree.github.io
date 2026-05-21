## 2026-05-21 - Accessible Search and Platform-Aware UX Patterns
**Learning:** Custom search results and modals require explicit ARIA roles (listbox/option, dialog) and state management (aria-hidden, aria-modal) to be accessible. Platform-specific keyboard hints (⌘K vs Ctrl+K) significantly improve user intuition across different operating systems.
**Action:** Always implement the listbox/option pattern for dynamic search results and use a global keydown listener in shared scripts (like data.js) to provide keyboard activation for non-native interactive elements.
