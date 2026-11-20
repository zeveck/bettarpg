#!/usr/bin/env python3
"""App icons from the kept betta (native pixels, whole multiples) on a sun-gold
disc, with a maskable margin. Writes game/favicon.png, apple-touch-icon.png,
icon-192.png, icon-512.png, icon-maskable-512.png."""
from PIL import Image, ImageDraw
import os
here = os.path.dirname(os.path.abspath(__file__))
game = os.path.join(here, '..', 'game')
b = Image.open(os.path.join(game, 'assets/native/original/main_fish/player_betta.png')).convert('RGBA')
bbox = b.getbbox()
# the whole kept betta (its head alone cuts the fins off hard)
head = b.crop(bbox)
def icon(size, margin, disc=True):
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if disc:
        m = int(size * margin)
        d.ellipse((m, m, size - m - 1, size - m - 1), fill=(0x2A, 0x1A, 0x12, 255))
        k = max(2, size // 64)
        d.ellipse((m + k, m + k, size - m - 1 - k, size - m - 1 - k), fill=(0xF7, 0xC9, 0x48, 255))
    else:
        d.rectangle((0, 0, size, size), fill=(0xF7, 0xC9, 0x48, 255))
    inner = size * (1 - 2 * margin) * 0.78
    scale = max(1, int(inner // head.width))
    h = head.resize((head.width * scale, head.height * scale), Image.NEAREST)
    im.alpha_composite(h, ((size - h.width) // 2, (size - h.height) // 2))
    return im
icon(512, 0.02).save(os.path.join(game, 'icon-512.png'))
icon(512, 0.02).resize((192, 192), Image.NEAREST).save(os.path.join(game, 'icon-192.png'))
icon(512, 0.12, disc=False).save(os.path.join(game, 'icon-maskable-512.png'))
icon(180, 0.0, disc=False).save(os.path.join(game, 'apple-touch-icon.png'))
icon(64, 0.0).save(os.path.join(game, 'favicon.png'))
print('icons written')
