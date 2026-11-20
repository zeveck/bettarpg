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
  // the village: Finn's opening
  await page.evaluate(() => window.__game.goToLevel(0));
  await sleep(500);
  await page.evaluate(() => window.__game.set({ pos: { x: 270, y: 212 } }));
  await press('Space'); await sleep(900); await shot('village-dialog');
  for (let i = 0; i < 12; i++) { const s = await st(); if (!s.dialog) break; await press('Space'); }
  await shot('village');
  // shop
  await page.evaluate(() => window.__game.set({ pos: { x: 552, y: 202 }, bb: 120, flags: { highwater: true } }));
  await press('Space');
  for (let i = 0; i < 12; i++) { const s = await st(); if (s.menus.includes('shop')) break; await press('Space'); }
  await shot('shop');
  await press('Escape');
  // inn
  await page.evaluate(() => window.__game.set({ pos: { x: 770, y: 214 } }));
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
  return JSON.stringify(out, null, 1);
}
