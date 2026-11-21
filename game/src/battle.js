// battle.js: the battle rules, pure (no DOM, no drawing). Used by the game,
// which animates the events it returns, and by tools/sim-battles.mjs.
import { SNARL, snarlHp, snarlDmg, snarlExp, garFor } from './config.js';
import { PLAYER, MOVES, PARTY, BUBBLE, ITEMS, ENEMIES, EDGE, GAR, ENEMY_HIT,
  enemyHp, enemyDmg, enemyExp } from './config.js';

// mulberry32: small, fast, seedable.
export function makeRng(seed = 1) {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    chance: (p) => next() < p,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    get state() { return s; },
    set state(v) { s = v >>> 0; },
  };
}

// opts: { k: the New Game+ level bonus, gar: garFor(...) for the Gar }
export function makeEnemy(kind, level, edge = false, opts = {}) {
  const k = opts.k || 0;
  if (kind === 'gar') {
    const g = opts.gar || garFor(k);
    return { kind, name: GAR.name, level: g.level, hp: g.hp, hpMax: g.hp, lo: g.lo, hi: g.hi, special: g.special,
      exp: g.exp, bites: g.bites, meter0: g.meter0 || 0, edge: false, boss: true, shell: false, k };
  }
  if (kind === 'snarl') {
    const hp = snarlHp(level), [lo, hi] = snarlDmg(level);
    return { kind, name: SNARL.name, level, hp, hpMax: hp, lo, hi, edge: false, boss: true, shell: false,
      net: SNARL.netKnots, k };
  }
  const def = ENEMIES[kind];
  if (edge) level = EDGE.level + k;
  let hp = enemyHp(kind, level);
  let [lo, hi] = enemyDmg(kind, level);
  if (edge) { hp = Math.floor(hp * EDGE.mult); lo = Math.floor(lo * EDGE.mult); hi = Math.floor(hi * EDGE.mult); }
  return { kind, name: (edge ? 'Edge ' : '') + def.name, level, hp, hpMax: hp, lo, hi, edge, boss: false,
    shell: !!def.shell, k };
}

export function partyChance(L, enemy, friends) {
  const p = L >= PLAYER_BIG() ? PARTY.big : PARTY.small;
  const frac = 1 - enemy.hp / enemy.hpMax;
  let c = Math.min(p.max, p.base + p.perHp * frac + p.perFriend * friends);
  const gap = enemy.level - L;
  if (gap > 0) c *= Math.max(PARTY.gapFloor, Math.pow(PARTY.gapFactor, gap));
  if (enemy.edge) c *= PARTY.edgeFactor;
  return c;
}
const PLAYER_BIG = () => PLAYER.bigPartyLevel;

export function rewardsFor(enemy, rng) {
  if (enemy.kind === 'gar') return { exp: enemy.exp ?? GAR.exp, bites: enemy.bites ?? GAR.bites };
  if (enemy.kind === 'snarl') return { exp: snarlExp(enemy.level), bites: SNARL.bites(enemy.k || 0) };
  let exp = enemyExp(enemy.kind, enemy.level);
  let bites = rng.int(1, 5) + enemy.level * rng.int(1, 2);
  if (enemy.edge) { exp = Math.floor(exp * EDGE.rewardMult); bites = Math.floor(bites * EDGE.rewardMult); }
  return { exp, bites };
}

const fill = (s, v) => s.replace(/\{(\w+)\}/g, (m, k) => (v[k] !== undefined ? v[k] : m));

