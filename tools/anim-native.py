#!/usr/bin/env python3
"""anim-native.py - put generated animation frames on a native sprite's pixel grid.

  anim-native.py --frame0 NATIVE.png --raw F1.png [F2.png ...] --cell C --out PREFIX
                 [--flip] [--anchor head|tail] [--reuse 2=0] [--src0 SRC0.png]

Frame 0 is the native sprite itself (unchanged). Each raw frame (a big generated image):
  1. keeps the largest blob (alpha >= 128) plus nearby small blobs, flipped first if --flip;
  2. is sampled on its drawn grid if one is found within +-15% of --cell (the source sprite's
     cell size), else majority-box reduced with cell C;
  3. is snapped to frame 0's OWN colours only (same palette and brightness as the kept sprite);
  4. gets its old outer ring stripped and frame 0's outline colour redrawn (1 px, 4-neighbour);
  5. is registered to frame 0 by the integer offset that best matches frame 0 over the anchor
     region (head = front 40 % of the body, tail = back 30 %), searched within +-8 px.
All frames are written on one shared canvas (the union of their boxes): PREFIX_0.png ... and the
placement of frame 0 inside it is printed, so the static sprite and frame 0 line up.
"""
import argparse, importlib.util, os
from collections import Counter
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location('en', os.path.join(ROOT, 'tools', 'extract-native.py'))
en = importlib.util.module_from_spec(spec)
spec.loader.exec_module(en)


def dist(a, b):
    rm = (a[0] + b[0]) / 2
    dr, dg, db = a[0] - b[0], a[1] - b[1], a[2] - b[2]
    return (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db


def opaque(im):
    w, h = im.size
    p = im.load()
    return {(x, y): p[x, y][:3] for y in range(h) for x in range(w) if p[x, y][3] >= 128}


def edge_pixels(px):
    return {k for k in px if any((k[0] + dx, k[1] + dy) not in px for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))}


def sample(raw_path, cell, flip):
    im = Image.open(raw_path).convert('RGBA')
    if flip:
        im = ImageOps.mirror(im)
    items = en.cut_items(im)
    big = max(items, key=lambda b: b[4])
    sub = en.isolate(im, big)
    w, h = sub.size
    col, rowp = en.edge_profiles(sub, (0, 0, w, h))
    period, score, ox, oy = en.detect_period(col, rowp, cell * 0.85, cell * 1.15)
    if score > 1.4:
        out = en.trim(en.sample_grid(sub, (0, 0, w, h), period, ox, oy, col, rowp))
        how = f'grid {period:.2f} (score {score:.2f})'
    else:
        bb = sub.getchannel('A').getbbox()
        out = en.trim(en.box_reduce(sub, bb, cell, snap_first=False))
        how = f'box {cell:.2f} (grid score {score:.2f})'
    return out, how


def scaled(im, f):
    """Darken/lighten RGB by factor f (alpha kept)."""
    r, g, b, a = im.split()
    r, g, b = (ch.point(lambda v: max(0, min(255, int(v * f)))) for ch in (r, g, b))
    return Image.merge('RGBA', (r, g, b, a))


def mean_lum(px):
    return sum(en.lum(c) for c in px.values()) / max(1, len(px))


def to_frame0(im, pal, outline):
    w, h = im.size
    src = im.load()
    W, H = w + 2, h + 2
    px = {}
    cache = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = src[x, y]
            if a >= 128:
                c = (r, g, b)
                if c not in cache:
                    cache[c] = min(pal, key=lambda p: dist(c, p))
                px[(x + 1, y + 1)] = cache[c]
    for k in [k for k in edge_pixels(px) if en.lum(px[k]) < 72]:
        del px[k]
    add = [(x, y) for y in range(H) for x in range(W) if (x, y) not in px and any(
        (x + dx, y + dy) in px and px[(x + dx, y + dy)] != outline for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))]
    for k in add:
        px[k] = outline
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    op = out.load()
    for (x, y), c in px.items():
        op[x, y] = c + (255,)
    return en.trim(out)


