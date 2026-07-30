## 2026-07-30 - Centralized Keyboard Accessibility for Custom Non-Native Controls

**Learning:** Centralized keyboard event listeners targeting elements with custom interactive roles must exclude native interactive controls (like `<button>`, `<input>`, `<select>`, `<textarea>`) and links (`<a>`) from programmatic `.click()` triggering. Native controls already natively handle keyboard activations (like Enter and Space), and including them triggers duplicate click events.

**Action:** When implementing centralized keyboard event listeners for custom interactive roles (`role="button"`, `role="option"`, `role="tab"`), always verify the tag name of the event target. If the tag name corresponds to a native control, ignore the event to prevent double-triggering side effects.
