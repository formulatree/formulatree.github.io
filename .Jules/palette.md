## 2026-05-18 - Initial Observation
**Learning:** The FormulaTree application uses many custom interactive elements (search results, chapter cards) that lack keyboard accessibility and clear focus states, making it difficult for screen reader and keyboard-only users.
**Action:** Implement global keyboard activation for ARIA roles and enhance focus indicators in CSS.
## 2026-05-18 - Custom Interactive Elements Pattern
**Learning:** In a static site with many dynamically rendered custom components (like search results or chapter cards), providing a global 'keydown' listener in a shared script (data.js) is a highly efficient way to enable Enter/Space activation across the entire app without duplicating event listeners.
**Action:** Use 'role="button|tab|option"' and 'tabindex="0"' combined with a centralized listener to ensure keyboard accessibility for all custom interactive elements.
