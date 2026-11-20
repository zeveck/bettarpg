// sprites.js: everything made from the native pictures in code: the betta's
// color through every armor stage, hats on new creatures, recolored
// villagers, rim light, hit flash, glows, portraits, and the fish drawing
// (tail sway and tilt by skewing columns, so pixels stay whole).
import { img, hasReal } from './assets.js';

const cache = new Map();
const memo = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };
export const clearSpriteCache = () => cache.clear();

const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const data = (c) => c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height);
const put = (c, d) => c.getContext('2d', { willReadFrequently: true }).putImageData(d, 0, 0);
const copy = (c) => { const n = mk(c.width, c.height); n.getContext('2d', { willReadFrequently: true }).drawImage(c, 0, 0); return n; };
// A variant: a canvas plus where the base sprite's top-left sits inside it.
const V = (canvas, ox = 0, oy = 0, bw, bh) => ({ canvas, ox, oy, bw: bw ?? canvas.width - ox, bh: bh ?? canvas.height - oy });

function rgb2hsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, mx ? d / mx : 0, mx];
}
function hsv2rgb(h, s, v) {
  h = ((h % 360) + 360) % 360;
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0]; else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c]; else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}
export const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

export const PLAYER_COLORS = {
  red: { hue: null, swatch: '#E5401F' },
  blue: { hue: 212, sat: 1.0, val: 1.0, swatch: '#2F6FD8' },
  purple: { hue: 282, sat: 0.95, val: 1.0, swatch: '#8A3FD0' },
  green: { hue: 118, sat: 0.9, val: 0.85, swatch: '#3AA040' },
  orange: { hue: 30, sat: 1.0, val: 1.08, swatch: '#F08A20' },
};

// Where does `small` sit inside `big`? (hat versions are the plain sprite
// plus a hat). Returns {dx, dy}.
function align(small, big) {
  const a = data(small), b = data(big);
  let best = { dx: 0, dy: big.height - small.height, score: -1 };
  for (let dy = 0; dy <= big.height - small.height; dy++) {
    for (let dx = -2; dx <= big.width - small.width + 2; dx++) {
      let score = 0;
      for (let y = 0; y < small.height; y += 1) {
        for (let x = 0; x < small.width; x += 1) {
          const i = (y * small.width + x) * 4;
          if (a.data[i + 3] < 128) continue;
          const bx = x + dx, by = y + dy;
          if (bx < 0 || bx >= big.width) continue;
          const j = (by * big.width + bx) * 4;
          if (b.data[j + 3] >= 128 && Math.abs(a.data[i] - b.data[j]) + Math.abs(a.data[i + 1] - b.data[j + 1]) + Math.abs(a.data[i + 2] - b.data[j + 2]) < 60) score++;
        }
      }
      if (score > best.score) best = { dx, dy, score };
    }
  }
  return best;
}

// Mask of the hat pixels in a hat version (pixels the plain sprite lacks).
function hatMask(plain, hatted, off) {
  const a = data(plain), b = data(hatted);
  const m = new Uint8Array(hatted.width * hatted.height);
  for (let y = 0; y < hatted.height; y++) {
    for (let x = 0; x < hatted.width; x++) {
      const j = (y * hatted.width + x) * 4;
      if (b.data[j + 3] < 128) continue;
      const px = x - off.dx, py = y - off.dy;
      let differs = true;
      if (px >= 0 && py >= 0 && px < plain.width && py < plain.height) {
        const i = (py * plain.width + px) * 4;
        differs = a.data[i + 3] < 128 || Math.abs(a.data[i] - b.data[j]) + Math.abs(a.data[i + 1] - b.data[j + 1]) + Math.abs(a.data[i + 2] - b.data[j + 2]) > 90;
      }
      if (differs) m[y * hatted.width + x] = 1;
    }
  }
  return m;
}

// The small hat, cut from player_betta_partyhat (used on new creatures).
export function smallHat() {
  return memo('smallhat', () => {
    const plain = img('betta0'), hat = img('betta0h');
    if (!plain || !hat) return null;
    const off = align(plain, hat);
    const m = hatMask(plain, hat, off);
    // keep only the region above the fish's top-centre (the hat itself)
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let y = 0; y < hat.height; y++) for (let x = 0; x < hat.width; x++) {
      if (m[y * hat.width + x] && y < off.dy + plain.height * 0.45) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    }
    if (x1 < 0) return null;
    const c = mk(x1 - x0 + 1, y1 - y0 + 1);
    const src = data(hat), out = c.getContext('2d', { willReadFrequently: true }).createImageData(c.width, c.height);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (!m[y * hat.width + x]) continue;
      const i = (y * hat.width + x) * 4, o = ((y - y0) * c.width + (x - x0)) * 4;
      out.data[o] = src.data[i]; out.data[o + 1] = src.data[i + 1]; out.data[o + 2] = src.data[i + 2]; out.data[o + 3] = 255;
    }
    put(c, out);
    return c;
  });
}

