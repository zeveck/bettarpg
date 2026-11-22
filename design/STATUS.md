# Betta RPG

## Requests

1. `/gamegen --remake https://github.com/zeveck/bettarpg --leeway lots --plan-only --share-design --mockups $10`
2. (plan approval) "Proceed with the plan."
3. `/gamegen --plans` (approved: "yes")
4. `/gamegen --continue --budget 50 --gamepad --controls --feedback --art-sheet --publish`
5. (at the publish question) "It should still just be "Betta RPG" and not "Betta Fish RPG" on the title, etc."
6. "I'm debating if we should move the old repo to bettarpg-original or something so we can use bettarpg for this. It could still reference original? Not sure."
7. "Rename and proceed with the full publish."
8. "The social image is great but it's weird Bubbles is hidden behind the main fish's tail?"
9. "Do all three of the recommendations." (the three ideas from the publish report: `/gamegen --change add a fishing-net trap mini-boss guarding the Spillway`; `/gamegen --change let befriended fish join your parade in the village and follow you around`; `/gamegen --change add a New Game+ where the fish are tougher and the Gar remembers you`)
10. "Does the game have save slotS? There should be more than just one global save"
11. "publish" (published Change 1 on 2026-11-21)
12. (issues #1 and #2) "Swim Away can become Flare once you're strong enough. Yes, it's probability based on your level and theirs, so it can flip to Flare as soon as it's at least as likely as you swimming away. No rewards, unless we say they dropped some as they fled. Yes on fail. ... Sure, the fish could swim away on the map too."

From: https://github.com/zeveck/bettarpg (zeveck's own repo; renamed to zeveck/bettarpg-original on 2026-11-21 so the remake could take zeveck/bettarpg), remake, leeway lots.
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

## Publishing

- Live: https://bettarpg.synapticnoise.com (HTTPS on), repo https://github.com/zeveck/bettarpg (public); original renamed to zeveck/bettarpg-original (bettarpg.com unchanged)
- Gallery: top of https://synapticnoise.com
- Plans page: card Published, design page https://synapticnoise.com/plans/betta-rpg/design/, art sheet https://synapticnoise.com/plans/betta-rpg/art/ (art sheet manifest: .gamegen/art-sheet/manifest.json)
- Shared design on claude.ai renamed and updated (same link)
- GitHub preview image: to upload (none set)

## Change 1 (2026-11-21): mini-boss, parade, New Game+

- Budget: $20 (default for a change)
- [x] Design + review: 1 round (4 must, 10 should, all fixed; sim 58/58)
- [x] Assets: snarl, snarl_free, torn_net (~$2.25), net_throw + net_rip (~$0.48)
- [x] Build + targeted checks + full replays: saves 21/21 (published save migrates to slot 1), sim 58/58, 13 routes + full game pass, screens at 4 sizes × 4 inputs; parade spacing fixed
- [x] README/screenshots; published 2026-11-21 (deploy 51aa650); art sheet on the plans page updated with the Snarl

## Change 2 (2026-11-22): Flare (#2), clean fight start (#1)

- [x] #1: battle UI shown under the transition; layout fallback; checked at 1280×720 and phone 844×390
- [x] #2: Flare replaces Swim Away when at least as likely; code-drawn fin fan, glow, ripple; fish bolts on the map and drops a Betta Bite; checked in browser (win, fail, map); sim and save tests pass
- [x] Routes replayed (13/13; full-game passed on a re-run after one unlucky loss in the Ditch); published

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
- [x] Polish pass: 10 visible fixes + 13 small ones + lantern at Level 5; verified at all four sizes
- [x] Wrap up: renamed to Betta RPG; social card, GitHub preview, README (making-of), Pages workflow; published 2026-11-21
