// world.js: an area being explored: the player, Bubble, villagers, fish,
// friends, pickups, props and buildings; swimming, collisions, chasing,
// the camera, and drawing it all at x1 (one art pixel = one logical pixel).
import { MAPS } from './maps.js';
import { WORLD, ENEMIES, EDGE, REGULAR_KINDS, AREA_NAMES } from './config.js';
import { buildTerrain, isWater, depthAt, bankSpots, waterSpots } from './terrain.js';
import { img, hasReal } from './assets.js';
import { betta, bettaSwim, hatted, plain, fromCanvas, recolor, glow, tinted, drawFish, white } from './sprites.js';
import { pixelText, textWidth, Particles, pixelBubble } from './fx.js';
import { PLAYER } from './config.js';
import { makeRng } from './battle.js';

const terrains = new Map();
export function terrainFor(id) {
  if (!terrains.has(id)) terrains.set(id, buildTerrain(MAPS[id]));
  return terrains.get(id);
}

// Sprites for every speaker and creature, including the code-made ones.
export function spriteCanvas(key) {
  switch (key) {
    case 'kelpie': return hasReal('kelpie_gen') ? img('kelpie_gen') : recolor('seaweed', [{ from: [70, 200], to: 278, sat: 0.8, val: 1.05, minS: 0.08 }], 'kelpie');
    case 'folk1': return hasReal('folk1_gen') ? img('folk1_gen') : recolor('coral', [{ from: [330, 50], to: 185, sat: 0.9 }], 'folk1');
    case 'folk2': return hasReal('folk2_gen') ? img('folk2_gen') : recolor('reef', [{ from: [20, 70], to: 15, sat: 0.9, val: 0.95 }], 'folk2');
    case 'folk3': return hasReal('folk3_gen') ? img('folk3_gen') : recolor('bubble', [{ from: [30, 75], to: 330, sat: 0.7 }, { from: [160, 200], to: 280 }], 'folk3');
    case 'mossy': return recolor('coral', [{ from: [330, 45], to: 95, sat: 0.75, val: 0.8 }], 'mossy');
    case 'cap1': return recolor('seaweed', [{ from: [70, 200], to: 28, sat: 1.4, minS: 0.08 }], 'cap1');
    case 'cap2': return recolor('reef', [{ from: [20, 70], to: 100, sat: 0.8 }], 'cap2');
    case 'cap3': return recolor('guppy', [{ from: [300, 360], to: 48, sat: 1 }, { from: [0, 20], to: 48 }], 'cap3');
    case 'player': return null;
    default: return img(key);
  }
}
export const spriteV = (key) => fromCanvas(spriteCanvas(key));

const NPC_TALK = 'talk';

export class World {
  constructor(G) {
    this.G = G;
    this.fx = new Particles();
    this.areaId = null;
    this.t = 0;
    this.player = { x: 0, y: 0, vx: 0, vy: 0, face: 1, trail: [], bubT: 0, moving: false };
    this.bubble = { x: 0, y: 0, face: 1, vx: 0, vy: 0 };
    this.cam = { x: 0, y: 0 };
    this.safeT = 0;
    this.shake = 0;
    this.ripples = [];
    this.bumpCool = 0;
    this.triggerCool = 0;
  }

  get def() { return MAPS[this.areaId]; }
  get s() { return this.G.s; }

  // Enter an area at a named entry (or {x, y}).
  load(areaId, entry) {
    this.areaId = areaId;
    const def = MAPS[areaId];
    this.terrain = terrainFor(areaId);
    const rng = this.G.worldRng;
    const r = () => rng.next();
    const e = typeof entry === 'string' ? def.entries[entry] || Object.values(def.entries)[0] : entry;
    const p = this.player;
    p.x = e.x; p.y = e.y; p.vx = 0; p.vy = 0; p.face = e.face || 1; p.trail = [];
    this.bubble.x = p.x - 24 * p.face; this.bubble.y = p.y + 6; this.bubble.face = p.face;
    this.fx.clear(); this.ripples = [];
    this.safeT = 1.0;
    this.redHintShown = false;
    // static things
    const trng = makeRng(def.seed || 1);
    this.tufts = bankSpots(this.terrain, Math.round((def.w * def.h) / 22000), () => trng.next()).map((q) => ({ ...q, ph: trng.next() * 6 }));
    this.shimmer = waterSpots(this.terrain, Math.round((def.w * def.h) / 6000), () => trng.next(), 1, 3);
    this.reeds = [];
    for (const [cx, cy, rx, ry] of def.reeds || []) {
      const n = Math.round((rx * ry) / 700);
      for (let i = 0; i < n; i++) {
        const a = trng.next() * Math.PI * 2, d = Math.sqrt(trng.next());
        const x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d;
        if (isWater(this.terrain, x, y)) this.reeds.push({ x, y, ph: trng.next() * 6, rustle: 0 });
      }
    }
    this.fireflies = def.fireflies ? Array.from({ length: 18 }, () => ({ x: trng.next() * def.w, y: 60 + trng.next() * 380, ph: trng.next() * 6, sp: 0.5 + trng.next() })) : [];
    this.buildings = (def.buildings || []).map((b) => {
      const c = img(b.sprite);
      const w = c ? c.width : 100, h = c ? c.height : 100;
      const foot = b.arch
        ? [[b.x + 4, b.y + h - 24, 26, 22], [b.x + w - 30, b.y + h - 24, 26, 22]]
        : [[b.x + 8, b.y + h * (1 - (b.foot || 0.42)), w - 16, h * (b.foot || 0.42) - 4]];
      return { ...b, w, h, foot, base: b.y + h - 2 };
    });
    this.props = (def.props || []).map((q) => ({ ...q }));
    this.spawnAll();
    this.camSnap();
  }

