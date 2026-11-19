# Betta Fish RPG

*Small fish, big paddies. Find the missing fish, with your fins or your friendship.*

## Pitch

You're a young betta from Paddy Village, and fish keep vanishing from the outer paddies.
Swim freely across a sunlit, terraced rice-paddy world, battle (or befriend) the fish that
get in your way, gear up from helmet to full metal, and follow the trail up to the city on
the next terrace and down into the Sunken Ditch, where something very old is waiting. Every
fight can become a friendship, and the village remembers what you did.

## Settings

- Platform: both (desktop and phones, landscape)
- Target: web (plain HTML and JavaScript, ES modules, no build step)
- Scope: medium. The original is a 20–45 minute RPG; the remake keeps that length but gives
  it a real world, a story that resolves and a second path to winning.
- Budget: $20 for generated art and audio, $10 of it for the shared design's mock pictures
- Tools available: imagegen2 and anim8gen (OpenAI), nanogen (Gemini), audiogen
  (ElevenLabs, Creator plan), playwright-cli, node, python3 + Pillow
- Credit: Rich Conlan
- Remake of github.com/zeveck/bettarpg, leeway **lots**. Survey in `design/ORIGINAL.md`.
- Decisions made on the player's behalf:
  - Keep the name "Betta Fish RPG" (theirs, and their domain).
  - Free swimming on a top-down map replaces the button grid; enemies are **visible** in the
    water instead of random encounters (lets players choose fights, fixes the early spikes).
  - Turn-based battles stay: it's an RPG, and the original's spell set is the heart of it.
  - Bubble becomes a companion who fights beside you.
  - The mystery gets a cause and two endings (fins or friendship).
  - Cheat keys move behind `?debug`.

## The player's fantasy

Being a tiny, brave, slightly fabulous fish who grows from a nobody into the hero of the
paddies, in armor that clanks, with a best friend at your side, and who can end the scariest
fight in the world by throwing a party.

## Core loop

- **10 seconds:** swim through the reeds, spot a fish (its level shows over it), choose:
  dodge it, fight it, or try to make friends. Grab a glinting Betta Bite on the way.
- **1 minute:** a battle: pick Attack / a spell / Swim Away; Bubble acts after you; win EXP
  and Betta Bites, or a new friend wearing a party hat.
- **Session:** finish an area's errand, unlock the next terrace, level up into new armor and
  spells, come home to a village that talks about what you did, buy the submarine, face the Gar.

**The mechanic it lives or dies by:** the fight-or-befriend choice in battle. Both must feel
good, and befriending must be a real strategy, not a joke button.

## Controls

### Desktop

| Action | Keyboard | Mouse |
|---|---|---|
| Swim | Arrows / WASD (8 directions) | — |
| Talk / interact / confirm | Space or Enter (or E) | Click |
| Back / cancel | Esc or Backspace | Click "Back" |
| Pause menu | Esc (outside dialogue/menus) or P | Pause button, top right |
| Battle actions | Arrows + Enter, or the letter underlined on each action (A, B, G, H, S) | Click |
| Go home to the village | Home or H (outside battle; with a confirm) | — |
| Mute | M | Speaker button |

### Touch (phones and tablets, landscape)

| Action | Touch |
|---|---|
| Swim | Floating thumbstick: touch anywhere on the left 40% of the screen; it appears under the thumb (radius 56 px, dead zone 12 px) |
| Talk / interact | Round "Talk" button, bottom right, 72 px, only shown when something is in reach |
| Battle | Big tappable action buttons along the bottom (min 48 px tall), 2 rows on narrow screens |
| Menus and dialogue | Tap to advance; tap a choice |
| Pause / mute | Small buttons top right, inside safe areas |

Controls never cover the betta: the camera keeps the player in the centre-top third on
phones. Landscape only; in portrait, a friendly "Turn your phone sideways" card with the
betta swimming in place.

## Structure and difficulty

The world is a set of connected **terraces** (areas), each one screen-and-a-bit wide map
(about 60×34 tiles of 16 px), scrolling with the player. Danger follows the original's rule:
the further from the village, the darker the water and the tougher the fish. Enemy levels per
area are fixed ranges (no more Level 4 next to the gate).

