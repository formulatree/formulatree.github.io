import os

def patch_file(filename, patches):
    with open(filename, 'rb') as f:
        content = f.read()

    initial_content = content
    for search, replace in patches:
        if search not in content:
            print(f"Warning: '{search}' not found in {filename}")
        content = content.replace(search, replace)

    if content != initial_content:
        with open(filename, 'wb') as f:
            f.write(content)
        print(f"Patched {filename}")

# index.html patches
patch_file('index.html', [
    (b'<button class="search-btn" onclick="openSearch()">\r\n    <svg width="14" height="14"',
     b'<button class="search-btn" onclick="openSearch()" aria-label="Search formulas, equations, and topics">\r\n    <svg aria-hidden="true" width="14" height="14"'),
    (b'<kbd>\xe2\x8c\x98K</kbd>', b'<kbd aria-hidden="true">\xe2\x8c\x98K</kbd>'),
    (b'<div class="search-overlay" id="searchOverlay" onclick="closeSearchOutside(event)">',
     b'<div class="search-overlay" id="searchOverlay" onclick="closeSearchOutside(event)" role="dialog" aria-modal="true">'),
    (b'<input class="search-input" id="searchInput" placeholder="Search formulas, equations, topics..." autocomplete="off">',
     b'<input class="search-input" id="searchInput" placeholder="Search formulas, equations, topics..." autocomplete="off" aria-label="Search formulas, equations, and topics" aria-haspopup="listbox" aria-controls="searchResults">'),
    (b'<div class="search-results" id="searchResults">',
     b'<div class="search-results" id="searchResults" role="listbox" aria-label="Search results">'),
    (b'return `<div class="search-result" onclick="window.location.href=\'${page}?chapter=${encodeURIComponent(f.chapter)}&id=${f.id}${sectionParam}\'">',
     b'return `<div class="search-result" role="option" tabindex="0" aria-selected="false" onclick="window.location.href=\'${page}?chapter=${encodeURIComponent(f.chapter)}&id=${f.id}${sectionParam}\'">')
])

# physics.html patches
patch_file('physics.html', [
    (b'<button class="search-btn" onclick="openSearch()">\r\n    <svg width="14" height="14"',
     b'<button class="search-btn" onclick="openSearch()" aria-label="Search formulas, equations, and topics">\r\n    <svg aria-hidden="true" width="14" height="14"'),
    (b'<kbd>\xe2\x8c\x98K</kbd>', b'<kbd aria-hidden="true">\xe2\x8c\x98K</kbd>'),
    (b'<div class="search-overlay" id="searchOverlay" onclick="closeSearchOutside(event)">',
     b'<div class="search-overlay" id="searchOverlay" onclick="closeSearchOutside(event)" role="dialog" aria-modal="true">'),
    (b'<input class="search-input" id="searchInput" placeholder="Search formulas\xe2\x80\xa6" autocomplete="off">',
     b'<input class="search-input" id="searchInput" placeholder="Search formulas\xe2\x80\xa6" autocomplete="off" aria-label="Search formulas, equations, and topics" aria-haspopup="listbox" aria-controls="searchResults">'),
    (b'<div class="search-results" id="searchResults"><div class="search-empty">Start typing to search\xe2\x80\xa6</div></div>',
     b'<div class="search-results" id="searchResults" role="listbox" aria-label="Search results"><div class="search-empty">Start typing to search\xe2\x80\xa6</div></div>'),
    (b"matches.map(f => `<div class=\"search-result\" onclick=\"handleSearchResult('${f.subject}','${esc(f.chapter)}','${f.id}','${f.section||''}')\">",
     b"matches.map(f => `<div class=\"search-result\" role=\"option\" tabindex=\"0\" aria-selected=\"false\" onclick=\"handleSearchResult('${f.subject}','${esc(f.chapter)}','${f.id}','${f.section||''}')\">"),
    (b"<div class=\"formula-header\" onclick=\"toggleCard('${f.id}')\">",
     b"<div class=\"formula-header\" role=\"button\" tabindex=\"0\" aria-expanded=\"false\" onclick=\"toggleCard('${f.id}')\">"),
    (b"<div class=\"chapter-card fade-up\" style=\"--chapter-color:${SUBJECT_COLOR}\" onclick=\"openChapter('${esc(name)}')\">",
     b"<div class=\"chapter-card fade-up\" role=\"button\" tabindex=\"0\" style=\"--chapter-color:${SUBJECT_COLOR}\" onclick=\"openChapter('${esc(name)}')\">"),
    (b"document.querySelectorAll('.formula-card.open').forEach(c => c.classList.remove('open'));",
     b"document.querySelectorAll('.formula-card').forEach(c => { c.classList.remove('open'); const header = c.querySelector('.formula-header'); if (header) header.setAttribute('aria-expanded', 'false'); });"),
    (b"if (!isOpen) card.classList.add('open');",
     b"if (!isOpen) { card.classList.add('open'); const header = card.querySelector('.formula-header'); if (header) header.setAttribute('aria-expanded', 'true'); }"),
    (b"card.classList.add('open');\r\n      card.scrollIntoView",
     b"card.classList.add('open');\r\n      const header = card.querySelector('.formula-header');\r\n      if (header) header.setAttribute('aria-expanded', 'true');\r\n      card.scrollIntoView")
])

