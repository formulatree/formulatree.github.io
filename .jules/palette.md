
## 2024-07-07 - [Keyboard Accessibility & Platform-Aware Shortcuts]
**Learning:** Adding ARIA roles to non-interactive elements (like DIVs) requires manual keyboard handling for Enter/Space, but one must be careful not to double-trigger events on native interactive elements (like BUTTONs) if using a global listener. Preserving CRLF line endings in legacy codebases is critical for maintaining clean git history and meeting diff size constraints.
**Action:** Use a global keyboard listener that explicitly excludes native interactive tags (BUTTON, A, INPUT, TEXTAREA) when handling ARIA-driven interactions. Use precision editing scripts for CRLF-sensitive files.