| # | Area | What's new | Enemies (level) |
|---|---|---|---|
| 0 | **Paddy Village** (hub) | Talk to the 5 villagers, Fish Mart, Swishy Solace Inn. Elder Finn asks you to investigate. | none |
| 1 | **The Shallows** (around the village) | Learning: swim, see fish, first battles, Bubble Blast. Ends when Bubble joins you ("I told you I'd come!"). | Aggressive Guppy (1–2), Territorial Angelfish (2–3) |
| 2 | **Reedwater** (east terrace) | Tall reeds hide fish until close; the first clue: a trail of lost scales leading uphill. Helmet at L3. Gravel Grenade at L4. | Angelfish (3–4), Sneaky Catfish (3–5), Dragonfly Nymph *(new)* (4–5) |
| 3 | **Highwater, the city on the next terrace** (north, up a trickling spillway) | Safe city: a bigger shop (better snacks, the Advanced Armor polish), townsfolk who saw "a long shadow dragging fish down the drain". Errand: get the drain gate key from the Lock-Keeper. | none in the city; Fierce Cichlid (5–6) on the spillway |
| 4 | **The Murk** (south and west edges) | Dark water, low visibility (a light circle around you). Optional edge zones keep the original's **guaranteed Level 10** fish. Happy Balloon Time at L7, Full Metal at L7. | Fierce Cichlid (6–8), Snapping Crayfish *(new)* (6–8), Level-10 edge fish |
| 5 | **The Sunken Ditch** (behind the drain gate) | The missing fish, trapped in an old drainage pool, and the **Gargantuan Gar**. | Prehistoric Gar (boss, 10) |

**The mystery's answer:** the Gar is an ancient fish, stranded when the farmers' new drain
cut its old river off. Lonely and hungry, it has been herding small fish into its pool (they
are scared but alive). Defeat it, and the gate is opened and the fish swim home. Befriend it
(Happy Balloon Time, made possible only if you've befriended at least 5 fish, who come along
and throw the party with you), and the Gar becomes the paddies' gentle guardian.

**The submarine:** Coral sells the Dunkleosteus Submarine for 100 Betta Bites once you've
reached Highwater. In battle it's a toggle ("Dive in the Sub"): it replaces your armor, and,
as in the original, the Gar's GARGANTUAN GAR special does nothing to it. Not required to win.

