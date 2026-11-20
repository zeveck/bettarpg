#!/usr/bin/env bash
# screens-tour.sh <session> <prefix>: run from the folder holding .playwright/.
here="$(cd "$(dirname "$0")" && pwd)"
scan=/home/vscode/.claude/plugins/cache/gamegen/gamegen/2026.11.20/gamegen/scripts/scan-text.js
code="$(grep -v '^//' "$here/screens-tour.js" | sed "s#__PREFIX__#$2#; s#__SCAN__#$scan#")"
playwright-cli -s="$1" run-code "$code" 2>&1 | sed -n '/^### Result/,/^### Ran/p;/^### Error/,/^###/p' | grep -v '^### '