# mathematics.html patches
patch_file('mathematics.html', [
    (b'<button class="search-btn" onclick="openSearch()">\r\n    <svg width="14" height="14"',
     b'<button class="search-btn" onclick="openSearch()" aria-label="Search formulas, equations, and topics">\r\n    <svg aria-hidden="true" width="14" height="14"'),
    (b'<kbd>\xe2\x8c\x98K</kbd>', b'<kbd aria-hidden="true">\xe2\x8c\x98K</kbd>'),
    (b'<div class="search-overlay" id="searchOverlay" onclick="closeSearchOutside(event)">',
     b'<div class="search-overlay" id="searchOverlay" onclick="closeSearchOutside(event)" role="dialog" aria-modal="true">'),
    (b'<input class="search-input" id="searchInput" placeholder="Search formulas\xe2\x80\xa6" autocomplete="off">',
     b'<input class="search-input" id="searchInput" placeholder="Search formulas\xe2\x80\xa6" autocomplete="off" aria-label="Search formulas, equations, and topics" aria-haspopup="listbox" aria-controls="searchResults">'),
    (b'<div class="search-results" id="searchResults"><div class="search-empty">Start typing to search\xe2\x80\xa6</div></div>',
     b'<div class="search-results" id="searchResults" role="listbox" aria-label="Search results"><div class="search-empty">Start typing to search\xe2\x80\xa6</div></div>'),
    (b"matches.map(f => `<div class=\"search-result\" onclick=\"handleSearchResult('${f.subject}','${esc(f.chapter)}','${f.id}','${f.section||''}')\">",
     b"matches.map(f => `<div class=\"search-result\" role=\"option\" tabindex=\"0\" aria-selected=\"false\" onclick=\"handleSearchResult('${f.subject}','${esc(f.chapter)}','${f.id}','${f.section||''}')\">"),
    (b"<div class=\"formula-header\" onclick=\"toggleCard('${f.id}')\">",
     b"<div class=\"formula-header\" role=\"button\" tabindex=\"0\" aria-expanded=\"false\" onclick=\"toggleCard('${f.id}')\">"),
    (b"<div class=\"chapter-card fade-up\" style=\"--chapter-color:${SUBJECT_COLOR}\" onclick=\"openChapter('${esc(name)}')\">",
     b"<div class=\"chapter-card fade-up\" role=\"button\" tabindex=\"0\" style=\"--chapter-color:${SUBJECT_COLOR}\" onclick=\"openChapter('${esc(name)}')\">"),
    (b"document.querySelectorAll('.formula-card.open').forEach(c => c.classList.remove('open'));",
     b"document.querySelectorAll('.formula-card').forEach(c => { c.classList.remove('open'); const header = c.querySelector('.formula-header'); if (header) header.setAttribute('aria-expanded', 'false'); });"),
    (b"if (!isOpen) card.classList.add('open');",
     b"if (!isOpen) { card.classList.add('open'); const header = card.querySelector('.formula-header'); if (header) header.setAttribute('aria-expanded', 'true'); }"),
    (b"card.classList.add('open');\r\n      card.scrollIntoView",
     b"card.classList.add('open');\r\n      const header = card.querySelector('.formula-header');\r\n      if (header) header.setAttribute('aria-expanded', 'true');\r\n      card.scrollIntoView")
])

