## 2025-05-15 - Improving Keyboard Accessibility in Static Sites
**Learning:** In a multi-page static site without a framework, a global 'keydown' listener in a shared script (like data.js) can effectively enable Enter/Space activation for all elements with 'role="button"' or 'role="option"', but must exclude native interactive elements (BUTTON, A, etc.) to prevent double-triggering.
**Action:** Always implement a filtered global keydown listener when using ARIA roles on non-native elements to maintain functional parity with native elements.
