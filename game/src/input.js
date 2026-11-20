// input.js: keyboard, touch and controller turned into the same events.
// Gameplay actions go through controls.js (players can rebind them); menus
// read their own fixed keys (Enter/Space/✕ confirm, Escape/Backspace/○ back,
// arrows/WASD/d-pad/stick move, 1-5 pick in battle rows).

export const ACTIONS = {
  up: { name: 'Swim up', keys: ['ArrowUp', 'KeyW'], pad: [12] },
  down: { name: 'Swim down', keys: ['ArrowDown', 'KeyS'], pad: [13] },
  left: { name: 'Swim left', keys: ['ArrowLeft', 'KeyA'], pad: [14] },
  right: { name: 'Swim right', keys: ['ArrowRight', 'KeyD'], pad: [15] },
  talk: { name: 'Talk / interact', keys: ['Space', 'KeyE'], pad: [0] },
  items: { name: 'Items', keys: ['KeyI'], pad: [2] },
  home: { name: 'Go home', keys: ['KeyH', 'Home'], pad: [3] },
  mute: { name: 'Mute', keys: ['KeyM'], pad: [] },
  pause: { name: 'Pause', keys: ['Escape', 'KeyP'], pad: [9], fixed: true },
};

const MENU_KEYS = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right',
  Enter: 'confirm', NumpadEnter: 'confirm', Space: 'confirm', Escape: 'back', Backspace: 'back',
};

