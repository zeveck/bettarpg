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
      { sprite: 'b_elder', x: 117, y: 50, doors: [69], to: 'finnHouse' },
      { sprite: 'b_mart', x: 438, y: 31, doors: [67], to: 'fishMart' },
      { sprite: 'b_inn', x: 756, y: 35, doors: [33, 93], to: 'villageInn' },
      { sprite: 'b_bubble', x: 110, y: 420, doors: [48], to: 'bubbleHome' },
      { sprite: 'b_guard', x: 908, y: 62, foot: 0.3 },
      { sprite: 'b_southgate', x: 453, y: 518, arch: true },
    ],
    npcs: [
      { id: 'reef', sprite: 'reef', x: 960, y: 270, face: -1 },
      // townsfish out in the street (the shopkeepers are indoors)
      { id: 'vfolk1', sprite: 'folk2', x: 352, y: 254, face: 1 },
      { id: 'vfolk2', sprite: 'folk1', x: 690, y: 372, face: -1 },
      { id: 'vfolk3', sprite: 'folk3', x: 236, y: 480, face: -1 },
    ],
    props: [
      { sprite: 'p_stones', x: 330, y: 160 },
      { sprite: 'p_stones', x: 650, y: 560 }, { sprite: 'p_stem', x: 400, y: 520 },
    ],
    gates: [
      { id: 'south', rect: [478, 600, 68, 40], openIf: 'metFinn', look: 'weave' },
      { id: 'east', rect: [1004, 246, 20, 148], openIf: 'eastOpen', look: 'reeds', talk: 'reefGate' },
    ],
    exits: [
      { rect: [440, 632, 144, 20], to: 'shallows', entry: 'north' },
      { rect: [1016, 246, 30, 148], to: 'reedwater', entry: 'west' },
    ],
    entries: {
      start: { x: 290, y: 214, face: -1 }, south: { x: 512, y: 580, face: -1 },
      east: { x: 975, y: 330, face: -1 }, inn: { x: 800, y: 240, face: -1 }, home: { x: 512, y: 340, face: 1 },
      finnDoor: { x: 186, y: 192, face: 1 }, martDoor: { x: 505, y: 198, face: 1 }, innDoor: { x: 819, y: 204, face: -1 }, innDoorL: { x: 789, y: 204, face: -1 }, innDoorR: { x: 849, y: 204, face: 1 }, bubbleDoor: { x: 158, y: 538, face: -1 },
    },
    riceRows: [[90, 566, 410], [620, 566, 940]],
    spawns: [], bites: [],
    // the guard post's gate isn't a way in: it says so when you swim up to it
    looks: [{ id: 'guardGate', x: 962, y: 224 }],
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
      { sprite: 'p_culvert', x: 66, y: 818, id: 'culvert', flip: true },
      { sprite: 'p_stones', x: 860, y: 260 },
      { sprite: 'p_reeds', x: 300, y: 300 }, { sprite: 'p_reeds', x: 1300, y: 300 }, { sprite: 'p_stem', x: 980, y: 720 },
      { sprite: 'p_stones', x: 1250, y: 820 }, 
    ],
    gates: [
      { id: 'culvert', rect: [40, 790, 34, 60], openIf: 'lantern', look: 'dark', shadow: [76, 806], talk: 'culvertDark' },
    ],
    exits: [
      { rect: [704, -20, 128, 26], to: 'village', entry: 'south' },
      { rect: [20, 790, 30, 60], to: 'murk', entry: 'culvert' },
    ],
    entries: {
      north: { x: 768, y: 40, face: 1 }, culvert: { x: 120, y: 800, face: 1 }, stump: { x: 1320, y: 760, face: 1 },
    },
    tutorial: { x: 768, y: 150 },
    riceRows: [[200, 470, 460], [1040, 470, 1300], [560, 860, 900]],
    spawns: [
      { kind: 'guppy', lv: [1, 2], x: 560, y: 180 }, { kind: 'guppy', lv: [1, 2], x: 980, y: 150 },
      { kind: 'guppy', lv: [1, 2], x: 330, y: 420 }, { kind: 'guppy', lv: [1, 2], x: 690, y: 420 },
      { kind: 'guppy', lv: [1, 2], x: 1260, y: 380 }, { kind: 'guppy', lv: [1, 2], x: 900, y: 360 },
      { kind: 'angel', lv: [2, 2], x: 640, y: 740 }, { kind: 'angel', lv: [2, 2], x: 950, y: 810 },
      { kind: 'angel', lv: [2, 2], x: 1180, y: 520 },
    ],
    bites: [[420, 240], [860, 470], [1300, 250], [300, 560], [1100, 840], [620, 640], [1370, 610]],
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
    riceRows: [[180, 520, 330], [1000, 860, 1200]],
    reeds: [[420, 290, 140, 90], [760, 520, 150, 100], [1240, 420, 70, 110], [600, 720, 120, 60], [1330, 640, 90, 60]],
    paths: [], buildings: [], npcs: [],
    props: [
      { sprite: 'p_bundle', x: 1180, y: 74, id: 'bundle', solid: true, until: 'trailFound' },
      { sprite: 'p_lip', x: 1180, y: 22 },
      { sprite: 'p_stones', x: 980, y: 560 },
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
      { sprite: 'b_hwinn', x: 140, y: 62, doors: [89], to: 'hwInn' },
      { sprite: 'b_bubble', x: 380, y: 140, hue: -22, doors: [48], to: 'hwHome1' },
      { sprite: 'b_pip', x: 640, y: 112 },
      { sprite: 'b_pip', x: 880, y: 112, hue: 160, sat: 0.55 },
      { sprite: 'b_lock', x: 1150, y: 92, doors: [47], to: 'lockHouse' },
      { sprite: 'b_elder', x: 1300, y: 110, hue: -18, doors: [69], to: 'hwHome3' },
      { sprite: 'b_bubble', x: 520, y: 128, hue: 12, doors: [48], to: 'hwHome2' },
    ],
    lanterns: [[130, 360], [330, 360], [560, 360], [820, 360], [1050, 360], [1300, 360], [700, 440], [836, 440]],
    bunting: [[300, 250, 640, 230], [744, 230, 880, 232], [984, 232, 1150, 236]],
    npcs: [
      { id: 'pip', sprite: 'pip', x: 770, y: 262, face: -1 },
      { id: 'folk2', sprite: 'folk2', x: 960, y: 390, face: -1 },
      { id: 'folk4', sprite: 'folk2', x: 620, y: 300, face: 1 },
      { id: 'folk5', sprite: 'folk1', x: 1000, y: 290, face: -1 },
      { id: 'folk7', sprite: 'pip', x: 940, y: 262, face: -1 },
    ],
    props: [
      { sprite: 'p_lip', x: 680, y: 780 }, { sprite: 'p_lip', x: 746, y: 780 }, { sprite: 'p_lip', x: 812, y: 780 }, { sprite: 'p_lip', x: 856, y: 780 },
      { sprite: 'p_lip', x: 680, y: 600 }, { sprite: 'p_lip', x: 746, y: 600 }, { sprite: 'p_lip', x: 812, y: 600 }, { sprite: 'p_lip', x: 856, y: 600 },
      { sprite: 'p_stones', x: 560, y: 200 },
      { sprite: 'p_reeds', x: 330, y: 700 }, { sprite: 'p_reeds', x: 1220, y: 620 },
    ],
    // the Snarl holds the top of the Spillway steps: the rect spans the whole join (x 640-896)
    gates: [{ id: 'snarl', rect: [640, 440, 256, 44], openIf: 'snarlDone', look: 'none', talk: 'snarl' }],
    exits: [{ rect: [640, 890, 256, 30], to: 'reedwater', entry: 'north' }],
    entries: { south: { x: 768, y: 860, face: 1 }, inn: { x: 300, y: 300, face: 1 }, steps: { x: 740, y: 830, face: 1 },
      innDoor: { x: 229, y: 280, face: 1 }, lockDoor: { x: 1197, y: 256, face: -1 }, home1Door: { x: 428, y: 258, face: 1 }, home2Door: { x: 568, y: 246, face: 1 }, home3Door: { x: 1369, y: 252, face: -1 } },
    spawns: [
      { kind: 'cich', lv: [5, 5], x: 400, y: 690 }, { kind: 'cich', lv: [5, 5], x: 1140, y: 640 },
      { kind: 'cich', lv: [5, 5], x: 480, y: 720 },
      { kind: 'cich', lv: [5, 5], x: 760, y: 690 },
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
      { sprite: 'b_draingate', x: 0, y: 360, pass: true },
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
    w: 1024, h: 640, music: 'murk', ambience: 'ambience_murk', battleBg: 'garpool', seed: 61, bank: 'concrete', poolEdge: true,
    shapes: [
      ['r', 40, 40, 944, 560, 3, 30],
      ['r', 450, 0, 124, 80, 3, 8],
      ['r', 450, 310, 470, 240, 4, 28],
    ],
    paths: [], buildings: [], npcs: [],
    props: [
      { sprite: 'p_stones', x: 640, y: 120, id: 'spring' },
      { sprite: 'p_culvert', x: 985, y: 300, id: 'pipe', dark: true },
      { sprite: 'p_cage', x: 180, y: 470, id: 'cage', solid: true },
      { sprite: 'p_stem', x: 300, y: 200 }, { sprite: 'p_stones', x: 860, y: 560 },
      { sprite: 'p_culvert', x: 60, y: 200, dark: true }, { sprite: 'p_culvert', x: 300, y: 70, dark: true },
      { sprite: 'p_culvert', x: 780, y: 70, dark: true }, { sprite: 'p_culvert', x: 985, y: 520, dark: true },
      { sprite: 'p_stones', x: 120, y: 580 }, { sprite: 'p_stones', x: 420, y: 590 }, { sprite: 'p_stem', x: 700, y: 590 },
      { sprite: 'p_stem', x: 90, y: 330 }, { sprite: 'p_stones', x: 930, y: 150 },
    ],
    gates: [],
    exits: [{ rect: [450, -20, 124, 26], to: 'murk', entry: 'gate' }],
    entries: { gate: { x: 512, y: 50, face: 1 }, spring: { x: 600, y: 150, face: -1 } },
    spawns: [], bites: [],
  },
};

