## 2026-07-01 - Global Keyboard Listener for ARIA Roles
**Learning:** In applications using many custom interactive elements (divs/spans with roles), a centralized keyboard listener in a shared JS file is more maintainable than individual 'keydown' handlers for each element. It ensures consistent 'Enter' and 'Space' behavior across the app while avoiding redundant code.
**Action:** Implement a guarded global listener that checks for 'role' attributes and excludes native interactive tags to prevent double-triggering.

## 2026-07-01 - Platform-Aware Keyboard Hints
**Learning:** Users on different operating systems expect different keyboard shortcuts. Providing Mac-specific (⌘K) vs. Windows/Linux (Ctrl+K) hints in the UI reduces friction and makes the app feel more native to the user's environment.
**Action:** Use 'navigator.platform' (with appropriate fallback) to detect OS and dynamically update shortcut text and aria-labels on load.
