## 2026-05-20 - Multi-Platform Shortcut Hints
**Learning:** Hardcoded '⌘K' hints in the UI cause friction for Windows and Linux users; detecting the platform via JavaScript and updating hints to 'Ctrl+K' provides a more personalized and intuitive experience.
**Action:** Always include a platform-check utility when displaying keyboard shortcuts in the UI to ensure hints match the user's expected modifier keys.

## 2026-05-20 - Global Keyboard Activation Pattern
**Learning:** Adding 'role="button"' and 'tabindex="0"' is insufficient if the elements don't respond to 'Enter' or 'Space'. A centralized listener for these roles prevents duplicating 'keydown' logic across components.
**Action:** Implement a standard 'role'-based event delegator in global utility files like 'data.js' to handle keyboard activation for all custom interactive elements.

## 2026-05-20 - Contextual Search Labels
**Learning:** In a modal-heavy interface, screen reader users rely on 'aria-label' to understand the purpose of input fields that may lack visible nearby text labels.
**Action:** Ensure all search and filter inputs have descriptive 'aria-label' attributes, especially when they are the primary focus of a modal dialog.
