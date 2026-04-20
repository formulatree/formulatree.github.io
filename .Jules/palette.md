## 2026-04-20 - Global Keyboard Accessibility Pattern
**Learning:** Custom interactive elements using `role="button"` or `role="option"` require explicit keyboard listeners and state management (`aria-expanded`, `aria-selected`) to be accessible. A global listener for `Enter` and `Space` can unify this behavior across the app.
**Action:** Always include `tabindex="0"` and appropriate ARIA roles for clickable `div`/`span` elements, and use a centralized keydown listener to trigger their click events.