// A battle. opts:
//   player: { name, level, hp, mp, items: {kelp, seedcake, bwater, fizzy}, subOwned, dived, friends }
//   bubble: Bubble is in this fight (after bubbleJoined)
//   hbtLearned: Party! is available
//   scripted: null | 'tutorial' | 'stump'
//   rng: makeRng(...)
export class Battle {
  constructor({ player, enemy, bubble = false, hbtLearned = false, scripted = null, rng = makeRng(1), garLine = null }) {
    this.garLine = garLine;
    this.p = { ...player, items: { ...player.items } };
    this.p.hpMax = PLAYER.maxHp(this.p.level);
    this.p.mpMax = PLAYER.maxMp(this.p.level);
    this.e = enemy;
    this.bubble = bubble;
    this.hbtLearned = hbtLearned;
    this.scripted = scripted;
    this.rng = rng;
    this.turn = 0;          // player turns taken
    this.gturn = 0;         // Gar turns taken
    this.dizzy = false;
    this.healed = false;
    this.meter = enemy.meter0 || 0;
    this.tangled = false;   // the Snarl's net is on you: your next turn is Attack or an item
    this.freeing = false;   // ...and Bubble's action that round is nibbling it off
    this.wasTangled = false;
    this.sturn = 0;         // the Snarl's own turns
    this.netSoftSaid = false;
    this.partyStarted = false;
    this.outOfFizzSaid = false;
    this.stumpLit = false;  // the Old Stump lesson has lit Party!
    this.tutorialDodged = false;
    this.warned = false;    // the Gar warned it will use its special next turn
    this.over = null;       // 'win' | 'friend' | 'lose' | 'fled'
    this.rewards = null;
    this.events = [];
  }

  get armor() { return this.p.dived ? PLAYER.subArmor : PLAYER.armor(this.p.level); }
  hitFor(d) { return Math.max(1, d - this.armor); }

  // What the menu can do now. Each: { ok, why }
  can(action) {
    const p = this.p, e = this.e;
    if (this.over) return { ok: false, why: '' };
    const TANGLED = 'Tangled! Only Attack or an item this turn.';
    if (this.tangled && !(action === 'attack' || action.startsWith('item:'))) return { ok: false, why: TANGLED, tangled: true };
    switch (action) {
      case 'attack': return { ok: true };
      case 'bubbleBlast':
        return p.mp >= MOVES.bubbleBlast.mp ? { ok: true } : { ok: false, why: `Not enough MP to cast Bubble Blast! (${MOVES.bubbleBlast.mp} MP)` };
      case 'gravelGrenade':
        if (p.level < MOVES.gravelGrenade.level) return { ok: false, why: `Gravel Grenade unlocks at level ${MOVES.gravelGrenade.level}!` };
        return p.mp >= MOVES.gravelGrenade.mp ? { ok: true } : { ok: false, why: `Not enough MP to cast Gravel Grenade! (${MOVES.gravelGrenade.mp} MP)` };
      case 'party': {
        if (this.scripted === 'stump') {
          return this.stumpLit ? { ok: true, free: true } : { ok: false, why: 'Bubble will show you this.' };
        }
        if (!this.hbtLearned) return { ok: false, why: 'Bubble will show you this.' };
        if (e.kind === 'snarl' && e.net > 0) return { ok: false, why: 'It can\'t hear the party through all that net! Rip it first: Gravel Grenade, or keep biting.' };
        if (e.kind === 'gar') {
          if (p.friends < PARTY.garFriendsNeeded) return { ok: false, why: `Not enough friends for this party! (Friends ${p.friends}/${PARTY.garFriendsNeeded})` };
          if (!this.partyStarted) return { ok: true, free: true };
          if (p.mp < MOVES.party.mp) return { ok: false, why: this.bubble ? "Bubble: We're out of fizz! A Bubble Water, quick!" : 'Not enough MP for a party!', fizz: true };
          return { ok: true };
        }
        return p.mp >= MOVES.party.mp ? { ok: true } : { ok: false, why: `Not enough MP for Happy Balloon Time! (${MOVES.party.mp} MP)` };
      }
      case 'flee':
        if (this.scripted === 'stump') return { ok: false, why: "Bubble: We can't leave now!" };
        return { ok: true };
      case 'dive':
        return p.subOwned ? { ok: true } : { ok: false, why: '' };
      default:
        if (action.startsWith('item:')) {
          const k = action.slice(5);
          if (!ITEMS[k]) return { ok: false, why: '' };
          if (!(p.items[k] > 0)) return { ok: false, why: `You have no ${ITEMS[k].name}.` };
          return { ok: true };
        }
        return { ok: false, why: '' };
    }
  }

