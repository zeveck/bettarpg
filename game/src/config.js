// config.js: every number in the design (GAME_DESIGN.md), in one place.
// Pure data: imported by the game and by tools/sim-battles.mjs.

export const PLAYER = {
  maxLevel: 10,
  expToNext: (L) => Math.round(100 * Math.pow(1.2, L - 1)), // 100, 120, 144, 173, ...
  maxHp: (L) => 20 + 6 * (L - 1),
  maxMp: (L) => 10 + 2 * (L - 1),
  bonus: (L) => Math.floor(1.5 * (L - 1)), // damage growth for the player's moves
  armor: (L) => (L >= 7 ? 3 : L >= 5 ? 2 : L >= 3 ? 1 : 0),
  armorStage: (L) => (L >= 7 ? 3 : L >= 5 ? 2 : L >= 3 ? 1 : 0),
  subArmor: 4,
  gravelLevel: 4,
  bigPartyLevel: 7,
  colors: ['red', 'blue', 'purple', 'green', 'orange'],
};

export const MOVES = {
  attack: { lo: 3, hi: 10, hit: 0.9 },
  bubbleBlast: { mp: 3, lo: 5, hi: 12 },
  gravelGrenade: { mp: 5, lo: 8, hi: 15, level: 4 },
  party: { mp: 5 },
  swimAway: { chance: 0.75, hardChance: 0.1, hardLevel: 5 },
};

export const PARTY = {
  small: { base: 0.25, perHp: 0.40, perFriend: 0.03, max: 0.80 },
  big: { base: 0.35, perHp: 0.50, perFriend: 0.05, max: 0.95 },
  edgeFactor: 0.5,
  // fish above your level are harder to win over: x0.6 per level above you, never below x0.2
  gapFactor: 0.6, gapFloor: 0.2,
  refundMp: 5,
  healFrac: 0.15,
  garFriendsNeeded: 5,
  garMeter: 4,
  garPerCast: (friends) => (friends >= 10 ? 2 : 1),
};

export const BUBBLE = {
  nip: (L) => [2 + Math.floor(L / 2), 5 + Math.floor(L / 2)],
  healBelow: 0.30,
  healFrac: 0.15,
  drawChance: 0.20,
};

export const ITEMS = {
  kelp: { name: 'Kelp Snack', hp: 10, price: 3, icon: 'icon_kelp' },
  seedcake: { name: 'Seed Cake', hp: 30, price: 8, icon: 'icon_seedcake', highwater: true },
  bwater: { name: 'Bubble Water', mp: 8, price: 2, icon: 'icon_bwater' },
  fizzy: { name: 'Fizzy Water', mp: 15, price: 6, icon: 'icon_fizzy', highwater: true },
};
export const ITEM_ORDER = ['kelp', 'seedcake', 'bwater', 'fizzy'];
export const ITEM_MAX = 9;
export const SUB_PRICE = 100;
export const INN_PRICE = 5;
export const DEFEAT_LOSS = 0.25;

// Enemy kinds. hp = round(base * (1 + 0.55 * level)); damage = lo..hi + floor(growth * (level - 1));
// exp = floor(baseExp * (1 + 0.2 * level)); bites = 1-5 + level * (1-2).
export const ENEMIES = {
  guppy: { name: 'Aggressive Guppy', baseHp: 8, lo: 2, hi: 3, growth: 0.8, exp: 15, sprite: 'guppy',
    attacks: ['darts forward with surprising speed!', 'attempts to nip at your fins!', 'swims in an erratic pattern, then strikes!'] },
  angel: { name: 'Territorial Angelfish', baseHp: 12, lo: 2, hi: 3, growth: 1.0, exp: 25, sprite: 'angel', territorial: 2,
    attacks: ['spreads its fins menacingly!', 'defends its territory with a fierce attack!', 'glides forward with elegant aggression!'] },
  cat: { name: 'Sneaky Catfish', baseHp: 15, lo: 2, hi: 4, growth: 1.2, exp: 35, sprite: 'cat', dodge: 0.25,
    attacks: ['strikes from the shadows!', 'uses its whiskers to sense your movement, then attacks!', 'lurks near the bottom, then lunges upward!'] },
  nymph: { name: 'Dragonfly Nymph', baseHp: 14, lo: 3, hi: 4, growth: 1.2, exp: 40, sprite: 'nymph', first: true,
    attacks: ['shoots out its hooked jaw!', 'darts up from the mud!', 'snaps with its folding jaw!'] },
  cich: { name: 'Fierce Cichlid', baseHp: 18, lo: 3, hi: 5, growth: 1.5, exp: 45, sprite: 'cich',
    attacks: ['charges with incredible force!', 'displays bright colors before attacking!', 'uses its powerful jaws in a devastating bite!'] },
  cray: { name: 'Snapping Crayfish', baseHp: 20, lo: 3, hi: 5, growth: 1.4, exp: 50, sprite: 'cray', shell: 2,
    attacks: ['snaps its big claws!', 'scuttles in and pinches!', 'swipes with a heavy claw!'] },
};
export const REGULAR_KINDS = ['guppy', 'angel', 'cat', 'nymph', 'cich', 'cray'];
export const EDGE = { mult: 1.25, rewardMult: 1.5, level: 10 };
export const PEACE_PER_KIND = 3;

