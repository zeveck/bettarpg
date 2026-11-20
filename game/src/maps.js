// maps.js: the six areas. Water is carved out of mud banks with shapes
// (depth 1 shallow .. 5 edge; 0 = bank; 6 = sand-bottomed path), then drawn
// in code (world.js). Coordinates are logical pixels (one art pixel each).
//
// shapes: ['e', cx, cy, rx, ry, depth]  ellipse
//         ['r', x, y, w, h, depth, radius] rounded rectangle
//         ['c', x1, y1, x2, y2, r, depth]  capsule
//         ['p', [[x,y],...], r, depth]     path of capsules
// Later shapes paint over earlier ones.

export const MAPS = {
  village: {
    w: 1024, h: 640, music: 'village', ambience: null, battleBg: 'shallows', safe: true, seed: 11,
    shapes: [
      ['r', 20, 34, 984, 560, 1, 70],
      ['r', 440, 540, 144, 110, 1, 10],
      ['r', 930, 250, 110, 140, 1, 12],
      ['e', 800, 560, 230, 60, 2],
      ['e', 300, 580, 200, 40, 2],
    ],
    paths: [
      [[60, 296], [1024, 312]],
      [[175, 172], [175, 296]],
      [[505, 178], [505, 296]],
      [[825, 184], [825, 296]],
      [[512, 296], [512, 640]],
      [[96, 296], [96, 534], [150, 534]],
    ],
    buildings: [
      { sprite: 'b_elder', x: 117, y: 50 },
      { sprite: 'b_mart', x: 438, y: 31 },
      { sprite: 'b_inn', x: 756, y: 35 },
      { sprite: 'b_bubble', x: 110, y: 420 },
      { sprite: 'b_guard', x: 880, y: 70, foot: 0.3 },
      { sprite: 'b_southgate', x: 453, y: 518, arch: true },
    ],
    npcs: [
      { id: 'finn', sprite: 'finn', x: 236, y: 206, face: 1 },
      { id: 'coral', sprite: 'coral', x: 578, y: 200, face: -1 },
      { id: 'seaweed', sprite: 'seaweed', x: 745, y: 212, face: 1 },
      { id: 'bubbleHome', sprite: 'bubble', x: 250, y: 478, face: -1, until: 'bubbleJoined' },
      { id: 'reef', sprite: 'reef', x: 960, y: 270, face: -1 },
    ],
    props: [
      { sprite: 'p_lily', x: 360, y: 400 }, { sprite: 'p_lily', x: 690, y: 450 }, { sprite: 'p_stones', x: 330, y: 160 },
      { sprite: 'p_stones', x: 650, y: 560 }, { sprite: 'p_lily', x: 640, y: 120 }, { sprite: 'p_stem', x: 400, y: 520 },
    ],
    gates: [
      { id: 'south', rect: [478, 600, 68, 40], openIf: 'metFinn', look: 'weave' },
      { id: 'east', rect: [1004, 246, 20, 148], openIf: 'stumpDone', look: 'reeds', talk: 'reefGate' },
    ],
    exits: [
      { rect: [440, 632, 144, 20], to: 'shallows', entry: 'north' },
      { rect: [1016, 246, 30, 148], to: 'reedwater', entry: 'west' },
    ],
    entries: {
      start: { x: 290, y: 214, face: -1 }, south: { x: 512, y: 580, face: -1 },
      east: { x: 975, y: 330, face: -1 }, inn: { x: 800, y: 240, face: -1 }, home: { x: 512, y: 340, face: 1 },
    },
    spawns: [], bites: [],
  },

  shallows: {
    w: 1536, h: 896, music: 'paddies', ambience: 'ambience_paddy', battleBg: 'shallows', seed: 21,
    shapes: [
      ['r', 704, 0, 128, 140, 1, 10],
      ['e', 768, 330, 650, 270, 1],
      ['e', 900, 690, 560, 210, 2],
      ['e', 1330, 740, 180, 130, 2],
      ['p', [[420, 560], [230, 700], [110, 800]], 70, 2],
      ['e', 520, 300, 90, 50, 0],
      ['e', 1050, 250, 110, 60, 0],
      ['e', 760, 560, 80, 40, 0],
      ['e', 1160, 610, 70, 45, 0],
      ['e', 380, 760, 60, 50, 0],
    ],
    paths: [],
    buildings: [],
    npcs: [],
    props: [
      { sprite: 'p_stump', x: 1395, y: 770, solid: true, id: 'stump' },
      { sprite: 'p_culvert', x: 66, y: 818, id: 'culvert' },
      { sprite: 'p_lily', x: 600, y: 180 }, { sprite: 'p_lily', x: 1200, y: 420 }, { sprite: 'p_stones', x: 860, y: 260 },
      { sprite: 'p_reeds', x: 300, y: 300 }, { sprite: 'p_reeds', x: 1300, y: 300 }, { sprite: 'p_stem', x: 980, y: 720 },
      { sprite: 'p_stones', x: 1250, y: 820 }, { sprite: 'p_lily', x: 700, y: 820 },
    ],
    gates: [
      { id: 'culvert', rect: [40, 790, 34, 60], openIf: 'lantern', look: 'dark', talk: 'culvertDark' },
    ],
    exits: [
      { rect: [704, -20, 128, 26], to: 'village', entry: 'south' },
      { rect: [20, 790, 30, 60], to: 'murk', entry: 'culvert' },
    ],
    entries: {
      north: { x: 768, y: 40, face: 1 }, culvert: { x: 120, y: 800, face: 1 }, stump: { x: 1320, y: 760, face: 1 },
    },
    tutorial: { x: 768, y: 150 },
    spawns: [
      { kind: 'guppy', lv: [1, 2], x: 560, y: 180 }, { kind: 'guppy', lv: [1, 2], x: 980, y: 150 },
      { kind: 'guppy', lv: [1, 2], x: 330, y: 420 }, { kind: 'guppy', lv: [1, 2], x: 690, y: 420 },
      { kind: 'guppy', lv: [1, 2], x: 1260, y: 380 }, { kind: 'guppy', lv: [1, 2], x: 900, y: 360 },
      { kind: 'angel', lv: [2, 2], x: 640, y: 740 }, { kind: 'angel', lv: [2, 2], x: 950, y: 810 },
      { kind: 'angel', lv: [2, 2], x: 1180, y: 520 },
    ],
    bites: [[420, 240], [860, 470], [1300, 250], [300, 560], [1100, 840], [620, 640], [1440, 520]],
  },

  reedwater: {
    w: 1536, h: 896, music: 'paddies', ambience: 'ambience_paddy', battleBg: 'reedwater', chase: true, seed: 31,
    shapes: [
      ['c', 0, 450, 380, 450, 70, 1],
      ['e', 420, 320, 210, 160, 1],
      ['e', 780, 580, 340, 230, 2],
      ['p', [[380, 450], [600, 600], [900, 640], [1150, 520], [1250, 330], [1190, 150], [1180, 0]], 80, 2],
      ['e', 1190, 150, 150, 100, 2],
      ['e', 1290, 560, 150, 160, 1],
      ['r', 1120, 0, 120, 100, 2, 10],
      ['e', 640, 420, 60, 40, 0],
      ['e', 1000, 400, 90, 70, 0],
      ['e', 820, 770, 90, 30, 0],
    ],
    reeds: [[420, 290, 140, 90], [760, 520, 150, 100], [1240, 420, 70, 110], [600, 720, 120, 60], [1330, 640, 90, 60]],
    paths: [], buildings: [], npcs: [],
    props: [
      { sprite: 'p_bundle', x: 1180, y: 74, id: 'bundle', solid: true, until: 'trailFound' },
      { sprite: 'p_lip', x: 1180, y: 22 },
      { sprite: 'p_lily', x: 300, y: 380 }, { sprite: 'p_stones', x: 980, y: 560 }, { sprite: 'p_lily', x: 1100, y: 700 },
    ],
    gates: [
      { id: 'bundle', rect: [1110, 40, 140, 60], openIf: 'trailFound', look: 'none', talk: 'bundle' },
    ],
    exits: [
      { rect: [-20, 380, 26, 140], to: 'village', entry: 'east' },
      { rect: [1120, -20, 120, 26], to: 'highwater', entry: 'south' },
    ],
    entries: { west: { x: 40, y: 450, face: 1 }, north: { x: 1180, y: 130, face: 1 } },
    scales: [[330, 470, 's1'], [610, 610, 's2'], [900, 645, 's3'], [1170, 500, 's4'], [1235, 280, 's5']],
    spawns: [
      { kind: 'angel', lv: [3, 4], x: 470, y: 230 }, { kind: 'angel', lv: [3, 4], x: 980, y: 690 },
      { kind: 'cat', lv: [3, 5], x: 760, y: 520 }, { kind: 'cat', lv: [3, 5], x: 600, y: 720 }, { kind: 'cat', lv: [3, 5], x: 1320, y: 640 },
      { kind: 'nymph', lv: [4, 5], x: 400, y: 300 }, { kind: 'nymph', lv: [4, 5], x: 1240, y: 420 }, { kind: 'nymph', lv: [4, 5], x: 860, y: 470 },
    ],
    bites: [[200, 420], [520, 380], [700, 560], [1050, 600], [1300, 520], [1200, 220]],
  },

  highwater: {
    w: 1536, h: 896, music: 'highwater', ambience: 'ambience_paddy', battleBg: 'spillway', seed: 41, safeAbove: 470,
    fireflies: true,
    shapes: [
      ['r', 60, 40, 1416, 420, 1, 60],
      ['r', 640, 400, 256, 496, 2, 12],
      ['e', 420, 690, 170, 95, 2],
      ['c', 560, 690, 660, 690, 40, 2],
      ['e', 1120, 650, 170, 100, 2],
      ['c', 880, 650, 980, 650, 40, 2],
    ],
    paths: [
      [[120, 330], [1420, 330]],
      [[220, 258], [220, 330]], [[692, 231], [692, 330]], [[1210, 234], [1210, 330]],
      [[768, 330], [768, 420]],
    ],
    pathColor: 'stone',
    buildings: [
      { sprite: 'b_hwinn', x: 140, y: 62 },
      { sprite: 'b_pip', x: 640, y: 112 },
      { sprite: 'b_lock', x: 1150, y: 92 },
    ],
    npcs: [
      { id: 'kelpie', sprite: 'kelpie', x: 360, y: 280, face: -1 },
      { id: 'pip', sprite: 'pip', x: 770, y: 262, face: -1 },
      { id: 'whorl', sprite: 'whorl', x: 1110, y: 262, face: 1 },
      { id: 'folk1', sprite: 'folk1', x: 500, y: 380, face: 1 },
      { id: 'folk2', sprite: 'folk2', x: 960, y: 390, face: -1 },
      { id: 'folk3', sprite: 'folk3', x: 1340, y: 380, face: -1 },
    ],
    props: [
      { sprite: 'p_lip', x: 680, y: 780 }, { sprite: 'p_lip', x: 746, y: 780 }, { sprite: 'p_lip', x: 812, y: 780 }, { sprite: 'p_lip', x: 856, y: 780 },
      { sprite: 'p_lip', x: 680, y: 600 }, { sprite: 'p_lip', x: 746, y: 600 }, { sprite: 'p_lip', x: 812, y: 600 }, { sprite: 'p_lip', x: 856, y: 600 },
      { sprite: 'p_lily', x: 420, y: 120 }, { sprite: 'p_lily', x: 1000, y: 160 }, { sprite: 'p_stones', x: 560, y: 200 },
      { sprite: 'p_reeds', x: 330, y: 700 }, { sprite: 'p_reeds', x: 1220, y: 620 },
    ],
    gates: [],
    exits: [{ rect: [640, 890, 256, 30], to: 'reedwater', entry: 'north' }],
    entries: { south: { x: 768, y: 860, face: 1 }, inn: { x: 300, y: 300, face: 1 } },
    spawns: [
      { kind: 'cich', lv: [5, 5], x: 400, y: 690 }, { kind: 'cich', lv: [5, 5], x: 1140, y: 640 },
      { kind: 'cich', lv: [5, 5], x: 480, y: 720 },
    ],
    bites: [[380, 650], [1180, 690], [768, 700]],
  },

  murk: {
    w: 1536, h: 896, music: 'murk', ambience: 'ambience_murk', battleBg: 'murk', dark: true, seed: 51, deepBelowX: 790,
    bank: 'dark',
    shapes: [
      ['c', 1470, 70, 1260, 220, 60, 3],
      ['e', 1150, 430, 380, 300, 3],
      ['r', 690, 380, 180, 140, 4, 30],
      ['e', 420, 450, 370, 330, 4],
      ['e', 230, 110, 150, 85, 5],
      ['c', 330, 170, 380, 260, 45, 5],
      ['e', 560, 830, 170, 65, 5],
      ['c', 500, 760, 520, 700, 45, 5],
      ['e', 1000, 300, 70, 50, 0],
      ['e', 1250, 560, 60, 40, 0],
      ['e', 400, 380, 70, 60, 0],
      ['r', 0, 400, 140, 110, 4, 10],
    ],
    paths: [], buildings: [
      { sprite: 'b_draingate', x: 0, y: 360, foot: 0.4 },
    ],
    npcs: [],
    props: [
      { sprite: 'p_culvert', x: 1490, y: 52, id: 'culvert' },
      { sprite: 'p_culvert', x: 92, y: 300, id: 'pipe', dark: true },
      { sprite: 'p_stem', x: 900, y: 600 }, { sprite: 'p_stones', x: 1300, y: 300 }, { sprite: 'p_stem', x: 300, y: 600 },
    ],
    gates: [
      { id: 'drain', rect: [0, 400, 120, 110], openIf: 'gateOpen', look: 'none', talk: 'drainGate' },
    ],
    exits: [
      { rect: [1500, 20, 40, 100], to: 'shallows', entry: 'culvert' },
      { rect: [-20, 400, 40, 110], to: 'ditch', entry: 'gate' },
    ],
    entries: { culvert: { x: 1430, y: 100, face: -1 }, gate: { x: 170, y: 455, face: 1 } },
    cogs: [[1260, 640, 'c1'], [520, 250, 'c2'], [330, 650, 'c3']],
    spawns: [
      { kind: 'cich', lv: [6, 6], x: 1000, y: 420 }, { kind: 'cray', lv: [6, 6], x: 1200, y: 470 },
      { kind: 'cich', lv: [6, 6], x: 1350, y: 660 }, { kind: 'cray', lv: [6, 6], x: 950, y: 620 },
      { kind: 'cich', lv: [7, 8], x: 520, y: 420, deep: true }, { kind: 'cray', lv: [7, 8], x: 260, y: 520, deep: true },
      { kind: 'cich', lv: [7, 8], x: 620, y: 640, deep: true }, { kind: 'cray', lv: [7, 8], x: 520, y: 170, deep: true },
      { kind: 'cich', edge: true, x: 200, y: 105 }, { kind: 'cray', edge: true, x: 600, y: 835 },
    ],
    bites: [[1150, 250], [880, 500], [600, 330], [200, 650]],
  },

  ditch: {
    w: 1024, h: 640, music: 'murk', ambience: 'ambience_murk', battleBg: 'garpool', seed: 61, bank: 'concrete',
    shapes: [
      ['r', 40, 40, 944, 560, 3, 30],
      ['r', 450, 0, 124, 80, 3, 8],
      ['e', 680, 420, 240, 130, 4],
    ],
    paths: [], buildings: [], npcs: [],
    props: [
      { sprite: 'p_stones', x: 640, y: 120, id: 'spring' },
      { sprite: 'p_culvert', x: 985, y: 300, id: 'pipe', dark: true },
      { sprite: 'p_cage', x: 180, y: 470, id: 'cage', solid: true },
      { sprite: 'p_stem', x: 300, y: 200 }, { sprite: 'p_stones', x: 860, y: 560 },
    ],
    gates: [],
    exits: [{ rect: [450, -20, 124, 26], to: 'murk', entry: 'gate' }],
    entries: { gate: { x: 512, y: 50, face: 1 }, spring: { x: 600, y: 150, face: -1 } },
    spawns: [], bites: [],
  },
};
