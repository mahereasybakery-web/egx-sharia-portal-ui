import sys
import json
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    page.goto('https://mahereasybakery-web.github.io/egx-sharia-portal-ui/')
    page.wait_for_timeout(3000)
    
    # Check funds in fundsHoldingsSmartBody and cards
    funds_table = page.evaluate('''() => {
        const rows = Array.from(document.querySelectorAll('#fundsHoldingsSmartBody tr'));
        return rows.map(r => r.innerText.trim().replace(/\\n+/g, " | "));
    }''')
    print('=== Funds in Portfolio Table (#fundsHoldingsSmartBody) ===')
    for r in funds_table:
        print('  ', r)
        
    funds_cards = page.evaluate('''() => {
        const cards = Array.from(document.querySelectorAll('#fundsHoldingsCardsContainer > div'));
        return cards.map(c => c.innerText.trim().replace(/\\n+/g, " | "));
    }''')
    print('\n=== Funds in Portfolio Cards (#fundsHoldingsCardsContainer) ===')
    for c in funds_cards:
        print('  ', c)

    gold_table = page.evaluate('''() => {
        const rows = Array.from(document.querySelectorAll('#goldHoldingsSmartBody tr'));
        return rows.map(r => r.innerText.trim().replace(/\\n+/g, " | "));
    }''')
    print('\n=== Gold in Portfolio Table (#goldHoldingsSmartBody) ===')
    for r in gold_table:
        print('  ', r)
        
    user_holdings_data = page.evaluate('''() => {
        return window.userHoldings.map(h => ({
            ticker: h.ticker,
            name: h.name,
            qty: h.qty,
            buy: h.buy,
            cur: h.cur,
            isFund: h.isFund
        }));
    }''')
    print('\n=== window.userHoldings ===\n', json.dumps(user_holdings_data, ensure_ascii=False, indent=2))
        
    browser.close()
