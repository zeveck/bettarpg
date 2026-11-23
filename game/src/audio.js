// audio.js: WebAudio for everything. Unlocks on the first input; music loops
// with two sources (each file already carries a baked crossfade tail past its
// loopEnd: the next copy starts at loopEnd and the old one plays its tail);
// at most two tracks decoded; sound effects decoded once; menu blips in code.
// Missing files are silent.

const MUSIC_DIR = 'assets/audio/';
export const SFX_NAMES = ['bite', 'hit', 'miss', 'bubble_blast', 'gravel_grenade', 'party', 'befriend',
  'befriend_fail', 'enemy_defeated', 'hurt', 'item', 'level_up', 'armor', 'buy', 'inn', 'swim_away',
  'gar_roar', 'gar_charge', 'net_throw', 'net_rip', 'sub_dive', 'notice', 'bubble_chirp', 'bubble_dizzy', 'shell_crack',
  'transition', 'fanfare', 'swish', 'door', 'shop_bell'];
const AMBIENCE = ['ambience_murk', 'ambience_paddy'];

let ctx = null, master, musicBus, sfxBus, ambBus;
let loops = null;               // loops.json tracks
const compressed = new Map();   // name -> Promise<ArrayBuffer|null>
const decoded = new Map();      // music name -> AudioBuffer (<= 2 kept)
const sfx = new Map();          // sfx name -> AudioBuffer
const settings = { music: 0.7, sfx: 0.8, muted: false };
let current = null;             // { name, gain, sources:[], next, timer }
let wanted = null;              // track asked for (even before unlock)
let amb = null;                 // { name, src, gain }
let wantedAmb = null;
let ducked = false;

export function loadSettings(s) {
  if (!s) return;
  if (typeof s.music === 'number') settings.music = s.music;
  if (typeof s.sfx === 'number') settings.sfx = s.sfx;
  if (typeof s.muted === 'boolean') settings.muted = s.muted;
  applyGains();
}
export const audioSettings = () => ({ ...settings });

function applyGains() {
  if (!ctx) return;
  const t = ctx.currentTime;
  master.gain.setTargetAtTime(settings.muted ? 0 : 1, t, 0.02);
  musicBus.gain.setTargetAtTime(settings.music * (ducked ? 0.35 : 1), t, 0.05);
  ambBus.gain.setTargetAtTime(settings.music * 0.6 * (ducked ? 0.35 : 1), t, 0.05);
  sfxBus.gain.setTargetAtTime(settings.sfx, t, 0.02);
}
export function setVolume(kind, v) { settings[kind] = Math.max(0, Math.min(1, v)); applyGains(); }
export function setMuted(m) { settings.muted = !!m; applyGains(); }
export function toggleMute() { setMuted(!settings.muted); return settings.muted; }
export function duck(on) { ducked = !!on; applyGains(); }

function fetchBuf(path) {
  if (!compressed.has(path)) {
    compressed.set(path, fetch(path).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null));
  }
  return compressed.get(path);
}
async function decode(path) {
  const ab = await fetchBuf(path);
  if (!ab || !ctx) return null;
  try { return await ctx.decodeAudioData(ab.slice(0)); } catch { return null; }
}

export async function init() {
  try {
    const r = await fetch(MUSIC_DIR + 'loops.json');
    if (r.ok) loops = (await r.json()).tracks || null;
  } catch {}
}
// Fetch (compressed) ahead, so entering an area starts its music at once.
export function prefetch(name) { if (name) fetchBuf(trackPath(name)); }
const trackPath = (name) => MUSIC_DIR + (loops?.[name]?.file || `music/${name}.mp3`);

// The first tap or key: make the context and start what was asked for.
export function unlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain(); master.connect(ctx.destination);
  musicBus = ctx.createGain(); musicBus.connect(master);
  ambBus = ctx.createGain(); ambBus.connect(master);
  sfxBus = ctx.createGain(); sfxBus.connect(master);
  applyGains();
  for (const n of SFX_NAMES) decode(MUSIC_DIR + `sfx/${n}.mp3`).then((b) => { if (b) sfx.set(n, b); });
  if (wanted) { const w = wanted; wanted = null; playMusic(w); }
  if (wantedAmb) { const w = wantedAmb; wantedAmb = null; playAmbience(w); }
}
export function suspend(on) {
  if (!ctx) return;
  if (on) ctx.suspend().catch(() => {}); else ctx.resume().catch(() => {});
}

