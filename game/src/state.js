// state.js: the save data (the player's whole progress), and the rules that
// change it outside battle: levels, items, flags, friends. Saved to
// localStorage as versioned JSON in three slots ('bettarpg-save-1'..'-3'); the
// published game's single 'bettarpg-save' migrates into slot 1.
import { PLAYER, ITEMS, ITEM_MAX, REGULAR_KINDS, PEACE_PER_KIND, DEFEAT_LOSS, maxLevel, ROOMS, areaOf } from './config.js';

export const SAVE_KEY = 'bettarpg-save';            // the published game's single save
export const MIGRATED_KEY = 'bettarpg-save-migrated';
export const LAST_SLOT_KEY = 'bettarpg-last-slot';
export const SLOTS = [1, 2, 3];
export const slotKey = (n) => `${SAVE_KEY}-${n}`;
export const SETTINGS_KEY = 'bettarpg-settings';
const VERSION = 1;

export function newSave(name = 'Betta', color = 'red') {
  return {
    v: VERSION, name, color,
    level: 1, exp: 0, hp: PLAYER.maxHp(1), mp: PLAYER.maxMp(1), bb: 0,
    items: { kelp: 0, seedcake: 0, bwater: 1, fizzy: 0 },
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
    lastEnding: null,     // the most recent ending (the Gar remembers it in New Game+)
    endingsSeen: {},
    ngPlus: 0,            // New Game+ count (0 = first run)
    lastPlayed: 0,
    playTime: 0,
  };
}

const AREA_IDS = ['village', 'shallows', 'reedwater', 'highwater', 'murk', 'ditch'];
const KINDS = ['guppy', 'angel', 'cat', 'nymph', 'cich', 'cray', 'snarl'];
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
  s.ngPlus = int(raw.ngPlus, 0, 99, 0);          // read before the level: it sets the cap
  s.level = int(raw.level, 1, maxLevel(s), 1);
  s.exp = int(raw.exp, 0, 99999, 0);
  s.hp = int(raw.hp, 0, maxHp(s), maxHp(s)) || maxHp(s);
  s.mp = int(raw.mp, 0, maxMp(s), maxMp(s));
  s.bb = int(raw.bb, 0, 99999, 0);
  for (const k of Object.keys(s.items)) s.items[k] = int(obj(raw.items)[k], 0, ITEM_MAX, s.items[k]);
  s.subOwned = raw.subOwned === true;
  s.flags = bools(raw.flags);
  // saves from before Reef's errand: past the gate means it was open
  if (s.flags.stumpDone && !s.flags.eastOpen && ((Array.isArray(raw.scales) && raw.scales.length) || s.flags.trailFound || !['village', 'shallows'].includes(areaOf(raw.area)))) s.flags.eastOpen = true;
  for (const k of KINDS) { const n = int(obj(raw.friends)[k], 0, k === 'snarl' ? 1 : 999, 0); if (n) s.friends[k] = n; }
  s.firstFriendKinds = bools(raw.firstFriendKinds);
  s.scales = Array.isArray(raw.scales) ? [...new Set(raw.scales.filter((x) => SCALE_IDS.includes(x)))] : [];
  s.cogs = Array.isArray(raw.cogs) ? [...new Set(raw.cogs.filter((x) => COG_IDS.includes(x)))] : [];
  s.rest = ['village', 'highwater', 'spring', 'steps'].includes(raw.rest) ? raw.rest : 'village';
  if (s.rest === 'spring' && !s.flags.gateOpen) s.rest = 'village';
  if (s.rest === 'steps' && !s.flags.trailFound) s.rest = 'village';
  s.freeRest = bools(raw.freeRest);
  s.area = AREA_IDS.includes(raw.area) || ROOMS[raw.area] ? raw.area : 'village';
  const p = obj(raw.pos);
  s.pos = Number.isFinite(p.x) && Number.isFinite(p.y) ? { x: p.x, y: p.y } : null;
  s.met = bools(raw.met);
  s.hints = bools(raw.hints);
  s.wearHat = raw.wearHat === true;
  s.ending = raw.ending === 'fins' || raw.ending === 'friend' ? raw.ending : null;
  s.lastEnding = raw.lastEnding === 'fins' || raw.lastEnding === 'friend' ? raw.lastEnding : s.ending;
  s.endingsSeen = bools(raw.endingsSeen);
  s.lastPlayed = int(raw.lastPlayed, 0, 1e15, 0);
  s.playTime = int(raw.playTime, 0, 1e9, 0);
  // saves from before the Snarl: anyone past the Spillway steps has already got by it
  const f = s.flags;
  if (!f.snarlDone && (f.highwater || f.lantern || f.gateOpen || f.garDefeated || f.garFriend || s.rest === 'highwater'
    || s.area === 'murk' || s.area === 'ditch' || areaOf(s.area) === 'highwater' && (ROOMS[s.area] || (s.pos && s.pos.y < 470)))) f.snarlDone = true;
  return s;
}

