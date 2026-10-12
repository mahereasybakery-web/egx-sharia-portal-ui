import sys
import json
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    console_msgs = []
    page.on('console', lambda msg: console_msgs.append(f"[{msg.type}] {msg.text}"))
    
    page.goto('https://mahereasybakery-web.github.io/egx-sharia-portal-ui/')
    page.wait_for_timeout(3000)
    
    # Check what funds are in DOM
    funds_info = page.evaluate('''() => {
        const rows = Array.from(document.querySelectorAll('#fundsSmartBody tr'));
        return rows.map(r => r.innerText.trim().replace(/\\n+/g, " | "));
    }''')
    print('=== Funds in Portfolio (#fundsSmartBody) ===')
    for r in funds_info:
        print('  ', r)
        
    matrix_prices = page.evaluate('''() => {
        return {
            AZG: document.getElementById("matrix-price-AZG")?.innerText,
            CMS: document.getElementById("matrix-price-CMS")?.innerText,
            BWA: document.getElementById("matrix-price-BWA")?.innerText,
            NMF: document.getElementById("matrix-price-NMF")?.innerText,
            THNDR_GOLD: document.getElementById("matrix-price-THNDR_GOLD")?.innerText,
            gold_terminal: document.getElementById("terminal-gold-gram")?.innerText
        };
    }''')
    print('\n=== Matrix prices ===\n', json.dumps(matrix_prices, ensure_ascii=False, indent=2))
    
    # Check fees card on first page
    fees_card = page.evaluate('() => document.getElementById("p_thndr_fees_card")?.innerText')
    print('\n=== First Page Fees Card ===\n', fees_card)
    
    # Navigate to Performance view
    page.evaluate("() => { if (typeof switchTab === 'function') switchTab('performance'); }")
    page.wait_for_timeout(1000)
    perf_fees = page.evaluate('''() => {
        return {
            paid_fees: document.getElementById("perf_paid_fees")?.innerText,
            gross_pnl: document.getElementById("perf_gross_pnl")?.innerText,
            net_pnl: document.getElementById("perf_net_pnl")?.innerText
        };
    }''')
    print('\n=== Performance Ledger ===\n', json.dumps(perf_fees, ensure_ascii=False, indent=2))
    
    print('\n=== Console Messages (last 15) ===')
    for m in console_msgs[-15:]:
        print('  ', m)
        
    browser.close()