function stopCurrent(fade = 0.6) {
  if (!current) return;
  const c = current; current = null;
  clearInterval(c.timer);
  const t = ctx.currentTime;
  try {
    c.gain.gain.cancelScheduledValues(t);
    c.gain.gain.setValueAtTime(c.gain.gain.value, t);
    c.gain.gain.linearRampToValueAtTime(0, t + fade);
  } catch {}
  setTimeout(() => { for (const s of c.sources) { try { s.stop(); } catch {} } c.gain.disconnect(); }, fade * 1000 + 100);
}

export async function playMusic(name) {
  if (!ctx) { wanted = name; return; }
  if (current && current.name === name) return;
  stopCurrent();
  if (!name) return;
  const me = { name, gain: ctx.createGain(), sources: [], next: 0, timer: 0 };
  current = me;
  me.gain.connect(musicBus);
  let buf = decoded.get(name);
  if (!buf) {
    buf = await decode(trackPath(name));
    if (!buf || current !== me) return;
    decoded.set(name, buf);
    // keep at most two decoded tracks
    while (decoded.size > 2) {
      const old = [...decoded.keys()].find((k) => k !== name && k !== current?.name);
      if (!old) break; decoded.delete(old);
    }
  }
  const info = loops?.[name] || { loop: name !== 'ending', loopStart: 0, loopEnd: buf.duration - 0.05 };
  const loopStart = info.loopStart || 0;
  const loopEnd = Math.min(info.loopEnd || buf.duration, buf.duration);
  const startCopy = (when) => {
    const s = ctx.createBufferSource();
    s.buffer = buf; s.connect(me.gain);
    s.start(when, loopStart);
    s.onended = () => { me.sources = me.sources.filter((x) => x !== s); };
    me.sources.push(s);
    me.next = when + (loopEnd - loopStart);
  };
  me.gain.gain.setValueAtTime(0, ctx.currentTime);
  me.gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.4);
  startCopy(ctx.currentTime + 0.05);
  if (info.loop === false) return;
  me.timer = setInterval(() => {
    if (current !== me) { clearInterval(me.timer); return; }
    if (me.next - ctx.currentTime < 1.5) startCopy(Math.max(me.next, ctx.currentTime + 0.02));
  }, 250);
}

export async function playAmbience(name) {
  if (!ctx) { wantedAmb = name; return; }
  if (amb && amb.name === name) return;
  if (amb) {
    const a = amb; amb = null;
    a.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    setTimeout(() => { try { a.src.stop(); } catch {} }, 1500);
  }
  if (!name) return;
  const me = { name, gain: ctx.createGain(), src: null };
  amb = me;
  const buf = await decode(MUSIC_DIR + `sfx/${name}.mp3`);
  if (!buf || amb !== me) return;
  me.gain.connect(ambBus);
  me.gain.gain.setValueAtTime(0, ctx.currentTime);
  me.gain.gain.setTargetAtTime(1, ctx.currentTime, 0.5);
  const s = ctx.createBufferSource();
  s.buffer = buf; s.loop = true; s.connect(me.gain); s.start();
  me.src = s;
}

export function play(name, { rate = 1, vol = 1 } = {}) {
  if (!ctx) return;
  const b = sfx.get(name);
  if (!b) return;
  const s = ctx.createBufferSource();
  s.buffer = b; s.playbackRate.value = rate;
  const g = ctx.createGain(); g.gain.value = vol;
  s.connect(g); g.connect(sfxBus); s.start();
}

// Small sounds made in code: menu move, select, dialogue blip, "can't" buzz.
export function blip(kind = 'move') {
  if (!ctx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.connect(g); g.connect(sfxBus);
  const p = {
    move: ['square', 660, 760, 0.05, 0.05],
    select: ['square', 520, 1040, 0.09, 0.07],
    back: ['square', 600, 380, 0.08, 0.06],
    text: ['triangle', 880, 900, 0.025, 0.05],
    buzz: ['sawtooth', 140, 110, 0.18, 0.07],
  }[kind] || ['square', 660, 660, 0.05, 0.05];
  o.type = p[0];
  o.frequency.setValueAtTime(p[1], t);
  o.frequency.linearRampToValueAtTime(p[2], t + p[3]);
  g.gain.setValueAtTime(p[4], t);
  g.gain.exponentialRampToValueAtTime(0.001, t + p[3] + 0.03);
  o.start(t); o.stop(t + p[3] + 0.05);
}

export function audioState() {
  return {
    context: ctx ? ctx.state : 'none',
    musicMuted: settings.muted || settings.music === 0,
    sfxMuted: settings.muted || settings.sfx === 0,
    muted: settings.muted,
    musicVolume: settings.music, sfxVolume: settings.sfx,
    track: current?.name || wanted || null,
    ambience: amb?.name || null,
    sfxLoaded: sfx.size,
    decodedTracks: [...decoded.keys()],
  };
}