  push(ev) { this.events.push(ev); }
  log(text) { this.push({ t: 'log', text }); }

  // Opening lines.
  start() {
    this.events = [];
    const e = this.e;
    if (e.kind === 'gar') {
      this.push({ t: 'say', who: 'gar', text: this.garLine || '...MINE. NO MORE... ALONE.' });
      this.log(`The ${e.name} rises from the deep! (Level ${e.level})`);
    } else if (this.scripted === 'stump') {
      this.log(`A Territorial Angelfish charges in! (Level ${e.level})`);
    } else if (e.kind === 'snarl') {
      this.log(`The Snarl blocks the steps! (Level ${e.level})`);
      if (this.bubble) this.push({ t: 'say', who: 'bubble', text: this.p.level >= MOVES.gravelGrenade.level
        ? 'That net\'s too thick to bite through! A Gravel Grenade would rip it open.'
        : 'That net\'s too thick... Keep biting at it: every hit frays it!' });
    } else {
      this.log(`A wild ${e.name} (Level ${e.level}) appears!`);
    }
    return this.events;
  }

  // The player's turn. Returns the events of the whole round, or
  // { refused: why } when the action can't be taken (no turn spent).
  act(action) {
    const c = this.can(action);
    if (!c.ok) return { refused: c.why || 'You can\'t do that now.' };
    this.events = [];
    this.turn++;
    this.wasTangled = this.tangled;
    this.tangled = false;
    const e = this.e;
    const first = !!(ENEMIES[e.kind]?.first);
    if (first) {
      this.enemyAct();
      if (this.checkLose()) return this.events;
    }
    this.playerAct(action, c);
    if (this.over) return this.events;
    if (this.bubble) {
      this.bubbleAct();
      if (this.over) return this.events;
    }
    if (!first) {
      this.enemyAct();
      if (this.checkLose()) return this.events;
    }
    this.afterRound();
    return this.events;
  }

  checkLose() {
    if (this.p.hp <= 0) {
      this.p.hp = 0;
      this.over = 'lose';
      this.log(`${this.p.name} is too tired to go on...`);
      this.push({ t: 'end', result: 'lose' });
      return true;
    }
    return false;
  }

  damageEnemy(dmg, by) {
    const e = this.e;
    let floor = this.scripted === 'stump' ? 1 : 0;
    const before = e.hp;
    e.hp = Math.max(floor, e.hp - dmg);
    this.push({ t: 'dmg', target: 'enemy', amount: dmg, by });
    if (floor && e.hp === 1 && before - dmg < 1) this.log('The angelfish is too stubborn to give up!');
    if (e.hp <= 0) {
      this.over = 'win';
      this.rewards = rewardsFor(e, this.rng);
      this.push({ t: 'sfx', name: 'enemy_defeated' });
      this.log(e.kind === 'snarl' ? 'The Snarl scuttles off to sulk in the side pool.' : `Defeated the ${e.name}!`);
      this.push({ t: 'end', result: 'win', rewards: this.rewards });
    }
  }

