## 2025-05-24 - Interactive Accessibility Patterns
**Learning:** When using custom roles like `role="button"` or `role="option"` on non-semantic elements (e.g., `div` or `span`), it is critical to implement manual `keydown` listeners for 'Enter' and 'Space' and ensure `tabindex="0"` is present for keyboard focusability. Additionally, for interactive components like accordions, synchronizing `aria-expanded` state is necessary for screen reader clarity.
**Action:** Apply a global `keydown` listener for custom roles and ensure state-reflecting ARIA attributes are updated in the same logic that handles the visual state change.

## 2025-05-24 - Platform-Aware UX
**Learning:** Providing platform-specific shortcut hints (e.g., 'Ctrl+K' vs '⌘K') creates a more "native" and delightful experience for users on different operating systems.
**Action:** Detect platform via `navigator.platform` and dynamically update `<kbd>` elements or help text to reflect the correct modifier keys for the user's environment.
