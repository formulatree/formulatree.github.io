## 2026-10-04 - Centralized Custom Control Keyboard Activation
**Learning:** When configuring centralized keydown listeners for elements with custom interactive roles (e.g. `role="button"`, `role="option"`), native interactive tags (`BUTTON`, `INPUT`, `SELECT`, `TEXTAREA`, `A`) must be excluded from custom triggers to prevent duplicate click events or unwanted side-effects.
**Action:** Always filter `e.target.tagName` against native interactive controls before invoking `target.click()` in global keydown event handlers.