export const input = {
  controls: null,
  device: 'keyboard',       // keyboard | touch | gamepad
  padId: '', padSeen: false, padConnected: false,
  held: new Set(),          // keyboard codes held
  touchVec: { x: 0, y: 0 },
  padVec: { x: 0, y: 0 },
  padPrev: [],
  padHeld: new Set(),
  listener: null,           // (ev) => void
  onDevice: null,
  onPadLost: null,
  capture: null,            // Controls screen: (kind, value) => void, while choosing a binding
  navRepeat: { dir: null, next: 0 },
  lastInput: '',
  isTouch: false,

  init(controls) {
    this.controls = controls;
    addEventListener('keydown', (e) => this.keydown(e));
    addEventListener('keyup', (e) => { this.held.delete(e.code); });
    addEventListener('blur', () => this.releaseAll());
    addEventListener('gamepadconnected', (e) => { this.padConnected = true; this.padSeen = true; this.padId = e.gamepad.id; });
    addEventListener('gamepaddisconnected', () => {
      this.padConnected = false; this.padVec = { x: 0, y: 0 }; this.padHeld.clear();
      if (this.device === 'gamepad') this.onPadLost?.();
    });
    this.isTouch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0 && !matchMedia('(any-pointer: fine)').matches;
    addEventListener('touchstart', () => this.setDevice('touch'), { passive: true, capture: true });
  },

  setDevice(d) {
    if (d === 'touch') this.isTouch = true;
    if (this.device !== d) { this.device = d; this.onDevice?.(d); }
  },

  textFocused() {
    const a = document.activeElement;
    return a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable);
  },

  keydown(e) {
    if (window.gameReport?.isOpen()) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (this.capture) {
      e.preventDefault();
      if (e.repeat) return;
      this.capture('key', e.code);
      return;
    }
    if (this.textFocused()) {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') { e.preventDefault(); this.emit({ menu: 'confirm', code: e.code, device: 'keyboard', fromField: true }); }
      else if (e.code === 'Escape') { e.preventDefault(); document.activeElement.blur(); }
      return;
    }
    this.setDevice('keyboard');
    const action = this.controls.keyAction(e.code);
    let menu = MENU_KEYS[e.code] || null;
    if (!menu && ['up', 'down', 'left', 'right'].includes(action)) menu = action;
    const digit = /^Digit[1-5]$/.test(e.code) ? +e.code.slice(5) : /^Numpad[1-5]$/.test(e.code) ? +e.code.slice(6) : null;
    if (action || menu || digit) e.preventDefault();
    if (e.code === 'Tab') return;
    const isMove = ['up', 'down', 'left', 'right'].includes(action);
    if (e.repeat && !(menu && ['up', 'down', 'left', 'right'].includes(menu))) return;
    if (!e.repeat) this.held.add(e.code);
    this.lastInput = e.code;
    this.emit({ action: e.repeat && isMove ? null : action, menu, digit, code: e.code, device: 'keyboard', repeat: e.repeat, key: e.key });
  },

  emit(ev) { this.listener?.(ev); },

  // Called every fixed update.
  poll(now) {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let pad = null;
    for (const p of pads) if (p && p.connected) { pad = p; break; }
    if (!pad) { this.padVec = { x: 0, y: 0 }; return; }
    this.padConnected = true;
    this.padId = pad.id;
    const reportOpen = window.gameReport?.isOpen();
    const btn = pad.buttons.map((b) => (typeof b === 'object' ? b.pressed || b.value > 0.5 : b > 0.5));
    let any = false;
    for (let i = 0; i < btn.length; i++) {
      const was = !!this.padPrev[i];
      if (btn[i] && !was) {
        any = true;
        if (reportOpen) { if (i === 1) window.gameReport.close(); continue; }
        if (window.otherDevices?.isOpen?.()) { window.otherDevices.dismiss(); continue; }
        this.padSeen = true;
        this.setDevice('gamepad');
        if (this.capture) continue; // bind on release
        this.padHeld.add(i);
        const action = this.controls.padAction(i);
        let menu = { 0: 'confirm', 1: 'back', 4: 'first', 5: 'last', 12: 'up', 13: 'down', 14: 'left', 15: 'right' }[i] || null;
        this.emit({ action, menu, button: i, device: 'gamepad' });
        if (menu && ['up', 'down', 'left', 'right'].includes(menu)) this.navRepeat = { dir: menu, next: now + 350, src: 'b' + i };
      } else if (!btn[i] && was) {
        this.padHeld.delete(i);
        if (this.capture && !reportOpen) this.capture('pad', i);
      }
    }
    this.padPrev = btn;
    if (reportOpen) { this.padVec = { x: 0, y: 0 }; return; }
    // stick, with a dead zone of 0.25 measured on its length
    let x = pad.axes[0] || 0, y = pad.axes[1] || 0;
    const len = Math.hypot(x, y);
    if (len < 0.25) { x = 0; y = 0; } else { const k = Math.min(1, (len - 0.25) / 0.75) / len; x *= k; y *= k; }
    if (len >= 0.25) this.setDevice('gamepad');
    this.padVec = { x, y };
    // stick and held d-pad move menu focus: once, then after 350 ms every 120 ms
    let dir = null;
    if (len >= 0.5) dir = Math.abs(pad.axes[0]) > Math.abs(pad.axes[1]) ? (pad.axes[0] > 0 ? 'right' : 'left') : (pad.axes[1] > 0 ? 'down' : 'up');
    for (const [b, d] of [[12, 'up'], [13, 'down'], [14, 'left'], [15, 'right']]) if (btn[b]) dir = d;
    const r = this.navRepeat;
    if (!dir) { this.navRepeat = { dir: null, next: 0 }; }
    else if (dir !== r.dir) {
      this.navRepeat = { dir, next: now + 350 };
      if (!btn[12] && !btn[13] && !btn[14] && !btn[15]) this.emit({ menu: dir, device: 'gamepad', stick: true });
    } else if (now >= r.next) {
      this.navRepeat.next = now + 120;
      this.emit({ menu: dir, device: 'gamepad', repeat: true, stick: true });
    }
    if (any) this.lastInput = 'pad';
  },

  // The swim direction (length 0..1) from keys, stick, d-pad and touch.
  moveVector() {
    let x = 0, y = 0;
    const c = this.controls;
    const keyHeld = (a) => c.keys(a).some((k) => this.held.has(k));
    const padHeld = (a) => c.pad(a).some((b) => this.padHeld.has(b));
    if (keyHeld('left') || padHeld('left')) x -= 1;
    if (keyHeld('right') || padHeld('right')) x += 1;
    if (keyHeld('up') || padHeld('up')) y -= 1;
    if (keyHeld('down') || padHeld('down')) y += 1;
    if (x || y) { const l = Math.hypot(x, y); return { x: x / l, y: y / l }; }
    if (this.padVec.x || this.padVec.y) return { ...this.padVec };
    return { ...this.touchVec };
  },

  releaseAll() {
    this.held.clear();
    this.padHeld.clear();
    this.touchVec = { x: 0, y: 0 };
    this.navRepeat = { dir: null, next: 0 };
  },

  padType() {
    const id = this.padId || '';
    if (/054c|dualsense|dualshock|playstation|wireless controller/i.test(id)) return 'ps';
    if (/057e|pro controller|joy-con/i.test(id)) return 'nintendo';
    return 'xbox';
  },
  padStandard() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) if (p && p.connected) return p.mapping === 'standard';
    return true;
  },
};

