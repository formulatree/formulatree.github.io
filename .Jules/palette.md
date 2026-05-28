
## 2026-05-28 - Global Keyboard Accessibility for Custom Roles
**Learning:** In a static site with many custom interactive elements (divs/spans with roles like "button" or "option"), adding "tabindex=0" alone is insufficient for accessibility as these elements do not natively support "Enter" or "Space" activation. A global event listener in a shared utility file (like data.js) can efficiently bridge this gap by delegating clicks to any element with an interactive ARIA role that isn't a native button or link.
**Action:** Always implement a global keyboard listener for elements with ARIA interactive roles when retrofitting accessibility to a project with many custom UI components.
