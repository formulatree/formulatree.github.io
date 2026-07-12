## 2026-07-12 - Global Keyboard Listeners for ARIA Roles
**Learning:** In static applications using custom interactive elements (like DIVs with role='button'), a global keyboard listener in a central JS file is a highly efficient way to ensure 'Enter' and 'Space' activation without repeating logic in every component.
**Action:** Always check for non-native interactive elements and implement a global delegation-based listener for keyboard accessibility.

## 2026-07-12 - Visual Focus for Static Sites
**Learning:** Using :focus-visible provides a 'just works' keyboard accessibility improvement that is invisible to mouse users, making it a safe and high-impact micro-UX win.
**Action:** Default to using :focus-visible with a clear outline and offset for all keyboard-navigable elements.
