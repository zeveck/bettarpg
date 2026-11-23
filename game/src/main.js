// main.js: boot, scaling, the fixed-step loop, the modes (title, create,
// world, battle, ending), every menu screen, saving, and the debug hook.
import { ROOMS, areaOf, maxLevel, NGPLUS, CATCH_UP, PLAYER, ITEMS, ITEM_ORDER, ITEM_MAX, SUB_PRICE, INN_PRICE, AREAS, AREA_NAMES, AREA_START, REGULAR_KINDS,
  ENEMIES, PEACE_PER_KIND, WORLD, PARTY } from './config.js';
import { makeRng } from './battle.js';
import * as audio from './audio.js';
import { input, ACTIONS, label, keyCap, padCap, escapeHtml, confirmCap, backCap } from './input.js';
import { loadAll, img, hasReal, assetReport } from './assets.js';
import { betta, hatted, plain, fromCanvas, drawFish, PLAYER_COLORS, portrait, bettaSwim } from './sprites.js';
import { MAPS } from './maps.js';
import { World, spriteCanvas, terrainFor } from './world.js';
import { BattleScene } from './battlescene.js';
import { createStory } from './story.js';
import * as state from './state.js';
import { NAMES, SPEAKERS, goalLine, HINTS, HOW_TO_PLAY, COLOR_NAMES, STORY, LEVEL_UP_LINES, LOOKS } from './strings.js';
import * as ui from './ui.js';
import { $, el, nav, button, wire, show, hide, say as uiSay, toast as uiToast, hint as uiHint, banner, fade, withKeys, drawPortrait } from './ui.js';
import { Particles, drawWipe, pixelBubble } from './fx.js';

const cv = $('cv');
const ctx = cv.getContext('2d');
const params = new URLSearchParams(location.search);
const DEBUG = params.has('debug');

// ---------- the game object other modules talk to ----------
const G = {
  s: state.newSave(),
  mode: 'boot',
  view: { W: 640, H: 360 },
  k: 1,
  input,
  worldRng: makeRng(12345),
  battleRng: makeRng(54321),
  world: null,
  battle: null,
  ending: null,
  tick: 0,
  busyCount: 0,
  wipe: null,
  settings: { vibration: true, ...state.loadSettings() },
  frameLog: [],
  gameWon: false,
  endingParty: false,
};
window.G = undefined;
G.story = createStory(G);
G.spriteCanvas = (k) => spriteCanvas(k);

// ---------- scaling: whole multiples of the device pixel ----------
let cssRect = { left: 0, top: 0, width: 640, height: 360 };
function resize() {
  const dpr = window.devicePixelRatio || 1;
  const cw = window.innerWidth, ch = window.innerHeight;
  const dw = Math.round(cw * dpr), dh = Math.round(ch * dpr);
  let k = 1;
  while (dw / (k + 1) >= 640 && dh / (k + 1) >= 360) k++;
  let W = Math.floor(dw / k), H = Math.floor(dh / k);
  W = Math.max(640, Math.min(864, W)); H = Math.max(360, Math.min(400, H));
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  let cssW = (W * k) / dpr, cssH = (H * k) / dpr;
  if (cssW > cw + 0.5 || cssH > ch + 0.5) { const f = Math.min(cw / W, ch / H); cssW = W * f; cssH = H * f; }
  const left = Math.round((cw - cssW) / 2), top = Math.round((ch - cssH) / 2);
  Object.assign(cv.style, { width: cssW + 'px', height: cssH + 'px', left: left + 'px', top: top + 'px' });
  cssRect = { left, top, width: cssW, height: cssH };
  G.view = { W, H };
  G.k = k;
  ctx.imageSmoothingEnabled = false;
  document.body.classList.toggle('short', ch < 500);
  // bigger screens get bigger UI text and panels (phones stay at 1)
  const ui = ch < 500 ? 1 : Math.max(1, Math.min(2, Math.floor(Math.min(cw / 1060, ch / 600) * 20) / 20));
  document.documentElement.style.setProperty('--ui', ui);
  const portraitPhone = input.isTouch && ch > cw;
  $('rotate').hidden = !portraitPhone;
  // turning the phone upright just freezes the game (the loop skips updates)
}
G.cssToLogicalY = (y) => ((y - cssRect.top) * G.view.H) / cssRect.height;
G.cssToLogicalX = (x) => ((x - cssRect.left) * G.view.W) / cssRect.width;

// ---------- helpers for other modules ----------
G.sfx = (name, opts) => audio.play(name, opts);
G.friendsTotal = () => state.friendsTotal(G.s);
G.friendKinds = () => REGULAR_KINDS.filter((k) => G.s.friends[k] > 0);
G.playerCanvas = () => betta(PLAYER.armorStage(G.s.level), G.s.color, !!G.s.wearHat)?.canvas;
G.busy = () => G.busyCount > 0;
G.player = () => G.world.player;
G.world = null;
G.wait = (ms) => new Promise((r) => G.waits.push({ t: ms / 1000, r }));
G.waits = [];
G.shake = (n) => { if (G.world) G.world.shake = n; };
G.vibrate = (ms, mag = 0.5) => {
  if (!G.settings.vibration) return;
  try {
    for (const p of navigator.getGamepads?.() || []) if (p && p.connected) p.vibrationActuator?.playEffect?.('dual-rumble', { duration: ms, strongMagnitude: mag, weakMagnitude: mag / 2 });
  } catch {}
};
G.toast = (text, ms = 2200, icon) => {
  const ic = icon && img(icon) ? `<img class="ico" src="${img(icon).toDataURL()}" alt=""> ` : '';
  uiToast(ic + escapeHtml(text), ms);
};
G.say = (who, text, choices) => {
  let sp;
  if (typeof who === 'string') {
    const d = SPEAKERS[who] || { name: who, sprite: null };
    const c = who === 'player' ? G.playerCanvas() : d.sprite ? (who === 'gar' && (G.s.flags.garFriend || G.s.flags.garDefeated) ? img('garsmall') : spriteCanvas(d.sprite)) : null;
    sp = { name: who === 'player' ? G.s.name : d.name, sprite: c };
  } else sp = who;
  return uiSay(sp, text, choices);
};
G.cutscene = async (fn) => { G.busyCount++; try { await fn(); } finally { G.busyCount--; } };
G.canTalkNow = () => G.mode === 'world' && !G.busy() && !nav.top() && !G.wipe;
G.moveEntity = (e, x, y, speed = 60) => new Promise((r) => { e.walkTo = { x, y, speed, done: r }; if (!G.world.extra.includes(e) && !G.world.npcs.includes(e)) G.world.walkers = [...(G.world.walkers || []), e]; });
G.moveBubbleTo = (x, y) => new Promise((r) => {
  const b = G.world.bubble;
  const step = () => {
    const dx = x - b.x, dy = y - b.y, d = Math.hypot(dx, dy);
    if (d < 3) return r();
    b.face = dx > 0 ? 1 : -1;
    G.waits.push({ t: 1 / 60, r: () => { const sp = 140 / 60; b.x += dx / d * Math.min(sp, d); b.y += dy / d * Math.min(sp, d); step(); } });
  };
  step();
});
G.tweenProp = (p, x, y, dur) => new Promise((r) => {
  const x0 = p.x, y0 = p.y; let t = 0;
  const step = () => G.waits.push({ t: 1 / 60, r: () => { t += 1 / 60; const k = Math.min(1, t / dur); p.x = x0 + (x - x0) * k; p.y = y0 + (y - y0) * k * k; if (k < 1) step(); else r(); } });
  step();
});

// ---------- saving ----------
G.save = () => {
  const s = G.s;
  if (G.world && G.mode === 'world') { s.area = G.world.areaId; s.pos = { x: Math.round(G.world.player.x), y: Math.round(G.world.player.y) }; }
  state.storeSlot(G.slot || 1, s);
};
function saveSettings() {
  state.storeSettings({ ...G.settings, ...audio.audioSettings() });
}

// ---------- hints ----------
G.hintOnce = (key) => {
  const s = G.s;
  if (s.hints[key]) return;
  s.hints[key] = true;
  let text;
  if (key === 'swim') text = input.device === 'touch' || input.isTouch ? HINTS.swimTouch : `Swim with ${label('move')}`;
  else if (key === 'talk') text = input.device === 'touch' ? 'Tap Talk to talk' : `${label('talk')}: Talk`;
  else if (key === 'redGlow') text = escapeHtml(HINTS.redGlow);
  else if (key === 'battle') text = escapeHtml(HINTS.battle);
  else if (key === 'befriend') text = escapeHtml(HINTS.befriend);
  if (!text) return;
  uiHint(text.startsWith('Swim with') || text.includes('cap') ? text : text, 5000);
};

// ---------- areas ----------
const REST = { village: ['villageInn', 'bed'], highwater: ['hwInn', 'bed'], spring: ['ditch', 'spring'], steps: ['highwater', 'steps'] };

G.transition = async (fn, dur = 0.32, sound = 'transition') => {
  if (G.wipe) { await fn(); return; }
  G.wipe = { p: 0, t: 0, dur };
  if (sound === 'transition') audio.play('transition', { vol: 0.5 });
  else if (sound) audio.play(sound, { vol: 1 });
  await new Promise((r) => { G.wipe.onCovered = r; });
  await fn();
  G.wipe.phase = 2;
  await new Promise((r) => { G.wipe.onDone = r; });
  G.wipe = null;
};

G.enterArea = async (id, entry, { wipe = true, quiet = false } = {}) => {
  const from = G.world?.areaId;
  // through a door: into a room, or out of one into its own area
  const door = !!(ROOMS[id] || (from && ROOMS[from] && areaOf(from) === id)) && !!from && from !== id;
  if (door) quiet = true;
  const go = () => {
    if (!G.world) G.world = new World(G);
    terrainFor(id);
    G.world.load(id, entry);
    G.mode = 'world';
    showWorldUI(true);
    const def = MAPS[id];
    audio.playMusic(def.music);
    audio.playAmbience(def.ambience);
    // fetch the likely next tracks ahead
    audio.prefetch('battle');
    G.s.area = id;
    G.save();
  };
  if (wipe) await G.transition(async () => go(), 0.32, door ? (MAPS[id].bell ? 'shop_bell' : 'door') : 'transition'); else go();
  if (!quiet) {
    banner(AREA_NAMES[id], id === 'village' ? img('bettahome') : null);
    G.hintOnce('swim');
  }
  if (door && ROOMS[id]) {
    // inside: the outdoor banner and toasts stay outside
    $('banner').hidden = true; $('toasts').replaceChildren();
    if (wipe) G.toast(ROOMS[id].name, 1600);
  }
  if (door && ROOMS[from]) {
    G.s.hints.doorUsed = true;
    // the first swim out of Finn's house: the village, and the gate he just opened
    if (from === 'finnHouse' && G.s.flags.metFinn && !G.s.hints.firstOut) {
      G.s.hints.firstOut = true;
      banner(AREA_NAMES.village, img('bettahome'));
      G.toast('The south gate is open!');
    }
  }
};
G.enterRoom = (id) => G.enterArea(id, 'door');

