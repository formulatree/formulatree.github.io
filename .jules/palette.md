# Palette's Journal 🎨

## 2025-02-12 - Standardizing Accessible Search Actions Across Multi-page Applications
**Learning:** In multi-page applications, search triggers and keyboard shortcut indicators should maintain perfect semantic and visual parity. Screen readers can read out redundant or confusing keyboard symbols like "⌘K" literally unless they are hidden with `aria-hidden="true"`, and the buttons are given clear, descriptive `aria-label` attributes that append the correct platform-specific shortcut (e.g., "Ctrl+K" on Windows/Linux vs "⌘K" on macOS).
**Action:** Always wrap keyboard shortcut visual hints in `<kbd aria-hidden="true">` and dynamically manage platform-detection via safe `DOMContentLoaded` listeners in a centralized JS utility to rewrite text contents and `aria-label` tags appropriately.
