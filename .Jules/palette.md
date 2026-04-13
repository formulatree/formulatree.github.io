## 2026-04-13 - Global Keyboard Accessibility for Custom Roles
**Learning:** Custom interactive elements like cards and pills using 'role="button"' or 'role="option"' do not have native keyboard support. A global 'keydown' listener in a shared script can efficiently provide 'Enter' and 'Space' activation by dispatching click events to elements with these roles.
**Action:** Always implement a centralized keyboard listener when using ARIA roles on non-interactive elements to ensure full accessibility without repeating logic.
