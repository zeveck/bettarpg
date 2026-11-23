// screens-tour.js: opens every screen with real key presses, screenshots each
// into design/screenshots/<prefix>-<name>.png and scans its text with the
// gamegen text scanner. Paste into playwright-cli run-code with __PREFIX__ and
// __SCAN__ (the scan-text.js path) filled in (tools/screens-tour.sh).
async (page) => {
  const prefix = '__PREFIX__';
  const out = {};
  const sleep = (ms) => page.waitForTimeout(ms);
  const press = async (k) => { await page.keyboard.down(k); await sleep(60); await page.keyboard.up(k); await sleep(250); };
  const shot = async (name) => {
    await sleep(350);
    await page.screenshot({ path: `bettarpg/design/screenshots/${prefix}-${name}.png` });
    await page.addScriptTag({ path: '__SCAN__' });
    const r = await page.evaluate(() => window.__scanText());
    out[name] = r.length ? r.map((x) => `${x.kind}: ${String(x.text).slice(0, 60)}`) : 'ok';
  };
  const st = () => page.evaluate(() => window.__game.state());
  // title and its screens
  await page.evaluate(() => localStorage.clear());
  await page.reload(); await sleep(2500);
  await shot('title');
  await press('ArrowDown'); await press('Enter'); await shot('howto-1');
  await press('Enter'); await shot('howto-2'); await press('Enter'); await shot('howto-3'); await press('Enter');
  await press('ArrowDown'); await press('Enter'); await shot('settings');
  for (let i = 0; i < 4; i++) await press('ArrowDown');
  await press('Enter'); await shot('controls');
  await press('Escape'); await press('Escape');
  await press('ArrowUp'); await press('ArrowUp'); await press('Enter');
  await shot('create');
  await press('Escape');
  // Elder Finn's house: the opening
  await page.evaluate(() => window.__game.goToLevel(0));
  await sleep(500);
  await page.evaluate(() => window.__game.enter('finnHouse', 'start'));
  await page.evaluate(() => window.__game.set({ pos: { x: 190, y: 132 } }));
  await press('Space'); await sleep(900); await shot('village-dialog');
  for (let i = 0; i < 12; i++) { const s = await st(); if (!s.dialog) break; await press('Space'); }
  await shot('finn-house');
  await page.evaluate(() => window.__game.enter('village', 'finnDoor')); await sleep(600);
  await shot('village');
  // shop: inside the Fish Mart
  await page.evaluate(() => window.__game.enter('fishMart'));
  await page.evaluate(() => window.__game.set({ pos: { x: 192, y: 158 }, bb: 120, flags: { highwater: true } }));
  await sleep(400); await shot('fish-mart');
  await press('Space');
  for (let i = 0; i < 12; i++) { const s = await st(); if (s.menus.includes('shop')) break; await press('Space'); }
  await shot('shop');
  await press('Escape');
  // inn: inside the Swishy Solace Inn
  await page.evaluate(() => window.__game.enter('villageInn'));
  await page.evaluate(() => window.__game.set({ pos: { x: 192, y: 150 } }));
  await press('Space');
  for (let i = 0; i < 12; i++) { const b = await page.evaluate(() => window.__game.buttons().filter((x) => /Rest/.test(x.label))); if (b.length) break; await press('Space'); }
  await shot('inn');
  await press('ArrowDown'); await press('Enter');
  for (let i = 0; i < 6; i++) { const s = await st(); if (!s.dialog) break; await press('Space'); }
  // pause
  await press('KeyP'); await shot('pause-items');
  { const b = await page.locator('#pauseMenu button[data-page=friends]').boundingBox(); await page.mouse.move(b.x + 20, b.y + 10); await page.mouse.down(); await sleep(110); await page.mouse.up(); }
  await shot('pause-friends');
  await press('Escape');
  await press('KeyH'); await shot('confirm-home'); await press('Escape');
  // battles
  await page.evaluate(() => { window.__game.set({ level: 5, items: { kelp: 2, seedcake: 1, bwater: 1 }, sub: true, flags: { bubbleJoined: true, hbtLearned: true } }); window.__game.battle('cat', 5); });
  await sleep(3500); await shot('battle');
  await press('Digit2'); await shot('battle-spells'); await press('Escape');
  await press('Digit4'); await shot('battle-items'); await press('Escape');
  await page.evaluate(() => window.__game.goToLevel(4)); await sleep(800);
  await page.evaluate(() => window.__game.battle('cray', 7, { edge: true })); await sleep(3500); await shot('battle-murk-edge');
  await page.evaluate(() => window.__game.goToLevel(4)); await sleep(1000); await shot('murk');
  await page.evaluate(() => window.__game.goToLevel(3)); await page.evaluate(() => window.__game.set({ pos: { x: 700, y: 300 } })); await sleep(1200); await shot('highwater');
  await page.evaluate(() => window.__game.goToLevel(5)); await page.evaluate(() => window.__game.set({ pos: { x: 300, y: 430 } })); await sleep(1200); await shot('ditch');
  for (let i = 0; i < 10; i++) { const t = await st(); if (!t.dialog && !t.busy) break; await press('Space'); }
  // the Gar fight, a level-up win, the sub, an ending and its credits
  const waitIdle = async () => { for (let i = 0; i < 40; i++) { const t = await st(); if (t.inBattle && !t.inBattle.busy) return; await sleep(200); } };
  await page.evaluate(() => window.__game.goToLevel(5)); await sleep(800);
  for (let i = 0; i < 10; i++) { const t = await st(); if (!t.dialog && !t.busy) break; await press('Space'); }
  await page.evaluate(() => { window.__game.set({ friends: { guppy: 3, angel: 3 } }); window.__game.battle('gar', 10); });
  await sleep(1000); await waitIdle(); await shot('gar');
  await press('Digit3'); await sleep(3500); await waitIdle(); await shot('gar-party');
  await page.evaluate(() => window.__game.goToLevel(2)); await sleep(500);
  await page.evaluate(() => { window.__game.set({ level: 4, sub: true, flags: { tutorialDone: true } }); window.__game.battle('guppy', 1); });
  await sleep(1000); await waitIdle();
  { const b = await page.locator('#bDive').boundingBox(); await page.mouse.click(b.x + 20, b.y + 20); }
  await sleep(1800); await waitIdle(); await shot('battle-dive');
  await page.evaluate(() => window.__game.goToLevel(1)); await sleep(500);
  await page.evaluate(() => { window.__game.set({ level: 2, flags: { tutorialDone: true } }); window.__game.battle('angel', 2); });
  await sleep(1000);
  await page.evaluate(() => { const g = window.__game; g.set({}); });
  for (let i = 0; i < 40; i++) { const t = await st(); if (!t.inBattle || t.inBattle.waiting) break; if (!t.inBattle.busy) await press('Digit1'); await sleep(500); }
  await sleep(1500); await shot('battle-won');
  await press('Enter'); await sleep(1500);
  await page.evaluate(() => window.__game.ending('friend')); await sleep(4000); await shot('ending');
  for (let i = 0; i < 30; i++) { const t = await st(); if (t.menus.includes('credits')) break; if (t.dialog) await press('Space'); await sleep(400); }
  await sleep(600); await shot('credits');
  return JSON.stringify(out, null, 1);
}
