
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:8000/physics.html")

        # Check if formula headers are focusable
        headers = await page.query_selector_all(".formula-header")
        print(f"Formula headers: {len(headers)}")
        if len(headers) > 0:
            is_focusable = await headers[0].evaluate("el => el.tabIndex >= 0")
            print(f"First formula header focusable: {is_focusable}")

        # Check search button
        search_btn = await page.query_selector(".search-btn")
        is_focusable = await search_btn.evaluate("el => el.tabIndex >= 0")
        print(f"Search button focusable: {is_focusable}")

        # Open search and check results
        await page.keyboard.press("Control+k")
        await page.wait_for_selector(".search-modal", state="visible")
        await page.fill("#searchInput", "Kinematic")
        await page.wait_for_selector(".search-result")
        results = await page.query_selector_all(".search-result")
        print(f"Search results: {len(results)}")
        if len(results) > 0:
            is_focusable = await results[0].evaluate("el => el.tabIndex >= 0")
            print(f"First search result focusable: {is_focusable}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
