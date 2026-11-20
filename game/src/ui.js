// ui.js: the HTML over the canvas: 9-slice panels made in code, focus
// navigation for every menu (keys, controller, mouse, touch), the dialogue
// box, toasts, hints, banners and the HUD.
import * as audio from './audio.js';
import { escapeHtml, label, input } from './input.js';
import { portrait } from './sprites.js';

export const $ = (id) => document.getElementById(id);
export const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

// ---------- 9-slice panels drawn once ----------
export function makePanels() {
  const make = (fill, edge, hi) => {
    const c = document.createElement('canvas'); c.width = 18; c.height = 18;
    const g = c.getContext('2d');
    g.fillStyle = '#0B1424'; g.fillRect(0, 0, 18, 18);
    g.fillStyle = edge; g.fillRect(1, 1, 16, 16);
    g.fillStyle = hi; g.fillRect(1, 1, 16, 1); g.fillRect(1, 1, 1, 16);
    g.fillStyle = '#0B1424'; g.fillRect(3, 3, 12, 12);
    g.fillStyle = fill; g.fillRect(4, 4, 10, 10);
    // rounded corners
    g.clearRect(0, 0, 1, 1); g.clearRect(17, 0, 1, 1); g.clearRect(0, 17, 1, 1); g.clearRect(17, 17, 1, 1);
    return `url(${c.toDataURL()})`;
  };
  const root = document.documentElement.style;
  root.setProperty('--panel-img', make('#172A46', '#6E93AE', '#AFD0E2'));
  root.setProperty('--btn-img', make('#213A5E', '#6E93AE', '#AFD0E2'));
}

// ---------- focus navigation ----------
// Each open menu is a layer: { id, el, back(), keys(ev) -> handled, wrap }
export const nav = {
  stack: [],
  push(layer) {
    const prev = this.top();
    if (prev && prev.id !== layer.id) prev.lastFocus = this.focused(prev);
    this.stack = this.stack.filter((l) => l.id !== layer.id);
    this.stack.push(layer);
    setTimeout(() => { if (this.top() === layer && !layer.noAutoFocus) this.focusFirst(); }, 0);
  },
  remove(id) {
    const wasTop = this.top()?.id === id;
    this.stack = this.stack.filter((l) => l.id !== id);
    // give focus back to where it was in the menu underneath
    const t = this.top();
    if (wasTop && t) setTimeout(() => {
      if (this.top() !== t || this.focused(t)) return;
      if (t.lastFocus && this.items(t).includes(t.lastFocus)) this.setFocus(t.lastFocus, false);
      else if (!t.noAutoFocus) this.focusFirst();
    }, 0);
  },
  top() { return this.stack[this.stack.length - 1] || null; },
  has(id) { return this.stack.some((l) => l.id === id); },
  items(layer = this.top()) {
    if (!layer) return [];
    return [...layer.el.querySelectorAll('button, input[type=range], [data-nav]')]
      .filter((b) => !b.disabled && b.offsetParent !== null && !b.closest('[hidden]'));
  },
  focused(layer = this.top()) { return layer ? this.items(layer).find((b) => b.classList.contains('focus')) || null : null; },
  setFocus(b, sound = true) {
    for (const x of document.querySelectorAll('.focus')) x.classList.remove('focus');
    if (b) {
      b.classList.add('focus');
      if (b.tagName === 'INPUT' && b.type !== 'range') { /* never auto-focus text fields */ }
      b.scrollIntoView?.({ block: 'nearest' });
      if (sound) audio.blip('move');
    }
  },
  focusFirst() {
    const l = this.top(); if (!l) return;
    const it = this.items(l);
    const pref = l.initial ? (typeof l.initial === 'function' ? l.initial() : l.el.querySelector(l.initial)) : null;
    this.setFocus(pref && it.includes(pref) ? pref : it[0], false);
  },
  move(dir) {
    const l = this.top(); if (!l) return false;
    const it = this.items(l);
    if (!it.length) return false;
    let cur = this.focused(l);
    if (!cur) { this.setFocus(it[0]); return true; }
    if (cur.type === 'range' && (dir === 'left' || dir === 'right')) {
      const step = +cur.step || 0.1;
      cur.value = Math.max(+cur.min, Math.min(+cur.max, +cur.value + (dir === 'right' ? step : -step)));
      cur.dispatchEvent(new Event('input', { bubbles: true }));
      audio.blip('move');
      return true;
    }
    const r = cur.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let best = null, bd = 1e9;
    for (const b of it) {
      if (b === cur) continue;
      const q = b.getBoundingClientRect(), bx = q.left + q.width / 2, by = q.top + q.height / 2;
      const dx = bx - cx, dy = by - cy;
      let primary, secondary;
      if (dir === 'left') { if (dx > -4) continue; primary = -dx; secondary = Math.abs(dy); }
      else if (dir === 'right') { if (dx < 4) continue; primary = dx; secondary = Math.abs(dy); }
      else if (dir === 'up') { if (dy > -4) continue; primary = -dy; secondary = Math.abs(dx); }
      else { if (dy < 4) continue; primary = dy; secondary = Math.abs(dx); }
      const score = primary + secondary * 2.5;
      if (score < bd) { bd = score; best = b; }
    }
    if (!best && l.wrap !== false) {
      // wrap around in lists
      const i = it.indexOf(cur);
      if (dir === 'down' || dir === 'right') best = it[(i + 1) % it.length];
      else best = it[(i - 1 + it.length) % it.length];
    }
    if (best) this.setFocus(best);
    return true;
  },
  // Route a menu event to the top layer. Returns true if used.
  handle(ev) {
    const l = this.top();
    if (!l) return false;
    if (l.keys && l.keys(ev)) return true;
    if (ev.menu === 'back') { if (l.back) { audio.blip('back'); l.back(); } return true; }
    if (ev.menu === 'confirm') {
      const f = this.focused(l);
      if (f && f.tagName === 'BUTTON') { press(f); return true; }
      if (f && f.type === 'range') return true;
      if (l.confirm) { l.confirm(); return true; }
      return true;
    }
    if (ev.menu === 'first' || ev.menu === 'last') {
      const it = this.items(l); if (it.length) this.setFocus(ev.menu === 'first' ? it[0] : it[it.length - 1]);
      return true;
    }
    if (['up', 'down', 'left', 'right'].includes(ev.menu)) return this.move(ev.menu);
    return !!l.modal;
  },
};

