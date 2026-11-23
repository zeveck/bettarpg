#!/usr/bin/env node
// check-routes.mjs <route.json>...: checks that each waypoint and the straight
// swim between consecutive waypoints stays in open water (the game's own
// terrain, building feet and room furniture, with the player's collision radius), before replaying in a browser.
// Area changes are followed through the "expect area" steps and exits.
import { readFileSync } from 'node:fs';
globalThis.document = { createElement: () => ({ getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) }) };
const { buildTerrain, isWater } = await import('../game/src/terrain.js');
const { MAPS } = await import('../game/src/maps.js');
const { AREAS } = await import('../game/src/config.js');
const cache = {};
const terr = (a) => (cache[a] ||= buildTerrain(MAPS[a]));
// building feet, room furniture and solid props block too (sizes from assets.js placeholders)
const SIZE = {};
for (const m of readFileSync(new URL('../game/src/assets.js', import.meta.url), 'utf8').matchAll(/(\w+): \[\[[^\]]*\], \{ w: (\d+), h: (\d+)/g)) SIZE[m[1]] = [+m[2], +m[3]];
const solidCache = {};
const solidsOf = (a) => (solidCache[a] ||= (() => {
  const def = MAPS[a], out = [...(def.solid || [])];
  for (const b of def.buildings || []) {
    const [w, h] = SIZE[b.sprite] || [100, 100];
    if (b.pass) continue;
    if (b.arch) out.push([b.x + 4, b.y + h - 24, 26, 22], [b.x + w - 30, b.y + h - 24, 26, 22]);
    else out.push([b.x + 8, b.y + h * (1 - (b.foot || 0.42)), w - 16, h * (b.foot || 0.42) - 4]);
  }
  return out;
})());
let curArea = null;
const free = (t, x, y, r = 7) => {
  const def = MAPS[curArea];
  if (!def.interior && (x < 16 || y < 16 || x >= t.W - 16 || y >= t.H - 16)) return true; // at an edge: an exit
  for (let k = 0; k < 8; k++) if (!isWater(t, x + Math.cos(k * Math.PI / 4) * r, y + Math.sin(k * Math.PI / 4) * r)) return false;
  if (solidsOf(curArea).some(([sx, sy, sw, sh]) => Math.hypot(Math.max(sx - x, 0, x - sx - sw), Math.max(sy - y, 0, y - sy - sh)) < r - 1)) return false;
  return isWater(t, x, y);
};
let bad = 0;
for (const f of process.argv.slice(2)) {
  const r = JSON.parse(readFileSync(f, 'utf8'));
  let area = null, last = null;
  for (const st of r.steps) {
    if (st.start !== undefined) { area = AREAS[st.start]; last = null; }
    if (st.title) { area = 'finnHouse'; last = [214, 134]; }
    if (st.expect?.area) { area = st.expect.area; last = null; }
    const pts = st.go ? [st.go] : st.path || [];
    for (const p of pts) {
      if (!area) continue;
      const t = terr(area); curArea = area;
      if (last) {
        const n = Math.ceil(Math.hypot(p[0] - last[0], p[1] - last[1]) / 4);
        for (let i = 1; i <= n; i++) {
          const x = last[0] + (p[0] - last[0]) * i / n, y = last[1] + (p[1] - last[1]) * i / n;
          if (!free(t, x, y, 6)) { console.log(`${f}: ${area} blocked between ${last} and ${p} near ${Math.round(x)},${Math.round(y)}`); bad++; break; }
        }
      }
      last = p;
    }
  }
}
console.log(bad ? `${bad} blocked segments` : 'all segments in open water');
process.exit(bad ? 1 : 0);