  spawnAll() {
    const def = this.def, s = this.s, rng = this.G.worldRng;
    this.npcs = (def.npcs || []).filter((n) => !(n.until && s.flags[n.until])).map((n) => ({ ...n, hx: n.x, hy: n.y, t: rng.next() * 6 }));
    this.enemies = [];
    let id = 0;
    for (const sp of def.spawns || []) {
      const level = sp.edge ? EDGE.level : rng.int(sp.lv[0], sp.lv[1]);
      this.enemies.push(this.makeEnemy({ ...sp, level, id: `${this.areaId}-${id++}` }));
    }
    if (def.tutorial && !s.flags.tutorialDone) {
      this.enemies.push(this.makeEnemy({ kind: 'guppy', level: 1, x: def.tutorial.x, y: def.tutorial.y, id: 'tutorial', tutorial: true, still: true }));
    }
    // pickups
    this.pickups = [];
    for (const [x, y] of def.bites || []) this.pickups.push({ type: 'bite', x, y, ph: rng.next() * 6 });
    for (const [x, y, sid] of def.scales || []) if (!s.scales.includes(sid)) this.pickups.push({ type: 'scale', x, y, id: sid, ph: rng.next() * 6 });
    for (const [x, y, cid] of def.cogs || []) if (!s.cogs.includes(cid)) this.pickups.push({ type: 'cog', x, y, id: cid, ph: rng.next() * 6 });
    // friends in party hats (separate from spawn points), up to 6 shown
    this.friends = [];
    const native = [...new Set((def.spawns || []).map((q) => q.kind))].filter((k) => REGULAR_KINDS.includes(k));
    const pool = [];
    for (const k of native) for (let i = 0; i < Math.min(3, s.friends[k] || 0); i++) pool.push(k);
    pool.slice(0, WORLD.maxFriendsShown).forEach((k, i) => {
      const sp = def.spawns.filter((q) => q.kind === k)[i % def.spawns.filter((q) => q.kind === k).length];
      this.friends.push({ kind: k, x: sp.x + 30, y: sp.y + 20, hx: sp.x + 30, hy: sp.y + 20, tx: sp.x, ty: sp.y, face: 1, wait: rng.next() * 2, t: rng.next() * 6 });
    });
    this.extra = []; // story-placed creatures (Mossy, captives, the Gar, party guests)
    this.G.story?.populate?.(this);
  }

  makeEnemy(o) {
    const rng = this.G.worldRng;
    return { ...o, hx: o.x, hy: o.y, tx: o.x, ty: o.y, vx: 0, vy: 0, face: rng.next() < 0.5 ? -1 : 1,
      wait: rng.next() * 2, state: 'idle', chaseT: 0, cool: 0, notice: 0, t: rng.next() * 6, hidden: false };
  }

