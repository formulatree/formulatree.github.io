## 2026-04-10 - Keyboard Support for Custom Elements
**Learning:** Many interactive components in this app (search results, formula headers, pills) are implemented using `div` or `span` elements. These elements are not focusable by default and do not respond to keyboard events like 'Enter' or 'Space'.
**Action:** Implement a global 'keydown' listener in `data.js` that targets elements with `role="button"` or `role="option"`, dispatching a click event when 'Enter' or 'Space' is pressed. Ensure these elements also have `tabindex="0"` for focusability.
