// battlescene.js: a battle on screen. The rules are battle.js; this draws the
// side view at x2, runs the menu row, and plays each event the rules return
// (lunges, bubbles, gravel, hit flash + hit pause + shake, numbers, confetti,
// the party hat dropping, the Gar's roar and charge).
import { Battle, makeEnemy } from './battle.js';
import { ENEMIES, ITEMS, ITEM_ORDER, MOVES, PLAYER, PARTY } from './config.js';
import { img, hasReal } from './assets.js';
import { betta, bettaSwim, hatted, plain, fromCanvas, rim, white, glow, tinted, drawFish, garLunge } from './sprites.js';
import { Particles, pixelText, textWidth, pixelBubble } from './fx.js';
import { $, el, button, nav, drawPortrait, press } from './ui.js';
import * as audio from './audio.js';
import { escapeHtml, label, padCap, keyCap, input } from './input.js';
import { spriteCanvas } from './world.js';

const BG = { shallows: ['bg_shallows'], reedwater: ['bg_reedwater', 'bg_shallows'], spillway: ['bg_spillway', 'bg_reedwater', 'bg_shallows'],
  murk: ['bg_murk'], garpool: ['bg_garpool', 'bg_murk'] };
const BOLT = '<svg viewBox="0 0 6 9" class="ic"><path d="M3 0h3L4 3h2L1 9l1-4H0z" fill="#F7C948"/></svg>';

export class BattleScene {
  constructor(G, { kind, level, edge = false, scripted = null, bg = 'shallows', entity = null }) {
    this.G = G;
    const s = G.s;
    this.entity = entity;
    this.bgKey = bg;
    this.rimOn = bg === 'murk' || bg === 'garpool';
    this.enemy = makeEnemy(kind, level, edge);
    this.battle = new Battle({
      player: { name: s.name, level: s.level, hp: s.hp, mp: s.mp, items: { ...s.items }, subOwned: s.subOwned, dived: false,
        friends: G.friendsTotal() },
      enemy: this.enemy, bubble: !!s.flags.bubbleJoined, hbtLearned: !!s.flags.hbtLearned, scripted, rng: G.battleRng,
    });
    this.fx = new Particles();
    this.t = 0;
    this.row = 'main';
    this.busy = true;
    this.waits = [];
    this.tweens = [];
    this.shake = 0;
    this.freeze = 0;
    this.dim = 0;
    this.charging = false;
    this.dizzy = false;
    this.partyFriends = [];
    this.befriended = false;
    this.hatDrop = null;
    this.lunge = { player: 0, enemy: 0, bubble: 0 };
    this.flash = { player: 0, enemy: 0, bubble: 0 };
    this.hidden = { enemy: false };
    this.lungeFrame = -1;
    this.over = false;
    this.lit = null;     // a button key to highlight
    this.lastRowKey = '';
    this.logLines = [];
  }

  // ---------- life ----------
  async begin() {
    const ui = $('battleui');
    ui.hidden = false;
    $('bLog').innerHTML = '';
    $('bLog').onclick = () => $('bLog').classList.toggle('open');
    $('eName').textContent = this.enemy.name;
    $('eLv').textContent = 'Lv ' + this.enemy.level;
    $('garBox').hidden = this.enemy.kind !== 'gar';
    $('bDive').hidden = !this.G.s.subOwned;
    $('bDive').onclick = (e) => { e.stopPropagation(); this.choose('dive'); };
    this.updateHud(true);
    drawPortrait($('bPortrait'), this.G.playerCanvas());
    nav.push({ id: 'battle', el: ui, wrap: false, initial: () => $('bRow').querySelector('.btn:not(.dim)') || $('bRow').querySelector('.btn'),
      keys: (ev) => this.onKey(ev) });
    this.buildRow();
    await this.play(this.battle.start());
    if (this.enemy.kind === 'gar') { this.G.vibrate(400, 0.5); }
    this.busy = false;
    this.buildRow(true);
    this.G.hintOnce('battle');
    if (this.battle.hbtLearned && !this.battle.scripted && this.G.s.hints.battle) this.G.hintOnce('befriend');
  }

  end() {
    $('battleui').hidden = true;
    nav.remove('battle');
  }

