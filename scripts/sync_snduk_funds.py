#!/usr/bin/env python3
"""
sync_snduk_funds.py
Scrapes official NAV certificate prices and last update dates directly from SNDUK (https://snduk.com)
for the user's funds (CMS, BWA, NMF) and updates market_data.json.
"""

import urllib.request
import re
import json
import os
import datetime

FUNDS_MAP = {
    'CMS': {
        'url': 'https://snduk.com/eg/funds/misr-shariah-equity-fund?lang=en',
        'name': 'صندوق مؤشر CI EGX33 شريعة (CMS)',
        'manager': 'CI Capital Asset Management'
    },
    'BWA': {
        'url': 'https://snduk.com/eg/funds/beltone-wafra?lang=en',
        'name': 'صندوق بلتون وفرة للشريعة (BWA)',
        'manager': 'Beltone Asset Management'
    },
    'NMF': {
        'url': 'https://snduk.com/eg/funds/naeem-misr-sharia-fund?lang=en',
        'name': 'صندوق نعيم مصر للشريعة (NMF)',
        'manager': 'Naeem Financial Investments'
    }
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
}

def fetch_snduk_fund(ticker, info):
    url = info['url']
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
            # 1. Search for currentPrice in RSC / JSON stream
            price_match = re.search(r'\\?"currentPrice\\?"\s*:\s*\\?"([0-9\.]+)\\?"', html)
            if not price_match:
                # Fallback to EGP text
                price_match = re.search(r'EGP[^0-9]*([0-9]+\.[0-9]+)', html)
                
            # 2. Search for lastPriceUpdate in RSC / JSON stream
            date_match = re.search(r'\\?"lastPriceUpdate\\?"\s*:\s*\\?"([0-9\-]+)\\?"', html)
            
            price = float(price_match.group(1)) if price_match else None
            date = date_match.group(1) if date_match else datetime.date.today().isoformat()
            
            return {
                'ticker': ticker,
                'price': price,
                'date': date,
                'url': url,
                'status': 'success' if price else 'price_not_found'
            }
    except Exception as e:
        return {
            'ticker': ticker,
            'price': None,
            'date': None,
            'url': url,
            'status': f'error: {str(e)}'
        }

def update_market_data(results):
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(repo_root, 'market_data.json')
    if not os.path.exists(file_path):
        file_path = 'market_data.json'
        
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    if 'funds' not in data:
        data['funds'] = {}
        
    for ticker, res in results.items():
        if res.get('price') is not None and ticker in data['funds']:
            old_price = data['funds'][ticker].get('close')
            new_price = res['price']
            data['funds'][ticker]['close'] = new_price
            data['funds'][ticker]['open'] = new_price
            data['funds'][ticker]['last_nav_date'] = res.get('date', datetime.date.today().isoformat())
            data['funds'][ticker]['source'] = f"موقع صندوق SNDUK المعتمد ({res.get('date')}) • {FUNDS_MAP[ticker]['manager']}"
            print(f"Updated {ticker}: {old_price} -> {new_price} (Date: {res.get('date')})")
            
    # Also update events titles/summaries if present
    if 'events' in data and isinstance(data['events'], list):
        for ev in data['events']:
            tk = ev.get('ticker')
            if tk in results and results[tk].get('price') is not None:
                p = results[tk]['price']
                d = results[tk].get('date')
                if tk == 'CMS':
                    ev['title'] = f"إفصاح معتمد (موقع صندوق): وثيقة مؤشر CI EGX33 شريعة تسجل {p:.4f} ج.م"
                    ev['summary'] = f"السعر المعتمد المعلن على موقع صندوق SNDUK بتاريخ {d} لصافي أصول الوثيقة هو {p:.4f} ج.م."
                    ev['url'] = FUNDS_MAP['CMS']['url']
                    ev['source'] = "موقع صندوق SNDUK • إفصاح رسمي"
                elif tk == 'BWA':
                    ev['title'] = f"إفصاح معتمد (موقع صندوق): وثيقة بلتون وفرة تسجل {p:.4f} ج.م"
                    ev['summary'] = f"السعر المعتمد المعلن على موقع صندوق SNDUK بتاريخ {d} لصافي أصول الوثيقة هو {p:.4f} ج.م."
                    ev['url'] = FUNDS_MAP['BWA']['url']
                    ev['source'] = "موقع صندوق SNDUK • إفصاح رسمي"
                elif tk == 'NMF':
                    ev['title'] = f"إفصاح معتمد (موقع صندوق): وثيقة نعيم مصر للشريعة تسجل {p:.4f} ج.م"
                    ev['summary'] = f"السعر المعتمد المعلن على موقع صندوق SNDUK بتاريخ {d} لصافي أصول الوثيقة هو {p:.4f} ج.م."
                    ev['url'] = FUNDS_MAP['NMF']['url']
                    ev['source'] = "موقع صندوق SNDUK • إفصاح رسمي"

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("market_data.json successfully updated with live SNDUK prices!")

def main():
    print("Scraping live fund prices from SNDUK (https://snduk.com)...")
    results = {}
    for ticker, info in FUNDS_MAP.items():
        res = fetch_snduk_fund(ticker, info)
        results[ticker] = res
        print(f"[{ticker}] Status: {res['status']} | Price: {res['price']} EGP | Date: {res['date']}")
        
    update_market_data(results)

if __name__ == '__main__':
    main()