// Top of the head of a right-facing sprite: {x, y} of the highest opaque
// pixel in the front part.
function headTop(c, from = 0.55, to = 0.85) {
  const d = data(c);
  for (let y = 0; y < c.height; y++) {
    for (let x = Math.floor(c.width * from); x < Math.floor(c.width * to); x++) {
      if (d.data[(y * c.width + x) * 4 + 3] >= 128) return { x, y };
    }
  }
  return { x: Math.floor(c.width * 0.7), y: 0 };
}

// A creature with its party hat: the kept hat version when there is one,
// else the cut hat placed on its head in code.
export function hatted(key, base = img(key)) {
  return memo('hat:' + key + ':' + (base?.width || 0), () => {
    if (!base) return null;
    const kept = hasReal(key + 'h') ? img(key + 'h') : null;
    if (kept) {
      const off = align(base, kept);
      return V(kept, off.dx, off.dy, base.width, base.height);
    }
    const hat = smallHat() || img('partyhat');
    if (!hat) return V(base);
    const ht = key === 'garboss' ? headTop(base, 0.8, 0.93) : headTop(base);
    const hx = ht.x - Math.floor(hat.width / 2) + 1, hy = ht.y - hat.height + 2;
    const left = Math.min(0, hx), top = Math.min(0, hy);
    const c = mk(Math.max(base.width, hx + hat.width) - left, base.height - top);
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(base, -left, -top);
    g.drawImage(hat, hx - left, hy - top);
    return V(c, -left, -top, base.width, base.height);
  });
}

// The player's betta in a color, at an armor stage, with or without hat.
export function betta(stage, color = 'red', hat = false) {
  return memo(`betta:${stage}:${color}:${hat}`, () => {
    const plain = img('betta' + stage);
    if (!plain) return null;
    const src = hat ? img('betta' + stage + 'h') : plain;
    if (!src) return V(plain);
    let off = { dx: 0, dy: 0 };
    let mask = null;
    if (hat) { off = align(plain, src); mask = hatMask(plain, src, off); }
    const c = copy(src);
    const d = data(c);
    const pc = PLAYER_COLORS[color] || PLAYER_COLORS.red;
    const tint = hex(pc.swatch);
    for (let p = 0; p < c.width * c.height; p++) {
      const i = p * 4;
      if (d.data[i + 3] < 128) continue;
      if (mask && mask[p]) continue; // the hat stays as drawn
      const [h, s, v] = rgb2hsv(d.data[i], d.data[i + 1], d.data[i + 2]);
      if (stage < 3) {
        if (pc.hue == null) continue;
        const red = (h < 28 || h > 335) && s > 0.4 && v > 0.22;
        if (!red) continue;
        const nh = pc.hue + ((h > 180 ? h - 360 : h) - 10);
        const [r, g, b] = hsv2rgb(nh, Math.min(1, s * pc.sat), Math.min(1, v * pc.val));
        d.data[i] = r; d.data[i + 1] = g; d.data[i + 2] = b;
      } else if (v > 0.22 && v < 0.8 && s < 0.35) {
        // full metal: a 30% tint of your color on the mid-tones
        d.data[i] = Math.round(d.data[i] * 0.7 + tint[0] * 0.3);
        d.data[i + 1] = Math.round(d.data[i + 1] * 0.7 + tint[1] * 0.3);
        d.data[i + 2] = Math.round(d.data[i + 2] * 0.7 + tint[2] * 0.3);
      }
    }
    put(c, d);
    if (stage === 3) addPlume(c, plain, off, tint);
    return V(c, off.dx, off.dy, plain.width, plain.height);
  });
}

// A small crest plume in your color on the full-metal helmet (5 x 4 art px).
function addPlume(c, plain, off, tint) {
  const t = headTop(plain, 0.38, 0.55);
  const g = c.getContext('2d', { willReadFrequently: true });
  const shape = ['.##..', '####.', '.####', '..###'];
  const dark = `rgb(${tint.map((v) => Math.round(v * 0.6)).join(',')})`;
  const lite = `rgb(${tint.map((v) => Math.min(255, Math.round(v * 1.15))).join(',')})`;
  const x0 = t.x + off.dx - 2, y0 = t.y + off.dy - 3;
  shape.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch !== '#') return;
    g.fillStyle = y === 3 || x === 4 ? dark : lite;
    g.fillRect(x0 + x, y0 + y, 1, 1);
  }));
  // outline the plume where it meets water
  g.fillStyle = '#2A1A12';
  shape.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch !== '#') return;
    if (y === 0 || shape[y - 1][x] !== '#') {
      const d = g.getImageData(x0 + x, y0 + y - 1, 1, 1).data;
      if (d[3] < 128) g.fillRect(x0 + x, y0 + y - 1, 1, 1);
    }
  }));
}


