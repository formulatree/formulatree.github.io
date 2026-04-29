## 2024-04-29 - Global Keyboard Listener for Custom Elements
**Learning:** Custom interactive elements (divs with role="button", etc.) do not natively handle Enter/Space keys for activation. A global listener on the document can provide this behavior application-wide, but must be careful to ignore native focusable elements like <button> and <a> to avoid double triggers.
**Action:** Use a delegated keydown listener in a shared JS file like data.js that checks for ARIA roles and triggers click().

## 2024-04-29 - ARIA State Management in Single Page JS
**Learning:** Programmatic UI changes (toggling classes like .open or .active) are invisible to screen readers unless paired with ARIA state attributes (aria-expanded, aria-selected).
**Action:** Ensure JS functions that toggle visibility or selection also update the corresponding ARIA attributes on the trigger elements.
