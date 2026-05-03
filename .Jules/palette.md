## 2026-05-03 - Search Accessibility Pattern
**Learning:** Custom interactive elements like search results rendered as <div> tags require explicit 'role="option"', 'tabindex="0"', and a global 'keydown' listener to handle 'Enter' and 'Space' activation, as they do not inherit these behaviors from the 'button' or 'anchor' tags.
**Action:** Always implement a unified keyboard listener in a shared utility file (like 'data.js') when using custom ARIA roles for interactivity across the application.
