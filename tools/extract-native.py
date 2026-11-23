#!/usr/bin/env python3
"""extract-native.py - turn big "pixel-art" images into native art-pixel PNGs (Pillow only).

Modes (see design/GAME_DESIGN.md, "The native-pixel rule"):

  --kept [--src DIR] [--dst DIR]
      Kept art: clear a 4 px border, threshold alpha at 128, keep the largest blob (plus the
      hat blob on *_partyhat files), detect the drawn cell size by edge-phase (comb) analysis,
      sample each cell's centre region and save the native PNG under the same subfolder/name.

  --palette [--out tools/palette.png]
      Build the 48-colour snap palette: the design's fixed colours + the native kept sprites'
      colours, quantized together once.

  --sheet <png> --targets <json>
      Target-driven extraction of a generated sheet. targets json: a list (reading order) of
        {"name": "elder_finn", "target": 46, "dim": "w"|"h", "out": "game/assets/native/..."}
      Each item: cut blob -> detect drawn grid -> if within +-20% of target sample at that grid,
      else majority-colour box reduce (cell = round(blob/target)) -> snap to palette ->
      alpha 128 -> strip old outer outline -> redraw clean 1 px #2A1A12 outline.

  --backdrop <png> --out <png>
      Opaque scene: detect grid, sample; if ~432 wide use it, if ~216 keep half resolution,
      else majority-box reduce to 432 wide; centre-crop 432x200 (216x100); snap to palette.
      --size WxH changes the native size (interior rooms are 384x256).
"""
import argparse, json, os, sys
from collections import Counter
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PALETTE_PNG = os.path.join(ROOT, 'tools', 'palette.png')
OUTLINE = (0x2A, 0x1A, 0x12)

# Design fixed colours (Art direction -> Palette).
DESIGN_COLOURS = ['3290D1', '2B7FC4', '1B4F8A', '0E2A47', '081A2E', '5B8C3A', '6B4E2E', '2A1A12',
                  'E8C552', 'E5401F', 'FF4FA3', 'F7C948', '2E6F80', '9FD8E0']

# Reserved slots (design fix 4): salmon (Coral, clear of the player's orange), olive (Nymph),
# lilac (Highwater inn awning, Kelpie), neutral near-black (Reef), mint (Seaweed), light grey.
RESERVED_COLOURS = ['F2827A', '6E7432', 'B89AD8', '2A2A2C', '9ED8B4', 'C8C8C8',
                    'E1DDD1']  # + the old palette's cream-white, so whites don't fall to the grey

# Measured cell sizes (design table) used only as the search window for detection.
KEPT_HINT = {
    'player_betta': 18.8, 'player_betta_with_helmet': 21.0, 'player_betta_with_almost_armor': 19.8,
    'player_betta_full_metal': 18.5, 'aggressive_guppy': 28.7, 'territorial-angelfish': 30.8,
    'sneaky_catfish': 26.8, 'fierce_cichlid': 29.5, 'prehistoric_gar': 24.2,
    'dunkleosteus_sub': 18.2, 'rice_paddy_tuft': 27.5, 'partyhat': 15.4, 'bettahome': 8.8,
}


# ---------------------------------------------------------------- basics
def hexrgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def components(mask, w, h):
    """8-connected components of a flat bytearray mask. Returns list of (pixel index lists)."""
    lab = [0] * (w * h)
    comps = []
    for start in range(w * h):
        if not mask[start] or lab[start]:
            continue
        cid = len(comps) + 1
        stack = [start]
        lab[start] = cid
        pix = []
        while stack:
            i = stack.pop()
            pix.append(i)
            y, x = divmod(i, w)
            for dy in (-1, 0, 1):
                yy = y + dy
                if yy < 0 or yy >= h:
                    continue
                base = yy * w
                for dx in (-1, 0, 1):
                    xx = x + dx
                    if 0 <= xx < w:
                        j = base + xx
                        if mask[j] and not lab[j]:
                            lab[j] = cid
                            stack.append(j)
        comps.append(pix)
    return comps


