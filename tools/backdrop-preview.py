#!/usr/bin/env python3
"""backdrop-preview.py SRC_JPG NATIVE_PNG OUT [sprite.png ...] - source (top) and native x2 with the betta x2
(and optional sprites x2) standing in the middle third; a line marks the bottom 80 logical px (menu)."""
import sys, os
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src, nat, out = sys.argv[1:4]
a = Image.open(src).convert('RGB'); a = a.resize((864, int(864 * a.height / a.width)))
b = Image.open(nat).convert('RGBA').resize((864, 400), Image.NEAREST)
def x2(p):
    im = Image.open(p).convert('RGBA'); return im.resize((im.width * 2, im.height * 2), Image.NEAREST)
b.alpha_composite(x2(os.path.join(ROOT, 'game/assets/native/original/main_fish/player_betta.png')), (220, 190))
x = 520
for p in sys.argv[4:]:
    s = x2(p); b.alpha_composite(s, (x, 260 - s.height)); x += s.width + 20
d = ImageDraw.Draw(b); d.line([(0, 320), (864, 320)], fill=(255, 0, 0, 255))
s = Image.new('RGB', (864, a.height + 408)); s.paste(a, (0, 0)); s.paste(b.convert('RGB'), (0, a.height + 8)); s.save(out)
