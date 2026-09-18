#!/usr/bin/env python3
"""Update the client build and service-worker cache together: python3 bump.py cf100."""
import re
import sys
from pathlib import Path
if len(sys.argv) != 2 or not re.fullmatch(r'cf[1-9][0-9]*', sys.argv[1]):
    raise SystemExit('Usage: python3 bump.py cfNN')
root = Path(__file__).resolve().parent
app = root / 'public/app.js'
match = re.search(r'const APP_BUILD = "(cf[0-9]+)";', app.read_text(encoding='utf-8'))
if not match:
    raise SystemExit('APP_BUILD was not found; no files changed')
old, new = match[1], sys.argv[1]
for name in ['public/app.js', 'public/index.html', 'public/sw.js']:
    p = root / name
    p.write_text(p.read_text(encoding='utf-8').replace(old, new), encoding='utf-8')
print(f'{old} -> {new}')
