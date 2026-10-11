# -*- coding: utf-8 -*-
import io
import sys
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def run_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        
        # Open local index.html
        import os
        index_path = "file:///" + os.path.abspath("./index.html").replace("\\", "/")
        print(f"Loading: {index_path}")
        page.goto(index_path, wait_until="load")
        page.wait_for_timeout(2000)

        # 1. Verify Daily Report on Load
        print("\n--- 1. Testing Daily Report (Sunday 11 October 2026) ---")
        page.evaluate("switchTab('dailyreport')")
        page.wait_for_timeout(1000)
        
        # Check active report date
        active_date = page.evaluate("window._drSelectedDate")
        print(f"Active Report Date: {active_date}")
        assert active_date == "2026-10-11", f"Expected 2026-10-11 but got {active_date}"
        
        # Check title content in report
        page_content = page.content()
        assert "11 أكتوبر 2026" in page_content, "Sunday 11 Oct not visible in page content"
        assert "EGX33" in page_content
        print("✓ Daily Report for Sunday 11 October 2026 rendered successfully!")
        
        # Take screenshot of daily report
        page.screenshot(path="v15_daily_report_11_oct_verified.png")
        print("✓ Saved screenshot: v15_daily_report_11_oct_verified.png")

        # 2. Verify Performance Tab
        print("\n--- 2. Testing Performance Tab Overhaul ---")
        page.evaluate("switchTab('portfolio')")
        page.wait_for_timeout(500)
        page.evaluate("switchPortfolioSubTab('performance')")
        page.wait_for_timeout(1000)

        # Check KPI values
        val_text = page.locator("#perf_kpi_current_val").inner_text()
        cost_text = page.locator("#perf_kpi_total_cost").inner_text()
        pnl_text = page.locator("#perf_kpi_pnl_egp").inner_text()
        roi_text = page.locator("#perf_kpi_return_pct").inner_text()
        gross_text = page.locator("#perf_gross_pnl").inner_text()
        fees_text = page.locator("#perf_paid_fees").inner_text()
        net_text = page.locator("#perf_net_pnl").inner_text()

        print(f"Market Value: {val_text}")
        print(f"Total Invested Cost: {cost_text}")
        print(f"Net PnL: {pnl_text}")
        print(f"Net ROI: {roi_text}")
        print(f"Gross PnL: {gross_text}")
        print(f"Paid Fees: {fees_text}")
        print(f"Net Ledger PnL: {net_text}")

        # Check Gold asset unified
        gold_val = page.locator("#perf_gold_val").inner_text()
        gold_pnl = page.locator("#perf_gold_pnl_egp").inner_text()
        gold_sub = page.locator("#perf_gold_subtext").inner_text()
        print(f"Gold Total Val: {gold_val} | PnL: {gold_pnl} | Subtext: {gold_sub}")
        assert "316" in gold_val or "316.07" in gold_val, f"Expected unified gold ~316 EGP but got {gold_val}"

        # Check Fees negative sign
        assert "-" in fees_text, f"Fees must have negative sign per accounting rules, got {fees_text}"

        # Check CBE Prorated & Alpha Badge
        cbe_text = page.locator("#perfBenchCbe").inner_text()
        alpha_text = page.locator("#perfAlphaBadge").inner_text()
        print(f"CBE Benchmark: {cbe_text} | Alpha Badge: {alpha_text}")
        assert "شهرياً" in cbe_text or "%" in cbe_text

        # Take screenshot of performance tab
        page.screenshot(path="v15_performance_view_verified.png")
        print("✓ Saved screenshot: v15_performance_view_verified.png")

        # 3. Verify News Hub & Live Sync Banner
        print("\n--- 3. Testing News Hub & Live Sync Indicator ---")
        page.evaluate("switchTab('news_hub')")
        page.wait_for_timeout(1000)

        sync_banner = page.locator("#newsSyncStatusText").inner_text()
        print(f"Sync Banner Initial: {sync_banner}")
        assert "سحب لحظي نشط" in sync_banner

        # Click refresh news
        page.locator("button[onclick='refreshNewsData()']").first.click()
        page.wait_for_timeout(1000)
        sync_banner_after = page.locator("#newsSyncStatusText").inner_text()
        print(f"Sync Banner After Refresh: {sync_banner_after}")
        assert "تم تحديث الإفصاحات" in sync_banner_after or "تم السحب" in sync_banner_after

        # Check Sunday 11 Oct disclosures
        news_content = page.content()
        assert "الرقابة المالية تصدر التقرير الرقابي" in news_content
        assert "المصرية للاتصالات تؤكد تحصيل الدفعة الأولى" in news_content
        assert "طلعت مصطفى تعتمد المخطط العام لمنطقة الفنادق" in news_content
        print("✓ Fresh disclosures for Sunday 11 October verified!")

        # Take screenshot of news hub
        page.screenshot(path="v15_news_hub_verified.png")
        print("✓ Saved screenshot: v15_news_hub_verified.png")

        # 4. Verify Modal Close
        print("\n--- 4. Testing Modal Operations ---")
        page.evaluate("document.getElementById('clearArchiveModal').classList.remove('hidden')")
        is_visible = page.locator("#clearArchiveModal").is_visible()
        assert is_visible, "Modal should be visible"
        # Click cancel
        page.locator("#clearArchiveModal button:has-text('إلغاء')").click()
        page.wait_for_timeout(500)
        is_hidden = not page.locator("#clearArchiveModal").is_visible()
        assert is_hidden, "Modal should be hidden after clicking cancel"
        print("✓ Modal close operation verified successfully!")

        print("\n========================================================")
        print("ALL TESTS PASSED WITH 100% SUCCESS!")
        print("========================================================")
        browser.close()

if __name__ == "__main__":
    run_tests()