# chemistry.html patches
patch_file('chemistry.html', [
    (b'<button class="search-btn" onclick="openSearch()">\r\n    <svg width="14" height="14"',
     b'<button class="search-btn" onclick="openSearch()" aria-label="Search formulas, equations, and topics">\r\n    <svg aria-hidden="true" width="14" height="14"'),
    (b'<kbd>\xe2\x8c\x98K</kbd>', b'<kbd aria-hidden="true">\xe2\x8c\x98K</kbd>'),
    (b'<div class="search-overlay" id="searchOverlay" onclick="closeSearchOutside(event)">',
     b'<div class="search-overlay" id="searchOverlay" onclick="closeSearchOutside(event)" role="dialog" aria-modal="true">'),
    (b'<input class="search-input" id="searchInput" placeholder="Search chemistry formulas\xe2\x80\xa6" autocomplete="off">',
     b'<input class="search-input" id="searchInput" placeholder="Search chemistry formulas\xe2\x80\xa6" autocomplete="off" aria-label="Search formulas, equations, and topics" aria-haspopup="listbox" aria-controls="searchResults">'),
    (b'<div class="search-results" id="searchResults"><div class="search-empty">Start typing to search\xe2\x80\xa6</div></div>',
     b'<div class="search-results" id="searchResults" role="listbox" aria-label="Search results"><div class="search-empty">Start typing to search\xe2\x80\xa6</div></div>'),
    (b"matches.map(f => `<div class=\"search-result\" onclick=\"handleSearchResult('${f.subject}','${esc(f.chapter)}','${f.id}','${f.section||''}')\">",
     b"matches.map(f => `<div class=\"search-result\" role=\"option\" tabindex=\"0\" aria-selected=\"false\" onclick=\"handleSearchResult('${f.subject}','${esc(f.chapter)}','${f.id}','${f.section||''}')\">"),
    (b"<div class=\"formula-header\" onclick=\"toggleCard('${f.id}')\">",
     b"<div class=\"formula-header\" role=\"button\" tabindex=\"0\" aria-expanded=\"false\" onclick=\"toggleCard('${f.id}')\">"),
    (b"<div class=\"chapter-card fade-up\" style=\"--chapter-color:${color}\" onclick=\"openChapter('${esc(name)}')\">",
     b"<div class=\"chapter-card fade-up\" role=\"button\" tabindex=\"0\" style=\"--chapter-color:${color}\" onclick=\"openChapter('${esc(name)}')\">"),
    (b"icons = { Physics: '\xe2\x9b\x9b'", b"icons = { Physics: '\xe2\x9a\x9b'"),
    (b'<div class="section-tabs">', b'<div class="section-tabs" role="tablist">'),
    (b'<button class="section-tab active" id="tab-Physical"', b'<button class="section-tab active" id="tab-Physical" role="tab" aria-selected="true"'),
    (b'<button class="section-tab" id="tab-Inorganic"', b'<button class="section-tab" id="tab-Inorganic" role="tab" aria-selected="false"'),
    (b'<button class="section-tab" id="tab-Organic"', b'<button class="section-tab" id="tab-Organic" role="tab" aria-selected="false"'),
    (b"document.querySelectorAll('.section-tab').forEach(t => t.classList.remove('active'));",
     b"document.querySelectorAll('.section-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });"),
    (b"if(activeTab) activeTab.classList.add('active');",
     b"if(activeTab) { activeTab.classList.add('active'); activeTab.setAttribute('aria-selected', 'true'); }"),
    (b"document.querySelectorAll('.formula-card.open').forEach(c => c.classList.remove('open'));",
     b"document.querySelectorAll('.formula-card').forEach(c => { c.classList.remove('open'); const header = c.querySelector('.formula-header'); if (header) header.setAttribute('aria-expanded', 'false'); });"),
    (b"if (!isOpen) card.classList.add('open');",
     b"if (!isOpen) { card.classList.add('open'); const header = card.querySelector('.formula-header'); if (header) header.setAttribute('aria-expanded', 'true'); }"),
    (b"card.classList.add('open');\r\n      card.scrollIntoView",
     b"card.classList.add('open');\r\n      const header = card.querySelector('.formula-header');\r\n      if (header) header.setAttribute('aria-expanded', 'true');\r\n      card.scrollIntoView")
])

# data.js
with open('data.js', 'rb') as f:
    data_content = f.read()
if b'// --- Palette UX Enhancements ---' not in data_content:
    with open('data.js', 'ab') as f:
        f.write(b"\r\n\r\n// --- Palette UX Enhancements ---\r\ndocument.addEventListener('keydown', e => {\r\n  const target = e.target;\r\n  const role = target.getAttribute('role');\r\n  if (['button', 'option', 'tab'].includes(role) && (e.key === 'Enter' || e.key === ' ')) {\r\n    if (['BUTTON', 'A', 'INPUT', 'TEXTAREA'].includes(target.tagName)) return;\r\n    e.preventDefault();\r\n    target.click();\r\n  }\r\n});\r\n\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;\r\n  if (!isMac) {\r\n    document.querySelectorAll('kbd').forEach(k => {\r\n      if (k.textContent === '\xe2\x8c\x98K') k.textContent = 'Ctrl+K';\r\n    });\r\n    const searchBtn = document.querySelector('.search-btn');\r\n    if (searchBtn && searchBtn.getAttribute('aria-label') === 'Search formulas, equations, and topics') {\r\n      searchBtn.setAttribute('aria-label', 'Search formulas, equations, and topics (Ctrl+K)');\r\n    }\r\n  }\r\n});\r\n")
    print("Patched data.js")
