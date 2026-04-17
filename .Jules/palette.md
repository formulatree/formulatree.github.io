## 2026-04-17 - Keyboard Accessibility for Custom Components
**Learning:** In a static site using many custom interactive elements (divs as buttons), a global keydown listener combined with 'role' and 'tabindex' attributes is an efficient way to provide standard keyboard interaction (Enter/Space) without refactoring to semantic <button> tags everywhere.
**Action:** Always ensure that programmatically toggled visibility (like accordions) is synchronized with the 'aria-expanded' attribute on the trigger element to maintain a correct accessibility tree.
