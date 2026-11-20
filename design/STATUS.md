# Betta Fish RPG

## Requests

1. `/gamegen --remake https://github.com/zeveck/bettarpg --leeway lots --plan-only --share-design --mockups $10`
2. (plan approval) "Proceed with the plan."
3. `/gamegen --plans` (approved: "yes")
4. `/gamegen --continue --budget 50 --gamepad --controls --feedback --art-sheet --publish`

From: https://github.com/zeveck/bettarpg (zeveck's own repo), remake, leeway lots.
Original untouched; this is a new folder and repo with fresh history.

## Settings

- Platform: both (desktop and phones)
- Target: web
- Scope: medium (the original is a 20–45 minute RPG; the remake grows its unfinished story)
- Budget: $50 (from --continue; was $20); mockups used ~$7.70 of it
- Rounds: 2
- Plan only: done; now building (--continue)
- Gamepad: yes
- Controls: changeable
- Feedback: on
- Art sheet: yes (on the plans page)
- Publish: yes, at the end (GAMEGEN_DOMAIN synapticnoise.com, gallery zeveck/synapticnoise, making-of on)
- Share design: page
- 3D: no
- Credit: Rich Conlan (from GAMEGEN_CREDIT)
- ElevenLabs tier: creator (254,000 of 327,035 credits left on 2026-11-20)
- Available: imagegen2 + anim8gen (OpenAI ok), nanogen (Gemini ok), audiogen (ElevenLabs ok), playwright-cli, node, python3 + Pillow
- Decisions agreed with the person: smooth the early difficulty; cheat keys ($ and %) only in a debug mode

## Plans page

- Plans page: yes (approved 2026-11-20). Card at https://synapticnoise.com/plans/ (status Planned); design page https://synapticnoise.com/plans/betta-fish-rpg/; plan files in zeveck/synapticnoise plans/betta-fish-rpg/ (private repo).

## Phases

- [x] Survey of the original (design/ORIGINAL.md)
- [x] Remake plan approved
- [x] Brief: design/BRIEF.md
- [x] Design: first draft written; 6 areas, ~40 new images, 8 songs, 23 sounds
- [x] Design review: 2 rounds, 64 findings, all fixed; battle sim 23/23 (tools/sim_design.py)
- [x] Mock pictures (25 takes, ~$7.70 of $10, est.) + shared design page
  - Design shared: https://claude.ai/artifact/FK33n9bRLkDpRC1eo5WA5s, as a page (slug 73e49756-9d01-4561-b4e1-7e5340ad9326; source design/share/index.html). Private to the person until they share it.
  - At the next --continue: read its comments first; keep the same page up to date. (2026-11-20: read, no comments.)
  - Fix in the build: bigger Gar, darker Murk backdrop, Nymph retake (design: "What the mockups taught").
- — stopped here (--plan-only), 2026-11-19 —
- [x] Art, animation and audio: ~13 images/backdrops, 2 animations, 8 songs, 28 sounds; total spent ≈ $20.5 of $50 (est.)
- [x] Build: all 6 areas, both endings, Peace; controller, Controls screen, Report a bug (hidden until published); routes in design/solutions/; sim 23/23
- [x] Play-test (by the builder): full run title→credits, 0 console errors; my notes: title font B reads like G, small text on desktop, village/Highwater look bare
- [x] Final review: 2 rounds (round 1: 2 must-fixes + 14 should; round 2: confirmed, 9 more small fixes); rice props added (~$0.45). Open: a player who skips the spillway pools can reach the deep Murk at L4
- [ ] Polish pass: reviewer running
- [ ] Wrap up
