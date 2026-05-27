## 2026-05-27 - Enhancing Accessibility for Custom Interactive Elements

**Learning:** This application relies heavily on dynamic `div` and `span` elements for core interactions (chapter cards, formula headers, search results). Without explicit `role` attributes and `tabindex="0"`, these are invisible to screen readers and inaccessible via keyboard. Additionally, global event listeners in `data.js` can effectively polyfill `Enter`/`Space` behavior for these elements across the entire site.

**Action:** Always verify that dynamically rendered interactive elements include appropriate ARIA roles and tabindex. Implement a centralized keyboard handler in shared utility files to ensure consistent UX for non-native buttons and tabs.