**Difficulty curve and fairness:**
- Visible enemies, level shown above each one; fish more than 2 levels above you glow red.
- Enemies don't chase in the Shallows; from Reedwater on they notice you within 4 tiles.
- After a battle or fleeing, 2 seconds of safety (fish swim away).
- Losing: you wake at the Inn (or Highwater's inn once visited) with full HP, losing 25% of
  the Betta Bites you carry (original lost some; the number is softened). No game over.
- Fleeing: 75% normally; **10% from Level 5+ enemies** (kept from the original).
- Expected levels: Shallows done at L2–3, Reedwater L4–5, Highwater spillway L5–6, Murk L7–8,
  Gar at L8–10. The Inn is cheap (5 BB) so grinding is never a punishment.
- Total: 30–45 minutes on the main path; edge zones and all-friends add 10–15 more.

## Battles

Side-view battle screen: your betta (and Bubble, once joined) on the left, the enemy on the
right, over a backdrop for the area. Kept from the original, with numbers retuned:

| Action | Cost | Unlock | Effect |
|---|---|---|---|
| Attack | — | L1 | 3–10 + level scaling (original formula) |
| Bubble Blast | 3 MP | L1 | 5–12, never misses |
| Gravel Grenade | 5 MP | L4 | 8–15, hits through the Catfish's dodge |
| Happy Balloon Time | 7 MP | L7 (also in the tutorial once, as a taste, via Bubble) | Befriend chance = 30% + 50% × (1 − enemy HP%) + 5% per friend made, capped at 95%. Bosses need the friends' party (see above). |
| Items | — | — | Kelp Snack (+10 HP), Bubble Water (+8 MP), city treats |
| Swim Away | — | — | 75%, or 10% vs Level 5+ |

- **Bubble** acts after you: a small attack (2–5), or, when you're under 30% HP, a heal
  (+5) once per battle. Bubble can't be defeated (gets "dizzy" for a turn instead).
- **Armor** keeps the original damage reduction (−1/−2/−3 at L3/5/7) and its sprite stages.
- **Enemy specials:** Catfish dodges 25% of physical attacks; Angelfish gets +2 attack under
  50% HP ("territorial!"); Crayfish has a shell (−2 damage) until hit by Gravel Grenade;
  Nymph strikes first.
- **The Gar:** roars instead of attacking on turns **1, 4 and 7** (kept); charges and uses
  "GARGANTUAN GAR" every 3rd non-roar turn (big hit; nothing vs the sub).
- **Befriended fish** wear party hats (original art), swim peacefully in the world, can't be
  fought again, and some move into the village. "PEACE IN THE PADDIES!" when every visible
  enemy kind in the world has been befriended at least 3 times (tracked on the pause screen).

## Villagers who remember

Each NPC has a small set of lines picked by **world flags** (a slimmed version of their
dialogue proposal): first meeting, after Bubble joins, after the first friend, armor stage,
after Highwater, low HP ("You look hurt!"), sub owned, after the Gar (two versions:
defeated / befriended). Lines in a `strings.js` file, keyed by flag, highest-priority match
wins. The original's lines are kept as the first-meeting lines.

Cast: Elder Finn (quest-giver), Shopkeeper Coral (Fish Mart, the sub), Guard Captain Reef
(training tips, worries), Bubble the Brave (companion), Innkeeper Seaweed (rest, 5 BB).
New in Highwater: the Lock-Keeper (an old snail), a city merchant (a shrimp), and a few
townsfolk bettas (recolored).

## Win, lose and progress

- **Win:** resolve the Gar. Ending scene in the village: rescued fish return, a party (hats
  for everyone) for the friendship ending, or a hero's welcome for the fins ending. Credits.
  After the credits you can keep playing (edge zones, collecting friends).
- **Lose a battle:** wake at the inn, lose 25% of carried Betta Bites.
- **Saved** (localStorage, autosave on entering any area, after each battle and at the inn):
  name, color, level, EXP, HP/MP, Betta Bites, items, sub owned, flags, friends, position.
  Title screen offers Continue / New Game (with a confirm if a save exists).

## Screens

- **Title:** title art (the betta in armor before a sunlit paddy), "Betta Fish RPG" in the
  game font, Continue / New Game / Settings. Mute button.
- **Create your betta:** name field (random-name button, kept), 5 color swatches (kept
  colors), the betta preview swimming, "Swim to Village".
- **How to play:** first time only, three short cards (swim, talk, battle) that match the
  device (keys or touch). Reopenable from pause.
- **Exploring HUD:** top left: portrait, name, level, HP and MP bars, Betta Bites. Top right:
  pause and mute. Area name banner when entering an area.
- **Dialogue box:** bottom, portrait on the left, name, typed-out text, tap/Space to continue.
- **Shop and inn:** a list with prices, affordable items bright, unaffordable dim.
- **Battle:** described above; floating damage numbers; a log of the last 3 lines.
- **Pause:** Resume, How to play, Friends (who you've befriended, party-hat portraits),
  Settings (music volume, sound volume, mute), Save & quit to title.
- **Defeat:** short fade, "Rescued by the villagers", wake at the inn.
- **Ending + credits:** two endings as above; credits include "Idea and original game by
  Rich Conlan".
- **Rotate-your-phone** card in portrait.

## Juice

- [must] Fish wiggle as they swim (code: sine tail-sway by skewing the sprite, bob), flip to face direction.
- [must] Bubbles trail from the player when moving; ripples where reeds are touched.
- [must] Battle: hit flash + 3-frame hit pause + small shake; damage numbers pop and fall.
- [must] Level up: burst of golden bubbles, jingle, armor swaps with a flash on 3/5/7.
- [must] Befriend: confetti and balloons rise, party hat drops onto the fish with a bounce.
- [must] Sound on every action and menu move.
- [should] Light shafts drifting through the water (code gradient), sway of rice stalks.
- [should] Screen transitions: ripple wipe between areas and into battles.
- [should] The Gar's roar shakes the screen and dims the light.
- [nice] Fireflies over the water at Highwater.

## Art direction

- **Style line (for every prompt):** "chunky pixel art, bold dark outlines, flat bright
  colors with one shade step, simple top-left lighting, cheerful and slightly cartoonish,
  matching the reference sprite exactly; transparent background; no text."
- **Style anchor:** the original `player_betta.png` (kept). Every new sprite gets it as a
  reference image.
- **Palette:** paddy water blue `#2E86DE` → deep `#1B4F8A` → murk `#0E2A47`; reed green
  `#5B8C3A`; mud `#6B4E2E`; betta red `#E5401F`; party pink `#FF4FA3`, sun gold `#F7C948`.
- **Camera:** top-down overworld (with fish drawn in side view, like the original sprites,
  flipped to face their direction); side-view battle screen.
- **Resolution:** logical 480×270, integer-scaled. Overworld fish ~32×32 px, battle fish
  ~96×96 px, portraits 64×64. Original sprites are 1024 px with faint alpha noise: clean
  the alpha (threshold) and downscale with nearest-neighbour to each size.
- **Consistency:** imagegen2 with the anchor as reference for sprites, portraits and props;
  nanogen for tiles and battle backdrops with the palette and style line; party-hat
  versions of new creatures are edits of their base sprite with the original party hat as
  a second reference.

## Audio direction

- **Music (loops, 60–120 s, instrumental):** Title (gentle, hopeful, marimba and flute);
  Village (cozy, plucky); Shallows/Reedwater exploring (bright, flowing); Highwater city
  (bustling, a bit grander); The Murk (low, mysterious, drips); Battle (bouncy, tense);
  Gar boss (big, ancient, drums); Ending (warm, celebratory).
- **Sound effects (short):** swim swish, menu move, menu select, talk blip, bite pick-up,
  attack hit, miss, Bubble Blast, Gravel Grenade, Happy Balloon Time (party horn + pops),
  befriend success, befriend fail, enemy defeated, player hurt, level up jingle, armor
  clank, buy, inn rest, flee, Gar roar, sub dive, area enter.

## Asset list

Kept assets cost nothing (in `game/assets/original/`).

| ID | What it is | Tool | Size and format | Transparent | Animation | Priority |
|---|---|---|---|---|---|---|
| K1 | Player betta, 4 armor stages + party-hat versions | **keep** (original) | 32/96/64 px PNG, downscaled | yes | code sway | must |
| K2 | Guppy, Angelfish, Catfish, Cichlid, Gar + party hats | **keep** | 32/96 px | yes | code | must |
| K3 | Dunkleosteus sub (+ hat), party hat | **keep** | 32/96 px | yes | code | must |
| K4 | Rice paddy tuft | **keep** | 16/32 px | yes | code sway | must |
| K5 | Paddy Village (bettahome) | **keep / improve**: used as the village centrepiece; new buildings match it | 128 px | yes | — | should |
| T1 | Water tiles: shallow, mid, deep, murk (seamless) | nanogen | 4 × 64 px, downscaled to 16 | no | — | must |
| T2 | Bank/mud/stone edge tiles + transitions | nanogen | 16 px tiles, one sheet | partly | — | must |
| T3 | Props: reeds, lily pads, stones, broken stems, drain gate, spillway | imagegen2 | 8–10 sprites, 16–48 px | yes | — | must |
| B1 | Village buildings: Elder's dwelling, Fish Mart, Guard post, Bubble's home, Swishy Solace Inn | imagegen2 | 5 × 48–64 px | yes | — | must |
| B2 | Highwater city buildings (3) + lock gate | imagegen2 | 4 × 48–64 px | yes | — | should |
| N1 | NPC sprites: Elder Finn, Coral, Reef, Bubble, Seaweed | imagegen2 (anchor ref) | 5 × 32 px | yes | code | must |
| N2 | NPC portraits for dialogue (same 5) + Lock-Keeper snail, shrimp merchant | imagegen2 | 7 × 64 px | yes | — | must |
| N3 | Highwater NPCs: Lock-Keeper snail, shrimp merchant | imagegen2 | 2 × 32 px | yes | — | must |
| E1 | New enemies: Dragonfly Nymph, Snapping Crayfish | imagegen2 | 2 × 96 px | yes | code | must |
| E2 | Party-hat versions of E1 | imagegen2 edit | 2 × 96 px | yes | — | must |
| BG | Battle backdrops: Shallows, Reedwater, Spillway, Murk, Sunken Ditch | nanogen | 5 × 480×270 | no | — | must |
| A1 | Gar lunge (4 frames) | anim8gen | 96 px | yes | yes | nice |
| A2 | Player betta swim (4 frames, base only) | anim8gen | 32 px | yes | yes | nice (code sway first) |
| UI1 | Title art: the betta before a sunlit paddy | nanogen | 480×270 | no | — | must |
| UI2 | Ending scenes (fins, friendship) | nanogen | 2 × 480×270 | no | — | should |
| UI3 | App icon (betta face), favicon/app icon sizes made in code | imagegen2 | 512 px | for maskable margin | — | must |
| UI4 | Social card | code (screenshot of title) | 1200×630 | no | — | must |
| UI5 | Panels, buttons, bars, icons for items | code (pixel font + drawn boxes) | — | — | — | must |
| F1 | Pixel font (open licence, bundled) | download (OFL) | — | — | — | must |
| M1–M8 | Music: title, village, exploring, Highwater, Murk, battle, boss, ending | audiogen music | 60–120 s mp3 | — | loop | must (ending: should) |
| S1–S23 | Sound effects listed above | audiogen sfx | 0.3–2 s mp3 | — | — | must |

About **40 new images**, **2 small animations** (nice to have), **8 music tracks**, **23 sounds**.

## Tech plan

- `game/index.html`, `game/src/*.js` ES modules: `main.js` (loop, scene stack),
  `input.js` (keys, thumbstick, buttons), `audio.js` (WebAudio, unlock on first input, music
  crossfade, mute and volumes), `world.js` (tile maps from JSON in `game/data/maps/`,
  camera, collision), `entities.js` (player, Bubble follower, NPCs, wandering enemies),
  `battle.js` (pure rules: deterministic with a seeded RNG, testable), `dialogue.js`
  (flag-driven lines), `strings.js`, `config.js` (numbers, ported from the original's
  GameConfig), `save.js`, `ui.js` (HUD, menus, dialogue box, text with a bitmap/pixel font).
- Maps: authored as small JSON tile grids (made with a tiny script, not by hand-placing
  every tile), 16 px tiles, collision layer, spawn tables per zone.
- Fixed-step 60 Hz update, rAF draw, integer scaling to the window, letterbox,
  `devicePixelRatio`, safe-area insets.
- Save in localStorage; PWA manifest + service worker for install and offline.
- Debug hook `window.__game` for the play-test (state, teleport, set level, seed RNG,
  run battle turns); cheats `$` and `%` only when the URL has `?debug`.
- Level solutions: a scripted route per area (teleport + battle seeds) proving each area
  and both endings can be finished.

## Cut list (drop first → last)

1. Animations A1/A2 (code sway covers it).
2. Ending scenes UI2 (use the village with confetti instead).
3. Highwater buildings B2 (reuse village buildings recolored).
4. The Murk's light-circle effect (just darker water).
5. Second new enemy (Snapping Crayfish) → reuse Cichlid with a recolor.
6. Music down to 5 tracks (title=village, exploring, Murk, battle, boss).

Never cut: free swimming, fight-or-befriend battles, Bubble as companion, the Gar with both
endings, the kept art.

## Effort and cost estimate

A forecast, not a promise.

- **Effort:** 6 areas (one a hub, one a city), 7 villagers and townsfolk with flag-driven
  dialogue, 7 enemy kinds plus edge variants, 1 boss with two endings, about 12 screens,
  about 40 new images (plus 26 kept), 2 optional animations, 8 music tracks, 23 sounds.
  Riskiest: tuning battle balance across both paths; tile art that seams cleanly at 16 px;
  making new sprites match the kept art's pixel scale; touch controls for both exploring and
  battle menus.
- **Cost:** mock pictures $10 (shared design; the best become real art). Then roughly:
  sprites, props, portraits and buildings ~$6; tiles, backdrops and title/ending art ~$2;
  animations ~$1; music and sounds use ElevenLabs credits (Creator plan), ~$2–3 equivalent.
  Build total ≈ $11–12 beyond the mockups, so **about $21–22 overall: slightly over the
  default $20.** Suggest `--budget 30` when continuing; with $20 the cut list trims
  animations and ending scenes.

## Definition of done

- [ ] Starts with no errors at desktop (1280×720) and phone (844×390 landscape) sizes.
- [ ] Every area can be reached and finished; both endings (fins, friendship) can be reached.
- [ ] Losing a battle and fleeing work; you always wake at an inn and can go on.
- [ ] The game can always go on, even when played wrong (no soft-locks: no Betta Bites,
      no MP, every friend made, sub not bought, Bubble dizzy).
- [ ] Swimming, talking, battles, shop, inn and menus all work by keyboard, mouse and touch.
- [ ] Every screen looks finished at every targeted size, from the first load.
- [ ] Music and sound play after the first tap or key, and mute and volumes work.
- [ ] Progress is saved and restored (Continue works after reload, mid-area).
- [ ] Kept quirks still there: Gar roars on turns 1/4/7, Level-10 edge zones, 10% flee vs
      L5+, Home/H to go home, party hats on friends, color kept through armor.
- [ ] Cheats only with `?debug`.
- [ ] Installs as an app and works offline.