  playerAct(action, c) {
    const p = this.p, e = this.e, r = this.rng;
    const b = PLAYER.bonus(p.level);
    const shellCut = (d) => (e.shell ? Math.max(1, d - ENEMIES.cray.shell) : d);
    switch (action) {
      case 'attack': {
        this.push({ t: 'anim', who: 'player', kind: 'lunge' });
        if (this.scripted === 'tutorial' && !this.tutorialDodged) {
          this.tutorialDodged = true;
          this.push({ t: 'miss', target: 'enemy' });
          this.log(`The ${e.name} darts aside!`);
          this.push({ t: 'hint', text: 'Quick fish! Bubble Blast never misses (3 MP).', spell: 'bubbleBlast' });
          return;
        }
        if (!r.chance(MOVES.attack.hit)) { this.push({ t: 'miss', target: 'enemy' }); this.log(`${p.name} misses!`); return; }
        if (ENEMIES[e.kind]?.dodge && r.chance(ENEMIES[e.kind].dodge)) {
          this.push({ t: 'miss', target: 'enemy', dodge: true });
          this.log(`The ${e.name} slips aside!`);
          return;
        }
        const d = this.netCut(shellCut(r.int(MOVES.attack.lo, MOVES.attack.hi) + b));
        this.log(`${p.name} bites the ${e.name} for ${d}!`);
        this.fray();
        this.push({ t: 'sfx', name: 'hit' });
        this.damageEnemy(d, 'player');
        return;
      }
      case 'bubbleBlast': {
        p.mp -= MOVES.bubbleBlast.mp;
        this.push({ t: 'mp', amount: -MOVES.bubbleBlast.mp });
        this.push({ t: 'anim', who: 'player', kind: 'bubbles' });
        const d = this.netCut(shellCut(r.int(MOVES.bubbleBlast.lo, MOVES.bubbleBlast.hi) + b));
        this.log(`${p.name} unleashes a Bubble Blast for ${d}!`);
        this.fray();
        this.damageEnemy(d, 'player');
        return;
      }
      case 'gravelGrenade': {
        p.mp -= MOVES.gravelGrenade.mp;
        this.push({ t: 'mp', amount: -MOVES.gravelGrenade.mp });
        this.push({ t: 'anim', who: 'player', kind: 'gravel' });
        const d = r.int(MOVES.gravelGrenade.lo, MOVES.gravelGrenade.hi) + b;
        if (e.shell) {
          e.shell = false;
          this.push({ t: 'sfx', name: 'shell_crack' });
          this.log(`The gravel cracks the crayfish's shell!`);
        }
        if (e.net > 0) {
          e.net = 0;
          this.push({ t: 'sfx', name: 'net_rip' });
          this.push({ t: 'netRip' });
          this.log('The gravel rips the net open!');
        }
        this.log(`${p.name} hurls a Gravel Grenade for ${d}!`);
        this.damageEnemy(d, 'player');
        return;
      }
      case 'party': return this.party(c);
      case 'flee': {
        const ch = e.level >= MOVES.swimAway.hardLevel + (e.k || 0) ? MOVES.swimAway.hardChance : MOVES.swimAway.chance;
        this.push({ t: 'anim', who: 'player', kind: 'flee' });
        if (r.chance(ch)) {
          this.over = 'fled';
          this.push({ t: 'sfx', name: 'swim_away' });
          this.log(ch < 0.5 ? 'You barely manage to slip away!' : 'You managed to escape!');
          this.push({ t: 'end', result: 'fled' });
        } else {
          this.log('You try to escape, but the enemy is too fast!');
        }
        return;
      }
      case 'dive': {
        p.dived = !p.dived;
        this.push({ t: 'dive', on: p.dived });
        this.push({ t: 'sfx', name: 'sub_dive' });
        this.log(p.dived ? `${p.name} dives into the Dunkleosteus Submarine!` : `${p.name} surfaces from the submarine.`);
        return;
      }
      default: {
        const k = action.slice(5), it = ITEMS[k];
        p.items[k]--;
        this.push({ t: 'item', kind: k });
        this.push({ t: 'sfx', name: 'item' });
        if (it.hp) {
          const h = Math.min(it.hp, p.hpMax - p.hp); p.hp += h;
          this.push({ t: 'heal', target: 'player', amount: h });
          this.log(`${p.name} eats a ${it.name}: +${h} HP.`);
        } else {
          const m = Math.min(it.mp, p.mpMax - p.mp); p.mp += m;
          this.push({ t: 'mp', amount: m });
          this.log(`${p.name} drinks a ${it.name}: +${m} MP.`);
        }
      }
    }
  }

