import re
import sys
import time
import subprocess
from playwright.sync_api import sync_playwright

def run_test():
    server = subprocess.Popen([sys.executable, "-m", "http.server", "8099"], cwd=".")
    time.sleep(2)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

            page.goto("http://127.0.0.1:8099/index.html")
            page.wait_for_timeout(3000)

            print("============================================================")
            print("TESTING CUSTOM/FIXED FEES AND PERFORMANCE SYNCHRONIZATION")
            print("============================================================")

            # 1. Check default fixed fee on first page card
            card_text = page.locator("#p_thndr_fees_card").inner_text()
            print(f"[1] First page fees card default: {card_text}")
            assert "593.82" in card_text, f"Expected 593.82 in card_text, got {card_text}"

            # 2. Check performance view ledger synchronization
            page.evaluate("() => { if (typeof switchTab === 'function') switchTab('performance'); }")
            page.wait_for_timeout(1000)

            perf_fee = page.locator("#perf_paid_fees").inner_text()
            print(f"[2] Performance view paid fees default: {perf_fee}")
            assert "593.82" in perf_fee, f"Expected 593.82 in perf_fee, got {perf_fee}"

            # 3. Test modifying the fee to a custom value (e.g. 750.50 EGP)
            print("\n[3] Testing manual editing of fee via setUserConfiguredFees(750.50)...")
            res = page.evaluate("() => { return window.setUserConfiguredFees(750.50); }")
            page.wait_for_timeout(1000)

            # Re-check performance ledger
            perf_fee_updated = page.locator("#perf_paid_fees").inner_text()
            print(f"    Performance view after update: {perf_fee_updated}")
            assert "750.50" in perf_fee_updated, f"Expected 750.50 in perf_fee_updated, got {perf_fee_updated}"

            # Re-check first page card
            card_text_updated = page.locator("#p_thndr_fees_card").inner_text()
            print(f"    First page card after update: {card_text_updated}")
            assert "750.50" in card_text_updated, f"Expected 750.50 in card_text_updated, got {card_text_updated}"

            # 4. Test Persistence across reload
            print("\n[4] Testing Persistence across page reload...")
            page.reload()
            page.wait_for_timeout(3000)

            card_reloaded = page.locator("#p_thndr_fees_card").inner_text()
            print(f"    First page card after reload: {card_reloaded}")
            assert "750.50" in card_reloaded, f"Expected 750.50 in card_reloaded, got {card_reloaded}"

            page.evaluate("() => { if (typeof switchTab === 'function') switchTab('performance'); }")
            page.wait_for_timeout(1000)
            perf_reloaded = page.locator("#perf_paid_fees").inner_text()
            print(f"    Performance view after reload: {perf_reloaded}")
            assert "750.50" in perf_reloaded, f"Expected 750.50 in perf_reloaded, got {perf_reloaded}"

            # 5. Reset to 593.82 to match user's requested fixed fee
            print("\n[5] Resetting fee back to exact 593.82...")
            page.evaluate("() => { return window.setUserConfiguredFees(593.82); }")
            page.wait_for_timeout(500)
            card_final = page.locator("#p_thndr_fees_card").inner_text()
            perf_final = page.locator("#perf_paid_fees").inner_text()
            print(f"    Final first page card: {card_final}")
            print(f"    Final performance view: {perf_final}")
            assert "593.82" in card_final and "593.82" in perf_final

            # 6. Check console errors
            print(f"\n[6] Console errors: {len(console_errors)}")
            assert len(console_errors) == 0, f"Found console errors: {console_errors}"

            page.screenshot(path="tests/v17_0_custom_fees_verified.png")
            print("Successfully saved screenshot to tests/v17_0_custom_fees_verified.png")

            print("\nALL CUSTOM FEES VERIFICATION TESTS PASSED SUCCESSFULLY!")
            browser.close()
    finally:
        server.terminate()

if __name__ == "__main__":
    run_test()
