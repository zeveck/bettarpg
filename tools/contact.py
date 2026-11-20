#!/usr/bin/env python3
"""contact.py OUT SCALE IMG [IMG ...] - native images side by side, betta first, x SCALE nearest,
on a mid-water background, bottom-aligned, wrapping at ~1800 px. Use 'BR' to force a row break."""
import sys, os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BETTA = os.path.join(ROOT, 'game/assets/native/original/main_fish/player_betta.png')
out, scale = sys.argv[1], int(sys.argv[2])
paths = [BETTA] + sys.argv[3:]
rows, row, rw = [], [], 0
for p in paths:
    if p == 'BR':
        rows.append(row); row, rw = [], 0; continue
    im = Image.open(p).convert('RGBA')
    im = im.resize((im.width * scale, im.height * scale), Image.NEAREST)
    if row and rw + im.width > 1800:
        rows.append(row); row, rw = [], 0
    row.append(im); rw += im.width + 8 * scale
rows.append(row)
W = max(sum(i.width + 8 * scale for i in r) for r in rows) + 8 * scale
H = sum(max(i.height for i in r) + 8 * scale for r in rows if r) + 8 * scale
sheet = Image.new('RGBA', (W, H), (0x2B, 0x7F, 0xC4, 255))
y = 8 * scale
for r in rows:
    if not r: continue
    rh = max(i.height for i in r); x = 8 * scale
    for i in r:
        sheet.alpha_composite(i, (x, y + rh - i.height)); x += i.width + 8 * scale
    y += rh + 8 * scale
sheet.convert('RGB').save(out)
print(out, sheet.size)