def register(f0px, fpx, region, search=8):
    best, bo = -1e9, (0, 0)
    for dy in range(-search, search + 1):
        for dx in range(-search, search + 1):
            s = 0
            for (x, y) in region:
                c = fpx.get((x - dx, y - dy))
                if c is None:
                    s -= 1
                else:
                    s += 1 if c == f0px[(x, y)] else (0.5 if dist(c, f0px[(x, y)]) < 3000 else 0)
            if s > best:
                best, bo = s, (dx, dy)
    return bo


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--frame0', required=True)
    ap.add_argument('--raw', nargs='+', required=True, help='raw frames 1..n in order; "reuse:0" repeats frame 0')
    ap.add_argument('--cell', type=float, required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--flip', action='store_true')
    ap.add_argument('--anchor', choices=['head', 'tail'], default='head')
    ap.add_argument('--match-lum', action='store_true', help='scale each frame so its mean luminance matches frame 0')
    ap.add_argument('--keep-front', type=float, default=0.0,
                    help='take the front FRACTION of the body (head side) from frame 0, so the head stays steady')
    a = ap.parse_args()

    f0 = en.trim(Image.open(a.frame0).convert('RGBA'))
    f0px = opaque(f0)
    pal = sorted(set(f0px.values()))
    outline = Counter(f0px[k] for k in edge_pixels(f0px)).most_common(1)[0][0]
    xs = [k[0] for k in f0px]
    x0, x1 = min(xs), max(xs)
    # sprites face right: head = the right 40 %, tail = the left 30 %
    if a.anchor == 'head':
        region = [k for k in f0px if k[0] >= x1 - 0.4 * (x1 - x0)]
    else:
        region = [k for k in f0px if k[0] <= x0 + 0.3 * (x1 - x0)]

    frames = [(f0px, (0, 0), 'frame 0 (native sprite)')]
    for r in a.raw:
        if r.startswith('reuse:'):
            frames.append((frames[int(r.split(':')[1])][0], frames[int(r.split(':')[1])][1], f'reuse of frame {r.split(":")[1]}'))
            continue
        s, how = sample(r, a.cell, a.flip)
        fi = to_frame0(s, pal, outline)
        target = mean_lum(f0px)
        if a.match_lum:
            lo, hi = 0.6, 1.4
            for _ in range(10):
                f = (lo + hi) / 2
                fi = to_frame0(scaled(s, f), pal, outline)
                if mean_lum(opaque(fi)) > target:
                    hi = f
                else:
                    lo = f
            how += f', lum x{f:.2f}'
        fpx = opaque(fi)
        off = register(f0px, fpx, region)
        if a.keep_front > 0:
            cut = x1 - a.keep_front * (x1 - x0)  # sprites face right: front = right side
            moved = {(x + off[0], y + off[1]): c for (x, y), c in fpx.items() if x + off[0] < cut}
            moved.update({k: c for k, c in f0px.items() if k[0] >= cut})
            # re-outline at the seam: drop generated pixels left floating in front of the cut
            fpx = {(x - off[0], y - off[1]): c for (x, y), c in moved.items()}
            how += f', front {a.keep_front:.0%} from frame 0'
        frames.append((fpx, off, f'{os.path.basename(r)}: {how}, {fi.size[0]}x{fi.size[1]}, offset {off}'))

    pts = [(x + o[0], y + o[1]) for fpx, o, _ in frames for (x, y) in fpx]
    mx, my = min(p[0] for p in pts), min(p[1] for p in pts)
    W = max(p[0] for p in pts) - mx + 1
    H = max(p[1] for p in pts) - my + 1
    os.makedirs(os.path.dirname(a.out) or '.', exist_ok=True)
    for i, (fpx, o, note) in enumerate(frames):
        im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        p = im.load()
        for (x, y), c in fpx.items():
            p[x + o[0] - mx, y + o[1] - my] = c + (255,)
        im.save(f'{a.out}_{i}.png')
        lum = sum(en.lum(c) for c in fpx.values()) / len(fpx)
        print(f'{a.out}_{i}.png {W}x{H} mean lum {lum:5.1f} px {len(fpx):5d}  {note}')
    print(f'frame 0 sits at ({-mx}, {-my}) inside the {W}x{H} canvas')


if __name__ == '__main__':
    main()
