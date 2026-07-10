
## 2025-05-14 - Platform-aware Shortcuts and Universal Key Listeners
**Learning:** Detecting the user's platform to show relevant shortcuts (e.g., Ctrl+K vs ⌘K) and implementing a global 'Enter/Space' listener for custom ARIA roles (button, option, tab) ensures that the UI feels native and remains accessible without redundant per-component logic.
**Action:** Implement platform detection for keyboard hints and provide a global listener for ARIA-interactive elements to guarantee keyboard parity for custom components.