const getItem = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const setItem = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };
const parse = (raw) => { try { return sanitize(JSON.parse(raw)); } catch { return null; } };

// The published game kept one save under 'bettarpg-save'. The first time this
// version runs (no slot yet), its text moves into slot 1 as it is; once slot 1
// holds it, the old key is renamed 'bettarpg-save-migrated' (kept, never deleted).
export function migrate() {
  if (SLOTS.some((n) => getItem(slotKey(n)) !== null)) return false;
  const old = getItem(SAVE_KEY);
  if (old === null) return false;
  if (!setItem(slotKey(1), old) || getItem(slotKey(1)) !== old) return false;
  setItem(MIGRATED_KEY, old);
  try { localStorage.removeItem(SAVE_KEY); } catch {}
  setItem(LAST_SLOT_KEY, '1');
  return true;
}

export const slotExists = (n) => getItem(slotKey(n)) !== null;
export function loadSlot(n) { const raw = getItem(slotKey(n)); return raw === null ? null : parse(raw); }
export function storeSlot(n, s) {
  s.lastPlayed = Date.now();
  const ok = setItem(slotKey(n), JSON.stringify(s));
  setItem(LAST_SLOT_KEY, String(n));
  return ok;
}
export function deleteSlot(n) { try { localStorage.removeItem(slotKey(n)); } catch {} if (lastSlot() === n) { try { localStorage.removeItem(LAST_SLOT_KEY); } catch {} } }
export function lastSlot() { const n = +getItem(LAST_SLOT_KEY); return SLOTS.includes(n) ? n : null; }
export const finishedGame = (s) => !!(s && (s.endingsSeen.fins || s.endingsSeen.friend));
// What the slot screen shows.
export function slotInfo(n) {
  const raw = getItem(slotKey(n));
  if (raw === null) return { slot: n, empty: true };
  const s = parse(raw);
  if (!s) return { slot: n, unreadable: true };
  return { slot: n, name: s.name, color: s.color, level: s.level, ngPlus: s.ngPlus, area: s.area,
    friends: friendsTotal(s) + (s.flags.garFriend ? 1 : 0), endings: Object.keys(s.endingsSeen).filter((k) => s.endingsSeen[k]),
    lastPlayed: s.lastPlayed, finished: finishedGame(s), save: s };
}

// New Game+: a fresh story carrying the hero over (the GAME_DESIGN.md lists).
export function ngPlusFrom(src) {
  const s = newSave(src.name, src.color);
  for (const k of ['level', 'exp', 'bb', 'subOwned', 'wearHat', 'ending', 'lastEnding']) s[k] = src[k];
  s.items = { ...src.items };
  s.endingsSeen = { ...src.endingsSeen };
  s.hints = { ...src.hints };
  s.ngPlus = (src.ngPlus || 0) + 1;
  s.hp = maxHp(s); s.mp = maxMp(s);
  s.flags.tutorialDone = true;
  s.lastPlayed = Date.now();
  return s;
}

export function loadSettings() {
  let o = {};
  try { o = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') || {}; } catch { o = {}; }
  if (typeof o.parade !== 'boolean') o.parade = true;   // the friends' parade, on by default
  return o;
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
  while (s.level < maxLevel(s) && s.exp >= PLAYER.expToNext(s.level)) {
    s.exp -= PLAYER.expToNext(s.level);
    s.level++;
    ups.push(s.level);
  }
  if (s.level >= maxLevel(s)) s.exp = Math.min(s.exp, 0);
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
