// terrain.js: builds an area's water and banks from its shapes, draws them
// once to an offscreen canvas (flat palette water per depth, dithered zone
// edges, mud banks with a dark outline and a light top-left step), and
// answers "is this water?" for collisions.

const CELL = 2;
export const DEPTH_COLORS = {
  1: [0x32, 0x90, 0xD1], 2: [0x2B, 0x7F, 0xC4], 3: [0x1B, 0x4F, 0x8A], 4: [0x0E, 0x2A, 0x47], 5: [0x08, 0x1A, 0x2E],
  6: [0xE8, 0xC5, 0x52],
};
const BANKS = {
  mud: { base: [0x6B, 0x4E, 0x2E], dark: [0x57, 0x3E, 0x22], light: [0x8E, 0x6C, 0x42], spot: [0x5E, 0x44, 0x27], line: [0x2A, 0x1A, 0x12], grass: [0x5B, 0x8C, 0x3A] },
  dark: { base: [0x3A, 0x2C, 0x1C], dark: [0x2E, 0x22, 0x15], light: [0x50, 0x3D, 0x26], spot: [0x33, 0x27, 0x18], line: [0x12, 0x0B, 0x07], grass: [0x2E, 0x4A, 0x22] },
  concrete: { base: [0x6C, 0x71, 0x76], dark: [0x58, 0x5C, 0x61], light: [0x8C, 0x92, 0x97], spot: [0x60, 0x64, 0x69], line: [0x22, 0x24, 0x28], grass: [0x4A, 0x6A, 0x3A] },
};
const PATH_COLORS = {
  sand: { base: [0xE8, 0xC5, 0x52], light: [0xF2, 0xD7, 0x7A], dark: [0xC9, 0xA2, 0x4A] },
  stone: { base: [0x9C, 0xA6, 0xAA], light: [0xB8, 0xC1, 0xC4], dark: [0x7A, 0x84, 0x8A] },
};

function hash(x, y, s) {
  let h = (x * 374761393 + y * 668265263 + s * 982451653) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function noise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const wob = (x, y, s) => (noise(x / 40, y / 40, s) - 0.5) * 12 + (noise(x / 13, y / 13, s + 7) - 0.5) * 4;

function segDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1, l = dx * dx + dy * dy;
  let t = l ? ((px - x1) * dx + (py - y1) * dy) / l : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

export function buildTerrain(def) {
  const W = def.w, H = def.h, gw = W / CELL, gh = H / CELL, seed = def.seed || 1;
  const depth = new Uint8Array(gw * gh);
  const paint = (x0, y0, x1, y1, d, inside) => {
    const cx0 = Math.max(0, Math.floor(x0 / CELL)), cy0 = Math.max(0, Math.floor(y0 / CELL));
    const cx1 = Math.min(gw - 1, Math.ceil(x1 / CELL)), cy1 = Math.min(gh - 1, Math.ceil(y1 / CELL));
    for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
      const px = cx * CELL + 1, py = cy * CELL + 1;
      if (inside(px, py, def.interior ? 0 : wob(px, py, seed))) depth[cy * gw + cx] = d;
    }
  };
  const M = 14;
  for (const s of def.shapes) {
    const [t] = s;
    if (t === 'e') {
      const [, cx, cy, rx, ry, d] = s;
      paint(cx - rx - M, cy - ry - M, cx + rx + M, cy + ry + M, d, (px, py, n) => {
        const k = Math.hypot((px - cx) / rx, (py - cy) / ry);
        return (k - 1) * Math.min(rx, ry) <= n;
      });
    } else if (t === 'r') {
      const [, x, y, w, h, d, rad = 12] = s;
      const edgeW = x <= 0 || y <= 0 || x + w >= W || y + h >= H;
      paint(x - M, y - M, x + w + M, y + h + M, d, (px, py, n) => {
        const qx = Math.abs(px - (x + w / 2)) - (w / 2 - rad), qy = Math.abs(py - (y + h / 2)) - (h / 2 - rad);
        const dist = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - rad;
        return dist <= (edgeW ? Math.min(n, 0) * 0.3 : n * 0.6);
      });
    } else if (t === 'c') {
      const [, x1, y1, x2, y2, r, d] = s;
      paint(Math.min(x1, x2) - r - M, Math.min(y1, y2) - r - M, Math.max(x1, x2) + r + M, Math.max(y1, y2) + r + M, d,
        (px, py, n) => segDist(px, py, x1, y1, x2, y2) <= r + n * 0.8);
    } else if (t === 'p') {
      const [, pts, r, d] = s;
      for (let i = 0; i < pts.length - 1; i++) {
        const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
        paint(Math.min(x1, x2) - r - M, Math.min(y1, y2) - r - M, Math.max(x1, x2) + r + M, Math.max(y1, y2) + r + M, d,
          (px, py, n) => segDist(px, py, x1, y1, x2, y2) <= r + n * 0.8);
      }
    }
  }
  // paths: sand (or stone) bottom, only where there is water
  for (const pl of def.paths || []) {
    for (let i = 0; i < pl.length - 1; i++) {
      const [x1, y1] = pl[i], [x2, y2] = pl[i + 1];
      const r = 9;
      const cx0 = Math.max(0, Math.floor((Math.min(x1, x2) - r - 2) / CELL)), cx1 = Math.min(gw - 1, Math.ceil((Math.max(x1, x2) + r + 2) / CELL));
      const cy0 = Math.max(0, Math.floor((Math.min(y1, y2) - r - 2) / CELL)), cy1 = Math.min(gh - 1, Math.ceil((Math.max(y1, y2) + r + 2) / CELL));
      for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
        const px = cx * CELL + 1, py = cy * CELL + 1, k = cy * gw + cx;
        if (depth[k] && segDist(px, py, x1, y1, x2, y2) <= r) depth[k] = 6;
      }
    }
  }
  return { W, H, gw, gh, cell: CELL, depth, seed, canvas: render(def, W, H, gw, gh, depth, seed) };
}

