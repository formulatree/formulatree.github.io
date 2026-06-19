## 2025-05-14 - [UX] Keyboard Accessibility and Platform Consistency

**Learning:** [UX/a11y insight] In static multi-page applications using custom interactive elements (like `div` with `role="button"` or `role="option"`), keyboard accessibility is often overlooked. Providing both `tabindex="0"` and a global keyboard listener for `Enter`/`Space` activation is essential for functional parity with native elements. Additionally, tailoring keyboard shortcut hints (e.g., `Ctrl+K` vs `⌘K`) based on the user's platform provides a more polished and intuitive experience.

**Action:** [How to apply next time] Always verify that custom interactive elements are focusable and activatable via keyboard. Implement platform detection for UI-specific shortcut hints to match user expectations. Use `:focus-visible` to provide clear focus indicators without cluttering the UI for mouse users.
