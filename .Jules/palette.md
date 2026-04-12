## 2026-04-12 - Keyboard Accessibility for Custom Interactive Elements
**Learning:** In a vanilla JS/HTML project without semantic buttons for everything (e.g., clickable divs for cards/search results), custom elements must be given `role="button"` or `role="option"`, `tabindex="0"`, and a global `keydown` listener to handle `Enter` and `Space` keys to ensure parity with native button behavior for keyboard users.
**Action:** Always add ARIA roles, tabindex, and a global keyboard listener when using non-semantic elements for critical interactions.

## 2026-04-12 - Focus Visibility and Contextual Highlights
**Learning:** Using `:focus-visible` ensures that focus indicators only appear when navigating via keyboard, maintaining a clean UI for mouse users. Combining it with `:focus-within` on parent containers (like search input rows) provides better contextual feedback for the user's current interaction area.
**Action:** Prefer `:focus-visible` for outlines and use `:focus-within` to highlight interactive groups.