  // ---------- input ----------
  onKey(ev) {
    if (this.over && this.continueBtn) {
      if (ev.menu === 'confirm' || ev.action === 'talk') { press(this.continueBtn); return true; }
      return true;
    }
    if (ev.digit) {
      const b = [...$('bRow').children][ev.digit - 1];
      if (b) { nav.setFocus(b, false); press(b); }
      return true;
    }
    if (ev.menu === 'back') { if (this.row !== 'main') { audio.blip('back'); this.row = 'main'; this.buildRow(true); } return true; }
    if (ev.menu === 'up' && !$('bDive').hidden) { nav.setFocus($('bDive')); return true; }
    if (ev.menu === 'down' && nav.focused() === $('bDive')) { nav.setFocus($('bRow').lastElementChild); return true; }
    if (ev.menu === 'left' || ev.menu === 'right') {
      const it = [...$('bRow').children];
      const f = nav.focused();
      let i = it.indexOf(f);
      if (i < 0) i = 0; else i = Math.max(0, Math.min(it.length - 1, i + (ev.menu === 'right' ? 1 : -1)));
      nav.setFocus(it[i]);
      return true;
    }
    return false;
  }

  rowDefs() {
    const b = this.battle, s = this.G.s;
    const can = (a) => b.can(a);
    if (this.row === 'spells') {
      return [
        { key: 'bubbleBlast', label: 'Bubble Blast', small: '3 MP', can: can('bubbleBlast') },
        { key: 'gravelGrenade', label: s.level >= MOVES.gravelGrenade.level ? 'Gravel Grenade' : 'Gravel Grenade ?', small: s.level >= MOVES.gravelGrenade.level ? '5 MP' : 'Level 4', can: can('gravelGrenade') },
        { key: 'back', label: 'Back', small: '', can: { ok: true } },
      ];
    }
    if (this.row === 'items') {
      return [...ITEM_ORDER.map((k) => ({ key: 'item:' + k, label: ITEMS[k].name, small: '×' + (b.p.items[k] || 0), icon: ITEMS[k].icon, can: can('item:' + k) })),
        { key: 'back', label: 'Back', small: '', can: { ok: true } }];
    }
    const party = can('party');
    const learned = b.hbtLearned || b.stumpLit;
    return [
      { key: 'attack', label: 'Attack', small: '', can: { ok: true } },
      { key: 'spells', label: 'Spells', small: '', can: { ok: true } },
      { key: 'party', label: learned ? 'Party!' : 'Party! ?', small: party.free ? 'free' : learned ? '5 MP' : '', can: party },
      { key: 'items', label: 'Items', small: '', can: { ok: true } },
      { key: 'flee', label: 'Swim Away', small: '', can: can('flee') },
    ];
  }

  buildRow(focus = false) {
    const defs = this.rowDefs();
    const key = this.row + '|' + defs.map((d) => d.key + d.label + d.small + d.can.ok).join(',') + '|' + this.busy + '|' + this.lit;
    if (key === this.lastRowKey) return;
    const prevFocus = nav.focused()?.dataset?.key;
    this.lastRowKey = key;
    const row = $('bRow');
    row.innerHTML = '';
    defs.forEach((d, i) => {
      const inner = `${d.icon ? `<img class="ico" src="${img(d.icon)?.toDataURL?.() || ''}" alt="">` : ''}<span>${escapeHtml(d.label)}</span><small>${escapeHtml(d.small || '')}${d.small ? ' · ' : ''}${i + 1}</small>`;
      const b = button(inner, () => this.choose(d.key), 'btn' + (d.can.ok ? '' : ' dim') + (this.lit === d.key ? ' lit' : ''));
      b.dataset.key = d.key;
      b.setAttribute('aria-disabled', d.can.ok ? 'false' : 'true');
      row.append(b);
    });
    const it = [...row.children];
    const keep = it.find((b) => b.dataset.key === prevFocus);
    if (nav.top()?.id === 'battle') nav.setFocus(focus ? (it.find((b) => b.dataset.key === this.lit) || it[0]) : keep || it[0], false);
    $('bDive').textContent = this.battle.p.dived ? 'Surface' : 'Dive';
  }

  async choose(key) {
    if (this.over && key !== 'continue') return;
    if (this.busy) return;
    if (key === 'spells' || key === 'items') { this.row = key; this.buildRow(true); return; }
    if (key === 'back') { this.row = 'main'; this.buildRow(true); return; }
    const r = this.battle.act(key);
    if (r.refused !== undefined) {
      audio.blip('buzz');
      this.log(r.refused, r.refused.startsWith('Bubble:') ? 'say' : '');
      return;
    }
    if (key === 'party' && this.lit === 'party') this.lit = null;
    this.busy = true;
    this.row = 'main';
    this.buildRow();
    await this.play(r);
    this.busy = false;
    if (this.battle.over) await this.finish();
    else this.buildRow(true);
  }