G.world = null;
G.collect = (q) => {
  const s = G.s;
  if (q.type === 'bite') {
    const n = 1 + (G.worldRng.int(0, 2));
    s.bb += n;
    audio.play('bite');
    G.world.fx.number(q.x, q.y - 10, '+' + n, '#F7C948', 1);
    return;
  }
  audio.play('bite', { rate: 0.7 });
  if (q.type === 'scale' && !s.scales.includes(q.id)) s.scales.push(q.id);
  if (q.type === 'cog' && !s.cogs.includes(q.id)) s.cogs.push(q.id);
  G.cutscene(() => G.story.collected(q));
};

// ---------- battles ----------
G.startBattle = async ({ enemy = null, kind, level, edge = false, scripted = null }) => {
  if (G.mode !== 'world' || G.battle || G.starting) return;
  G.starting = true;
  if (enemy) {
    kind = enemy.kind; level = enemy.level; edge = !!enemy.edge;
    // the lesson (first Attack dodged, Bubble Blast hint) fires on your first fight, whichever fish it is
    scripted = enemy.stump ? 'stump' : !G.s.flags.tutorialDone && kind !== 'gar' ? 'tutorial' : null;
  }
  const bg = kind === 'gar' ? 'garpool' : kind === 'snarl' ? 'spillway' : (G.world.def.battleBg || 'shallows');
  // New Game+: the Gar remembers how the last run ended
  if (kind === 'gar') G.garMemory = (G.s.ngPlus || 0) >= 1 ? G.s.lastEnding : null;
  input.releaseAll();
  ui.hideHint();
  await G.transition(async () => {
    G.battle = new BattleScene(G, { kind, level, edge, scripted, bg, entity: enemy });
    G.mode = 'battle';
    showWorldUI(false);
    G.battle.setup();
    audio.playMusic(kind === 'gar' ? 'gar' : 'battle');
    audio.playAmbience(null);
  });
  G.starting = false;
  G.battle.begin();
};

// Rewards and level-ups (the battle scene shows them).
G.afterBattle = async (scene, result) => {
  const s = G.s, e = scene.enemy, lines = [];
  let levels = [];
  if (result === 'win' || result === 'friend') {
    const r = scene.battle.rewards;
    s.bb += r.bites;
    if (result === 'friend' && e.kind !== 'gar') {
      s.friends[e.kind] = (s.friends[e.kind] || 0) + 1;
      if (!s.firstFriendKinds[e.kind]) {
        s.firstFriendKinds[e.kind] = true;
        if (state.addItem(s, 'kelp', 1)) lines.push('Your new friend gives you a Kelp Snack!');
      }
    }
    // catch-up: below the level this area expects, fights give x1.5 EXP
    const want = CATCH_UP[G.world?.areaId] && CATCH_UP[G.world.areaId] + NGPLUS.bonus(s.ngPlus || 0);
    if (want && s.level < want) { r.exp = Math.floor(r.exp * CATCH_UP.mult); lines.push('Catch-up bonus! x1.5 EXP'); }
    levels = state.addExp(s, r.exp);
    for (const L of levels) if (LEVEL_UP_LINES[L]) lines.push(LEVEL_UP_LINES[L]);
    if (scene.entity) {
      G.world.enemies = G.world.enemies.filter((q) => q !== scene.entity);
      if (result === 'win') G.world.faints.push({ kind: e.kind, edge: e.edge, x: scene.entity.x, y: scene.entity.y, face: scene.entity.face, t: 0 });
      // the new friend stays, in its party hat, where you met it
      if (result === 'friend' && e.kind !== 'gar' && G.world.friends.length < WORLD.maxFriendsShown) {
        const q = scene.entity;
        G.world.friends.push({ kind: e.kind, x: q.x, y: q.y, hx: q.hx, hy: q.hy, tx: q.x, ty: q.y, face: -1, wait: 1, t: 0 });
      }
    }
    if (scene.battle.scripted === 'tutorial') s.flags.tutorialDone = true;
    if (e.kind === 'gar') {
      // an ending you haven't seen, or the first Gar result of this run (New Game+ plays it again)
      const firstThisRun = !s.flags.garDefeated && !s.flags.garFriend;
      G.pendingEnding = (firstThisRun || (result === 'friend' ? !s.endingsSeen.friend : !s.endingsSeen.fins)) ? (result === 'friend' ? 'friend' : 'fins') : null;
      if (result === 'friend') s.flags.garFriend = true; else s.flags.garDefeated = true;
      if (!s.ending) s.ending = result === 'friend' ? 'friend' : 'fins';
      s.lastEnding = result === 'friend' ? 'friend' : 'fins';
    }
    G.save();
  } else if (result === 'lose') {
    await G.defeat(scene);
  } else if (result === 'fled' || result === 'flared') {
    await G.leaveBattle(scene);
  }
  return { lines, levels };
};

G.leaveBattle = async (scene) => {
  if (scene.left) return; // never twice for one battle
  scene.left = true;
  const result = scene.battle.over;
  G.lastBattle = result;
  // Peace in the Paddies: its banner over the battle, before the world shows again
  if (result === 'friend' && !G.s.flags.peace && state.peaceDone(G.s)) await G.story.checkPeace();
  if (G.pendingEnding) {
    // the last battle fades straight into the ending: no world in between
    await fade(true);
    scene.end(); G.battle = null; G.mode = 'world'; showWorldUI(false);
    G.world.safeT = WORLD.safeAfterBattle;
    G.save();
    await G.story.afterBattle(result, scene);
    return;
  }
  await G.transition(async () => {
    scene.end();
    ui.hideHint(); // a battle tip shouldn't follow you back to the map
    G.battle = null;
    G.mode = 'world';
    showWorldUI(true);
    G.world.safeT = WORLD.safeAfterBattle;
    audio.playMusic(G.world.def.music);
    audio.playAmbience(G.world.def.ambience);
    if (result === 'fled' && scene.entity) { scene.entity.state = 'return'; scene.entity.cool = 4; scene.entity.avoid = true; }
    if (result === 'flared') {
      // flared at: it bolts away from you for a while, and drops a Betta Bite where it was
      const q = scene.entity || G.world.player;
      G.world.pickups.push({ type: 'bite', x: q.x, y: q.y, ph: 0 });
      if (scene.entity) { const en = scene.entity; en.state = 'return'; en.cool = 8; en.avoid = true; en.scaredT = WORLD.scaredTime; }
    }
  });
  G.save();
  if (result === 'friend' && scene.enemy.kind !== 'gar' && scene.battle.scripted !== 'stump' && !G.s.hints.friendMade) {
    G.s.hints.friendMade = true;
  }
  await G.story.afterBattle(result, scene);
  if (result === 'friend') await G.story.checkPeace();
};

G.defeat = async (scene) => {
  G.lastBattle = 'lose';
  await fade(true, STORY.rescued);
  const lost = state.defeatPenalty(G.s);
  scene.end();
  ui.hideHint();
  G.battle = null;
  const [area, entry] = REST[G.s.rest] || REST.village;
  G.world.safeT = 3;
  await G.enterArea(area, entry, { wipe: false, quiet: true });
  G.world.safeT = 3;
  await G.wait(400);
  await fade(false);
  G.toast(lost ? `You wake up refreshed. You lost ${lost} Betta Bites.` : 'You wake up, fully recovered.', 3000);
  audio.play('swim_away', { rate: 0.6 });
};

// ---------- the ending ----------
G.playEnding = async (kind) => {
  if (!$('fade').classList.contains('on')) await fade(true, '');
  G.mode = 'ending';
  showWorldUI(false);
  G.ending = { kind, t: 0, fx: new Particles() };
  audio.playMusic('ending');
  audio.playAmbience(null);
  await G.wait(300);
  await fade(false);
  await G.wait(800);
  for (const [who, line] of G.story.endingLines(kind)) await G.say(who, line);
  // hold the picture a moment with nothing over it, then the credits as a low band
  await G.wait(3500);
  await openCredits(kind);
  G.ending = null;
  G.endingParty = kind === 'friend';
  await G.enterArea('village', 'home', { wipe: true });
  G.endingParty = false;
  G.gameWon = true;
};

function drawEnding(dt) {
  const e = G.ending, v = G.view, t = (e.t += dt);
  const bgKey = e.kind === 'friend' ? (hasReal('bg_endfriend') ? 'bg_endfriend' : 'bg_title') : (hasReal('bg_endfins') ? 'bg_endfins' : 'bg_title');
  const bg = img(bgKey);
  ctx.fillStyle = '#123a66'; ctx.fillRect(0, 0, v.W, v.H);
  if (bg) ctx.drawImage(bg, Math.round((v.W - 864) / 2), Math.round(Math.min(0, (v.H - 400) * 0.35)), 864, 400);
  const s = G.s, hat = e.kind === 'friend';
  const y = Math.round(v.H * 0.62);
  const cast = [
    [fromCanvas(spriteCanvas('finn')), 0.12, -10, 1],
    [betta(PLAYER.armorStage(s.level), s.color, hat), 0.30, 0, 1],
    [plain('bubble'), 0.42, 18, 1],
    [fromCanvas(spriteCanvas('mossy')), 0.58, -6, -1],
    [fromCanvas(spriteCanvas('cap1')), 0.70, 14, -1],
    [fromCanvas(spriteCanvas('cap2')), 0.80, -14, -1],
    [fromCanvas(spriteCanvas('cap3')), 0.90, 10, -1],
  ];
  cast.forEach(([sp, fx, dy, face], i) => {
    if (!sp) return;
    const enter = Math.min(1, Math.max(0, t * 0.8 - i * 0.15));
    const x = Math.round(v.W * fx + (face < 0 ? (1 - enter) * 300 : 0));
    const hv = hat && i !== 1 && sp.canvas ? hatted('end' + i, sp.canvas) : sp;
    drawFish(ctx, hv, x, y + dy + Math.round(Math.sin(t * 2 + i) * 2) * 2, { s: 2, flip: face < 0, sway: Math.sin(t * 6 + i) });
  });
  if (hat) {
    const gv = hatted('garboss', img('garboss'));
    drawFish(ctx, gv, Math.round(v.W * 0.62), Math.round(v.H * 0.25), { s: 1, flip: true, sway: Math.sin(t * 3) });
    if (Math.random() < dt * 3) e.fx.confetti(Math.random() * v.W, -5, 12, 2);
    if (Math.random() < dt * 0.8) e.fx.balloons(Math.random() * v.W, v.H + 20, 2, 2, 40);
  } else if (Math.random() < dt * 2) e.fx.golden(Math.random() * v.W, v.H, 4, 2);
  e.fx.update(dt);
  e.fx.draw(ctx);
}

