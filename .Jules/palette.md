## 2025-05-14 - Site-wide Keyboard Accessibility Pass
**Learning:** This repository lacks basic keyboard accessibility (focus states, ARIA roles) and duplicates interaction logic (search, card toggling) across multiple HTML files. Broad accessibility improvements often require touching every page due to this lack of centralization. The use of CRLF line endings requires binary-mode processing in Python for reliable automated text substitution.

**Action:** Implement a global keydown listener in `data.js` to handle custom interactive elements (role="button"/"option") once, and use high-anchored regex or binary-safe replacement scripts to handle repetitive HTML updates across the subject pages.
