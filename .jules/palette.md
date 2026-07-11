## 2024-07-11 - Global Keyboard Activation for Custom ARIA Roles
**Learning:** Adding ARIA roles like \`button\` or \`option\` to generic elements (e.g., \`div\`) improves semantics for screen readers but doesn't automatically grant native keyboard interactivity (Enter/Space). A global listener scoped to these roles can provide consistent behavior without duplicating logic across every component.
**Action:** Always pair custom ARIA roles with a corresponding keyboard event listener if the elements are intended to be interactive.

## 2024-07-11 - Platform-Aware Shortcut Hints
**Learning:** Users on Windows/Linux may find '⌘K' confusing. Dynamic replacement of shortcut hints based on \`navigator.platform\` significantly improves "invisible" UX by providing the correct context for the user's OS.
**Action:** For global shortcuts, detect the platform and update both visual hints (\`<kbd>\`) and \`aria-label\` attributes.
