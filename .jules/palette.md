## 2024-07-14 - Global Keyboard and ARIA Enhancements
**Learning:** Custom interactive elements (like `div` search results or chapter cards) are invisible to keyboard users and screen readers unless explicitly given roles and tab indices. A global keyboard listener can efficiently bridge the gap for `Enter` and `Space` activation across the entire app if it selectively targets custom roles while ignoring native interactive tags. Additionally, providing platform-specific keyboard hints (Ctrl vs ⌘) significantly improves the perceived polish and accuracy of the UI.
**Action:** Always implement a global accessibility listener for custom interactive roles and use feature/platform detection to tailor keyboard shortcut documentation to the user's environment.

## 2024-07-14 - Standardized Visual Cues
**Learning:** Consistent iconography (e.g., using specific emojis for Physics, Math, and Chemistry) across search results and page content acts as a powerful non-textual signifier, helping users rapidly scan and categorize information.
**Action:** Define a central "source of truth" for subject-specific iconography to ensure consistency across search overlays and main content areas.
