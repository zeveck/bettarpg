// fx.js: particles (bubbles, confetti, balloons, sparks, stars), the tiny
// bitmap font for numbers and level tags (whole pixels), and the ripple wipe.

const G = {
  '0': '111101101101111', '1': '010110010010111', '2': '111001111100111', '3': '111001111001111',
  '4': '101101111001001', '5': '111100111001111', '6': '111100111101111', '7': '111001010010010',
  '8': '111101111101111', '9': '111101111001111', '+': '000010111010000', '-': '000000111000000',
  'L': '100100100100111', 'v': '000101101101010', 'H': '101101111101101', 'P': '111101111100100',
  'M': '101111111101101', 'I': '111010010010111', 'S': '111100111001111', 'x': '000101010101000',
  '!': '010010010000010', '?': '111001011000010', '/': '001001010100100', ' ': '000000000000000',
  'E': '111100111100111', 'X': '101101010101101', 'B': '110101110101110',
};

export function textWidth(str, s = 1) { return str.length * 4 * s - s; }

// Draw text in the bitmap font with a 1 px dark outline. (x, y) top-left.
export function pixelText(ctx, str, x, y, color = '#fff', s = 1, outline = '#2A1A12') {
  x = Math.round(x); y = Math.round(y);
  const glyph = (dx, dy, col) => {
    ctx.fillStyle = col;
    let cx = x + dx;
    for (const ch of str) {
      const g = G[ch] || G['?'];
      for (let i = 0; i < 15; i++) if (g[i] === '1') ctx.fillRect(cx + (i % 3) * s, y + dy + Math.floor(i / 3) * s, s, s);
      cx += 4 * s;
    }
  };
  if (outline) for (const [dx, dy] of [[-s, 0], [s, 0], [0, -s], [0, s], [-s, -s], [s, s], [-s, s], [s, -s]]) glyph(dx, dy, outline);
  glyph(0, 0, color);
}

// Pixel ring bubble of radius r.
export function pixelBubble(ctx, x, y, r, color = '#CFF4FF') {
  x = Math.round(x); y = Math.round(y);
  ctx.fillStyle = color;
  if (r <= 1) { ctx.fillRect(x, y, 1, 1); return; }
  if (r === 2) {
    ctx.fillRect(x - 1, y - 2, 2, 1); ctx.fillRect(x - 1, y + 1, 2, 1); ctx.fillRect(x - 2, y - 1, 1, 2); ctx.fillRect(x + 1, y - 1, 1, 2);
    return;
  }
  for (let a = 0; a < 16; a++) {
    const t = (a / 16) * Math.PI * 2;
    ctx.fillRect(Math.round(x + Math.cos(t) * r), Math.round(y + Math.sin(t) * r), 1, 1);
  }
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(Math.round(x - r * 0.4), Math.round(y - r * 0.5), 1, 1);
}

const CONFETTI = ['#FF4FA3', '#F7C948', '#9FD8E0', '#5B8C3A', '#E5401F', '#8A3FD0', '#ffffff'];
const BALLOON = ['#FF4FA3', '#F7C948', '#4FB0FF', '#7ED957', '#E5401F', '#B57BFF'];

