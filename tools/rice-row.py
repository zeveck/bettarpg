#!/usr/bin/env python3
"""rice-row.py OUT CLUMP.png [CLUMP.png ...] [--pitch 16] - planted row of clumps, bottom-aligned,
centred every PITCH px; canvas = n*PITCH wide and pixels past either edge wrap around, so rows
tile side by side seamlessly. A clump name ending in ':m' is mirrored."""
import sys
from PIL import Image, ImageOps
args = sys.argv[1:]
pitch = 16
if '--pitch' in args:
    i = args.index('--pitch'); pitch = int(args[i + 1]); del args[i:i + 2]
out, specs = args[0], args[1:]
ims = []
for s in specs:
    p, _, m = s.partition(':')
    im = Image.open(p).convert('RGBA')
    ims.append(ImageOps.mirror(im) if m == 'm' else im)
W, H = pitch * len(ims), max(i.height for i in ims)
row = Image.new('RGBA', (W, H), (0, 0, 0, 0))
rp = row.load()
for k, im in enumerate(ims):
    x0 = k * pitch + pitch // 2 - im.width // 2
    y0 = H - im.height
    ip = im.load()
    for y in range(im.height):
        for x in range(im.width):
            if ip[x, y][3] >= 128:
                rp[(x0 + x) % W, y0 + y] = ip[x, y]
row.save(out)
print(out, row.size)