// The base betta's swim frames (anim/betta_swim_0..3, 45x39, the still betta
// at (0,1)), recolored like the still sprite. Loop order 0,1,0,3.
export function bettaSwim(i, color = 'red') {
  return memo(`swim:${i}:${color}`, () => {
    if (!hasReal('anim_swim' + i)) return null;
    const src = img('anim_swim' + i);
    const pc = PLAYER_COLORS[color] || PLAYER_COLORS.red;
    const c = copy(src);
    if (pc.hue != null) {
      const d = data(c);
      for (let p = 0; p < c.width * c.height; p++) {
        const k = p * 4;
        if (d.data[k + 3] < 128) continue;
        const [h, s, v] = rgb2hsv(d.data[k], d.data[k + 1], d.data[k + 2]);
        if (!((h < 28 || h > 335) && s > 0.4 && v > 0.22)) continue;
        const [r, g, b] = hsv2rgb(pc.hue + ((h > 180 ? h - 360 : h) - 10), Math.min(1, s * pc.sat), Math.min(1, v * pc.val));
        d.data[k] = r; d.data[k + 1] = g; d.data[k + 2] = b;
      }
      put(c, d);
    }
    return V(c, 0, 1, 45, 37);
  });
}
// The Gar's lunge frames (145x67, the still Gar at (1,7)).
export function garLunge(i) {
  return memo('lunge' + i, () => (hasReal('anim_lunge' + i) ? V(img('anim_lunge' + i), 1, 7, 141, 60) : null));
}

// Hue-shifted copy of a villager (Kelpie, Mossy, townsfolk, captives).
// rules: [{from:[h0,h1], minS, to, sat, val}], plus optional whiten.
export function recolor(key, rules, tag) {
  return memo('rc:' + key + ':' + tag, () => {
    const base = img(key);
    if (!base) return null;
    const c = copy(base), d = data(c);
    for (let p = 0; p < c.width * c.height; p++) {
      const i = p * 4;
      if (d.data[i + 3] < 128) continue;
      const [h, s, v] = rgb2hsv(d.data[i], d.data[i + 1], d.data[i + 2]);
      for (const r of rules) {
        const inBand = r.any || (r.from[0] <= r.from[1] ? h >= r.from[0] && h <= r.from[1] : h >= r.from[0] || h <= r.from[1]);
        if (!inBand || s < (r.minS ?? 0.15) || v < (r.minV ?? 0.15)) continue;
        const nh = r.to != null ? r.to + (r.keepVar ? (h - (r.from[0] + r.from[1]) / 2) * 0.5 : 0) : h + (r.shift || 0);
        const [R, G, B] = hsv2rgb(nh, Math.min(1, s * (r.sat ?? 1)), Math.min(1, v * (r.val ?? 1)));
        d.data[i] = R; d.data[i + 1] = G; d.data[i + 2] = B;
        break;
      }
    }
    put(c, d);
    return c;
  });
}

// Sprites with 1 px of #9FD8E0 rim light on their top and left edges.
export function rim(v) {
  if (!v) return v;
  return memo(v.canvas, () => {
    const s = v.canvas, c = mk(s.width + 1, s.height + 1);
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(s, 1, 1);
    const d = data(c);
    const W = c.width, H = c.height;
    const out = new Uint8ClampedArray(d.data);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (d.data[i + 3] >= 128) continue;
      const below = y + 1 < H && d.data[((y + 1) * W + x) * 4 + 3] >= 128;
      const right = x + 1 < W && d.data[(y * W + x + 1) * 4 + 3] >= 128;
      if (below || right) { out[i] = 0x9F; out[i + 1] = 0xD8; out[i + 2] = 0xE0; out[i + 3] = 255; }
    }
    put(c, new ImageData(out, W, H));
    return V(c, v.ox + 1, v.oy + 1, v.bw, v.bh);
  });
}
// cache keyed by canvas object
const objCache = new WeakMap();
function memoObj(obj, tag, f) {
  let m = objCache.get(obj);
  if (!m) { m = new Map(); objCache.set(obj, m); }
  if (!m.has(tag)) m.set(tag, f());
  return m.get(tag);
}

export function white(v) {
  return memoObj(v.canvas, 'white', () => {
    const c = copy(v.canvas), d = data(c);
    for (let i = 0; i < d.data.length; i += 4) if (d.data[i + 3] >= 128) { d.data[i] = d.data[i + 1] = d.data[i + 2] = 255; }
    put(c, d);
    return V(c, v.ox, v.oy, v.bw, v.bh);
  });
}