  party(c) {
    const p = this.p, e = this.e, r = this.rng;
    this.push({ t: 'anim', who: 'player', kind: 'party' });
    this.push({ t: 'sfx', name: 'party' });
    if (e.kind === 'gar') {
      if (!this.partyStarted) {
        this.partyStarted = true;
        this.push({ t: 'partyBurst' });
        this.log(`${p.friends} friends burst in with balloons! It's a party!`);
      } else {
        p.mp -= MOVES.party.mp;
        this.push({ t: 'mp', amount: -MOVES.party.mp });
        this.log(`${p.name} throws a magical party with colorful balloons!`);
      }
      this.meter = Math.min(PARTY.garMeter, this.meter + PARTY.garPerCast(p.friends));
      this.push({ t: 'meter', value: this.meter, change: +1 });
      if (this.meter >= PARTY.garMeter) this.befriend();
      return;
    }
    if (this.scripted === 'stump') {
      this.log(`${p.name} throws a party with colorful balloons!`);
      this.befriend();
      return;
    }
    p.mp -= MOVES.party.mp;
    this.push({ t: 'mp', amount: -MOVES.party.mp });
    this.log(`${p.name} throws a party with colorful balloons!`);
    if (r.chance(partyChance(p.level, e, p.friends))) this.befriend();
    else {
      this.push({ t: 'befriendFail' });
      this.push({ t: 'sfx', name: 'befriend_fail' });
      this.log(`The ${e.name} isn't in a party mood...`);
    }
  }

  befriend() {
    const p = this.p, e = this.e;
    this.over = 'friend';
    this.rewards = rewardsFor(e, this.rng);
    this.push({ t: 'befriend' });
    this.push({ t: 'sfx', name: 'befriend' });
    if (e.kind === 'snarl') this.push({ t: 'sfx', name: 'net_rip' });
    this.log(e.kind === 'gar' ? 'The Prehistoric Gar... smiles. You made a friend!'
      : e.kind === 'snarl' ? 'The net falls away... the Snarl wriggles free! You made a friend!' : `You befriended the ${e.name}!`);
    // The party cheers you up (regular fish; the Old Stump lesson and the Gar
    // are scripted moments, as in the design's simulator).
    if (this.scripted !== 'stump' && e.kind !== 'gar') {
      const m = Math.min(PARTY.refundMp, p.mpMax - p.mp); p.mp += m;
      this.push({ t: 'mp', amount: m, float: true });
      const h = Math.min(Math.floor(PARTY.healFrac * p.hpMax), p.hpMax - p.hp); p.hp += h;
      this.push({ t: 'heal', target: 'player', amount: h, float: true });
      this.log('Your new friend cheers you up!');
    }
    this.push({ t: 'end', result: 'friend', rewards: this.rewards });
  }

  bubbleAct() {
    const p = this.p;
    if (this.dizzy) {
      this.dizzy = false;
      this.push({ t: 'bubbleDizzyEnd' });
      this.log(this.bubbleNetted ? 'Bubble wriggles out of the net.' : 'Bubble shakes off the dizziness.');
      this.bubbleNetted = false;
      return;
    }
    if (this.freeing && this.wasTangled) {
      this.freeing = false;
      this.push({ t: 'untangle' });
      this.push({ t: 'sfx', name: 'bubble_chirp' });
      this.log('Bubble nibbles the net off you!');
      return;
    }
    if (!this.healed && p.hp < BUBBLE.healBelow * p.hpMax) {
      this.healed = true;
      const h = Math.min(Math.floor(BUBBLE.healFrac * p.hpMax), p.hpMax - p.hp); p.hp += h;
      this.push({ t: 'anim', who: 'bubble', kind: 'heal' });
      this.push({ t: 'sfx', name: 'bubble_chirp' });
      this.push({ t: 'heal', target: 'player', amount: h });
      this.log(`Bubble cheers ${p.name} on: +${h} HP!`);
      return;
    }
    const [lo, hi] = BUBBLE.nip(p.level);
    const d = this.rng.int(lo, hi);
    this.push({ t: 'anim', who: 'bubble', kind: 'lunge' });
    this.push({ t: 'sfx', name: 'bubble_chirp' });
    this.log(`Bubble nips the ${this.e.name} for ${d}!`);
    this.fray();
    this.damageEnemy(d, 'bubble');
  }

