# Palette's UX Journal

## 2026-04-25 - Enhanced Keyboard Accessibility
**Learning:** Custom interactive elements (cards, headers, tabs) must have explicit ARIA roles, tabindex="0", and managed ARIA attributes (aria-expanded, aria-selected) to be usable by screen readers and keyboard users. A global keydown listener for "Enter" and "Space" is a robust pattern for making non-native buttons accessible.
**Action:** Always include roles and keyboard listeners when using non-button elements for interaction.
