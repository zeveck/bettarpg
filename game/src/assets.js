// assets.js: one manifest for every picture. Each key lists candidate files
// (the first that loads wins). A file that's missing falls back to a
// placeholder shape of the expected size, so the game always runs, and a file
// added later is picked up on the next load.

const N = 'assets/native/';
const O = N + 'original/';

// key: [paths, placeholder {w, h, color}]
export const MANIFEST = {
  betta0: [[O + 'main_fish/player_betta.png'], { w: 45, h: 37, c: '#E5401F' }],
  betta1: [[O + 'main_fish/player_betta_with_helmet.png'], { w: 39, h: 35, c: '#E5401F' }],
  betta2: [[O + 'main_fish/player_betta_with_almost_armor.png'], { w: 47, h: 41, c: '#E5401F' }],
  betta3: [[O + 'main_fish/player_betta_full_metal.png'], { w: 48, h: 41, c: '#555' }],
  betta0h: [[O + 'main_fish/partyhat/player_betta_partyhat.png'], { w: 45, h: 44, c: '#E5401F' }],
  betta1h: [[O + 'main_fish/partyhat/player_betta_with_helmet_partyhat.png'], { w: 39, h: 41, c: '#E5401F' }],
  betta2h: [[O + 'main_fish/partyhat/player_betta_with_almost_armor_partyhat.png'], { w: 47, h: 42, c: '#E5401F' }],
  betta3h: [[O + 'main_fish/partyhat/player_betta_full_metal_partyhat.png'], { w: 48, h: 44, c: '#555' }],
  guppy: [[O + 'enemies/aggressive_guppy.png'], { w: 34, h: 26, c: '#9ab' }],
  angel: [[O + 'enemies/territorial-angelfish.png'], { w: 27, h: 29, c: '#dd8' }],
  cat: [[O + 'enemies/sneaky_catfish.png'], { w: 34, h: 23, c: '#654' }],
  cich: [[O + 'enemies/fierce_cichlid.png'], { w: 33, h: 26, c: '#468' }],
  garsmall: [[O + 'enemies/prehistoric_gar.png'], { w: 39, h: 17, c: '#675' }],
  guppyh: [[O + 'enemies/partyhat/aggressive_guppy_partyhat.png'], null],
  angelh: [[O + 'enemies/partyhat/territorial-angelfish_partyhat.png'], null],
  cath: [[O + 'enemies/partyhat/sneaky_catfish_partyhat.png'], null],
  cichh: [[O + 'enemies/partyhat/fierce_cichlid_partyhat.png'], null],
  garsmallh: [[O + 'enemies/partyhat/prehistoric_gar_partyhat.png'], null],
  nymph: [[N + 'enemies/dragonfly_nymph.png'], { w: 36, h: 16, c: '#776633' }],
  cray: [[N + 'enemies/snapping_crayfish.png'], { w: 38, h: 22, c: '#b5442a' }],
  garboss: [[N + 'boss/gargantuan_gar.png'], { w: 141, h: 60, c: '#5d6a48' }],
  snarl: [[N + 'boss/snarl.png'], { w: 47, h: 34, c: '#7a5a3a' }],
  snarl_free: [[N + 'boss/snarl_free.png'], { w: 46, h: 31, c: '#7a5a3a' }],
  torn_net: [[N + 'props/torn_net.png'], { w: 40, h: 23, c: '#c8b88a' }],
  sub: [[O + 'artifacts/dunkleosteus_sub.png'], { w: 51, h: 42, c: '#556' }],
  subh: [[O + 'artifacts/partyhat/dunkleosteus_sub_partyhat.png'], null],
  partyhat: [[O + 'artifacts/partyhat.png'], { w: 16, h: 26, c: '#FF4FA3' }],
  tuft: [[O + 'map/rice_paddy_tuft.png'], { w: 22, h: 18, c: '#5B8C3A' }],
  bettahome: [[O + 'map/bettahome.png'], { w: 111, h: 88, c: '#1B4F8A' }],
  finn: [[N + 'villagers/elder_finn.png'], { w: 44, h: 40, c: '#ccc' }],
  coral: [[N + 'villagers/coral.png'], { w: 40, h: 37, c: '#f98' }],
  reef: [[N + 'villagers/reef.png'], { w: 43, h: 41, c: '#333' }],
  bubble: [[N + 'villagers/bubble.png'], { w: 34, h: 28, c: '#fd4' }],
  seaweed: [[N + 'villagers/seaweed.png'], { w: 44, h: 35, c: '#cfe' }],
  whorl: [[N + 'villagers/whorl.png'], { w: 33, h: 25, c: '#c84' }],
  pip: [[N + 'villagers/pip.png'], { w: 30, h: 28, c: '#f9a' }],
  kelpie_gen: [[N + 'villagers/kelpie.png'], null],
  folk1_gen: [[N + 'villagers/townsfolk_1.png', N + 'villagers/townsfolk_a.png', N + 'villagers/townsfolk1.png'], null],
  folk2_gen: [[N + 'villagers/townsfolk_2.png', N + 'villagers/townsfolk_b.png', N + 'villagers/townsfolk2.png'], null],
  folk3_gen: [[N + 'villagers/townsfolk_3.png', N + 'villagers/townsfolk_c.png', N + 'villagers/townsfolk3.png'], null],
  b_elder: [[N + 'buildings/elder_dwelling.png'], { w: 116, h: 122, c: '#e8b84a' }],
  b_mart: [[N + 'buildings/fish_mart.png'], { w: 134, h: 147, c: '#e8b84a' }],
  b_inn: [[N + 'buildings/swishy_solace_inn.png'], { w: 138, h: 149, c: '#e8b84a' }],
  b_guard: [[N + 'buildings/guard_post.png'], { w: 109, h: 162, c: '#c9a24a' }],
  b_bubble: [[N + 'buildings/bubble_home.png'], { w: 102, h: 98, c: '#e8c552' }],
  b_southgate: [[N + 'buildings/south_gate.png'], { w: 118, h: 122, c: '#c9a24a' }],
  b_hwinn: [[N + 'buildings/highwater_inn.png'], { w: 161, h: 198, c: '#c9a' }],
  b_pip: [[N + 'buildings/pip_stall.png'], { w: 104, h: 121, c: '#dca' }],
  b_lock: [[N + 'buildings/lock_house.png'], { w: 118, h: 144, c: '#999' }],
  b_draingate: [[N + 'buildings/drain_gate.png'], { w: 113, h: 100, c: '#777' }],
  p_rice: [[N + 'props/rice_stalks.png'], null],
  p_riceRow: [[N + 'props/rice_row.png'], null],
  p_reeds: [[N + 'props/reed_clump.png'], { w: 24, h: 25, c: '#5B8C3A' }],
  p_lily: [[N + 'props/lily_pad.png'], { w: 21, h: 16, c: '#4a8a3a' }],
  p_stones: [[N + 'props/stones.png'], { w: 18, h: 14, c: '#888' }],
  p_stem: [[N + 'props/broken_stem.png'], { w: 8, h: 12, c: '#9a7' }],
  p_bundle: [[N + 'props/straw_bundle.png'], { w: 67, h: 46, c: '#d9b45a' }],
  p_culvert: [[N + 'props/culvert_mouth.png'], { w: 43, h: 34, c: '#666' }],
  p_lip: [[N + 'props/spillway_lip.png'], { w: 66, h: 51, c: '#888' }],
  p_stump: [[N + 'props/old_stump.png'], { w: 48, h: 45, c: '#6B4E2E' }],
  p_cage: [[N + 'props/reed_cage_closed.png'], { w: 33, h: 46, c: '#a88a4a' }],
  p_cageopen: [[N + 'props/reed_cage_open.png'], { w: 38, h: 46, c: '#a88a4a' }],
  i_bite: [[N + 'icons/betta_bite.png'], { w: 10, h: 8, c: '#F7C948' }],
  i_scale: [[N + 'icons/strange_scale.png'], { w: 11, h: 12, c: '#334' }],
  i_cog: [[N + 'icons/brass_cog.png'], { w: 12, h: 12, c: '#c9a24a' }],
  i_lantern: [[N + 'icons/moss_lantern.png'], { w: 7, h: 13, c: '#9c4' }],
  icon_kelp: [[N + 'icons/kelp_snack.png'], { w: 8, h: 13, c: '#5B8C3A' }],
  icon_bwater: [[N + 'icons/bubble_water.png'], { w: 8, h: 15, c: '#9FD8E0' }],
  icon_seedcake: [[N + 'icons/seed_cake.png'], { w: 12, h: 11, c: '#d9a' }],
  icon_fizzy: [[N + 'icons/fizzy_water.png'], { w: 9, h: 12, c: '#f9c' }],
  anim_swim0: [[N + 'anim/betta_swim_0.png'], null],
  anim_swim1: [[N + 'anim/betta_swim_1.png'], null],
  anim_swim2: [[N + 'anim/betta_swim_2.png'], null],
  anim_swim3: [[N + 'anim/betta_swim_3.png'], null],
  anim_lunge0: [[N + 'anim/gar_lunge_0.png'], null],
  anim_lunge1: [[N + 'anim/gar_lunge_1.png'], null],
  anim_lunge2: [[N + 'anim/gar_lunge_2.png'], null],
  anim_lunge3: [[N + 'anim/gar_lunge_3.png'], null],
  bg_title: [[N + 'backdrops/title.png'], { w: 432, h: 200, c: '#2B7FC4', bg: true }],
  bg_shallows: [[N + 'backdrops/shallows.png'], { w: 432, h: 200, c: '#3290D1', bg: true }],
  bg_reedwater: [[N + 'backdrops/reedwater.png'], null],
  bg_spillway: [[N + 'backdrops/spillway.png'], null],
  bg_murk: [[N + 'backdrops/murk.png'], { w: 432, h: 200, c: '#0E2A47', bg: true }],
  bg_garpool: [[N + 'backdrops/gar_pool.png'], { w: 432, h: 200, c: '#1B4F8A', bg: true }],
  bg_endfriend: [[N + 'backdrops/ending_friendship.png', N + 'backdrops/ending_friend.png', N + 'backdrops/ending_party.png'], null],
  bg_endfins: [[N + 'backdrops/ending_fins.png', N + 'backdrops/ending_dawn.png'], null],
};