// ---------- rooms: the insides of the village and Highwater buildings ----------
// Every room is one 384x256 picture (native pixels) with the same dome floor and the
// doorway at the bottom centre. Floor = water (collision only; the picture is drawn
// instead of the terrain); `solid` = furniture and walls the fish can't swim through;
// `fg` = strips of the picture drawn again in front of whoever stands behind them;
// `looks` = things you can examine with Talk (LOOKS in strings.js).
const FLOOR = [['e', 193, 158, 168, 70, 1], ['r', 168, 196, 48, 60, 1, 2]];
const EXIT = [176, 246, 32, 10];
// A room's doorways sit in the bottom wall, at doorXs (one, in the middle, unless the building
// outside has more). Doorway i leads out to outsides[i]; building door i leads in to doorway i.
const doorEntry = (i) => (i ? 'door' + i : 'door');
const room = (o) => {
  const xs = o.doorXs || [192];
  const outs = o.outsides || [o.outside];
  const entries = {};
  xs.forEach((x, i) => { entries[doorEntry(i)] = { x, y: 206, face: 1 }; });
  return {
    interior: true, w: 384, h: 256, safe: true, seed: 3, ambience: null, battleBg: 'shallows',
    shapes: [FLOOR[0], ...xs.map((x) => ['r', x - 24, FLOOR[1][2], 48, 60, 1, 2])],
    paths: [], buildings: [], props: [], gates: [], spawns: [], bites: [],
    npcs: [], looks: [], solid: [], fg: [],
    ...o,
    doorXs: xs,
    exits: xs.map((x, i) => ({ rect: [x - EXIT[2] / 2, EXIT[1], EXIT[2], EXIT[3]], to: o.parent, entry: outs[i] || outs[0] })),
    entries: { ...entries, ...(o.entries || {}) },
  };
};
export { doorEntry };

