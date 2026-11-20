#!/usr/bin/env bash
# play-route.sh <route.json> [session]: replays a recorded route in a running
# playwright-cli session (run from the folder holding .playwright/), with real
# key presses. Prints the end state as JSON (and the run log).
set -uo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
route="$1"; session="${2:-desk}"
code="$(python3 - "$here/route-runner.js" "$route" <<'PY'
import sys, json
lines = [l for l in open(sys.argv[1]).read().split('\n') if not l.startswith('//')]
print('\n'.join(lines).replace('__ROUTE__', json.dumps(json.load(open(sys.argv[2])))))
PY
)"
playwright-cli -s="$session" run-code "$code" > /tmp/play-route-$$.out 2>&1
sed -n '/^### Result/,/^### Ran/p;/^### Error/,/^###/p' /tmp/play-route-$$.out | grep -v '^### ' | head -c 20000
rm -f /tmp/play-route-$$.out
