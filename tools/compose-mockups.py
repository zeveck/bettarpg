#!/usr/bin/env python3
"""compose-mockups.py - the design's mock screens, composed with Pillow from the native assets.

All screens are built at the phone's 844x390 logical size, then upscaled x2 (nearest) to
design/mockups/screen-*.png. Also writes display versions of every accepted mock picture
(sheets: extracted items on a neutral background at x4; backdrops at x2).

Text uses DejaVu Sans Bold with anti-aliasing off (a stand-in for the bundled pixel font).
"""
import math, os, random
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAT = os.path.join(ROOT, 'game/assets/native')
OUT = os.path.join(ROOT, 'design/mockups')
W, H = 844, 390
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

C = {k: tuple(int(v[i:i + 2], 16) for i in (1, 3, 5)) for k, v in dict(
    shallow='#3290D1', mid='#2B7FC4', deep='#1B4F8A', murk='#0E2A47', edge='#081A2E',
    reed='#5B8C3A', mud='#6B4E2E', mudlight='#8C6A3E', outline='#2A1A12', sand='#E8C552',
    red='#E5401F', pink='#FF4FA3', gold='#F7C948', teal='#2E6F80', rim='#9FD8E0',
    white='#F4F1E6', panel='#1A2C44', panel2='#24405F', hp='#4FC25A', mp='#3FA3F0', dim='#5A6475',
    blue='#3A7BEA').items()}


def font(size):
    return ImageFont.truetype(FONT, size)


def load(rel):
    return Image.open(os.path.join(NAT, rel)).convert('RGBA')


def up(im, k):
    return im.resize((im.width * k, im.height * k), Image.NEAREST)


def flip(im):
    return im.transpose(Image.FLIP_LEFT_RIGHT)


def text(d, xy, s, size, fill=C['white'], stroke=C['outline'], anchor='la', sw=1):
    d.fontmode = '1'
    d.text(xy, s, font=font(size), fill=fill, stroke_width=sw, stroke_fill=stroke, anchor=anchor)


def panel(d, box, fill=C['panel'], border=C['rim'], r=6):
    d.rounded_rectangle(box, r, fill=C['outline'])
    x0, y0, x1, y1 = box
    d.rounded_rectangle((x0 + 2, y0 + 2, x1 - 2, y1 - 2), r - 1, fill=fill, outline=border, width=1)