Object.assign(MAPS, {
  finnHouse: room({
    parent: 'village', outside: 'finnDoor', backdrop: 'rm_finn', music: 'village',
    solid: [[44, 96, 86, 62], [94, 136, 36, 28], [282, 96, 38, 46], [326, 110, 36, 50], [272, 150, 94, 58]],
    npcs: [{ id: 'finn', sprite: 'finn', x: 158, y: 124, face: 1 }],
    looks: [{ id: 'finnMap', x: 140, y: 92 }, { id: 'finnLamp', x: 286, y: 146 }, { id: 'finnBed', x: 262, y: 186 }],
    entries: { start: { x: 214, y: 134, face: -1 } },
  }),
  fishMart: room({
    parent: 'village', outside: 'martDoor', backdrop: 'rm_mart', music: 'village', bell: true,
    solid: [[118, 102, 152, 46], [70, 58, 82, 60], [232, 58, 72, 60], [292, 96, 60, 54], [312, 150, 46, 56], [22, 96, 42, 96], [44, 172, 60, 52]],
    fg: [[116, 112, 156, 38]],
    npcs: [{ id: 'coral', sprite: 'coral', x: 192, y: 104, face: 1, talkRange: 70 }],
    looks: [{ id: 'martScale', x: 142, y: 152 }, { id: 'martJars', x: 92, y: 124 }, { id: 'martCrate', x: 304, y: 182, bite: 'martCrate' }],
  }),
  villageInn: room({
    parent: 'village', outside: 'innDoorL', backdrop: 'rm_inn', music: 'village',
    // two front doors outside, two doorways inside: left leads to left, right to right
    doorXs: [125, 260], outsides: ['innDoorL', 'innDoorR'],
    solid: [[28, 76, 136, 96], [212, 70, 152, 62], [277, 152, 89, 56]],
    npcs: [{ id: 'seaweed', sprite: 'seaweed', x: 186, y: 112, face: -1 }],
    looks: [{ id: 'innBell', x: 150, y: 176 }, { id: 'innPods', x: 258, y: 178 }, { id: 'innSign', x: 192, y: 92 }],
    entries: { bed: { x: 236, y: 168, face: -1 } },
  }),
  bubbleHome: room({
    parent: 'village', outside: 'bubbleDoor', backdrop: 'rm_bubble', music: 'village',
    solid: [[44, 94, 90, 62], [140, 70, 100, 40], [252, 56, 24, 52], [266, 96, 66, 54], [114, 154, 32, 32]],
    npcs: [{ id: 'bubbleHome', sprite: 'bubble', x: 206, y: 128, face: -1, until: 'bubbleJoined' }],
    looks: [{ id: 'bubbleDrawings', x: 142, y: 116 }, { id: 'bubbleMarbles', x: 190, y: 112 }, { id: 'bubbleChest', x: 298, y: 156, bite: 'bubbleChest' },
      { id: 'bubbleSign', x: 236, y: 112, sign: true, if: 'bubbleJoined' }],
  }),
  hwInn: room({
    parent: 'highwater', outside: 'innDoor', backdrop: 'rm_hwinn', music: 'highwater',
    solid: [[28, 76, 136, 96], [222, 82, 36, 38], [250, 88, 116, 120]],
    npcs: [{ id: 'kelpie', sprite: 'kelpie', x: 186, y: 112, face: -1 }],
    looks: [{ id: 'hwLanterns', x: 192, y: 92 }, { id: 'hwPods', x: 240, y: 178 }, { id: 'hwBell', x: 150, y: 176 }],
    entries: { bed: { x: 226, y: 160, face: 1 } },
  }),
  lockHouse: room({
    parent: 'highwater', outside: 'lockDoor', backdrop: 'rm_lock', music: 'highwater',
    solid: [[62, 48, 88, 104], [40, 116, 28, 30], [146, 82, 32, 28], [282, 84, 48, 52], [304, 124, 40, 42], [42, 160, 110, 62], [252, 180, 60, 44], [322, 158, 40, 42]],
    npcs: [{ id: 'whorl', sprite: 'whorl', x: 250, y: 124, face: -1 }],
    looks: [{ id: 'lockGauge', x: 270, y: 100 }, { id: 'lockLevers', x: 282, y: 174 }, { id: 'lockBench', x: 160, y: 182 }],
  }),
  hwHome1: room({
    parent: 'highwater', outside: 'home1Door', backdrop: 'rm_dace', music: 'highwater',
    // Dace's coral den: notebook table (left), spyglass on a tripod, kelp hammock (right)
    solid: [[52, 104, 86, 54], [218, 96, 26, 18], [262, 100, 96, 56]],
    npcs: [{ id: 'folk1', sprite: 'folk1', x: 200, y: 140, face: -1 }],
    looks: [{ id: 'daceBoard', x: 150, y: 96 }, { id: 'daceNotes', x: 100, y: 166 }, { id: 'daceScope', x: 232, y: 122 }, { id: 'daceBed', x: 300, y: 166 }],
  }),
  hwHome2: room({
    parent: 'highwater', outside: 'home2Door', backdrop: 'rm_home', music: 'highwater',
    solid: [[60, 104, 62, 44], [40, 140, 32, 22], [118, 104, 30, 20], [144, 66, 100, 42], [246, 84, 106, 78], [328, 136, 28, 32]],
    npcs: [{ id: 'folk6', sprite: 'folk3', x: 200, y: 136, face: 1 }],
    looks: [{ id: 'homeDrawing', x: 152, y: 114 }, { id: 'homeTea', x: 190, y: 112, bite: 'home2Tea' }],
  }),
  hwHome3: room({
    parent: 'highwater', outside: 'home3Door', backdrop: 'rm_minnow', music: 'highwater',
    // Minnow's own den: workbench of toy wheels (left), wheel and stool, sponge bed (right), model lock gate
    solid: [[48, 97, 80, 60], [32, 142, 28, 42], [250, 97, 80, 60], [230, 180, 58, 44]],
    npcs: [{ id: 'folk3', sprite: 'folk3', x: 200, y: 130, face: -1 }],
    looks: [{ id: 'minnowMap', x: 150, y: 94 }, { id: 'minnowBench', x: 100, y: 166 }, { id: 'minnowGate', x: 222, y: 196 }, { id: 'minnowBed', x: 292, y: 166 }],
  }),
});
