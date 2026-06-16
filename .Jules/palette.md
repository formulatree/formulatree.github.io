## 2025-05-15 - Global Keyboard Listener for Custom Roles
**Learning:** In static multi-page apps without a component framework, a global keyboard listener in a shared JS file is an efficient way to handle "Enter" and "Space" activation for custom roles (button, option) across all pages, provided it explicitly excludes native interactive elements to avoid event duplication.
**Action:** Implement a generic `keydown` listener in `data.js` that checks for `role="button"` or `role="option"` and calls `.click()` on the target.

## 2025-05-15 - Platform-Aware Shortcut Hints
**Learning:** Hardcoded keyboard shortcuts (like ⌘K) can be confusing for non-Mac users. Detecting the platform and updating the hint dynamically improves the UX for Windows/Linux users.
**Action:** Use `navigator.platform` to detect Mac and replace `\u2318K` with `Ctrl+K` in `<kbd>` elements.

## 2025-05-15 - ARIA Sync for Dynamic Content
**Learning:** For accordion-style components (formula cards) and tabs, ensuring the `aria-expanded` and `aria-selected` states are synchronized with class changes (like `.open` or `.active`) is critical for screen reader users to understand the current state of the UI.
**Action:** Update all state-changing functions (`toggleCard`, `switchSection`) to also update the corresponding ARIA attributes.
