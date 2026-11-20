// state.js: the save data (the player's whole progress), and the rules that
// change it outside battle: levels, items, flags, friends. Saved to
// localStorage under 'bettarpg-save' as versioned JSON.
import { PLAYER, ITEMS, ITEM_MAX, REGULAR_KINDS, PEACE_PER_KIND, DEFEAT_LOSS } from './config.js';

export const SAVE_KEY = 'bettarpg-save';
export const SETTINGS_KEY = 'bettarpg-settings';
const VERSION = 1;

export function newSave(name = 'Betta', color = 'red') {
  return {
    v: VERSION, name, color,
    level: 1, exp: 0, hp: PLAYER.maxHp(1), mp: PLAYER.maxMp(1), bb: 0,
    items: { kelp: 0, seedcake: 0, bwater: 0, fizzy: 0 },
    subOwned: false,
    flags: {},
    friends: {},          // kind -> count (gar counted separately as flags.garFriend)
    firstFriendKinds: {}, // kinds that already gave their Kelp Snack
    scales: [], cogs: [],
    rest: 'village',      // village | highwater | spring
    freeRest: {},         // first rest at each inn is free
    area: 'village', pos: null,
    met: {},              // npc ids already met (first-meeting lines shown)
    hints: {},            // contextual hints already shown
    wearHat: false,
    ending: null,         // 'fins' | 'friend' (the first ending seen)
    endingsSeen: {},
    playTime: 0,
  };
}

const AREA_IDS = ['village', 'shallows', 'reedwater', 'highwater', 'murk', 'ditch'];
const KINDS = ['guppy', 'angel', 'cat', 'nymph', 'cich', 'cray'];
const SCALE_IDS = ['s1', 's2', 's3', 's4', 's5'];
const COG_IDS = ['c1', 'c2', 'c3'];
const int = (v, lo, hi, d) => (Number.isFinite(+v) && v !== null && v !== '' ? Math.max(lo, Math.min(hi, Math.floor(+v))) : d);
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const bools = (v) => Object.fromEntries(Object.entries(obj(v)).filter(([, b]) => typeof b === 'boolean'));

// Every field checked and given a default, so a damaged save can't crash Continue.
export function sanitize(raw) {
  if (!raw || typeof raw !== 'object' || raw.v !== VERSION) return null;
  const name = typeof raw.name === 'string' && raw.name.trim() ? raw.name.replace(/[^A-Za-z0-9 '\-]/g, '').slice(0, 12) || 'Betta' : 'Betta';
  const color = PLAYER.colors.includes(raw.color) ? raw.color : 'red';
  const s = newSave(name, color);
  s.level = int(raw.level, 1, PLAYER.maxLevel, 1);
  s.exp = int(raw.exp, 0, 99999, 0);
  s.hp = int(raw.hp, 0, maxHp(s), maxHp(s)) || maxHp(s);
  s.mp = int(raw.mp, 0, maxMp(s), maxMp(s));
  s.bb = int(raw.bb, 0, 99999, 0);
  for (const k of Object.keys(s.items)) s.items[k] = int(obj(raw.items)[k], 0, ITEM_MAX, 0);
  s.subOwned = raw.subOwned === true;
  s.flags = bools(raw.flags);
  for (const k of KINDS) { const n = int(obj(raw.friends)[k], 0, 999, 0); if (n) s.friends[k] = n; }
  s.firstFriendKinds = bools(raw.firstFriendKinds);
  s.scales = Array.isArray(raw.scales) ? [...new Set(raw.scales.filter((x) => SCALE_IDS.includes(x)))] : [];
  s.cogs = Array.isArray(raw.cogs) ? [...new Set(raw.cogs.filter((x) => COG_IDS.includes(x)))] : [];
  s.rest = ['village', 'highwater', 'spring'].includes(raw.rest) ? raw.rest : 'village';
  if (s.rest === 'spring' && !s.flags.gateOpen) s.rest = 'village';
  s.freeRest = bools(raw.freeRest);
  s.area = AREA_IDS.includes(raw.area) ? raw.area : 'village';
  const p = obj(raw.pos);
  s.pos = Number.isFinite(p.x) && Number.isFinite(p.y) ? { x: p.x, y: p.y } : null;
  s.met = bools(raw.met);
  s.hints = bools(raw.hints);
  s.wearHat = raw.wearHat === true;
  s.ending = raw.ending === 'fins' || raw.ending === 'friend' ? raw.ending : null;
  s.endingsSeen = bools(raw.endingsSeen);
  s.playTime = int(raw.playTime, 0, 1e9, 0);
  return s;
}

export function load() {
  let raw = null;
  try { raw = localStorage.getItem(SAVE_KEY); } catch { return null; }
  if (!raw) return null;
  let s = null;
  try { s = sanitize(JSON.parse(raw)); } catch { s = null; }
  if (!s) { try { localStorage.setItem(SAVE_KEY + '-backup', raw); } catch {} }
  return s;
}
// A save is there (even one that couldn't be read): New Game asks first.
export function saveExists() { try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; } }
export function store(s) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); return true; } catch { return false; }
}
export function hasSave() { return !!load(); }
export function wipe() { try { localStorage.removeItem(SAVE_KEY); } catch {} }

export function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') || {}; } catch { return {}; }
}
export function storeSettings(o) { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(o)); } catch {} }

export const maxHp = (s) => PLAYER.maxHp(s.level);
export const maxMp = (s) => PLAYER.maxMp(s.level);
export const friendsTotal = (s) => Object.values(s.friends).reduce((a, b) => a + b, 0);
export const peaceDone = (s) => REGULAR_KINDS.every((k) => (s.friends[k] || 0) >= PEACE_PER_KIND);

// Add EXP; returns the list of levels reached.
export function addExp(s, exp) {
  s.exp += exp;
  const ups = [];
  while (s.level < PLAYER.maxLevel && s.exp >= PLAYER.expToNext(s.level)) {
    s.exp -= PLAYER.expToNext(s.level);
    s.level++;
    ups.push(s.level);
  }
  if (s.level >= PLAYER.maxLevel) s.exp = Math.min(s.exp, 0);
  if (ups.length) { s.hp = maxHp(s); s.mp = maxMp(s); }
  return ups;
}

export function addItem(s, k, n = 1) {
  const before = s.items[k] || 0;
  s.items[k] = Math.min(ITEM_MAX, before + n);
  return s.items[k] - before;
}

// Use an item outside battle. Returns {ok, text}.
export function useItem(s, k) {
  const it = ITEMS[k];
  if (!it || !(s.items[k] > 0)) return { ok: false, text: `You have no ${it?.name || 'item'}.` };
  if (it.hp) {
    if (s.hp >= maxHp(s)) return { ok: false, text: 'HP is already full.' };
    const h = Math.min(it.hp, maxHp(s) - s.hp); s.hp += h; s.items[k]--;
    return { ok: true, text: `+${h} HP` };
  }
  if (s.mp >= maxMp(s)) return { ok: false, text: 'MP is already full.' };
  const m = Math.min(it.mp, maxMp(s) - s.mp); s.mp += m; s.items[k]--;
  return { ok: true, text: `+${m} MP` };
}

export function defeatPenalty(s) {
  const lost = Math.floor(s.bb * DEFEAT_LOSS);
  s.bb -= lost;
  s.hp = maxHp(s); s.mp = maxMp(s);
  return lost;
}
