## 2025-05-15 - Global Keyboard Accessibility Pattern
**Learning:** In a vanilla JS/HTML project with many custom interactive elements (divs, spans), maintaining keyboard accessibility across multiple pages is difficult if handled individually.
**Action:** Use a global 'keydown' listener in a shared utility file (like 'data.js') that targets elements by 'role="button"' or 'role="option"' to dispatch synthetic clicks for Enter and Space keys. This ensures consistency without duplicating logic.