def bar(d, x, y, w, h, frac, col, label=None):
    d.rectangle((x, y, x + w, y + h), fill=C['outline'])
    d.rectangle((x + 1, y + 1, x + w - 1, y + h - 1), fill=(30, 36, 48))
    fw = int((w - 2) * frac)
    if fw > 0:
        d.rectangle((x + 1, y + 1, x + fw, y + h - 1), fill=col)
        d.line((x + 1, y + 1, x + fw, y + 1), fill=tuple(min(255, c + 60) for c in col))
    if label:
        text(d, (x + w + 4, y + h // 2), label, 9, anchor='lm')


def rim(im):
    """1 art-px #9FD8E0 rim on the top and left edges of a sprite (the Murk/Gar's pool rule)."""
    im = im.copy()
    px = im.load()
    w, h = im.size
    pts = []
    for y in range(h):
        for x in range(w):
            if px[x, y][3] < 128:
                continue
            if (y == 0 or px[x, y - 1][3] < 128) or (x == 0 or px[x - 1, y][3] < 128):
                pts.append((x, y))
    for x, y in pts:
        if px[x, y][:3] == C['outline'] or sum(px[x, y][:3]) < 150:
            # recolour the outer outline pixel itself so the silhouette lifts off the dark water
            px[x, y] = C['rim'] + (255,)
    return im


def metal_tint(im, col, amount=0.30):
    """Full-metal stage: 30% tint of the player's colour on its mid-tones, plus a 5x4 crest plume."""
    im = im.copy()
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 128:
                continue
            l = 0.299 * r + 0.587 * g + 0.114 * b
            if 45 <= l <= 200:
                px[x, y] = (int(r + (col[0] - r) * amount), int(g + (col[1] - g) * amount),
                            int(b + (col[2] - b) * amount), a)
    # crest plume: above the topmost opaque pixel of the head half
    top = None
    for y in range(h):
        for x in range(w // 3, w):
            if px[x, y][3] >= 128:
                top = (x, y)
                break
        if top:
            break
    pad = 4
    out = Image.new('RGBA', (w, h + pad), (0, 0, 0, 0))
    out.alpha_composite(im, (0, pad))
    op = out.load()
    shape = ['.XXX.', 'XXXXX', '.XXX.', '..X..']
    dark = tuple(int(c * 0.6) for c in col)
    hi = tuple(min(255, int(c * 1.3) + 30) for c in col)
    x0, y0 = top[0] - 2, top[1] + pad - 4
    for j, row in enumerate(shape):
        for i, ch in enumerate(row):
            if ch == 'X':
                c = hi if (j == 0 or (j == 1 and i < 2)) else col if j < 3 else dark
                op[x0 + i, y0 + j] = c + (255,)
    # outline the plume
    pts = []
    for j in range(-1, 5):
        for i in range(-1, 6):
            X, Y = x0 + i, y0 + j
            if 0 <= X < w and 0 <= Y < h + pad and op[X, Y][3] == 0:
                if any(0 <= X + dx < w and 0 <= Y + dy < h + pad and op[X + dx, Y + dy][:3] in (col, hi, dark)
                       for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    pts.append((X, Y))
    for p in pts:
        op[p] = C['outline'] + (255,)
    return out


# ---------------------------------------------------------------- code-drawn world pieces
def code_water(img, seed=3):
    d = ImageDraw.Draw(img)
    w, h = img.size
    # depth zones: shallow near the top, mid, deeper toward the bottom edge
    d.rectangle((0, 0, w, h), fill=C['mid'])
    d.rectangle((0, 0, w, 70), fill=C['shallow'])
    for x in range(0, w, 1):
        yy = int(h - 70 + 14 * math.sin(x / 57.0))
        d.line((x, yy, x, h), fill=C['deep'])
    # slow diagonal light shafts (lighter flat bands)
    shaft = Image.new('RGBA', img.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shaft)
    for sx, sw in ((120, 34), (300, 22), (520, 40), (700, 26)):
        sd.polygon([(sx, 0), (sx + sw, 0), (sx + sw - 160, h), (sx - 160, h)], fill=C['rim'] + (34,))
    img.alpha_composite(shaft)
    # sparse 1 px shimmer highlights
    rnd = random.Random(seed)
    px = img.load()
    for _ in range(420):
        x, y = rnd.randrange(w), rnd.randrange(h)
        px[x, y] = (C['rim'] if y < 150 else C['shallow']) + (255,)
        if rnd.random() < 0.5 and x + 1 < w:
            px[x + 1, y] = px[x, y]


def bank(img, polys, seed=5):
    """Mud fill, 1 px dark outline outside, 1 px light step on top-left inner edges."""
    w, h = img.size
    m = Image.new('L', img.size, 0)
    md = ImageDraw.Draw(m)
    for p in polys:
        md.polygon(p, fill=255)
    mp = m.load()
    px = img.load()
    rnd = random.Random(seed)
    for y in range(h):
        for x in range(w):
            inside = mp[x, y]
            if inside:
                top_left_edge = (y == 0 or not mp[x, y - 1]) or (x == 0 or not mp[x - 1, y])
                if top_left_edge and y > 0 and x > 0:
                    px[x, y] = C['mudlight'] + (255,)
                else:
                    px[x, y] = (C['mud'] if rnd.random() > 0.015 else C['outline']) + (255,)
            else:
                if any(0 <= x + dx < w and 0 <= y + dy < h and mp[x + dx, y + dy]
                       for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    px[x, y] = C['outline'] + (255,)
    return m


def sand_paths(img, paths):
    """paths: list of (points, width). Outlines for all first, then sand, so joins stay clean."""
    d = ImageDraw.Draw(img)
    for pass_ in (0, 1):
        for pts, width in paths:
            wv = width + 2 if pass_ == 0 else width
            col = C['outline'] if pass_ == 0 else C['sand']
            for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
                d.line((x0, y0, x1, y1), fill=col, width=wv)
            for (x0, y0) in pts:
                d.ellipse((x0 - wv // 2, y0 - wv // 2, x0 + wv // 2, y0 + wv // 2), fill=col)


def put(img, spr, x, y, k=1, face_left=False):
    """Paste a sprite with its bottom-centre at (x, y)."""
    s = up(flip(spr) if face_left else spr, k)
    img.alpha_composite(s, (int(x - s.width / 2), int(y - s.height)))
    return s


def portrait(spr, k=2, size=48, face='right'):
    """Head crop: the right ~55% of a side-view fish, drawn x2 in a 48x48 frame."""
    bb = spr.getchannel('A').getbbox()
    w = bb[2] - bb[0]
    cw = size // k
    x1 = bb[2] + 1
    x0 = x1 - cw
    cy = bb[1] + (bb[3] - bb[1]) // 2 - 2
    crop = spr.crop((x0, cy - cw // 2, x1, cy + cw // 2))
    fr = Image.new('RGBA', (size + 6, size + 6), (0, 0, 0, 0))
    d = ImageDraw.Draw(fr)
    d.rounded_rectangle((0, 0, size + 5, size + 5), 5, fill=C['outline'])
    d.rounded_rectangle((2, 2, size + 3, size + 3), 4, fill=C['teal'], outline=C['rim'])
    fr.alpha_composite(up(crop, k), (3, 3))
    return fr


def hud(img, spr, name, lv, hp, mp, bites=None):
    d = ImageDraw.Draw(img)
    panel(d, (6, 6, 236, 66))
    img.alpha_composite(portrait(spr), (10, 9))
    text(d, (68, 12), name, 12)
    text(d, (230, 12), f'Lv {lv}', 11, fill=C['gold'], anchor='ra')
    bar(d, 68, 30, 120, 9, hp[0] / hp[1], C['hp'], f'{hp[0]}/{hp[1]}')
    bar(d, 68, 44, 120, 9, mp[0] / mp[1], C['mp'], f'{mp[0]}/{mp[1]}')
    if bites is not None:
        icon = up(load('icons/betta_bite.png'), 1)
        panel(d, (6, 70, 92, 92), r=5)
        img.alpha_composite(up(load('icons/betta_bite.png'), 1), (14, 76))
        text(d, (30, 81), f'{bites} BB', 10, anchor='lm')


def enemy_hud(img, name, lv, hp):
    d = ImageDraw.Draw(img)
    panel(d, (W - 210, 6, W - 6, 46))
    text(d, (W - 200, 11), name, 12)
    text(d, (W - 14, 11), f'Lv {lv}', 11, fill=C['gold'], anchor='ra')
    bar(d, W - 200, 29, 184, 9, hp, (226, 76, 60))


def menu_row(img, labels, dim=(), dive='Dive'):
    d = ImageDraw.Draw(img)
    m = 6
    bw = (W - 2 * m - 4 * 6) / 5
    y0 = H - 64 - 6
    for i, lab in enumerate(labels):
        x0 = m + i * (bw + 6)
        off = lab in dim
        panel(d, (int(x0), y0, int(x0 + bw), H - 6), fill=(C['panel'] if not off else (34, 40, 52)),
              border=(C['rim'] if not off else C['dim']), r=8)
        text(d, (int(x0 + bw / 2), y0 + 23), lab, 15, fill=(C['white'] if not off else C['dim']), anchor='mm')
        text(d, (int(x0 + bw / 2), y0 + 46), str(i + 1), 9, fill=(C['rim'] if not off else C['dim']), anchor='mm', sw=0)
    if dive:
        cx, cy, r = W - 6 - 32, y0 - 8 - 32, 32
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=C['outline'])
        d.ellipse((cx - r + 2, cy - r + 2, cx + r - 2, cy + r - 2), fill=C['teal'], outline=C['rim'])
        # little down/up arrow
        a = 1 if dive == 'Dive' else -1
        d.polygon([(cx - 7, cy - 10 * a), (cx + 7, cy - 10 * a), (cx, cy - 1 * a)], fill=C['rim'])
        text(d, (cx, cy + 12), dive, 11 if len(dive) < 6 else 9, anchor='mm')
    return y0


def log_line(img, s, y):
    d = ImageDraw.Draw(img)
    panel(d, (6, y - 26, W - 80, y - 4), fill=(16, 28, 44), r=5)
    text(d, (16, y - 15), s, 11, anchor='lm')


def float_num(img, s, x, y, col=C['white']):
    d = ImageDraw.Draw(img)
    text(d, (x, y), s, 18, fill=col, anchor='mm', sw=2)


def finish(img, name):
    os.makedirs(OUT, exist_ok=True)
    up(img.convert('RGB'), 2).save(os.path.join(OUT, name))
    print('wrote', os.path.join(OUT, name))


def backdrop_x2(rel):
    bd = up(Image.open(os.path.join(NAT, rel)).convert('RGBA'), 2)  # 864x400
    return bd.crop(((bd.width - W) // 2, (bd.height - H) // 2, (bd.width - W) // 2 + W, (bd.height - H) // 2 + H))


# ---------------------------------------------------------------- screens
def screen_village():
    img = Image.new('RGBA', (W, H))
    code_water(img)
    # mud banks: the terrace edge along the top, a bank in the bottom-left, an island bottom-right
    bank(img, [
        [(0, 0), (W, 0), (W, 34), (760, 40), (700, 30), (600, 38), (470, 30), (330, 40), (200, 32), (90, 42), (0, 36)],
        [(0, 300), (40, 290), (90, 300), (130, 322), (160, 352), (180, H), (0, H)],
        [(640, H), (668, 358), (720, 344), (800, 350), (W, 330), (W, H)],
    ])
    sand_paths(img, [([(-10, 252), (120, 246), (250, 236), (400, 240), (540, 232), (660, 226), (860, 230)], 26),
                     ([(250, 236), (262, 196)], 18), ([(400, 240), (402, 196)], 18), ([(640, 228), (644, 196)], 18),
                     ([(330, 244), (332, 300)], 16)])
    # buildings (x1), bases on the path's north side
    put(img, load('buildings/elder_dwelling.png'), 160, 200)
    put(img, load('buildings/fish_mart.png'), 400, 200)
    put(img, load('buildings/swishy_solace_inn.png'), 640, 200)
    put(img, load('buildings/bubble_home.png'), 332, 392)
    put(img, load('buildings/guard_post.png'), 800, 300)
    put(img, load('buildings/south_gate.png'), 520, 392)
    # rice tufts along the banks and in shallow water
    tuft = load('original/map/rice_paddy_tuft.png')
    for x, y in ((40, 48), (230, 46), (560, 46), (740, 52), (22, 298), (120, 320), (700, 352), (800, 342), (60, 160), (200, 300)):
        put(img, tuft, x, y)
    for name, x, y, fl in (('props/lily_pad.png', 440, 300, False), ('props/stones.png', 580, 300, False),
                           ('props/reed_clump.png', 25, 200, False)):
        put(img, load(name), x, y, face_left=fl)
    # villagers
    put(img, load('villagers/elder_finn.png'), 230, 226, face_left=True)
    put(img, load('villagers/coral.png'), 430, 226)
    put(img, load('villagers/seaweed.png'), 690, 222, face_left=True)
    put(img, load('villagers/reef.png'), 720, 322, face_left=True)
    # the player and Bubble on the path
    betta = load('original/main_fish/player_betta.png')
    put(img, betta, 352, 262)
    put(img, load('villagers/bubble.png'), 296, 266)
    d = ImageDraw.Draw(img)
    # "!" over Elder Finn (talk hint)
    panel(d, (220, 168, 240, 188), fill=C['gold'], border=C['white'], r=4)
    text(d, (230, 178), '!', 13, fill=C['outline'], stroke=C['gold'], anchor='mm', sw=0)
    # bubbles trailing the player
    for i, (bx, by) in enumerate(((318, 238), (310, 230), (314, 222))):
        d.ellipse((bx, by, bx + 3 + i % 2, by + 3 + i % 2), outline=C['rim'])
    hud(img, betta, 'Bettany', 2, (21, 24), (8, 10), bites=12)
    # top right buttons
    for i, s in enumerate(('home', 'II', 'mute')):
        x0 = W - 6 - (i + 1) * 46 + 6
        panel(d, (x0, 6, x0 + 40, 40), r=6)
        text(d, (x0 + 20, 23), s if s != 'mute' else '♪', 10 if s == 'home' else 13, anchor='mm')
    # area banner with the bettahome two-dome crop x1
    home = load('original/map/bettahome.png').crop((8, 0, 96, 52))
    panel(d, (W // 2 - 110, 6, W // 2 + 110, 64), r=8)
    img.alpha_composite(home.resize((66, 39), Image.NEAREST).crop((0, 0, 66, 39)), (W // 2 - 104, 16))
    text(d, (W // 2 + 30, 35), 'Paddy Village', 15, fill=C['gold'], anchor='mm')
    finish(img, 'screen-village.png')


def screen_battle():
    img = backdrop_x2('backdrops/shallows.png')
    tuft = load('original/map/rice_paddy_tuft.png')
    put(img, tuft, 30, 330, 2)
    put(img, tuft, W - 40, 330, 2)
    betta = load('original/main_fish/player_betta.png')
    # fighters x2, vertically centred between HUD (~70) and menu (~250)
    put(img, betta, 220, 228, 2)
    put(img, load('villagers/bubble.png'), 110, 210, 2)
    put(img, load('original/enemies/aggressive_guppy.png'), 640, 220, 2, face_left=True)
    float_num(img, '-6', 646, 128, C['gold'])
    hud(img, betta, 'Bettany', 2, (21, 24), (5, 10))
    enemy_hud(img, 'Aggressive Guppy', 1, 0.45)
    y0 = menu_row(img, ['Attack', 'Spells', 'Party! ?', 'Items', 'Swim Away'], dim=('Party! ?',), dive='Dive')
    log_line(img, 'Bettany bites the Aggressive Guppy for 6!', y0 - 4)
    finish(img, 'screen-battle.png')


def screen_title():
    img = backdrop_x2('backdrops/title.png')
    d = ImageDraw.Draw(img)
    # the village picture in the open patch (mid right): two-dome crop x2 in an oval mask
    home = up(load('original/map/bettahome.png').crop((8, 0, 96, 52)), 2)  # 176x104
    cx, cy = 560, 200
    ow, oh = 196, 124
    pic = Image.new('RGBA', (ow, oh), C['teal'] + (255,))
    pic.alpha_composite(home, ((ow - home.width) // 2, oh - home.height - 4))
    mask = Image.new('L', (ow, oh), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, ow - 1, oh - 1), fill=255)
    d.ellipse((cx - ow // 2 - 4, cy - oh // 2 - 4, cx + ow // 2 + 3, cy + oh // 2 + 3), fill=C['outline'])
    d.ellipse((cx - ow // 2 - 2, cy - oh // 2 - 2, cx + ow // 2 + 1, cy + oh // 2 + 1), fill=C['rim'])
    img.paste(pic, (cx - ow // 2, cy - oh // 2), mask)
    # code-drawn ring of bubbles and reeds
    rnd = random.Random(7)
    for i in range(26):
        a = i / 26 * 2 * math.pi
        bx = cx + (ow / 2 + 12) * math.cos(a)
        by = cy + (oh / 2 + 10) * math.sin(a)
        if math.sin(a) > 0.55:
            # reeds on the lower rim
            hgt = rnd.randint(14, 26)
            d.line((bx, by + 6, bx + rnd.randint(-4, 4), by + 6 - hgt), fill=C['outline'], width=4)
            d.line((bx, by + 6, bx + rnd.randint(-3, 3), by + 6 - hgt + 2), fill=C['reed'], width=2)
        else:
            r = rnd.choice((2, 3, 4))
            d.ellipse((bx - r, by - r, bx + r, by + r), fill=C['rim'] + (255,), outline=C['outline'])
            d.point((bx - r + 1, by - r + 1), fill=C['white'])
    # the betta x2 swimming in front
    put(img, load('original/main_fish/player_betta.png'), 300, 300, 2)
    for i, (bx, by) in enumerate(((236, 226), (226, 210), (232, 194))):
        d.ellipse((bx, by, bx + 5 + i, by + 5 + i), outline=C['rim'], width=1)
    # title text
    text(d, (40, 30), 'Betta RPG', 46, fill=C['gold'], stroke=C['outline'], sw=4)
    text(d, (44, 84), 'an underwater adventure in the rice paddies', 12, fill=C['white'], sw=1)
    # menu
    for i, s in enumerate(('Continue', 'New Game', 'Settings')):
        y = 120 + i * 44
        panel(d, (40, y, 210, y + 36), fill=(C['panel'] if i else C['panel2']), r=8)
        text(d, (125, y + 18), s, 15, anchor='mm', fill=(C['gold'] if i == 0 else C['white']))
    panel(d, (W - 46, 6, W - 6, 40), r=6)
    text(d, (W - 26, 23), '♪', 13, anchor='mm')
    finish(img, 'screen-title.png')


def screen_gar(sub=False):
    img = backdrop_x2('backdrops/gar_pool.png')
    if sub:
        me = rim(load('original/artifacts/dunkleosteus_sub.png'))
    else:
        me = rim(metal_tint(load('original/main_fish/player_betta_full_metal.png'), C['blue']))
    bubble = rim(load('villagers/bubble.png'))
    gar = rim(load('boss/gargantuan_gar.png'))
    # fighters sit in the teal light band, below the backdrop's waterline (~y 175)
    put(img, bubble, 96, 252, 2)
    put(img, me, 222, 270, 2)
    put(img, gar, 630, 262, 2, face_left=True)
    d = ImageDraw.Draw(img)
    portrait_src = load('original/main_fish/player_betta_full_metal.png') if not sub else load('original/artifacts/dunkleosteus_sub.png')
    hud(img, metal_tint(portrait_src, C['blue']) if not sub else portrait_src, 'Bettany', 8, (61, 78), (14, 30))
    enemy_hud(img, 'Gargantuan Gar', 10, 0.72)
    # friends counter (6) and the party meter (2 of 4 balloons)
    hat = load('original/artifacts/partyhat.png')
    panel(d, (W - 210, 50, W - 120, 86), r=6)
    img.alpha_composite(hat.resize((11, 18), Image.NEAREST), (W - 200, 59))
    text(d, (W - 182, 68), 'x 6', 13, anchor='lm')
    panel(d, (W - 116, 50, W - 6, 86), r=6)
    for i in range(4):
        bx = W - 104 + i * 25
        full = i < 2
        col = C['pink'] if full else (60, 66, 80)
        d.ellipse((bx, 56, bx + 16, 76), fill=C['outline'])
        d.ellipse((bx + 1, 57, bx + 15, 75), fill=col, outline=(C['white'] if full else C['dim']))
        if full:
            d.point((bx + 5, 61), fill=C['white'])
        d.line((bx + 8, 76, bx + 8, 82), fill=(C['white'] if full else C['dim']))
    text(d, (W - 60, 92), 'party 2/4', 9, anchor='ma', sw=1)
    y0 = menu_row(img, ['Attack', 'Spells', 'Party!', 'Items', 'Swim Away'], dive=('Surface' if sub else 'Dive'))
    log_line(img, 'Bubble blows a balloon! The Gar\'s eyes soften...' if not sub else
             'The sub\'s jaws clang on the Gar\'s armor for 9!', y0 - 4)
    finish(img, 'screen-gar-sub.png' if sub else 'screen-gar.png')


# ---------------------------------------------------------------- display versions
def display_items(name, files, k=4, cols=None):
    ims = [load(f) for f in files]
    pad = 10
    cols = cols or len(ims)
    rows = (len(ims) + cols - 1) // cols
    cw = max(i.width for i in ims) * k + pad * 2
    ch = max(i.height for i in ims) * k + pad * 2
    sheet = Image.new('RGB', (cols * cw, rows * ch), (118, 124, 132))
    for n, im in enumerate(ims):
        x, y = (n % cols) * cw, (n // cols) * ch
        s = up(im, k)
        sheet.paste(s, (x + (cw - s.width) // 2, y + ch - pad - s.height), s)
    sheet.save(os.path.join(OUT, name))
    print('wrote', os.path.join(OUT, name))


def displays():
    for src, dst in (('backdrops/title.png', 'mk1-title-backdrop.png'), ('backdrops/shallows.png', 'mk2-shallows-backdrop.png'),
                     ('backdrops/murk.png', 'mk3-murk-backdrop.png'), ('backdrops/gar_pool.png', 'mk4-gar-pool-backdrop.png')):
        up(load(src), 2).convert('RGB').save(os.path.join(OUT, dst))
    display_items('mk5a-village-buildings-a.png', ['buildings/elder_dwelling.png', 'buildings/fish_mart.png', 'buildings/swishy_solace_inn.png'])
    display_items('mk5b-village-buildings-b.png', ['buildings/guard_post.png', 'buildings/bubble_home.png', 'buildings/south_gate.png'])
    display_items('mk6-villagers.png', ['original/main_fish/player_betta.png', 'villagers/elder_finn.png', 'villagers/coral.png',
                                        'villagers/reef.png', 'villagers/bubble.png', 'villagers/seaweed.png'])
    display_items('mk7-enemies.png', ['original/main_fish/player_betta.png', 'enemies/dragonfly_nymph.png', 'enemies/snapping_crayfish.png'])
    display_items('mk8-gargantuan-gar.png', ['original/main_fish/player_betta.png', 'boss/gargantuan_gar.png'])
    display_items('mk9a-highwater-buildings.png', ['buildings/highwater_inn.png', 'buildings/pip_stall.png', 'buildings/lock_house.png'])
    display_items('mk9b-drain-gate-and-folk.png', ['buildings/drain_gate.png', 'villagers/whorl.png', 'villagers/pip.png'])
    display_items('mk10a-props.png', ['props/reed_clump.png', 'props/lily_pad.png', 'props/stones.png', 'props/broken_stem.png',
                                      'props/straw_bundle.png', 'props/culvert_mouth.png', 'props/spillway_lip.png',
                                      'props/old_stump.png', 'props/reed_cage_closed.png', 'props/reed_cage_open.png'], cols=5)
    display_items('mk10b-icons.png', ['icons/betta_bite.png', 'icons/strange_scale.png', 'icons/brass_cog.png', 'icons/moss_lantern.png',
                                      'icons/kelp_snack.png', 'icons/bubble_water.png', 'icons/seed_cake.png', 'icons/fizzy_water.png'], k=6, cols=4)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    screen_village()
    screen_battle()
    screen_title()
    screen_gar(False)
    screen_gar(True)
    displays()