  // A hit aimed at the player: 20% of the time Bubble takes it instead.
  bubbleDraws() {
    if (this.bubble && this.rng.chance(BUBBLE.drawChance)) {
      this.dizzy = true;
      this.push({ t: 'anim', who: 'bubble', kind: 'dizzy' });
      this.push({ t: 'sfx', name: 'bubble_dizzy' });
      this.log('Bubble jumps in the way! Bubble is dizzy...');
      return true;
    }
    return false;
  }

  enemyAct() {
    const p = this.p, e = this.e, r = this.rng;
    if (e.kind === 'gar') {
      this.gturn++;
      const t = this.gturn;
      this.warned = false;
      if (GAR.roarTurns.includes(t)) {
        this.push({ t: 'roar' });
        this.push({ t: 'sfx', name: 'gar_roar' });
        this.log('The Prehistoric Gar lets out a thunderous roar instead of attacking!');
      } else if (t % 3 === 0) {
        this.push({ t: 'anim', who: 'enemy', kind: 'special' });
        this.push({ t: 'sfx', name: 'gar_charge' });
        this.log('GARGANTUAN GAR!');
        if (!this.bubbleDraws()) {
          if (p.dived) {
            this.push({ t: 'block' });
            this.log('The ancient submarine armor withstands even the Gargantuan Gar!');
          } else {
            const d = this.hitFor(e.special ?? GAR.special);
            p.hp -= d;
            this.push({ t: 'dmg', target: 'player', amount: d, big: true });
            this.log(`The GARGANTUAN GAR deals ${d} devastating damage!`);
            if (this.partyStarted && this.meter > 0) {
              this.meter--;
              this.push({ t: 'meter', value: this.meter, change: -1 });
              this.log('A balloon pops!');
            }
          }
        }
      } else {
        this.push({ t: 'anim', who: 'enemy', kind: 'lunge' });
        if (!r.chance(GAR.hit)) { this.push({ t: 'miss', target: 'player' }); this.log('The Prehistoric Gar snaps and misses!'); }
        else if (!this.bubbleDraws()) {
          const d = this.hitFor(r.int(e.lo, e.hi));
          p.hp -= d;
          this.push({ t: 'dmg', target: 'player', amount: d });
          this.log(`The Prehistoric Gar ${r.pick(GAR.attacks).replace(/!$/, '')} for ${d} damage!`);
        }
      }
      if ((this.gturn + 1) % 3 === 0 && p.hp > 0) {
        this.warned = true;
        this.push({ t: 'charge' });
        this.log('⚡ The Prehistoric Gar channels ancient power! ⚡');
      }
      return;
    }
    if (e.kind === 'snarl') { this.snarlAct(); return; }
    const def = ENEMIES[e.kind];
    this.push({ t: 'anim', who: 'enemy', kind: 'lunge' });
    if (!r.chance(ENEMY_HIT)) { this.push({ t: 'miss', target: 'player' }); this.push({ t: 'sfx', name: 'miss' }); this.log(`The ${e.name} misses!`); return; }
    if (this.bubbleDraws()) return;
    let lo = e.lo, hi = e.hi;
    let terr = false;
    if (def.territorial && e.hp < e.hpMax / 2) { lo += def.territorial; hi += def.territorial; terr = true; }
    const d = this.hitFor(r.int(lo, hi));
    p.hp -= d;
    if (terr) this.log('Territorial!');
    this.push({ t: 'dmg', target: 'player', amount: d });
    this.log(`The ${e.name} ${r.pick(def.attacks).replace(/!$/, '')} for ${d} damage!`);
  }

