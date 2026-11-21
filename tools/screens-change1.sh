#!/usr/bin/env bash
# screens-change1.sh <session> <prefix> <WxH> <keyboard|mouse|touch|pad> [phone]
# Run from the folder holding .playwright/ (the project's parent). Needs
# GAMEGEN_SCAN_TEXT (gamegen's scripts/scan-text.js) and URL (default
# http://127.0.0.1:8731/?debug).
here="$(cd "$(dirname "$0")" && pwd)"
scan="${GAMEGEN_SCAN_TEXT:?set GAMEGEN_SCAN_TEXT to the gamegen scripts/scan-text.js}"
url="${URL:-http://127.0.0.1:8731/?debug}"
phone=false; [ "$5" = phone ] && phone=true
code="$(grep -v '^//' "$here/screens-change1.js" | sed "s#__PREFIX__#$2#; s#__SIZE__#$3#; s#__INPUT__#$4#; s#__PHONE__#$phone#; s#__URL__#$url#; s#__SCAN__#$scan#")"
playwright-cli -s="$1" run-code "$code" 2>&1 | sed -n '/^### Result/,/^### Ran/p;/^### Error/,/^###/p' | grep -v '^### '