// ---- Labels: everything that names a control asks these. ----

const ARROW_SVG = {
  ArrowUp: '<svg viewBox="0 0 7 7" class="ic"><path d="M3 0h1v1h1v1h1v1h1v1H5v3H2V4H0V3h1V2h1V1h1z"/></svg>',
  ArrowDown: '<svg viewBox="0 0 7 7" class="ic"><path d="M2 0h3v3h2v1H6v1H5v1H4v1H3V6H2V5H1V4H0V3h2z"/></svg>',
  ArrowLeft: '<svg viewBox="0 0 7 7" class="ic"><path d="M3 0h1v2h3v3H4v2H3V6H2V5H1V4H0V3h1V2h1V1h1z"/></svg>',
  ArrowRight: '<svg viewBox="0 0 7 7" class="ic"><path d="M3 0h1v1h1v1h1v1h1v1H6v1H5v1H4v1H3V5H0V2h3z"/></svg>',
};
const PS = {
  0: '<svg viewBox="0 0 10 10" class="ic ps"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>',
  1: '<svg viewBox="0 0 10 10" class="ic ps"><circle cx="5" cy="5" r="3.3" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  2: '<svg viewBox="0 0 10 10" class="ic ps"><rect x="1.8" y="1.8" width="6.4" height="6.4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  3: '<svg viewBox="0 0 10 10" class="ic ps"><path d="M5 1.5L8.8 8H1.2z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/></svg>',
};
const PAD_NAMES = {
  xbox: { 0: 'A', 1: 'B', 2: 'X', 3: 'Y', 4: 'LB', 5: 'RB', 6: 'LT', 7: 'RT', 8: 'View', 9: 'Menu', 10: 'LS', 11: 'RS', 12: 'D-pad ↑', 13: 'D-pad ↓', 14: 'D-pad ←', 15: 'D-pad →' },
  nintendo: { 0: 'B', 1: 'A', 2: 'Y', 3: 'X', 4: 'L', 5: 'R', 6: 'ZL', 7: 'ZR', 8: '−', 9: '+', 10: 'LS', 11: 'RS' },
  ps: { 4: 'L1', 5: 'R1', 6: 'L2', 7: 'R2', 8: 'Create', 9: 'Options', 10: 'L3', 11: 'R3' },
};
const DPAD = { 12: 'ArrowUp', 13: 'ArrowDown', 14: 'ArrowLeft', 15: 'ArrowRight' };

export function keyCap(code) {
  if (ARROW_SVG[code]) return `<span class="cap">${ARROW_SVG[code]}</span>`;
  return `<span class="cap">${escapeHtml(input.controls.label(code))}</span>`;
}
export function padCap(i, type = input.padType()) {
  if (DPAD[i]) return `<span class="cap pad">D-pad ${ARROW_SVG[DPAD[i]]}</span>`;
  if (type === 'ps' && PS[i]) return `<span class="cap pad">${PS[i]}</span>`;
  const n = (PAD_NAMES[type] || PAD_NAMES.xbox)[i] ?? PAD_NAMES.xbox[i] ?? `Button ${i}`;
  return `<span class="cap pad">${escapeHtml(n)}</span>`;
}
// Fixed menu buttons by position.
export const confirmCap = () => (input.device === 'gamepad' ? padCap(0) : keyCap('Enter'));
export const backCap = () => (input.device === 'gamepad' ? padCap(1) : keyCap('Escape'));

// The label for an action on the current device (HTML).
export function label(action, device = input.device) {
  if (device === 'gamepad') {
    if (action === 'move') return '<span class="cap pad">Left stick</span>';
    const p = input.controls.pad(action);
    return p.length ? padCap(p[0]) : '';
  }
  if (device === 'touch') {
    return { move: 'Drag on the left side', talk: 'Tap Talk', items: 'Pause, then Items', home: 'the Home button', pause: 'the Pause button', mute: 'the speaker button' }[action] || '';
  }
  if (action === 'move') {
    const k = ['up', 'left', 'down', 'right'].map((a) => input.controls.keys(a)[0]);
    return k.map(keyCap).join('');
  }
  const k = input.controls.keys(action);
  return k.map(keyCap).join(' or ');
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