const images = new Map(); // key -> canvas (loaded or placeholder) | null
const real = new Set();   // keys loaded from a file

function loadOne(paths) {
  return new Promise((resolve) => {
    let i = 0;
    const tryNext = () => {
      if (i >= paths.length) return resolve(null);
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = () => { i++; tryNext(); };
      im.src = paths[i];
    };
    tryNext();
  });
}

function toCanvas(im) {
  const c = document.createElement('canvas');
  c.width = im.naturalWidth || im.width; c.height = im.naturalHeight || im.height;
  c.getContext('2d', { willReadFrequently: true }).drawImage(im, 0, 0);
  return c;
}

function placeholder(p) {
  const c = document.createElement('canvas');
  c.width = p.w; c.height = p.h;
  const g = c.getContext('2d', { willReadFrequently: true });
  if (p.bg) {
    const gr = g.createLinearGradient(0, 0, 0, p.h);
    gr.addColorStop(0, p.c); gr.addColorStop(1, '#0E2A47');
    g.fillStyle = gr; g.fillRect(0, 0, p.w, p.h);
    return c;
  }
  g.fillStyle = '#2A1A12';
  g.beginPath(); g.ellipse(p.w / 2, p.h / 2, p.w / 2, p.h / 2.6, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = p.c;
  g.beginPath(); g.ellipse(p.w / 2, p.h / 2, p.w / 2 - 1, p.h / 2.6 - 1, 0, 0, Math.PI * 2); g.fill();
  // crisp alpha
  const d = g.getImageData(0, 0, p.w, p.h);
  for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] >= 128 ? 255 : 0;
  g.putImageData(d, 0, 0);
  return c;
}

export async function loadAll(onProgress) {
  const keys = Object.keys(MANIFEST);
  let done = 0;
  await Promise.all(keys.map(async (k) => {
    const [paths, ph] = MANIFEST[k];
    const im = await loadOne(paths);
    if (im) { images.set(k, toCanvas(im)); real.add(k); }
    else images.set(k, ph ? placeholder(ph) : null);
    done++; onProgress?.(done / keys.length);
  }));
}

export const img = (k) => images.get(k) || null;
export const hasReal = (k) => real.has(k);
export function assetReport() {
  const missing = Object.keys(MANIFEST).filter((k) => !real.has(k));
  return { loaded: real.size, missing };
}
