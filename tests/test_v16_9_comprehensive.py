import sys
import json
import http.server
import socketserver
import threading
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

PORT = 8092

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving locally at port {PORT}")
        httpd.serve_forever()

server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()
time.sleep(1)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    console_errors = []
    page.on('console', lambda msg: console_errors.append(msg.text) if msg.type == 'error' else None)
    
    page.goto(f'http://localhost:{PORT}/index.html')
    page.wait_for_timeout(3500)
    
    print("=" * 60)
    print("V16.9 FULL COMPREHENSIVE VERIFICATION SUITE")
    print("=" * 60)
    
    # TEST 1: First page Thndr fees card
    fees_first_page = page.evaluate('() => document.getElementById("p_thndr_fees_card")?.innerText')
    print('\n[TEST 1] First page Thndr fees card:', fees_first_page)
    
    # TEST 2: Performance view ledger & KPIs
    page.evaluate("() => { if (typeof switchTab === 'function') switchTab('performance'); }")
    page.wait_for_timeout(1000)
    
    perf_fees = page.evaluate('''() => {
        return {
            paid_fees: document.getElementById("perf_paid_fees")?.innerText,
            gross_pnl: document.getElementById("perf_gross_pnl")?.innerText,
            net_pnl: document.getElementById("perf_net_pnl")?.innerText,
            cost_subtext: document.getElementById("perf_kpi_cost_subtext")?.innerText,
            pnl_subtext: document.getElementById("perf_kpi_pnl_subtext")?.innerText
        };
    }''')
    print('\n[TEST 2] Performance view ledger & KPIs:\n', json.dumps(perf_fees, ensure_ascii=False, indent=2))
    
    # TEST 3: Fund & Gold Prices
    funds_status = page.evaluate('''() => {
        const holdingsFunds = window.userHoldings.filter(h => h.isFund || h.ticker === 'THNDR_GOLD').map(h => ({
            ticker: h.ticker,
            name: h.name,
            qty: h.qty,
            buy: h.buy,
            cur: h.cur
        }));
        
        const matrix = {
            AZG: document.getElementById("matrix-price-AZG")?.innerText,
            CMS: document.getElementById("matrix-price-CMS")?.innerText,
            BWA: document.getElementById("matrix-price-BWA")?.innerText,
            NMF: document.getElementById("matrix-price-NMF")?.innerText,
            THNDR_GOLD: document.getElementById("matrix-price-THNDR_GOLD")?.innerText
        };
        
        return { holdingsFunds, matrix };
    }''')
    print('\n[TEST 3] Fund & Gold Prices:\n', json.dumps(funds_status, ensure_ascii=False, indent=2))
    
    # TEST 4: Market Pulse Portfolio Slicer
    print('\n[TEST 4] Testing Market Pulse Portfolio Slicer...')
    page.evaluate("() => { if (typeof switchTab === 'function') switchTab('radar'); }")
    page.wait_for_timeout(1000)
    pulse_slicer_res = page.evaluate('''() => {
        const btn = document.querySelector('[data-filter="portfolio"]');
        if (btn) {
            btn.click();
            return {
                clicked: true,
                active_filter: window.currentFilter,
                stocks_count: document.querySelectorAll("#stocksContainer > div").length
            };
        }
        return { clicked: false };
    }''')
    print('  Market Pulse Portfolio Slicer result:', pulse_slicer_res)
    
    # TEST 5: Alerts System & Deletion Persistence
    print('\n[TEST 5] Testing Alerts Deletion Persistence across reload...')
    page.evaluate("() => { if (typeof clearAllCustomAlerts === 'function') clearAllCustomAlerts(); }")
    page.wait_for_timeout(500)
    
    # Reload page
    page.reload()
    page.wait_for_timeout(3000)
    
    alerts_after_reload = page.evaluate('''() => {
        return {
            alertsCount: window.userCustomAlerts.length,
            storageVal: localStorage.getItem('egx_custom_alerts'),
            isCleared: localStorage.getItem('egx_custom_alerts_cleared')
        };
    }''')
    print('  Alerts status after reload:', alerts_after_reload)
    
    # TEST 6: Activity Log & Deletion Persistence
    print('\n[TEST 6] Testing Activity Log Deletion Persistence across reload...')
    page.evaluate("() => { if (typeof clearUserActivityLog === 'function') clearUserActivityLog(); }")
    page.wait_for_timeout(500)
    
    # Reload page
    page.reload()
    page.wait_for_timeout(3000)
    
    activity_after_reload = page.evaluate('''() => {
        return {
            logsCount: window.getUserActivityLogs().length,
            storageVal: localStorage.getItem('egx_user_audit_log'),
            isCleared: localStorage.getItem('egx_activity_cleared')
        };
    }''')
    print('  Activity log status after reload:', activity_after_reload)
    
    # TEST 7: Tools Sub-Tabs
    print('\n[TEST 7] Testing Tools Sub-Tabs...')
    page.evaluate("() => { if (typeof switchTab === 'function') switchTab('tools'); }")
    page.wait_for_timeout(1500)
    tools_results = page.evaluate('''() => {
        const results = {};
        
        // Zakat — functions are inside IIFE, check DOM elements exist
        results.zakat_form_exists = document.querySelector('[id*="zakat"], [onclick*="zakat"], [onclick*="Zakat"]') !== null;
        const zakatBtn = document.querySelector('[onclick*="calculateZakat"], [onclick*="fillZakatFromPortfolio"]');
        if (zakatBtn) { zakatBtn.click(); results.zakat_btn_clicked = true; }
        else { results.zakat_btn_clicked = false; }
        
        // DCA — check input elements exist
        results.dca_inputs_exist = document.getElementById("dca_cur_qty") !== null;
        if (results.dca_inputs_exist) {
            document.getElementById("dca_cur_qty").value = 100;
            document.getElementById("dca_cur_buy").value = 100;
            document.getElementById("dca_new_price").value = 90;
            document.getElementById("dca_new_qty").value = 50;
            const dcaBtn = document.querySelector('[onclick*="calculateDca"]');
            if (dcaBtn) { dcaBtn.click(); results.dca_btn_clicked = true; }
            results.dca_result_exists = document.getElementById("dcaResultCard") !== null;
        }
        
        return results;
    }''')
    print('  Tools execution results:', tools_results)
    
    # TEST 8: Console Errors
    print('\n[TEST 8] Console Errors count:', len(console_errors))
    if console_errors:
        print('  Errors:', console_errors)
        
    page.screenshot(path="tests/v16_9_verified.png")
    print('\nSaved verification screenshot to tests/v16_9_verified.png')
    print("=" * 60)
    
    browser.close()