// ---------- the world's UI ----------
function showWorldUI(on) {
  document.body.classList.toggle('inbattle', G.mode === 'battle');
  $('hud').hidden = !on;
  $('topbtns').hidden = !(on || G.mode === 'battle');
  $('bHome').hidden = !on;
  $('bPause').hidden = !on;
  $('touch').hidden = !(on && input.isTouch);
  if (!on) { $('prompt').hidden = true; $('talkbtn').hidden = true; }
}
let hudKey = '';
let sceneBtns = null;
function updateHud() {
  const busyNow = G.busy() || !$('dialog').hidden;
  if (busyNow !== sceneBtns) { sceneBtns = busyNow; $('bHome').style.visibility = $('bPause').style.visibility = busyNow ? 'hidden' : ''; }
  const s = G.s;
  const key = [s.name, s.level, s.hp, s.mp, s.bb, s.color, s.wearHat].join('|');
  if (key === hudKey) return;
  hudKey = key;
  $('hudName').textContent = s.name;
  $('hudLv').textContent = 'Lv ' + s.level + ((s.ngPlus || 0) >= 1 ? '+' : '');
  const hm = PLAYER.maxHp(s.level), mm = PLAYER.maxMp(s.level);
  $('hudHp').style.width = (100 * s.hp / hm) + '%'; $('hudHpT').textContent = `${s.hp}/${hm}`;
  $('hudMp').style.width = (100 * s.mp / mm) + '%'; $('hudMpT').textContent = `${s.mp}/${mm}`;
  $('hudBB').textContent = `${s.bb} BB`;
  drawPortrait($('hudPortrait'), G.playerCanvas());
}
let promptKey = '';
function updatePrompt() {
  const it = G.canTalkNow() ? G.world.interactTarget() : null;
  const key = it ? it.kind + (it.ref?.id || it.ref?.kind || '') + input.device : '';
  if (key === promptKey) return;
  promptKey = key;
  if (input.isTouch && G.mode === 'world') $('talkbtn').hidden = !it;
  if (!it || input.device === 'touch') { $('prompt').hidden = true; return; }
  let who = 'Talk';
  if (it.kind === 'npc' || it.kind === 'extra') who = 'Talk to ' + (SPEAKERS[it.ref.id === 'bubbleHome' ? 'bubble' : it.ref.id]?.name || 'them');
  if (it.kind === 'gate') who = 'Look';
  if (it.kind === 'look') who = LOOKS[it.ref.id]?.label || 'Look';
  if (it.kind === 'door') who = 'Enter ' + (ROOMS[it.ref.to]?.name.replace(/^The /, 'the ') || '');
  if (it.kind === 'friend') who = 'Talk to your friend';
  if (it.kind === 'bubble') who = 'Talk to Bubble';
  $('prompt').innerHTML = `<span>${label('talk')} ${escapeHtml(who)}</span>`;
  $('prompt').hidden = false;
  if (!G.s.hints.talk) { G.s.hints.talk = true; }
}
async function interact() {
  const it = G.world.interactTarget();
  if (!it) return;
  input.releaseAll();
  if (it.kind === 'door') { if (!G.leaving) { G.leaving = true; G.enterRoom(it.ref.to).finally(() => { G.leaving = false; }); } return; }
  const p = G.world.player;
  if (Math.abs(it.x - p.x) > 4) p.face = it.x > p.x ? 1 : -1;
  if (it.ref && 'face' in it.ref && it.kind !== 'gate') it.ref.face = p.x > it.ref.x ? 1 : -1;
  p.vx = 0; p.vy = 0;
  if (it.ref && it.kind !== 'gate') {
    const d = Math.hypot(p.x - it.x, p.y - it.y);
    if (d < 26) { const k = (26 - d) / (d || 1); const nx = p.x + (p.x - it.x || -p.face) * k, ny = p.y + (p.y - it.y) * k; if (G.world.free(nx + p.face * 8, ny, 7)) { p.x = nx; p.y = ny; } }
  }
  await G.cutscene(() => G.story.talk(it));
  G.save();
}

// ---------- the title ----------
const titleFish = { x: 0, y: 0, t: 0, face: 1 };
const titleFx = new Particles();
function drawTitle(dt) {
  const v = G.view;
  titleFish.t += dt;
  const bg = img('bg_title');
  ctx.fillStyle = '#123a66'; ctx.fillRect(0, 0, v.W, v.H);
  const bx = Math.round((v.W - 864) / 2), by = Math.round(Math.min(0, (v.H - 400) * 0.35));
  if (bg) ctx.drawImage(bg, bx, by, 864, 400);
  // the village picture in an oval, x2, in the calm patch mid-right
  const home = img('bettahome');
  // on short phone screens the menu column is wide: picture and betta move right
  const shortScr = document.body.classList.contains('short');
  const ox = Math.round(v.W * (shortScr ? 0.79 : 0.70)), oy = Math.round(v.H * 0.48);
  if (home) {
    if (!G.titleOval) {
      const c = document.createElement('canvas'); c.width = 96; c.height = 60;
      const g = c.getContext('2d');
      g.drawImage(home, 6, 0, 96, 60, 0, 0, 96, 60);
      const d = g.getImageData(0, 0, 96, 60);
      for (let y = 0; y < 60; y++) for (let x = 0; x < 96; x++) {
        const k = ((x - 47.5) / 47) ** 2 + ((y - 29.5) / 29) ** 2;
        const i = (y * 96 + x) * 4;
        if (k > 1) d.data[i + 3] = 0;
        else if (k > 0.86) { d.data[i] = 0x9F; d.data[i + 1] = 0xD8; d.data[i + 2] = 0xE0; d.data[i + 3] = 255; }
        else if (k > 0.8) { d.data[i] = 0x0B; d.data[i + 1] = 0x14; d.data[i + 2] = 0x24; d.data[i + 3] = 255; }
      }
      g.putImageData(d, 0, 0);
      G.titleOval = c;
    }
    ctx.drawImage(G.titleOval, ox - 96, oy - 60, 192, 120);
    // a code-drawn ring of bubbles and reeds
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2 + titleFish.t * 0.15;
      pixelBubble(ctx, ox + Math.cos(a) * 110, oy + Math.sin(a) * 70, 2 + (i % 2) * 2, '#CFF4FF');
    }
    const tuft = img('tuft');
    if (tuft) for (const fxp of [-70, -20, 40, 80]) ctx.drawImage(tuft, ox + fxp - tuft.width, oy + 52 - tuft.height * 2 + 10, tuft.width * 2, tuft.height * 2);
  }
  // the player's betta swims in front
  const s = G.titleSave || null;
  const stage = s ? PLAYER.armorStage(s.level) : 0, color = s ? s.color : 'red';
  const t = titleFish.t;
  const fx = Math.round(v.W * (shortScr ? 0.6 : 0.42) + Math.sin(t * 0.35) * v.W * (shortScr ? 0.05 : 0.08)), fy = Math.round(v.H * 0.62 + Math.sin(t * 0.9) * 8);
  const face = Math.cos(t * 0.35) >= 0 ? 1 : -1;
  let fv = betta(stage, color, s?.wearHat);
  if (stage === 0 && !s?.wearHat) fv = bettaSwim([0, 1, 0, 3][Math.floor(t * 7) % 4], color) || fv;
  drawFish(ctx, fv, fx, fy, { s: 2, flip: face < 0, sway: hasReal('anim_swim0') && stage === 0 ? 0 : Math.sin(t * 8) * 1.2 });
  if (Math.random() < dt * 3) titleFx.bubbles(fx - face * 40, fy - 6, 1, { r: [1, 3], up: 24 });
  titleFx.update(dt); titleFx.draw(ctx);
}

function openTitle() {
  G.mode = 'title';
  const last = state.lastSlot();
  G.titleSave = last ? state.loadSlot(last) : null;
  showWorldUI(false);
  $('battleui').hidden = true;
  const m = $('titleMenu');
  m.innerHTML = '';
  // Continue: the last-played slot; New Game+ when that slot has finished an ending
  if (G.titleSave) m.append(button('Continue', () => continueGame(last), 'btn primary'));
  if (state.finishedGame(G.titleSave)) m.append(button('New Game+', () => openSlots('ngplus', last)));
  m.append(button('New Game', () => {
    // nothing saved yet: straight to Create in slot 1; otherwise choose the slot
    if (!state.SLOTS.some((n) => state.slotExists(n))) { G.newSlot = 1; openCreate(); } else openSlots('new');
  }, 'btn' + (G.titleSave ? '' : ' primary')));
  if (state.SLOTS.some((n) => state.slotExists(n))) m.append(button('Load', () => openSlots('load')));
  m.append(button('How to play', () => openHowTo()));
  m.append(button('Settings', () => openSettings()));
  updateTitlePress();
  show('title');
  updateMute();
  nav.push({ id: 'title', el: screenEl('title') });
  audio.playMusic('title');
  audio.playAmbience(null);
}
function updateTitlePress() {
  const p = $('titlePress');
  if (!p) return;
  p.textContent = input.padSeen ? '' : input.isTouch ? '' : 'Press any key or button';
  p.hidden = !p.textContent;
}
const screenEl = ui.screenEl;

async function continueGame(slot) {
  const s = state.loadSlot(slot);
  if (!s) return;
  G.s = s;
  G.slot = slot;
  for (const id of ['title', 'slots']) { hide(id); nav.remove(id); }
  G.worldRng = makeRng(Date.now() & 0xffff);
  try {
    // a position that isn't open water falls back to the area's main entry
    let pos = s.pos;
    if (pos && !G.world) G.world = new World(G);
    if (pos) { const t = terrainFor(s.area); const { isWater } = await import('./terrain.js'); if (!isWater(t, pos.x, pos.y)) pos = null; }
    await G.enterArea(s.area, pos || Object.keys(MAPS[s.area].entries)[0]);
    const w = G.world, wp = w.player;
    if (pos && !w.free(wp.x + wp.face * 8, wp.y, 7)) w.load(s.area, MAPS[s.area].interior ? 'door' : Object.keys(MAPS[s.area].entries)[0]);
  } catch (e) {
    console.warn('Continue fell back to the village', e);
    G.wipe = null;
    await G.enterArea('village', 'home', { wipe: false });
  }
}

