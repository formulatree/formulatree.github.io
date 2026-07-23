## 2025-07-23 - Avoiding Double Click Events on Native Controls

**Learning:** Centralized keydown listeners designed to add keyboard support to custom interactive roles (like `role="button"` or `role="tab"`) should explicitly ignore native interactive controls (like `<button>`, `<input>`, `<select>`, `<textarea>`, or standard anchor tags `<a>`). Native interactive controls natively handle keys like Enter and Space, and triggering a `.click()` on them programmatically results in duplicate events, causing bugs like forms double-submitting or toggles instantly switching back and forth.

**Action:** When capturing centralized Space or Enter keydown actions on custom components, check the event target tag name and return early if it is a native interactive control:
```javascript
const tag = target.tagName.toLowerCase();
if (tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea' || tag === 'a') {
  return;
}
```
