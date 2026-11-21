#!/usr/bin/env node
// test-saves.mjs: the save slots and the migration of the published game's
// single save, with a stand-in localStorage. Exits 1 on any failure.
const store = new Map();
globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
const st = await import('../game/src/state.js');
let fails = 0;
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fails++; };
const reset = () => store.clear();
const canon = (v) => JSON.stringify(v, (k, x) => (x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort()) : x));

// 1. a finished published v1 save (Gar done, highwater set, none of the new fields)
const finished = { v: 1, name: 'Wanda', color: 'blue', level: 9, exp: 120, hp: 50, mp: 20, bb: 230,
  items: { kelp: 2, seedcake: 1, bwater: 3, fizzy: 0 }, subOwned: true,
  flags: { metFinn: true, bubbleJoined: true, hbtLearned: true, stumpDone: true, eastOpen: true, trailFound: true, highwater: true, lantern: true, gateOpen: true, garFriend: true, peace: false },
  friends: { guppy: 3, angel: 2, cat: 1 }, firstFriendKinds: { guppy: true }, scales: ['s1', 's2', 's3', 's4', 's5'], cogs: ['c1', 'c2', 'c3'],
  rest: 'spring', freeRest: { village: true }, area: 'village', pos: { x: 512, y: 340 }, met: { finn: true }, hints: { swim: true },
  wearHat: true, ending: 'friend', endingsSeen: { friend: true }, playTime: 3000 };
reset(); store.set('bettarpg-save', JSON.stringify(finished));
ok(st.migrate() === true, 'finished save: migrated');
const s1 = st.loadSlot(1);
ok(s1 && s1.name === 'Wanda' && s1.level === 9 && s1.bb === 230 && s1.items.bwater === 3 && s1.subOwned && s1.friends.guppy === 3, 'finished save: fields kept');
ok(s1.flags.snarlDone === true && s1.ngPlus === 0 && s1.lastEnding === 'friend', 'finished save: snarlDone set, ngPlus 0, lastEnding = ending');
ok(store.get('bettarpg-save-migrated') === JSON.stringify(finished) && !store.has('bettarpg-save'), 'old key renamed to bettarpg-save-migrated, text intact');
ok(store.get('bettarpg-last-slot') === '1', 'last slot is 1');
ok(st.migrate() === false && st.loadSlot(1).name === 'Wanda', 'migration runs once');
ok(st.slotInfo(1).finished === true, 'finished save offers New Game+');

// 2. a mid-game save before the Snarl (in Reedwater) and one at the Spillway's foot
const mid = { ...finished, level: 4, flags: { metFinn: true, bubbleJoined: true, hbtLearned: true, stumpDone: true, eastOpen: true }, scales: ['s1', 's2'], cogs: [], area: 'reedwater', pos: { x: 600, y: 610 }, rest: 'village', ending: null, endingsSeen: {}, friends: { angel: 1, guppy: 2 }, subOwned: false };
reset(); store.set('bettarpg-save', JSON.stringify(mid)); st.migrate();
const m = st.loadSlot(1);
ok(m && m.area === 'reedwater' && m.pos.x === 600 && m.scales.length === 2 && !m.flags.snarlDone, 'mid-game save: kept, Snarl still ahead');
const foot = { ...mid, flags: { ...mid.flags, trailFound: true }, area: 'highwater', pos: { x: 768, y: 860 } };
reset(); store.set('bettarpg-save', JSON.stringify(foot)); st.migrate();
ok(!st.loadSlot(1).flags.snarlDone, 'at the Spillway foot (y 860): Snarl still ahead');
const city = { ...foot, pos: { x: 700, y: 300 } };
reset(); store.set('bettarpg-save', JSON.stringify(city)); st.migrate();
ok(st.loadSlot(1).flags.snarlDone === true, 'in Highwater city (y < 470): snarlDone');

// 3. an unreadable published save
reset(); store.set('bettarpg-save', '{not json'); st.migrate();
ok(store.get('bettarpg-save-1') === '{not json' && st.slotInfo(1).unreadable === true, 'unreadable save: moved as is, shown as unreadable');
ok(store.get('bettarpg-save-migrated') === '{not json', 'unreadable save: original kept');
ok(st.loadSlot(1) === null, 'unreadable slot loads as null (no crash)');

// 4. an NG+1 Level 13 save round-trips unchanged
reset();
const ng = st.ngPlusFrom(st.sanitize(finished));
ng.level = 13; ng.hp = st.maxHp(ng); ng.mp = st.maxMp(ng); ng.friends = { snarl: 1, guppy: 2 }; ng.flags.snarlDone = true; ng.flags.snarlFriend = true;
st.storeSlot(2, ng);
const back = st.loadSlot(2);
ok(canon(back) === canon(ng), 'NG+1 L13 save with friends.snarl 1 round-trips unchanged');
ok(back.level === 13 && back.ngPlus === 1 && back.friends.snarl === 1, 'NG+ level 13 kept (cap 15)');
ok(st.lastSlot() === 2, 'storing sets the last slot');

// 5. New Game+ lists
const src = st.sanitize(finished); const n2 = st.ngPlusFrom(src);
ok(n2.level === 9 && n2.exp === 120 && n2.bb === 230 && n2.items.bwater === 3 && n2.subOwned && n2.wearHat && n2.endingsSeen.friend && n2.ending === 'friend' && n2.lastEnding === 'friend' && n2.hints.swim, 'NG+ carries the listed fields');
ok(Object.keys(n2.flags).join() === 'tutorialDone' && Object.keys(n2.friends).length === 0 && n2.scales.length === 0 && n2.rest === 'village' && n2.area === 'village' && n2.pos === null && Object.keys(n2.met).length === 0 && n2.playTime === 0, 'NG+ resets the listed fields');
ok(n2.ngPlus === 1 && n2.hp === st.maxHp(n2) && n2.mp === st.maxMp(n2), 'NG+ sets ngPlus 1, full HP and MP');

// 6. first-run cap 10, NG+ cap 15
const a = st.newSave(); a.level = 10; st.addExp(a, 99999); ok(a.level === 10, 'first run stops at Level 10');
const b = st.newSave(); b.ngPlus = 1; b.level = 10; st.addExp(b, 99999); ok(b.level === 15, 'NG+ reaches Level 15');
console.log(fails ? `${fails} failed` : 'all save tests passed');
process.exit(fails ? 1 : 0);