// ---------- save slots: Load, New Game, New Game+ ----------
const firstEmptySlot = () => state.SLOTS.find((n) => !state.slotExists(n)) || null;
const AREA_SHORT = { village: 'Paddy Village', shallows: 'The Shallows', reedwater: 'Reedwater', highwater: 'Highwater', murk: 'The Murk', ditch: 'The Sunken Ditch' };
function whenPlayed(ms) {
  if (!ms) return '';
  const d = Math.round((Date.now() - ms) / 60000);
  if (d < 1) return 'just now';
  if (d < 60) return `${d} min ago`;
  if (d < 60 * 24) return `${Math.round(d / 60)} h ago`;
  return new Date(ms).toLocaleDateString();
}
const levelText = (lv, ng) => (ng ? `Level ${lv}+` : `Level ${lv}`);
// mode: 'load' (Play / New Game+ / Delete), 'new' (pick a slot for a new game), 'ngplus' (pick a slot; from = source)
function openSlots(mode, from = null) {
  G.slotMode = mode; G.slotFrom = from;
  $('slotsTitle').textContent = { load: 'Load', new: 'New Game: choose a slot', ngplus: 'New Game+: choose a slot' }[mode];
  $('slotNote').textContent = mode === 'ngplus' ? 'Your finished game stays in its slot.' : '';
  const list = $('slotList');
  list.innerHTML = '';
  const empty = firstEmptySlot();
  for (const n of state.SLOTS) {
    const info = state.slotInfo(n);
    const row = el('div', 'slotrow');
    const c = document.createElement('canvas'); c.width = 48; c.height = 48; c.className = 'portrait';
    const txt = el('div', 'slotinfo');
    if (info.empty) { drawPortrait(c, null); txt.innerHTML = `<b>Slot ${n}</b><span class="note">Empty</span>`; }
    else if (info.unreadable) { drawPortrait(c, null); txt.innerHTML = `<b>Slot ${n}</b><span class="warn">Can't read this save</span>`; }
    else {
      drawPortrait(c, betta(PLAYER.armorStage(info.level), info.color, false)?.canvas);
      const end = info.endings.length ? ` · Endings: ${info.endings.map((k) => (k === 'friend' ? 'friendship' : 'fins')).join(', ')}` : '';
      txt.innerHTML = `<b>Slot ${n}: ${escapeHtml(info.name)}</b><span>${levelText(info.level, info.ngPlus)}${info.ngPlus ? ` · NG+&nbsp;${info.ngPlus}` : ''} · ${ROOMS[info.area] ? `${AREA_SHORT[areaOf(info.area)]}: ${ROOMS[info.area].name}` : AREA_SHORT[info.area]} · Friends&nbsp;${info.friends}${end}</span><span class="note">${whenPlayed(info.lastPlayed)}</span>`;
    }
    const btns = el('div', 'slotbtns');
    const add = (label, fn, cls = 'btn') => btns.append(button(label, fn, cls));
    if (mode === 'load') {
      if (!info.empty && !info.unreadable) add('Play', () => continueGame(n), 'btn primary');
      if (info.finished) add('New Game+', () => openSlots('ngplus', n));
      if (!info.empty) add('Delete', async () => {
        if (await G.confirm(info.unreadable ? `Delete the unreadable save in slot ${n}?` : `Delete ${info.name}'s game (${levelText(info.level, info.ngPlus)})? This can't be undone.`)) { state.deleteSlot(n); openSlots('load'); }
      });
    } else if (mode === 'new') {
      add(info.empty ? 'New game here' : 'Overwrite', async () => {
        if (!info.empty && !(await G.confirm(info.unreadable ? `Overwrite the unreadable save in slot ${n}?` : `Overwrite ${info.name}'s game (${levelText(info.level, info.ngPlus)})?`))) return;
        G.newSlot = n; hide('slots'); nav.remove('slots'); openCreate();
      }, 'btn' + (n === empty ? ' primary' : ''));
    } else {
      // New Game+: an empty slot first; a used one asks; the finished game itself asks twice
      const label = n === from ? 'Replace this game' : info.empty ? 'Start here' : 'Overwrite';
      add(label, () => startNgPlus(from, n), 'btn' + (n === empty ? ' primary' : ''));
    }
    row.append(c, txt, btns);
    list.append(row);
  }
  hide('title'); nav.remove('title');
  show('slots');
  const back = () => { hide('slots'); nav.remove('slots'); openTitle(); };
  $('slotsBack').onclick = (e) => { e.stopPropagation(); audio.blip('back'); back(); };
  nav.push({ id: 'slots', el: screenEl('slots'), back, initial: () => $('slotList').querySelector('.btn.primary') || $('slotList').querySelector('.btn') });
}
async function startNgPlus(from, to, { skipConfirm = false } = {}) {
  const src = state.loadSlot(from);
  if (!state.finishedGame(src)) return false;
  const k = NGPLUS.bonus((src.ngPlus || 0) + 1);
  if (!skipConfirm) {
    const info = state.slotInfo(to);
    if (to !== from && !info.empty && !(await G.confirm(info.unreadable ? `Overwrite the unreadable save in slot ${to}?` : `Overwrite ${info.name}'s game (${levelText(info.level, info.ngPlus)})?`))) return false;
    if (to === from && !(await G.confirm('This replaces your finished game. Start New Game+ over it?'))) return false;
    if (!(await G.confirm(`New Game+ ${(src.ngPlus || 0) + 1} in slot ${to}. Carries over: your level, EXP, Betta Bites, items, the submarine, your hat and endings. Starts again: the story, friends, scales, cogs and rest points. Every fish is ${k} levels tougher.`))) return false;
  }
  await beginStory(state.ngPlusFrom(src), to, 'slots');
  return true;
}

