# Betta Fish RPG

## Requests

1. `/gamegen --remake https://github.com/zeveck/bettarpg --leeway lots --plan-only --share-design --mockups $10`
2. (plan approval) "Proceed with the plan."

From: https://github.com/zeveck/bettarpg (zeveck's own repo), remake, leeway lots.
Original untouched; this is a new folder and repo with fresh history.

## Settings

- Platform: both (desktop and phones)
- Target: web
- Scope: medium (the original is a 20–45 minute RPG; the remake grows its unfinished story)
- Budget: $20 (default); mockups: $10 of it
- Rounds: 2
- Plan only: yes — stop after the shared, reviewed design
- Share design: page
- 3D: no
- Credit: Rich Conlan (from GAMEGEN_CREDIT)
- ElevenLabs tier: creator
- Available: imagegen2 + anim8gen (OpenAI ok), nanogen (Gemini ok), audiogen (ElevenLabs ok), playwright-cli, node, python3 + Pillow
- Decisions agreed with the person: smooth the early difficulty; cheat keys ($ and %) only in a debug mode

## Phases

- [x] Survey of the original (design/ORIGINAL.md)
- [x] Remake plan approved
- [x] Brief: design/BRIEF.md
- [x] Design: first draft written; 6 areas, ~40 new images, 8 songs, 23 sounds
- [x] Design review: 2 rounds, 64 findings, all fixed; battle sim 23/23 (tools/sim_design.py)
- [x] Mock pictures (25 takes, ~$7.70 of $10, est.) + shared design page
  - Design shared: https://claude.ai/artifact/FK33n9bRLkDpRC1eo5WA5s, as a page (slug 73e49756-9d01-4561-b4e1-7e5340ad9326; source design/share/index.html). Private to the person until they share it.
  - At the next --continue: read its comments first; keep the same page up to date.
  - Fix in the build: bigger Gar, darker Murk backdrop, Nymph retake (design: "What the mockups taught").
- — stopped here (--plan-only), 2026-11-19 —
- [ ] Art, animation and audio
- [ ] Build
- [ ] Play-test
- [ ] Final review
- [ ] Polish pass
- [ ] Wrap up
