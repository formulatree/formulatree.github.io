## 2025-05-14 - Global Keyboard Accessibility
**Learning:** Interactive elements implemented as `div` or `span` with `onclick` are inaccessible to keyboard users. Adding `tabindex="0"`, appropriate `role`, and a global keyboard listener for Enter/Space provides a consistent accessible experience across the app.
**Action:** Always ensure custom interactive elements have a focus state, a semantic role, and keyboard activation support.
