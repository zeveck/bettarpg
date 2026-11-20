# Betta Fish RPG

*Small fish, big paddies. Find the missing fish, with your fins or your friendship.*

## Pitch

You're a young betta from Paddy Village, and fish keep vanishing from the outer paddies.
Swim freely across a sunlit, terraced rice-paddy world, battle (or befriend) the fish that
get in your way, gear up from helmet to full metal, and follow a trail of strange scales up
to the city on the next terrace and down into the Sunken Ditch, where something very old and
very lonely is waiting. Every fight can become a friendship, and the village remembers what
you did.

## Settings

- Platform: both (desktop and phones, landscape)
- Target: web (plain HTML and JavaScript, ES modules, no build step)
- Scope: medium. The original is a 20–45 minute RPG; the remake keeps that length but gives
  it a real world, a story that resolves and a second path to winning.
- Budget: $20 for generated art and audio: $10 for the shared design's mock pictures (made
  as final game assets, so they're not paid for twice) and ~$10 for the build. `--budget 30`
  is an optional upgrade that restores the items marked *(budget 30)* below.
- Tools available: imagegen2 and anim8gen (OpenAI), nanogen (Gemini), audiogen
  (ElevenLabs, Creator plan), playwright-cli, node, python3 + Pillow (no numpy)
- Credit: Rich Conlan
- Remake of github.com/zeveck/bettarpg, leeway **lots**. Survey in `design/ORIGINAL.md`.
- Decisions made on the player's behalf:
  - Keep the name "Betta Fish RPG" (theirs, and their domain).
  - Free swimming on a top-down map replaces the button grid; enemies are **visible** in the
    water instead of random encounters (players choose their fights; fixes the early spikes).
  - Turn-based battles stay: it's an RPG, and the original's spell set is the heart of it.
  - Bubble becomes a companion who fights beside you.
  - The mystery gets a cause (a lonely, ancient Gar) and two endings (fins or friendship).
  - Happy Balloon Time arrives early (a weaker version when Bubble teaches it) and grows at
    L7, and it gets its own **Party!** button, so befriending is a real path from the start.
  - The submarine blocks the Gar's special and is the best armor, but no longer makes you
    invulnerable to everything (100 Betta Bites shouldn't end the game's challenge).
  - Cheat keys move behind `?debug`.

**Kept quirks (never cut):** the Gar roars on turns 1, 4 and 7; Level-10 edge zones; 10%
flee from Level 5+ enemies; Home/H returns to the village; party hats on friends (and you);
your chosen color kept through every armor stage; all the original art.

## The player's fantasy

Being a tiny, brave, slightly fabulous fish who grows from a nobody into the hero of the
paddies, in armor that clanks, with a best friend at your side, and who can end the scariest
fight in the world by throwing a party.

## Core loop

- **10 seconds:** swim through the reeds, spot a fish (its level shows over it), choose:
  dodge it, fight it, or try to make friends. Grab a glinting Betta Bite on the way.
- **1 minute:** a battle: Attack / a spell / **Party!** / an item / Swim Away; Bubble acts
  after you; win EXP and Betta Bites, or a new friend in a party hat (same EXP and Bites, and
  the party cheers you up: your 5 MP back and a little HP).
- **Session:** finish an area's errand, unlock the next terrace, level up into new armor and
  spells, come home to a village that talks about what you did, buy the submarine, face the Gar.

**The mechanic it lives or dies by:** the fight-or-befriend choice in battle. Both must feel
good, and befriending must be a real strategy, not a joke button. The simulator checks that
befriending costs no more HP or MP than fighting (see Tuning targets).

## Controls

### Desktop

| Action | Keyboard | Mouse |
|---|---|---|
| Swim | Arrows / WASD (8 directions) | — |
| Talk / interact / confirm | Space, Enter or E | Click |
| Back / cancel | Esc, or Backspace (never while typing in the name field) | Click "Back" |
| Pause menu | Esc (when nothing is open) or P | Pause button, top right |
| Battle menu | Arrows / WASD to move, Enter or Space to choose, 1–5 picks a button in the current row, Esc goes back a row | Click |
| Go home to the village | Home or H (outside battle and cutscenes; asks to confirm) | — |
| Mute | M | Speaker button |

### Touch (phones and tablets, landscape)

| Action | Touch |
|---|---|
| Swim | Floating analog thumbstick: touch anywhere on the left 40% of the screen; it appears under the thumb (radius 56 CSS px, dead zone 10 px; speed follows how far you push) |
| Talk / interact | Round "Talk" button, bottom right, 72 CSS px, only shown when something is in reach |
| Battle | One row of 5 buttons along the bottom, each at least 64 CSS px tall (see Battles) |
| Menus and dialogue | Tap to advance; tap a choice (all at least 48 CSS px tall, 64 for battle) |
| Pause / mute / home | 44 CSS px buttons top right, inside safe areas |

Controls never cover the betta: the camera keeps the player in the centre-upper area on
phones. Landscape only; in portrait, a friendly "Turn your phone sideways" card with the
betta swimming in place.

### Controller (PS5 DualSense, Xbox, Switch Pro and others)

Plug in, press any button, and play the whole game with it, title to credits. Prompts show
the controller last used (✕ ○ □ △ drawn as shapes for PlayStation; A B X Y for Xbox and
others), and switch back to keys the moment a key is pressed. Works best in Chrome or Edge.

| Action | Gamepad (by position; PlayStation / Xbox) |
|---|---|
| Swim | Left stick (analog, dead zone 0.25) or d-pad |
| Talk / interact / confirm | Bottom: ✕ / A |
| Back / cancel | Right: ○ / B |
| Open Items (pause menu, Items page) | Left: □ / X |
| Go home to the village (asks to confirm) | Top: △ / Y |
| Pause menu | Options / Menu (button 9) |
| Battle menu | Stick or d-pad moves along the row, ✕ chooses, ○ goes back a row; L1/R1 jump to the row's first/last button |
| Every menu (title, create, shop, inn, pause, settings, Controls, credits) | Stick or d-pad moves focus (repeat after 350 ms, every 120 ms), ✕ chooses, ○ back; focused button has a bright gold outline |
| Name entry | ✕ on "Random name" picks one; typing still needs a keyboard or the phone's own keyboard |

- Title screen: "Press any key or button" until a controller has been seen.
- Unplugged mid-game: pause with "Controller disconnected" until it's back or a key is pressed.
- Rumble (Settings → Vibration, on by default): 120 ms on taking a hit, a longer soft one on
  the Gar's roar and on level-up. Never constant.

### Changeable controls (Controls screen, from Settings)

Players can rebind each action's keys (up to two) and its controller button, using the
bundled `controls.js`. **The defaults are exactly the tables above.**

| Action | Default keys | Default button | Changeable |
|---|---|---|---|
| Swim up | ↑, W | d-pad up (stick always works) | yes |
| Swim down | ↓, S | d-pad down | yes |
| Swim left | ←, A | d-pad left | yes |
| Swim right | →, D | d-pad right | yes |
| Talk / interact | Space, E | ✕ (0) | yes |
| Items | I | □ (2) | yes |
| Go home | H, Home | △ (3) | yes |
| Mute | M | — | yes |
| Pause | Escape, P | Options (9) | **fixed** |

- Menus aren't actions: they always use Enter/Space/✕ to confirm and Escape/Backspace/○ to
  go back, plus 1–5 in battle rows, so a player can never lock themselves out.
- Everything that names a control (hints, How to play, the battle prompts, the Talk hint)
  asks one label function, so it shows the player's current keys or buttons.
- The Controls screen lists "Ctrl+Shift+F: report a bug" (fixed, not an action) and has
  "Reset to defaults" (asks first). Touch controls aren't remapped.
- New key: **I** opens Items from anywhere outside battle (the same page as pause → Items).

### Report a bug (`--feedback on`)

