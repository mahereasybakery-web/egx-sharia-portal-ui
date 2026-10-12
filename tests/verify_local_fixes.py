import sys
import json
import http.server
import socketserver
import threading
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

PORT = 8089

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
    
    # 1. Check Fees card on first page
    fees_first_page = page.evaluate('() => document.getElementById("p_thndr_fees_card")?.innerText')
    print('1. First page Thndr fees card:', fees_first_page)
    
    # 2. Switch to Performance tab
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
    print('\n2. Performance view ledger & KPIs:\n', json.dumps(perf_fees, ensure_ascii=False, indent=2))
    
    # 3. Check Fund Prices in userHoldings and DOM
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
    print('\n3. Funds & Gold Status:\n', json.dumps(funds_status, ensure_ascii=False, indent=2))
    
    # 4. Trigger syncLiveFundsEngine()
    print('\n4. Testing syncLiveFundsEngine()...')
    res = page.evaluate('''async () => {
        return await window.syncLiveFundsEngine(true, false);
    }''')
    page.wait_for_timeout(1000)
    print('  syncLiveFundsEngine result:', res)
    
    # Re-check matrix after sync
    matrix_after = page.evaluate('''() => ({
        AZG: document.getElementById("matrix-price-AZG")?.innerText,
        CMS: document.getElementById("matrix-price-CMS")?.innerText,
        BWA: document.getElementById("matrix-price-BWA")?.innerText,
        NMF: document.getElementById("matrix-price-NMF")?.innerText,
        THNDR_GOLD: document.getElementById("matrix-price-THNDR_GOLD")?.innerText
    })''')
    print('  Matrix prices after sync:', matrix_after)
    
    # 5. Check console errors
    print('\n5. Console Errors count:', len(console_errors))
    if console_errors:
        print('  Errors:', console_errors)
        
    # Take screenshot for proof
    page.screenshot(path="tests/v16_8_verified.png")
    print('\nSaved verification screenshot to tests/v16_8_verified.png')
    
    browser.close()
