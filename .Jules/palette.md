## 2026-04-03 - Global Keyboard Listener for Custom Interactive Elements
**Learning:** For static sites using custom interactive elements (like `div` cards or `span` pills) without built-in keyboard support, a global 'keydown' listener targeting `role="button"` and `role="option"` is a highly efficient way to enable 'Enter' and 'Space' activation across the entire app without duplicating logic.
**Action:** Use `document.addEventListener('keydown', ...)` in a central JS file (like `data.js`) to dispatch synthetic 'click' events based on ARIA roles.

## 2026-04-03 - Handling CRLF in Automated Replacements
**Learning:** This codebase uses CRLF (`\r\n`) line endings. Standard string replacements or `sed` can fail or corrupt files if line endings are not handled explicitly, especially when using multi-line byte strings in Python.
**Action:** Always use Python's binary mode (`'rb'`/`'wb'`) and include `\r\n` in replacement strings when targeting this repository.
