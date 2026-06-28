## 2026-06-28 - Global Keyboard Listener for Custom Roles
**Learning:** In projects without a framework like React/Vue, custom interactive elements (role="button", role="option") often lack built-in Enter/Space activation. A global listener in a shared script (like data.js) can consistently provide this functionality across all pages.
**Action:** Always implement a global keyboard listener when using ARIA roles on non-native interactive elements to ensure WCAG compliance.
