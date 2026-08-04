## 2026-08-04 - Keyboard Navigation Fallbacks for Coordinate-Based Popups

**Learning:** When custom interactive elements (like info-pills) trigger floating popups based on the click event's `clientX`/`clientY` positions, keyboard triggers (`Enter` or `Space`) yield synthetic coordinates at `0,0`. To prevent popups from rendering off-screen or misplaced, the event handler must fall back to the element's `getBoundingClientRect()` to compute appropriate visual coordinates.

**Action:** Always check `!e.clientX && !e.clientY` in coordinate-based click handlers, and use the bounding rect's coordinates as a robust fallback for keyboard users.
