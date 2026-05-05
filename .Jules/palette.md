## 2025-05-14 - Keyboard Accessibility for Custom Interactive Elements
**Learning:** Custom interactive elements (like divs used as cards or headers) must have explicit ARIA roles, `tabindex="0"`, and a keyboard listener for 'Enter' and 'Space' to be accessible to keyboard and screen reader users. Standardizing this through a global listener in a shared utility script ensures consistency across the application.
**Action:** Always check for interactive `div` or `span` elements and ensure they have `role="button"`, `tabindex="0"`, and are handled by a keyboard activation listener.