export const GAR = {
  name: 'Prehistoric Gar', level: 10, hp: 230, lo: 8, hi: 12, hit: 0.9, exp: 600, bites: 50,
  special: 30, roarTurns: [1, 4, 7],
  attacks: ['opens its ancient jaws!', 'unleashes its prehistoric fury!', 'strikes with primordial power!'],
};

export const ENEMY_HIT = 0.9;

export const enemyHp = (kind, level) => Math.round(ENEMIES[kind].baseHp * (1 + 0.55 * level));
export const enemyDmg = (kind, level) => {
  const e = ENEMIES[kind], g = Math.floor(e.growth * (level - 1));
  return [e.lo + g, e.hi + g];
};
export const enemyExp = (kind, level) => Math.floor(ENEMIES[kind].exp * (1 + 0.2 * level));

// World feel (logical px and seconds)
export const WORLD = {
  tile: 16,
  speed: 90, accel: 0.15, decel: 0.25,
  noticeRange: 96, chaseSpeed: 0.7, chaseTime: 3,
  reedReveal: 80, lanternRadius: 128,
  safeAfterBattle: 2,
  regenEvery: 2,
  touchRange: 30, talkRange: 50,
  redGlowGap: 2,
  maxFriendsShown: 6,
  bundleRange: 64,
};

// The six areas, in story order (goToLevel uses this order).
export const AREAS = ['village', 'shallows', 'reedwater', 'highwater', 'murk', 'ditch'];
export const AREA_NAMES = {
  village: 'Paddy Village', shallows: 'The Shallows', reedwater: 'Reedwater',
  highwater: 'The Spillway and Highwater', murk: 'The Murk', ditch: 'The Sunken Ditch',
};
// Flags the story would have set on arriving in area n, and the expected level.
// Below the level an area expects, fights there give x1.5 EXP ("Catch-up bonus!").
export const CATCH_UP = { shallows: 3, reedwater: 5, highwater: 6, murk: 7, ditch: 8, mult: 1.5 };
export const REEF_FRIENDS = 3;
// Whorl hands over the lantern (the way into the Murk) from this level
export const LANTERN_LEVEL = 5;
export const AREA_START = {
  village: { flags: [], level: 1 },
  shallows: { flags: ['metFinn'], level: 1 },
  reedwater: { flags: ['metFinn', 'bubbleJoined', 'hbtLearned', 'stumpDone', 'eastOpen'], level: 3 },
  highwater: { flags: ['metFinn', 'bubbleJoined', 'hbtLearned', 'stumpDone', 'eastOpen', 'trailFound'], level: 5 },
  murk: { flags: ['metFinn', 'bubbleJoined', 'hbtLearned', 'stumpDone', 'eastOpen', 'trailFound', 'highwater', 'lantern'], level: 6 },
  ditch: { flags: ['metFinn', 'bubbleJoined', 'hbtLearned', 'stumpDone', 'eastOpen', 'trailFound', 'highwater', 'lantern', 'gateOpen'], level: 8 },
};
