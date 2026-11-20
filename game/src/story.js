// story.js: the scripted parts: who says what (flag-driven lines), the
// opening, the Old Stump, the scales and the straw bundle, the Lock-Keeper,
// the cogs and the drain gate, the shadow in the Murk, the Gate Spring,
// Mossy, the Gar, both endings and Peace in the Paddies.
import { LINES, FRIEND_LINES, STORY, SPEAKERS } from './strings.js';
import { WORLD, PLAYER, INN_PRICE, SUB_PRICE, ITEMS } from './config.js';
import { maxHp, maxMp, friendsTotal, peaceDone } from './state.js';
import { img } from './assets.js';
import { hatted, plain, fromCanvas, drawFish, tinted } from './sprites.js';
import { pixelBubble } from './fx.js';
import { spriteV } from './world.js';

export function createStory(G) {
  const S = () => G.s;
  const F = () => G.s.flags;

  // ---------- which lines ----------
  const cond = (name, id) => {
    const s = S(), f = s.flags;
    switch (name) {
      case 'garFriend': return !!f.garFriend;
      case 'garDefeated': return !!f.garDefeated && !f.garFriend;
      case 'peace': return !!f.peace;
      case 'lowHp': return s.hp < maxHp(s) * 0.35;
      case 'sub': return s.subOwned;
      case 'highwater': return !!f.highwater;
      case 'armor3': return s.level >= 7;
      case 'armor2': return s.level >= 5;
      case 'firstFriend': return friendsTotal(s) >= 1;
      case 'scales5': return s.scales.length >= 5 && !f.trailFound;
      case 'met': return !!s.met[id];
      case 'first': return true;
      default: return !!f[name];
    }
  };
  const pick = (id, set = LINES[id]) => {
    for (const [c, lines] of set) if (cond(c, id)) return lines;
    return [];
  };
  const fill = (t) => t.replace(/\{name\}/g, S().name).replace(/\{cost\}/g, String(INN_PRICE))
    .replace(/\{friends\}/g, String(friendsTotal(S())));
  const sayAll = async (who, lines) => { for (const l of lines) await G.say(who, fill(l)); };

  // ---------- creatures the story places ----------
  function populate(w) {
    const s = S(), f = s.flags;
    if (w.areaId === 'shallows' && f.bubbleJoined && !f.stumpDone) {
      // the angelfish waits at the Old Stump
      w.enemies.push(w.makeEnemy({ kind: 'angel', level: 2, x: 1330, y: 720, id: 'stumpAngel', stump: true, still: true }));
    }
    if (w.areaId === 'ditch') {
      const resolved = f.garDefeated || f.garFriend;
      if (!resolved) {
        const cap = [['mossy', 175, 452], ['cap1', 150, 440], ['cap2', 200, 438], ['cap3', 185, 428]];
        for (const [id, x, y] of cap) w.extra.push({ id, sprite: id, x, y, face: 1, t: Math.random() * 6, sortOff: 0, talk: true, talkRange: 46 });
      }
      w.props.find((p) => p.id === 'cage').sprite = resolved ? 'p_cageopen' : 'p_cage';
      w.extra.push({ id: 'gar', sprite: 'garboss', x: 700, y: 430, hx: 700, hy: 430, face: -1, t: 0, talk: !!resolved, talkRange: 80, sortOff: 30,
        hat: !!f.garFriend, draw: drawGar });
      w.extra.push({ id: 'spring', x: 640, y: 112, t: 0, draw: drawSpring, sortOff: -40 });
    }
    if (w.areaId === 'village' && (f.peace || G.endingParty)) {
      // a party in the village square: friends in hats
      const kinds = Object.keys(s.friends).filter((k) => s.friends[k] > 0);
      let i = 0;
      for (const k of kinds) for (let n = 0; n < Math.min(2, s.friends[k]); n++) {
        const a = (i / 12) * Math.PI * 2;
        w.extra.push({ id: 'party' + i, sprite: { guppy: 'guppy', angel: 'angel', cat: 'cat', nymph: 'nymph', cich: 'cich', cray: 'cray' }[k], hat: true,
          x: 512 + Math.cos(a) * 110, y: 380 + Math.sin(a) * 40, face: Math.cos(a) > 0 ? -1 : 1, t: i, partyKind: k, talk: true });
        i++;
      }
    }
    if (w.areaId === 'village' && (f.garDefeated || f.garFriend)) {
      // the rescued fish are home
      [['mossy', 640, 220], ['cap1', 380, 260], ['cap2', 700, 380], ['cap3', 300, 380]].forEach(([id, x, y]) =>
        w.extra.push({ id, sprite: id, x, y, face: -1, t: Math.random() * 6, talk: true, hat: !!f.garFriend }));
    }
  }

  function drawGar(ctx, n, t) {
    const v = n.hat ? hatted('garboss', img('garboss')) : fromCanvas(img('garboss'));
    const sulk = F().garDefeated && !F().garFriend;
    drawFish(ctx, v, n.x + Math.sin(t * 0.4) * 10, n.y + Math.sin(t * 0.9) * 2, { flip: n.face < 0, sway: Math.sin(t * (sulk ? 1.5 : 3)) * 1.5, swayLen: 0.3 });
  }
  function drawSpring(ctx, n, t) {
    if (!F().gateOpen) return;
    ctx.save();
    ctx.globalAlpha = 0.18 + Math.sin(t * 2) * 0.06;
    ctx.fillStyle = '#9FD8E0';
    ctx.beginPath(); ctx.ellipse(n.x, n.y - 4, 22, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    for (let i = 0; i < 7; i++) {
      const ph = (t * 0.9 + i / 7) % 1;
      pixelBubble(ctx, n.x - 6 + ((i * 5) % 12) + Math.sin(t * 3 + i) * 2, n.y - 6 - ph * 50, 1 + (i % 2), '#CFF4FF');
    }
  }

  // ---------- talking ----------
  async function talk(it) {
    const s = S(), f = s.flags;
    if (it.kind === 'gate') return gateTalk(it.ref.talk);
    if (it.kind === 'bubble') return sayAll('bubble', pick('bubble'));
    if (it.kind === 'friend') {
      const lines = FRIEND_LINES[it.ref.kind] || ['Party!'];
      return G.say({ name: 'Friend', sprite: G.spriteCanvas(it.ref.kind === 'cat' ? 'cat' : it.ref.kind) }, lines[Math.floor(Math.random() * lines.length)]);
    }
    const n = it.ref, id = n.id;
    if (it.kind === 'extra') {
      if (id === 'gar') return garTalk();
      if (id.startsWith('party')) {
        const l = FRIEND_LINES[n.partyKind] || ['Party!'];
        return G.say({ name: 'Friend', sprite: G.spriteCanvas(n.sprite) }, l[0]);
      }
      if (id === 'mossy') {
        if (f.garDefeated || f.garFriend) return G.say('mossy', 'Home at last! Thank you for coming to find us, ' + s.name + '.');
        f.mossyTalked = true;
        return sayAll('mossy', s.met.mossy ? [LINES.mossy[0][1][1]] : LINES.mossy[0][1]).then(() => { s.met.mossy = true; });
      }
      if (id.startsWith('cap')) {
        if (f.garDefeated || f.garFriend) return G.say(id, 'Home sweet paddy! Thank you!');
        return G.say(id, LINES.captive[0][1][0]);
      }
      return;
    }
    switch (id) {
      case 'finn': return sayAll('finn', pick('finn'));
      case 'coral': {
        const lines = s.met.coral ? pick('coral') : LINES.coral.find(([c]) => c === 'first')[1];
        s.met.coral = true;
        let ls = lines.map((l) => l.replace('{cost}', SUB_PRICE));
        for (const l of ls) await G.say('coral', fill(l));
        return G.openShop('coral');
      }
      case 'seaweed': case 'kelpie': {
        const first = !s.met[id];
        const lines = first ? LINES[id].find(([c]) => c === 'first')[1] : pick(id);
        s.met[id] = true;
        for (const l of lines) await G.say(id, fill(l));
        return G.innOffer(id === 'seaweed' ? 'village' : 'highwater');
      }
      case 'reef': {
        const first = !s.met.reef;
        s.met.reef = true;
        if (first) return sayAll('reef', LINES.reef.find(([c]) => c === 'first')[1].filter((l, i, a) => f.stumpDone ? i < a.length - 1 : true));
        return sayAll('reef', pick('reef'));
      }
      case 'bubbleHome': {
        const first = !s.met.bubbleHome;
        s.met.bubbleHome = true;
        return sayAll('bubble', first ? LINES.bubbleHome[1][1] : pick('bubbleHome'));
      }
      case 'pip': {
        const first = !s.met.pip;
        s.met.pip = true;
        await sayAll('pip', first ? LINES.pip.find(([c]) => c === 'first')[1] : pick('pip'));
        return G.openShop('pip');
      }
      case 'whorl': return whorlTalk();
      case 'folk1': case 'folk2': case 'folk3': {
        s.met[id] = true;
        return sayAll(id, pick(id));
      }
    }
  }

  async function gateTalk(kind) {
    const s = S(), f = s.flags;
    if (kind === 'reefGate') {
      if (!f.bubbleJoined) return G.say('reef', LINES.reefGateClosed.alone[0]);
      return G.say('reef', LINES.reefGateClosed.stump[0]);
    }
    if (kind === 'culvertDark') return G.say('sign', STORY.culvertDark);
    if (kind === 'bundle') {
      if (s.scales.length >= 5) return bundleScene();
      return G.say('bubble', STORY.bundleHeavy(s.scales.length));
    }
    if (kind === 'drainGate') {
      if (s.cogs.length < 3) return G.say('sign', STORY.gateNeeds(s.cogs.length));
      return gateScene();
    }
  }

  async function whorlTalk() {
    const s = S(), f = s.flags;
    if (!f.lantern) {
      s.met.whorl = true;
      const lines = LINES.whorl.find(([c]) => c === 'first')[1];
      await G.say('whorl', lines[0]);
      await G.say('whorl', lines[1]);
      await G.say('whorl', lines[2]);
      f.highwater = true; f.lantern = true;
      G.sfx('item');
      G.toast('You got the drain-gate key and the glow-moss lantern!', 2600, 'i_lantern');
      G.save();
      await G.say('whorl', lines[3]);
      return;
    }
    const after = pick('whorlAfter', LINES.whorlAfter);
    return sayAll('whorl', after.length ? after : pick('whorl'));
  }

  async function garTalk() {
    const f = F();
    if (f.garFriend) return G.say('gar', LINES.garPost.friend[0]);
    if (f.garDefeated) {
      const c = await G.say('gar', LINES.garPost.fins[0], ['Battle again', 'Leave it be']);
      if (c === 0) return G.startBattle({ kind: 'gar', level: 10, entity: null });
    }
  }

  // ---------- scenes ----------
  async function opening() {
    const s = S();
    await G.wait(500);
    G.player().face = -1;
    const L = LINES.finnOpening;
    for (const l of L.slice(0, 4)) await G.say('finn', fill(l));
    s.flags.metFinn = true;
    s.met.finn = true;
    await G.say('finn', fill(L[4]));
    G.sfx('shell_crack', { rate: 0.6 });
    G.toast('The south gate is open!');
    G.save();
    G.hintOnce('swim');
  }

  let stumpRunning = false;
  async function stumpScene(w) {
    const s = S(), f = s.flags;
    if (stumpRunning) return;
    stumpRunning = true;
    await G.cutscene(async () => {
      G.sfx('bite', { rate: 0.6 });
      await G.say('sign', STORY.stumpFoundScale);
      f.stumpScale = true;
      // Bubble catches up
      const p = w.player;
      w.bubble.x = p.x - 220; w.bubble.y = p.y - 40; w.bubble.face = 1;
      f.bubbleJoined = true;
      G.save();
      p.trail = [];
      await G.moveBubbleTo(p.x - 30, p.y + 4);
      G.sfx('bubble_chirp');
      await G.say('bubble', STORY.bubbleArrives);
      await G.say('bubble', STORY.stumpScale);
      // the angelfish charges in
      const e = w.makeEnemy({ kind: 'angel', level: 2, x: p.x + 200, y: p.y - 30, id: 'stumpAngel', stump: true, still: true });
      w.enemies.push(e);
      G.sfx('notice');
      await G.moveEntity(e, p.x + 26, p.y, 150);
    });
    stumpRunning = false;
    const e = w.enemies.find((q) => q.id === 'stumpAngel');
    if (e) G.startBattle({ enemy: e });
  }

  async function bundleScene() {
    const s = S(), f = s.flags;
    if (f.trailFound) return;
    await G.cutscene(async () => {
      await G.say('bubble', STORY.bundleShove);
      G.sfx('shell_crack', { rate: 0.6 });
      G.shake(3);
      const w = G.world();
      const b = w.props.find((q) => q.id === 'bundle');
      f.trailFound = true;
      if (b) { b.until = null; await G.tweenProp(b, b.x + 80, b.y + 30, 0.7); b.until = 'trailFound'; }
      G.save();
      await G.say('sign', STORY.bundleGone);
    });
  }

  async function gateScene() {
    const f = F();
    await G.cutscene(async () => {
      G.sfx('shell_crack', { rate: 0.5 });
      G.shake(4);
      f.gateOpen = true;
      G.save();
      await G.say('sign', STORY.gateOpens);
      await G.say('bubble', 'Five friends for a party... How many do we have? (Friends ' + friendsTotal(S()) + '/5)');
    });
  }

  async function shadowScene(w) {
    const f = F();
    f.shadowSeen = true;
    await G.cutscene(async () => {
      const p = w.player;
      const sh = { id: 'shadow', x: p.x + 40, y: p.y - 70, face: -1, t: 0, draw: (ctx, n, t) => {
        const v = tinted(plain('garsmall'), '#05101C', 0.7);
        ctx.globalAlpha = 0.85; drawFish(ctx, v, n.x, n.y, { flip: true, sway: Math.sin(t * 6) * 1.5 }); ctx.globalAlpha = 1;
      } };
      w.extra.push(sh);
      await G.moveEntity(sh, 100, 300, 120);
      w.extra = w.extra.filter((q) => q !== sh);
      G.sfx('bubble_chirp', { rate: 1.3 });
      await G.say('bubble', STORY.shadowSeen);
    });
  }

  async function springRest() {
    const s = S();
    s.hp = maxHp(s); s.mp = maxMp(s); s.rest = 'spring';
    G.sfx('inn');
    G.toast(STORY.springRest, 2600);
    G.save();
  }

  // ---------- every update: proximity triggers ----------
  let springCool = 0;
  function update(w, dt) {
    const s = S(), f = s.flags, p = w.player;
    springCool = Math.max(0, springCool - dt);
    if (G.busy()) return;
    if (w.areaId === 'shallows' && f.metFinn && !f.bubbleJoined) {
      const st = w.props.find((q) => q.id === 'stump');
      if (st && Math.hypot(p.x - st.x, p.y - (st.y - 16)) < 90) stumpScene(w);
    }
    if (w.areaId === 'reedwater' && !f.trailFound && s.scales.length >= 5) {
      const b = w.props.find((q) => q.id === 'bundle');
      if (b && Math.hypot(p.x - b.x, p.y - (b.y - 10)) < WORLD.bundleRange) bundleScene();
    }
    if (w.areaId === 'murk' && !f.shadowSeen && p.x < w.def.deepBelowX) shadowScene(w);
    if (w.areaId === 'ditch' && f.gateOpen && springCool <= 0 && Math.hypot(p.x - 640, p.y - 110) < 30) { springCool = 4; springRest(); }
    if (w.areaId === 'ditch' && !f.garDefeated && !f.garFriend) {
      const gar = w.extra.find((q) => q.id === 'gar');
      if (gar && Math.abs(p.x - gar.x) < 75 && Math.abs(p.y - gar.y) < 28) {
        if (!f.mossyTalked) {
          f.mossyTalked = true;
          G.cutscene(async () => { await sayAll('mossy', LINES.mossy[0][1]); s.met.mossy = true; }).then(() => G.startBattle({ kind: 'gar', level: 10 }));
        } else G.startBattle({ kind: 'gar', level: 10 });
      }
    }
  }

  // ---------- pickups ----------
  async function collected(q) {
    const s = S(), f = s.flags;
    if (q.type === 'scale') {
      const n = s.scales.length;
      G.toast(STORY.scaleN(n), 2200, 'i_scale');
      G.save();
      if (n === 3) await G.say('bubble', STORY.thirdScale);
      if (n === 5) {
        const w = G.world(), b = w.props.find((x) => x.id === 'bundle');
        if (b && Math.hypot(w.player.x - b.x, w.player.y - b.y) < WORLD.bundleRange) await bundleScene();
        else await G.say('bubble', STORY.allScales);
      }
    }
    if (q.type === 'cog') {
      G.toast(STORY.cogN(s.cogs.length), 2200, 'i_cog');
      G.save();
      if (s.cogs.length === 3) await G.say('bubble', 'That\'s all three cogs! To the drain gate!');
    }
  }

  // ---------- after battles ----------
  async function afterBattle(result, scene) {
    const s = S(), f = s.flags;
    const e = scene.enemy;
    if (scene.battle.scripted === 'stump' && result === 'friend') {
      f.stumpDone = true; f.hbtLearned = true;
      G.save();
      await G.say('bubble', 'You did it! A friend in a party hat!');
      await G.say('bubble', 'Let\'s go tell Captain Reef. He\'ll open the reed gate east!');
    }
    if (e.kind === 'gar' && (result === 'win' || result === 'friend')) {
      const first = !(f.garDefeated || f.garFriend);
      const ending = result === 'friend' ? 'friend' : 'fins';
      if (result === 'friend') f.garFriend = true; else f.garDefeated = true;
      if (!s.ending) s.ending = ending;
      const seen = s.endingsSeen[ending];
      s.endingsSeen[ending] = true;
      G.save();
      if (!seen) await G.playEnding(ending);
    }
  }

  async function checkPeace() {
    const s = S();
    if (!s.flags.peace && peaceDone(s)) {
      s.flags.peace = true;
      G.save();
      await G.bigBanner(STORY.peaceTitle, STORY.peaceBody + ' There\'s a party in the village square!');
    }
  }

  // ---------- endings ----------
  function endingLines(kind) {
    if (kind === 'friend') return [['finn', STORY.friendEnd], ['whorl', STORY.friendEndWhorl], ['mossy', STORY.mossyHome], ['gar', 'PARTY... AGAIN?']];
    return [['mossy', STORY.mossyHome], ['finn', STORY.finsEnd]];
  }

  return { populate, talk, update, opening, collected, afterBattle, checkPeace, endingLines, gateTalk, pick, cond };
}

export { SPEAKERS };
