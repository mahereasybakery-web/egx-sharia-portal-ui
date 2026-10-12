import urllib.request, json, re

urls = [
    'https://snduk.com/eg/funds?lang=en&search=gold',
    'https://snduk.com/eg/funds?lang=en&search=azimut'
]

for url in urls:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            html = r.read().decode('utf-8', errors='ignore')
            links = re.findall(r'/eg/funds/[a-zA-Z0-9\-]+', html)
            print(url, '->', set(links))
    except Exception as e:
        print(url, 'error:', e)
