## 2026-09-07 - Search Overlay Keyboard Navigation State Synchronization
**Learning:** When adding arrow key navigation (`ArrowUp`/`ArrowDown`) to dynamically populated search results, resetting the selection index (`selectedIndex = -1`) inside the input event listener ensures stale keyboard selections are never executed when a user alters the search query before pressing `Enter`.
**Action:** Always pair `keydown` result navigation handlers with an `input` event reset and dynamic `aria-selected` updates on result items.