// A pressed button: the same path as a click.
export function press(b) {
  if (!b || b.disabled) return;
  b.classList.add('pressed');
  setTimeout(() => b.classList.remove('pressed'), 120);
  b.click();
}

// Buttons: click with sound; hover moves focus.
export function button(text, onClick, cls = 'btn') {
  const b = el('button', cls, text);
  b.addEventListener('click', (e) => { e.stopPropagation(); audio.blip('select'); onClick?.(e); });
  b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') nav.setFocus(b, false); });
  return b;
}
export function wire(id, onClick) {
  const b = $(id);
  b.addEventListener('click', (e) => { e.stopPropagation(); audio.blip('select'); onClick?.(e); });
  b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') nav.setFocus(b, false); });
  return b;
}

// ---------- screens ----------
export function show(id) { const s = document.querySelector(`[data-screen="${id}"]`); if (s) s.hidden = false; return s; }
export function hide(id) { const s = document.querySelector(`[data-screen="${id}"]`); if (s) s.hidden = true; }
export const screenEl = (id) => document.querySelector(`[data-screen="${id}"]`);
export function visibleScreens() { return [...document.querySelectorAll('[data-screen]:not([hidden])')].map((s) => s.dataset.screen); }

// ---------- portraits ----------
export function drawPortrait(canvas, sprite, bg = '#2B7FC4') {
  const g = canvas.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.fillStyle = bg === '#2B7FC4' ? '#1D3049' : bg; g.fillRect(0, 0, canvas.width, canvas.height);
  if (!sprite) return;
  const p = portrait(sprite, 24);
  if (!p) return;
  const s = Math.floor(canvas.width / p.width) || 1;
  g.drawImage(p, Math.floor((canvas.width - p.width * s) / 2), Math.floor((canvas.height - p.height * s) / 2), p.width * s, p.height * s);
}

// ---------- toasts, hints, banner ----------
export function toast(html, ms = 2200) {
  const t = el('div', 'panel toast', html);
  $('toasts').append(t);
  while ($('toasts').children.length > 3) $('toasts').firstChild.remove();
  setTimeout(() => t.remove(), ms);
}
let hintTimer = 0;
export function hint(html, ms = 4500) {
  $('hintText').innerHTML = html;
  $('hint').hidden = false;
  clearTimeout(hintTimer);
  if (ms) hintTimer = setTimeout(() => { $('hint').hidden = true; }, ms);
}
export function hideHint() { $('hint').hidden = true; clearTimeout(hintTimer); }
let bannerTimer = 0;
export function banner(text, pic = null) {
  $('bannerText').textContent = text;
  const pc = $('bannerPic');
  if (pic) {
    pc.hidden = false;
    const g = pc.getContext('2d'); g.imageSmoothingEnabled = false;
    g.clearRect(0, 0, 88, 52);
    g.drawImage(pic, 10, 0, 88, 52, 0, 0, 88, 52);
  } else pc.hidden = true;
  $('banner').hidden = false;
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => { $('banner').hidden = true; }, 2600);
}

