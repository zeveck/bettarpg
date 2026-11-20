#!/usr/bin/env bash
# run-routes.sh <session> <route.json>...: replays each route (fresh reload
# first) and prints one line per route: name, done or the failure, and time.
# Run from the folder holding .playwright/ (the project's parent here).
session="$1"; shift
here="$(cd "$(dirname "$0")" && pwd)"
for r in "$@"; do
  playwright-cli -s="$session" run-code "async page => { const c = await page.context().newCDPSession(page); await c.send('Network.setCacheDisabled', {cacheDisabled: true}); await page.reload(); await page.waitForTimeout(2000); }" >/dev/null 2>&1
  start=$(date +%s)
  out="$(timeout 600 "$here/play-route.sh" "$r" "$session")"
  end=$(date +%s)
  errs="$(playwright-cli -s="$session" console error 2>/dev/null | grep -c '\[ERROR\]')"
  if echo "$out" | grep -q '\\"done\\":true'; then res="DONE $(echo "$out" | grep -o '\\"flags\\":{[^}]*}' | head -1)"; else res="FAIL $(echo "$out" | head -c 300)"; fi
  echo "$(basename "$r"): $res ($((end-start))s, console errors: $errs)"
done
echo "ALL FINISHED"
