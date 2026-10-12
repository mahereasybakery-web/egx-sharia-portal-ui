import os
import re
import json

workspace = r"C:\Users\96656\.gemini\antigravity\scratch\egx-sharia-portal-ui"

print("--- 1. MARKET DATA JSON VALIDATION ---")
try:
    with open(os.path.join(workspace, "market_data.json"), "r", encoding="utf-8") as f:
        md = json.load(f)
    print("market_data.json is VALID JSON.")
    print(f"Total stocks in market_data.json: {len(md.get('stocks', []))}")
    print(f"Total funds in market_data.json: {len(md.get('funds', []))}")
except Exception as e:
    print("market_data.json ERROR:", e)

print("\n--- 2. BRACE & PARENTHESIS BALANCE CHECK IN JS FILES ---")
js_files = [f for f in os.listdir(os.path.join(workspace, "js")) if f.endswith(".js")]
for js_file in js_files:
    path = os.path.join(workspace, "js", js_file)
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    # Strip string literals and comments to check bracket balance
    # remove multiline comments
    clean = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    # remove single line comments
    clean = re.sub(r'//.*$', '', clean, flags=re.MULTILINE)
    
    # Count braces, brackets, parentheses
    c_curly_o = clean.count('{')
    c_curly_c = clean.count('}')
    c_paren_o = clean.count('(')
    c_paren_c = clean.count(')')
    c_brack_o = clean.count('[')
    c_brack_c = clean.count(']')
    
    diff_curly = c_curly_o - c_curly_c
    diff_paren = c_paren_o - c_paren_c
    diff_brack = c_brack_o - c_brack_c
    
    status = "OK" if diff_curly == 0 and diff_paren == 0 and diff_brack == 0 else "MISMATCH"
    print(f"{js_file:<25}: {status} | {{}}: {diff_curly:+d}, (): {diff_paren:+d}, []: {diff_brack:+d} (Total lines: {len(content.splitlines())})")

print("\n--- 3. SW.JS VALIDATION ---")
with open(os.path.join(workspace, "sw.js"), "r", encoding="utf-8") as f:
    sw_content = f.read()
c_o = sw_content.count('{')
c_c = sw_content.count('}')
print(f"sw.js balance: {{}}: {c_o - c_c}")
m = re.search(r"CACHE_NAME\s*=\s*['\"]([^'\"]+)['\"]", sw_content)
if m:
    print(f"sw.js CACHE_NAME: {m.group(1)}")

print("\n--- 4. CHECK SCRIPT VERSIONS IN INDEX.HTML ---")
with open(os.path.join(workspace, "index.html"), "r", encoding="utf-8") as f:
    html = f.read()

scripts = re.findall(r'<script\s+src="([^"]+)"', html)
for s in scripts:
    print(f"Script loaded: {s}")

print("\n--- 5. CHECK FOR DEAD/DUPLICATE CONSTANTS IN APP.JS ---")
with open(os.path.join(workspace, "js/app.js"), "r", encoding="utf-8") as f:
    app_lines = f.readlines()

const_defs = {}
for idx, line in enumerate(app_lines, 1):
    m = re.match(r'^(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=', line.strip())
    if m:
        cname = m.group(1)
        if cname not in const_defs:
            const_defs[cname] = []
        const_defs[cname].append(idx)

dupe_vars = {k: v for k, v in const_defs.items() if len(v) > 1}
print(f"Variables declared multiple times in top scope: {len(dupe_vars)}")
for k, v in list(dupe_vars.items())[:15]:
    print(f"  {k}: lines {v}")