// ---------- create your betta ----------
let createColor = 'red';
function openCreate() {
  hide('title'); nav.remove('title');
  G.mode = 'create';
  const sw = $('swatches');
  sw.innerHTML = '';
  for (const c of PLAYER.colors) {
    const b = button(`<i style="background:${PLAYER_COLORS[c].swatch}"></i>`, () => { createColor = c; markSwatch(); }, 'btn swatch');
    b.dataset.color = c;
    b.setAttribute('aria-label', COLOR_NAMES[c]);
    sw.append(b);
  }
  createColor = 'red';
  markSwatch();
  $('nameIn').value = '';
  show('create');
  nav.push({ id: 'create', el: screenEl('create'), back: () => { hide('create'); nav.remove('create'); openTitle(); }, initial: '#createGo',
    keys: (ev) => {
      if (ev.fromField) { $('nameIn').blur(); nav.setFocus($('createGo')); return true; }
      return false;
    } });
}
function markSwatch() { for (const b of $('swatches').children) b.classList.toggle('sel', b.dataset.color === createColor); }
function cleanName(v) { return v.replace(/[^A-Za-z0-9 '\-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 12); }
function drawCreatePreview(dt) {
  const c = $('createPreview'); if (!c || screenEl('create').hidden) return;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  g.fillStyle = '#1D3049'; g.fillRect(0, 0, 120, 84);
  const t = performance.now() / 1000;
  const v = bettaSwim([0, 1, 0, 3][Math.floor(t * 7) % 4], createColor) || betta(0, createColor);
  drawFish(g, v, 60, 42 + Math.round(Math.sin(t * 2)) * 2, { s: 2, flip: false });
}
async function startNewGame() {
  let name = cleanName($('nameIn').value);
  if (!name) name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const slot = G.newSlot || firstEmptySlot() || 1;
  G.newSlot = null;
  await beginStory(state.newSave(name, createColor), slot, 'create');
}
// Village start, Elder Finn's opening: a new game or a New Game+.
async function beginStory(s, slot, fromScreen) {
  G.s = s;
  G.slot = slot;
  nav.remove(fromScreen);
  G.worldRng = makeRng(1001);
  G.battleRng = makeRng(2002);
  await fade(true);
  hide(fromScreen);
  G.save();
  await G.enterArea('finnHouse', 'start', { wipe: false, quiet: true });
  await fade(false);
  G.toast(ROOMS.finnHouse.name, 1600);
  G.cutscene(() => G.story.opening());
}

// ---------- confirm, banner ----------
G.confirm = (text) => new Promise((resolve) => {
  $('confirmText').textContent = text;
  show('confirm');
  const done = (v) => { hide('confirm'); nav.remove('confirm'); resolve(v); };
  $('confirmYes').onclick = (e) => { e.stopPropagation(); audio.blip('select'); done(true); };
  $('confirmNo').onclick = (e) => { e.stopPropagation(); audio.blip('back'); done(false); };
  nav.push({ id: 'confirm', el: screenEl('confirm'), back: () => done(false), initial: '#confirmNo' });
});
G.bigBanner = (title, text) => new Promise((resolve) => {
  $('bigTitle').textContent = title; $('bigText').textContent = text;
  show('banner');
  audio.play('fanfare');
  const fx = G.world?.fx;
  if (fx) for (let i = 0; i < 4; i++) fx.confetti(G.world.player.x + (i - 2) * 60, G.world.player.y - 80, 30, 1);
  const done = () => { hide('banner'); nav.remove('banner'); resolve(); };
  $('bigOk').onclick = (e) => { e.stopPropagation(); audio.blip('select'); done(); };
  nav.push({ id: 'banner', el: screenEl('banner'), back: done });
});

// ---------- shop and inn ----------
G.openShop = (who) => new Promise((resolve) => {
  const pip = who === 'pip';
  $('shopTitle').textContent = pip ? "Pip's Stall" : 'Fish Mart';
  $('shopMsg').textContent = '';
  const build = () => {
    const s = G.s, list = $('shopList');
    const f = nav.focused()?.dataset?.k;
    list.innerHTML = '';
    const goods = pip ? ['seedcake', 'fizzy', 'kelp', 'bwater'] : ['kelp', 'bwater'];
    for (const k of goods) {
      const it = ITEMS[k];
      const full = (s.items[k] || 0) >= ITEM_MAX, can = s.bb >= it.price && !full;
      const b = button(`<img class="ico" src="${img(it.icon)?.toDataURL()}" alt=""><span class="nm">${it.name} <small>(${it.hp ? '+' + it.hp + ' HP' : '+' + it.mp + ' MP'}, have ${s.items[k] || 0})</small></span><span class="pr">${it.price} BB</span>`,
        () => buy(k), 'btn item' + (can ? '' : ' dim'));
      b.dataset.k = k;
      list.append(b);
    }
    if (!pip && s.flags.highwater) {
      const can = s.bb >= SUB_PRICE && !s.subOwned;
      const b = button(`<img class="ico" src="${img('sub')?.toDataURL()}" alt=""><span class="nm">Dunkleosteus Submarine <small>${s.subOwned ? '(yours)' : '(-4 to every hit, and the Gar\'s special does nothing)'}</small></span><span class="pr">${s.subOwned ? 'Owned' : SUB_PRICE + ' BB'}</span>`,
        () => buy('sub'), 'btn item' + (can ? '' : ' dim'));
      b.dataset.k = 'sub';
      list.append(b);
    }
    $('shopBB').textContent = `Your Betta Bites: ${s.bb}`;
    const again = [...list.children].find((b) => b.dataset.k === f);
    if (again) nav.setFocus(again, false);
  };
  const buy = (k) => {
    const s = G.s;
    if (k === 'sub') {
      if (s.subOwned) { $('shopMsg').textContent = 'It\'s already yours!'; audio.blip('buzz'); return; }
      if (s.bb < SUB_PRICE) { $('shopMsg').textContent = "You don't have enough Betta Bites!"; audio.blip('buzz'); return; }
      s.bb -= SUB_PRICE; s.subOwned = true;
      audio.play('buy');
      $('shopMsg').textContent = 'The ancient submarine is yours! Dive into it in battle.';
    } else {
      const it = ITEMS[k];
      if ((s.items[k] || 0) >= ITEM_MAX) { $('shopMsg').textContent = `You can carry ${ITEM_MAX} at most.`; audio.blip('buzz'); return; }
      if (s.bb < it.price) { $('shopMsg').textContent = "You don't have enough Betta Bites!"; audio.blip('buzz'); return; }
      s.bb -= it.price; state.addItem(s, k, 1);
      audio.play('buy');
      $('shopMsg').textContent = `Bought a ${it.name}.`;
    }
    G.save();
    build();
  };
  build();
  show('shop');
  const done = () => { hide('shop'); nav.remove('shop'); resolve(); };
  $('shopDone').onclick = (e) => { e.stopPropagation(); audio.blip('back'); done(); };
  const opened = performance.now();
  nav.push({ id: 'shop', el: screenEl('shop'), back: done, keys: (ev) => performance.now() - opened < 300 && (ev.menu === 'confirm' || ev.action === 'talk') });
});

G.innOffer = async (inn) => {
  const s = G.s;
  const free = !s.freeRest[inn];
  const broke = s.bb < INN_PRICE;
  const opt = free ? 'Rest (free tonight)' : broke ? 'Rest (pay me next time)' : `Rest (${INN_PRICE} Betta Bites)`;
  const c = await G.say(inn === 'village' ? 'seaweed' : 'kelpie', 'Would you like to rest? It fully restores your HP and MP.', [opt, 'Maybe later']);
  if (c !== 0) return;
  if (!free && !broke) s.bb -= INN_PRICE;
  s.freeRest[inn] = true;
  await fade(true, 'Zzz...');
  audio.play('inn');
  s.hp = PLAYER.maxHp(s.level); s.mp = PLAYER.maxMp(s.level);
  s.rest = inn;
  await G.wait(700);
  await fade(false);
  G.save();
  await G.say(inn === 'village' ? 'seaweed' : 'kelpie', broke && !free ? 'Rest well, dear. Pay me next time.' : 'You rest peacefully in the soft kelp beds. You feel completely refreshed!');
};

// ---------- pause ----------
let pausePage = null;
function openPause(page = null) {
  if (G.mode !== 'world' && G.mode !== 'battle') return;
  if (G.busy() || !$('dialog').hidden || G.wipe) return; // never in the middle of a scene
  if (nav.has('pause')) { if (page) showPausePage(page); return; }
  window.gameReport?.snapshot();
  input.releaseAll();
  audio.duck(true);
  const inBattle = G.mode === 'battle';
  $('pauseGoal').textContent = goalLine(G.s);
  const m = $('pauseMenu');
  m.innerHTML = '';
  const add = (t, f, id) => { const b = button(t, f); if (id) b.dataset.page = id; m.append(b); return b; };
  add('Resume', () => closePause());
  if (!inBattle) add('Items', () => showPausePage('items'), 'items');
  add('Friends', () => showPausePage('friends'), 'friends');
  add('How to play', () => openHowTo());
  add('Settings', () => openSettings());
  if (window.gameReport?.shown()) add('Report a bug', () => window.gameReport.open());
  if (!inBattle && state.friendsTotal(G.s) > 0) add(G.s.wearHat ? 'Take off party hat' : 'Wear party hat', (e) => { G.s.wearHat = !G.s.wearHat; e.currentTarget.textContent = G.s.wearHat ? 'Take off party hat' : 'Wear party hat'; G.save(); });
  if (!inBattle) add('Save & quit to title', () => { G.save(); closePause(); quitToTitle(); });
  $('padLost').hidden = !G.padLost;
  show('pause');
  nav.push({ id: 'pause', el: screenEl('pause'), back: () => closePause() });
  showPausePage(page || (inBattle ? 'friends' : 'items'), !!page);
}
function closePause() {
  hide('pause'); nav.remove('pause');
  audio.duck(false);
  G.padLost = false;
  pausePage = null;
  window.gameReport?.resumed();
}
function showPausePage(page, focusPage = false) {
  pausePage = page;
  const p = $('pausePage');
  p.innerHTML = '';
  const s = G.s;
  if (page === 'items') {
    p.append(el('h3', '', 'Items'));
    const bars = el('div', 'hudtext', `<div class="bar hp"><i style="width:${100 * s.hp / PLAYER.maxHp(s.level)}%"></i><b>${s.hp}/${PLAYER.maxHp(s.level)}</b></div><div class="bar mp"><i style="width:${100 * s.mp / PLAYER.maxMp(s.level)}%"></i><b>${s.mp}/${PLAYER.maxMp(s.level)}</b></div>`);
    p.append(bars);
    const list = el('div', 'list');
    for (const k of ITEM_ORDER) {
      const it = ITEMS[k];
      const b = button(`<img class="ico" src="${img(it.icon)?.toDataURL()}" alt=""><span class="nm">${it.name} <small>${it.hp ? '+' + it.hp + ' HP' : '+' + it.mp + ' MP'}</small></span><span class="pr">×${s.items[k] || 0}</span>`, () => {
        const r = state.useItem(G.s, k);
        if (r.ok) { audio.play('item'); G.save(); } else audio.blip('buzz');
        showPausePage('items');
        G.toast(r.text, 1400);
        const again = [...$('pausePage').querySelectorAll('.btn')].find((x) => x.dataset.k === k);
        if (again) nav.setFocus(again, false);
      }, 'btn item' + ((s.items[k] || 0) ? '' : ' dim'));
      b.dataset.k = k;
      list.append(b);
    }
    p.append(list);
    const extra = [];
    if (s.subOwned) extra.push('Dunkleosteus Submarine');
    if (s.flags.lantern) extra.push('Glow-moss lantern, drain-gate key');
    if (s.scales.length && !s.flags.trailFound) extra.push(`Strange scales ${s.scales.length}/5`);
    if (s.flags.lantern && !s.flags.gateOpen) extra.push(`Brass cogs ${s.cogs.length}/3`);
    if (extra.length) p.append(el('p', 'note', escapeHtml(extra.join(' · '))));
  } else if (page === 'friends') {
    const total = state.friendsTotal(s);
    p.append(el('h3', '', `Friends ${total}${s.flags.peace ? ' · Peace in the Paddies!' : ''}`));
    const grid = el('div', 'friends');
    for (const k of REGULAR_KINDS) {
      const n = s.friends[k] || 0;
      const f = el('div', 'friend' + (n >= PEACE_PER_KIND ? ' done' : ''));
      const c = document.createElement('canvas'); c.width = 48; c.height = 48;
      const v = n ? hatted(ENEMIES[k].sprite) : plain(ENEMIES[k].sprite);
      const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
      g.fillStyle = '#2B7FC4'; g.fillRect(0, 0, 48, 48);
      if (v) { if (!n) g.globalAlpha = 0.35; const sc = v.canvas.width > 40 ? 1 : 1; g.drawImage(v.canvas, Math.round((48 - v.canvas.width * sc) / 2), Math.round((48 - v.canvas.height * sc) / 2), v.canvas.width * sc, v.canvas.height * sc); g.globalAlpha = 1; }
      f.append(c, el('span', '', `${escapeHtml(n ? ENEMIES[k].name : '???')}<br>${Math.min(n, PEACE_PER_KIND)}/${PEACE_PER_KIND}${n > PEACE_PER_KIND ? ` (${n})` : ''}`));
      grid.append(f);
    }
    const gf = el('div', 'friend' + (s.flags.garFriend ? ' done' : ''));
    const gc = document.createElement('canvas'); gc.width = 48; gc.height = 48;
    const gg = gc.getContext('2d'); gg.imageSmoothingEnabled = false; gg.fillStyle = '#2B7FC4'; gg.fillRect(0, 0, 48, 48);
    const gimg = s.flags.garFriend ? img('garsmallh') : img('garsmall');
    if (gimg) { if (!s.flags.garFriend) gg.globalAlpha = 0.35; gg.drawImage(gimg, Math.round((48 - gimg.width) / 2), Math.round((48 - gimg.height) / 2)); }
    gf.append(gc, el('span', '', s.flags.garFriend ? 'The Gar<br>friend!' : '???<br>lonely shadow'));
    grid.append(gf);
    p.append(grid);
    p.append(el('p', 'note', `Peace in the Paddies: befriend ${PEACE_PER_KIND} of each kind. Gar party: ${total >= 5 ? `ready (Friends ${total})` : `Friends ${total}/5`}.`));
  } else {
    p.append(el('h3', '', escapeHtml(G.s.name)));
    p.append(el('p', 'note', `Level ${s.level} · EXP ${s.exp}/${s.level < 10 ? PLAYER.expToNext(s.level) : '-'} · ${s.bb} Betta Bites`));
  }
  for (const b of $('pauseMenu').children) b.classList.toggle('primary', b.dataset.page === page);
  if (focusPage) { const f = p.querySelector('.btn'); if (f) nav.setFocus(f, false); }
}
// End whatever scene is running: lines shown or queued, cutscene waits, battle.
function endScene() {
  ui.resetDialogs();
  G.busyCount = 0;
  G.waits = [];
  G.starting = false;
  G.leaving = false;
  if (G.battle) { G.battle.end(); G.battle = null; }
}
async function quitToTitle() {
  await fade(true);
  endScene();
  G.world = null; G.battle = null;
  openTitle();
  await fade(false);
}

// ---------- settings ----------
function openSettings() {
  const list = $('setList');
  list.innerHTML = '';
  const as = audio.audioSettings();
  const slider = (lbl, kind) => {
    const r = el('div', 'setrow');
    const inp = document.createElement('input');
    inp.type = 'range'; inp.min = 0; inp.max = 1; inp.step = 0.1; inp.value = as[kind];
    inp.setAttribute('aria-label', lbl);
    inp.addEventListener('input', () => { audio.setVolume(kind, +inp.value); saveSettings(); if (kind === 'sfx') audio.play('bite'); });
    r.append(el('span', '', lbl), inp);
    list.append(r);
  };
  slider('Music volume', 'music');
  slider('Sound volume', 'sfx');
  const mute = button('', () => { audio.toggleMute(); saveSettings(); refresh(); updateMute(); });
  const vib = button('', () => { G.settings.vibration = !G.settings.vibration; saveSettings(); refresh(); if (G.settings.vibration) G.vibrate(150, 0.6); });
  const par = button('', () => { G.settings.parade = G.settings.parade === false; saveSettings(); refresh(); G.world?.buildParade?.(); });
  const refresh = () => {
    mute.textContent = audio.audioSettings().muted ? 'Sound: off (muted)' : 'Sound: on';
    vib.textContent = G.settings.vibration ? 'Vibration: on' : 'Vibration: off';
    par.textContent = G.settings.parade === false ? 'Parade: off' : 'Parade: on';
  };
  refresh();
  list.append(mute, vib, par, button('Controls', () => openControls()));
  if (window.gameReport?.shown()) list.append(button('Report a bug', () => window.gameReport.open()));
  show('settings');
  const done = () => { hide('settings'); nav.remove('settings'); };
  $('setDone').onclick = (e) => { e.stopPropagation(); audio.blip('back'); done(); };
  nav.push({ id: 'settings', el: screenEl('settings'), back: done });
}

// ---------- controls ----------
let capturing = null;
function openControls() {
  const build = () => {
    const g = $('ctlList');
    const f = nav.focused()?.dataset?.slot;
    g.innerHTML = '';
    for (let h = 0; h < 2; h++) g.append(el('b', '', 'Action'), el('b', '', 'Key'), el('b', '', 'Key 2'), el('b', '', 'Controller'));
    for (const a of input.controls.actions()) {
      g.append(el('span', '', escapeHtml(a.name) + (a.fixed ? ' <small class="note">(fixed)</small>' : '')));
      for (const slot of [0, 1]) {
        const k = a.keys[slot];
        if (a.fixed) { g.append(el('span', '', k ? keyCap(k) : '')); continue; }
        const b = button(k ? keyCap(k) : '<small>Add</small>', () => startCapture('key', a.id, slot), 'btn');
        b.dataset.slot = a.id + 'k' + slot;
        g.append(b);
      }
      if (a.fixed) { g.append(el('span', '', a.pad.length ? padCap(a.pad[0]) : '')); continue; }
      const pb = button(a.pad.length ? padCap(a.pad[0]) : '<small>None</small>', () => startCapture('pad', a.id, 0), 'btn');
      pb.dataset.slot = a.id + 'p';
      g.append(pb);
    }
    const again = [...g.querySelectorAll('.btn')].find((b) => b.dataset.slot === f);
    if (again) nav.setFocus(again, false);
  };
  const note = [];
  note.push('Menus always use Enter, Space or ✕ to choose and Esc, Backspace or ○ to go back.'.replace('✕', 'A/✕').replace('○', 'B/○'));
  if (window.gameReport?.shown()) note.push('Ctrl+Shift+F: report a bug.');
  if (input.padConnected && !input.padStandard()) note.push('Controllers work best in Chrome or Edge.');
  if (input.isTouch) note.push('Touch controls (the stick, Talk and the on-screen buttons) stay as they are.');
  $('ctlNote').textContent = note.join(' ');
  $('ctlMsg').textContent = 'Choose a key to change it.';
  const startCapture = (kind, action, slot) => {
    $('ctlMsg').textContent = kind === 'key' ? `Press a key for ${input.controls.actions().find((a) => a.id === action).name} (Esc cancels)` : 'Press a button (hold ○/B to cancel)';
    // listen only after the press that chose it is released
    setTimeout(() => {
      let downAt = 0;
      capturing = { kind, action, slot };
      input.capture = (k, v) => {
        if (k === 'key' && kind === 'key') {
          if (v === 'Escape') { endCapture('Cancelled.'); return; }
          // menu keys stay menu keys (Talk may keep Space), so no one can lock themselves out
          if (['Enter', 'NumpadEnter', 'Backspace'].includes(v) || (v === 'Space' && action !== 'talk')) { endCapture(`${keyCap(v)} is kept for menus.`); return; }
          const other = input.controls.bindKey(action, slot, v);
          endCapture(other === false ? "That key can't be used." : other ? `${keyCap(v)} was ${escapeHtml(actName(other))}'s; ${escapeHtml(actName(other))} now has ${keyNames(other)}.` : 'Saved.');
        } else if (k === 'pad' && kind === 'pad') {
          if (v === 1 && performance.now() - downAt > 900) { endCapture('Cancelled.'); return; }
          if (v === 1 || v === 9 || (v === 0 && action !== 'talk')) { endCapture(`${padCap(v)} is kept for menus.`); return; }
          const other = input.controls.bindPad(action, slot, v);
          endCapture(other === false ? "That button can't be used." : other ? `That button was ${actName(other)}'s; they swapped.` : 'Saved.');
        } else if (k === 'key' && v === 'Escape') endCapture('Cancelled.');
      };
      downAt = performance.now();
    }, 180);
  };
  const actName = (id) => input.controls.actions().find((a) => a.id === id)?.name || id;
  const keyNames = (id) => input.controls.keys(id).map((k) => keyCap(k)).join(' ');
  const endCapture = (msg) => { capturing = null; input.capture = null; $('ctlMsg').innerHTML = msg; audio.blip('select'); build(); };
  build();
  show('controls');
  const done = () => { if (capturing) { endCapture('Cancelled.'); return; } hide('controls'); nav.remove('controls'); };
  $('ctlDone').onclick = (e) => { e.stopPropagation(); audio.blip('back'); done(); };
  $('ctlReset').onclick = async (e) => {
    e.stopPropagation();
    if (await G.confirm('Reset all controls to their defaults?')) { input.controls.reset(); build(); $('ctlMsg').textContent = 'Controls reset.'; }
  };
  nav.push({ id: 'controls', el: screenEl('controls'), back: done });
}

// ---------- how to play ----------
function openHowTo() {
  let i = 0;
  const render = () => {
    const c = HOW_TO_PLAY[i];
    $('howTitle').textContent = c.title;
    $('howBody').innerHTML = c.body.map((b) => `<p>${withKeys(b)}</p>`).join('');
    $('howPage').textContent = `${i + 1}/${HOW_TO_PLAY.length}`;
    $('howNext').textContent = i < HOW_TO_PLAY.length - 1 ? 'Next' : 'Done';
    $('howPrev').textContent = 'Back';
  };
  const done = () => { hide('howto'); nav.remove('howto'); };
  $('howNext').onclick = (e) => { e.stopPropagation(); audio.blip('select'); if (i < HOW_TO_PLAY.length - 1) { i++; render(); } else done(); };
  $('howPrev').onclick = (e) => { e.stopPropagation(); audio.blip('back'); if (i > 0) { i--; render(); } else done(); };
  render();
  show('howto');
  nav.push({ id: 'howto', el: screenEl('howto'), back: done, initial: '#howNext' });
}

// ---------- credits ----------
function openCredits(kind) {
  return new Promise((resolve) => {
    const s = G.s;
    const c = (role, name) => `<div><p class="role">${role}</p><p>${name}</p></div>`;
    $('creditsBody').innerHTML = [
      `<div style="grid-column: 1 / -1"><p>${kind === 'friend' ? 'The friendship ending: the old Gar has a village now.' : 'The fins ending: the paddies are safe.'} <span style="white-space:nowrap">${escapeHtml(s.name)} · Level&nbsp;${s.level} · Friends&nbsp;${state.friendsTotal(s)}${s.flags.garFriend ? ' + the&nbsp;Gar' : ''}</span></p></div>`,
      c('Idea and original game by', 'Rich Conlan'),
      c('Original sprites', 'from the original Betta&nbsp;RPG'),
      c('Remake', 'made with gamegen (Claude)'),
      c('New art, music and sounds', 'generated, finished in code'),
      c('Font', 'Pixelify Sans (SIL&nbsp;OFL)'),
      `<div><p class="role">Thanks for playing!</p><p>${kind === 'fins' ? 'Maybe the old Gar would like a&nbsp;party.' : 'Party on, little fish.'}</p></div>`,
    ].join('');
    show('credits');
    const done = () => { hide('credits'); nav.remove('credits'); resolve(); };
    $('creditsOk').onclick = (e) => { e.stopPropagation(); audio.blip('select'); done(); };
    nav.push({ id: 'credits', el: screenEl('credits'), back: done });
    setTimeout(() => { screenEl('credits').querySelector('.card').scrollTop = 0; }, 40);
  });
}

// ---------- mute ----------
const SPEAKER_ON = '<svg viewBox="0 0 9 9" class="ic"><path d="M0 3h2l2-2h1v7H4L2 6H0zM6 3h1v3H6zM7 2h1v1H7zM7 6h1v1H7zM8 3h1v3H8z"/></svg>';
const SPEAKER_OFF = '<svg viewBox="0 0 9 9" class="ic"><path d="M0 3h2l2-2h1v7H4L2 6H0zM6 3h1v1H6zM8 3h1v1H8zM7 4h1v1H7zM6 5h1v1H6zM8 5h1v1H8z"/></svg>';
function updateMute() {
  const m = audio.audioSettings().muted;
  for (const id of ['bMute', 'tMute']) { $(id).innerHTML = m ? SPEAKER_OFF : SPEAKER_ON; $(id).setAttribute('aria-label', m ? 'Unmute' : 'Mute'); }
}
function toggleMute() { audio.toggleMute(); saveSettings(); updateMute(); }

async function goHome() {
  if (G.mode !== 'world' || G.busy() || nav.top()) return;
  if (G.world.areaId === 'village') { G.toast('You\'re already home in Paddy Village.'); return; }
  if (areaOf(G.world.areaId) === 'village') { await G.enterArea('village', 'home'); return; }
  if (await G.confirm('Swim home to Paddy Village?')) await G.enterArea('village', 'home');
}

// ---------- input routing ----------
function onInput(ev) {
  audio.unlock();
  if (G.mode === 'boot') return;
  if (!$('rotate').hidden) return;
  if (G.padLost && ev.device === 'keyboard') { G.padLost = false; $('padLost').hidden = true; }
  updateTitlePress();
  if (ev.action === 'mute' && !nav.top()) { toggleMute(); return; }
  if (G.wipe) return;
  if (nav.top()) {
    // a menu gets its keys first; Mute only if the menu didn't use the key
    if (ev.action === 'mute' && !ev.menu && !ev.digit) { toggleMute(); return; }
    if (nav.top().id === 'title' && !ev.menu && !ev.digit) return;
    if (nav.handle(ev)) return;
    if (nav.top()?.id !== 'battle') return;
  }
  if (G.mode === 'battle') {
    if (ev.action === 'pause' && ev.code !== 'Escape') openPause();
    return;
  }
  if (G.mode !== 'world' || G.busy()) return;
  if (ev.action === 'pause' || (ev.menu === 'back' && ev.device === 'gamepad')) { openPause(); return; }
  if (ev.action === 'items') { openPause('items'); return; }
  if (ev.action === 'home') { goHome(); return; }
  if (ev.action === 'talk' || ev.code === 'Enter' || ev.code === 'NumpadEnter') { interact(); return; }
}

// touch: the floating stick on the left 40%, and taps
function setupTouch() {
  const zone = $('stickzone'), stick = $('stick'), knob = $('knob');
  let id = null, ox = 0, oy = 0;
  zone.addEventListener('pointerdown', (e) => {
    if (window.gameReport?.isOpen()) return;
    e.preventDefault();
    input.setDevice('touch');
    audio.unlock();
    id = e.pointerId; ox = e.clientX; oy = e.clientY;
    zone.setPointerCapture(id);
    stick.hidden = false; stick.style.left = ox + 'px'; stick.style.top = oy + 'px';
    knob.style.transform = '';
  });
  zone.addEventListener('pointermove', (e) => {
    if (e.pointerId !== id) return;
    let dx = e.clientX - ox, dy = e.clientY - oy;
    const d = Math.hypot(dx, dy), R = 56;
    if (d > R) { dx = dx / d * R; dy = dy / d * R; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    const m = Math.hypot(dx, dy);
    input.touchVec = m < 10 ? { x: 0, y: 0 } : { x: dx / R, y: dy / R };
  });
  const up = (e) => { if (e.pointerId !== id) return; id = null; stick.hidden = true; input.touchVec = { x: 0, y: 0 }; };
  zone.addEventListener('pointerup', up);
  zone.addEventListener('pointercancel', up);
  $('talkbtn').addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); audio.unlock(); input.setDevice('touch'); if (G.canTalkNow()) interact(); });
  // the dialogue box advances on any tap
  $('dialog').addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; e.preventDefault(); audio.unlock(); ui.dialogTap(); });
  // a tap anywhere unlocks audio; a tap on the canvas in the world talks if something is in reach (desktop click too)
  addEventListener('pointerdown', (e) => {
    audio.unlock();
    if (e.pointerType === 'mouse') { if (input.device === 'touch') input.setDevice('keyboard'); }
    else input.setDevice('touch');
    if (e.target === cv && G.mode === 'title' && !nav.top()) openTitle();
  }, true);
  // a tap on the picture moves dialogue on too (endings, scenes)
  cv.addEventListener('pointerdown', () => { if (!$('dialog').hidden) ui.dialogTap(); });
  cv.addEventListener('click', () => {
    if (G.mode === 'battle' && G.battle?.continueBtn) { ui.press(G.battle.continueBtn); return; }
    if (G.canTalkNow() && G.world.interactTarget()) interact();
  });
}