export class Particles {
  constructor() { this.list = []; }
  clear() { this.list.length = 0; }
  add(p) { this.list.push({ vx: 0, vy: 0, g: 0, life: 1, age: 0, drag: 0, ...p }); }
  bubbles(x, y, n = 3, { spread = 3, up = 18, color = '#CFF4FF', r = [1, 2] } = {}) {
    for (let i = 0; i < n; i++) this.add({ type: 'bubble', x: x + (Math.random() - 0.5) * spread * 2, y: y + (Math.random() - 0.5) * spread,
      vx: (Math.random() - 0.5) * 8, vy: -up * (0.6 + Math.random() * 0.6), life: 0.8 + Math.random() * 0.8,
      r: r[0] + Math.floor(Math.random() * (r[1] - r[0] + 1)), color, wob: Math.random() * 6 });
  }
  confetti(x, y, n = 40, s = 1) {
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, v = (60 + Math.random() * 90) * s;
      this.add({ type: 'confetti', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 120 * s, drag: 1.6,
        life: 1.4 + Math.random() * 0.8, color: CONFETTI[i % CONFETTI.length], size: s });
    }
  }
  balloons(x, y, n = 6, s = 1, spread = 60) {
    for (let i = 0; i < n; i++) this.add({ type: 'balloon', x: x + (Math.random() - 0.5) * spread * s, y: y + Math.random() * 20 * s,
      vx: (Math.random() - 0.5) * 10, vy: -(25 + Math.random() * 25) * s, life: 2.2 + Math.random(), color: BALLOON[i % BALLOON.length],
      size: s, wob: Math.random() * 6 });
  }
  sparks(x, y, n = 10, color = '#F7C948', s = 1, speed = 70) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = speed * (0.4 + Math.random() * 0.8) * s;
      this.add({ type: 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, drag: 3, life: 0.35 + Math.random() * 0.3, color, size: s });
    }
  }
  golden(x, y, n = 30, s = 1) {
    for (let i = 0; i < n; i++) this.add({ type: 'bubble', x: x + (Math.random() - 0.5) * 40 * s, y: y + (Math.random() - 0.5) * 20 * s,
      vx: (Math.random() - 0.5) * 30 * s, vy: -(30 + Math.random() * 60) * s, life: 1 + Math.random(), r: (1 + Math.floor(Math.random() * 3)) * s,
      color: Math.random() < 0.7 ? '#F7C948' : '#FFF1B0', wob: Math.random() * 6 });
  }
  number(x, y, text, color, s = 1) {
    this.add({ type: 'number', x, y, vx: (Math.random() - 0.5) * 20 * s, vy: -60 * s, g: 160 * s, life: 1.0, text, color, size: s });
  }
  update(dt) {
    const L = this.list;
    for (let i = L.length - 1; i >= 0; i--) {
      const p = L[i];
      p.age += dt;
      if (p.age >= p.life) { L.splice(i, 1); continue; }
      if (p.drag) { p.vx *= Math.exp(-p.drag * dt); p.vy *= Math.exp(-p.drag * dt); }
      p.vy += p.g * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.type === 'bubble' || p.type === 'balloon') p.x += Math.sin(p.age * 5 + p.wob) * 0.25;
    }
  }
  draw(ctx, ox = 0, oy = 0) {
    for (const p of this.list) {
      const x = Math.round(p.x - ox), y = Math.round(p.y - oy), k = 1 - p.age / p.life;
      if (p.age < 0) continue; // a delayed particle (rings in a row)
      switch (p.type) {
        case 'ring': {
          // a pixel ripple rolling out (a flare's shock wave)
          const r = 8 + (1 - k) * 70, n = 28;
          ctx.globalAlpha = k * 0.8; ctx.fillStyle = p.color;
          for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2;
            ctx.fillRect(Math.round(x + Math.cos(a) * r * 1.3) - 1, Math.round(y + Math.sin(a) * r * 0.8) - 1, 2, 2);
          }
          ctx.globalAlpha = 1;
          break;
        }
        case 'bubble': pixelBubble(ctx, x, y, p.r, p.color); break;
        case 'confetti': ctx.fillStyle = p.color; ctx.fillRect(x, y, (p.age * 10 | 0) % 2 ? 2 * p.size : p.size, p.size * 2); break;
        case 'spark': ctx.fillStyle = p.color; ctx.fillRect(x, y, p.size * (k > 0.5 ? 2 : 1), p.size * (k > 0.5 ? 2 : 1)); break;
        case 'balloon': {
          const s = p.size;
          ctx.fillStyle = '#2A1A12';
          ctx.fillRect(x - 3 * s, y - 4 * s, 6 * s, 8 * s); ctx.fillRect(x - 4 * s, y - 3 * s, 8 * s, 6 * s);
          ctx.fillStyle = p.color;
          ctx.fillRect(x - 2 * s, y - 3 * s, 4 * s, 6 * s); ctx.fillRect(x - 3 * s, y - 2 * s, 6 * s, 4 * s);
          ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 2 * s, y - 2 * s, s, s);
          ctx.fillStyle = '#2A1A12'; ctx.fillRect(x, y + 4 * s, s, 4 * s);
          break;
        }
        case 'number': {
          const a = p.age < 0.08 ? 1.0 : 1;
          ctx.globalAlpha = k < 0.25 ? k * 4 : a;
          pixelText(ctx, p.text, x - textWidth(p.text, p.size) / 2, y, p.color, p.size);
          ctx.globalAlpha = 1;
          break;
        }
        case 'star': {
          ctx.fillStyle = '#F7C948';
          ctx.fillRect(x, y - 1, 1, 3); ctx.fillRect(x - 1, y, 3, 1);
          break;
        }
      }
    }
  }
}

// The ripple wipe between areas and into battles: wavy bands of deep water
// sweep across, cover the screen, then sweep away.
export function drawWipe(ctx, W, H, p, t) {
  // p: 0..1 covering, 1..2 uncovering
  const band = 4;
  const ease = (v) => v * v * (3 - 2 * v);
  for (let y = 0; y < H; y += band) {
    const wave = Math.sin(y * 0.045 + t * 6) * 18 + Math.sin(y * 0.11) * 6;
    let x0, x1;
    if (p <= 1) { x0 = -40; x1 = ease(p) * (W + 80) - 40 + wave; }
    else { x0 = ease(p - 1) * (W + 80) - 40 + wave; x1 = W + 40; }
    if (x1 <= x0) continue;
    ctx.fillStyle = '#123a66';
    ctx.fillRect(Math.round(x0), y, Math.round(x1 - x0), band);
    ctx.fillStyle = '#3290D1';
    if (p <= 1) ctx.fillRect(Math.round(x1) - 3, y, 3, band);
    else ctx.fillRect(Math.round(x0), y, 3, band);
  }
}
