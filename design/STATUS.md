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
13. `/gamegen --change The rice paddies include lily pads as one of the graphic elements. Let's remove those.`
14. `/gamegen --publish --no-confirm`
15. "For some reason when I approach the a cavern in the lower left of the paddie that says "Too dark to swim in there." I see a black rectangle instead of a proper graphic. We need to fix that and publish."
16. "The pause popup is oddly lower than I'd expect? It seems it should be vertically centered, but it's not, and on my laptop screen it got a scrollbar despite there being plenty of vertical space it could have sized into to avoid. Consider this and how best to fix."
17. "For the initial shallows I sometimes see a fish snack off in the dirt where it's unreachable. Unless there's some clever puzzle, we shouldn't place unreachable powerups like that."
18. `/gamegen --change Everybetta in the villages looks awesome, and they have cool little houses, but, in a typical RPG they would each be situated in their houses and there'd be entry/exit and interiors. We'd want to keep the pixel style and these are betta fish versions of the same old shops, homes, whatever. We want to evoke familiar interiors while feeling fun and fishy. --budget 20 --publish --no-confirm`
19. `/gamegen:gamegen --bugcheck`
20. (during the check) "If you find any bugs, do a /gamegen:gamegen --fix all after."
21. "Actually, if you find any bugs, do a /gamegen:gamegen --fix all --publish --no-confirm after."
22. `/gamegen --change give Minnow's Highwater home its own room picture instead of reusing Elder Finn's --publish --no-confirm`
23. `/gamegen --change give the coral house its own orange room instead of sharing the lilac house's yellow one --publish --no-confirm`
24. "Report an issue that The interior of the The Swishy Solace Inn should have two doors to match its exterior depiction. Make sure we're consistent in general. and then /fix it and publish no-confirm."
25. #3: The Swishy Solace Inn's room should have two doors, like its outside (https://github.com/zeveck/bettarpg/issues/3)
26. "My bettas eye seems to have a transparent pixel?"
27. (while checking) "Please fix all such \"holes\" and --publish --no-confirm"
28. `/gamegen --fix all --publish --no-confirm`
29. #4: Dialogue text problem (https://github.com/zeveck/bettarpg/issues/4)
30. #5: Quest broken (https://github.com/zeveck/bettarpg/issues/5)

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
- Plans page: card Published, design page https://synapticnoise.com/plans/betta-rpg/design/, art sheet https://synapticnoise.com/plans/betta-rpg/art/ (its manifest was lost by 2026-11-25; the built page is in the gallery repo)
- Shared design on claude.ai renamed and updated (same link)

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

## Change 3 (2026-11-22): no lily pads

- [x] Lily pads removed from every map (10 placed by hand in the village, shallows, reedwater and high water, plus the random open-water scatter, now stones and stems) and from the art list; nothing else moved (the scatter draws the same random numbers)
- [x] Art-only check: all 6 areas at 1280×720 and phone 844×390, no console errors; README village, shallows, high water and phone shots retaken; social card and GitHub preview have no lily pads
- [x] Published 2026-11-22 (deploy f6c078e, checked live at desktop and phone); art sheet on the plans page no longer shows the lily pad

## Change 4 (2026-11-23): dark culvert, centred pause, reachable snacks

