import os
import re
import glob

workspace = os.path.abspath(".")
print("=" * 70)
print("COMPREHENSIVE CODEBASE & BUTTON AUDIT")
print("=" * 70)

# 1. Line Counts and File Sizes
files_to_check = [
    "index.html",
    "sw.js",
    "market_data.json",
    "js/app.js",
    "js/gemini-ai.js",
    "js/data-reports.js",
    "js/data-news.js",
    "js/data-valuation.js",
    "js/data-ai-prompts.js",
    "js/universal-export.js"
]

total_lines = 0
total_bytes = 0

print("\n--- 1. FILE METRICS ---")
for rel_path in files_to_check:
    full_path = os.path.join(workspace, rel_path)
    if os.path.exists(full_path):
        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
        line_count = len(lines)
        byte_size = os.path.getsize(full_path)
        total_lines += line_count
        total_bytes += byte_size
        print(f"  {rel_path:<25} : {line_count:>6} lines | {byte_size/1024:>8.1f} KB")
    else:
        print(f"  {rel_path:<25} : MISSING!")

print(f"  {'TOTAL':<25} : {total_lines:>6} lines | {total_bytes/1024:>8.1f} KB")

# 2. Extract all onclick handlers in index.html
with open(os.path.join(workspace, "index.html"), "r", encoding="utf-8") as f:
    html_content = f.read()

onclicks = re.findall(r'onclick="([^"]+)"', html_content)
print(f"\n--- 2. INTERACTIVE BUTTONS & ONCLICK HANDLERS IN index.html ---")
print(f"Total onclick attributes in HTML: {len(onclicks)}")

# Extract unique function calls from onclicks
fn_calls = set()
for oc in onclicks:
    # get function name
    m = re.match(r'([A-Za-z0-9_]+)\s*\(', oc.strip())
    if m:
        fn_calls.add(m.group(1))

print(f"Unique functions invoked from HTML buttons: {len(fn_calls)}")

# 3. Check definition of each function across JS files
js_code = ""
for js_file in glob.glob(os.path.join(workspace, "js", "*.js")):
    with open(js_file, "r", encoding="utf-8", errors="ignore") as f:
        js_code += f.read() + "\n"

missing_functions = []
found_functions = []
for fn in sorted(fn_calls):
    pattern = rf'(function\s+{fn}\b|window\.{fn}\s*=|var\s+{fn}\s*=\s*function|let\s+{fn}\s*=\s*function|const\s+{fn}\s*=\s*function)'
    if re.search(pattern, js_code):
        found_functions.append(fn)
    else:
        # Check inline script in index.html
        if re.search(pattern, html_content):
            found_functions.append(fn)
        else:
            missing_functions.append(fn)

print(f"Validly linked functions: {len(found_functions)}")
print(f"Potentially missing/unlinked functions: {len(missing_functions)}")
if missing_functions:
    print("  Missing functions:", missing_functions)

# 4. Detect Duplicate Function Declarations in js/app.js
print(f"\n--- 3. DUPLICATE FUNCTION DEFINITIONS IN js/app.js ---")
with open(os.path.join(workspace, "js/app.js"), "r", encoding="utf-8", errors="ignore") as f:
    app_lines = f.readlines()

defined_funcs = {}
for idx, line in enumerate(app_lines):
    m = re.search(r'(?:window\.([A-Za-z0-9_]+)\s*=\s*(?:async\s+)?function|function\s+([A-Za-z0-9_]+)\s*\()', line)
    if m:
        fname = m.group(1) or m.group(2)
        if fname:
            if fname not in defined_funcs:
                defined_funcs[fname] = []
            defined_funcs[fname].append(idx + 1)

duplicates = {k: v for k, v in defined_funcs.items() if len(v) > 1}
print(f"Total function names defined in app.js: {len(defined_funcs)}")
print(f"Functions with MULTIPLE definitions: {len(duplicates)}")
for k, v in sorted(duplicates.items(), key=lambda x: len(x[1]), reverse=True)[:20]:
    print(f"  {k:<35} defined {len(v)} times at lines: {v}")

print("=" * 70)
