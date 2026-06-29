## 2025-05-14 - Interactive Custom Elements Accessibility
**Learning:** Custom interactive elements like formula cards and chapter buttons often lack keyboard support and ARIA state management. Simple click handlers aren't enough for accessibility; they need explicit role attribution, tabindex, and synchronized ARIA states (like aria-expanded).
**Action:** Always ensure custom "buttons" have role="button", tabindex="0", and a global keyboard listener to handle Enter/Space keys to maintain parity with native elements.
