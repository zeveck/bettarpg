#!/usr/bin/env node
// sim-battles.mjs: runs the design's tuning table (GAME_DESIGN.md, "Tuning
// targets") through the game's own battle rules (game/src/battle.js and
// config.js), with the design simulator's player policy, 4,000 fights a row.
// Then runs tools/sim_design.py and checks each row matches it within 3
// points (win %, friend %, HP left %). Exits 1 if a target is missed or a row
// differs by more than 3 points.
//
//   node tools/sim-battles.mjs            (both, compared)
//   node tools/sim-battles.mjs --no-compare
import { Battle, makeEnemy, makeRng } from '../game/src/battle.js';
import { PLAYER, garFor } from '../game/src/config.js';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));

function crc32(str) {
  let c, crc = 0xFFFFFFFF;
  for (let n = 0; n < str.length; n++) {
    c = (crc ^ str.charCodeAt(n)) & 0xFF;
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xEDB88320 : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function fight(rng, { kind, el, L, bubble = true, kelp = 0, seed = 0, bw = 0, edge = false, mpFrac = 1,
  sub = false, friends = 0, party = false, befriend = false, stump = false, gar = null, meter0 = 0 }) {
  const hpMax = PLAYER.maxHp(L), mpMax = PLAYER.maxMp(L);
  // New Game+ rows: the Gar's row comes from garFor(k, lastEnding, carried); edge fish are Level 10 + k
  const k = edge ? el - 10 : 0;
  const g = gar ? { ...gar, meter0 } : (meter0 ? { ...garFor(0), meter0 } : undefined);
  const enemy = makeEnemy(kind, el, edge, { k, gar: g });
  const b = new Battle({
    player: { name: 'Sim', level: L, hp: hpMax, mp: Math.floor(mpMax * mpFrac),
      items: { kelp, seedcake: seed, bwater: bw, fizzy: 0 }, subOwned: sub, dived: sub, friends },
    enemy, bubble, hbtLearned: !stump, scripted: stump ? 'stump' : null, rng,
  });
  b.start();
  let mpUsed = 0;
  const bonus = PLAYER.bonus(L);
  const nipMax = bubble ? 5 + Math.floor(L / 2) : 0;
  while (!b.over) {
    const p = b.p, e = b.e;
    const turn = b.turn + 1;
    // The policy (the design's "Simulator rules"), first that applies.
    const warned = kind === 'gar' && (b.gturn + 1) % 3 === 0 && !p.dived;
    const lethal = warned && p.hp <= b.hitFor(e.special ?? 30);
    let action;
    const fightMove = () => {
      if (p.mp >= 5 && L >= 4 && (kind === 'cat' || kind === 'cray' || e.net > 0 || e.hp > 12)) return ['gravelGrenade', 5, 15 + bonus];
      if (p.mp >= 3) return ['bubbleBlast', 3, 12 + bonus];
      return ['attack', 0, 10 + bonus];
    };
    if ((p.items.seedcake || p.items.kelp) && p.hp < p.hpMax && (p.hp <= 0.35 * p.hpMax || lethal)) {
      action = p.items.seedcake ? 'item:seedcake' : 'item:kelp';
    } else if (party) {
      if (turn === 1 || p.mp >= 5) action = 'party';
      else if (p.items.bwater) action = 'item:bwater';
      else action = 'attack';
    } else if (b.tangled) {
      action = 'attack';                       // Tangled: Attack or an item only
    } else if (stump && b.stumpLit) {
      action = 'party';
    } else {
      let [m, cost, mx] = fightMove();
      if (befriend && cost && p.mp - cost < 5) [m, cost, mx] = ['attack', 0, 10 + bonus];
      if (befriend && p.mp >= 5 && !(e.net > 0) && (e.hp <= e.hpMax / 2 || e.hp <= mx + nipMax)) action = 'party';
      else action = m;
    }
    const can = b.can(action);
    if (!can.ok) action = 'attack';
    if (action === 'gravelGrenade') mpUsed += 5;
    else if (action === 'bubbleBlast') mpUsed += 3;
    else if (action === 'party' && !can.free) mpUsed += 5;
    b.act(action);
    if (b.over === 'friend' && action === 'party' && kind !== 'gar' && !stump) mpUsed -= 5;
    if (!b.over && b.turn > 80) b.over = 'lose';
  }
  const ok = b.over !== 'lose';
  return { result: b.over, turns: b.turn, hp: ok ? b.p.hp / b.p.hpMax : 0, mp: mpUsed };
}

const ROWS = [];
const row = (name, target, check, kw) => ROWS.push({ name, target, check, kw });
const lim = (lo, hi) => (v) => v >= lo && v <= hi;
row('Guppy L1-2 vs L1 (full)', 'win >= 99%, 2-3 turns', (s) => s.win >= .99 && lim(2, 3.2)(s.turns), { kind: 'guppy', el: 2, L: 1, bubble: false });
row('Angelfish L2 vs L1 (full)', 'win >= 80%', (s) => s.win >= .8, { kind: 'angel', el: 2, L: 1, bubble: false });
row('Old Stump: Angelfish L2 vs L1 B, scripted', 'reach the cast >= 97%', (s) => s.friend >= .97, { kind: 'angel', el: 2, L: 1, stump: true, mpFrac: 0 });
row('Catfish L5 vs L4 B (half)', 'win >= 90%, 3-5 turns, 35-70% HP', (s) => s.win >= .9 && lim(3, 5)(s.turns) && lim(.35, .7)(s.hp), { kind: 'cat', el: 5, L: 4, mpFrac: .5 });
row('Nymph L5 vs L4 B (half)', 'win >= 90%, 3-5 turns, 35-70% HP', (s) => s.win >= .9 && lim(3, 5)(s.turns) && lim(.35, .7)(s.hp), { kind: 'nymph', el: 5, L: 4, mpFrac: .5 });
let fightRow = null;
row('Reedwater FIGHT: Catfish L4 vs L4 B (half)', 'win >= 97% (baseline)', (s) => { fightRow = s; return s.win >= .97; }, { kind: 'cat', el: 4, L: 4, mpFrac: .5 });
const bef = (minfr) => (s) => s.friend >= minfr && s.win >= .97 && s.hp >= fightRow.hp - .05 && s.mp <= fightRow.mp;
row('Reedwater BEFRIEND: Catfish L4 vs L4 B, 0 friends (half)', 'friend >= 45%, friend-or-win >= 97%, HP within 5 points, net MP <= fighting', bef(.45), { kind: 'cat', el: 4, L: 4, mpFrac: .5, befriend: true, friends: 0 });
row('Reedwater BEFRIEND: Catfish L4 vs L4 B, 3 friends (half)', 'friend >= 55%, same HP and MP rule', bef(.55), { kind: 'cat', el: 4, L: 4, mpFrac: .5, befriend: true, friends: 3 });
row('Befriend one level up: Catfish L5 vs L4 B, 0 friends (half)', 'friend >= 25%, friend-or-win >= 95%', (s) => s.friend >= .25 && s.win >= .95, { kind: 'cat', el: 5, L: 4, mpFrac: .5, befriend: true, friends: 0 });
row('Befriend a red fish: Catfish L6 vs L3 B, 0 friends (full)', 'friend <= 15% (no cheap grind)', (s) => s.friend <= .15, { kind: 'cat', el: 6, L: 3, befriend: true, friends: 0 });
row('Cichlid L5 vs L5 B (half)', 'win >= 95%', (s) => s.win >= .95, { kind: 'cich', el: 5, L: 5, mpFrac: .5 });
row('Murk near: Cichlid L6 vs L5 B (full)', 'win >= 90%, >= 30% HP', (s) => s.win >= .9 && s.hp >= .3, { kind: 'cich', el: 6, L: 5 });
row('Murk near: Crayfish L6 vs L5 B (full)', 'win >= 90%, >= 30% HP', (s) => s.win >= .9 && s.hp >= .3, { kind: 'cray', el: 6, L: 5 });
row('Murk deep: Cichlid L7 vs L6 B (half)', 'win >= 90%, >= 30% HP', (s) => s.win >= .9 && s.hp >= .3, { kind: 'cich', el: 7, L: 6, mpFrac: .5 });
row('Murk deep: Crayfish L7 vs L6 B (half)', 'win >= 90%, >= 30% HP', (s) => s.win >= .9 && s.hp >= .3, { kind: 'cray', el: 7, L: 6, mpFrac: .5 });
row('Cichlid L8 vs L7 B (half)', 'win >= 85%', (s) => s.win >= .85, { kind: 'cich', el: 8, L: 7, mpFrac: .5 });
row('Crayfish L8 vs L7 B (half)', 'win >= 85%', (s) => s.win >= .85, { kind: 'cray', el: 8, L: 7, mpFrac: .5 });
row('Edge Cichlid L10 vs L8 B (full)', 'win 35-70%', (s) => lim(.35, .7)(s.win), { kind: 'cich', el: 10, L: 8, edge: true });
row('Edge Crayfish L10 vs L8 B (full)', 'win 35-70%', (s) => lim(.35, .7)(s.win), { kind: 'cray', el: 10, L: 8, edge: true });
row('Gar vs L8 B, 3 Seed Cakes (full)', 'win >= 75%, 7-12 turns', (s) => s.win >= .75 && lim(7, 12)(s.turns), { kind: 'gar', el: 10, L: 8, seed: 3 });
row('Gar vs L8 B, no items (full)', 'win <= 35%', (s) => s.win <= .35, { kind: 'gar', el: 10, L: 8 });
row('Gar vs L10 B, no items (full)', 'win >= 90%', (s) => s.win >= .9, { kind: 'gar', el: 10, L: 10 });
row('Gar vs L8 B in the sub, no items (full)', 'win >= 90%', (s) => s.win >= .9, { kind: 'gar', el: 10, L: 8, sub: true });
row('Gar friendship: L8 B, 5 friends, no items (full)', 'friend >= 85%', (s) => s.friend >= .85, { kind: 'gar', el: 10, L: 8, party: true, friends: 5 });
row('Gar friendship: L8 B, 5 friends, 2 Bubble Waters (half)', 'friend >= 85%', (s) => s.friend >= .85, { kind: 'gar', el: 10, L: 8, party: true, bw: 2, friends: 5, mpFrac: .5 });

// ---- Change 1: the Snarl (Level 5, top of the Spillway steps) ----
const sn = { kind: 'snarl', el: 5 };
row('Snarl L5 vs L4 B, 2 Kelp (full)', 'win >= 95%, 6-10 turns', (s) => s.win >= .95 && lim(6, 10)(s.turns), { L: 4, kelp: 2, ...sn });
row('Snarl L5 vs L4 B, 2 Kelp (half)', 'win >= 90%, <= 11 turns', (s) => s.win >= .90 && s.turns <= 11, { L: 4, kelp: 2, mpFrac: .5, ...sn });
row('Snarl L5 vs L4 B, no items (full)', 'win 65-92% (items matter)', (s) => lim(.65, .92)(s.win), { L: 4, ...sn });
let snf = null;
row('Snarl L5 vs L5 B, 2 Kelp (full)', 'win >= 99%, 6-10 turns (baseline for its befriend row)', (s) => { snf = s; return s.win >= .99 && lim(6, 10)(s.turns); }, { L: 5, kelp: 2, ...sn });
row('Snarl L5 vs L5 B, 2 Kelp (half)', 'win >= 97%, 6-10 turns', (s) => s.win >= .97 && lim(6, 10)(s.turns), { L: 5, kelp: 2, mpFrac: .5, ...sn });
row('Snarl L5 vs L3 B, 2 Kelp (full; no Grenade, bites rip the net)', 'win 50-85% (possible, not easy)', (s) => lim(.5, .85)(s.win), { L: 3, kelp: 2, ...sn });
row('Snarl befriend: L5 vs L4 B, 3 friends, 2 Kelp (full)', 'friend >= 30%, friend-or-win >= 95%', (s) => s.friend >= .30 && s.win >= .95, { L: 4, kelp: 2, befriend: true, friends: 3, ...sn });
row('Snarl befriend: L5 vs L4 B, 3 friends, 2 Kelp (half)', 'friend >= 28%, friend-or-win >= 85%', (s) => s.friend >= .28 && s.win >= .85, { L: 4, kelp: 2, mpFrac: .5, befriend: true, friends: 3, ...sn });
row('Snarl befriend: L5 vs L5 B, 3 friends, 2 Kelp (full)', 'friend >= 50%, friend-or-win >= 98%, HP within 5 points of fighting, net MP <= fighting',
  (s) => s.friend >= .5 && s.win >= .98 && s.hp >= snf.hp - .05 && s.mp <= snf.mp, { L: 5, kelp: 2, befriend: true, friends: 3, ...sn });
row('Snarl befriend: L5 vs L5 B, 3 friends, 2 Kelp (half)', 'friend >= 50%, friend-or-win >= 97%', (s) => s.friend >= .5 && s.win >= .97, { L: 5, kelp: 2, mpFrac: .5, befriend: true, friends: 3, ...sn });
// ---- Change 1: New Game+ (NG+1: every enemy +4 levels; the Gar from garFor) ----
const g1 = garFor(4), g1f = garFor(4, 'fins', true), g2 = garFor(6);
const s9 = { kind: 'snarl', el: 9 };
row('NG+1, L8 carry: Snarl L9 vs L9 B, 2 Kelp (half)', 'win >= 95%, 6-10 turns', (s) => s.win >= .95 && lim(6, 10)(s.turns), { L: 9, kelp: 2, mpFrac: .5, ...s9 });
row('NG+1, L8 carry: Snarl befriend L9 vs L9 B, 3 friends, 2 Kelp (half)', 'friend >= 60%, friend-or-win >= 97%', (s) => s.friend >= .6 && s.win >= .97, { L: 9, kelp: 2, mpFrac: .5, befriend: true, friends: 3, ...s9 });
row('NG+1, L8 carry: Murk deep Cichlid L12 vs L10 B (half)', 'win >= 90%, >= 25% HP', (s) => s.win >= .9 && s.hp >= .25, { kind: 'cich', el: 12, L: 10, mpFrac: .5 });
row('NG+1, L8 carry: Murk deep Crayfish L12 vs L10 B (half)', 'win >= 90%, >= 20% HP', (s) => s.win >= .9 && s.hp >= .20, { kind: 'cray', el: 12, L: 10, mpFrac: .5 });
row('NG+1, L8 carry: Gar L14 vs L12 B, 3 Seed Cakes (full)', 'win >= 75%, 7-12 turns', (s) => s.win >= .75 && lim(7, 12)(s.turns), { kind: 'gar', el: 14, L: 12, seed: 3, gar: g1 });
row('NG+1, L8 carry: Gar L14 vs L12 B, no items (full)', 'win <= 35% (items and levels matter)', (s) => s.win <= .35, { kind: 'gar', el: 14, L: 12, gar: g1 });
row('NG+1, L8 carry: Gar L14 vs L12 B in the sub, no items (full)', 'win >= 90%', (s) => s.win >= .9, { kind: 'gar', el: 14, L: 12, sub: true, gar: g1 });
row('NG+1, L8 carry, after fins (special 41): Gar vs L12 B, 3 Seed Cakes (full)', 'win >= 75%', (s) => s.win >= .75, { kind: 'gar', el: 14, L: 12, seed: 3, gar: g1f });
row('NG+1, L8 carry: Gar friendship L12 B, 5 friends, no items (full)', 'friend >= 85%', (s) => s.friend >= .85, { kind: 'gar', el: 14, L: 12, party: true, friends: 5, gar: g1 });
row('NG+1, L8 carry: Gar friendship L12 B, 5 friends, 2 Bubble Waters (half)', 'friend >= 85%', (s) => s.friend >= .85, { kind: 'gar', el: 14, L: 12, party: true, friends: 5, bw: 2, mpFrac: .5, gar: g1 });
row('NG+1, L10 carry: Snarl L9 vs L11 B, 2 Kelp (half)', 'win >= 99%', (s) => s.win >= .99, { L: 11, kelp: 2, mpFrac: .5, ...s9 });
row('NG+1, L10 carry: Snarl befriend L9 vs L11 B, 3 friends, 2 Kelp (half)', 'friend >= 70%', (s) => s.friend >= .7, { L: 11, kelp: 2, mpFrac: .5, befriend: true, friends: 3, ...s9 });
row('NG+1, L10 carry: Murk deep Cichlid L12 vs L12 B (half)', 'win >= 95%, >= 35% HP', (s) => s.win >= .95 && s.hp >= .35, { kind: 'cich', el: 12, L: 12, mpFrac: .5 });
row('NG+1, L10 carry: Murk deep Crayfish L12 vs L12 B (half)', 'win >= 95%, >= 35% HP', (s) => s.win >= .95 && s.hp >= .35, { kind: 'cray', el: 12, L: 12, mpFrac: .5 });
row('NG+1, L10 carry: Gar L14 vs L13 B, 3 Seed Cakes (full)', 'win >= 95%, 7-12 turns', (s) => s.win >= .95 && lim(7, 12)(s.turns), { kind: 'gar', el: 14, L: 13, seed: 3, gar: g1 });
row('NG+1, L10 carry: Gar L14 vs L14 B, no items (full)', 'win >= 90%', (s) => s.win >= .9, { kind: 'gar', el: 14, L: 14, gar: g1 });
row('NG+1, L10 carry, after fins (special 41): Gar vs L13 B, 3 Seed Cakes (full)', 'win >= 90%', (s) => s.win >= .9, { kind: 'gar', el: 14, L: 13, seed: 3, gar: g1f });
row('NG+1, L10 carry, after friendship (meter starts 1): L13 B, 5 friends, no items (half)', 'friend >= 85%', (s) => s.friend >= .85, { kind: 'gar', el: 14, L: 13, party: true, friends: 5, mpFrac: .5, meter0: 1, gar: g1 });
row('NG+1 Edge Cichlid L14 vs L12 B (full)', 'win 35-70% (optional and scary)', (s) => lim(.35, .7)(s.win), { kind: 'cich', el: 14, L: 12, edge: true });
row('NG+1 Edge Crayfish L14 vs L12 B (full)', 'win 35-70%', (s) => lim(.35, .7)(s.win), { kind: 'cray', el: 14, L: 12, edge: true });
row('NG+2: Gar L16 vs L15 B, 3 Seed Cakes (full)', 'win >= 90%', (s) => s.win >= .9, { kind: 'gar', el: 16, L: 15, seed: 3, gar: g2 });
row('NG+2: Gar L16 vs L15 B, no items (full)', 'win <= 85% (still needs items)', (s) => s.win <= .85, { kind: 'gar', el: 16, L: 15, gar: g2 });
row('NG+2: Gar friendship L15 B, 5 friends, no items (full)', 'friend >= 85%', (s) => s.friend >= .85, { kind: 'gar', el: 16, L: 15, party: true, friends: 5, gar: g2 });

const N = 4000;
const out = [];
console.log('| Fight (start MP) | Target | Win | Friend | Turns | HP left | Net MP | |');
console.log('|---|---|---|---|---|---|---|---|');
let met = 0;
for (const r of ROWS) {
  const rng = makeRng(crc32(r.name));
  const res = Array.from({ length: N }, () => fight(rng, r.kw));
  const ok = res.filter((x) => x.result !== 'lose');
  const s = {
    win: ok.length / N,
    friend: res.filter((x) => x.result === 'friend').length / N,
    turns: ok.reduce((t, x) => t + x.turns, 0) / Math.max(1, ok.length),
    hp: ok.reduce((t, x) => t + x.hp, 0) / Math.max(1, ok.length),
    mp: ok.reduce((t, x) => t + x.mp, 0) / Math.max(1, ok.length),
  };
  const pass = r.check(s);
  if (pass) met++;
  out.push({ name: r.name, ...s, pass });
  console.log(`| ${r.name} | ${r.target} | ${(s.win * 100).toFixed(1)}% | ${(s.friend * 100).toFixed(0)}% | ${s.turns.toFixed(1)} | ${(s.hp * 100).toFixed(0)}% | ${s.mp.toFixed(1)} | ${pass ? 'PASS' : 'FAIL'} |`);
}
console.log(`\n${met}/${ROWS.length} targets met (game rules, battle.js)`);
let failed = met !== ROWS.length;

if (!process.argv.includes('--no-compare')) {
  let py = '';
  try { py = execFileSync('python3', [path.join(here, 'sim_design.py')], { encoding: 'utf8' }); }
  catch (e) { py = e.stdout || ''; }
  const prow = py.split('\n').filter((l) => l.startsWith('| ') && !l.startsWith('| Fight'));
  console.log('\nCompared with tools/sim_design.py (points = percentage points; turns and MP shown for reference):\n');
  console.log('| Fight | Win (js / py) | Friend | HP left | Turns | Net MP | Within 3 points |');
  console.log('|---|---|---|---|---|---|---|');
  let worst = 0;
  out.forEach((o, i) => {
    const cells = (prow[i] || '').split('|').map((c) => c.trim());
    const pnum = (c) => parseFloat(c);
    const pw = pnum(cells[3]), pf = pnum(cells[4]), pt = pnum(cells[5]), ph = pnum(cells[6]), pm = pnum(cells[7]);
    const dw = Math.abs(o.win * 100 - pw), df = Math.abs(o.friend * 100 - pf), dh = Math.abs(o.hp * 100 - ph);
    const d = Math.max(dw, df, dh);
    worst = Math.max(worst, d);
    const ok = d <= 3;
    if (!ok) failed = true;
    console.log(`| ${o.name} | ${(o.win * 100).toFixed(1)} / ${pw} | ${(o.friend * 100).toFixed(0)} / ${pf} | ${(o.hp * 100).toFixed(0)} / ${ph} | ${o.turns.toFixed(1)} / ${pt} | ${o.mp.toFixed(1)} / ${pm} | ${ok ? 'yes' : 'NO'} (${d.toFixed(1)}) |`);
  });
  console.log(`\nLargest difference: ${worst.toFixed(1)} points`);
}
process.exit(failed ? 1 : 0);
