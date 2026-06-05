# Palette's Journal — FormulaTree

UX and accessibility learnings for the FormulaTree project.

## 2026-06-05 - Search Modal Accessibility and Platform Polish
**Learning:** Decorative icons (emojis) should be hidden from screen readers using `aria-hidden="true"`. Modals require `role="dialog"` and `aria-modal="true"` for proper screen reader context. Keyboard shortcut hints should be platform-aware to avoid confusing non-Mac users with the `⌘` symbol.
**Action:** Always apply ARIA roles to modals and hide decorative elements. Use `navigator.userAgent` for platform detection of shortcuts.
