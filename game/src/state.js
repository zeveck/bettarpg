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

export function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || s.v !== VERSION || typeof s.level !== 'number') return null;
    const fresh = newSave(s.name, s.color);
    return { ...fresh, ...s, items: { ...fresh.items, ...s.items }, flags: { ...s.flags } };
  } catch { return null; }
}
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
