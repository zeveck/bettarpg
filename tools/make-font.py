#!/usr/bin/env python3
"""Makes the game's two static fonts from Pixelify Sans (OFL, no Reserved Font
Name), with a few changes for readability at small sizes: the capital B gets
square left corners ("Betta" read as "Getta"), and the digits 0, 2 and 5 are
redrawn on the font's own pixel grid (and Z given a flat top) so they can't
be read as O, Z and S.
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

DIGITS = {
    'zero': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
    'two':  ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
    'five': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
    'Z':    ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
}

def redraw_digits(font):
    """Draw 0, 2 and 5 as pixel bitmaps on the font's grid (5 x 7 cells)."""
    glyf = font['glyf']
    ref = glyf['zero']; ref.recalcBounds(glyf)
    x0, y0, x1, y1 = ref.xMin, ref.yMin, ref.xMax, ref.yMax
    cw, ch = (x1 - x0) / 5, (y1 - y0) / 7
    # stroke = the B's left stem (outer to inner contour), a little more than a cell
    b = glyf['B']; coords = list(b.getCoordinates(glyf)[0]); ends = list(b.endPtsOfContours)
    stem = min(x for x, _ in coords[ends[0] + 1:]) - min(x for x, _ in coords[:ends[0] + 1])
    extra = max(0, stem - cw)
    for name, rows in DIGITS.items():
        pen = TTGlyphPen(glyf)
        for r, row in enumerate(rows):
            c = 0
            while c < 5:
                if row[c] != '#': c += 1; continue
                e = c
                while e < 5 and row[e] == '#': e += 1
                left = round(x0 + c * cw); right = round(min(x1, x0 + e * cw + extra))
                top = round(y1 - r * ch); bottom = round(max(y0, y1 - (r + 1) * ch - extra))
                pen.moveTo((left, bottom)); pen.lineTo((left, top)); pen.lineTo((right, top)); pen.lineTo((right, bottom)); pen.closePath()
                c = e
        glyf[name] = pen.glyph()

def rename(font, suffix):
    for rec in font['name'].names:
        if rec.nameID in (1, 3, 4, 6, 16):
            s = rec.toUnicode().replace('Pixelify Sans', 'BettaPixel').replace('PixelifySans', 'BettaPixel')
            rec.string = s

for wght in (400, 600):
    f = TTFont(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts', 'PixelifySans.ttf'))
    st = instancer.instantiateVariableFont(f, {'wght': wght})
    square_b(st)
    redraw_digits(st)
    rename(st, str(wght))
    out = os.path.join(fonts, f'BettaPixel-{wght}.ttf')
    st.save(out)
    print('wrote', out)