// A 2 px glow ring around a sprite (red: much stronger; violet: edge fish;
// gold: charge).
export function glow(v, color) {
  return memoObj(v.canvas, 'glow' + color, () => {
    const s = v.canvas, W = s.width + 4, H = s.height + 4;
    const c = mk(W, H);
    c.getContext('2d', { willReadFrequently: true }).drawImage(s, 2, 2);
    const d = data(c), [r, g, b] = hex(color);
    const solid = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d.data[(y * W + x) * 4 + 3] >= 128;
    const out = c.getContext('2d', { willReadFrequently: true }).createImageData(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (solid(x, y)) continue;
      let near1 = solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1);
      let near2 = !near1 && (solid(x - 2, y) || solid(x + 2, y) || solid(x, y - 2) || solid(x, y + 2) || solid(x - 1, y - 1) || solid(x + 1, y + 1) || solid(x - 1, y + 1) || solid(x + 1, y - 1));
      if (!near1 && !near2) continue;
      const i = (y * W + x) * 4;
      out.data[i] = r; out.data[i + 1] = g; out.data[i + 2] = b; out.data[i + 3] = near1 ? 220 : 110;
    }
    put(c, out);
    return V(c, v.ox + 2, v.oy + 2, v.bw, v.bh);
  });
}

// Violet tint for edge fish.
export function tinted(v, color, amt) {
  return memoObj(v.canvas, 'tint' + color + amt, () => {
    const c = copy(v.canvas), d = data(c), t = hex(color);
    for (let i = 0; i < d.data.length; i += 4) {
      if (d.data[i + 3] < 128) continue;
      for (let k = 0; k < 3; k++) d.data[i + k] = Math.round(d.data[i + k] * (1 - amt) + t[k] * amt);
    }
    put(c, d);
    return V(c, v.ox, v.oy, v.bw, v.bh);
  });
}

// Head crop for portraits: a square from the front of a right-facing sprite.
export function portrait(canvas, size = 24) {
  if (!canvas) return null;
  return memoObj(canvas, 'portrait' + size, () => {
    const d = data(canvas);
    let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
    for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
      if (d.data[(y * canvas.width + x) * 4 + 3] >= 128) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    }
    const s = Math.min(size, Math.max(x1 - x0 + 1, y1 - y0 + 1));
    // vertical centre of the front quarter
    let sy = 0, n = 0;
    const fx = Math.max(x0, x1 - Math.floor((x1 - x0) / 3));
    for (let y = y0; y <= y1; y++) for (let x = fx; x <= x1; x++) if (d.data[(y * canvas.width + x) * 4 + 3] >= 128) { sy += y; n++; }
    const cy = n ? Math.round(sy / n) : (y0 + y1) >> 1;
    const c = mk(s, s);
    const sx = Math.max(0, x1 + 2 - s);
    const top = Math.max(0, Math.min(canvas.height - s, cy - Math.floor(s / 2)));
    c.getContext('2d', { willReadFrequently: true }).drawImage(canvas, sx, top, s, s, 0, 0, s, s);
    return c;
  });
}

export const plain = (key) => { const c = img(key); return c ? V(c) : null; };
export const fromCanvas = (c) => (c ? V(c) : null);

// Draw a fish (a variant) centred at (x, y) on the base sprite, at whole
// scale s, flipped to face left, with tail sway and tilt done by moving
// whole pixel columns (no rotation, so pixels stay square).
export function drawFish(ctx, v, x, y, { s = 1, flip = false, sway = 0, tilt = 0, bob = 0, alpha = 1, swayLen = 0.45 } = {}) {
  if (!v) return;
  const c = v.canvas, W = c.width, H = c.height;
  const bx = Math.round(x - (v.bw * s) / 2), by = Math.round(y - (v.bh * s) / 2 + bob);
  ctx.save();
  if (alpha !== 1) ctx.globalAlpha = alpha;
  if (flip) { ctx.translate(bx * 2 + v.bw * s, 0); ctx.scale(-1, 1); }
  const ox = bx - v.ox * s, oy = by - v.oy * s;
  if (!sway && !tilt) {
    ctx.drawImage(c, ox, oy, W * s, H * s);
  } else {
    const tailEnd = v.ox + v.bw * swayLen, mid = v.ox + v.bw / 2;
    for (let i = 0; i < W; i++) {
      let dy = tilt * (i - mid);
      if (i < tailEnd) dy += sway * (1 - (i - v.ox) / (v.bw * swayLen));
      ctx.drawImage(c, i, 0, 1, H, ox + i * s, oy + Math.round(dy) * s, s, H * s);
    }
  }
  ctx.restore();
}
