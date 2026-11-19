# Design review log

## Round 1 (2026-11-19)

Reviewers: Player (10 findings), Builder (10), Art and sound director (10), plus nice-to-haves. Findings in .gamegen/review/r1-*.md.

| Finding | Severity | Outcome |
|---|---|---|
| Befriending locked until L7, no reward | should | Fixed: HBT when Bubble joins (5 MP, ≤80%), stronger at L7; befriend = full EXP, half BB, first-of-kind Kelp Snack |
| Respawn undefined | must | Fixed: refill on area re-entry, every resident kind each visit; Peace = 3 of each of 6 regular kinds; inns/defeat restore MP |
| Gar friendship ending hidden | should | Fixed: friends counter, <5 = "Not enough friends" (free), ≥5 = 4-balloon party meter, hints, rematch after credits |
| Spillway spike | should | Fixed: wide spillway, L5 Cichlids in side pools, no chase; 10% flee kept (keep item) |
| Opening contradictory | should | Fixed: scripted opening (Finn → guppy dodges Attack → Old Stump: Bubble joins, guaranteed first befriend) |
| Area goals/gates undefined | should | Fixed: progression table; drain gate at Murk's far end; goal on pause |
| Phone scaling | should | Fixed: height 360, width 640–800, device-pixel scale rule, text ≥14 CSS px |
| Phone battle overflow | should | Fixed: 4 buttons ≥64 CSS px with sub-rows; Dive button; 1 log line |
| Murk hides enemies | should | Fixed: light 128 px > notice 96 px; eyes + levels outside light |
| Swim feel | should | Fixed: 90 px/s, 0.15 s accel, 0.25 s glide, wall slide, analog |
| Kept sprites' pixel grids | should | Fixed: measured native-pixel table + extraction script; ×1 map / ×2 scenes |
| Budget/audio underestimated | should | Fixed: mockups become final assets; code water/banks/portraits; 6×75 s tracks; ≈$19.43 of $20 |
| Gar smaller than player | should | Fixed: new Gargantuan Gar (~100×40 art px) |
| Title/ending art | should | Fixed: character-free backgrounds; sprites drawn in code |
| Water/banks; camera view | should | Fixed: code water + marching-squares banks; 3/4 view in style line |
| Missing assets | should | Fixed: pickups/icons sheet, Bubble ×2 + dizzy, edge-fish tint, one gate |
| NPCs look like player | should | Fixed: one-line looks, distinct colors, head-crop portraits |
| Missing SFX, loop seams | should | Fixed: 26 SFX + 4 code blips; loop wording + 1 s crossfade |
| Cichlid frame/grid lines | should | Fixed: border clear + largest blob in extraction |
| Gar unbeatable | must | Fixed: enemy stats table; Gar 180 HP, special 30 with warning; sub blocks only special; battle simulator |
| Colour through armor | should | Fixed: baked recolor on red band, hat restored; full metal tint + plume |
| Music memory | should | Fixed: ≤2 decoded tracks |
| Name field vs hotkeys | should | Fixed: real input, game keys off while focused |
| Debug hook | should | Fixed: full hook + simulator |
| Generated tiles / bettahome | should | Fixed: no generated tiles; bettahome as picture/style ref |
| Nice: Backspace, flee Gar, 64 px buttons, background style line | nice | Fixed |

Decision: must-fix findings were present → run round 2.

## Round 2 (2026-11-19)

Reviewers: Player (6 + 1 nice), Builder (9 + nice; ran a battle simulator), Art and sound director (8 + 2 nice). Findings in .gamegen/review/r2-*.md.

| Finding | Severity | Outcome |
|---|---|---|
| Old Stump fight can soft-lock / skip the lesson | must | Fixed: L2 angelfish; bubbleJoined on arrival; angelfish ≥1 HP; no fleeing; first Party! cast free and certain; level-up restores HP/MP |
| Scales out of order block the Spillway | must | Fixed: any order; scene at the bundle with 5/5; Bubble points back; cogs the same |
| Gar targets contradict numbers | should | Fixed: Gar 230 HP; rows reworked; Bubble can draw the special; sim 23/23 |
| Simulator rules unstated; two rows miss | should | Fixed: "Simulator rules" section; edge row full MP; bands adjusted |
| Whole-number scaling leaves bars | should | Fixed: logical size = ⌊device ÷ k⌋ clamped; backdrops 432×200 |
| Items submenu overflows | should | Fixed: 5-button rows; Items row of 4 + Back |
| Routes not reproducible | should | Fixed: seeded world RNG, tick-based movement, waypoint routes |
| New sprite sizes uncontrolled / largest-blob extraction | should | Fixed: target-driven extraction, ±20% tolerance, retake rule |
| Mockup budget on a guessed price | should | Fixed: models pinned; first take priced; 2 takes default; named fallback |
| Befriending pays less | should | Fixed: same EXP and Bites, MP back + 15% HP; sim compares paths |
| No items outside battle | should | Fixed: Items on pause; level-up refill; safe-water refill |
| Long swim back after losing to the Gar | should | Fixed: Gate Spring rest point |
| Highwater→Murk spike | should | Fixed: near half L6, no chase; sim rows added |
| Party! hidden in Spells | should | Fixed: Party! on the main row |
| Mystery never told | should | Fixed: written cause and a 12-line placement table |
| Title backdrop view; bettahome size/colour | should | Fixed: underwater MK1; two-dome crop in an oval |
| Backdrop references, smearing, busy middle | should | Fixed: style refs, grid sampling, calm middle third |
| Dark sprites on dark water | should | Fixed: light band + rim light; checked on the Gar mock screen |
| Buildings too small / night palette | should | Fixed: 110–140 art px, 3 per sheet, shape-only reference |
| Story payoff art missing | should | Fixed: reed cage open/closed, south gate, Mossy + captives recolors |
| Music loop seams; track 2 overplayed | should | Fixed: BPM/metre, bar-trim + crossfade; track 2 150 s |
| Nice: sounds, Gar mock screen, hat scaling, red-glow hint, friends as entities | nice | Fixed |

Decision: both must-fixes fixed and verified (simulator re-run: 23/23 targets met). Rounds limit (2) reached; design converged on the remaining points. I re-read it against the brief's checklist: every item the person asked for and everything the original aimed at is in.