// ---------- the loop ----------
const STEP = 1 / 60;
let acc = 0, last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.25) dt = 0.25;
  acc += dt;
  while (acc >= STEP) { update(STEP, now); acc -= STEP; }
  draw(dt);
  logFrame();
}
function update(dt, now) {
  G.tick++;
  input.poll(now);
  for (const w of G.waits.splice(0)) { w.t -= dt; if (w.t <= 0) w.r(); else G.waits.push(w); }
  if (G.wipe) {
    const w = G.wipe; w.t += dt;
    if (!w.phase) { w.p = Math.min(1, w.t / w.dur); if (w.p >= 1 && !w.covered) { w.covered = true; w.onCovered?.(); } }
    else { if (!w.t2) w.t2 = 0; w.t2 += dt; w.p = 1 + Math.min(1, w.t2 / w.dur); if (w.p >= 2) w.onDone?.(); }
  }
  const paused = nav.has('pause') || !$('rotate').hidden || window.gameReport?.isOpen();
  if (G.mode === 'world' && G.world && !paused) {
    const canMove = !G.busy() && !nav.top() && !G.wipe;
    G.world.update(dt, canMove);
    if (G.mode === 'world' && G.world) G.story.update(G.world, dt);
    // swimming off the edge through an opening: the next area
    if (G.mode === 'world' && G.world && canMove && !G.leaving) {
      const p = G.world.player;
      const dr = G.world.doorAhead(input.moveVector());
      if (dr) { G.leaving = true; input.releaseAll(); G.enterRoom(dr.to).finally(() => { G.leaving = false; }); }
      for (const ex of G.leaving ? [] : G.world.def.exits || []) {
        const [x, y, w, h] = ex.rect;
        if (p.x >= x - 16 && p.x <= x + w + 16 && p.y >= y - 16 && p.y <= y + h + 16) {
          G.leaving = true;
          input.releaseAll();
          G.enterArea(ex.to, ex.entry).finally(() => { G.leaving = false; });
          break;
        }
      }
    }
    for (const e of G.world.walkers || []) { if (e.walkTo) { const dx = e.walkTo.x - e.x, dy = e.walkTo.y - e.y, d = Math.hypot(dx, dy), sp = e.walkTo.speed * dt; if (d <= sp) { e.x = e.walkTo.x; e.y = e.walkTo.y; const r = e.walkTo.done; e.walkTo = null; r?.(); } else { e.x += dx / d * sp; e.y += dy / d * sp; e.face = dx > 0 ? 1 : -1; } } }
    G.s.playTime += dt;
  }
  if (G.mode === 'battle' && G.battle && !paused) G.battle.update(dt);
}
function draw(dt) {
  ctx.imageSmoothingEnabled = false;
  if (G.mode === 'world' && G.world) { G.world.draw(ctx); updateHud(); updatePrompt(); }
  else if (G.mode === 'battle' && G.battle) G.battle.draw(ctx);
  else if (G.mode === 'ending' && G.ending) drawEnding(dt);
  else if (G.mode === 'title' || G.mode === 'create') { drawTitle(dt); drawCreatePreview(dt); }
  if (G.wipe) drawWipe(ctx, G.view.W, G.view.H, G.wipe.p, G.wipe.t);
  if (!$('rotate').hidden) {
    // the betta swims in place on the "turn your phone" card
    const rc = $('rotateFish'), g = rc.getContext('2d'), t = performance.now() / 1000;
    g.imageSmoothingEnabled = false;
    g.clearRect(0, 0, rc.width, rc.height);
    const v = bettaSwim([0, 1, 0, 3][Math.floor(t * 7) % 4], G.s.color) || betta(0, G.s.color);
    drawFish(g, v, 48, 32 + Math.round(Math.sin(t * 2)), { s: 1 });
  }
}

