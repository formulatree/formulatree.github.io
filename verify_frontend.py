import os
import subprocess
import time
from playwright.sync_api import sync_playwright

def run_verification(page):
    print("Navigating to index.html...")
    page.goto("http://localhost:8000/index.html")
    page.wait_for_timeout(1000)

    # Click the search trigger button
    print("Clicking Search button...")
    page.click(".search-btn")
    page.wait_for_timeout(500)

    # Verify search modal opens and input has focus
    search_input = page.locator("#searchInput")
    is_focused = search_input.evaluate("el => el === document.activeElement")
    print(f"Is search input focused? {is_focused}")
    assert is_focused, "Search input should be automatically focused upon opening search modal"

    # Type 'Lens' in the search input
    print("Typing 'Lens' into search...")
    search_input.fill("Lens")
    page.wait_for_timeout(1000)

    # Verify 7 results are found for 'Lens'
    results = page.locator("#searchResults .search-result")
    count = results.count()
    print(f"Number of search results found for 'Lens': {count}")
    assert count == 7, f"Expected exactly 7 results for 'Lens', found {count}"

    # Take screenshot of the search modal with results
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    screenshot_path = "/home/jules/verification/screenshots/verification.png"
    page.screenshot(path=screenshot_path)
    print(f"Screenshot taken and saved to {screenshot_path}")

    # Click the first search result to navigate
    print("Clicking the first search result to navigate...")
    results.first.click()
    page.wait_for_timeout(1500)

    # Check page URL to ensure we navigated
    current_url = page.url
    print(f"Navigated to URL: {current_url}")
    assert "physics.html" in current_url or "chemistry.html" in current_url or "mathematics.html" in current_url, "Should have navigated to a subject details page"
    print("Frontend verification completed successfully!")

if __name__ == "__main__":
    # Create verification directories
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)

    # Start python http.server in the background on port 8000
    server_process = subprocess.Popen(
        "python3 -m http.server 8000 > server.log 2>&1 &",
        shell=True,
        preexec_fn=os.setsid
    )
    time.sleep(2)  # Give server some time to start

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                record_video_dir="/home/jules/verification/videos"
            )
            page = context.new_page()
            try:
                run_verification(page)
            finally:
                context.close()
                browser.close()
    finally:
        # Terminate background server process
        print("Stopping the local development server...")
        subprocess.run("kill $(pgrep -f 'http.server') || true", shell=True)