- **"Report a bug"** in the pause menu and in Settings, drawn like the other buttons, usable
  by mouse, touch, keys and controller. It opens the bundled gh-feedback form (dark theme,
  sun-gold accent `#F7C948`, the game's pixel font) with a picture of the moment; the player
  finishes the report on GitHub (needs a GitHub account; the form says so).
- **Ctrl+Shift+F** opens it from anywhere, even if the game is stuck. The game doesn't use
  Ctrl or Shift, so the letter stays F.
- It appears only once the game is published to a public repo (the repo name is filled in
  then). Reports become issues there; `/gamegen --fix #N` fixes them.
- The report's state: area, position, level, HP/MP, Betta Bites, flags, friends count,
  current goal, in battle or not (and against whom), last input (keyboard/touch/gamepad).

### Swimming feel

- Top speed 90 logical px/s; reaches it in 0.15 s, glides to a stop in 0.25 s; diagonals
  normalised. The betta tilts slightly toward its direction and flips to face left/right.
- Collision: a 10 px circle at the betta's head against the map's collision mask; you slide
  along banks instead of sticking.
- No dash (the maps are sized so it isn't needed).

## Structure and difficulty

The world is a set of connected **areas**, each a scrolling map of 16 px tiles (village
64×40 tiles; others about 96×56, roughly 2.5 screens each way). Danger follows the original's
rule: the further from the village, the darker the water and the tougher the fish. Enemy
levels per area are fixed ranges (no more Level-4 fish next to the gate).

Geography: the village sits in the middle of the Shallows. Reedwater is east, its north end
climbs the Spillway up to Highwater. The Murk is southwest, through a dark culvert; the
Sunken Ditch lies behind the drain gate at the Murk's far end.

| # | Area | What's new | Enemies (level) |
|---|---|---|---|
| 0 | **Paddy Village** (hub) | 5 villagers, Fish Mart, Swishy Solace Inn. Elder Finn sends you out. | none |
| 1 | **The Shallows** | Swim, see fish, first battles, Bubble Blast; Bubble joins and teaches Happy Balloon Time. | Aggressive Guppy (1–2); Territorial Angelfish (2), far half only |
| 2 | **Reedwater** (east) | Tall reeds hide fish until close; a trail of 5 strange scales leads uphill. Helmet at L3, Gravel Grenade at L4. | Angelfish (3–4), Sneaky Catfish (3–5), Dragonfly Nymph *(new)* (4–5) |
| 3 | **The Spillway and Highwater, the city on the next terrace** | A wide spillway with side pools, then a safe city: bigger shop, an inn, townsfolk with rumors of the shadow, the Lock-Keeper's errand. Advanced Armor at L5. | Fierce Cichlid (5) in the Spillway's side pools only; none in the city |
| 4 | **The Murk** (southwest) | Dark water lit by your lantern; 3 lost brass cogs to find; optional edge zones with the original's **guaranteed Level-10** fish. Full Metal and big Happy Balloon Time at L7. | **Near half** (culvert to the old root wall): Cichlid and Snapping Crayfish *(new)* L6, never chase. **Deep half:** L7–8, chase. Edge zones: Level-10 edge fish |
| 5 | **The Sunken Ditch** (behind the drain gate) | The Gate Spring (a free rest point), the missing fish caged in the old drainage pool, and the **Gargantuan Gar**. | Prehistoric Gar (boss, 10) only |

### Progression (who opens what)

Flags are saved; nothing on the main path can be missed, used up or taken in the wrong order.

| Area | Entry needs (flag) | What blocks it before | Goal and completion trigger | Sets | Elder Finn's pointer after |
|---|---|---|---|---|---|
| Village | start | — | Elder Finn's opening talk | `metFinn` | "Swim to the Old Stump at the far end of the Shallows. Mossy was last seen there." |
| Shallows | `metFinn` (the south gate opens as he finishes) | — | Reach the Old Stump: a strange scale, Bubble catches up (`bubbleJoined` is set the moment Bubble arrives), then the scripted Angelfish fight (see Opening); befriending it sets `stumpDone` | `bubbleJoined`, `hbtLearned`, `stumpDone` | "Captain Reef will open the reed gate east. Follow where that scale leads." |
| Reedwater | `stumpDone` | Guard Captain Reef at the east reed gate: before Bubble, "Not alone, little one. Come back with a friend."; with Bubble but before `stumpDone`, "That angelfish at the Old Stump won't let anyone pass in peace. Settle it first." | Pick up all 5 scales, **in any order**; then the straw-bundle scene plays at the Spillway's foot (rules below) | `trailFound` | "Up the spillway lies Highwater. Ask them about the shadow." |
| Spillway, Highwater | `trailFound` | Fallen straw bundle across the Spillway steps | Talk to the Lock-Keeper: he gives the drain-gate key and a glow-moss lantern, and asks for the gate's 3 lost cogs | `highwater`, `lantern` | "The Lock-Keeper's lantern will light the Murk. Find those three cogs." |
| Murk | `lantern` | The culvert in the Shallows' southwest: "Too dark to swim in there." | Pick up 3 cogs **in any order** (fixed spots, none in the edge zones), then use the drain gate at the Murk's far end | `gateOpen` | "The gate is open. Whatever is down there... bring our fish home. The old tales say a party of five friends can soften any heart." |
| Sunken Ditch | `gateOpen` | The drain gate (with fewer than 3 cogs: "The gate needs 3 cogs (2/3).") | Resolve the Gar (defeat or befriend) | `garDefeated` or `garFriend` | Ending lines (two versions) |

- **The scales (any order).** The 5 scales lie along one winding trail, but each counts
  wherever it's picked up (pause shows "Scales 3/5"). When the count reaches 5:
  - within 64 px of the straw bundle, the scene plays at once (Bubble shoves the bundle off
    the steps, `trailFound` is set);
  - anywhere else, Bubble says "That's all five! They all point uphill, to the Spillway's
    foot," the goal line changes to "Take the scales to the straw bundle at the Spillway's
    foot," and the scene plays the next time you swim within 64 px of the bundle.
  - Before 5, touching the bundle: Bubble: "Too heavy for us... Those scales lead somewhere.
    (3/5)". The scene can't play early and can't be missed.
- The Old Stump's scale is the *first clue*, not one of the 5.
- The pause screen shows the current goal in one line (the same text as Finn's pointer, or
  the scale/cog override above).
- Coral starts selling the submarine once `highwater` is set.
- Home/H takes you back to the village from anywhere outside battle and cutscenes.
- After `bubbleJoined`, Bubble follows you everywhere (a small follower that trails your
  path) and is in every battle. Bubble can't be lost or knocked out.

### The opening (first two minutes)

1. Title → New Game → Create your betta (name, color) → "Swim to Village".
2. Fade in beside Elder Finn's dwelling, facing Finn. He talks straight away (his original
   first three lines, then the Old Stump goal). A hint bubble shows how to swim (keys or
   "drag on the left", matching the device). The south gate opens.
3. Just outside the gate, a lone Level-1 Guppy idles in the channel (it doesn't wander or
   chase). Touching it starts the tutorial battle: your first Attack is dodged ("The guppy
   darts aside!"), and a hint lights up Bubble Blast: "Quick fish! Bubble Blast never misses
   (3 MP)." From then on the battle is normal.
4. The Shallows: guppies near the village, a few Level-2 angelfish in the far half. Villagers
   and the Inn are a short swim back; your first rest at each inn is free. The first time a
   red-glowing fish comes on screen, a hint: "Fish glowing red are much stronger than you:
   swim around them."
5. **The Old Stump** (scripted, can't be skipped or broken):
   - You find a huge, dark, ancient-looking scale (Bubble: "That's no betta scale. It's as big
     as my head!"). Bubble swims up: "I told you I'd come!" `bubbleJoined` is set now, so
     Bubble stays with you whatever happens next.
   - A **Level-2 Territorial Angelfish** charges in: a battle with Bubble beside you.
     Swim Away is shown dimmed ("Bubble: We can't leave now!"). The angelfish can't drop
     below 1 HP in this fight, from your hits or Bubble's ("The angelfish is too stubborn to
     give up!").
   - When the angelfish drops under half HP, or on your 3rd turn, whichever comes first,
     Bubble says "Fighting isn't the only way. Try this!", `hbtLearned` is set and the
     **Party!** button lights up. This first cast **costs 0 MP and always works**, so an
     empty MP bar can't block it. Until you press it, Bubble repeats the hint each turn.
   - Your first friend gets its party hat; `stumpDone` is set; Reef opens the east gate.
   - If you lose (only possible by ignoring Party! for many turns), you wake at the inn;
     Bubble is still with you, `hbtLearned` stays, and the angelfish waits at the stump.

### The mystery (what happened, and the lines that tell it)

**The cause.** The Gar is the last fish of the old river, older than the terraces. When the
paddies were built, it was shut into the drainage pool beneath them, alone, for a hundred
years. Last spring's flood burst the pool's old outflow pipe open (a current far too strong
for small fish, not for a Gar) and shook the drain gate's three cogs loose into the Murk.
Since then the Gar slips up the pipe at night, "when the rice stalks sway," and carries fish
home to its pool, where it pens them in a reed cage. It doesn't eat them. It wants company.
That's why a party of friends can reach it, and why the fins ending is a little sad.

| Where | Who | Line |
|---|---|---|
| Opening | Elder Finn | (original lines) + "Mossy was last seen at the Old Stump." |
| Old Stump | Bubble | "That's no betta scale. It's as big as my head!" |
| Reedwater, 3rd scale | Bubble | "They all point uphill. Whatever dropped these was huge... and old." |
| Highwater | Townsfolk 1 | "A long shadow comes down the old outflow pipe at night, when the rice stalks sway. Takes a fish and goes back the way it came." |
| Highwater | Townsfolk 2 (rumor) | "My gran said a fish older than the terraces was shut in under the paddies when they were built. Just a story... isn't it?" |
| Highwater | Lock-Keeper Whorl | "The spring flood jammed my drain gate (shook its three cogs right out into the Murk) and burst the old outflow pipe below it. Whatever's taking your fish uses that pipe. Too strong for little fins: you'll need the gate." |
| The Murk | (scene) | The first time you reach the deep half, a long shadow (the original Gar sprite) slides into the pipe mouth. Bubble: "Did you SEE that?!" |
| Sunken Ditch, before the fight | Mossy (in the reed cage) | "It doesn't eat us. It brings us here and just... watches us. It hums at night. I think it's lonely." |
| Gar battle start | The Gar (roar text) | "...MINE. NO MORE... ALONE." |
| Fins ending | Elder Finn | "A hundred years shut under our paddies, alone. No wonder it wanted company. Maybe someday someone will visit it." |
| Friendship ending | Elder Finn | "Sealed under the terraces for a hundred years... Well, old fish, you've got a village now." Whorl fits the pipe with a door the Gar can open from inside, so it visits. |
| Post-game | The Gar (friend) | "PARTY... AGAIN?" / (sulking, after fins) "...ALONE AGAIN." |

### Difficulty and fairness

- Visible enemies, level shown above each one; fish more than 2 levels above you glow red.
- Shallows, Spillway and the Murk's near half: fish never chase. In Reedwater and the Murk's
  deep half they notice you within 96 px, chase at 70% of your speed for up to 3 s, then
  lose interest.
- Reeds hide Reedwater fish until you're within 80 px (the reeds rustle where one hides); a
  hidden fish can't notice you.
- **The Murk:** your lantern lights a circle of 128 px radius, larger than the 96 px notice
  range, so you always see a fish before it sees you. Outside the light, fish show as two
  glinting eyes with their level tag. The near half (Level 6, no chasing) is the on-ramp from
  Highwater's L5–6; the deep half is L7–8.
- After a battle or fleeing, 2 seconds of safety (nearby fish swim away).
- **Level-up** restores HP and MP to full.
- **Safe water:** in the village and Highwater (no fish), HP and MP refill 1 point every 2 s.
- **Items anywhere:** the pause screen has Items, so you can eat or drink between fights.
- **Losing:** you wake at your last rest point (the village inn, the Highwater inn, or the
  Gate Spring) with full HP and MP, having lost 25% of the Betta Bites you carry. No game
  over.
- **The Gate Spring:** a bubbling spring just inside the Sunken Ditch, past the drain gate.
  Once `gateOpen` is set, touching it is a free full rest and makes it your wake-up point, so
  a lost Gar fight never means swimming back through the Murk.
- Fleeing: 75% normally; **10% from Level 5+ enemies** (kept). This includes the Gar.
- Expected levels: Shallows done at L2–3, Reedwater L4–5, Spillway/Highwater L5–6, Murk
  L6–8, Gar at L8–10. Inn rest 5 BB, so grinding is never a punishment.
- Total: 30–45 minutes on the main path; edge zones and Peace in the Paddies add 10–20 more.

### Respawning and rewards

- Defeated fish are gone until you leave the area and come back; then every spawn point
  refills. **Befriended fish are separate entities**, not spawn points: they swim calmly in
  their party hats (up to 6 shown per area, the rest still count), can't be fought, and can
  be talked to for a cheerful line or a tip. Spawn points always refill with unfriended fish.
- Each area's spawn table includes every kind that lives there at least once per visit, so
  there are always fish to fight or befriend: grinding and Peace in the Paddies can never run
  out.
- **Defeat** gives EXP and Betta Bites.
- **Befriending** gives the **same EXP and the same Betta Bites**, and the party cheers you
  up at once: **the 5 MP back and +15% of your max HP** ("Your new friend cheers you up!").
  The first friend of each kind also gives a Kelp Snack. A failed cast pops sadly; the MP is
  spent and nothing else changes.
- **Peace in the Paddies:** befriend at least 3 of each of the 6 regular kinds (Guppy,
  Angelfish, Catfish, Nymph, Cichlid, Crayfish). Edge fish count toward their kind but
  aren't needed; the Gar isn't part of it. Progress shows on the pause screen's Friends
  page. Reward: the "PEACE IN THE PADDIES!" banner, a party in the village square (friends
  in hats), and new lines from every villager.

## Battles

Side-view battle screen: your betta (and Bubble, once joined) on the left, the enemy on the
right, over a backdrop for the area (Shallows, Reedwater, Spillway, Murk, Gar's pool;
Highwater has no battles).

### Player numbers

| Stat | Rule |
|---|---|
| Level | 1–10. EXP to next level = 100 × 1.2^(L−1) (original): 100, 120, 144, 173, 207, 249, 299, 358, 430. Level-up restores HP and MP |
| Max HP | 20 + 6 per level after 1 (20 … 62 at L8, 74 at L10; original was +5) |
| Max MP | 10 + 2 per level after 1 (original): 10 … 24 at L8 |
| Armor | Helmet L3 −1, Advanced L5 −2, Full Metal L7 −3 to every hit (original); sprite stages kept |
| Submarine | **Replaces** armor with −4 to every hit (not added to it), and the GARGANTUAN GAR does nothing to it |
| Damage floor | Every enemy hit that connects does at least 1 after armor (the sub against the special: 0). Your hits on the shelled Crayfish: −2, at least 1 |

| Action | Cost | From | Effect |
|---|---|---|---|
| Attack | — | start | 3–10 + ⌊1.5 × (L−1)⌋; 90% hit; the Catfish dodges 25% |
| Bubble Blast | 3 MP | start | 5–12 + ⌊1.5 × (L−1)⌋; never misses |
| Gravel Grenade | 5 MP | L4 | 8–15 + ⌊1.5 × (L−1)⌋; never misses, ignores the Catfish's dodge, breaks the Crayfish's shell |
| **Party!** (Happy Balloon Time) | 5 MP | `hbtLearned` (Old Stump) | Befriend chance 25% + 40% × (1 − enemy HP%) + 3% per friend, max 80%. Success: the 5 MP back and +15% max HP |
| Party! (big) | 5 MP | L7 ("Your balloons got bigger!") | 35% + 50% × (1 − enemy HP%) + 5% per friend, max 95%. Edge fish: half chance |
| Items | — | — | Kelp Snack +10 HP (3 BB), Bubble Water +8 MP (2 BB); Highwater: Seed Cake +30 HP (8 BB), Fizzy Water +15 MP (6 BB). Carry up to 9 of each. Also usable from the pause screen |
| Dive / Surface (sub) | your turn | sub owned | Swap into or out of the Dunkleosteus Submarine |
| Swim Away | — | — | 75%, or 10% vs Level 5+ (kept) |

- **Bubble** acts after you: a nip for 2–5 + ⌊L/2⌋, or, once per battle when you're under
  30% HP, a heal of ⌊15% of your max HP⌋. **20% of all enemy attacks, the Gar's special
  included, go at Bubble instead of you:** Bubble takes no damage but is dizzy and skips its
  next action (stars circle Bubble's head).
- Rounding: enemy HP uses `Math.round` (half up); every other fraction (damage growth,
  Bubble's bonus and heal, the edge multiplier) rounds down.

### Enemies

Enemy HP = base × (1 + 0.55 × level); damage = the range + ⌊growth × (level − 1)⌋, 90% hit;
EXP = base EXP × (1 + 0.2 × level) (original); Betta Bites = 1–5 + level × (1–2) (original).

| Enemy | Base HP | Damage (L1) | Growth | Base EXP | Special | Example stats |
|---|---|---|---|---|---|---|
| Aggressive Guppy | 8 | 2–3 | 0.8 | 15 | — | L1: 12 HP, 2–3 dmg, 18 EXP |
| Territorial Angelfish | 12 | 2–3 | 1.0 | 25 | +2 damage under 50% HP ("Territorial!") | L2: 25 HP, 3–4, 35 EXP · L4: 38 HP, 5–6 |
| Sneaky Catfish | 15 | 2–4 | 1.2 | 35 | Dodges 25% of Attacks | L4: 48 HP, 5–7, 63 EXP |
| Dragonfly Nymph *(new)* | 14 | 3–4 | 1.2 | 40 | Strikes first | L5: 52 HP, 7–8, 80 EXP |
| Fierce Cichlid | 18 | 3–5 | 1.5 | 45 | — | L5: 68 HP, 9–11, 90 EXP · L6: 77 HP, 10–12 · L8: 97 HP, 13–15 |
| Snapping Crayfish *(new)* | 20 | 3–5 | 1.4 | 50 | Shell: −2 damage taken until hit by Gravel Grenade | L6: 86 HP, 10–12 · L7: 97 HP, 11–13, 120 EXP |
| Edge fish (any Murk kind) | ×1.25 HP and damage (rounded down) | | | ×1.5 EXP and Bites | Always Level 10 (kept); violet tint and slow pulsing glow | Cichlid: 146 HP, 20–22 |

### The Gar

- Prehistoric Gar, Level 10: **230 HP**, bite 8–12 (90% hit), 600 EXP, 50 Betta Bites.
- Turn pattern: it **roars instead of attacking on its turns 1, 4 and 7** (kept; the screen
  shakes). On its turns 3, 6, 9, 12… it uses **GARGANTUAN GAR** for 30 damage (armor
  applies; nothing to the sub; Bubble draws it 20% of the time, like any attack). It always
  warns the turn before: "⚡ The Prehistoric Gar channels ancient power! ⚡" (the original's
  line) with a glow, so you can heal, dive into the sub, or finish it. Every other turn it
  bites.
- **Fins ending:** bring its HP to 0.
- **Friendship ending:** Party! works on the Gar only with **at least 5 friends**. With fewer,
  the button shows "Not enough friends for this party! (Friends 3/5)" and no MP or turn is
  spent. With 5+, the first Party! brings your friends bursting in, **costs no MP**, and a
  **party meter** appears (4 balloons): each Party! fills 1 balloon (2 with 10+ friends); each
  GARGANTUAN GAR that lands **on you** pops one (not when Bubble draws it, not in the sub). A
  full meter befriends the Gar. The friends counter is on the pause screen and in this
  battle's HUD; Finn and Bubble hint at the rule once `gateOpen` is set.
- With full MP (the Gate Spring is right there) the party needs 4 paid casts (20 MP; an L8
  betta has 24). If MP runs short mid-party, Bubble says "We're out of fizz! A Bubble Water,
  quick!"; without one the fight goes on as a normal fight, ending in a win or a loss you
  can see coming (the simulator shows a half-MP, no-item party at L8 never fills the meter).
- You can try to flee (10%). Losing wakes you at the Gate Spring; the Gar is back to full HP.
- After the credits the Gar stays in its pool: as a friend (in its party hat) to talk to, or,
  after the fins ending, sulking and ready for a rematch, which can still end in friendship.

### Simulator rules

`tools/sim_design.py` (Python, in the repo now) runs every row below 4,000 times with fixed
seeds and exits 1 if a target is missed. At build time `tools/sim-battles.mjs` (node,
importing `battle.js` and `config.js`) must reproduce the same table within ±3 points. Rules:

- **Bubble** is in every fight after `bubbleJoined` (rows marked "B"); rows without B are the
  pre-Bubble Shallows fights only. There is no "Gar without Bubble" case in the game.
- **Start:** full HP; MP as listed per row: *full* after a rest (the Gar, after the Gate
  Spring; the Murk's first fights, after Highwater's inn; edge zones), *half* mid-outing.
- **Player policy**, each turn, first that applies: (1) eat an HP item (Seed Cake first) if
  HP ≤ 35% or a warned GARGANTUAN GAR would bring HP to 0; (2) in a Gar party: Party! if it's
  free or MP ≥ 5, else drink an MP item, else Attack; (3) when befriending: Party! once the
  enemy is at ≤ 50% HP (or low enough that the next hit might kill it), never spending the
  last 5 MP on a spell; (4) Gravel Grenade (L4+, MP ≥ 5, Catfish, shelled Crayfish or enemy
  HP > 12) > Bubble Blast (MP ≥ 3) > Attack.
- **Armor vs sub:** the sub replaces armor (−4), not stacked. **Minimum damage** 1 after
  armor. **Rounding** as in Player numbers. **Bubble** draws 20% of all attacks, the special
  included.

### Tuning targets (all met by the simulator)

| Fight (start MP) | Target | Win | Friend | Turns | HP left | Net MP |
|---|---|---|---|---|---|---|
| Guppy L1–2 vs L1 (full) | win ≥ 99%, 2–3 turns | 100% | — | 2.5 | 84% | 7.3 |
| Angelfish L2 vs L1 (full) | win ≥ 80% | 96.4% | — | 3.4 | 50% | 9.0 |
| Old Stump: Angelfish L2 vs L1 B, scripted, 0 MP | reach the free cast ≥ 97% | 100% | 100% | 2.8 | 71% | 0 |
| Catfish L5 vs L4 B (half) | win ≥ 90%, 3–5 turns, 35–70% HP left | 100% | — | 4.1 | 65% | 8.0 |
| Nymph L5 vs L4 B (half) | win ≥ 90%, 3–5 turns, 35–70% HP left | 100% | — | 3.7 | 55% | 8.0 |
| Reedwater **fight**: Catfish L4 vs L4 B (half) | win ≥ 97% (baseline) | 100% | — | 3.5 | 77% | 8.0 |
| Reedwater **befriend**: same, 0 friends (half) | friend ≥ 45%, friend-or-win ≥ 97%, HP within 5 points of fighting, net MP ≤ fighting | 100% | 50% | 4.4 | 74% | 2.5 |
| Reedwater **befriend**: same, 3 friends (half) | friend ≥ 55%, same HP and MP rule | 100% | 60% | 4.3 | 76% | 2.0 |
| Cichlid L5 vs L5 B (half) | win ≥ 95% | 100% | — | 4.2 | 58% | 8.0 |
| Murk near: Cichlid L6 vs L5 B (full) | win ≥ 90%, ≥ 30% HP left | 100% | — | 4.0 | 55% | 17.9 |
| Murk near: Crayfish L6 vs L5 B (full) | win ≥ 90%, ≥ 30% HP left | 100% | — | 4.5 | 48% | 18.0 |
| Murk deep: Cichlid L7 vs L6 B (half) | win ≥ 90%, ≥ 30% HP left | 99.6% | — | 4.7 | 42% | 10.0 |
| Murk deep: Crayfish L7 vs L6 B (half) | win ≥ 90%, ≥ 30% HP left | 99.5% | — | 5.3 | 39% | 10.0 |
| Cichlid L8 vs L7 B (half) | win ≥ 85% | 100% | — | 4.8 | 47% | 10.0 |
| Crayfish L8 vs L7 B (half) | win ≥ 85% | 100% | — | 5.4 | 44% | 10.0 |
| Edge Cichlid L10 vs L8 B (full) | win 35–70% (optional and scary) | 41.3% | — | 6.2 | 24% | 23.0 |
| Edge Crayfish L10 vs L8 B (full) | win 35–70% | 52.0% | — | 7.0 | 18% | 23.0 |
| Gar vs L8 B, 3 Seed Cakes (full) | win ≥ 75%, 7–12 turns | 100% | — | 11.2 | 60% | 23.0 |
| Gar vs L8 B, no items (full) | win ≤ 35% (items and levels matter) | 23.2% | — | 10.0 | 26% | 23.0 |
| Gar vs L10 B, no items (full) | win ≥ 90% | 98.8% | — | 8.3 | 35% | 28.0 |
| Gar vs L8 B in the sub, no items (full) | win ≥ 90% | 100% | — | 9.8 | 78% | 23.0 |
| Gar friendship: L8 B, 5 friends, no items (full) | friend ≥ 85% | 100% | 100% | 4.8 | 57% | 19.0 |
| Gar friendship: L8 B, 5 friends, 2 Bubble Waters (half) | friend ≥ 85% | 100% | 100% | 5.8 | 50% | 19.0 |

"Friend-or-win" counts a befriend that fails and then wins by fins. Befriending costs about
the same HP as fighting and far less MP (the refund), and gives the same EXP and Bites, so
it's never the worse button.

The original's raw numbers would make the Gar unbeatable (it would hit for 22 × (1 + 10 ×
0.3) = 88 against a 65 HP Level-10 player, and its special did 100), which is why they're
retuned.

### Battle screen layout

- Battle sprites at ×2 their native size (see Art direction): you and Bubble left, enemy
  right, vertically centred between the HUD and the menu.
- HUD (top left): portrait, name, level, HP and MP bars. Enemy name, level and HP bar top
  right. In the Gar fight: the friends counter and, once started, the party meter.
- Log: the last 3 lines on desktop, 1 line on phones (tap it to see the last 3).
- **Menu: one row of 5 buttons** along the bottom, each at least 64 CSS px tall and a fifth of
  the safe width (~150 CSS px on an 844 px phone): **Attack · Spells · Party! · Items ·
  Swim Away**. Party! is dimmed with "?" until `hbtLearned` ("Bubble will show you this").
- **Spells** replaces the row with **Bubble Blast · Gravel Grenade · Back**. **Items**
  replaces it with **Kelp Snack · Seed Cake · Bubble Water · Fizzy Water · Back**, each with
  its count; kinds you don't carry are dimmed "×0". Locked or unaffordable choices are dimmed
  and say why when picked. Keys 1–5 pick within the current row.
- Once the sub is owned, a round 64 px Dive/Surface button sits above the row's right end.
- On a phone (844×390 CSS) that leaves the middle ~260 CSS px for the fight. The mockups
  include this exact layout.

## Villagers who remember

Each NPC has a small set of lines picked by **world flags** (a slimmed version of their
dialogue proposal): first meeting, after Bubble joins, after the first friend, armor stage,
after Highwater, low HP ("You look hurt!"), sub owned, Peace in the Paddies, after the Gar
(two versions). Lines live in `strings.js`, keyed by flag, highest-priority match wins. The
original's lines are kept as the first-meeting lines. The mystery's lines are in the table
above.

| Character | Look (one line, for the sprite prompt) | Role |
|---|---|---|
| Elder Finn | old grey-white betta, long ragged fins, a drooping whisker "beard" | quest-giver, gives the goal pointers |
| Shopkeeper Coral | salmon-pink betta with cream fin edges and a little shell necklace | Fish Mart, the sub |
| Guard Captain Reef | black-and-gold betta with a pebble helmet and a reed spear | east gate, training tips |
| Bubble the Brave | small, round lemon-yellow betta with turquoise fin tips and big eyes | companion |
| Innkeeper Seaweed | white-and-mint marbled betta wearing a kelp-leaf shawl | inn (5 BB) |
| Lock-Keeper Whorl *(Highwater)* | old snail with brass spectacles and a ring of keys on its shell | drain-gate errand |
| Pip *(Highwater)* | cheerful pink shrimp with a tiny apron | city shop |
| Innkeeper Kelpie *(Highwater)* | Seaweed's sister: Seaweed's sprite recolored lilac-and-white | Highwater inn |
| 3 townsfolk *(Highwater)* | villager sprites recolored | rumors of the shadow |
| Mossy and 3 captives *(the Ditch)* | Mossy: Coral's sprite recolored moss-green with white fin edges (clear of the player's green); the others: recolored villager and guppy sprites | in the reed cage; come home in the ending |

NPC colors and patterns are chosen to stay clear of the 5 player colors (red, blue, purple,
green, orange).

## Win, lose and progress

- **Win:** resolve the Gar. Ending scene in the village: the rescued fish (Mossy first)
  return; a party (hats for everyone, the Gar included) for the friendship ending, or a hero's
  welcome for the fins ending. Credits. Then you keep playing (edge zones, friends, the other
  ending).
- **Lose a battle:** wake at the last rest point, full HP and MP, lose 25% of carried Betta
  Bites.
- **Saved** (localStorage key `bettarpg-save`, versioned JSON, reads wrapped in try/catch;
  autosave on entering any area, after each battle, at a rest point, after buying, after
  using an item from pause, and when a flag is set): name, color, level, EXP, HP/MP, Betta
  Bites, items, sub owned, flags, friends by kind, picked-up scales and cogs, last rest
  point, area and position, settings. Title screen offers Continue / New Game (with a confirm
  if a save exists).

## Screens

All text screens and menus are HTML over the game canvas, in the bundled pixel font, so
text stays readable and buttons are real buttons. The world and battle scenes are drawn on
the canvas.

- **Title:** the underwater title backdrop (morning light shafts through paddy water, the
  stepped banks of the terraces, a calm open-water patch mid-right), and in that patch the
  village picture: `bettahome` cropped to its two domes (~88×52 art px), drawn at the
  scene's ×2 inside an oval mask with a code-drawn ring of bubbles and reeds. The player's
  betta in its current armor and color (or the base red one) swims in front; the name
  "Betta Fish RPG" in the game font; Continue / New Game / Settings. Mute button.
- **Create your betta:** name field (top third of the screen; random-name button, kept),
  5 color swatches (kept colors), the betta preview swimming, "Swim to Village".
  - The name field is a real `<input>` (max 12 characters, letters, numbers, spaces, ' and
    -). While it has focus, game keys are switched off except Enter (confirm) and Esc (leave
    the field). On phones the page scrolls the field into view when the keyboard opens and
    back to the top when it closes. An empty name gets a random one.
- **How to play:** contextual hints the first time (swim, talk, battle, befriend, red glow),
  matching the device. Three short cards reopenable from pause.
- **Exploring HUD:** top left: portrait, name, level, HP and MP bars, Betta Bites. Top right:
  home, pause, mute. Area name banner when entering an area (the Paddy Village banner uses
  the same two-dome crop of `bettahome`, ×1).
- **Dialogue box:** bottom, portrait on the left, name, typed-out text (tap/Space finishes
  the line, then continues).
- **Shop and inn:** a list with item icons and prices, affordable items bright, unaffordable
  dim. With less than 5 BB, the innkeeper lets you rest free ("Pay me next time").
- **Battle:** described above; floating damage numbers.
- **Pause:** current goal at the top; Resume, **Items** (the 4 kinds with counts; tap to
  use, HP and MP bars update in place), Friends (party-hat portraits by kind, x/3 each, and
  the Gar), How to play, Settings (music volume, sound volume, mute, Vibration, Controls, Report a bug), Wear party hat (after
  your first friend), Save & quit to title.
- **Defeat:** short fade, "Rescued by the villagers", wake at the last rest point.
- **Ending + credits:** two endings as above; credits include "Idea and original game by
  Rich Conlan".
- **Rotate-your-phone** card in portrait.

## Juice

- [must] Fish wiggle as they swim (code: sine tail-sway by skewing the sprite, bob), flip to face direction.
- [must] Bubbles trail from the player when moving; ripples where reeds are touched.
- [must] Battle: hit flash + 3-frame hit pause + small shake; damage numbers pop and fall.
- [must] Level up: burst of golden bubbles, jingle, armor swaps with a flash on 3/5/7.
- [must] Befriend: confetti and balloons rise, a party hat drops onto the fish at its final
  size (the scene's ×2, no shrinking) with a 2-step bounce; "+5 MP" and the heal float up.
- [must] Sound on every action and menu move.
- [must] The Gar's roar shakes the screen and dims the light; its charge glows.
- [should] Light shafts drifting through the water, shimmer on the surface, sway of rice tufts.
- [should] Screen transitions: ripple wipe between areas and into battles.
- [nice] Fireflies over the water at Highwater.

## Art direction

- **Style line (sprites and props):** "chunky pixel art with large square pixels, bold dark
  outlines, flat bright colors with one shade step, simple top-left lighting, cheerful and
  slightly cartoonish, matching the reference sprite's pixel size exactly; creatures in side
  view; transparent background; no text."
- **Style line (backgrounds):** "fine pixel art, about 430 pixels across, flat colors with one
  shade step, the underwater side view of sunlit rice-paddy water, no outlines on background
  shapes, lower contrast and less saturated than the reference sprites, the middle third
  plain open water, no characters, no fish, no text, opaque", plus the palette.
- **View:** 3/4 classic-handheld view: buildings and props show their front face; creatures
  are in side view (like the original sprites), flipped to face their direction. Title,
  battle and ending backdrops are underwater side views, like the sprites.
- **Style anchor:** the original `player_betta.png` (kept). Every new sprite gets it as a
  reference image (plus `bettahome.png` for buildings, **for shape only**: "scale-tile domes,
  dorsal-fin crest; daylight colours from this palette", since its own colors are a dark
  night scene; `prehistoric_gar.png` for the boss). Backdrops get `player_betta` and
  `rice_paddy_tuft` as style references.
- **Palette:** water from the original tiles' average colors: shallow `#3290D1`, mid
  `#2B7FC4`, deep `#1B4F8A`, murk `#0E2A47`, edge `#081A2E`; reed green `#5B8C3A`; mud
  `#6B4E2E`; outline `#2A1A12`; sand path `#E8C552`; betta red `#E5401F`; party pink
  `#FF4FA3`; sun gold `#F7C948`; Murk light band teal `#2E6F80`; sprite rim light `#9FD8E0`.
  The **snap palette** for generated art = these colors + the kept sprites' colors,
  quantized together to 48 colors once (`tools/palette.png`).
- **Dark water contrast:** the full-metal betta (luminance ≈50), the sub (≈54), the Catfish
  (≈57) and the Cichlid (≈75) would vanish on murk water (≈37). So the Murk and Gar's-pool
  backdrops have a lighter teal light band across the middle third, where the fighters
  stand, with darkness only at the edges and bottom; and in those two backdrops every battle
  sprite gets a 1 px `#9FD8E0` rim on its top and left edges (code). Checked on the Gar mock
  screen with the full-metal betta and the sub.

### The native-pixel rule

The kept sprites were drawn on pixel grids of different sizes inside 1024 px images
(measured by edge-phase analysis with Pillow):

| Kept image | Source px per art pixel | Native size (art pixels) |
|---|---|---|
| player_betta | 18.8 | 45 × 37 |
| …with_helmet | ≈21 (weaker signal; check by eye) | 40 × 36 |
| …with_almost_armor | 19.8 | 47 × 41 |
| …full_metal | 18.5 | 48 × 41 |
| aggressive_guppy | 28.7 | 34 × 26 |
| territorial-angelfish | 30.8 | 27 × 29 |
| sneaky_catfish | 26.8 | 34 × 23 |
| fierce_cichlid | ≈29.5 (plus faint grid lines every ≈9.9 px, and a 1 px grey frame) | 33 × 26 |
| prehistoric_gar | 24.2 | 39 × 17 |
| dunkleosteus_sub | 18.2 | 51 × 42 |
| rice_paddy_tuft | 27.5 | 22 × 19 |
| partyhat | 15.4 | 16 × 26 |
| bettahome | 8.8 (a full scene with its own vignette, not a cut-out) | 112 × 93 (two-dome crop ≈ 88 × 52) |

So no single downscale works. The rules:

1. **One art pixel = one logical pixel.** Draw at **whole multiples only:** ×1 on the
   overworld, ×2 in battle, title and ending scenes. Each scene uses one multiple for
   everything in it, so all pixels match.
2. **Kept art: cell detection.** `tools/extract-native.py --kept` (Pillow only) cleans each
   kept image (clears a 4 px border, thresholds alpha at 128, keeps the largest blob plus the
   hat blob on hat versions), detects its cell size, samples each cell's centre, and saves
   the native PNG.
3. **Generated sprites, buildings, props and icons: target-driven.** Every generated item
   has a **target size** in the asset list. `tools/extract-native.py --sheet <png>
   --targets <json>` then, for each item:
   1. cuts every blob on the sheet (alpha ≥ 128, blobs smaller than 1% of the largest are
      dropped; items are matched to targets left-to-right, top-to-bottom, as the prompt
      orders them);
   2. detects the item's drawn grid; if that grid gives a width within **±20% of the
      target**, samples at the detected grid (keeps the drawn pixels);
   3. otherwise reduces it with a majority-colour box filter whose cell is the whole number
      nearest to (blob width ÷ target width);
   4. snaps every pixel to the snap palette, re-thresholds alpha at 128, strips the old
      outer outline and redraws a clean 1 px `#2A1A12` outline in code;
   5. **tolerance:** if the result is still outside ±20% of its target, or reads badly on
      the contact sheet beside the betta, that item gets one single-subject retake (the
      sheet's 3rd take, see Mockups); if the retake also fails, it's drawn in code from
      the nearest kept sprite (recolor) or simplified to a code shape.
4. **Backdrops** (opaque scenes) target **432 × 200 art px**, drawn ×2 (864×400 logical,
   covering the widest logical screen; centre-anchored, sides and top/bottom crop on
   narrower screens). Generated at 16:9, the extractor detects the grid, samples it, crops
   centrally to 432×200 and snaps to the palette. A coarser result is allowed only at exactly
   half resolution (216×100, drawn ×4, so its pixels stay on the sprites' grid); anything
   else is majority-box reduced to 432×200.
5. Stage sizes differ a little (the helmet stage is the smallest); stages are anchored at
   the eye so the swap reads as armor, not a size change.

### Using the kept art

- **Betta (4 stages + hat versions):** overworld ×1, battle ×2, title/ending ×2; the HUD and
  dialogue portrait is a head crop drawn ×2. The hat versions show for the rest of a battle
  after you befriend, at parties and endings, and anytime with "Wear party hat" on.
- **Color through armor:** recolors are pre-baked once per color at load (getImageData; not
  `ctx.filter`, which isn't reliable on every browser and would also shift the eyes and
  hat). Only pixels in the betta's red hue band change. The hat is pasted back from the hat
  version afterwards. The full-metal stage has no colored pixels at all, so it gets a 30%
  tint of your color on its mid-tones plus a small crest plume in your color (5 × 4 art px,
  drawn in code). The other stages keep their red areas in your color. 5 colors × 8 images,
  all tiny.
- **Five enemies + hat versions:** overworld ×1, battle ×2. The original Gar (39 × 17) is the
  "long shadow" glimpsed in the Murk and the Friends-screen portrait; its hat version is the
  post-game friend in the Friends screen. The boss fight uses the new, bigger Gargantuan Gar.
- **Sub + hat version:** battle ×2 when dived in; shop display.
- **partyhat.png:** the Friends counter icon and the hat that drops in the befriend
  animation (drawn at the scene's multiple, final size, no shrinking). Hats on *new*
  creatures are the small hat cut from `player_betta_partyhat` (the difference from the plain
  sprite), placed in code, so they match the original hats.
- **rice_paddy_tuft:** overworld prop along banks and in shallow water (sways); battle
  foreground at ×2.
- **bettahome:** a picture, not a map piece: its two-dome crop on the title screen (oval
  mask, ×2) and on the "Paddy Village" banner (×1), and the shape reference for the new
  village buildings (dome huts with scale-tile roofs and a dorsal-fin crest).
- **The 4 water tiles** are replaced by code-drawn water (as agreed in the survey: noisy and
  not seamless); their average colors set the water palette.

### Drawn in code

- **Water:** flat palette fills per depth zone, sparse 1 px shimmer highlights that drift,
  slow diagonal light shafts, darker toward the edges.
- **Banks and mud:** from each map's collision mask (marching squares), mud fill with a 1 px
  dark outline and a 1 px light step on top-left edges; rice tufts scattered along them.
- **Edge fish:** the kind's sprite with a violet tint and a pulsing glow. **Red glow** for
  much stronger fish. **Dizzy stars** over Bubble. **Murk light circle.** **Rim light** on
  battle sprites in the Murk and Gar's pool. Confetti, bubbles, damage numbers, the party
  meter, all bars and panels (9-slice boxes drawn on a canvas once and used as CSS border
  images).
- **The Gate Spring:** the stones prop with a code-drawn column of rising bubbles and a soft
  glow. **The outflow pipe mouth** in the Ditch and the Murk: the culvert-mouth prop, darker.
- **Highwater townsfolk, Kelpie, Mossy and the captives:** villager and guppy sprites with
  recolored palettes.
- **App icon:** the betta's head (native, scaled ×8) on a sun-gold disc, with a maskable
  margin; all icon sizes made with Pillow. **Social card:** from the title screen.

## Audio direction

- **Music** (6 loops, instrumental; prompt states tempo and metre and adds "steady tempo,
  loopable, no intro swell, no fade-out, ends on the tonic"):
  1. Village & title: cozy, plucky, marimba and flute, 96 BPM, 4/4, 75 s (also under the ending)
  2. The paddies (Shallows, Reedwater, Spillway): bright and flowing, 112 BPM, 4/4, **150 s**
     (it plays the longest, across three areas)
  3. Highwater: bustling, a bit grander, 104 BPM, 4/4, 75 s
  4. The Murk (and the Sunken Ditch before the fight): low, mysterious, drips, 72 BPM, 4/4, 75 s
  5. Battle: bouncy and tense, 132 BPM, 4/4, 75 s
  6. The Gar: big, ancient, drums, 90 BPM, 6/8, 75 s
- **Looping:** each track is trimmed (Python, at build) to the last whole bar before its
  closing cadence, computed from its BPM and metre; `audio.js` plays it from two AudioBuffer
  sources, starting the next copy before the end and crossfading over 0.5–1.5 s (chosen per
  track by ear). Each loop point is listen-checked. Only the current track and the next are
  decoded (a 75 s stereo track is ~26 MB decoded); the next area's mp3 is fetched
  (compressed) ahead and decoded on entry.
- **Sound effects** (audiogen, 26): bite pick-up (also scales and cogs, lower pitch), attack
  hit, miss (also the Catfish's dodge, pitched up), Bubble Blast, Gravel Grenade, Happy
  Balloon Time (party horn + pops), befriend success, befriend fail (sad balloon), enemy
  defeated, player hurt, item use (gulp), level-up jingle, armor clank, buy, inn rest, swim
  away, Gar roar, Gar charge, sub dive, enemy notices you, Bubble chirp (Bubble's nip and
  heal), Bubble dizzy, shell crack, area/battle ripple transition, victory fanfare, Murk
  ambience (`--loop`).
- **Reused sounds** (no extra cost): defeat = swim-away whoosh pitched down; drain gate
  opening and the straw bundle shove = shell crack pitched down; a balloon filling on the
  party meter = the Happy Balloon Time pops (one pop); a balloon popped by the special = the
  befriend-fail sound; the Peace in the Paddies banner = the victory fanfare; the Gate Spring
  = the inn rest sound.
- **In code (WebAudio):** menu move, menu select, dialogue blip, "can't do that" buzz.

## Asset list

Kept assets cost nothing (in `game/assets/original/`), and go through the kept-art
extraction first. Target sizes are art pixels (width unless marked "tall").

| ID | What it is | Tool | Target size and format | Transparent | Animation | Priority |
|---|---|---|---|---|---|---|
| K1 | Player betta, 4 armor stages + party-hat versions | **keep** | native (see table), ×1/×2 | yes | code sway | must |
| K2 | Guppy, Angelfish, Catfish, Cichlid, Prehistoric Gar + hat versions | **keep** (cichlid frame and grid lines cleaned) | native, ×1/×2 | yes | code | must |
| K3 | Dunkleosteus sub (+ hat), party hat | **keep** | native, ×1/×2 | yes | code | must |
| K4 | Rice paddy tuft | **keep** | native 22×19 | yes | code sway | must |
| K5 | bettahome (village picture) | **keep** | two-dome crop ≈88×52: title ×2 (oval mask), banner ×1 | scene | — | must |
| K6 | Water tiles | **keep as palette source only**; replaced by code water | — | — | — | — |
| UI1 | Title backdrop, underwater, no characters | nanogen pro 2K 16:9 (MK1) | 432×200 | no | — | must |
| BG1–BG5 | Battle backdrops: Shallows, Reedwater, Spillway, Murk, Gar's pool; no characters | nanogen pro 2K 16:9 (BG1 = MK2, BG4 = MK3, BG5 = MK4) | 5 × 432×200 | no | — | must (BG3: should) |
| UI2 | Ending backdrops: village festival at dusk (friendship), village dawn welcome (fins); underwater, no characters | nanogen pro 2K 16:9 | 2 × 432×200 | no | — | should |
| B1 | Village buildings: Elder's dwelling 130, Fish Mart 130, Swishy Solace Inn 140 (MK5a); Guard post with reed gate 120, Bubble's home 110, village south gate 110 (MK5b) | imagegen2, 2 sheets of 3 | 6 items | yes | — | must |
| B2 | Highwater buildings: inn 140, Pip's stall 110, lock house 130 (MK9a) | imagegen2, 1 sheet | 3 items | yes | — | must |
| B3 | Drain gate 120 (one gate, in the Murk) | imagegen2, on the MK9b sheet | 1 item | yes | — | must |
| N1 | Villagers: Elder Finn 46, Coral 44, Reef 46, Bubble 34, Seaweed 44 (side view; looks above) | imagegen2 (MK6) | 5 items | yes | code | must |
| N2 | Portraits for every speaker | code: head crops of N1/N3/K1/E3 drawn ×2 | 48×48 frame | yes | — | must |
| N3 | Lock-Keeper Whorl (snail) 32, Pip (shrimp) 28 | imagegen2, on the MK9b sheet | 2 items | yes | code | must |
| N4 | Mossy, 3 captives, Kelpie, 3 townsfolk | code: recolors of N1 and K2 guppy | — | yes | code | must |
| E1 | Dragonfly Nymph 36, Snapping Crayfish 38 (overworld ×1, battle ×2 from the same native image) | imagegen2 (MK7) | 2 items | yes | code | must |
| E2 | Party-hat versions of E1, E3 and N4 captives | code: the cut-out kept hat | — | yes | — | must |
| E3 | Gargantuan Gar boss (refs: prehistoric_gar, betta) | imagegen2 (MK8) | 100×40 (×2 = 200×80 in battle; ×1 in its pool) | yes | code | must |
| T3 | Props: reed clump 24, lily pad 20, stones 18, broken stem 12 tall, fallen straw bundle 64, culvert mouth 48, spillway step lip 64, Old Stump 48, reed cage closed 40, reed cage open 40 | imagegen2 (MK10a) | 10 items | yes | — | must |
| I1 | Icons: Betta Bite 10, strange scale 12, brass cog 12, glow-moss lantern 14 tall, Kelp Snack 14, Bubble Water 14, Seed Cake 14, Fizzy Water 14 | imagegen2, cheaper model (MK10b) | 8 items | yes | — | must |
| UI3 | App icon and favicons | code from K1 | 512 + sizes | maskable margin | — | must |
| UI4 | Social card, GitHub preview | code (title screen) | 1200×630, 1280×640 | no | — | must |
| UI5 | Panels, buttons, bars, party meter | code | — | — | — | must |
| F1 | Pixel font with arrows (e.g. Pixelify Sans, OFL), bundled with its licence; draw ← ↑ → ↓ as icons if missing | download (OFL) | — | — | — | must |
| M1–M6 | Music (above) | audiogen music | 5 × 75 s + 1 × 150 s mp3 | — | loop | must (M3: should) |
| S1–S26 | Sound effects (above) | audiogen sfx | 0.3–5 s mp3 (S26 loop) | — | — | must |
| A1 | Gar lunge (4 frames) | anim8gen | E3 size | yes | yes | *(budget 30)* |
| A2 | Player betta swim (4 frames, base stage) | anim8gen | K1 size | yes | yes | *(budget 30)* |

About **17 generated pictures** (8 nanogen backdrops and 9 imagegen2 sheets, the sheets cut
into 38 sprites, buildings, props and icons), **6 music tracks**, **26 sounds**; everything
else is the kept art or drawn in code.

### Mockups (made now, for the shared design; $10 cap)

Each mock picture is a final-spec asset, so none is paid for twice. Then **four mock
screens** are composed from them with Pillow (free), all at the phone's 844×390 logical size:

1. The village overworld (×1): code-style water and banks, the betta, Bubble, villagers and
   buildings, rice tufts.
2. A Shallows battle (×2) with the 5-button row and the Dive button.
3. The title screen: MK1, the two-dome bettahome crop in its oval, the betta ×2.
4. **The Gar battle** (×2): full-metal betta and Bubble vs the Gargantuan Gar over MK4, rim
   light on, friends counter at 6 and the party meter at 2 of 4. A second crop of the
   same screen with the sub instead checks contrast.

**Rules for spending:**

- **Pinned per sheet** (the CLI's `--model` and `--quality`; never left to defaults or
  `.env`): MK1–MK4 `nanogen --model pro`, 2K, `--aspect 16:9`, refs `player_betta.png` +
  `rice_paddy_tuft.png`. MK5a–MK10a `imagegen2 --model gpt-image-2.6-flare --quality high
  --size 1536x1024 --background transparent` (native alpha). MK10b `imagegen2 --model
  gpt-image-2.5-flare --quality high --size 1024x1024 --background transparent`.
- **Order and pricing:** MK6 (villagers) first, as the style check. Its reported token
  `usage` is priced at OpenAI's current rate (looked up once, noted with the date in
  `design/ASSETS.md`); that measured price, not the $0.45 assumed below, sets the plan for the
  rest before any other imagegen2 call.
- **Takes:** 2 per sheet by default. A **3rd take only when extraction fails** (an item outside
  its ±20% tolerance, or unreadable beside the betta), and then as a single-subject image of
  just that item at 1024×1024.
- **Fallback:** if the measured price would take the plan (2 takes each, plus the $1.35
  reserve) over $10, move sheets to `gpt-image-2.5-flare` (about 4× cheaper, a little lower
  quality) in this order until it fits: MK10a, MK9b, MK9a, MK5b, MK5a. If it still doesn't fit,
  MK10a and MK10b move to the build budget and the mock screens use code shapes for props.
- Every take is logged in `design/ASSETS.md` with its measured cost and a running total; at
  $10 the mockups stop.

| # | Subject | Tool (pinned) | Generated at | Items and targets | Becomes |
|---|---|---|---|---|---|
| MK1 | Title backdrop | nanogen pro | 2K, 16:9 | 432×200 | UI1 |
| MK2 | Shallows battle backdrop | nanogen pro | 2K, 16:9 | 432×200 | BG1 |
| MK3 | Murk battle backdrop | nanogen pro | 2K, 16:9 | 432×200 | BG4 |
| MK4 | Gar's pool backdrop | nanogen pro | 2K, 16:9 | 432×200 | BG5 |
| MK5a | Village buildings A | imagegen2 2.6-flare high | 1536×1024 | Elder's dwelling 130, Fish Mart 130, Inn 140 | B1 |
| MK5b | Village buildings B | imagegen2 2.6-flare high | 1536×1024 | Guard post 120, Bubble's home 110, south gate 110 | B1 |
| MK6 | Villagers | imagegen2 2.6-flare high | 1536×1024 | Finn 46, Coral 44, Reef 46, Bubble 34, Seaweed 44 | N1 (+ portraits, N4) |
| MK7 | New enemies | imagegen2 2.6-flare high | 1536×1024 | Nymph 36, Crayfish 38 | E1 |
| MK8 | Gargantuan Gar | imagegen2 2.6-flare high | 1536×1024 | Gar 100×40 | E3 |
| MK9a | Highwater buildings | imagegen2 2.6-flare high | 1536×1024 | inn 140, Pip's stall 110, lock house 130 | B2 |
| MK9b | Drain gate and Highwater folk | imagegen2 2.6-flare high | 1536×1024 | drain gate 120, Whorl 32, Pip 28 | B3 + N3 |
| MK10a | Props | imagegen2 2.6-flare high | 1536×1024 | the 10 T3 props at their targets | T3 |
| MK10b | Icons | imagegen2 2.5-flare high | 1024×1024 | the 8 I1 icons at their targets | I1 |

**Prompts.** Sprite sheets start with the sprite style line; backdrops with the background
style line and the palette. Each sheet prompt lists its items in reading order (left to right,
top to bottom), "each well apart on a transparent background, no shadows, no ground", and
gives sizes relative to the reference betta and as a grid.

- **MK1:** "Underwater side view of a rice paddy at early morning: soft sun shafts slanting
  down from the surface, the stepped mud banks of terraced paddies rising left to right, rice
  stems and their roots, a calm open patch of clear teal water in the middle right where a
  small picture will sit, sandy bottom."
- **MK2:** "Underwater side view of bright, shallow paddy water: sandy bottom with pebbles,
  rice stems along the back, light ripples on the surface above; the middle third plain open
  water."
- **MK3:** "Underwater side view of deep, murky paddy water: tangled dark roots at the left,
  right and bottom edges, darkness only at the edges; a lighter teal band of light across the
  middle third, where the fighters stand."
- **MK4:** "Underwater side view of an old sunken concrete drainage pool: a broken grate on
  the left, a big round outflow pipe mouth on the right, an empty reed cage on the bottom
  left, gloomy edges; a lighter teal band of light across the middle third."
- **MK5a:** "Three village buildings for a betta-fish village under a sunlit rice paddy, 3/4
  front view: (1) Elder Finn's dwelling, a wide dome hut of overlapping scale tiles with a
  dorsal-fin crest, a round door and a curtain of hanging moss; (2) the Fish Mart, a dome hut
  with a striped reed awning and shelves of snacks; (3) the Swishy Solace Inn, the biggest
  dome, two doors and a kelp-bed shape on the sign (no letters). Each building about three
  times as long as the reference betta, drawn on a coarse pixel grid about 130 big pixels
  wide (the inn about 140). The first reference image is only for shape (scale-tile domes,
  dorsal-fin crest): use daylight colours from this palette: <palette>."
- **MK5b:** as MK5a's framing, items: "(1) a guard post of bundled reeds with a reed gate
  (about 120 big pixels wide); (2) Bubble's home, a small round cheerful dome with a yellow
  door (about 110); (3) the village's south gate, two reed pillars with a woven arch (about
  110)."
- **MK6:** "Five betta-fish villagers in side view, each in the same pixel size as the
  reference betta: (1) Elder Finn: <look>; (2) Shopkeeper Coral: <look>; (3) Guard Captain
  Reef: <look>; (4) Bubble the Brave: <look>, smaller, about three quarters of the reference
  betta's length; (5) Innkeeper Seaweed: <look>. Each body about 45 big pixels long."
- **MK7:** "Two creatures in side view, same pixel size as the reference betta: (1) a
  Dragonfly Nymph, olive-brown with pale gill plates and a hooked jaw, about 36 big pixels
  long; (2) a Snapping Crayfish, rust-red with a ridged shell and big claws raised, about 38
  big pixels long."
- **MK8:** "One enormous ancient gar in side view, long armored body with diamond-shaped
  scales, a long toothy snout, a heavy jaw, olive-grey with old bronze highlights, a little
  sad-eyed: about 100 big pixels long and 40 tall, more than twice the reference betta's
  length; the first reference is the same creature drawn small (match its markings)."
- **MK9a:** MK5a's framing, items: "(1) Highwater's inn, a tall two-storey dome with a lilac
  awning (about 140); (2) Pip's stall, a shell-roofed market stall (about 110); (3) the lock
  house, a stone hut with brass pipes and a big wheel (about 130)."
- **MK9b:** "(1) An old concrete drain gate with a rusty iron grate and three empty cog
  sockets, front view, about 120 big pixels wide; (2) Lock-Keeper Whorl: <look>, about 32 big
  pixels long; (3) Pip: <look>, about 28 big pixels long."
- **MK10a:** "Ten small props for a rice-paddy map, front 3/4 view, each on its own: reed
  clump (24 big pixels wide), lily pad (20), stones (18), broken rice stem (12 tall), fallen
  straw bundle (64), culvert mouth (48), spillway step lip (64), the Old Stump, a mossy sunken
  tree stump (48), a woven reed cage closed (40), the same reed cage with its door open (40)."
- **MK10b:** "Eight tiny inventory icons, very simple, few pixels each, bold outline: a
  golden fish-shaped treat (10 big pixels wide), a huge dark scale (12), a brass cog (12), a
  glowing moss lantern (14 tall), a kelp snack (14), a bottle of bubble water (14), a seed
  cake (14), a fizzy water bottle (14)."

Each sheet goes through the target-driven extraction and is checked on a contact sheet beside
the betta before the mock screens are made.

### What the mockups taught (2026-11-19; apply in the build)

Mockups cost about $7.70 of the $10 (estimated; MK6's token usage is logged in ASSETS.md for
re-pricing). Kept: villagers, all six village buildings, Highwater sheet, props, icons, the
Shallows/title/Gar's-pool backdrops, the Crayfish. To fix in the build (from the build budget):

1. **The Gargantuan Gar isn't gargantuan:** it came out 92×31, barely longer than the ×2 betta
   on screen. Regenerate at **120×48** (single subject, prompt "more than twice as long and
   twice as tall as the reference betta"), or draw the boss at ×3 in its battle.
2. **The Murk backdrop (MK3) is too bright:** its middle band reads as open sky with clouds.
   Retake with "no surface, no sky, no clouds; a dim teal glow, darker than the Shallows".
3. **The Dragonfly Nymph is small and muddy:** retake single-subject at 40 art px, more
   contrast between body and gill plates.
4. **Snap palette:** reserve 6 of the 48 slots for salmon, olive, lilac, neutral near-black,
   mint and a light grey, so Coral, Reef, the Nymph and Highwater's awning keep their colors
   (Coral must stay clear of the player's orange).
5. **Icons:** the model draws ~8 px icons; accept 8–10 art px icons (drawn ×2 in menus) rather
   than upsampling to 10–14.
6. **MK4 has a waterline across the middle:** fighters stand below it (y ≥ 175 logical).
7. **Battle backdrops on phones:** the menu and log cover the bottom ~80 logical px; keep
   backdrop detail in the top two-thirds and anchor backdrops a little higher on short screens.
8. **Buildings at 110–140 art px** read well but fill much of a phone screen; lay out the
   village with ~3 buildings per screen width.

## Tech plan

- `game/index.html`, `game/src/*.js` ES modules: `main.js` (loop, scene stack), `input.js`
  (keys, thumbstick, buttons, text-field suspension), `audio.js` (WebAudio, unlock on first
  input, two-source crossfade loops, ≤2 decoded tracks, mute and volumes), `world.js` (maps,
  camera, collision, code-drawn water and banks pre-rendered per area to an offscreen
  canvas), `entities.js` (player, Bubble follower, NPCs, wandering/chasing enemies, friends
  as separate capped entities, respawns), `battle.js` (pure rules with a seeded RNG, no DOM:
  used by the game and the simulator), `dialogue.js` (flag-driven lines), `strings.js`,
  `config.js` (all numbers in this design), `save.js`, `sprites.js` (native images,
  recolors, hat overlay, rim light, crops), `ui.js` (HTML screens, HUD, menus, dialogue box).
- **Randomness:** two seeded RNGs: the battle RNG, and one **world RNG** for wandering,
  chasing, spawns and drops. Fish movement runs on the fixed-step tick counter, never on
  wall-clock time, so a seed reproduces a route exactly.
- **Tools** (`tools/`, not shipped): `extract-native.py` (`--kept` cell detection;
  `--sheet --targets` target-driven extraction with the ±20% tolerance; `--backdrop`; Pillow
  only), `palette.png` (the 48-colour snap palette), `make-maps.mjs` (turns ASCII layouts in
  `data/maps/*.txt` into JSON with collision, depth zones, spawn points, props, pickups and
  triggers), `sim_design.py` (the design's simulator, already written),
  `sim-battles.mjs` (node; imports `battle.js` and `config.js`, runs the tuning table with
  the same rules, exits non-zero if a target is missed or it differs from `sim_design.py` by
  more than 3 points).
- **Scaling (no side bars at the targeted sizes):** work in device pixels. Pick the scale `k`
  = the largest whole number with device width ÷ k ≥ 640 and device height ÷ k ≥ 360 (at
  least 1). The logical size is then ⌊device ÷ k⌋, clamped to **640–864 wide and 360–400
  tall**; only beyond the clamps is there a margin, filled with the area's deep-water colour.
  Examples: 1280×720 → ×2, 640×360; 1920×1080 → ×3, 640×360; 1366×768 → ×2, 683×384;
  844×390 at DPR 3 (2532×1170) → ×3, 844×390; 667×375 at DPR 2 → ×2, 667×375. All of these fill
  the screen exactly. If the device is smaller than 640×360, the 640×360 view is scaled down
  (nearest-neighbour). The camera, HUD and menus are placed relative to the logical edges;
  backdrops (864×400 at ×2) are centre-anchored and cropped. HTML text is sized in CSS px:
  body text at least 14 CSS px. HUD and touch controls stay inside the safe-area insets.
- Fixed-step 60 Hz update, rAF draw, clamp big frame gaps, pause on `visibilitychange` and
  blur.
- Save in localStorage; PWA manifest (landscape) + the template service worker for install
  and offline.
- **Debug hook** `window.__game`:
  - `state()`: screen, area, player {x, y}, level, hp, mp, bb, items, flags, friends by
    kind, scales and cogs, sub, inBattle (enemy kind, level, HP, turn, party meter), goal,
    last rest point, gameWon (+ which ending)
  - `frames()`: the frame log (one entry per change of screen, ≤200), as in web-target.md
  - `buttons()`: the visible HTML buttons with labels and rectangles
  - `audioState()`: context state, music/sfx muted, current track
  - `levels()` → 6 areas; `goToLevel(n)`: enter area n fresh, with the flags the story would
    have set by then and the expected level; also seeds the world RNG
  - `set({level, hp, mp, bb, items, flags, friends, scales, cogs, sub, pos})`: set up a situation
  - `seed(n)`: seed both RNGs; `battle(kind, level)`: start a battle here
  - Cheats `$` (+50 BB) and `%` (level up) only when the URL has `?debug`.
- **Level solutions:** a recorded route per area from arrival to its completion flag, as
  **waypoints** with key holds that re-check `state().player` at each waypoint (and `seed`
  for battles), plus both Gar endings from a save at `gateOpen`.

## No soft-locks (how each is prevented)

- No money: losing costs only 25% of carried Bites; inns are free when you have less than 5;
  the Gate Spring is always free.
- No MP: Attack is always available; inns, the Gate Spring, level-ups and defeat restore MP;
  befriending refunds its MP; safe water refills slowly; MP items work from pause.
- Under-levelled: fish respawn on re-entry in every area; the village and Shallows are
  always reachable (Home/H). The Murk's near half doesn't chase, so the step up from
  Highwater can be taken slowly.
- Every friend made / Peace in the Paddies: friends are separate entities; spawn points
  always refill with unfriended fish of each kind.
- Story items (scales, cogs, key, lantern) are fixed pickups or gifts, saved once taken,
  never consumed or droppable, and **count in any order**: the straw-bundle scene plays when
  you're at the bundle with 5 scales, wherever the 5th was found; the drain gate opens with
  3 cogs whichever order they came in.
- **The Old Stump:** `bubbleJoined` is set before the fight; the angelfish can't be knocked
  out, Swim Away is disabled, the first Party! is free and certain, so the only outcomes are
  the lesson or a visible loss; after a loss, the angelfish waits and the lesson is kept.
- The Gar: you can lose (and retry from the Gate Spring) or flee at 10%; levels and items can
  always be gained. Party! never spends MP or a turn without 5 friends, and the first party
  cast is free; a party out of MP is a normal fight that ends in a win or a visible loss.
- Scripted battles (the tutorial guppy, the Old Stump angelfish) can be lost; you wake at the
  inn and the scene is still waiting.
- No one-way drops: every area connects back to the village by water and by Home/H.
- **Play it wrong** (the play-test checks each): scales out of order (the 5th far from the
  bundle, the bundle touched first); cogs out of order and the gate tried with 2; losing
  the Old Stump fight, and trying to attack/flee there; Party! at the Gar with 4 friends; a
  half-MP party with no items; Home/H from the Ditch, then back; the Murk entered at L5; a
  defeat with 0 Betta Bites.

## Budget $50 (from `--continue`, 2026-11-20)

The person raised the budget to $50, so the build makes everything marked *(budget 30)*: the
Gar lunge (A1) and betta swim (A2) animations (each kept only if it matches the kept art;
code sway is the fallback), a separate title track and ending track, a paddy ambience
loop, and a dedicated Highwater townsfolk sheet. It also redoes the three weak mockups (a
bigger Gargantuan Gar, a darker Murk backdrop, a better Dragonfly Nymph), and has room for
retakes. Nothing on the cut list is cut unless something can't be made to work.

## Cut list (drop first → last)

1. Ending backdrops UI2 (use the title backdrop with confetti instead).
2. Spillway battle backdrop BG3 (reuse Reedwater's, tinted).
3. Paddies track M2 back to 75 s (it loops twice as often).
4. The Murk's light circle (just darker water; notice range drops to 64 px).
5. Highwater music M3 (Highwater uses the village track).
6. Snapping Crayfish → recolored Cichlid with the shell rule.
7. Sound effects down to 18 (Bubble chirp, dizzy, notice, shell crack, item use, transition
   and victory fanfare fall back to other sounds or code blips).

Never cut: free swimming, fight-or-befriend battles with the Party! button, Bubble as
companion, the Gar with both endings, the Gate Spring, the kept quirks and all the original
art.

**Restored with `--budget 30`:** A1 Gar lunge and A2 betta swim animations (anim8gen), a
separate title track and ending track, a paddy ambience loop, a dedicated Highwater
townsfolk sheet instead of recolors.

## Effort and cost estimate

A forecast, not a promise.

- **Effort:** 6 areas (one a hub, one a city), 8 speaking characters plus townsfolk and
  captives with flag-driven dialogue, 7 enemy kinds plus edge variants, 1 boss with two
  endings, about 12 screens, ~17 generated pictures (9 of them sheets cut into 38 items; plus
  26 kept), 6 music tracks, 26 sounds. Riskiest: the extraction of generated sheets (now
  target-driven with a tolerance and a retake rule); battle balance across both paths (the
  simulator covers it); touch controls for both exploring and battle menus.
- **Prices used:** nanogen pro 2K $0.134 an image (its skill's table); imagegen2 reports
  tokens, not prices, so ~$0.45 a 1536×1024 high take on gpt-image-2.6-flare is *assumed*
  until MK6's first take is priced from its reported usage, and ~$0.12 for a 1024×1024 take on
  gpt-image-2.5-flare (about 4× cheaper); music $0.30 a minute; sound effects $0.12 each.
- **Mockups ($10 cap):**
  - MK1–MK4 nanogen, 2 takes each: 8 × $0.134 ≈ **$1.07**
  - MK5a, MK5b, MK6, MK7, MK8, MK9a, MK9b, MK10a on 2.6-flare, 2 takes each: 16 × $0.45 ≈ **$7.20**
  - MK10b on 2.5-flare, 2 takes: ≈ **$0.24**
  - Planned **≈ $8.51**; reserve for 3rd takes on failed extraction (up to three
    single-subject takes) ≈ $1.35; **worst case ≈ $9.86**.
- **Build (~$10):**
  - Images: BG2, BG3, UI2 ×2 (nanogen, 2 takes each) ≈ $1.07; two imagegen2 fix-ups (a hat
    edit or a single-subject retake) ≈ $0.90; spare retries ≈ $0.50. **≈ $2.47.**
  - Music: 5 × 75 s + 1 × 150 s = 8.75 min ≈ $2.63, plus 3 retakes of 75 s ≈ $1.13.
    **≈ $3.76.**
  - Sounds: 26 × $0.12 = $3.12, plus 4 retakes ≈ $0.48. **≈ $3.60.**
  - **Build total ≈ $9.83.**
- **Overall ≈ $18.34 planned, ≈ $19.69 if every mockup reserve take is used, of $20.** If a
  phase runs over, the cut list trims from the top. `--budget 30` adds ≈ $8–9 for the
  restored items (two animations ≈ $5, two tracks ≈ $1, an ambience loop ≈ $0.25, a townsfolk
  sheet ≈ $1.35, retries).

## Definition of done

- [ ] Starts with no errors at desktop (1280×720, 1366×768, 1920×1080) and phone (844×390
      landscape, DPR 3) sizes; no side bars or letterbox at any of them; body text at least
      14 CSS px on the phone.
- [ ] Every area can be reached and finished from its recorded waypoint route; both endings
      (fins, friendship) can be reached; Peace in the Paddies can be reached.
- [ ] `tools/sim-battles.mjs` passes every tuning target and matches `tools/sim_design.py`
      within 3 points.
- [ ] Losing a battle and fleeing work; you always wake at a rest point (village inn,
      Highwater inn or Gate Spring) and can go on.
- [ ] The game can always go on, even when played wrong: every item on the "Play it wrong"
      list above, plus no Betta Bites, no MP, under-levelled, every friend made, sub not
      bought, Bubble dizzy, scripted fights lost, Gar fled.
- [ ] Swimming, talking, battles, shop, inn, pause Items and menus all work by keyboard,
      mouse and touch; the battle row has 5 buttons, each at least 64 CSS px tall on the
      phone; Party! is on the main row; typing a name never triggers game keys.
- [ ] Befriending gives the same EXP and Bites as defeating, refunds its 5 MP and heals 15%.
- [ ] Every sprite on screen shares one pixel size per scene (native-pixel rule), checked
      on screenshots; every generated item is within ±20% of its target size; the chosen
      color shows at every armor stage, full metal included; the full-metal betta and the
      sub are clearly visible on the Murk and Gar's-pool backdrops.
- [ ] The mystery is told: the Highwater rumors, Whorl's line, the Murk shadow, Mossy's line
      and both endings' lines all appear.
- [ ] Every screen looks finished at every targeted size, from the first load; no screen
      flashes in the frame log.
- [ ] Music loops without an audible seam (each loop point listen-checked); music and sound
      play after the first tap or key; mute and volumes work.
- [ ] Progress is saved and restored (Continue works after reload, mid-area).
- [ ] Kept quirks still there: Gar roars on turns 1/4/7, Level-10 edge zones, 10% flee vs
      L5+, Home/H to go home, party hats on friends, color kept through armor, all
      original art in use.
- [ ] Cheats only with `?debug`; the debug hook has state, frames, buttons, audioState,
      levels, goToLevel, set, seed and battle.
- [ ] Installs as an app and works offline.
