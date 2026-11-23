#!/usr/bin/env node
// check-pickups.mjs: every placed pickup (Betta Bites, scales, cogs) must sit
// where the player can swim close enough to collect it (16 px), in water
// reachable from the area's entries (terrain with the player's radius).
globalThis.document = { createElement: () => ({ getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) }) };
const { buildTerrain, isWater } = await import('../game/src/terrain.js');
const { MAPS } = await import('../game/src/maps.js');
const R = 7, STEP = 4, REACH = 16;
let bad = 0;
for (const [area, def] of Object.entries(MAPS)) {
  const t = buildTerrain(def);
  const free = (x, y) => isWater(t, x, y) && [...Array(8)].every((_, k) => isWater(t, x + Math.cos(k * Math.PI / 4) * R, y + Math.sin(k * Math.PI / 4) * R));
  const gw = Math.ceil(t.W / STEP), gh = Math.ceil(t.H / STEP), seen = new Uint8Array(gw * gh), q = [];
  for (const e of Object.values(def.entries || {})) {
    const cx = Math.round(e.x / STEP), cy = Math.round(e.y / STEP);
    if (free(cx * STEP, cy * STEP) && !seen[cy * gw + cx]) { seen[cy * gw + cx] = 1; q.push([cx, cy]); }
  }
  while (q.length) {
    const [cx, cy] = q.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= gw || ny >= gh || seen[ny * gw + nx] || !free(nx * STEP, ny * STEP)) continue;
      seen[ny * gw + nx] = 1; q.push([nx, ny]);
    }
  }
  const ok = (x, y) => {
    for (let cy = Math.floor((y - REACH) / STEP); cy <= Math.ceil((y + REACH) / STEP); cy++)
      for (let cx = Math.floor((x - REACH) / STEP); cx <= Math.ceil((x + REACH) / STEP); cx++)
        if (cx >= 0 && cy >= 0 && cx < gw && cy < gh && seen[cy * gw + cx] && Math.hypot(cx * STEP - x, cy * STEP - y) < REACH - 1) return true;
    return false;
  };
  for (const [kind, list] of [['bite', def.bites], ['scale', def.scales], ['cog', def.cogs]])
    for (const [x, y, id] of list || []) {
      const good = ok(x, y);
      if (!good) bad++;
      console.log(`${good ? 'ok  ' : 'BAD '} ${area} ${kind}${id ? ' ' + id : ''} at ${x},${y}${good ? '' : isWater(t, x, y) ? ' (water, but cut off)' : ' (on land)'}`);
    }
}
console.log(bad ? `${bad} unreachable` : 'all reachable');
process.exit(bad ? 1 : 0);
