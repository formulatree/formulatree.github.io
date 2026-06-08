# Palette's Journal - FormulaTree

## 2025-05-14 - Initial Assessment
**Learning:** The application uses many custom interactive elements (divs as buttons/cards) that lack keyboard accessibility and ARIA roles. The search modal is missing dialog roles.
**Action:** Implement a global keyboard listener for `role="button"` and `role="option"`, add appropriate ARIA roles, and ensure focus visibility.
