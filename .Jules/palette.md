## 2024-05-17 - Keyboard Accessibility for Custom Interactive Elements
**Learning:** In a static HTML environment using custom DIVs for interactive components (like accordion headers or cards), applying 'role="button"' and 'tabindex="0"' is insufficient for full accessibility; a global keyboard listener is necessary to simulate native 'Enter' and 'Space' activation, while explicitly excluding native interactive tags to avoid double-firing.
**Action:** Always pair custom ARIA roles with a synchronized keyboard event handler and ensure 'aria-expanded' states are updated during the interaction.