function render(def, W, H, gw, gh, depth, seed) {
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  const im = g.createImageData(W, H), px = im.data;
  const bank = BANKS[def.bank || 'mud'];
  const path = PATH_COLORS[def.pathColor || 'sand'];
  const D = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : depth[(y >> 1) * gw + (x >> 1)]);
  // blurred "near bank" amount, on the cell grid (integral image)
  const ii = new Float32Array((gw + 1) * (gh + 1));
  for (let y = 0; y < gh; y++) {
    let row = 0;
    for (let x = 0; x < gw; x++) { row += depth[y * gw + x] === 0 ? 1 : 0; ii[(y + 1) * (gw + 1) + x + 1] = ii[y * (gw + 1) + x + 1] + row; }
  }
  const R = 5;
  const near = (cx, cy) => {
    const x0 = Math.max(0, cx - R), y0 = Math.max(0, cy - R), x1 = Math.min(gw, cx + R + 1), y1 = Math.min(gh, cy + R + 1);
    const s = ii[y1 * (gw + 1) + x1] - ii[y0 * (gw + 1) + x1] - ii[y1 * (gw + 1) + x0] + ii[y0 * (gw + 1) + x0];
    return s / ((x1 - x0) * (y1 - y0));
  };
  const set = (i, c, k = 1) => { px[i] = c[0] * k; px[i + 1] = c[1] * k; px[i + 2] = c[2] * k; px[i + 3] = 255; };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4, d = D(x, y);
      if (d === 0) {
        const wl = D(x - 1, y), wr = D(x + 1, y), wu = D(x, y - 1), wd = D(x, y + 1);
        const edge = wl > 0 || wr > 0 || wu > 0 || wd > 0;
        if (edge) { set(i, bank.line); continue; }
        const l2 = D(x - 2, y) > 0 || D(x, y - 2) > 0;
        const r2 = D(x + 2, y) > 0 || D(x, y + 2) > 0;
        if (l2) { set(i, bank.light); continue; }
        if (r2) { set(i, bank.dark); continue; }
        // a band of grass along the bank's top edge (the water is below it)
        if (def.bank !== 'concrete' && (D(x, y + 3) > 0 || D(x, y + 4) > 0) && hash(x >> 1, y, seed) < 0.55) { set(i, bank.grass); continue; }
        if (def.bank === 'concrete') {
          const tile = (x % 24 === 0) || (y % 16 === 0);
          set(i, tile ? bank.dark : bank.base);
          continue;
        }
        const h = hash(x >> 1, y >> 1, seed);
        set(i, h < 0.07 ? bank.spot : h > 0.97 ? bank.light : bank.base);
        continue;
      }
      if (d === 6) {
        const nb = D(x - 1, y) !== 6 || D(x + 1, y) !== 6 || D(x, y - 1) !== 6 || D(x, y + 1) !== 6;
        if (nb) { set(i, path.dark); continue; }
        const h = hash(x, y, seed + 9);
        set(i, h < 0.05 ? path.dark : h > 0.95 ? path.light : path.base);
        continue;
      }
      // the Ditch's pool: a concrete ledge where the deep pool meets the rest
      if (def.poolEdge && d === 3 && [D(x + 1, y), D(x - 1, y), D(x, y + 1), D(x, y - 1), D(x + 2, y), D(x, y + 2), D(x - 2, y), D(x, y - 2)].includes(4)) {
        const inner = [D(x + 1, y), D(x - 1, y), D(x, y + 1), D(x, y - 1)].includes(4);
        set(i, inner ? bank.line : (x + y) % 6 === 0 ? bank.dark : bank.light);
        continue;
      }
      // water: checker-dither where two depths meet
      let c = DEPTH_COLORS[d];
      if ((x + y) % 2 === 0) {
        const o = [D(x + 2, y), D(x, y + 2), D(x - 2, y), D(x, y - 2)].find((v) => v > 0 && v < 6 && v !== d);
        if (o) c = DEPTH_COLORS[o];
      }
      let k = 1;
      // shadow just below a bank
      if (D(x, y - 1) === 0 || D(x, y - 2) === 0 || D(x - 1, y - 1) === 0) k = 0.78;
      else {
        const n = near(x >> 1, y >> 1);
        if (n > 0.32) k = 0.86; else if (n > 0.12) k = (x + y) % 2 ? 0.93 : 1;
      }
      set(i, c, k);
    }
  }
  g.putImageData(im, 0, 0);
  return cv;
}

