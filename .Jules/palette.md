## 2026-06-20 - Initial UX Audit: Keyboard Accessibility & Platform-Aware Hints

**Learning:** Custom interactive elements (like formula cards and search results) lack native keyboard support (tabindex, ARIA roles, keydown listeners), and hardcoded "⌘K" hints can be confusing for non-Mac users.

**Action:** Always implement 'role="button"' or 'role="option"' with 'tabindex="0"' and corresponding keyboard listeners (Enter/Space) for custom UI components. Detect the user's platform to provide relevant keyboard shortcut hints.
