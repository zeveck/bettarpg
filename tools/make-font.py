#!/usr/bin/env python3
"""Makes the game's two static fonts from Pixelify Sans (OFL, no Reserved Font
Name), with one change: the capital B gets square left corners, because the
original's cut-off corners make "Betta" read as "Getta" at small sizes.
Needs fontTools (pip install fonttools). Writes game/fonts/BettaPixel-400.ttf
and BettaPixel-600.ttf; the original and its OFL.txt stay alongside."""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.ttGlyphPen import TTGlyphPen

here = os.path.dirname(os.path.abspath(__file__))
fonts = os.path.join(here, '..', 'game', 'fonts')

def square_b(font):
    glyf = font['glyf']
    g = glyf['B']
    coords, ends, _ = g.getCoordinatesAndControls() if hasattr(g, 'getCoordinatesAndControls') else (None, None, None)
    coords = list(g.getCoordinates(glyf)[0])
    ends = list(g.endPtsOfContours)
    contours, start = [], 0
    for e in ends:
        contours.append(coords[start:e + 1]); start = e + 1
    outer = contours[0]
    xs = sorted(set(x for x, _ in outer))
    xmin, xch = xs[0], xs[1]
    ymin = min(y for _, y in outer); ymax = max(y for _, y in outer)
    new = []
    for x, y in outer:
        if x == xch and (y == ymin or y == ymax or abs(y - ymin) < 100 or abs(ymax - y) < 100):
            continue  # the chamfer's corner points
        if x == xmin:
            y = ymin if y < (ymin + ymax) / 2 else ymax
        new.append((x, y))
    # drop consecutive duplicates
    clean = [p for i, p in enumerate(new) if p != new[i - 1]]
    pen = TTGlyphPen(glyf)
    for c in [clean] + contours[1:]:
        pen.moveTo(c[0])
        for p in c[1:]: pen.lineTo(p)
        pen.closePath()
    glyf['B'] = pen.glyph()

def rename(font, suffix):
    for rec in font['name'].names:
        if rec.nameID in (1, 3, 4, 6, 16):
            s = rec.toUnicode().replace('Pixelify Sans', 'BettaPixel').replace('PixelifySans', 'BettaPixel')
            rec.string = s

for wght in (400, 600):
    f = TTFont(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts', 'PixelifySans.ttf'))
    st = instancer.instantiateVariableFont(f, {'wght': wght})
    square_b(st)
    rename(st, str(wght))
    out = os.path.join(fonts, f'BettaPixel-{wght}.ttf')
    st.save(out)
    print('wrote', out)