  // ---------- events ----------
  log(text, cls = '') {
    const box = $('bLog');
    const d = el('div', cls, escapeHtml(text).replace(/⚡/g, BOLT));
    box.append(d);
    while (box.children.length > 3) box.firstChild.remove();
    this.logLines.push(text);
  }
  wait(ms) { return new Promise((r) => this.waits.push({ t: ms / 1000, r })); }
  tween(dur, f) { return new Promise((r) => this.tweens.push({ t: 0, dur, f, r })); }

  async play(events) {
    for (const ev of events) await this.playOne(ev);
    this.updateHud();
  }

  pos(who) {
    const L = this.layout();
    if (who === 'player') return { x: L.px, y: L.py };
    if (who === 'bubble') return { x: L.bx, y: L.by };
    return { x: L.ex, y: L.ey };
  }

  async playOne(ev) {
    const G = this.G;
    switch (ev.t) {
      case 'log': this.log(ev.text); await this.wait(380); break;
      case 'say':
        if (ev.who === 'gar') { this.log(ev.text, 'say'); this.dim = 1; this.shake = 4; audio.play('gar_roar'); G.vibrate(500, 0.6); await this.wait(1200); }
        else { this.log('Bubble: ' + ev.text, 'say'); audio.play('bubble_chirp', { rate: 1.1 }); await this.wait(700); }
        break;
      case 'sfx': audio.play(ev.name, ev.name === 'miss' ? {} : {}); break;
      case 'anim': await this.anim(ev); break;
      case 'dmg': {
        const who = ev.target;
        this.flash[who] = 3; this.freeze = 3;
        this.shake = Math.max(this.shake, ev.big ? 5 : who === 'player' ? 2.5 : 1.5);
        const p = this.pos(who);
        this.fx.number(p.x, p.y - 30, '-' + ev.amount, who === 'player' ? '#FF6A5A' : '#FFFFFF', 2);
        this.fx.sparks(p.x, p.y, 10, who === 'player' ? '#FF6A5A' : '#F7C948', 2, 60);
        if (who === 'player') { audio.play('hurt'); G.vibrate(120, 0.6); }
        else if (ev.by !== 'player' || !this.lastWasMelee) audio.play('hit', { vol: 0.8 });
        this.updateHud();
        await this.wait(ev.big ? 700 : 380);
        break;
      }
      case 'miss': {
        const p = this.pos(ev.target);
        this.fx.number(p.x, p.y - 30, 'MISS', '#9FD8E0', 2);
        audio.play('miss', { rate: ev.dodge ? 1.3 : 1 });
        if (ev.target === 'enemy') this.lunge.enemyDodge = 1;
        await this.wait(300);
        break;
      }
      case 'heal': {
        if (!ev.amount) break;
        const p = this.pos(ev.target);
        this.fx.number(p.x, p.y - 34, '+' + ev.amount, '#7CF08A', 2);
        this.fx.bubbles(p.x, p.y, 6, { spread: 20, color: '#B8FFC4', r: [1, 3], up: 30 });
        this.updateHud();
        await this.wait(300);
        break;
      }
      case 'mp': {
        this.updateHud();
        if (ev.float && ev.amount > 0) { const p = this.pos('player'); this.fx.number(p.x, p.y - 46, '+' + ev.amount + 'MP', '#7FC3FF', 2); await this.wait(300); }
        break;
      }
      case 'item': {
        const c = img(ITEMS[ev.kind].icon);
        const p = this.pos('player');
        this.itemPop = { c, x: p.x, y: p.y - 40, t: 0 };
        await this.wait(350);
        break;
      }
      case 'dive': {
        this.flash.player = 6;
        this.fx.bubbles(this.pos('player').x, this.pos('player').y, 14, { spread: 30, r: [1, 3], up: 40 });
        await this.wait(400);
        this.buildRow();
        break;
      }
      case 'roar': this.dim = 1; this.shake = 6; G.vibrate(500, 0.7); await this.wait(900); break;
      case 'charge': this.charging = true; audio.play('gar_charge', { vol: 0.7 }); await this.wait(500); break;
      case 'block': audio.play('armor'); this.fx.sparks(this.pos('player').x, this.pos('player').y, 16, '#9FD8E0', 2, 80); await this.wait(400); break;
      case 'meter': {
        this.updateMeter(ev.change);
        if (ev.change > 0) audio.play('party', { vol: 0.5, rate: 1.4 });
        else audio.play('befriend_fail');
        await this.wait(400);
        break;
      }
      case 'partyBurst': {
        // friends burst in with balloons
        const n = Math.min(6, G.friendsTotal());
        const kinds = G.friendKinds();
        for (let i = 0; i < n; i++) this.partyFriends.push({ kind: kinds[i % kinds.length] || 'guppy', t: -i * 0.12, slot: i });
        this.fx.confetti(this.pos('player').x, this.pos('player').y - 20, 60, 2);
        this.fx.balloons(this.pos('player').x, this.pos('player').y + 30, 8, 2, 120);
        $('garMeter').hidden = false;
        this.updateMeter(0);
        await this.wait(900);
        break;
      }
      case 'befriendFail': {
        const p = this.pos('enemy');
        this.sadBalloon = { x: p.x, y: p.y - 40, t: 0 };
        await this.wait(800);
        break;
      }
      case 'befriend': await this.befriendAnim(); break;
      case 'bubbleDizzyEnd': this.dizzy = false; break;
      case 'hint': this.log(ev.text, 'say'); this.lit = 'spells'; this.buildRow(); await this.wait(500); break;
      case 'hbt': this.lit = 'party'; this.G.s.flags.hbtLearned = true; this.buildRow(); break;
      case 'end': break;
    }
  }