  // The Snarl's net: -2 to your Attack and Bubble Blast while it's whole.
  netCut(d) {
    const e = this.e;
    if (!(e.net > 0)) return d;
    if (!this.netSoftSaid) { this.netSoftSaid = true; this.log('The thick net softens your bite (\u22122).'); }
    return Math.max(1, d - SNARL.netCut);
  }
  // A landed hit or a nip unties one of its 4 knots.
  fray() {
    const e = this.e;
    if (!(e.net > 0)) return;
    e.net--;
    this.push({ t: 'knots', value: e.net });
    if (e.net === SNARL.netKnots - 2) this.log('The net is fraying!');
    if (e.net === 0) { this.push({ t: 'sfx', name: 'net_rip' }); this.push({ t: 'netRip' }); this.log('The net rips open!'); }
  }

  snarlAct() {
    const p = this.p, e = this.e, r = this.rng;
    this.sturn++;
    this.warned = false;
    if (this.sturn % SNARL.throwEvery === 0) {
      // Net Throw: no damage, never misses
      this.push({ t: 'anim', who: 'enemy', kind: 'net' });
      this.push({ t: 'sfx', name: 'net_throw' });
      if (this.bubble && r.chance(BUBBLE.drawChance)) {
        this.dizzy = true;
        this.bubbleNetted = true;
        this.push({ t: 'bubbleNet' });
        this.log('The net lands on Bubble! Bubble\'s all tangled up...');
      } else if (p.dived) {
        this.push({ t: 'block' });
        this.log('The net slides off the submarine!');
      } else {
        this.tangled = true;
        this.freeing = this.bubble;
        this.push({ t: 'tangle' });
        this.log(`The Snarl flings its net over ${p.name}! Tangled!`);
      }
    } else {
      this.push({ t: 'anim', who: 'enemy', kind: 'lunge' });
      if (!r.chance(SNARL.hit)) { this.push({ t: 'miss', target: 'player' }); this.push({ t: 'sfx', name: 'miss' }); this.log('The Snarl misses!'); }
      else if (!this.bubbleDraws()) {
        const d = this.hitFor(r.int(e.lo, e.hi));
        p.hp -= d;
        this.push({ t: 'dmg', target: 'player', amount: d });
        this.log(`The Snarl ${r.pick(SNARL.attacks).replace(/!$/, '')} for ${d} damage!`);
      }
    }
    if ((this.sturn + 1) % SNARL.throwEvery === 0 && p.hp > 0) {
      this.warned = true;
      this.push({ t: 'netWarn' });
      this.log('The Snarl gathers up its net!');
    }
  }

  afterRound() {
    const p = this.p, e = this.e;
    if (this.scripted === 'stump' && !this.stumpLit && (e.hp <= e.hpMax / 2 || this.turn + 1 >= 3)) {
      this.stumpLit = true;
      this.hbtLearned = true;
      this.push({ t: 'hbt' });
      this.push({ t: 'say', who: 'bubble', text: "Fighting isn't the only way. Try this!" });
    } else if (this.scripted === 'stump' && this.stumpLit) {
      this.push({ t: 'say', who: 'bubble', text: 'Press Party! Let\'s make friends!' });
    }
    if (e.kind === 'gar' && this.partyStarted && p.mp < MOVES.party.mp && !this.outOfFizzSaid && this.bubble) {
      this.outOfFizzSaid = true;
      this.push({ t: 'say', who: 'bubble', text: "We're out of fizz! A Bubble Water, quick!" });
    }
  }
}