export function isWater(t, x, y) {
  if (x < 0 || y < 0 || x >= t.W || y >= t.H) return false;
  return t.depth[((y | 0) >> 1) * t.gw + ((x | 0) >> 1)] > 0;
}
export function depthAt(t, x, y) {
  if (x < 0 || y < 0 || x >= t.W || y >= t.H) return 0;
  return t.depth[((y | 0) >> 1) * t.gw + ((x | 0) >> 1)];
}

// Spots along the banks, for rice tufts: bank pixels with water just below.
export function bankSpots(t, n, rng) {
  const out = [];
  for (let tries = 0; tries < n * 40 && out.length < n; tries++) {
    const x = 10 + Math.floor(rng() * (t.W - 20)), y = 6 + Math.floor(rng() * (t.H - 12));
    if (depthAt(t, x, y) === 0 && depthAt(t, x, y + 6) > 0 && depthAt(t, x, y + 6) < 6 && depthAt(t, x, y - 10) === 0) {
      if (out.every((p) => Math.hypot(p.x - x, p.y - y) > 40)) out.push({ x, y: y + 4 });
    }
  }
  return out;
}
// Random open-water spots (shimmer, wandering targets).
export function waterSpots(t, n, rng, minDepth = 1, maxDepth = 5) {
  const out = [];
  for (let tries = 0; tries < n * 30 && out.length < n; tries++) {
    const x = Math.floor(rng() * t.W), y = Math.floor(rng() * t.H), d = depthAt(t, x, y);
    if (d >= minDepth && d <= maxDepth) out.push({ x, y, ph: rng() * 6.28 });
  }
  return out;
}