  async anim(ev) {
    const who = ev.who;
    if (who === 'player' && ev.kind === 'lunge') { this.lastWasMelee = true; await this.tween(0.12, (k) => { this.lunge.player = k; }); await this.tween(0.16, (k) => { this.lunge.player = 1 - k; }); return; }
    this.lastWasMelee = false;
    if (who === 'player' && ev.kind === 'bubbles') {
      audio.play('bubble_blast');
      const a = this.pos('player'), b = this.pos('enemy');
      for (let i = 0; i < 9; i++) this.fx.add({ type: 'bubble', x: a.x + 30, y: a.y + (i % 3 - 1) * 8, vx: (b.x - a.x - 30) / 0.45 * (0.85 + Math.random() * 0.3), vy: (Math.random() - 0.5) * 30, life: 0.45, r: 2 + (i % 3), color: '#CFF4FF', wob: i });
      await this.wait(450);
      this.fx.bubbles(b.x, b.y, 12, { spread: 24, r: [1, 3], up: 40 });
      return;
    }
    if (who === 'player' && ev.kind === 'gravel') {
      audio.play('gravel_grenade');
      const a = this.pos('player'), b = this.pos('enemy');
      for (let i = 0; i < 12; i++) this.fx.add({ type: 'spark', x: a.x + 20, y: a.y - 10, vx: (b.x - a.x) / 0.5 * (0.9 + Math.random() * 0.2), vy: -120 + Math.random() * 40, g: 480, life: 0.5, color: i % 2 ? '#8A8F96' : '#5F6469', size: 2 });
      await this.wait(500);
      this.fx.sparks(b.x, b.y, 18, '#B0B5BA', 2, 90);
      return;
    }
    if (who === 'player' && ev.kind === 'party') {
      const a = this.pos('player');
      this.fx.confetti(a.x + 20, a.y - 10, 30, 2);
      this.fx.balloons(a.x + 40, a.y + 20, 4, 2, 60);
      await this.wait(500);
      return;
    }
    if (who === 'player' && ev.kind === 'flee') {
      audio.play('swim_away', { vol: 0.5 });
      await this.tween(0.25, (k) => { this.lunge.player = -k * 1.5; });
      await this.tween(0.2, (k) => { this.lunge.player = -(1 - k) * 1.5; });
      return;
    }
    if (who === 'bubble' && ev.kind === 'lunge') { await this.tween(0.1, (k) => { this.lunge.bubble = k; }); await this.tween(0.14, (k) => { this.lunge.bubble = 1 - k; }); return; }
    if (who === 'bubble' && ev.kind === 'heal') { this.fx.bubbles(this.pos('bubble').x, this.pos('bubble').y, 8, { color: '#B8FFC4', r: [1, 2] }); await this.wait(250); return; }
    if (who === 'bubble' && ev.kind === 'dizzy') {
      await this.tween(0.12, (k) => { this.lunge.bubble = k * 1.2; });
      this.flash.bubble = 3; this.dizzy = true;
      await this.tween(0.2, (k) => { this.lunge.bubble = 1.2 * (1 - k); });
      return;
    }
    if (who === 'enemy' && ev.kind === 'special') {
      this.charging = false;
      this.dim = 1; this.shake = 5;
      this.lungeFrame = 0;
      await this.tween(0.22, (k) => { this.lunge.enemy = k * 1.5; this.lungeFrame = Math.min(3, Math.floor(k * 4)); });
      await this.tween(0.3, (k) => { this.lunge.enemy = 1.5 * (1 - k); this.lungeFrame = k < 0.6 ? 3 : -1; });
      this.lungeFrame = -1;
      return;
    }
    if (who === 'enemy' && ev.kind === 'lunge') {
      const gar = this.enemy.kind === 'gar';
      await this.tween(gar ? 0.2 : 0.12, (k) => { this.lunge.enemy = k; if (gar) this.lungeFrame = Math.min(3, Math.floor(k * 4)); });
      await this.tween(0.16, (k) => { this.lunge.enemy = 1 - k; if (gar) this.lungeFrame = k < 0.5 ? 3 : -1; });
      this.lungeFrame = -1;
    }
  }

