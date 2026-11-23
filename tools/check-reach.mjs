#!/usr/bin/env node
// check-reach.mjs: for every area and room, flood-fills where the betta's head can
// swim (terrain + building footprints + room furniture + solid props, the player's
// 7 px radius; gates counted open) from the area's entries, then checks:
//  - every Betta Bite, scale and cog can be collected (within 16 px),
//  - every villager can be talked to (their talk range) and every look spot (30 px),
//  - every building door's zone can be swum into, every exit can be reached,
//  - every entry is free, and clear of every exit's 16 px slack (no bounce-back).
globalThis.document = { createElement: () => ({ getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) }) };
const { buildTerrain, isWater } = await import('../game/src/terrain.js');
const { MAPS } = await import('../game/src/maps.js');
const { WORLD } = await import('../game/src/config.js');
const { readFileSync } = await import('node:fs');
// building and prop sizes: the placeholder sizes in assets.js match the art
const src = readFileSync(new URL('../game/src/assets.js', import.meta.url), 'utf8');
const SIZE = {};
for (const m of src.matchAll(/(\w+): \[\[[^\]]*\], \{ w: (\d+), h: (\d+)/g)) SIZE[m[1]] = [+m[2], +m[3]];
const R = 7, STEP = 4;
let bad = 0;
const report = (ok, what) => { if (!ok) bad++; if (!ok || process.argv.includes('-v')) console.log(`${ok ? 'ok  ' : 'BAD '} ${what}`); };
for (const [area, def] of Object.entries(MAPS)) {
  const t = buildTerrain(def);
  const solids = [];
  for (const b of def.buildings || []) {
    const [w, h] = SIZE[b.sprite] || [100, 100];
    if (b.pass) continue;
    if (b.arch) solids.push([b.x + 4, b.y + h - 24, 26, 22], [b.x + w - 30, b.y + h - 24, 26, 22]);
    else solids.push([b.x + 8, b.y + h * (1 - (b.foot || 0.42)), w - 16, h * (b.foot || 0.42) - 4]);
  }
  for (const r of def.solid || []) solids.push(r);
  for (const q of def.props || []) if (q.solid) { const [w, h] = SIZE[q.sprite] || [30, 30]; solids.push([q.x - w / 2 + 4, q.y - h * 0.35, w - 8, h * 0.35]); }
  const hitRect = (x, y, [rx, ry, rw, rh]) => Math.hypot(Math.max(rx - x, 0, x - rx - rw), Math.max(ry - y, 0, y - ry - rh)) < R;
  const free = (x, y) => isWater(t, x, y) && [...Array(8)].every((_, k) => isWater(t, x + Math.cos(k * Math.PI / 4) * R, y + Math.sin(k * Math.PI / 4) * R)) && !solids.some((s) => hitRect(x, y, s));
  const gw = Math.ceil(t.W / STEP), gh = Math.ceil(t.H / STEP), seen = new Uint8Array(gw * gh), q = [];
  for (const [name, e] of Object.entries(def.entries || {})) {
    const hx = e.x + (e.face || 1) * 8, ok = free(hx, e.y);
    report(ok, `${area} entry ${name} at ${e.x},${e.y} is free`);
    for (const ex of def.exits || []) {
      const [x, y, w, h] = ex.rect;
      report(!(e.x >= x - 16 && e.x <= x + w + 16 && e.y >= y - 16 && e.y <= y + h + 16), `${area} entry ${name} is clear of the exit to ${ex.to}`);
    }
    const cx = Math.round(hx / STEP), cy = Math.round(e.y / STEP);
    if (ok && !seen[cy * gw + cx]) { seen[cy * gw + cx] = 1; q.push([cx, cy]); }
  }
  while (q.length) {
    const [cx, cy] = q.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= gw || ny >= gh || seen[ny * gw + nx] || !free(nx * STEP, ny * STEP)) continue;
      seen[ny * gw + nx] = 1; q.push([nx, ny]);
    }
  }
  // the head is 8 px ahead of the body centre, either way it faces
  const within = (x, y, r) => {
    for (let cy = Math.floor((y - r - 8) / STEP); cy <= Math.ceil((y + r + 8) / STEP); cy++)
      for (let cx = Math.floor((x - r - 8) / STEP); cx <= Math.ceil((x + r + 8) / STEP); cx++) {
        if (cx < 0 || cy < 0 || cx >= gw || cy >= gh || !seen[cy * gw + cx]) continue;
        for (const f of [-8, 8]) if (Math.hypot(cx * STEP - f - x, cy * STEP - y) < r - 1) return true;
      }
    return false;
  };
  const inRect = ([x, y, w, h], m = 0, head = false) => {
    for (let cy = Math.floor((y - m) / STEP); cy <= Math.ceil((y + h + m) / STEP); cy++)
      for (let cx = Math.floor((x - m - 8) / STEP); cx <= Math.ceil((x + w + m + 8) / STEP); cx++) {
        if (cx < 0 || cy < 0 || cx >= gw || cy >= gh || !seen[cy * gw + cx]) continue;
        for (const f of head ? [0] : [-8, 8]) { const px = cx * STEP - f, py = cy * STEP; if (px >= x - m && px <= x + w + m && py >= y - m && py <= y + h + m) return true; }
      }
    return false;
  };
  for (const [kind, list] of [['bite', def.bites], ['scale', def.scales], ['cog', def.cogs]])
    for (const [x, y, id] of list || []) report(within(x, y, 16), `${area} ${kind}${id ? ' ' + id : ''} at ${x},${y} can be collected`);
  for (const n of def.npcs || []) report(within(n.x, n.y, n.talkRange || WORLD.talkRange), `${area} ${n.id} can be talked to`);
  for (const l of def.looks || []) report(within(l.x, l.y, 30), `${area} look ${l.id} can be reached`);
  for (const b of def.buildings || []) for (const dx of b.doors || []) {
    const [, h] = SIZE[b.sprite] || [100, 100], fb = b.y + h - 4;
    report(inRect([b.x + dx - 14, fb - 2, 28, 22], 0, true), `${area} door into ${b.to} at x ${b.x + dx} can be swum into`);
    report(!!MAPS[b.to], `${area} door leads to a room (${b.to})`);
  }
  for (const ex of def.exits || []) report(inRect(ex.rect, 16) || ex.rect[0] < 0 || ex.rect[1] < 0 || ex.rect[0] + ex.rect[2] > def.w || ex.rect[1] + ex.rect[3] > def.h, `${area} exit to ${ex.to} can be reached`);
  for (const ex of def.exits || []) report(!!MAPS[ex.to]?.entries?.[ex.entry], `${area} exit to ${ex.to} lands at a real entry (${ex.entry})`);
}
console.log(bad ? `${bad} problems` : 'all reachable');
process.exit(bad ? 1 : 0);