// ---------- the dialogue box ----------
let dlg = null;
export function dialogOpen() { return !!dlg; }
// say(speaker {name, sprite canvas}, text, choices?) -> Promise<choice index | undefined>
// Lines never overlap: a second line waits for the first to close.
let sayChain = Promise.resolve();
export function say(speaker, text, choices = null) {
  const p = sayChain.then(() => sayNow(speaker, text, choices));
  sayChain = p.catch(() => {});
  return p;
}
function sayNow(speaker, text, choices = null) {
  return new Promise((resolve) => {
    const box = $('dialog');
    box.hidden = false;
    $('dName').textContent = speaker?.name || '';
    const pc = $('dPortrait');
    pc.hidden = !speaker?.sprite;
    if (speaker?.sprite) drawPortrait(pc, speaker.sprite);
    $('dText').textContent = '';
    $('dChoices').innerHTML = '';
    $('dNext').innerHTML = '';
    const state = { text, shown: 0, done: false, resolve, choices, t0: performance.now() };
    dlg = state;
    const finishTyping = () => {
      state.shown = text.length; $('dText').textContent = text; state.done = true;
      if (choices) {
        choices.forEach((c, i) => {
          const b = button(escapeHtml(c), () => close(i));
          $('dChoices').append(b);
        });
        nav.focusFirst();
      } else $('dNext').innerHTML = '&#9660;';
    };
    const close = (v) => {
      if (dlg !== state) return;
      dlg = null;
      clearInterval(state.timer);
      nav.remove('dialog');
      // hold the box for a couple of frames: the next line usually follows
      box.dataset.closing = '1';
      setTimeout(() => { if (!dlg) box.hidden = true; delete box.dataset.closing; }, 60);
      resolve(v);
    };
    state.advance = () => {
      if (!state.done) { finishTyping(); return; }
      if (!choices) { audio.blip('text'); close(undefined); }
    };
    state.timer = setInterval(() => {
      if (state.done) { clearInterval(state.timer); return; }
      state.shown = Math.min(text.length, state.shown + 2);
      $('dText').textContent = text.slice(0, state.shown);
      if (state.shown % 4 === 0) audio.blip('text');
      if (state.shown >= text.length) { clearInterval(state.timer); finishTyping(); }
    }, 32);
    nav.push({ id: 'dialog', el: box, modal: true, noAutoFocus: true,
      keys: (ev) => {
        if (ev.menu === 'confirm' || ev.action === 'talk') {
          if (state.done && choices) return false;
          state.advance(); return true;
        }
        if (ev.menu === 'back' && choices) { close(choices.length - 1); return true; }
        if (ev.menu === 'back') { state.advance(); return true; }
        return false;
      } });
  });
}
// Drop every line, shown or queued (quitting to the title, debug jumps).
export function resetDialogs() {
  if (dlg) { clearInterval(dlg.timer); dlg = null; }
  sayChain = Promise.resolve();
  nav.remove('dialog');
  $('dialog').hidden = true;
}
export function dialogTap() { if (dlg && !(dlg.done && dlg.choices)) dlg.advance(); }

// Fill text templates with the player's current controls.
export function withKeys(text) {
  // a label that starts a sentence starts with a capital; one inside a sentence doesn't
  const sub = (s, key, html) => s.replace(new RegExp('(^|[.!?] )?\\{' + key + '\\}', 'g'), (m, start) => {
    const h = !start && m.startsWith('{') && s.indexOf(m) > 0 ? html.replace(/^The /, 'the ') : html;
    return (start || '') + h;
  });
  let s = escapeHtml(text);
  for (const [k, a] of [['swim', 'move'], ['talk', 'talk'], ['home', 'home'], ['items', 'items'], ['pause', 'pause']]) s = sub(s, k, label(a));
  return s;
}

// Fade to a word and back.
export function fade(on, text = '') {
  const f = $('fade');
  $('fadeText').textContent = text;
  if (on) { f.hidden = false; requestAnimationFrame(() => f.classList.add('on')); }
  else { f.classList.remove('on'); setTimeout(() => { if (!f.classList.contains('on')) f.hidden = true; }, 650); }
  return new Promise((r) => setTimeout(r, 650));
}

export { input };