  // ---------- collisions ----------
  solids() {
    const out = [];
    for (const b of this.buildings) for (const f of b.foot) out.push(f);
    for (const g of this.def.gates || []) if (!this.s.flags[g.openIf]) out.push(g.rect);
    for (const q of this.props) {
      if (!q.solid || (q.until && this.s.flags[q.until])) continue;
      const c = img(q.sprite);
      const w = c ? c.width : 30, h = c ? c.height : 30;
      out.push([q.x - w / 2 + 4, q.y - h * 0.35, w - 8, h * 0.35]);
    }
    return out;
  }
  free(x, y, r = 6, solids = this.solids()) {
    const t = this.terrain;
    for (let a = 0; a < 8; a++) {
      const px = x + Math.cos(a * Math.PI / 4) * r, py = y + Math.sin(a * Math.PI / 4) * r;
      if (!isWater(t, px, py)) return false;
    }
    if (!isWater(t, x, y)) return false;
    for (const [rx, ry, rw, rh] of solids) {
      const cx = Math.max(rx, Math.min(x, rx + rw)), cy = Math.max(ry, Math.min(y, ry + rh));
      if (Math.hypot(x - cx, y - cy) < r) return false;
    }
    return true;
  }
  // Move a body with sliding along banks; returns whether it was blocked.
  moveBody(o, dx, dy, r, solids) {
    let blocked = false;
    const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 2) || 1;
    for (let i = 0; i < steps; i++) {
      const sx = dx / steps, sy = dy / steps;
      if (this.free(o.x + sx, o.y + sy, r, solids)) { o.x += sx; o.y += sy; continue; }
      blocked = true;
      if (sx && this.free(o.x + sx, o.y, r, solids)) o.x += sx;
      else if (sy && this.free(o.x, o.y + sy, r, solids)) o.y += sy;
    }
    return blocked;
  }
  // The head: collisions use a circle at the betta's head.
  headOf(p) { return { x: p.x + p.face * 8, y: p.y + 1 }; }

  inSafeWater() {
    const d = this.def;
    if (d.safe) return true;
    if (d.safeAbove && this.player.y < d.safeAbove) return true;
    return false;
  }
  inDeepMurk(x) { return this.def.deepBelowX && x < this.def.deepBelowX; }
  inReeds(x, y) {
    for (const [cx, cy, rx, ry] of this.def.reeds || []) if (Math.hypot((x - cx) / rx, (y - cy) / ry) < 1) return true;
    return false;
  }

  // ---------- update ----------
  update(dt, canMove) {
    this.t += dt;
    const p = this.player, s = this.s;
    const solids = this.solids();
    // swimming: 90 px/s, 0.15 s to top speed, 0.25 s to glide to a stop
    const mv = canMove ? this.G.input.moveVector() : { x: 0, y: 0 };
    const tx = mv.x * WORLD.speed, ty = mv.y * WORLD.speed;
    const acc = WORLD.speed / WORLD.accel, dec = WORLD.speed / WORLD.decel;
    const step = (v, target) => {
      const a = Math.abs(target) > Math.abs(v) || Math.sign(target) !== Math.sign(v) ? acc : dec;
      if (v < target) return Math.min(target, v + a * dt);
      return Math.max(target, v - a * dt);
    };
    p.vx = step(p.vx, tx); p.vy = step(p.vy, ty);
    if (Math.abs(mv.x) > 0.2) p.face = mv.x > 0 ? 1 : -1;
    const head = this.headOf(p);
    const body = { x: head.x, y: head.y };
    this.moveBody(body, p.vx * dt, p.vy * dt, 7, solids);
    const ddx = body.x - head.x, ddy = body.y - head.y;
    p.x += ddx; p.y += ddy;
    if (Math.abs(ddx) < Math.abs(p.vx * dt) * 0.3) p.vx *= 0.5;
    if (Math.abs(ddy) < Math.abs(p.vy * dt) * 0.3) p.vy *= 0.5;
    const speed = Math.hypot(p.vx, p.vy);
    p.moving = speed > 8;
    // the trail Bubble follows
    const last = p.trail[p.trail.length - 1];
    if (!last || Math.hypot(last.x - p.x, last.y - p.y) > 3) { p.trail.push({ x: p.x, y: p.y }); if (p.trail.length > 40) p.trail.shift(); }
    // bubbles from the player when moving
    p.bubT -= dt;
    if (p.moving && p.bubT <= 0) { p.bubT = 0.22; this.fx.bubbles(p.x - p.face * 18, p.y - 2, 1, { r: [1, 1], up: 14 }); }
    // Bubble follows
    if (s.flags.bubbleJoined) this.updateBubble(dt);
    // safe water: HP and MP refill 1 point every 2 s
    if (this.inSafeWater()) {
      this.regenT = (this.regenT || 0) + dt;
      if (this.regenT >= WORLD.regenEvery) {
        this.regenT = 0;
        if (s.hp < PLAYER.maxHp(s.level)) s.hp++;
        if (s.mp < PLAYER.maxMp(s.level)) s.mp++;
      }
    }
    this.safeT = Math.max(0, this.safeT - dt);
    this.bumpCool = Math.max(0, this.bumpCool - dt);
    this.updateNpcs(dt);
    this.updateEnemies(dt, canMove, solids);
    this.updateFriends(dt, solids);
    this.updatePickups(dt, canMove);
    // reeds and tufts: ripples where they're touched
    for (const q of [...this.reeds, ...this.tufts]) {
      if (Math.hypot(q.x - p.x, q.y - 4 - p.y) < 14) {
        q.rustle = 0.6;
        if (p.moving && Math.random() < dt * 6) this.ripples.push({ x: q.x + (Math.random() - 0.5) * 10, y: q.y - 4, r: 1, life: 0.7 });
      }
      q.rustle = Math.max(0, (q.rustle || 0) - dt);
    }
    for (const r of this.ripples) { r.r += dt * 14; r.life -= dt; }
    this.ripples = this.ripples.filter((r) => r.life > 0);
    this.fx.update(dt);
    this.shake = Math.max(0, this.shake - dt * 8);
    this.camFollow(dt);
  }

  updateBubble(dt) {
    const b = this.bubble, p = this.player;
    const tr = p.trail;
    const target = tr.length > 9 ? tr[tr.length - 9] : { x: p.x - 22 * p.face, y: p.y + 4 };
    const dx = target.x - b.x, dy = target.y - b.y, d = Math.hypot(dx, dy);
    if (d > 200) { b.x = target.x; b.y = target.y; }
    const sp = Math.min(1, dt * 6);
    b.vx = dx * sp / dt; b.vy = dy * sp / dt;
    b.x += dx * sp; b.y += dy * sp;
    if (Math.abs(dx) > 2) b.face = dx > 0 ? 1 : -1;
    else if (d < 2) b.face = p.face;
  }

  updateNpcs(dt) {
    for (const n of [...this.npcs, ...this.extra]) {
      n.t = (n.t || 0) + dt;
      if (n.walkTo) {
        const dx = n.walkTo.x - n.x, dy = n.walkTo.y - n.y, d = Math.hypot(dx, dy);
        const sp = (n.walkTo.speed || 50) * dt;
        if (d <= sp) { n.x = n.walkTo.x; n.y = n.walkTo.y; const done = n.walkTo.done; n.walkTo = null; done?.(); }
        else { n.x += (dx / d) * sp; n.y += (dy / d) * sp; if (Math.abs(dx) > 1) n.face = dx > 0 ? 1 : -1; }
      }
    }
  }

  updateEnemies(dt, canMove, solids) {
    const p = this.player, s = this.s, rng = this.G.worldRng, def = this.def;
    for (const e of this.enemies) {
      e.t += dt;
      e.cool = Math.max(0, e.cool - dt);
      e.notice = Math.max(0, e.notice - dt);
      const dx = p.x - e.x, dy = p.y - e.y, dist = Math.hypot(dx, dy);
      e.hidden = !!def.reeds && this.inReeds(e.x, e.y) && dist > WORLD.reedReveal;
      const chases = (def.chase || (this.inDeepMurk(e.hx) && e.deep) || (e.edge && def.dark)) && !e.still;
      let vx = 0, vy = 0;
      if (this.safeT > 0 && dist < 140 && !e.still) {
        // after a battle: nearby fish swim away
        vx = -dx / (dist || 1) * 40; vy = -dy / (dist || 1) * 40; e.state = 'idle'; e.wait = 0.5;
      } else if (e.state === 'chase') {
        e.chaseT -= dt;
        if (e.chaseT <= 0 || !canMove) { e.state = 'return'; e.cool = 3; }
        else { const sp = WORLD.speed * WORLD.chaseSpeed; vx = dx / (dist || 1) * sp; vy = dy / (dist || 1) * sp; }
      } else if (chases && canMove && !e.hidden && e.cool <= 0 && dist < WORLD.noticeRange) {
        e.state = 'chase'; e.chaseT = WORLD.chaseTime; e.notice = 0.8;
        this.G.sfx('notice', { vol: 0.6 });
      } else if (e.state === 'return') {
        const hx = e.hx - e.x, hy = e.hy - e.y, hd = Math.hypot(hx, hy);
        if (hd < 4) e.state = 'idle'; else { vx = hx / hd * 30; vy = hy / hd * 30; }
      } else if (!e.still) {
        if (e.state === 'idle') {
          e.wait -= dt;
          if (e.wait <= 0) {
            const a = rng.next() * Math.PI * 2, r = 20 + rng.next() * 50;
            e.tx = e.hx + Math.cos(a) * r; e.ty = e.hy + Math.sin(a) * r * 0.6;
            e.state = 'swim';
          }
        } else if (e.state === 'swim') {
          const tx = e.tx - e.x, ty = e.ty - e.y, td = Math.hypot(tx, ty);
          if (td < 3) { e.state = 'idle'; e.wait = 1 + rng.next() * 2.5; }
          else { vx = tx / td * 22; vy = ty / td * 22; }
        }
      }
      e.vx = vx; e.vy = vy;
      if (vx || vy) {
        const blocked = this.moveBody(e, vx * dt, vy * dt, 6, solids);
        if (Math.abs(vx) > 2) e.face = vx > 0 ? 1 : -1;
        if (blocked && e.state === 'swim') { e.state = 'idle'; e.wait = 0.5 + rng.next(); }
      }
      // touch: battle
      if (canMove && this.safeT <= 0 && !e.hidden && dist < 20) {
        this.G.startBattle({ enemy: e });
        return;
      }
      // the first red-glowing fish on screen
      if (!this.redHintShown && this.isRed(e) && this.onScreen(e.x, e.y)) {
        this.redHintShown = true;
        this.G.hintOnce('redGlow');
      }
    }
  }
  isRed(e) { return e.level > this.s.level + WORLD.redGlowGap; }
  onScreen(x, y) { const v = this.G.view; return x > this.cam.x && x < this.cam.x + v.W && y > this.cam.y && y < this.cam.y + v.H; }

  updateFriends(dt, solids) {
    const rng = this.G.worldRng;
    for (const f of this.friends) {
      f.t += dt;
      f.wait -= dt;
      if (f.wait > 0) continue;
      const dx = f.tx - f.x, dy = f.ty - f.y, d = Math.hypot(dx, dy);
      if (d < 3) {
        const a = rng.next() * Math.PI * 2, r = 15 + rng.next() * 40;
        f.tx = f.hx + Math.cos(a) * r; f.ty = f.hy + Math.sin(a) * r * 0.6; f.wait = 1 + rng.next() * 2;
      } else {
        const b = this.moveBody(f, dx / d * 18 * dt, dy / d * 18 * dt, 6, solids);
        if (Math.abs(dx) > 1) f.face = dx > 0 ? 1 : -1;
        if (b) { f.tx = f.hx; f.ty = f.hy; f.wait = 1; }
      }
    }
  }

  updatePickups(dt, canMove) {
    const p = this.player;
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const q = this.pickups[i];
      q.ph += dt;
      if (canMove && Math.hypot(q.x - p.x, q.y - p.y) < 16) {
        this.pickups.splice(i, 1);
        this.G.collect(q);
        this.fx.sparks(q.x, q.y, 8, q.type === 'bite' ? '#F7C948' : '#9FD8E0', 1, 40);
      }
    }
  }

  // What's in reach to talk to / use: {kind, ref, x, y, label}
  interactTarget() {
    const p = this.player;
    let best = null, bd = WORLD.talkRange;
    const consider = (kind, ref, x, y, r = WORLD.talkRange) => {
      const d = Math.hypot(x - p.x, y - p.y);
      if (d < r && d < bd + (r - WORLD.talkRange)) { bd = d; best = { kind, ref, x, y }; }
    };
    for (const n of this.npcs) consider('npc', n, n.x, n.y);
    for (const n of this.extra) if (n.talk) consider('extra', n, n.x, n.y, n.talkRange || WORLD.talkRange);
    for (const f of this.friends) consider('friend', f, f.x, f.y, 26);
    if (this.s.flags.bubbleJoined) consider('bubble', null, this.bubble.x, this.bubble.y, 22);
    for (const g of this.def.gates || []) {
      if (!g.talk || this.s.flags[g.openIf]) continue;
      const [x, y, w, h] = g.rect;
      const cx = Math.max(x, Math.min(p.x, x + w)), cy = Math.max(y, Math.min(p.y, y + h));
      const d = Math.hypot(cx - p.x, cy - p.y);
      if (d < 26 && d < bd) { bd = d; best = { kind: 'gate', ref: g, x: x + w / 2, y: y }; }
    }
    return best;
  }

  // ---------- camera ----------
  camTarget() {
    const v = this.G.view, p = this.player;
    const yk = this.G.input.isTouch ? 0.42 : 0.5;
    let x = p.x - v.W / 2, y = p.y - v.H * yk;
    const def = this.def;
    x = def.w <= v.W ? (def.w - v.W) / 2 : Math.max(0, Math.min(def.w - v.W, x));
    y = def.h <= v.H ? (def.h - v.H) / 2 : Math.max(0, Math.min(def.h - v.H, y));
    return { x, y };
  }
  camSnap() { const t = this.camTarget(); this.cam.x = t.x; this.cam.y = t.y; }
  camFollow(dt) {
    const t = this.camTarget(), k = Math.min(1, dt * 8);
    this.cam.x += (t.x - this.cam.x) * k; this.cam.y += (t.y - this.cam.y) * k;
  }

  // ---------- drawing ----------
  draw(ctx) {
    const v = this.G.view, s = this.s, t = this.t;
    let cx = Math.round(this.cam.x), cy = Math.round(this.cam.y);
    if (this.shake > 0) { cx += Math.round((Math.random() - 0.5) * this.shake * 4); cy += Math.round((Math.random() - 0.5) * this.shake * 4); }
    ctx.fillStyle = '#123a66';
    ctx.fillRect(0, 0, v.W, v.H);
    ctx.drawImage(this.terrain.canvas, -cx, -cy);
    ctx.save();
    ctx.translate(-cx, -cy);
    // shimmer: sparse 1 px highlights that drift
    ctx.fillStyle = 'rgba(207,244,255,0.55)';
    for (const q of this.shimmer) {
      const k = Math.sin(t * 1.3 + q.ph);
      if (k < 0.75) continue;
      const x = Math.round(q.x + Math.sin(t * 0.3 + q.ph) * 6);
      ctx.fillRect(x, q.y, k > 0.93 ? 3 : 2, 1);
    }
    for (const r of this.ripples) {
      ctx.globalAlpha = Math.min(1, r.life * 2);
      pixelBubble(ctx, r.x, r.y, Math.max(2, Math.round(r.r)), '#CFF4FF');
    }
    ctx.globalAlpha = 1;
    // floor things: pickups, lily pads under fish
    for (const q of this.pickups) this.drawPickup(ctx, q);
    // everything that stands, sorted by its base
    const list = [];
    for (const b of this.buildings) list.push({ y: b.base, d: () => ctx.drawImage(img(b.sprite), b.x, b.y) });
    for (const q of this.props) {
      if (q.until && s.flags[q.until]) continue;
      const c = img(q.sprite); if (!c) continue;
      const flat = q.sprite === 'p_lily' || q.sprite === 'p_lip';
      list.push({ y: flat ? -1e6 + q.y : q.y, d: () => {
        if (q.dark) { ctx.filter = 'brightness(0.55)'; }
        ctx.drawImage(c, Math.round(q.x - c.width / 2), Math.round(q.y - c.height));
        ctx.filter = 'none';
      } });
    }
    const tuft = img('tuft');
    if (tuft) for (const q of this.tufts) list.push({ y: q.y, d: () => this.drawSwayRows(ctx, tuft, q.x, q.y, Math.sin(t * 1.6 + q.ph) * 1.5 + (q.rustle ? Math.sin(t * 20) * 1.5 : 0)) });
    const reed = img('p_reeds');
    if (reed) for (const q of this.reeds) list.push({ y: q.y + 6, d: () => this.drawSwayRows(ctx, reed, q.x, q.y + 6, Math.sin(t * 1.4 + q.ph) * 1.5 + (q.rustle ? Math.sin(t * 22) * 1.5 : 0)) });
    for (const g of this.def.gates || []) if (!s.flags[g.openIf]) list.push({ y: g.rect[1] + g.rect[3], d: () => this.drawGate(ctx, g) });
    for (const n of this.npcs) list.push({ y: n.y + 10, d: () => this.drawNpc(ctx, n) });
    for (const n of this.extra) if (!n.hidden) list.push({ y: n.y + (n.sortOff || 10), d: () => (n.draw ? n.draw(ctx, n, t) : this.drawNpc(ctx, n)) });
    for (const f of this.friends) list.push({ y: f.y + 8, d: () => drawFish(ctx, hatted(f.kind), f.x, f.y, { flip: f.face < 0, sway: Math.sin(f.t * 5) * 1, bob: Math.round(Math.sin(f.t * 2)) }) });
    for (const e of this.enemies) if (!e.hidden || !this.def.reeds) list.push({ y: e.y + 8, d: () => this.drawEnemy(ctx, e) });
    if (s.flags.bubbleJoined) list.push({ y: this.bubble.y + 8, d: () => this.drawBubble(ctx) });
    list.push({ y: this.player.y + 9, d: () => this.drawPlayer(ctx) });
    list.sort((a, b) => a.y - b.y);
    for (const it of list) it.d();
    this.fx.draw(ctx);
    // fireflies over Highwater
    for (const f of this.fireflies) {
      const k = Math.sin(t * 2 * f.sp + f.ph);
      if (k < 0) continue;
      const x = Math.round(f.x + Math.sin(t * 0.5 + f.ph) * 20), y = Math.round(f.y + Math.cos(t * 0.7 + f.ph) * 10);
      ctx.fillStyle = k > 0.6 ? '#FFF6A8' : '#C9D86A';
      ctx.fillRect(x, y, 1, 1);
      if (k > 0.8) { ctx.globalAlpha = 0.35; ctx.fillRect(x - 1, y, 3, 1); ctx.fillRect(x, y - 1, 1, 3); ctx.globalAlpha = 1; }
    }
    ctx.restore();
    this.drawLight(ctx, cx, cy);
    if (this.def.dark) this.drawDark(ctx, cx, cy);
    // tags over fish (after the dark, so levels always show)
    ctx.save(); ctx.translate(-cx, -cy);
    for (const e of this.enemies) this.drawTag(ctx, e);
    const it = this.G.canTalkNow?.() ? this.interactTarget() : null;
    if (it) this.drawTalkMark(ctx, it);
    ctx.restore();
  }

  drawSwayRows(ctx, c, x, y, amt) {
    const h = c.height, x0 = Math.round(x - c.width / 2), y0 = Math.round(y - h);
    for (let r = 0; r < h; r += 2) {
      const k = 1 - r / h;
      ctx.drawImage(c, 0, r, c.width, 2, x0 + Math.round(amt * k * k), y0 + r, c.width, 2);
    }
  }

  drawGate(ctx, g) {
    const [x, y, w, h] = g.rect;
    if (g.look === 'none') return;
    if (g.look === 'dark') {
      ctx.fillStyle = '#05101c'; ctx.fillRect(x, y, w, h);
      return;
    }
    if (g.look === 'weave') {
      for (let i = 0; i < w; i += 6) { ctx.fillStyle = '#2A1A12'; ctx.fillRect(x + i, y, 4, h); ctx.fillStyle = '#C9A24A'; ctx.fillRect(x + i + 1, y, 2, h); }
      for (let j = 4; j < h; j += 10) { ctx.fillStyle = '#2A1A12'; ctx.fillRect(x, y + j, w, 4); ctx.fillStyle = '#E8C552'; ctx.fillRect(x, y + j + 1, w, 2); }
      return;
    }
    // reed bars
    for (let i = 0; i < h; i += 7) {
      ctx.fillStyle = '#2A1A12'; ctx.fillRect(x, y + i, w, 5);
      ctx.fillStyle = '#5B8C3A'; ctx.fillRect(x, y + i + 1, w, 3);
      ctx.fillStyle = '#7DB04E'; ctx.fillRect(x, y + i + 1, w, 1);
    }
  }

  drawNpc(ctx, n) {
    const v = spriteV(n.sprite);
    if (!v) return;
    const hat = n.hat ? hatted(n.sprite, v.canvas) : v;
    drawFish(ctx, hat, n.x, n.y, { flip: (n.face || 1) < 0, sway: Math.sin(n.t * 3) * 0.8, bob: Math.round(Math.sin(n.t * 1.7) * 1), scale: 1 });
  }

  playerSprite() {
    const s = this.s;
    return betta(PLAYER.armorStage(s.level), s.color, s.wearHat);
  }
  drawPlayer(ctx) {
    const p = this.player;
    let v = this.playerSprite();
    const sp = Math.hypot(p.vx, p.vy);
    let sway = Math.sin(this.t * (p.moving ? 14 : 5)) * (p.moving ? 1.6 : 0.8);
    if (p.moving && PLAYER.armorStage(this.s.level) === 0 && !this.s.wearHat) {
      const f = bettaSwim([0, 1, 0, 3][Math.floor(this.t * 9) % 4], this.s.color);
      if (f) { v = f; sway = 0; }
    }
    const tilt = Math.max(-0.08, Math.min(0.08, (p.vy / WORLD.speed) * 0.08)) * (p.face < 0 ? -1 : 1);
    drawFish(ctx, v, p.x, p.y, { flip: p.face < 0, sway, tilt, bob: sp < 8 ? Math.round(Math.sin(this.t * 2.2)) : 0 });
  }
  drawBubble(ctx) {
    const b = this.bubble, v = plain('bubble');
    const mv = Math.hypot(b.vx || 0, b.vy || 0) > 8;
    drawFish(ctx, v, b.x, b.y, { flip: b.face < 0, sway: Math.sin(this.t * (mv ? 14 : 5)) * 1, bob: Math.round(Math.sin(this.t * 2.6 + 1)) });
  }
  enemySprite(e) {
    let v = plain(ENEMIES[e.kind].sprite);
    if (!v) return null;
    if (e.edge) v = tinted(v, '#7B3FD0', 0.35);
    return v;
  }
  drawEnemy(ctx, e) {
    let v = this.enemySprite(e);
    if (!v) return;
    const dark = this.def.dark && Math.hypot(e.x - this.player.x, e.y - this.player.y) > WORLD.lanternRadius;
    if (dark) return; // eyes are drawn over the darkness
    const opts = { flip: e.face < 0, sway: Math.sin(e.t * (e.vx || e.vy ? 12 : 5)) * 1.2, bob: Math.round(Math.sin(e.t * 2)) };
    if (e.edge) {
      const pulse = (Math.sin(this.t * 3) + 1) / 2;
      ctx.globalAlpha = 0.4 + pulse * 0.6; drawFish(ctx, glow(v, '#B57BFF'), e.x, e.y, opts); ctx.globalAlpha = 1;
    } else if (this.isRed(e)) {
      const pulse = (Math.sin(this.t * 4) + 1) / 2;
      ctx.globalAlpha = 0.5 + pulse * 0.5; drawFish(ctx, glow(v, '#FF3B3B'), e.x, e.y, opts); ctx.globalAlpha = 1;
    }
    drawFish(ctx, v, e.x, e.y, opts);
  }
  drawTag(ctx, e) {
    if (e.hidden) {
      // the reeds rustle where a fish hides
      for (const q of this.reeds) if (Math.hypot(q.x - e.x, q.y - e.y) < 22) q.rustle = 0.3;
      return;
    }
    const v = this.enemySprite(e);
    const h = v ? v.bh : 20;
    const dark = this.def.dark && Math.hypot(e.x - this.player.x, e.y - this.player.y) > WORLD.lanternRadius;
    if (dark) {
      // two glinting eyes in the dark
      const ex = Math.round(e.x + e.face * (v ? v.bw * 0.3 : 8)), ey = Math.round(e.y - 3);
      const blink = Math.sin(this.t * 1.7 + e.hx) > -0.95;
      if (blink) {
        ctx.fillStyle = e.edge ? '#D9B0FF' : this.isRed(e) ? '#FF8080' : '#F7F0B0';
        ctx.fillRect(ex, ey, 1, 1); ctx.fillRect(ex + e.face * 3, ey, 1, 1);
      }
    }
    const str = 'Lv' + e.level;
    const col = e.edge ? '#D9B0FF' : this.isRed(e) ? '#FF7070' : '#FFFFFF';
    pixelText(ctx, str, Math.round(e.x - textWidth(str) / 2), Math.round(e.y - h / 2 - 9), col);
    if (e.notice > 0) pixelText(ctx, '!', Math.round(e.x - 1), Math.round(e.y - h / 2 - 17), '#F7C948');
  }
  drawPickup(ctx, q) {
    const key = q.type === 'bite' ? 'i_bite' : q.type === 'scale' ? 'i_scale' : 'i_cog';
    const c = img(key); if (!c) return;
    const bob = Math.round(Math.sin(q.ph * 2.5) * 1.5);
    const x = Math.round(q.x - c.width / 2), y = Math.round(q.y - c.height / 2 + bob);
    if (q.type !== 'bite') {
      // a soft glint so story items read from afar
      const k = (Math.sin(q.ph * 3) + 1) / 2;
      ctx.globalAlpha = 0.25 + k * 0.35;
      ctx.drawImage(glow(fromCanvas(c), q.type === 'scale' ? '#9FD8E0' : '#F7C948').canvas, x - 2, y - 2);
      ctx.globalAlpha = 1;
    }
    ctx.drawImage(c, x, y);
    if (Math.sin(q.ph * 2) > 0.92) { ctx.fillStyle = '#ffffff'; ctx.fillRect(x + c.width - 2, y, 1, 3); ctx.fillRect(x + c.width - 3, y + 1, 3, 1); }
  }
  drawTalkMark(ctx, it) {
    const x = Math.round(it.x), y = Math.round(it.y - 28 + Math.sin(this.t * 4) * 1.5);
    ctx.fillStyle = '#2A1A12'; ctx.fillRect(x - 5, y - 6, 11, 12);
    ctx.fillStyle = '#F7C948'; ctx.fillRect(x - 4, y - 5, 9, 10);
    ctx.fillStyle = '#2A1A12'; ctx.fillRect(x, y - 3, 1, 4); ctx.fillRect(x, y + 2, 1, 1);
    ctx.fillRect(x - 1, y + 6, 3, 1); ctx.fillRect(x, y + 7, 1, 1);
  }

  // Light shafts drifting through the water (screen space, slow).
  drawLight(ctx, cx, cy) {
    const v = this.G.view, t = this.t;
    if (this.def.dark) return;
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = '#FFF1B0';
    for (let i = 0; i < 5; i++) {
      const base = ((i * 197 - cx * 0.35 + t * 6) % (v.W + 300) + v.W + 300) % (v.W + 300) - 150;
      const w = 18 + (i % 3) * 10;
      ctx.beginPath();
      ctx.moveTo(base, 0); ctx.lineTo(base + w, 0); ctx.lineTo(base + w - v.H * 0.45, v.H); ctx.lineTo(base - v.H * 0.45, v.H);
      ctx.fill();
    }
    ctx.restore();
  }

  // The Murk: darkness outside the lantern's light (stepped rings).
  drawDark(ctx, cx, cy) {
    const v = this.G.view;
    if (!this.darkCv || this.darkCv.width !== v.W || this.darkCv.height !== v.H) {
      this.darkCv = document.createElement('canvas'); this.darkCv.width = v.W; this.darkCv.height = v.H;
    }
    const g = this.darkCv.getContext('2d');
    g.globalCompositeOperation = 'source-over';
    g.clearRect(0, 0, v.W, v.H);
    g.fillStyle = 'rgba(2,8,18,0.86)';
    g.fillRect(0, 0, v.W, v.H);
    g.globalCompositeOperation = 'destination-out';
    const px = Math.round(this.player.x - cx), py = Math.round(this.player.y - cy);
    const R = WORLD.lanternRadius + Math.round(Math.sin(this.t * 3) * 1);
    for (const [r, a] of [[R, 0.45], [R - 14, 0.75], [R - 34, 1]]) {
      g.fillStyle = `rgba(0,0,0,${a})`;
      g.beginPath(); g.arc(px, py, r, 0, Math.PI * 2); g.fill();
    }
    ctx.drawImage(this.darkCv, 0, 0);
    // the lantern's warm glow
    ctx.save();
    ctx.globalAlpha = 0.08; ctx.fillStyle = '#C9F56A';
    ctx.beginPath(); ctx.arc(px, py, R - 34, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

export { AREA_NAMES };