  // The hat drops onto the new friend at its final size, with a 2-step bounce.
  async befriendAnim() {
    const p = this.pos('enemy');
    this.fx.confetti(p.x, p.y - 20, 70, 2);
    this.fx.balloons(p.x, p.y + 30, 7, 2, 140);
    const v = this.enemySpriteV(false);
    const hv = this.enemySpriteV(true);
    // the hat alone: the hatted sprite's pixels the plain one lacks
    let hatC = null, hx = 0, hy = 0;
    if (v && hv && hv.canvas !== v.canvas) {
      const w = hv.canvas.width, h = hv.canvas.height;
      const a = hv.canvas.getContext('2d').getImageData(0, 0, w, h);
      const base = document.createElement('canvas'); base.width = w; base.height = h;
      base.getContext('2d').drawImage(v.canvas, hv.ox - v.ox, hv.oy - v.oy);
      const b = base.getContext('2d').getImageData(0, 0, w, h);
      for (let i = 0; i < a.data.length; i += 4) {
        const same = b.data[i + 3] >= 128 && Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]) < 40;
        if (same) a.data[i + 3] = 0;
      }
      hatC = document.createElement('canvas'); hatC.width = w; hatC.height = h;
      hatC.getContext('2d').putImageData(a, 0, 0);
      hx = 0; hy = 0;
    }
    if (hatC) {
      this.hatDrop = { c: hatC, hv, y: -140 };
      await this.tween(0.45, (k) => { this.hatDrop.y = -140 * (1 - k * k); });
      await this.tween(0.1, (k) => { this.hatDrop.y = -8 * k; });
      await this.tween(0.1, (k) => { this.hatDrop.y = -8 * (1 - k); });
      await this.tween(0.07, (k) => { this.hatDrop.y = -3 * k; });
      await this.tween(0.07, (k) => { this.hatDrop.y = -3 * (1 - k); });
    }
    this.hatDrop = null;
    this.befriended = true;
    await this.wait(500);
  }

  updateMeter(change) {
    const m = $('garMeter');
    const n = this.battle.meter;
    const hat = 'assets/native/original/artifacts/partyhat.png';
    m.innerHTML = '';
    for (let i = 0; i < PARTY.garMeter; i++) {
      const sp = el('span', i < n ? (change > 0 && i === n - 1 ? 'pop' : '') : '');
      sp.style.backgroundImage = `url(${balloonURL(i < n)})`;
      m.append(sp);
    }
  }

  updateHud(force) {
    const p = this.battle.p, e = this.enemy;
    const key = [p.hp, p.mp, e.hp, p.level, this.G.friendsTotal()].join();
    if (!force && key === this.hudKey) return;
    this.hudKey = key;
    $('bName').textContent = this.G.s.name;
    $('bLv').textContent = 'Lv ' + p.level;
    $('bHp').style.width = (100 * p.hp / p.hpMax) + '%';
    $('bHpT').textContent = `${p.hp}/${p.hpMax}`;
    $('bMp').style.width = (100 * p.mp / p.mpMax) + '%';
    $('bMpT').textContent = `${p.mp}/${p.mpMax}`;
    $('eHp').style.width = (100 * Math.max(0, e.hp) / e.hpMax) + '%';
    if (e.kind === 'gar') $('garFriends').textContent = `Friends ${this.G.friendsTotal()}/${PARTY.garFriendsNeeded}`;
  }

  // ---------- finish ----------
  async finish() {
    const G = this.G, b = this.battle, result = b.over;
    this.over = true;
    // copy the fight back into the save
    const s = G.s;
    s.hp = b.p.hp; s.mp = b.p.mp; s.items = { ...b.p.items };
    if (result === 'win' || result === 'friend') {
      const r = b.rewards;
      if (result === 'win') audio.play('fanfare', { vol: 0.8 });
      const out = await G.afterBattle(this, result);
      this.log(`Victory! +${r.exp} EXP and +${r.bites} Betta Bites.`);
      for (const line of out.lines) { this.log(line); await this.wait(250); }
      if (out.levels.length) await this.levelUpAnim(out.levels);
      this.updateHud(true);
    } else if (result === 'lose') {
      await this.wait(500);
      await G.afterBattle(this, result);
      return;
    } else {
      await this.wait(400);
      await G.afterBattle(this, result);
      return;
    }
    // Continue
    const row = $('bRow');
    row.innerHTML = '';
    this.continueBtn = button('<span>Continue</span>', () => { this.continueBtn = null; G.leaveBattle(this); }, 'btn primary');
    this.continueBtn.style.gridColumn = '2 / 5';
    row.append(this.continueBtn);
    nav.setFocus(this.continueBtn, false);
  }

  async levelUpAnim(levels) {
    const p = this.pos('player');
    for (const L of levels) {
      audio.play('level_up');
      this.G.vibrate(300, 0.4);
      this.fx.golden(p.x, p.y, 40, 2);
      this.log(`Level up! Now level ${L}! HP and MP restored.`);
      this.battle.p.level = L;
      if ([3, 5, 7].includes(L)) {
        await this.wait(400);
        this.flash.player = 10;
        audio.play('armor');
        this.fx.sparks(p.x, p.y, 24, '#FFFFFF', 2, 120);
      }
      await this.wait(700);
    }
  }

  // ---------- layout and drawing ----------
  layout() {
    const v = this.G.view;
    const top = this.G.cssToLogicalY(Math.max($('bHud').getBoundingClientRect().bottom, $('eHud').getBoundingClientRect().bottom));
    const bot = this.G.cssToLogicalY($('battleui').querySelector('.bottom').getBoundingClientRect().top);
    let fy = Math.round((top + bot) / 2) + 6;
    if (this.bgKey === 'garpool') fy = Math.max(fy, Math.round(v.H / 2 + 10));
    const gar = this.enemy.kind === 'gar';
    const W = v.W;
    return { px: Math.round(W * (gar ? 0.27 : 0.33)), py: fy, bx: Math.round(W * (gar ? 0.12 : 0.16)), by: fy + 16,
      ex: Math.round(W * (gar ? 0.69 : 0.72)), ey: fy + (gar ? 4 : 0), top, bot };
  }

  enemySpriteV(hat) {
    const e = this.enemy;
    if (e.kind === 'gar') {
      const base = img('garboss');
      if (hat) return hatted('garboss', base);
      if (this.lungeFrame >= 0) { const f = garLunge(this.lungeFrame); if (f) return f; }
      return fromCanvas(base);
    }
    const key = ENEMIES[e.kind].sprite;
    let v = hat ? hatted(key) : plain(key);
    if (e.edge && v) v = tinted(v, '#7B3FD0', 0.35);
    return v;
  }
  playerSpriteV() {
    const s = this.G.s, b = this.battle;
    const hat = s.wearHat || this.befriended;
    if (b.p.dived) return hat && hasReal('subh') ? hatted('sub') : plain('sub');
    const stage = PLAYER.armorStage(b.p.level);
    if (stage === 0 && !hat) {
      const f = bettaSwim([0, 1, 0, 3][Math.floor(this.t * 5) % 4], s.color);
      if (f) return f;
    }
    return betta(stage, s.color, hat);
  }

  update(dt) {
    if (this.freeze > 0) { this.freeze--; return; }
    this.t += dt;
    for (const w of this.waits.splice(0)) { w.t -= dt; if (w.t <= 0) w.r(); else this.waits.push(w); }
    for (const tw of this.tweens.splice(0)) {
      tw.t += dt;
      const k = Math.min(1, tw.t / tw.dur);
      tw.f(k);
      if (k >= 1) tw.r(); else this.tweens.push(tw);
    }
    this.fx.update(dt);
    this.shake = Math.max(0, this.shake - dt * 10);
    this.dim = Math.max(0, this.dim - dt * 0.9);
    for (const k of ['player', 'enemy', 'bubble']) if (this.flash[k] > 0) this.flash[k] -= dt * 60 / 1;
    for (const f of this.partyFriends) f.t += dt;
    if (this.itemPop) { this.itemPop.t += dt; if (this.itemPop.t > 0.8) this.itemPop = null; }
    if (this.sadBalloon) { this.sadBalloon.t += dt; if (this.sadBalloon.t > 0.7 && !this.sadBalloon.popped) { this.sadBalloon.popped = true; this.fx.sparks(this.sadBalloon.x, this.sadBalloon.y - 20, 12, '#FF4FA3', 2, 60); } if (this.sadBalloon.t > 0.8) this.sadBalloon = null; }
    if (this.dizzy && Math.random() < dt * 4) { /* stars are drawn from time */ }
    this.buildRow();
  }

  draw(ctx) {
    const v = this.G.view, L = this.layout(), t = this.t;
    const sx = this.shake > 0 ? Math.round((Math.random() - 0.5) * this.shake * 2) * 2 : 0;
    const sy = this.shake > 0 ? Math.round((Math.random() - 0.5) * this.shake * 2) * 2 : 0;
    ctx.fillStyle = '#123a66'; ctx.fillRect(0, 0, v.W, v.H);
    ctx.save(); ctx.translate(sx, sy);
    // backdrop: 432 x 200 at x2, centre-anchored, a little higher on short screens
    const bgk = (BG[this.bgKey] || BG.shallows).find((k) => hasReal(k)) || BG[this.bgKey]?.[0] || 'bg_shallows';
    const bg = img(bgk);
    if (bg) {
      const bx = Math.round((v.W - 864) / 2), by = Math.round(Math.min(0, (v.H - 400) * 0.35));
      ctx.drawImage(bg, bx, by, 864, 400);
      if (this.bgKey !== bgk.replace('bg_', '') && this.bgKey === 'spillway' && !hasReal('bg_spillway')) { ctx.fillStyle = 'rgba(120,160,200,0.15)'; ctx.fillRect(0, 0, v.W, v.H); }
    }
    // light shafts
    if (!this.rimOn) {
      ctx.save(); ctx.globalAlpha = 0.06; ctx.fillStyle = '#FFF1B0';
      for (let i = 0; i < 4; i++) {
        const x = ((i * 230 + t * 8) % (v.W + 200)) - 100;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 30, 0); ctx.lineTo(x - 120, v.H); ctx.lineTo(x - 150, v.H); ctx.fill();
      }
      ctx.restore();
    }
    const R = (vv) => (this.rimOn && vv ? rim(vv) : vv);
    // party friends behind
    this.partyFriends.forEach((f, i) => {
      if (f.t < 0) return;
      const fv = hatted(ENEMIES[f.kind]?.sprite || 'guppy');
      const enter = Math.min(1, f.t * 2);
      const x = Math.round(L.px - 40 - (i % 3) * 40 - (1 - enter) * 200), y = L.py - 50 + Math.floor(i / 3) * 90 - (i % 2) * 14;
      drawFish(ctx, R(fv), x, y + Math.round(Math.sin(t * 6 + i) * 2), { s: 2, sway: Math.sin(t * 10 + i), bob: 0 });
    });
    // Bubble
    if (this.G.s.flags.bubbleJoined) {
      const bv = R(plain('bubble'));
      const bxx = L.bx + Math.round(this.lunge.bubble * 40);
      const flashB = this.flash.bubble > 0;
      drawFish(ctx, flashB ? white(bv) : bv, bxx, L.by, { s: 2, sway: Math.sin(t * 6) * 1, bob: Math.round(Math.sin(t * 2.3)) * 2 });
      if (this.dizzy) for (let i = 0; i < 3; i++) {
        const a = t * 4 + i * 2.1;
        const x = Math.round(bxx + Math.cos(a) * 18), y = Math.round(L.by - 36 + Math.sin(a) * 5);
        ctx.fillStyle = '#F7C948'; ctx.fillRect(x - 1, y - 3, 2, 6); ctx.fillRect(x - 3, y - 1, 6, 2);
      }
    }
    // player
    const pv = R(this.playerSpriteV());
    const pxx = L.px + Math.round(this.lunge.player * 50);
    drawFish(ctx, this.flash.player > 0 && Math.floor(this.flash.player) % 2 === 0 ? white(pv) : pv, pxx, L.py,
      { s: 2, sway: this.battle.p.dived ? 0 : Math.sin(t * 6) * 1, bob: Math.round(Math.sin(t * 2)) * 2 });
    // enemy
    if (!this.hidden.enemy) {
      let ev = this.enemySpriteV(this.befriended);
      ev = R(ev);
      const exx = L.ex - Math.round(this.lunge.enemy * 60);
      const opts = { s: 2, flip: true, sway: Math.sin(t * 6) * 1, bob: Math.round(Math.sin(t * 1.8)) * 2 };
      if (this.charging) { ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 10); drawFish(ctx, glow(ev, '#F7C948'), exx, L.ey, opts); ctx.globalAlpha = 1; }
      if (this.enemy.edge) { ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 3); drawFish(ctx, glow(ev, '#B57BFF'), exx, L.ey, opts); ctx.globalAlpha = 1; }
      drawFish(ctx, this.flash.enemy > 0 ? white(ev) : ev, exx, L.ey, opts);
      if (this.hatDrop) {
        const hd = this.hatDrop, hv = hd.hv;
        // same placement as the hatted sprite, mirrored like the fish
        const bxp = Math.round(exx - (hv.bw * 2) / 2), byp = Math.round(L.ey - (hv.bh * 2) / 2 + opts.bob);
        ctx.save();
        ctx.translate(bxp * 2 + hv.bw * 2, 0); ctx.scale(-1, 1);
        ctx.drawImage(hd.c, bxp - hv.ox * 2, byp - hv.oy * 2 + Math.round(hd.y), hd.c.width * 2, hd.c.height * 2);
        ctx.restore();
      }
    }
    // a sad balloon that pops
    if (this.sadBalloon && !this.sadBalloon.popped) {
      const b = this.sadBalloon;
      this.fx.list.length; // keep
      const x = Math.round(b.x), y = Math.round(b.y - b.t * 30);
      ctx.fillStyle = '#2A1A12'; ctx.fillRect(x - 6, y - 8, 12, 16); ctx.fillStyle = '#FF4FA3'; ctx.fillRect(x - 5, y - 7, 10, 14); ctx.fillStyle = '#2A1A12'; ctx.fillRect(x, y + 8, 2, 10);
    }
    if (this.itemPop?.c) {
      const ip = this.itemPop; const c = ip.c;
      ctx.drawImage(c, Math.round(ip.x - c.width), Math.round(ip.y - ip.t * 20), c.width * 2, c.height * 2);
    }
    // foreground rice tufts at x2
    const tuft = img('tuft');
    if (tuft) for (const fx of [0.04, 0.26, 0.8, 0.96]) {
      const x = Math.round(v.W * fx), y = L.bot + 4;
      const k = Math.sin(t * 1.5 + fx * 10) * 2;
      for (let r = 0; r < tuft.height; r++) ctx.drawImage(tuft, 0, r, tuft.width, 1, x - tuft.width + Math.round(k * (1 - r / tuft.height)) * 2, y - tuft.height * 2 + r * 2, tuft.width * 2, 2);
    }
    this.fx.draw(ctx);
    ctx.restore();
    if (this.dim > 0) { ctx.fillStyle = `rgba(2,6,14,${0.45 * Math.min(1, this.dim)})`; ctx.fillRect(0, 0, v.W, v.H); }
  }
}

let balloonCache = {};
function balloonURL(full) {
  if (balloonCache[full]) return balloonCache[full];
  const c = document.createElement('canvas'); c.width = 10; c.height = 13;
  const g = c.getContext('2d');
  g.fillStyle = '#0B1424'; g.fillRect(2, 0, 6, 10); g.fillRect(1, 1, 8, 8); g.fillRect(4, 10, 2, 3);
  g.fillStyle = full ? '#FF4FA3' : '#3A4A60'; g.fillRect(2, 1, 6, 8); g.fillRect(3, 9, 4, 1);
  if (full) { g.fillStyle = '#FFFFFF'; g.fillRect(3, 2, 1, 2); }
  balloonCache[full] = c.toDataURL();
  return balloonCache[full];
}