- [x] Culvert in the Shallows faces the water (flipped); the "too dark" barrier is a stepped darkness spilling from its mouth, not a black box (art only; checked at 1280×720)
- [x] Pause menu centred like every popup (the 5.5em top gap went); the corner HUD hides while paused (Items shows HP/MP); no scroll at 1280×720, 1366×657, 1440×900, 1536×730, 1920×1080, 1024×600, 844×390
- [x] Shallows Betta Bite at 1440,520 was on land: moved to 1370,610; tools/check-pickups.mjs checks every bite, scale and cog is reachable (all pass)
- [x] Replays: area-1, peace, village, ending-friend, ending-fins pass; full-game lost a fight in the Ditch twice (arrives under-levelled after the RNG shift from the moved snack; route to be made sturdier with Change 5's re-recording). Published 2026-11-23

## Change 5 (2026-11-23): houses you can enter

- Budget: $20 (this change)
- [x] Design + one review round (player, builder, art/sound; 5 must, 14 should, all dealt with: REVIEW_LOG.md)
- [x] Assets: 7 rooms (nanogen), door sound and shop bell (audiogen): about $1.20 of $20; indoor music dropped
- [x] Build: 9 rooms, doors (swim up or Talk), villagers inside, 3 townsfish in the village street, looks and hidden bites, Bubble's sign, new game in Finn's house, wake in the inn, room saves, touch layout, debug enter()/rooms()
- [x] Checks: check-reach (all reachable), check-routes, test-saves; 13/13 routes pass (full game from New Game included; snarl-friend reordered to rest after a side-pool fight); hands-on at 1280x720 and phone 844x390; screen tour text-scanned at both sizes
- [x] Fresh bug hunt: no crashes or soft-locks; 7 small findings fixed (room toast on Continue, rescued fish spacing, NG+ gate toast, diagonal door entry, no straight-back-in after leaving, parade at Bubble's door, prototype names in saves); 13/13 routes pass again
- [x] README and screenshots, art sheet (Rooms section) ready
- [x] Published 2026-11-23 (game; the swim tip now sits above talk prompts); art sheet on the plans page has a Rooms section and the door sounds

## Fix #4 and #5 (2026-11-27)

- [x] #4 (the person's own, from the game): dialogue words hopped between lines as they typed (Finn's opening, three times). Cause: the line was typed into a paragraph with "pretty" wrapping, re-planned every few letters. Now the whole line is laid out from the start, the rest hidden, with plain wrapping (pretty lays a half-hidden line out differently on phones). Checked: every letter's position sampled while typing, Finn's five lines at 1280x720, 844x390 and 390x844: none move (the old code moved 20 to 48 letters a line)
- [x] #5 (the person's own, from the game): the Old Stump scene froze for good when you faced left (swimming up from its right). Cause: the scene swam Bubble to a spot behind you while Bubble's own following pulled it to the other side; Bubble hovered between them and the scene never ended. Now Bubble's following waits while a scene moves it (and it simply arrives after 5 s); Bubble comes from behind you and the angelfish from in front, whichever way you face. Checked: froze before, from the right now plays through to the fight; from the left as before
- [x] Fresh review of both fixes: nothing wrong (cosmetic: Bubble or the angelfish can start over land near a bank). Replays area-1-shallows, peace, full-game: all pass, no console errors
- [x] README making-of; published 2026-11-27

## Holes (2026-11-25): see-through pixels in sprites

- [x] Cause: the original game's betta art has its eye glint as a transparent pixel (and the guppy's too); shrinking art to native pixels also left pinholes. A scan found 29 sprites with transparent pixels fully enclosed by colour
- [x] Filled in 25: eye glints #d2cbc2 (the helmet betta's own glint) on the betta at every armor stage, swimming frames and party hats, and the guppy; pinholes in fins and legs take the surrounding colour; the guard post's see-through window is dark like its other window, Kelpie's inn's right window lit orange like the rest, and the market stalls get a dark wood back. Kept open on purpose: the torn net's mesh, the brass cog's axle hole, gaps between rice blades, the crayfish's claw arm. Originals kept in .gamegen/candidates/holes-before/
- [x] Checks: rescan finds only those four; in play at 1280x720 (battle, Highwater with a blue betta) and phone 844x390; no console errors. Art only (collisions don't use the pictures), so no replays
- [x] Art sheet: the 18 affected pictures and the swimming animation redrawn
- [x] Published 2026-11-25

## Fix #3 (2026-11-25): the inn's two doors

- [x] Issue #3 filed (the person's own, from request 24), then fixed: the Swishy Solace Inn's room has two doorways like its two doors outside (nanogen edit, ~$0.13); rooms can have several doorways (doorXs/outsides in maps.js), each building door leads to its own doorway and back. Consistency: every other enterable building shows one door and has one doorway; the guard post's gate now says GUARDS ONLY when you swim up (it isn't a way in); stalls and gates have no doors
- [x] Checks: check-reach, check-routes, test-saves; hands-on: in by each door, out by each doorway, Talk at a door, the gate; phone 844x390; the two routes that use the inn now leave by the left doorway; all 13 routes replayed
- [x] Art sheet: the inn's room updated
- [x] Published 2026-11-25 (#3 closes on this push)

## Change 7 (2026-11-25): Dace's coral room

- Budget: $20 (this change); spent ~$0.27 (one take plus one edit)
- [x] The coral house is Dace's Home (hwHome1; the other house, Little Bream's, is yellow outside, not lilac). It gets its own coral-orange room: a night-watcher's den (a cork board of shadow-and-pipe sketches, a notebook, a spyglass at the porthole, a kelp hammock); new furniture outline and four new things to look at. Little Bream's Home keeps the family room
- [x] Checks: check-reach (all reachable); hands-on at 1280x720 and phone 844x390 (each look spot, bumping into each piece of furniture, leaving by the door); no console errors. No recorded route enters the room, so no replays
- [x] Art sheet: Dace's room added; the shared room is now captioned as Little Bream's Home
- [x] Published 2026-11-25

## Change 6 (2026-11-25): Minnow's own room

- Budget: $20 (this change); spent ~$0.13 (one nanogen take, accepted first time)
- [x] Minnow's Home (hwHome3) gets its own room: a gate fan's den (Highwater map with the Lock House circled, workbench of toy water-wheels, model lock gate, sponge bed); new furniture outline and four new things to look at; Finn's room is no longer reused
- [x] Checks: check-reach (all reachable); hands-on at 1280x720 and phone 844x390 (each look spot, bumping into each piece of furniture, leaving by the door); no console errors. No recorded route enters the room, so no replays (art and rules within one room)
- [x] Art sheet: Minnow's room added to Rooms. The sheet's manifest (.gamegen/art-sheet/manifest.json) is missing, so this was added to the built page directly; rebuild the manifest before any larger art-sheet change
- [x] Published 2026-11-25

## Bug check (2026-11-24)

Fresh player, bug hunter and polish reviewer; desktop 1280x720 and 1920x1080, phone 844x390 (touch) and portrait, pretend controller. No crashes, console errors or soft-locks; text scan clean. Fixing all (request 21), then publishing.

1. Phone: tapping to close a dialog opened the same talk again, endlessly (every phone player, first villager): fixed
2. Phone: the round Talk button always said "Talk", never Enter/Look/Read: fixed
3. Rooms sat in a lighter brown box on a darker surround: fixed
4. Phone: the Gar's friendship balloons spilled out of its box: fixed
5. Controls: backing out right after choosing a key silently rebound the next key pressed: fixed
6. Controller: holding A a little long when choosing a button slot cancelled it: fixed
7. A save the browser refused was silent (Save & quit lost progress): fixed (warning; Save & quit stays in the game)
8. Village inn: swimming up the path between its two arches did nothing: fixed

- [x] Each fix checked in the browser at its size (phone touch, pretend controller, refused storage); a fresh code review of the fixes found two follow-ups (a failed Save & quit now asks to quit anyway; key capture never arms under a confirm), both fixed
- [x] check-reach, check-routes, test-saves pass; 13/13 routes pass, full game included (no console errors); README room screenshots retaken
- [x] Published 2026-11-24

Below the bar: Controls opened over Settings shows Settings' edges; hint under the pause panel; befriend hint overlaps the Gar box; How-to card height jumps; create preview box; Bubble on top of you entering a room; doorway stops on the arch wall; reused room art (hwHome3 = Finn's room); How to play doesn't mention doors; Load slot "Friends 0" wraps; Home/pause during a fade; overlays survive Save & quit.

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