def bbox_of(pix, w):
    xs = [i % w for i in pix]
    ys = [i // w for i in pix]
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


# ---------------------------------------------------------------- grid detection
def edge_profiles(img, box):
    """Column and row edge-energy profiles inside box of an RGBA image (alpha premultiplied on black)."""
    x0, y0, x1, y1 = box
    sub = img.crop(box)
    w, h = sub.size
    px = sub.load()
    vals = [[None] * w for _ in range(h)]
    for y in range(h):
        row = vals[y]
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 128:
                row[x] = (0, 0, 0, 0)
            else:
                row[x] = (r, g, b, 255)
    col = [0.0] * (w + 1)
    rowp = [0.0] * (h + 1)
    for y in range(h):
        row = vals[y]
        for x in range(w - 1):
            p, q = row[x], row[x + 1]
            d = abs(p[0] - q[0]) + abs(p[1] - q[1]) + abs(p[2] - q[2]) + abs(p[3] - q[3])
            if d > 36:
                col[x + 1] += d
    for y in range(h - 1):
        r1, r2 = vals[y], vals[y + 1]
        for x in range(w):
            p, q = r1[x], r2[x]
            d = abs(p[0] - q[0]) + abs(p[1] - q[1]) + abs(p[2] - q[2]) + abs(p[3] - q[3])
            if d > 36:
                rowp[y + 1] += d
    return col, rowp


def maxfilt(p, r=1):
    n = len(p)
    return [max(p[max(0, i - r):min(n, i + r + 1)]) for i in range(n)]


def comb_scores(profile, pmin, pmax, step=0.05):
    pm = maxfilt(profile, 1)
    n = len(pm)
    mean = sum(pm) / max(1, n) or 1.0
    out = []
    p = pmin
    while p <= pmax:
        best, besto = 0.0, 0.0
        o = 0.0
        while o < p:
            s, c = 0.0, 0
            k = o
            while k < n:
                s += pm[int(round(k))] if int(round(k)) < n else 0
                c += 1
                k += p
            if c:
                v = s / c
                if v > best:
                    best, besto = v, o
            o += 0.5
        out.append((p, best / mean, besto))
        p += step
    return out


def detect_period(col, rowp, pmin, pmax):
    """Joint period for both axes (square cells). Returns (period, score, ox, oy)."""
    sc = comb_scores(col, pmin, pmax)
    sr = comb_scores(rowp, pmin, pmax)
    joint = [(a[0], a[1] + b[1], a[2], b[2]) for a, b in zip(sc, sr)]
    top = max(j[1] for j in joint)
    # smallest period close to the best score (harmonics 2p, 3p score about as well)
    for j in joint:
        if j[1] >= 0.9 * top:
            # refine: best score within +-8% of this period
            near = [k for k in joint if abs(k[0] - j[0]) <= 0.08 * j[0]]
            b = max(near, key=lambda k: k[1])
            return b[0], b[1] / 2, b[2], b[3]
    b = max(joint, key=lambda k: k[1])
    return b[0], b[1] / 2, b[2], b[3]


def boundaries(profile, period, offset, length):
    """Expected boundaries offset + k*period snapped to local edge maxima (+-20% of a cell)."""
    out = []
    k = offset - period * int(offset / period + 1)
    while k <= length + period:
        out.append(k)
        k += period
    rad = max(1, int(period * 0.2))
    n = len(profile)
    res = []
    for b in out:
        c = int(round(b))
        lo, hi = max(0, c - rad), min(n - 1, c + rad)
        if lo > hi:
            res.append(c)
            continue
        seg = profile[lo:hi + 1]
        m = max(seg)
        res.append(lo + seg.index(m) if m > 0 else c)
    # keep monotonic, drop duplicates / too-close
    clean = []
    for b in res:
        if not clean or b - clean[-1] >= max(1, period * 0.5):
            clean.append(b)
    return clean


def sample_grid(img, box, period, ox, oy, col, rowp):
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    bx = [b for b in boundaries(col, period, ox, w)]
    by = [b for b in boundaries(rowp, period, oy, h)]
    px = img.load()
    W, H = img.size
    out_w, out_h = len(bx) - 1, len(by) - 1
    out = Image.new('RGBA', (out_w, out_h), (0, 0, 0, 0))
    op = out.load()
    for j in range(out_h):
        ya, yb = by[j], by[j + 1]
        for i in range(out_w):
            xa, xb = bx[i], bx[i + 1]
            # inner 50% region
            cw, ch = xb - xa, yb - ya
            ia, ib = xa + cw // 4, xb - cw // 4
            ja, jb = ya + ch // 4, yb - ch // 4
            if ib <= ia:
                ia, ib = xa, max(xa + 1, xb)
            if jb <= ja:
                ja, jb = ya, max(ya + 1, yb)
            cnt = Counter()
            acc = {}
            opaque = 0
            tot = 0
            for yy in range(ja, jb):
                Y = y0 + yy
                if Y < 0 or Y >= H:
                    continue
                for xx in range(ia, ib):
                    X = x0 + xx
                    if X < 0 or X >= W:
                        continue
                    r, g, b, a = px[X, Y]
                    tot += 1
                    if a >= 128:
                        opaque += 1
                        key = (r >> 3, g >> 3, b >> 3)
                        cnt[key] += 1
                        s = acc.setdefault(key, [0, 0, 0])
                        s[0] += r; s[1] += g; s[2] += b
            if tot and opaque * 2 >= tot and cnt:
                key, n = cnt.most_common(1)[0]
                s = acc[key]
                op[i, j] = (s[0] // n, s[1] // n, s[2] // n, 255)
    return out


def trim(im):
    bb = im.getchannel('A').getbbox()
    return im.crop(bb) if bb else im


# ---------------------------------------------------------------- palette
_snap_cache = {}
_palette = None
EXCLUDE = set()  # palette colours left out of snapping (--exclude), e.g. neutral greys for backdrops


def load_palette():
    global _palette
    if _palette is None:
        im = Image.open(PALETTE_PNG).convert('RGB')
        _palette = list(dict.fromkeys(im.get_flattened_data() if hasattr(im, 'get_flattened_data') else im.getdata()))
        _palette = [c for c in _palette if '%02X%02X%02X' % c not in EXCLUDE]
    return _palette


def snap(c):
    key = (c[0] >> 2, c[1] >> 2, c[2] >> 2)
    v = _snap_cache.get(key)
    if v is None:
        pal = load_palette()
        r, g, b = c[0], c[1], c[2]
        best, bd = None, 1e18
        for p in pal:
            rm = (r + p[0]) / 2
            dr, dg, db = r - p[0], g - p[1], b - p[2]
            d = (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db
            if d < bd:
                bd, best = d, p
        v = best
        _snap_cache[key] = v
    return v


def build_palette(native_dir, out):
    fixed = [hexrgb(h) for h in DESIGN_COLOURS + RESERVED_COLOURS]
    seen = {}
    for dp, _, fs in os.walk(native_dir):
        for f in sorted(fs):
            if not f.endswith('.png'):
                continue
            im = Image.open(os.path.join(dp, f)).convert('RGBA')
            if f.endswith('_partyhat.png'):
                continue  # same sprite as the plain version; partyhat.png itself is kept
            # colour-space coverage: each distinct colour (4-bit buckets, over all sprites) counts
            # once, so neither the big bettahome scene nor many dark outline pixels swamp the
            # sprites' greys, pinks and yellows
            for p in (im.get_flattened_data() if hasattr(im, 'get_flattened_data') else im.getdata()):
                if p[3] >= 128:
                    seen.setdefault((p[0] >> 4, p[1] >> 4, p[2] >> 4), p[:3])
    pix = list(seen.values())
    n_free = 48 - len(fixed)

    def dist(a, b):
        rm = (a[0] + b[0]) / 2
        dr, dg, db = a[0] - b[0], a[1] - b[1], a[2] - b[2]
        return (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db

    # hybrid: 20 colours by median cut over the distinct kept colours (density), then the rest by
    # max-coverage (farthest-point): each new colour is the kept colour farthest from all chosen
    # so far, so the small sprites' light greys, whites, pinks and yellows get a slot too
    n_mc = 16
    src = Image.new('RGB', (len(pix), 1))
    src.putdata(pix)
    q = src.quantize(colors=n_mc, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    qp = q.getpalette()[:n_mc * 3]
    free = [tuple(qp[i:i + 3]) for i in range(0, len(qp), 3)]
    chosen = list(fixed) + free
    near = [min(dist(c, f) for f in chosen) for c in pix]
    for _ in range(n_free - n_mc):
        k = max(range(len(pix)), key=lambda i: near[i])
        c = pix[k]
        free.append(c)
        near = [min(near[i], dist(pix[i], c)) for i in range(len(pix))]
    allc = fixed + [c for c in free if c not in fixed]
    allc = allc[:48]
    allc.sort(key=lambda c: (round(lum(c) / 32), c))
    pal = Image.new('RGB', (len(allc), 1))
    pal.putdata(allc)
    pal.save(out)
    big = pal.resize((len(allc) * 16, 16), Image.NEAREST)
    big.save(out.replace('.png', '_preview.png'))
    print(f'palette: {len(allc)} colours ({len(fixed)} fixed + {len(allc) - len(fixed)} from kept art) -> {out}')


# ---------------------------------------------------------------- outline
def reoutline(im):
    """Snap, strip the dark outer ring, redraw a 1 px #2A1A12 4-neighbour outline (pads 1 px)."""
    w, h = im.size
    src = im.load()
    W, H = w + 2, h + 2
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = src[x, y]
            if a >= 128:
                op[x + 1, y + 1] = snap((r, g, b)) + (255,)
    # strip outer ring pixels that are dark (old outline)
    ring = []
    for y in range(H):
        for x in range(W):
            if op[x, y][3] == 0:
                continue
            edge = any(not (0 <= x + dx < W and 0 <= y + dy < H) or op[x + dx, y + dy][3] == 0
                       for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
            if edge and lum(op[x, y]) < 72:
                ring.append((x, y))
    for x, y in ring:
        op[x, y] = (0, 0, 0, 0)
    add = []
    for y in range(H):
        for x in range(W):
            if op[x, y][3]:
                continue
            if any(0 <= x + dx < W and 0 <= y + dy < H and op[x + dx, y + dy][3] and op[x + dx, y + dy][:3] != OUTLINE
                   for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                add.append((x, y))
    for x, y in add:
        op[x, y] = OUTLINE + (255,)
    return trim(out)


# ---------------------------------------------------------------- majority box reduce
def box_reduce(img, box, cellw, cellh=None, snap_first=True):
    """Majority-colour box filter with (possibly fractional) cell size."""
    cellh = cellh or cellw
    x0, y0, x1, y1 = box
    ow = max(1, int(round((x1 - x0) / cellw)))
    oh = max(1, int(round((y1 - y0) / cellh)))
    sx = (x1 - x0) / ow
    sy = (y1 - y0) / oh
    px = img.load()
    out = Image.new('RGBA', (ow, oh), (0, 0, 0, 0))
    op = out.load()
    for j in range(oh):
        ya, yb = int(y0 + j * sy), int(y0 + (j + 1) * sy)
        for i in range(ow):
            xa, xb = int(x0 + i * sx), int(x0 + (i + 1) * sx)
            cnt = Counter()
            opaque = tot = 0
            for Y in range(ya, max(ya + 1, yb)):
                for X in range(xa, max(xa + 1, xb)):
                    r, g, b, a = px[X, Y]
                    tot += 1
                    if a >= 128:
                        opaque += 1
                        cnt[snap((r, g, b)) if snap_first else (r, g, b)] += 1
            if opaque * 2 >= tot and cnt:
                op[i, j] = cnt.most_common(1)[0][0] + (255,)
    return out


# ---------------------------------------------------------------- modes
def kept_one(path, dst):
    name = os.path.splitext(os.path.basename(path))[0]
    base = name.replace('_partyhat', '')
    im = Image.open(path).convert('RGBA')
    w, h = im.size
    px = im.load()
    for y in range(h):
        for x in range(w):
            if x < 4 or y < 4 or x >= w - 4 or y >= h - 4:
                px[x, y] = (0, 0, 0, 0)
    a = im.getchannel('A').tobytes()
    mask = bytearray(1 if v >= 128 else 0 for v in a)
    comps = components(mask, w, h)
    comps.sort(key=len, reverse=True)
    keep = [comps[0]]
    if '_partyhat' in name or base == 'partyhat':
        keep += [c for c in comps[1:] if len(c) >= 0.02 * len(comps[0])]
    keepset = bytearray(w * h)
    for c in keep:
        for i in c:
            keepset[i] = 1
    for i in range(w * h):
        if not keepset[i] and mask[i]:
            px[i % w, i // w] = (0, 0, 0, 0)
        elif not mask[i]:
            px[i % w, i // w] = (0, 0, 0, 0)
    bb = im.getchannel('A').getbbox()
    pad = 2
    box = (max(0, bb[0] - pad), max(0, bb[1] - pad), min(w, bb[2] + pad), min(h, bb[3] + pad))
    col, rowp = edge_profiles(im, box)
    hint = KEPT_HINT.get(base)
    if hint:
        pmin, pmax = hint * 0.85, hint * 1.15
    else:
        pmin, pmax = 6, 40
    period, score, ox, oy = detect_period(col, rowp, pmin, pmax)
    out = trim(sample_grid(im, box, period, ox, oy, col, rowp))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    out.save(dst)
    return period, score, out.size, hint


def mode_kept(src, dst_root):
    for dp, _, fs in os.walk(src):
        for f in sorted(fs):
            if not f.endswith('.png') or f.startswith('water-tile'):
                continue
            p = os.path.join(dp, f)
            rel = os.path.relpath(p, src)
            dst = os.path.join(dst_root, rel)
            period, score, size, hint = kept_one(p, dst)
            print(f'{rel:62s} cell {period:5.2f} (hint {hint}) score {score:4.2f} -> {size[0]}x{size[1]}')


def cut_items(img, n_expected=None):
    w, h = img.size
    a = img.getchannel('A').tobytes()
    mask = bytearray(1 if v >= 128 else 0 for v in a)
    comps = components(mask, w, h)
    boxes = [[*bbox_of(c, w), len(c)] for c in comps]
    # merge nearby blobs into items (a fin or pebble a few px away belongs to its item)
    gap = max(6, int(min(w, h) * 0.012))
    merged = True
    while merged:
        merged = False
        for i in range(len(boxes)):
            for j in range(i + 1, len(boxes)):
                A, B = boxes[i], boxes[j]
                small = min(A[4], B[4]) < 0.08 * max(A[4], B[4])  # two big items never merge
                if small and A[0] - gap <= B[2] and B[0] - gap <= A[2] and A[1] - gap <= B[3] and B[1] - gap <= A[3]:
                    boxes[i] = [min(A[0], B[0]), min(A[1], B[1]), max(A[2], B[2]), max(A[3], B[3]), A[4] + B[4]]
                    boxes.pop(j)
                    merged = True
                    break
            if merged:
                break
    big = max(b[4] for b in boxes)
    boxes = [b for b in boxes if b[4] >= 0.01 * big]
    # reading order: rows by vertical overlap, then left to right
    boxes.sort(key=lambda b: (b[1] + b[3]) / 2)
    rows = []
    for b in boxes:
        cy = (b[1] + b[3]) / 2
        for r in rows:
            if r['y0'] <= cy <= r['y1']:
                r['items'].append(b)
                r['y0'] = min(r['y0'], b[1]); r['y1'] = max(r['y1'], b[3])
                break
        else:
            rows.append({'y0': b[1], 'y1': b[3], 'items': [b]})
    rows.sort(key=lambda r: r['y0'])
    order = []
    for r in rows:
        order += sorted(r['items'], key=lambda b: b[0])
    return order


def isolate(img, box):
    """Crop box (with 2 px pad) keeping only alpha>=128 pixels."""
    w, h = img.size
    b = (max(0, box[0] - 2), max(0, box[1] - 2), min(w, box[2] + 2), min(h, box[3] + 2))
    sub = img.crop(b)
    sp = sub.load()
    for y in range(sub.height):
        for x in range(sub.width):
            if sp[x, y][3] < 128:
                sp[x, y] = (0, 0, 0, 0)
            else:
                r, g, bb, _ = sp[x, y]
                sp[x, y] = (r, g, bb, 255)
    return sub


def extract_item(sub, target, dim='w', force_box=False, cell_override=None):
    w, h = sub.size
    bb = sub.getchannel('A').getbbox()
    bw, bh = bb[2] - bb[0], bb[3] - bb[1]
    blob = bw if dim == 'w' else bh if dim == 'h' else max(bw, bh)
    how = ''
    out = None
    if not force_box:
        col, rowp = edge_profiles(sub, (0, 0, w, h))
        pmin = max(2.5, blob / (target * 1.6))
        pmax = blob / (target * 0.6)
        period, score, ox, oy = detect_period(col, rowp, pmin, pmax)
        gw = blob / period
        if score > 1.4 and abs(gw - target) <= 0.2 * target:
            s = trim(sample_grid(sub, (0, 0, w, h), period, ox, oy, col, rowp))
            out = reoutline(s)
            how = f'grid {period:.2f}px (score {score:.2f})'
            g = out.size[0] if dim == 'w' else out.size[1] if dim == 'h' else max(out.size)
            if abs(g - target) > 0.2 * target:
                how += f' gave {g}, outside +-20%; '
                out = None
        else:
            how = f'grid {period:.2f}px rejected (score {score:.2f}, {gw:.0f} vs {target}); '
    if out is None:
        cell = cell_override or max(1, round(blob / target))
        s = trim(box_reduce(sub, bb, cell))
        out = reoutline(s)
        how += f'box {cell}px'
    got = out.size[0] if dim == 'w' else out.size[1] if dim == 'h' else max(out.size)
    ok = abs(got - target) <= 0.2 * target
    return out, how, got, ok


def mode_sheet(sheet, targets_path, only=None, force_box=False):
    targets = json.load(open(targets_path))
    img = Image.open(sheet).convert('RGBA')
    items = cut_items(img)
    print(f'{sheet}: {len(items)} items found, {len(targets)} expected')
    if len(items) != len(targets):
        for b in items:
            print('  blob', b)
        if not only:
            sys.exit(2)
    report = []
    for idx, t in enumerate(targets):
        if only and t['name'] not in only:
            continue
        if idx >= len(items):
            break
        b = items[idx]
        if t.get('skip'):
            print(f"  (skipped extra blob {idx}: {t.get('name')})")
            continue
        sub = isolate(img, b)
        out, how, got, ok = extract_item(sub, t['target'], t.get('dim', 'w'), force_box or t.get('box', False) or bool(t.get('cell')), t.get('cell'))
        dst = os.path.join(ROOT, t['out'])
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        out.save(dst)
        line = f"  {t['name']:22s} target {t['target']:3d}{t.get('dim','w')} -> {out.size[0]}x{out.size[1]} {'OK' if ok else 'OUT OF TOLERANCE'} ({how})"
        print(line)
        report.append((t['name'], ok, out.size))
    return report


def mode_backdrop(src, out_path, size=(432, 200)):
    TW, TH = size
    img = Image.open(src).convert('RGBA')
    w, h = img.size
    # grid detect on a central band (fast enough, representative)
    band = (w // 4, h // 4, 3 * w // 4, 3 * h // 4)
    col, rowp = edge_profiles(img, band)
    period, score, ox, oy = detect_period(col, rowp, 2.5, 16)
    gw = w / period
    if score > 1.6 and abs(gw - TW) <= 0.05 * TW:
        col, rowp = edge_profiles(img, (0, 0, w, h))
        s = sample_grid(img, (0, 0, w, h), period, ox, oy, col, rowp)
        tw, th = TW, TH
        how = f'grid {period:.2f}'
    elif score > 1.6 and abs(gw - TW / 2) <= 0.05 * TW / 2:
        col, rowp = edge_profiles(img, (0, 0, w, h))
        s = sample_grid(img, (0, 0, w, h), period, ox, oy, col, rowp)
        tw, th = TW // 2, TH // 2
        how = f'grid {period:.2f} (half res)'
    else:
        cell = w / TW
        s = box_reduce(img, (0, 0, w, h), cell)
        tw, th = TW, TH
        how = f'grid {period:.2f}px -> {gw:.0f} wide (score {score:.2f}) rejected; box {cell:.2f}px'
    sw, sh = s.size
    l, t = (sw - tw) // 2, (sh - th) // 2
    s = s.crop((l, t, l + tw, t + th))
    sp = s.load()
    for y in range(th):
        for x in range(tw):
            r, g, b, a = sp[x, y]
            sp[x, y] = snap((r, g, b)) + (255,)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    s.convert('RGB').save(out_path)
    print(f'{src} -> {out_path} {tw}x{th} ({how})')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--kept', action='store_true')
    ap.add_argument('--palette', action='store_true')
    ap.add_argument('--src', default=os.path.join(ROOT, 'source-art'))
    ap.add_argument('--dst', default=os.path.join(ROOT, 'game/assets/native/original'))
    ap.add_argument('--sheet')
    ap.add_argument('--targets')
    ap.add_argument('--only', nargs='*')
    ap.add_argument('--force-box', action='store_true')
    ap.add_argument('--backdrop')
    ap.add_argument('--out')
    ap.add_argument('--size', default='432x200', help='backdrops: native WxH (interior rooms: 384x256)')
    ap.add_argument('--exclude', nargs='*', default=[],
                    help='palette hex colours not to snap to (backdrops: the neutral greys A19D9D C8C8C8 565C56 2A2A2C)')
    a = ap.parse_args()
    EXCLUDE.update(h.upper().lstrip('#') for h in a.exclude)
    if a.kept:
        mode_kept(a.src, a.dst)
    elif a.palette:
        build_palette(a.dst, a.out or PALETTE_PNG)
    elif a.sheet:
        mode_sheet(a.sheet, a.targets, a.only, a.force_box)
    elif a.backdrop:
        mode_backdrop(a.backdrop, a.out, tuple(int(v) for v in a.size.split('x')))
    else:
        ap.print_help()


if __name__ == '__main__':
    main()
