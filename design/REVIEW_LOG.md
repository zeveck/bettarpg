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

## Change 1 review (2026-11-21): the Snarl, parade, New Game+, save slots

Reviewers: Player (6 findings, 2 must), Builder incl. art and sound (8 findings, 2 must). Findings in .gamegen/review/change1-*.md. Refiner rewrote the Change 1 section; tools/sim_design.py now meets 58/58 targets (33 new rows for the Snarl and NG+).

| Finding | Severity | Outcome |
|---|---|---|
| Snarl HP too high (wall at L4) | must | Fixed: 113 HP at L5, Cichlid damage; L4 wins 97–99% with 2 Kelp, 6–10 turns |
| NG+ wipes the finished save | must | Fixed: NG+ starts in a chosen slot (default empty), double confirm for the source slot |
| Save loader drops NG+/Snarl data | must | Fixed: v:1 kept, new fields defaulted, level clamp 15 in NG+, snarl in KINDS not REGULAR_KINDS |
| NG+ reset list incomplete (wake beside the Gar) | must | Fixed: exact carry/reset/set table |
| Long walk back after losing to the Snarl | should | Fixed: Spillway Spring rest point at the foot of the steps |
| Grenade never taught; can't befriend below L4 | should | Fixed: Bubble and the refusal name it; 4 hits also rip the net |
| Tangle vs turn order | should | Fixed: one rule; Bubble nibbles the net that round instead of nipping |
| NG+ difficulty depends on finishing level | should | Fixed: catch-up kept with expected levels +k; rows for L8 and L10 carries |
| Snarl can be swum around; old saves; goal line; debug starts | should | Fixed: solid gate openIf snarlDone; sanitize sets snarlDone past the steps |
| Routes and runner | should | Fixed in plan: re-record area-3 and full game, 4 new routes, runner Gravel-first vs the net |
| Art/sound and asset rows | should | Fixed: ×3 in battle, net drawn in code, rows E4/T4/S27/S28 |
| NG+ Gar numbers, parade order/areas/trail | should | Fixed: exact per-step numbers; kind rotation; village and Highwater city only; 80-point trail |
| Nice: Peace party doubling; Swim Away in NG+ | nice | Fixed |

## Change 5 (houses you can enter), review round 1 (2026-11-23)

Player, Builder and Art-and-sound reviewers, independently. All findings checked against the code (file:line
given by the reviewers, spot-checked) and the generated rooms.

| Finding | Severity | Outcome |
|---|---|---|
| Room saves reset to the village at room coordinates; migrations misfire; Load says undefined (Builder) | must-fix | Fixed: ROOMS table, sanitize, parent-based migrations, free() check with door fallback, test-saves case |
| Interiors need shapes for collision; `solid` never read; decorations around the rim (Builder) | must-fix | Fixed: all-water shapes, `solid` in solids(), decorations skipped |
| Door rect inside the solid footprint; exit bounce-back; "upward" undefined (Builder, Player) | must-fix | Fixed: head-tested zone below the foot, push up or Talk, landing distances, check-reach asserts |
| Keepers can't be behind counters on a flat backdrop; Pip hidden by the stall (Builder, Art, Player) | must-fix | Fixed: foreground strips cut from the room; stall keepers stay beside stalls |
| Tools/routes/tests assume the old village (Builder) | must-fix | Fixed: check-reach.mjs, check-routes taught rooms, routes and tests updated |
| Paddy Village street empty (Player) | should-fix | Fixed: three townsfish outside |
| Fish Mart has no door, Inn has two (Player, Art) | should-fix | Fixed: shopfront door with doormat; two zones for the Inn |
| Nothing to do in rooms (Player) | should-fix | Fixed: examine spots, a few hidden Betta Bites |
| No outside cue for doors (Player, Art) | should-fix | Fixed: code-drawn doormats, "Enter <room>" prompt |
| Phone stick covers the room (Player) | should-fix | Fixed: room sits right of the stick on touch |
| Music restarts at doors; door sound stacks on the swoosh (Player, Art, Builder) | should-fix | Fixed: area music continues; door sound replaces the swoosh; M1 dropped |
| Room style line/scale (Art) | should-fix | Not changed: rooms made with nanogen as smooth pixel illustration, box-reduced 6.58 px to 384x256 like the backdrops; checked at x1 with the cast |
| Door/doormat left to the generator (Art) | should-fix | Not needed: all six rooms put the doorway and mat at the same bottom-centre spot; exit uses it |
| Floor contrast for yellow fish (Art) | should-fix | Fixed: soft shadow under fish indoors (contact sheet: readable, outlines hold) |
| Rooms must match their building (Art) | should-fix | Done in the prompts (refs + named features); checked by eye |
| Bubble's sign must be code-drawn (Art, Builder) | should-fix | Fixed |
| Highwater homes reuse Bubble's room (Player, Art, Builder) | should-fix | Fixed: R7 family home |
| Banner on every exit (Builder) | should-fix | Fixed: quiet room transitions, room-name toast |
| Bubble passes through furniture (Builder) | should-fix | Fixed |
| Debug hook can't reach rooms (Builder) | should-fix | Fixed |
| Opening toast inside the room (Player) | nice | Fixed |
| Budget estimate (Art) | nice | Restated |
| Dark surround, Swim home in rooms, waking at the inn by default (Builder) | nice | Fixed / accepted (waking in the inn is the RPG norm) |
