// screens-change1.js: the screens Change 1 added or changed (title with slots,
// Load, New Game+ slot choice and confirms, Settings with the parade toggle,
// the Snarl battle and Tangled, the parade in the village and Highwater), at
// one size and driven by one input: keyboard, mouse, touch or controller (a
// fake standard gamepad). Screenshots go to design/screenshots/<prefix>-*.png
// and each is scanned with the gamegen text scanner.
// Paste into playwright-cli run-code with __PREFIX__, __SIZE__ ("1280x720"),
// __INPUT__ (keyboard|mouse|touch|pad), __PHONE__ (true|false), __URL__ and
// __SCAN__ filled in (tools/screens-change1.sh).
async (page) => {
  const prefix = '__PREFIX__', [W, H] = '__SIZE__'.split('x').map(Number), mode = '__INPUT__', phone = __PHONE__;
  const ctx = await page.context().browser().newContext(phone
    ? { viewport: { width: W, height: H }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' }
    : { viewport: { width: W, height: H } });
  if (mode === 'pad') {
    await ctx.addInitScript(() => {
      const pad = { id: 'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)', index: 0, connected: true, mapping: 'standard', timestamp: 0,
        buttons: Array.from({ length: 17 }, () => ({ pressed: false, touched: false, value: 0 })), axes: [0, 0, 0, 0] };
      window.__pad = pad;
      navigator.getGamepads = () => [pad, null, null, null];
    });
  }
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const out = { size: `${W}x${H}`, input: mode, shots: {}, checks: [] };
  const sleep = (ms) => p.waitForTimeout(ms);
  const st = () => p.evaluate(() => window.__game.state());
  const check = (ok, what) => { out.checks.push((ok ? 'ok   ' : 'FAIL ') + what); };
  const shot = async (name) => {
    await sleep(450);
    await p.screenshot({ path: `bettarpg/design/screenshots/${prefix}-${name}.png` });
    await p.addScriptTag({ path: '__SCAN__' });
    const r = await p.evaluate(() => window.__scanText());
    out.shots[name] = r.length ? r.map((x) => `${x.kind}: ${String(x.text).slice(0, 70)}`) : 'ok';
  };
  // ---- input ----
  const key = async (k) => { await p.keyboard.down(k); await sleep(60); await p.keyboard.up(k); await sleep(220); };
  const padBtn = async (i) => {
    await p.evaluate((i) => { const b = window.__pad.buttons[i]; b.pressed = true; b.value = 1; }, i); await sleep(90);
    await p.evaluate((i) => { const b = window.__pad.buttons[i]; b.pressed = false; b.value = 0; }, i); await sleep(200);
  };
  const DIR = { up: ['ArrowUp', 12], down: ['ArrowDown', 13], left: ['ArrowLeft', 14], right: ['ArrowRight', 15] };
  const box = (sel, label) => p.evaluate(([sel, label]) => {
    const els = [...document.querySelectorAll(sel)].filter((b) => b.offsetParent !== null && !b.closest('[hidden]') && (!label || new RegExp('^' + label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|\\d|$)').test(b.textContent.trim())));
    const b = els[0]; if (!b) return null;
    const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, [sel, label]);
  const focusBox = () => p.evaluate(() => { const b = [...document.querySelectorAll('.btn.focus, button.focus')].find((x) => x.offsetParent !== null && !x.closest('[hidden]')); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: b.textContent.trim() }; });
  // press the button: mouse/touch go straight to it; keyboard/pad move the focus there and confirm
  const act = async (sel, label = null) => {
    const t = await box(sel, label);
    if (!t) { check(false, `no button ${sel} ${label || ''}`); return false; }
    if (mode === 'mouse') { await p.mouse.move(t.x, t.y); await p.mouse.down(); await sleep(80); await p.mouse.up(); await sleep(350); return true; }
    if (mode === 'touch') { await p.touchscreen.tap(t.x, t.y); await sleep(400); return true; }
    for (let i = 0; i < 16; i++) {
      const f = await focusBox();
      const tt = await box(sel, label);
      if (f && tt && Math.hypot(f.x - tt.x, f.y - tt.y) < 3) break;
      if (!f) { mode === 'pad' ? await padBtn(13) : await key('ArrowDown'); continue; }
      const dx = tt.x - f.x, dy = tt.y - f.y;
      const d = Math.abs(dy) > 6 ? (dy > 0 ? 'down' : 'up') : (dx > 0 ? 'right' : 'left');
      mode === 'pad' ? await padBtn(DIR[d][1]) : await key(DIR[d][0]);
    }
    const f = await focusBox(), tt = await box(sel, label);
    if (!f || !tt || Math.hypot(f.x - tt.x, f.y - tt.y) >= 3) { check(false, `could not focus ${label || sel}`); return false; }
    mode === 'pad' ? await padBtn(0) : await key('Enter');
    await sleep(250);
    return true;
  };
  const back = async () => { if (mode === 'pad') await padBtn(1); else if (mode === 'keyboard') await key('Escape'); else await act('#slotsBack'); await sleep(300); };

  // ---- saves: a finished published save (migrates to slot 1), an NG+ L13 save, an unreadable one ----
  await p.goto('__URL__'); await sleep(2000);
  await p.evaluate(() => {
    localStorage.clear();
    window.__game.legacySave({ v: 1, name: 'Wanda', color: 'blue', level: 9, exp: 120, hp: 50, mp: 20, bb: 230, items: { kelp: 2, seedcake: 1, bwater: 3, fizzy: 0 }, subOwned: true,
      flags: { metFinn: true, bubbleJoined: true, hbtLearned: true, stumpDone: true, eastOpen: true, trailFound: true, highwater: true, lantern: true, gateOpen: true, garDefeated: true },
      friends: { guppy: 3, angel: 2, cat: 1 }, scales: ['s1', 's2', 's3', 's4', 's5'], cogs: ['c1', 'c2', 'c3'], rest: 'spring', area: 'ditch', pos: { x: 600, y: 300 },
      wearHat: true, ending: 'fins', endingsSeen: { fins: true }, playTime: 3000 });
    localStorage.setItem('bettarpg-save-2', JSON.stringify({ v: 1, name: 'Kiko', color: 'gold', level: 13, ngPlus: 1, area: 'highwater', pos: { x: 700, y: 300 }, friends: { snarl: 1, guppy: 2 },
      flags: { snarlDone: true, snarlFriend: true, trailFound: true }, endingsSeen: { fins: true }, ending: 'fins', lastEnding: 'fins', lastPlayed: Date.now() - 3 * 3600e3 }));
    localStorage.setItem('bettarpg-save-3', '{broken');
    localStorage.setItem('bettarpg-last-slot', '1');
  });
  await p.reload(); await sleep(2500);
  if (mode === 'keyboard') await key('ArrowDown'), await key('ArrowUp');
  if (mode === 'pad') await padBtn(13), await padBtn(12);
  const labels = (await p.evaluate(() => window.__game.buttons().map((b) => b.label))).join('|');
  check(labels.includes('Continue|New Game+|New Game|Load'), 'title: Continue, New Game+, New Game, Load');
  await shot('title');
  // Load
  await act('#titleMenu button', 'Load');
  let s = await st();
  check(s.menus.includes('slots'), 'Load opens the slot screen');
  const rows = await p.evaluate(() => [...document.querySelectorAll('#slotList .slotrow')].map((r) => r.textContent.replace(/\s+/g, ' ').trim()));
  check(/Wanda/.test(rows[0]) && /Level 9/.test(rows[0]) && /Endings: fins/.test(rows[0]), 'slot 1: the migrated published save');
  check(/Kiko/.test(rows[1]) && /Level 13\+/.test(rows[1]) && /NG\+ 1/.test(rows[1]), 'slot 2: NG+ badge, Level 13+');
  check(/Can't read this save/.test(rows[2]) && /Delete/.test(rows[2]), 'slot 3: unreadable, with Delete');
  await shot('load');
  await back();
  // New Game+ from the title: the slot choice and both confirms
  await act('#titleMenu button', 'New Game+');
  s = await st();
  check(s.menus.includes('slots'), 'New Game+ asks for a slot');
  await shot('ngplus-slots');
  await act('#slotList .slotrow:nth-child(1) button', 'Replace this game');
  check(await p.evaluate(() => document.querySelector('#confirmText').textContent.startsWith('This replaces your finished game')), 'the source slot needs the second confirm');
  await shot('ngplus-replace');
  await act('#confirmNo');
  await act('#slotList .slotrow:nth-child(3) button', 'Overwrite');
  check(await p.evaluate(() => document.querySelector('#confirmText').textContent.startsWith('Overwrite the unreadable save')), 'overwrite confirm on a used slot');
  await act('#confirmYes');
  check(await p.evaluate(() => /Carries over/.test(document.querySelector('#confirmText').textContent)), 'the New Game+ confirm lists what carries over');
  await shot('ngplus-confirm');
  await act('#confirmNo');
  check((await p.evaluate(() => window.__game.slots()[2].unreadable)), 'cancelling leaves slot 3 as it was');
  await back();
  // Settings: the parade toggle
  await act('#titleMenu button', 'Settings');
  check(!!(await box('#setList button', 'Parade: on')), 'Settings: Parade: on by default');
  await act('#setList button', 'Parade: on');
  check(!!(await box('#setList button', 'Parade: off')), 'Parade toggles off');
  await shot('settings');
  await act('#setList button', 'Parade: off');
  check(await p.evaluate(() => JSON.parse(localStorage.getItem('bettarpg-settings')).parade === true), 'the parade setting is stored globally');
  await act('#setDone');

  // ---- the Snarl battle ----
  await p.evaluate(async () => { await window.__game.goToLevel(3); });
  await sleep(1200);
  for (let i = 0; i < 6; i++) { if (!(await st()).dialog) break; mode === 'pad' ? await padBtn(0) : mode === 'keyboard' ? await key('Space') : await act('#dialog'); }
  await p.evaluate(() => { window.__game.seed(5); window.__game.set({ items: { kelp: 2 } }); window.__game.battle('snarl', 5); });
  await sleep(3500);
  for (let i = 0; i < 40 && (await st()).inBattle?.busy; i++) await sleep(150);
  check((await st()).inBattle?.net === 4, 'Snarl battle: net whole (4 knots)');
  await shot('snarl-battle');
  for (let i = 0; i < 120; i++) {
    const b = (await st()).inBattle;
    if (!b || b.over || b.tangled) break;
    if (b.busy) { await sleep(150); continue; }
    if (b.row !== 'main') { await back(); continue; }
    await act('#bRow button', 'Attack');
  }
  for (let i = 0; i < 60 && (await st()).inBattle?.busy; i++) await sleep(150);
  let b = (await st()).inBattle;
  check(!!b?.tangled, 'Tangled after a Net Throw');
  await sleep(600);
  await shot('snarl-tangled');
  if (b?.tangled) {
    const dims = await p.evaluate(() => window.__game.buttons().filter((x) => x.dim).map((x) => x.label));
    check(dims.some((l) => /Spells/.test(l)) && dims.some((l) => /Swim Away/.test(l)), 'Tangled: Spells and Swim Away dimmed');
    await act('#bRow button', 'Spells');
    check(await p.evaluate(() => /Tangled! Only Attack or an item this turn\./.test(document.querySelector('#bLog').textContent)), 'Spells while Tangled: the refusal line');
    await act('#bRow button', 'Attack');
    for (let i = 0; i < 40 && (await st()).inBattle?.busy; i++) await sleep(150);
    check(await p.evaluate(() => /Bubble nibbles the net off you!/.test(document.querySelector('#bLog').textContent)), 'Bubble nibbles the net off');
  }

  // ---- the parade: village and Highwater's city ----
  await p.evaluate(async () => { await window.__game.goToLevel(0); window.__game.set({ flags: { bubbleJoined: true }, friends: { guppy: 2, angel: 1, cat: 1, cich: 1, snarl: 1 }, pos: { x: 512, y: 330 } }); });
  await sleep(800);
  const swim = async (k, ms) => { await p.keyboard.down(k); await sleep(ms); await p.keyboard.up(k); };
  await swim('ArrowRight', 900); await swim('ArrowDown', 500); await sleep(150);
  s = await st();
  check(s.parade === 6 && s.paradeKinds.join() === 'guppy,angel,cat,cich,snarl,guppy', `village parade of 6 in rotation (${s.paradeKinds.join()})`);
  await shot('parade-village');
  await p.evaluate(async () => { await window.__game.goToLevel(3, { afterSnarl: true }); window.__game.set({ flags: { snarlFriend: true }, friends: { guppy: 2, angel: 1, snarl: 1 }, pos: { x: 768, y: 380 } }); });
  await sleep(800);
  await swim('ArrowLeft', 900); await swim('ArrowUp', 300); await sleep(150);
  s = await st();
  check(s.parade === 4 && !s.extras.includes('snarlFree'), 'Highwater parade with the Snarl (its pool spot empty)');
  await shot('parade-highwater');
  await p.evaluate(() => window.__game.set({ pos: { x: 768, y: 700 } }));
  await sleep(2500);
  s = await st();
  check(s.parade === 4, 'below the steps the parade waits at the top');
  out.errors = errors;
  await ctx.close();
  return JSON.stringify(out, null, 1);
}
