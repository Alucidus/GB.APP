#!/usr/bin/env python3
"""Bump the app build number across app.js, sw.js and index.html.  Usage: python3 bump.py cf100"""
import re, sys, pathlib

new = sys.argv[1]
root = pathlib.Path(__file__).parent / "public"
cur = re.search(r'APP_BUILD = "(cf\d+)"', (root / "app.js").read_text()).group(1)
print("bump", cur, "->", new)
for name in ("app.js", "sw.js", "index.html"):
    p = root / name
    s = p.read_text()
    s = s.replace('APP_BUILD = "%s"' % cur, 'APP_BUILD = "%s"' % new)
    s = s.replace('gbcf-%s' % cur, 'gbcf-%s' % new)
    s = s.replace('?v=%s' % cur, '?v=%s' % new)
    p.write_text(s)
    print("  ", name)