// ---------- frame log ----------
function screenName() {
  const parts = [G.mode];
  for (const s of ui.visibleScreens()) parts.push(s);
  if (!$('dialog').hidden) parts.push('dialog');
  if (!$('fade').hidden && $('fade').classList.contains('on')) parts.push('fade');
  return parts.join('>');
}
function logFrame() {
  const name = screenName(), L = G.frameLog, last = L[L.length - 1];
  if (last && last[0] === name) last[1]++;
  else { L.push([name, 1]); if (L.length > 200) L.shift(); }
}

// ---------- the debug hook ----------
function stateSnapshot() {
  const s = G.s, w = G.world, b = G.battle;
  return {
    screen: screenName(), mode: G.mode, area: w?.areaId || null, room: w && ROOMS[w.areaId] ? w.areaId : null, parent: w ? areaOf(w.areaId) : null,
    player: w ? { x: Math.round(w.player.x), y: Math.round(w.player.y), face: w.player.face } : null,
    name: s.name, color: s.color, level: s.level, exp: s.exp, hp: s.hp, mp: s.mp, bb: s.bb, items: { ...s.items },
    flags: { ...s.flags }, friends: { ...s.friends }, friendsTotal: state.friendsTotal(s), scales: s.scales.length, cogs: s.cogs.length,
    sub: s.subOwned, rest: s.rest, goal: goalLine(s), wearHat: s.wearHat,
    inBattle: b ? { kind: b.enemy.kind, level: b.enemy.level, edge: b.enemy.edge, hp: b.enemy.hp, hpMax: b.enemy.hpMax, turn: b.battle.turn,
      playerHp: b.battle.p.hp, playerMp: b.battle.p.mp, meter: b.battle.meter, partyStarted: b.battle.partyStarted, busy: b.busy, over: b.battle.over,
      row: b.row, scripted: b.battle.scripted, dived: b.battle.p.dived, waiting: !!b.continueBtn,
      net: b.enemy.kind === 'snarl' ? b.enemy.net : null, tangled: !!b.battle.tangled, sturn: b.battle.sturn, warned: !!b.battle.warned } : null,
    busy: G.busy(), transition: !!G.wipe || !!G.starting, dialog: !$('dialog').hidden, menus: nav.stack.map((l) => l.id),
    gameWon: G.gameWon || !!(s.flags.garDefeated || s.flags.garFriend), ending: s.ending, endingsSeen: { ...s.endingsSeen },
    enemies: w ? w.enemies.map((e) => ({ kind: e.kind, level: e.level, x: Math.round(e.x), y: Math.round(e.y), edge: !!e.edge, hidden: e.hidden })) : [],
    input: input.device, padId: input.padId || null, tick: G.tick, lastBattle: G.lastBattle || null,
    ngPlus: s.ngPlus || 0, lastEnding: s.lastEnding || null, slot: G.slot || null, parade: w?.parade?.length || 0,
    snarl: { done: !!s.flags.snarlDone, friend: !!s.flags.snarlFriend },
    extras: w ? w.extra.filter((n) => !n.hidden).map((n) => n.id) : [], paradeKinds: w?.parade?.map((m) => m.kind) || [], paradeAt: w?.parade?.map((m) => [m.kind, Math.round(m.x), Math.round(m.y)]) || [], bubbleAt: w ? [Math.round(w.bubble.x), Math.round(w.bubble.y)] : null,
  };
}
// The play-test hook, only with ?debug in the address.
if (new URLSearchParams(location.search).has('debug')) window.__game = {
  state: stateSnapshot,
  frames: () => G.frameLog.slice(),
  buttons: () => [...document.querySelectorAll('button')].filter((b) => b.offsetParent !== null && !b.closest('[hidden]') && getComputedStyle(b).visibility !== 'hidden')
    .map((b) => { const r = b.getBoundingClientRect(); return { label: b.textContent.trim() || b.getAttribute('aria-label') || '', x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), dim: b.classList.contains('dim'), focus: b.classList.contains('focus') }; }),
  audioState: () => audio.audioState(),
  levels: () => AREAS.length,
  rooms: () => Object.keys(ROOMS),
  enter: async (id, entry = 'door') => { await G.enterArea(id, entry, { wipe: false, quiet: true }); return true; },
  areas: () => AREAS.slice(),
  goToLevel: async (n, opts = {}) => {
    const id = AREAS[n];
    if (!id) return false;
    for (const l of [...nav.stack]) { hide(l.id); }
    nav.stack = [];
    endScene();
    for (const sc of ['title', 'create', 'pause', 'shop', 'settings', 'controls', 'howto', 'confirm', 'banner', 'credits', 'slots']) hide(sc);
    const st = AREA_START[id];
    const s = state.newSave(G.s?.name && G.mode !== 'title' ? G.s.name : 'Tester', G.s?.color || 'red');
    // ngPlus: the New Game+ count (its bonus k lifts every fish); the start level gets + k too
    s.ngPlus = opts.ngPlus || 0;
    const lv = Math.min(maxLevel(s), st.level + NGPLUS.bonus(s.ngPlus));
    s.level = lv; s.hp = PLAYER.maxHp(lv); s.mp = PLAYER.maxMp(lv);
    for (const f of st.flags) s.flags[f] = true;
    if (s.flags.metFinn) Object.assign(s.met, { finn: true });
    if (n >= 1) s.flags.tutorialDone = n > 1;
    if (n >= 2) { s.friends.angel = 1; s.firstFriendKinds.angel = true; }
    if (n >= 3) s.scales = ['s1', 's2', 's3', 's4', 's5'];
    if (n >= 5) s.cogs = ['c1', 'c2', 'c3'];
    s.rest = n >= 5 ? 'village' : n >= 4 ? 'highwater' : 'village';
    if (n === 4) s.rest = 'highwater';
    s.hints = { swim: true, talk: true, battle: true, redGlow: true };
    if (s.ngPlus) { s.flags.tutorialDone = true; s.endingsSeen = { fins: true }; s.ending = s.lastEnding = 'fins'; }
    if (opts.afterSnarl && n === 3) Object.assign(s.flags, { snarlDone: true, snarlMet: true, stepsKnown: true });
    G.s = s;
    G.slot = G.slot || 1;
    G.worldRng = makeRng(1000 * (n + 1));
    G.battleRng = makeRng(7000 * (n + 1));
    let entry = { village: 'start', shallows: 'north', reedwater: 'west', highwater: 'south', murk: 'culvert', ditch: 'gate' }[id];
    if (opts.afterSnarl && n === 3) entry = { x: 768, y: 420, face: 1 };
    await G.enterArea(id, entry, { wipe: false, quiet: true });
    return true;
  },
  set: (o = {}) => {
    const s = G.s;
    for (const k of ['ngPlus', 'lastEnding', 'level', 'hp', 'mp', 'bb', 'sub', 'color', 'name', 'rest', 'wearHat']) if (o[k] !== undefined) s[k === 'sub' ? 'subOwned' : k] = o[k];
    if (o.endingsSeen) Object.assign(s.endingsSeen, o.endingsSeen);
    if (o.level !== undefined && o.hp === undefined) s.hp = PLAYER.maxHp(s.level);
    if (o.level !== undefined && o.mp === undefined) s.mp = PLAYER.maxMp(s.level);
    if (o.items) Object.assign(s.items, o.items);
    if (o.flags) Object.assign(s.flags, o.flags);
    if (o.friends) Object.assign(s.friends, o.friends);
    if (o.scales !== undefined) s.scales = Array.isArray(o.scales) ? o.scales : ['s1', 's2', 's3', 's4', 's5'].slice(0, o.scales);
    if (o.cogs !== undefined) s.cogs = Array.isArray(o.cogs) ? o.cogs : ['c1', 'c2', 'c3'].slice(0, o.cogs);
    if (o.pos && G.world) { G.world.player.x = o.pos.x; G.world.player.y = o.pos.y; G.world.camSnap(); }
    if (o.parade !== undefined) G.settings.parade = !!o.parade;   // for this session only
    if ((o.friends || o.flags || o.pos || o.parade !== undefined) && G.world) G.world.buildParade();
    hudKey = '';
    return stateSnapshot();
  },
  seed: (n) => { G.worldRng = makeRng(n); G.battleRng = makeRng(n * 7 + 3); return n; },
  battle: (kind, level = 1, opts = {}) => { if (nav.has('pause')) closePause(); G.startBattle({ kind, level, edge: !!opts.edge, scripted: opts.scripted || null }); return true; },
  input: () => ({ device: input.device, padId: input.padId, lastInput: input.lastInput }),
  // play-test only: show an ending scene ('fins' or 'friend') without changing flags
  ending: (kind = 'friend') => { G.playEnding(kind); return true; },
  assets: () => assetReport(),
  save: () => { G.save(); return true; },
  slots: () => state.SLOTS.map((n) => { const i = state.slotInfo(n); return { slot: n, empty: !!i.empty, unreadable: !!i.unreadable, name: i.name || null, level: i.level || null,
    ngPlus: i.ngPlus || 0, area: i.area || null, friends: i.friends || 0, endings: i.endings || [], lastPlayed: i.lastPlayed || 0 }; }),
  startNgPlus: (from, to) => { for (const l of [...nav.stack]) hide(l.id); nav.stack = []; endScene(); show('slots'); nav.push({ id: 'slots', el: screenEl('slots') }); return startNgPlus(from, to, { skipConfirm: true }); },
  // tests only: write a save as the published game did, and migrate it
  legacySave: (obj) => { for (const n of state.SLOTS) localStorage.removeItem(state.slotKey(n)); localStorage.removeItem(state.LAST_SLOT_KEY); localStorage.removeItem(state.MIGRATED_KEY);
    localStorage.setItem(state.SAVE_KEY, typeof obj === 'string' ? obj : JSON.stringify(obj)); return state.migrate(); },
};

