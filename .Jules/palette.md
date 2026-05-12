## 2025-05-14 - Global Keyboard Interaction Pattern
**Learning:** Custom interactive elements (divs, spans) with semantic roles require both 'tabindex="0"' and a global 'keydown' listener for parity with native buttons. Overlays should manage 'aria-hidden' to assist screen readers.
**Action:** Always include a global listener for Enter/Space keys when using ARIA roles on non-native interactive elements.

## 2025-05-14 - State Synchronization with ARIA
**Learning:** Programmatic UI state changes (toggling visibility, switching tabs) must explicitly update ARIA attributes like 'aria-expanded' and 'aria-selected' to maintain accessibility.
**Action:** Update ARIA attributes in JavaScript functions that modify visual state.
