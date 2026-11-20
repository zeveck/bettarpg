// route-runner.js: plays a recorded route (design/solutions/*.json) in the
// browser with real key presses, re-checking window.__game.state() at every
// waypoint. Used by tools/play-route.sh, which pastes a route in place of
// __ROUTE__ and runs this with `playwright-cli run-code`.
// Progress goes to window.__runLog (read it with eval while it runs).
async (page) => {
  const route = __ROUTE__;
  const T0 = Date.now();
  const LIMIT = (route.timeLimit || 240) * 1000;
  const st = () => page.evaluate(() => window.__game.state());
  const log = async (m) => { await page.evaluate((m) => { (window.__runLog = window.__runLog || []).push(m); }, `${((Date.now() - T0) / 1000).toFixed(1)}s ${m}`); };
  const sleep = (ms) => page.waitForTimeout(ms);
  const press = async (k, hold = 60) => { await page.keyboard.down(k); await sleep(hold); await page.keyboard.up(k); };
  const held = new Set();
  let justFought = false;
  const hold = async (keys) => {
    for (const k of [...held]) if (!keys.includes(k)) { await page.keyboard.up(k); held.delete(k); }
    for (const k of keys) if (!held.has(k)) { await page.keyboard.down(k); held.add(k); }
  };
  const fail = async (m) => { await hold([]); await log('FAIL ' + m); throw new Error(m); };
  const maxHp = (L) => 20 + 6 * (L - 1);

  async function clearDialogs(limit = 60) {
    for (let i = 0; i < limit; i++) {
      const s = await st();
      if (s.inBattle) return s;
      if (s.dialog) { await press('Space'); await sleep(160); continue; }
      if (s.menus.includes('banner') || s.menus.includes('credits')) { await press('Enter'); await sleep(300); continue; }
      if (s.busy) { await sleep(150); continue; }
      return s;
    }
    return st();
  }

  async function battle(policy) {
    let lastTurn = -1, same = 0;
    for (let i = 0; i < 400; i++) {
      if (Date.now() - T0 > LIMIT) await fail('time limit in battle');
      const s = await st();
      if (!s.inBattle) {
        if (s.mode === 'world' && !s.busy && !s.dialog) return s;
        if (s.dialog || s.menus.includes('banner') || s.menus.includes('credits')) { await press(s.dialog ? 'Space' : 'Enter'); await sleep(200); continue; }
        await sleep(150); continue;
      }
      const b = s.inBattle;
      if (b.waiting) { await press('Enter'); await sleep(400); continue; }
      if (b.busy || b.over) { await sleep(120); continue; }
      if (b.turn === lastTurn) same++; else { same = 0; lastTurn = b.turn; }
      if (b.row !== 'main') { await press('Escape'); await sleep(120); continue; }
      const L = s.level, hp = b.playerHp, mp = b.playerMp, it = s.items;
      const ehpFrac = b.hp / b.hpMax;
      const pick = async (...keys) => { for (const k of keys) { await press(k); await sleep(140); } await sleep(250); };
      if (same > 2) { await pick('Digit1'); continue; } // something was refused: just bite
      const heal = hp <= maxHp(L) * 0.38 && (it.seedcake || it.kelp);
      if (policy === 'flee') { await pick('Digit5'); continue; }
      if (heal) { await pick('Digit4', it.seedcake ? 'Digit2' : 'Digit1'); continue; }
      if (policy === 'gar-party') {
        if (!b.partyStarted || mp >= 5) await pick('Digit3');
        else if (it.bwater) await pick('Digit4', 'Digit3');
        else if (it.fizzy) await pick('Digit4', 'Digit4');
        else await pick('Digit1');
        continue;
      }
      if (policy === 'gar-sub' && !b.dived) { await page.keyboard.press('ArrowUp'); await sleep(100); await press('Enter'); await sleep(400); continue; }
      if (policy === 'party' || policy === 'stump') {
        const btns = await page.evaluate(() => window.__game.buttons().filter((x) => /Party/.test(x.label)));
        const lit = btns.length && !btns[0].dim;
        if (b.scripted === 'stump') { if (lit) { await pick('Digit3'); continue; } await pick('Digit1'); continue; }
        if (lit && mp >= 5 && (ehpFrac <= 0.55 || b.hp <= 14)) { await pick('Digit3'); continue; }
        if (mp - 3 >= 5) { await pick('Digit2', 'Digit1'); continue; }
        await pick('Digit1');
        continue;
      }
      // fight
      if (L >= 4 && mp >= 5 && (b.kind === 'cat' || b.kind === 'cray' || b.hp > 12)) { await pick('Digit2', 'Digit2'); continue; }
      if (mp >= 3) { await pick('Digit2', 'Digit1'); continue; }
      await pick('Digit1');
    }
    await fail('battle did not end');
  }

  async function go(x, y, tol = 7, policy = route.policy || 'fight') {
    let best = 1e9, bestAt = Date.now();
    for (;;) {
      if (Date.now() - T0 > LIMIT) await fail(`time limit going to ${x},${y}`);
      let s = await st();
      if (s.inBattle) { await hold([]); await log(`battle ${s.inBattle.kind} L${s.inBattle.level} at ${s.player.x},${s.player.y}`); justFought = true; s = await battle(s.inBattle.scripted === 'stump' ? 'stump' : policy); await log(`after battle hp ${s.hp}/${maxHp(s.level)} L${s.level}`); best = 1e9; bestAt = Date.now(); continue; }
      if (s.dialog || s.busy || s.menus.length) { await hold([]); if (s.menus.some((m) => !['dialog', 'banner', 'credits'].includes(m))) { await fail('unexpected menu ' + s.menus.join(',')); } s = await clearDialogs(); best = 1e9; bestAt = Date.now(); continue; }
      if (s.mode !== 'world' || s.transition) { await hold([]); await sleep(150); best = 1e9; bestAt = Date.now(); continue; }
      const p = s.player, dx = x - p.x, dy = y - p.y, d = Math.hypot(dx, dy);
      if (d <= tol) { await hold([]); return s; }
      if (d < best - 2) { best = d; bestAt = Date.now(); }
      if (Date.now() - bestAt > 2500) await fail(`stuck at ${p.x},${p.y} going to ${x},${y}`);
      const keys = [];
      const ax = Math.abs(dx), ay = Math.abs(dy);
      if (ax > Math.max(3, ay * 0.4)) keys.push(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
      if (ay > Math.max(3, ax * 0.4)) keys.push(dy > 0 ? 'ArrowDown' : 'ArrowUp');
      await hold(keys);
      await sleep(d < 20 ? 25 : 45);
    }
  }

  await page.evaluate(() => { window.__runLog = []; });
  try {
    for (const step of route.steps) {
      if (!step.battle) justFought = false;
      if (step.start !== undefined) { await page.evaluate((n) => window.__game.goToLevel(n), step.start); await sleep(600); await log(`start area ${step.start}`); }
      if (step.seed !== undefined) await page.evaluate((n) => window.__game.seed(n), step.seed);
      if (step.set) await page.evaluate((o) => window.__game.set(o), step.set);
      if (step.go) { await go(step.go[0], step.go[1], step.tol, step.policy); if (step.note) await log(step.note); }
      if (step.path) { for (const [x, y] of step.path) await go(x, y, step.tol, step.policy); if (step.note) await log(step.note); }
      if (step.talk) { await press('Space'); await sleep(250); }
      if (step.choose !== undefined) {
        for (let i = 0; i < 40; i++) { const s = await st(); if (s.dialog) { const b = await page.evaluate(() => window.__game.buttons().filter((x) => x.y > 0)); if (b.some((x) => x.focus)) break; await press('Space'); await sleep(150); } else break; }
        for (let i = 0; i < step.choose; i++) { await press('ArrowDown'); await sleep(80); }
        await press('Enter'); await sleep(400);
      }
      if (step.say) await clearDialogs();
      if (step.key) { await press(step.key); await sleep(step.after || 300); }
      if (step.battle) {
        let started = false;
        for (let i = 0; i < 60; i++) { const s = await st(); if (s.inBattle) { started = true; break; } await sleep(100); }
        if (!started && justFought) { justFought = false; continue; }
        if (!started) await fail('no battle started');
        const s = await battle(step.battle);
        await log(`battle done: L${s.level} hp ${s.hp}`);
      }
      if (step.wait) await sleep(step.wait);
      if (step.expect) {
        await clearDialogs();
        const s = await st();
        for (const [k, v] of Object.entries(step.expect)) {
          const got = k in s.flags || ['metFinn'].includes(k) ? !!s.flags[k] : s[k];
          if (k.startsWith('flag:') ? !!s.flags[k.slice(5)] !== v : (k in s ? s[k] !== v : !!s.flags[k] !== v)) await fail(`expected ${k}=${v}, got ${JSON.stringify(k in s ? s[k] : s.flags[k])}`);
        }
        await log('ok ' + JSON.stringify(step.expect));
      }
    }
  } finally { await hold([]); }
  const s = await st();
  await log('DONE');
  return JSON.stringify({ done: true, secs: ((Date.now() - T0) / 1000).toFixed(1), area: s.area, player: s.player, level: s.level, hp: s.hp, mp: s.mp, bb: s.bb, flags: s.flags, friends: s.friends, scales: s.scales, cogs: s.cogs, log: await page.evaluate(() => window.__runLog) });
}