// ---------- boot ----------
async function boot() {
  ui.makePanels();
  const controls = window.gameControls.setup({ key: 'bettarpg', actions: ACTIONS });
  input.init(controls);
  input.listener = onInput;
  input.onDevice = () => { promptKey = ''; updateTitlePress(); };
  addEventListener('gamepadconnected', () => { G.padLost = false; $('padLost').hidden = true; });
  input.onPadLost = () => {
    if (G.mode !== 'world' && G.mode !== 'battle') return;
    G.padLost = true; openPause();
    $('padLost').hidden = !nav.has('pause');
    if (!nav.has('pause')) G.padLost = false;
  };
  state.migrate();   // the published game's single save moves into slot 1 (kept as bettarpg-save-migrated)
  audio.loadSettings(state.loadSettings());
  resize();
  addEventListener('resize', resize);
  addEventListener('orientationchange', () => setTimeout(resize, 100));
  setupTouch();
  wire('bPause', () => openPause());
  wire('bHome', () => goHome());
  wire('bMute', () => toggleMute());
  wire('tMute', () => toggleMute());
  wire('randName', () => { $('nameIn').value = NAMES[Math.floor(Math.random() * NAMES.length)]; });
  wire('createGo', () => startNewGame());
  wire('createBack', () => { hide('create'); nav.remove('create'); openTitle(); });
  $('nameIn').addEventListener('input', () => { const c = cleanName($('nameIn').value); if (c !== $('nameIn').value.trim()) $('nameIn').value = c; });
  $('nameIn').addEventListener('focus', () => { setTimeout(() => $('nameIn').scrollIntoView({ block: 'center' }), 300); });
  $('nameIn').addEventListener('blur', () => { window.scrollTo(0, 0); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (G.mode === 'world' && !nav.top()) openPause(); audio.suspend(true); }
    else audio.suspend(false);
  });
  addEventListener('blur', () => { input.releaseAll(); });
  window.gameReport?.setup({ game: 'Betta RPG', key: 'bettarpg', visibility: 'on',
    state: () => { const s = stateSnapshot(); return { screen: s.screen, area: s.area, player: s.player, level: s.level, hp: s.hp, mp: s.mp, bb: s.bb, flags: Object.keys(s.flags).join(','), friends: s.friendsTotal, goal: s.goal, battle: s.inBattle ? `${s.inBattle.kind} L${s.inBattle.level}` : 'no', input: s.input }; },
    pause: () => { if (G.mode === 'world' && !nav.has('pause')) openPause(); },
    grab: () => new Promise((r) => cv.toBlob(r, 'image/png')),
    releaseAll: () => input.releaseAll() });
  if (DEBUG) addEventListener('keydown', (e) => {
    if (input.textFocused()) return;
    if (e.key === '$') { G.s.bb += 50; G.toast('Debug: +50 Betta Bites'); }
    if (e.key === '%' && G.s.level < 10) { G.s.exp = 0; G.s.level++; G.s.hp = PLAYER.maxHp(G.s.level); G.s.mp = PLAYER.maxMp(G.s.level); G.toast('Debug: level up'); }
  });
  await Promise.all([document.fonts.load('16px "Pixelify Sans"').catch(() => {}), document.fonts.load('600 16px "Pixelify Sans"').catch(() => {}), audio.init(),
    loadAll((p) => { $('loadFill').style.width = Math.round(p * 100) + '%'; })]);
  // build the first areas' terrain while the title shows
  setTimeout(() => { terrainFor('village'); terrainFor('shallows'); }, 50);
  openTitle();
  requestAnimationFrame((t) => { last = t; frame(t); });
  $('loading').hidden = true;
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  if ('serviceWorker' in navigator && (!local || params.has('sw'))) navigator.serviceWorker.register('sw.js').catch(() => {});
}
boot();
