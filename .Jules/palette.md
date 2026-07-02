# Palette UX Journal

## 2025-05-14 - Search Accessibility and Platform Awareness
**Learning:** Custom interactive elements (like search results and chapter cards) require explicit `role` and `tabindex` to be discoverable by screen readers and keyboard users. OS-specific shortcut hints (⌘K vs Ctrl+K) significantly improve the "it just works" feeling for non-Mac users. A centralized keyboard listener in `data.js` for custom roles like `button`, `option`, and `tab` provides a consistent experience without duplicating logic across every page.
**Action:** Always include ARIA roles and keyboard activation support for custom UI components. Use `navigator.platform` (or modern alternatives) to provide OS-appropriate instructions.
