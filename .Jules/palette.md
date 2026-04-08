## 2025-05-14 - [Global Keyboard Accessibility for Custom Roles]
**Learning:** In applications using custom interactive elements (divs/spans with `role="button"` or `role="option"`), keyboard accessibility must be explicitly implemented. A global listener for the 'keydown' event can efficiently handle 'Enter' and 'Space' activation by dispatching synthetic click events, which is cleaner than adding individual listeners to dynamic templates.
**Action:** Always implement a global keyboard listener when using custom roles and ensure all interactive elements have 'tabindex="0"' and appropriate ARIA roles.

## 2025-05-14 - [Cleaning Screen Reader Output]
**Learning:** Visual-only hints like keyboard shortcuts (e.g., `<kbd>Ctrl+K</kbd>`) can be confusing when read aloud by screen readers alongside button labels.
**Action:** Use 'aria-hidden="true"' on decorative or redundant keyboard shortcut indicators to ensure a cleaner experience for assistive technology users.
