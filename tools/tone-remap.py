#!/usr/bin/env python3
"""tone-remap.py SRC.png OUT.png DARK MID LIGHT [--keep 2A1A12]
Remap a native sprite's fill to a 3-tone palette ramp by luminance rank (the outline colour is kept):
the darkest third of fill colours -> DARK, middle -> MID, lightest -> LIGHT (hex, from tools/palette.png)."""
import sys
from PIL import Image
src, out, *ramp = sys.argv[1:6]
keep = '2A1A12'
hexrgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
lum = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]
im = Image.open(src).convert('RGBA'); p = im.load()
cols = sorted({p[x, y][:3] for y in range(im.height) for x in range(im.width) if p[x, y][3] and '%02X%02X%02X' % p[x, y][:3] != keep}, key=lum)
n = len(cols)
m = {c: hexrgb(ramp[min(2, i * 3 // max(1, n))]) for i, c in enumerate(cols)}
for y in range(im.height):
    for x in range(im.width):
        if p[x, y][3] and p[x, y][:3] in m:
            p[x, y] = m[p[x, y][:3]] + (255,)
im.save(out)
