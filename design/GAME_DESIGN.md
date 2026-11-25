# Betta RPG

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
- Remake of github.com/zeveck/bettarpg (now zeveck/bettarpg-original), leeway **lots**. Survey in `design/ORIGINAL.md`.
- Decisions made on the player's behalf:
  - Keep the name "Betta RPG" (theirs, and their domain).
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
  go back, plus 1–5 in battle rows, so a player can never lock themselves out. Those keys and
  buttons can't be bound to an action (Talk may keep Space and ✕).
- Battle buttons show their 1–5 key only when the last input was the keyboard.
- UI text and panels scale with big screens (×1 on phones, about ×1.2 at 1280×720, ×1.8 at 1920×1080).
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
| Shallows | `metFinn` (the south gate opens as he finishes) | — | Reach the Old Stump: a strange scale, Bubble catches up (`bubbleJoined` is set the moment Bubble arrives), then the scripted Angelfish fight (see Opening); befriending it sets `stumpDone` | `bubbleJoined`, `hbtLearned`, `stumpDone`, then `eastOpen` from Reef | "Make friends in the Shallows: Captain Reef will open the east gate when you have 3.", then "Follow the strange scales uphill through Reedwater. (Scales n/5)" |
| Reedwater | `eastOpen` (Reef opens the gate once `stumpDone` is set and you have **3 friends**, the Old Stump's angelfish included) | Guard Captain Reef at the east reed gate: before Bubble, "Not alone, little one. Come back with a friend."; with Bubble but before `stumpDone`, "That angelfish at the Old Stump won't let anyone pass in peace. Settle it first."; after it, "Reedwater fish are Level 3 to 5, and they chase. Show me you can win fish over first: three friends... (Friends n/3)" | Pick up all 5 scales, **in any order**; then the straw-bundle scene plays at the Spillway's foot (rules below) | `trailFound` | "Up the spillway lies Highwater. Ask them about the shadow." |
| Spillway, Highwater | `trailFound` | Fallen straw bundle across the Spillway steps | Talk to the Lock-Keeper: he tells of the flood and, **once you're Level 5**, gives the drain-gate key and a glow-moss lantern and asks for the gate's 3 lost cogs (before that: "Grow strong in the spillway pools first, then come back for the lantern", and the goal line says so) | `highwater`, `lantern` | "The Lock-Keeper's lantern will light the Murk. Find those three cogs." |
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
   - Bubble cheers you to full HP as it arrives, so arriving hurt can't lose the lesson.
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
- **Starting kit:** one Bubble Water, so the first Party! attempts don't strand you without MP.
  Bubble and Reef both give the tip "bite a fish down first, then throw the party".
- **Fled fish** keep away from you until you've swum off, so they can't restart the fight where you wait.
- **Catch-up EXP:** below the level an area expects (Shallows 3, Reedwater 5, Highwater 6, the Murk 7, the Ditch 8), fights there give ×1.5 EXP ("Catch-up bonus!"), so a player who follows the goal line and takes the fights in their way reaches the expected levels. The Spillway has a Cichlid in its main channel, and Reef's three-friends errand puts a few Shallows fights on the main path.
- **The lesson** (first Attack dodged, the Bubble Blast hint) fires on your first fight, whichever fish it is, so swimming past the tutorial guppy doesn't skip it.
- **Defeated fish** flip belly-up, fade and sink on the map instead of vanishing.
- **Safe water:** in the village and Highwater (no fish), HP and MP refill 1 point every 2 s.
- **Items anywhere:** the pause screen has Items, so you can eat or drink between fights.
- **Losing:** you wake at your last rest point (the village inn, the Highwater inn, or the
  Gate Spring) with full HP and MP, having lost 25% of the Betta Bites you carry. No game
  over.
- **The Gate Spring:** a bubbling spring just inside the Sunken Ditch, past the drain gate.
  Once `gateOpen` is set, it becomes your wake-up point the moment you enter the Ditch (a toast
  and a Bubble line say so), and touching it is a free full rest, so a lost Gar fight never
  means swimming back through the Murk.
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
| **Party!** (Happy Balloon Time) | 5 MP | `hbtLearned` (Old Stump) | Befriend chance 25% + 40% × (1 − enemy HP%) + 3% per friend, max 80%; **×0.6 for each level the fish is above you (never below ×0.2)**, so befriending far-stronger fish is no cheap grind. Success: the 5 MP back and +15% max HP |
| Party! (big) | 5 MP | L7 ("Your balloons got bigger!") | 35% + 50% × (1 − enemy HP%) + 5% per friend, max 95%. Edge fish: half chance |
| Items | — | — | Kelp Snack +10 HP (3 BB), Bubble Water +8 MP (2 BB); Highwater: Seed Cake +30 HP (8 BB), Fizzy Water +15 MP (6 BB). Carry up to 9 of each. Also usable from the pause screen |
| Dive / Surface (sub) | your turn | sub owned | Swap into or out of the Dunkleosteus Submarine |
| Swim Away | — | — | 75%, or 10% vs Level 5+ (kept) |
| **Flare** (in Swim Away's place) | — | fish below your level, not bosses | 35% + 20% per level you're above the fish, max 95%. Shown instead of Swim Away once it's at least as likely to work (no Flare in the sub or a scripted fight). Works: the fish bolts, no EXP, it drops one Betta Bite on the map and keeps away for 6 s. Fails: the fish "isn't impressed" and takes its turn (issue #2) |

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
| Befriend one level up: Catfish L5 vs L4 B, 0 friends (half) | friend ≥ 25%, friend-or-win ≥ 95% | 99.4% | 29% | 5.4 | 55% | 3.6 |
| Befriend a red fish: Catfish L6 vs L3 B, 0 friends (full) | friend ≤ 15% (no cheap grind) | 67.6% | 11% | 5.9 | 30% | 12.1 |
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
  "Betta RPG" in the game font; Continue / New Game / Settings. Mute button.
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

Kept assets cost nothing (in `source-art/`), and go through the kept-art
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
| T3 | Props: reed clump 24, stones 18, broken stem 12 tall, fallen straw bundle 64, culvert mouth 48, spillway step lip 64, Old Stump 48, reed cage closed 40, reed cage open 40 | imagegen2 (MK10a) | 9 items (lily pad removed in Change 3) | yes | — | must |
| I1 | Icons: Betta Bite 10, strange scale 12, brass cog 12, glow-moss lantern 14 tall, Kelp Snack 14, Bubble Water 14, Seed Cake 14, Fizzy Water 14 | imagegen2, cheaper model (MK10b) | 8 items | yes | — | must |
| UI3 | App icon and favicons | code from K1 | 512 + sizes | maskable margin | — | must |
| UI4 | Social card, GitHub preview | code (title screen) | 1200×630, 1280×640 | no | — | must |
| UI5 | Panels, buttons, bars, party meter | code | — | — | — | must |
| F1 | Pixel font with arrows (e.g. Pixelify Sans, OFL), bundled with its licence; draw ← ↑ → ↓ as icons if missing; built as two static weights with a squarer capital B and redrawn 0 (slashed), 2, 5 and a flat-topped Z (tools/make-font.py), since Pixelify's B read as G, 5 as S, 0 as O and 2 as Z | download (OFL) | — | — | — | must |
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
- **MK10a:** (the lily pad it made was removed in Change 3) "Ten small props for a rice-paddy map, front 3/4 view, each on its own: reed
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

## Change 1 (2026-11-21): the Snarl, the friends' parade, and New Game+

The person asked for all three ideas from the publish report, and for save slots during the
change. Everything else stays as it is. Refined 2026-11-21 from two reviews (player,
builder); every number below is met by `tools/sim_design.py` (subsection 5).

### 1. The Snarl, a fishing-net mini-boss guarding the Spillway

**Who and where.** An old **Mitten Crab** hopelessly tangled in a lost fishing net (the
farmers' net, swept down by the same spring flood). Grumpy, sore, and swinging the net at
anyone who climbs the steps. It sits at the **top of the Spillway steps** (Highwater area),
the one way up to the city, at (768, 462), drawn `boss/snarl.png` at world scale (×1, like
every fish), with a slow claw sway and net bob in code. It's visible and doesn't chase.

**The gate (solid).** Highwater's `gates` gets
`{ id: 'snarl', rect: [640, 440, 256, 44], openIf: 'snarlDone', look: 'none', talk: 'snarl' }`.
The channel is 256 px wide (x 640–896) where it meets the city water at y 460, so the rect
spans the whole join: there's no way round. Bumping it runs `talk: 'snarl'`, which starts
the fight (the first time after a short scene, below). After you flee or lose, the Snarl
re-arms only once you've swum 120 px away and come back (the Gar's rule), so you can't be
caught in a loop at its claws; the usual 2 s of safety also applies.

**First meeting** (once, flag `snarlMet`): Bubble: "That crab's all tangled up... and cross
about it." The Snarl: "GET OFF MY STEPS! Can't a crab sulk in peace?!" Then the battle.
Goal line, when `trailFound && !snarlDone`: "Get past the Snarl at the top of the
Spillway." (checked before the `highwater` lines in `goalLine`). Finn's pointer after
`trailFound` is unchanged.

**The Spillway Spring (rest point at the steps' foot).** A bubbling spring (the Gate
Spring's look: `p_stones` with code bubbles) in the channel at (700, 836), just above the
Reedwater entry. The first time you enter the Highwater area with `trailFound && !snarlDone`
(flag `stepsKnown`), it becomes your wake-up point (`rest: 'steps'`), with a toast "The
Spillway Spring bubbles nearby: you'll wake here if you fall." and Bubble: "A spring! If that
crab beats us, we'll wake up right here." Touching it (30 px) is a free full rest and sets
`rest: 'steps'`. New entry `steps: { x: 740, y: 830, face: 1 }`; `REST.steps =
['highwater', 'steps']`. Resting at Kelpie's inn later sets `rest: 'highwater'` as now. So
a lost Snarl fight wakes you one screen below it, never back in the village.

**Numbers** (a new `SNARL` entry in config.js; enemy formulas as for any fish):

| | Rule | Level 5 (first run) | Level 9 (NG+1) | Level 11 (NG+2+) |
|---|---|---|---|---|
| HP | round(30 × (1 + 0.55 × L)) | 113 | 179 | 212 |
| Claw | 3–5 + ⌊1.5 × (L − 1)⌋, 90% hit (Cichlid-like) | 9–11 | 15–17 | 18–20 |
| EXP | ⌊90 × (1 + 0.2 × L)⌋ (catch-up ×1.5 applies: Highwater expects 6) | 180 (270) | 252 | 288 |
| Betta Bites | 20 + 5 × NG+ bonus level | 20 | 40 | 50 |

Befriending gives the same EXP and Bites (as every fish), the 5 MP back, +15% HP, and (the
first Snarl friend) a Kelp Snack. Fleeing: 10% (Level 5+), as now.

**Its turn pattern** (`sturn` counts the Snarl's own turns; it never strikes first):

- Turns 3, 6, 9…: **Net Throw** instead of a claw: no damage, never misses. It always
  warns at the end of the round before (its turns 2, 5, 8): "The Snarl gathers up its net!"
  (the net quivers; sound: `gar_charge` at rate 1.5, volume 0.6).
- 20% of throws land on **Bubble**, like any attack: "The net lands on Bubble! Bubble's all
  tangled up..." Bubble skips its next action (the dizzy rule, drawn as the net overlay on
  Bubble instead of stars); you're free.
- Otherwise: "The Snarl flings its net over {name}! Tangled!" (`net_throw.mp3`; a net
  drawn in code flies from the crab to you in a 3-frame tween, 1-px mesh in the net's
  colour, then a Tangled overlay sits on your betta).
- **Tangled (one clear rule):** your next turn only, you can **Attack or use an item**.
  Spells, Party!, Swim Away and Dive are dimmed; picking one says "Tangled! Only Attack or an
  item this turn." (no turn spent). Bubble acts after you as always, and **that round
  Bubble's action is nibbling the net off you** instead of nipping or healing: "Bubble
  nibbles the net off you!" The overlay goes; you're free from the next turn. So a Tangle
  costs you your spell turn and Bubble's nip, and the warning gives you a turn to cast
  first. In the sub (NG+ only: the sub is sold after Highwater), the net slides off: "The net
  slides off the submarine!" (no Tangle).
- Every other turn: a claw snap like any fish (90% hit, 20% drawn by Bubble, armor
  applies, at least 1). Lines: "snaps its tangled claws!", "swings the heavy net!",
  "scuttles sideways and pinches!"

**Net armor** (its own property `net: 2`, not the Crayfish's shell):

- While the net is whole, your Attack and Bubble Blast do −2 (at least 1). Bubble's nip
  and Gravel Grenade aren't reduced. The first reduced hit of each battle adds its own line:
  "The thick net softens your bite (−2)." Later hits just show the smaller number.
- **Gravel Grenade rips the net at once:** "The gravel rips the net open!" (`net_rip.mp3`,
  a puff of mesh bits in code).
- **Or bite it apart:** every landed Attack or Bubble Blast, and every Bubble nip, unties
  one of **4 knots**, shown as 4 small knot pips under the Snarl's HP bar. The 2nd: "The net
  is fraying!" The 4th: "The net rips open!" (`net_rip.mp3`). So a Level-3 betta without the
  Grenade can still tear it and befriend it.
- Once ripped: no armor, and Party! works. It keeps throwing the torn net (Net Throw is
  unchanged), since it's still wrapped up in it.

**Teaching the Grenade.** At the first round of every Snarl fight, Bubble says (Level 4+):
"That net's too thick to bite through! A Gravel Grenade would rip it open." Below Level 4:
"That net's too thick... Keep biting at it: every hit frays it!" Party! while the net is
whole is refused with no MP or turn spent: "It can't hear the party through all that net!
Rip it first: Gravel Grenade, or keep biting." Whorl's and the Highwater townsfolk's lines
don't change (they're above it).

**Fins or friendship.**
- Fins: "The Snarl scuttles off to sulk in the side pool." The net tears off in the
  scuffle. Sets `snarlDone`.
- Friendship (Party! works normally once the net is ripped; the level-gap rule applies):
  "The net falls away... the Snarl wriggles free! You made a friend!" (`net_rip.mp3` plays
  as the "freed" sound, then the usual befriend sound). Sets `snarlDone`, `snarlFriend`, and
  `friends.snarl = 1`.
- **After, either way:** `props/torn_net.png` lies on the steps at (812, 452), drawn
  behind you, not solid; `boss/snarl_free.png` sits in the east side pool at (1240, 610),
  never collides, never starts a battle, and talks on the action button. Friend (in its party
  hat, the kept hat placed on the top of its carapace; the anchor is set on a screenshot): "Thanks for
  getting that net off me. My shell feels ten years younger!" Defeated: "Hmph. You win,
  little fish. The steps are yours." It's never fought again. The friend Snarl counts as a
  friend (kind `snarl`, toward the Gar's 5) but isn't one of Peace in the Paddies' 6 kinds.

**No soft-lock.** Losing wakes you at the Spillway Spring with full HP and MP (−25% Bites,
as always) and the Snarl at full HP; the Spillway's side-pool Cichlids (L5) and Reedwater
are right there to grind, and the Spring rests you for free. Fleeing works (10%) and the
re-arm distance means you can always swim away after a flee.

**Battle screen.** Spillway backdrop (`spillway`), battle track. The Snarl is drawn **×3**
(141×102 logical px from 47×34 native: a mini-boss should loom; whole multiples only), its
feet on the same baseline as normal enemies, placed like the Gar (`ex` at 0.69 of the width)
so it fits the phone's middle band. Hit flash, lunge and defeat as for regular fish. Net
pips under its HP bar.

### 2. The friends' parade

- **Where:** the **village** (all of it) and **Highwater's city** (y < 470, the safe water).
  When you swim down the Spillway steps (y ≥ 470), the parade stops at the top of the steps
  and waits in a loose cluster around (768, 400); it rejoins when you come back up. In every
  other area they stay home, so the world stays readable and route timings don't change.
  During the Peace in the Paddies square party, the parade is off (they're at the party),
  so no friend shows twice.
- **Who and in what order** (the save keeps counts only, so "most recent" isn't knowable):
  up to **6**, in a fixed rotation of kinds you have: guppy, angel, cat, nymph, cich, cray,
  snarl, then round again while a kind has more friends than it has shown, until 6 or none
  left. All in party hats. After the friendship ending **and** Peace in the Paddies, the
  Gar trails last in the **village** parade (×1, it's 141 px long); it's still in its pool
  when you visit the Ditch. While the friend Snarl swims in the Highwater parade, its
  east-pool spot is empty.
- **Trail:** the same trailing as Bubble. A breadcrumb is recorded every 4 px you move;
  keep the last **80** (320 px of path). Bubble sits at crumb 6; friend i (1–6) at crumb
  6 + 5i (20 px apart); the Snarl adds 4 crumbs of extra gap before it, the Gar 12. When you
  stop for 0.5 s, each drifts to a seeded spot within 40 px of you and bobs; moving off,
  they fall back into line.
- They never collide, are drawn behind villagers and buildings' fronts, and are never a talk
  target, so they never block a conversation.
- **Pause → Settings: "Parade: on/off"** (on by default), stored in the global settings
  (`parade: true`), not per slot.
- No new art: the kept and new sprites with their hats.

### 3. New Game+

**Unlocking.** A slot whose save has `endingsSeen.fins` or `endingsSeen.friend` offers
**New Game+** (on the slot screen and as a title button under Continue when the last slot
qualifies). The credits' "Keep playing" stays.

**Starting it (never over the finished game).** New Game+ asks **which slot** to start in
(subsection 4): the default is an empty slot; a used one asks "Overwrite <name>'s game
(Level n)?"; the source slot itself is offered last and needs a second confirm ("This
replaces your finished game"). The confirm lists what carries over and what starts again
(below). The finished game stays in its slot to Continue.

**Exact lists** (the new save is `newSave(name, color)`, then):

| Carries over | Resets (to `newSave` defaults) | Set |
|---|---|---|
| name, color, level, exp, Betta Bites, items, `subOwned`, `wearHat`, `endingsSeen`, `ending` (first ending), `lastEnding`, `hints` (control tips already shown) | all `flags` (story, `peace`, `snarlDone`, `garDefeated`, …), `friends`, `firstFriendKinds`, `scales`, `cogs`, `rest` (village), `freeRest`, `area` (village), `pos` (null), `met`, `playTime` (0) | `ngPlus = source.ngPlus + 1`; HP and MP full; `flags.tutorialDone = true` (the dodge lesson isn't repeated); `lastPlayed` now |

It starts in the village at the `start` entry with Elder Finn's opening, exactly like a new
game. Your first friend at the Old Stump is still scripted (the free cast); the Snarl and
the Gar are back.

**Tougher fish: the NG+ bonus k.** `k = 4` at NG+1, `k = 6` at NG+2 and every later NG+
(numbers stop growing there; the counter keeps counting for the badge).

- Every enemy level is its first-run level + k: spawn ranges, the Old Stump angelfish
  (2 + k), the Snarl (5 + k), edge fish (10 + k), the Gar's shown level (10 + k). Stats come
  from the usual formulas at the new level. NG+1: Shallows guppies L5–6, Reedwater L7–9,
  Spillway Cichlids L9, the Snarl L9, Murk near L10, deep L11–12, edge fish L14.
- **The Gar at bonus k:** HP 230 + 20k, bite 8–12 + k (90% hit), GARGANTUAN GAR 30 + 2k,
  EXP 600 + 150k, Bites 50 + 10k. Turn pattern unchanged; the sub still blocks the special
  completely.

  | | HP | Bite | Special | Special after fins (×1.1, down) | EXP | Bites |
  |---|---|---|---|---|---|---|
  | First run | 230 | 8–12 | 30 | — | 600 | 50 |
  | NG+1 (k 4) | 310 | 12–16 | 38 | 41 | 1200 | 90 |
  | NG+2+ (k 6) | 350 | 14–18 | 42 | 46 | 1500 | 110 |

- **Level cap 15** when `ngPlus ≥ 1` (10 otherwise). EXP to next keeps the rule (L10→11
  516, 619, 743, 892, L14→15 1070); HP and MP keep growing (L15: 104 HP, 38 MP); armor
  stays at Full Metal (−3); big Party! as from L7.
- **Catch-up stays on**, with expected levels + k (NG+1: Shallows 7, Reedwater 9,
  Highwater 10, Murk 11, Ditch 12), so a lower carry (L8) catches up instead of falling
  behind; an L10 carry gets it less often.
- **Level gates** use + k: the lantern at Level 5 + k (9 at NG+1; Whorl's line and the goal
  line show "(Level n/9)").
- **Swim Away:** 10% against fish of Level 5 + k or more, 75% below (so the Shallows and
  most of Reedwater stay escapable, as in the first run).
- **Red glow, party gap rule:** unchanged (they compare levels, so they already work).

**The Gar remembers you** (by `lastEnding`, the most recent ending of the slot it came
from; both endings stay reachable):

| | After fins | After friendship |
|---|---|---|
| Gar's opening line | "...YOU. AGAIN." | "...FRIEND? WHY... FIGHT?" |
| Its fight | the special ×1.1 (table above) | the party meter starts at 1 of 4 |
| Finn, after `gateOpen` | "It's back, and it remembers your fins. It'll hit harder this time." | "It remembers you, friend. Your party may reach it sooner this time." |
| Mossy, when freed | "You again! It's angrier than ever, be careful!" | "It kept asking for you, you know." |

**Badge.** The HUD shows "Lv 12+" (a "+" after the level) whenever `ngPlus ≥ 1`; the slot
screen shows "NG+ n".

### 4. Save slots (asked for during this change)

- **Three save slots** instead of one global save: localStorage keys `bettarpg-save-1`,
  `-2`, `-3` (the same versioned JSON and validation), plus `bettarpg-last-slot` ("1"–"3").
- **Title:** **Continue** loads the last-played slot (shown only if it exists and reads).
  **Load** opens the slot screen: each slot shows the betta's portrait in its colour, name,
  level (with "+" / "NG+ n"), area, friends, endings seen, and when it was last played
  (`lastPlayed`); empty slots say "Empty". **Delete** on a slot, with a confirm.
  **New Game+** on a slot that has finished an ending (subsection 3).
- **New Game** picks a slot: an empty one goes straight to Create; a used one asks
  "Overwrite <name>'s game (Level n)?" first.
- **New Game+** asks which slot to start it in; the default is an empty slot, never
  silently the finished one (subsection 3).
- **Migration:** on first load, if no `bettarpg-save-n` exists and `bettarpg-save` does,
  its text is copied into `bettarpg-save-1` and read back; once that slot reads, the old key
  is renamed to **`bettarpg-save-migrated`** (kept, never deleted automatically) and
  `bettarpg-last-slot` = "1". (Not `bettarpg-save-backup`: the published game already writes
  that key for an unreadable save, and it must not be overwritten.) An unreadable old save
  is moved as-is and shows as "Can't read this save" with Delete. Players of the published
  game lose nothing.
- Autosave writes to the current slot only (and sets `lastPlayed` and `bettarpg-last-slot`).
  Settings and controls stay global.
- Controller, keyboard and touch all work on the slot screen; the text fits at every size.

**Save format (stays `v: 1`).** Bumping the version would make `sanitize` return null and
wipe every published save, so new fields are optional with defaults:

- `ngPlus`: int 0–99, default 0. Read **before** the level.
- `level`: clamped 1..(`ngPlus ≥ 1` ? 15 : 10) (today 1..10, which would drop an NG+ L13).
  `PLAYER.maxLevel` becomes `maxLevel(s)`; `addExp` uses it (the EXP-zeroing at the cap
  stays, at the slot's cap).
- `lastEnding`: 'fins' | 'friend' | null; default `raw.ending` if valid. Set on every
  ending (`ending` stays the first one seen).
- `lastPlayed`: int ms, default 0.
- `KINDS` (state.js:33) gains `'snarl'` (count clamped 0–1); `REGULAR_KINDS` doesn't.
- `rest`: also accepts `'steps'` (only if `trailFound`, else village).
- New flags (`snarlMet`, `snarlDone`, `snarlFriend`, `stepsKnown`) pass the existing
  boolean filter.
- **Pre-change saves get `snarlDone`:** `sanitize` sets it when any of `highwater`,
  `lantern`, `gateOpen`, `garDefeated`, `garFriend` is set, or `rest === 'highwater'`, or
  the save's area is `murk`/`ditch`, or it's in `highwater` with `pos.y < 470`. (Whorl sets
  `highwater` even below Level 5, story.js:206, so every save that met him is covered.) For
  them the Snarl sits defeated in its pool, net on the steps.
- Settings gain `parade: true` (global key, default when missing).
- Tests: a published v1 full-game save (Gar done, `highwater` set, no new fields) loads into
  slot 1 with `snarlDone`, `ngPlus 0`, `lastEnding` = its `ending`; an NG+1 L13 save with
  `friends.snarl 1` round-trips unchanged; an unreadable slot shows "Can't read this save".

### 5. Simulator rows (in `tools/sim_design.py`, run, all 58 targets met)

The rules above are in the simulator (`kind='snarl'`, `gar=gar_ng(k)`, `meter0`). Policy
addition: a whole net counts like a shell (Gravel Grenade first, L4+); Tangled turns use
Attack (or an item by rule 1); Party! only once the net is ripped. Player levels in NG+ rows
are estimates: an L8 carry reaches about L9 at the Snarl, L10 in the deep Murk and L12 at
the Gar; an L10 carry about L11, L12 and L13–14. `sim-battles.mjs` must reproduce these
rows within ±3 points at build time, as for the rest of the table.

| Fight (start MP) | Target | Win | Friend | Turns | HP left | Net MP |
|---|---|---|---|---|---|---|
| Snarl L5 vs L4 B, 2 Kelp (full) | win ≥ 95%, 6–10 turns | 99.2% | — | 8.9 | 44% | 15.0 |
| Snarl L5 vs L4 B, 2 Kelp (half) | win ≥ 90%, ≤ 11 turns | 97.5% | — | 9.8 | 40% | 8.0 |
| Snarl L5 vs L4 B, no items (full) | win 65–92% (items matter) | 79.5% | — | 8.0 | 29% | 15.0 |
| Snarl L5 vs L5 B, 2 Kelp (full) | win ≥ 99%, 6–10 turns | 100% | — | 6.8 | 53% | 18.0 |
| Snarl L5 vs L5 B, 2 Kelp (half) | win ≥ 97%, 6–10 turns | 100% | — | 7.9 | 50% | 8.0 |
| Snarl L5 vs L3 B, 2 Kelp (full; no Grenade) | win 50–85% (possible, not easy) | 74.8% | — | 11.3 | 29% | 12.0 |
| Snarl befriend: L5 vs L4 B, 3 friends, 2 Kelp (full) | friend ≥ 30%, friend-or-win ≥ 95% | 96.7% | 35% | 8.8 | 48% | 13.2 |
| Snarl befriend: L5 vs L4 B, 3 friends, 2 Kelp (half) | friend ≥ 28%, friend-or-win ≥ 85% | 88.6% | 35% | 10.2 | 42% | 3.0 |
| Snarl befriend: L5 vs L5 B, 3 friends, 2 Kelp (full) | friend ≥ 50%, friend-or-win ≥ 98%, HP within 5 points of fighting, net MP ≤ fighting | 100% | 59% | 6.5 | 64% | 12.1 |
| Snarl befriend: L5 vs L5 B, 3 friends, 2 Kelp (half) | friend ≥ 50%, friend-or-win ≥ 97% | 100% | 56% | 7.9 | 58% | 2.2 |
| NG+1, L8 carry: Snarl L9 vs L9 B, 2 Kelp (half) | win ≥ 95%, 6–10 turns | 99.8% | — | 8.8 | 39% | 13.0 |
| NG+1, L8 carry: Snarl befriend L9 vs L9 B, 3 friends, 2 Kelp (half) | friend ≥ 60%, friend-or-win ≥ 97% | 99.7% | 79% | 6.6 | 62% | 6.0 |
| NG+1, L8 carry: Murk deep Cichlid L12 vs L10 B (half) | win ≥ 90%, ≥ 25% HP | 95.9% | — | 5.4 | 32% | 13.0 |
| NG+1, L8 carry: Murk deep Crayfish L12 vs L10 B (half) | win ≥ 90%, ≥ 20% HP | 97.5% | — | 6.1 | 26% | 13.0 |
| NG+1, L8 carry: Gar L14 vs L12 B, 3 Seed Cakes (full) | win ≥ 75%, 7–12 turns | 98.0% | — | 11.5 | 45% | 30.0 |
| NG+1, L8 carry: Gar L14 vs L12 B, no items (full) | win ≤ 35% (items and levels matter) | 26.0% | — | 10.1 | 23% | 30.0 |
| NG+1, L8 carry: Gar L14 vs L12 B in the sub, no items (full) | win ≥ 90% | 100% | — | 9.8 | 74% | 30.0 |
| NG+1, L8 carry, after fins (special 41): Gar vs L12 B, 3 Seed Cakes (full) | win ≥ 75% | 94.9% | — | 11.7 | 41% | 30.0 |
| NG+1, L8 carry: Gar friendship L12 B, 5 friends, no items (full) | friend ≥ 85% | 100% | 100% | 4.8 | 58% | 19.0 |
| NG+1, L8 carry: Gar friendship L12 B, 5 friends, 2 Bubble Waters (half) | friend ≥ 85% | 100% | 100% | 5.6 | 51% | 19.0 |
| NG+1, L10 carry: Snarl L9 vs L11 B, 2 Kelp (half) | win ≥ 99% | 100% | — | 7.0 | 53% | 15.0 |
| NG+1, L10 carry: Snarl befriend L9 vs L11 B, 3 friends, 2 Kelp (half) | friend ≥ 70% | 100% | 82% | 5.6 | 75% | 10.9 |
| NG+1, L10 carry: Murk deep Cichlid L12 vs L12 B (half) | win ≥ 95%, ≥ 35% HP | 100% | — | 4.5 | 50% | 15.0 |
| NG+1, L10 carry: Murk deep Crayfish L12 vs L12 B (half) | win ≥ 95%, ≥ 35% HP | 99.9% | — | 5.2 | 45% | 15.0 |
| NG+1, L10 carry: Gar L14 vs L13 B, 3 Seed Cakes (full) | win ≥ 95%, 7–12 turns | 100% | — | 10.5 | 50% | 33.0 |
| NG+1, L10 carry: Gar L14 vs L14 B, no items (full) | win ≥ 90% | 97.5% | — | 8.6 | 31% | 35.0 |
| NG+1, L10 carry, after fins (special 41): Gar vs L13 B, 3 Seed Cakes (full) | win ≥ 90% | 99.8% | — | 10.7 | 46% | 33.0 |
| NG+1, L10 carry, after friendship (meter starts at 1): L13 B, 5 friends, no items (half) | friend ≥ 85% | 100% | 100% | 3.0 | 91% | 10.0 |
| NG+1 Edge Cichlid L14 vs L12 B (full) | win 35–70% (optional and scary) | 37.9% | — | 6.2 | 26% | 29.8 |
| NG+1 Edge Crayfish L14 vs L12 B (full) | win 35–70% | 48.2% | — | 7.0 | 15% | 30.0 |
| NG+2: Gar L16 vs L15 B, 3 Seed Cakes (full) | win ≥ 90% | 100% | — | 10.6 | 43% | 38.0 |
| NG+2: Gar L16 vs L15 B, no items (full) | win ≤ 85% (still needs items) | 71.1% | — | 9.1 | 25% | 38.0 |
| NG+2: Gar friendship L15 B, 5 friends, no items (full) | friend ≥ 85% | 100% | 100% | 4.8 | 61% | 19.0 |

The original 2.5×-Cichlid Snarl (170 HP) missed its own targets in the same simulator (L4
with 2 Kelp: 45–54% win in 14–15 turns), which is why its HP is 113. The NG+ edge rows
mirror the first run's (35–70%), so the edge zones stay the optional scare.

### 6. Build notes: routes, runner, debug hook

- **Config:** `SNARL` (the numbers above), `NGPLUS = { bonus: (n) => n >= 2 ? 6 : n >= 1 ? 4
  : 0, cap: 15 }`, `garFor(k, lastEnding)`; `AREA_START.murk` and `.ditch` gain
  `snarlDone`; `.highwater` doesn't (it starts at the Spillway's foot, before the Snarl).
- **Routes to re-record:** `area-3-highwater.json` (start 3 → touch the Spillway Spring at
  (700, 836) → path to (768, 490) → the Snarl fight, policy `fight` → expect `snarlDone` →
  Whorl as before); `full-game.json`: after step 56 (arrived in Highwater, about L4) insert
  the Spring touch and the Snarl fight (expect `snarlDone`); if the recorded run is below
  L4 when it arrives, grind the west side pool first. Steps 64–89 then pass (768, 420) three
  times: the gate is open and the sulking/friend Snarl sits in the east pool, not solid, so
  they replay unchanged. Re-run every other route to confirm nothing else moved.
- **New routes:** `snarl-friend.json` (start 3, `set({ friends: { guppy: 3 } })`, policy
  `party`: Grenade, then Party! → expect `snarlFriend`, `friends.snarl 1`, torn net on the
  steps, Snarl in its pool); `snarl-lose.json` (start 3, `set({ hp: 1, items: { kelp: 0, bwater: 0 } })`,
  policy `fight`, lose → expect area highwater at the `steps` entry, `rest: 'steps'`, the
  Snarl at full HP, and a rematch after swimming 120 px away); `ngplus.json`
  (`set({ endingsSeen: { fins: true }, lastEnding: 'fins', level: 10 })`, save, title → New
  Game+ → slot 2 → confirm → expect `ngPlus 1`, level 10, flags empty but `tutorialDone`,
  rest village, slot 1 untouched; then `goToLevel(1, { ngPlus: 1 })` → expect Shallows fish
  L5–6; then `goToLevel(5, { ngPlus: 1 })` at Level 13 with 5 friends, policy `gar-party` →
  expect `garFriend`); `slots.json` (`legacySave(v1 full-game save)` → reload → expect slot
  1 with `snarlDone`, `bettarpg-save-migrated` present; delete slot 2; overwrite confirm).
- **Runner (route-runner.js 66–76):** in the `party`/`stump` policy, add before the
  bites: **if the enemy is the Snarl and its net is whole, Gravel Grenade first** (L4+,
  MP ≥ 10; `Digit2`, `Digit2`), else Attack (the bites fray it). Only the Snarl: the
  Crayfish rule stays, so `peace.json` and the other recordings don't change. In every
  policy, **when `inBattle.tangled`, Attack** (or the heal item), never a dimmed button.
- **Debug hook additions:** `state()` gains `ngPlus`, `lastEnding`, `slot`, `parade` (count
  shown), `snarl: { done, friend }`, and in `inBattle`: `net` (knots left, 0 = ripped),
  `tangled`, `sturn`, `warned`; `set()` accepts `ngPlus`, `lastEnding`, `endingsSeen`,
  `rest: 'steps'`; `goToLevel(n, { afterSnarl, ngPlus })` (`afterSnarl` for n = 3 adds
  `snarlDone` and starts at the city's south edge (768, 420); `ngPlus` applies the bonus);
  `slots()` lists the slot summaries (slot, name, level, ngPlus, area, friends, endings,
  lastPlayed, unreadable); `startNgPlus(from, to)` does what the menu does;
  `legacySave(obj)` writes `bettarpg-save` and reruns migration (tests only). All with
  `?debug` only.

### 7. Assets for this change (all made)

| ID | What it is | Tool | Target size and format | Transparent | Animation | Priority |
|---|---|---|---|---|---|---|
| E4 | The Snarl: Mitten Crab tangled in a net (`boss/snarl.png`), and freed (`boss/snarl_free.png`, an edit of it; hat versions in code from the kept hat) | imagegen2 (betta as style ref) | 47×34 and 46×31 native; ×1 on the map, ×3 in battle | yes | code (claw sway, net bob) | must (made) |
| T4 | Torn net prop on the Spillway steps (`props/torn_net.png`) | imagegen2 | 40×23 native, ×1 | yes | — | must (made) |
| S27 | `net_throw.mp3`: net-throw whoosh | audiogen sfx | 0.3–1 s mp3 | — | — | must (made) |
| S28 | `net_rip.mp3`: net rip (also the "freed" sound on befriend) | audiogen sfx | 0.3–1 s mp3 | — | — | must (made) |

Drawn in code: the thrown net (3-frame tween), the Tangled overlay on the betta or Bubble
(1-px mesh in the net's colour), the mesh-bit puff, the net knot pips, the Spillway Spring's
bubbles. Reused: the Spillway backdrop, the battle track, `gar_charge` (warning), the
befriend and hit sounds. Totals become 17 generated pictures + 3 Snarl images, 28 sounds.

### 8. Definition of done for this change

- [ ] The Snarl blocks the top of the Spillway steps (no way round), fights and befriends by
      the rules above, and after `snarlDone` the gate is open, the torn net lies on the steps
      and the Snarl sits in the east pool, never fought again.
- [ ] Net Throw every 3rd Snarl turn with its warning; a Tangled turn allows only Attack or
      an item, Bubble nibbles you free that round; a throw on Bubble skips Bubble's action.
- [ ] Net armor −2 with its own line; the Grenade or 4 knots rip it; Party! refused (no MP,
      no turn) while it's whole, with the line naming the Grenade.
- [ ] Losing to the Snarl wakes you at the Spillway Spring; the Spring rests you free.
- [ ] Every row of subsection 5 passes in `sim_design.py` and in `sim-battles.mjs` (±3).
- [ ] The parade follows you in the village and Highwater's city only, waits at the top of
      the steps, never blocks talking, turns off in Settings, and isn't doubled at the Peace
      party.
- [ ] New Game+ starts only in a chosen slot (the finished game stays to Continue), with the
      exact carry/reset lists; NG+ enemies are + k levels, the Gar uses its NG+ row and
      remembers the last ending; catch-up, the lantern gate and Swim Away use + k; the cap is
      15 and the "+" badge shows.
- [ ] Three slots with Continue/Load/Delete/overwrite confirm; a published save migrates to
      slot 1 (kept as `bettarpg-save-migrated`), gets `snarlDone` if it's past the steps,
      and an NG+ L13 save round-trips; an unreadable slot never crashes.
- [ ] `area-3-highwater.json` and `full-game.json` re-recorded; `snarl-friend.json`,
      `snarl-lose.json`, `ngplus.json` and `slots.json` pass; every other route still passes.
- [ ] The debug hook additions work with `?debug` only.
- [ ] The Snarl at ×3, the net overlay and the slot screen look right at 1280×720 and on the
      844×390 phone.

## Change 2 (2026-11-22): Flare, and a clean start to every fight

From issues #1 and #2 (player reports).

- **Fights open cleanly (#1).** The fighters' places come from the battle HUD and menu, which
  were still hidden while the transition faded in, so for a moment every fish sat at the top
  of the screen. The battle UI is now filled in and shown while the transition still covers
  the screen (as the world HUD already was), and the layout falls back to mid-screen if the UI
  is ever missing.
- **Flare (#2).** A betta's signature move: Swim Away becomes **Flare** against fish far enough
  below you (see the move table). Your fins fan out in your colour, you glow, the water
  ripples and shakes; the fish startles ("!"), turns tail and darts off. A failed flare gets
  a "..." and the fish's turn. No EXP or Betta Bites screen: it's a way past a fish, not a
  win; the fish drops a single Betta Bite pickup as it flees. All drawn in code, no new art
  or sound (it reuses `armor` and `swim_away`).


---

## Change 5: Houses you can enter (2026-11-23)

The request, in the person's words: "in a typical RPG they would each be situated in their houses and
there'd be entry/exit and interiors. We'd want to keep the pixel style and these are betta fish
versions of the same old shops, homes, whatever. We want to evoke familiar interiors while feeling
fun and fishy."

### What changes for the player

- **Doors.** Every house, shop and inn in Paddy Village and Highwater has a door you can swim into.
  Swim **up** into the doorway (keys, stick, or the touch stick) and the screen wipes into the room;
  swim **down** through the doormat at the bottom of the room to go back outside, landing just below
  the door. Only swimming *into* a door enters it, so gliding past along the path never pulls you in.
  A room has as many doorways as its building has doors: the Swishy Solace Inn has two arches outside
  and two doorways inside; each door leads to its own doorway, and each doorway back out of its own door.
  Doors you can't use say so when you swim up (the guard post's gate: "GUARDS ONLY").
  A soft pulsing arrow on the doormat shows the way out the first time you're inside.
- **Villagers live indoors**, each where you'd expect them in an RPG:

  | Where | Inside | Who |
  |---|---|---|
  | Paddy Village | **Elder Finn's House**: a cosy study with a map of the paddies, scroll racks, a shell desk | Elder Finn (the opening happens here) |
  | Paddy Village | **The Fish Mart**: shelf aisles of jars and kelp, a counter with a scale-weighing clam | Coral behind the counter |
  | Paddy Village | **The Swishy Solace Inn**: a front desk, sponge-and-kelp sleeping pods, a bubble lamp | Seaweed at the desk |
  | Paddy Village | **Bubble's Home**: a kid's room with "hero" doodles, a toy sword, a shell bed | Bubble (until Bubble joins you; afterwards the room is empty, with a sign: "BUBBLE'S ROOM. Heroes only!") |
  | Highwater | **Kelpie's Inn**: the bigger, grander inn, lanterns and kelp beds | Kelpie at the desk |
  | Highwater | **The Lock House**: brass pipes, levers, a cog wheel, the drain-gate workings | Whorl the lock-keeper |
  | Highwater | **Three homes** (the lilac and the coral house, and the old house by the east wall): the yellow house is Little Bream's family home (kid's drawings, a tea set); the coral house is **Dace's own coral-orange den** (a cork board of shadow sketches, a spyglass at the porthole, a kelp hammock); the old house by the east wall is **Minnow's own den** (a gate fan's room: a Highwater map with the Lock House circled, a workbench of toy water-wheels, a model lock gate, a sponge bed) | one townsfish each (folk1, folk3 and folk6 move in; the rest stay out in the street, which keeps Highwater lively) |

  **Stalls stay open-air.** Pip's stall and the teal stall are market stalls with no walls: Pip and
  the teal stall's keeper now stand *behind* their counters instead of beside them, so you talk to
  them across the counter. **Reef stays on guard** at the east gate: the guard post is a lookout, not a
  home, and Reef's job is the gate.
- **A new game begins inside Elder Finn's house**, Finn waiting for you by his desk; the opening plays
  there, then you swim out the door into the village. The "Paddy Village" banner shows as you first
  swim outside.
- **Resting**: losing a fight after resting at an inn now wakes you *inside* that inn, by the
  sleeping pods. Springs are unchanged.
- **Indoors is calm**: no wild fish, no critters or shimmer; a cosy indoor music loop (soft, the village
  theme's family); a door sound going in and out, and a little shop bell at the Fish Mart.

### Rooms

- One screen each, no scrolling: **384×256** art pixels (the native grid), centred in the view with
  a dark surround, like a classic RPG room floating in the dark. A betta (45 px) is about 1/8 of the
  room's width, so a room reads cosy, not empty.
- Top-down 3/4 RPG view: back wall across the top with its décor, floor below (sand and pebbles, a
  woven reed rug), furniture with clear walkable floor between, and the door at the bottom centre
  with a doormat.
- **Familiar but fishy:** counters made of driftwood, shelves of jars and kelp bundles, shell
  furniture, bubble lamps, sea-glass windows, kelp curtains, sponge beds, coral pots. No humans' things
  that would break the world (no chairs for legs: stools are flat rocks and shells).
- Each room is one generated image, snapped to the game's palette and native grid like the battle
  backdrops; solid furniture is a short list of rectangles per room, set by eye from the art, and
  checked with the reachability tool (every NPC can be reached to talk, every room's exit is reachable).
- Rooms named on entry by the small area banner ("Elder Finn's House").

### Tech

- Interiors are areas like the others (`MAPS`), with `interior: true`, a `backdrop`, `solid` rects,
  one exit back out, and an `entries.door` just above the doormat. Not in `AREAS` (the level list),
  so the debug level list, catch-up EXP and New Game+ are unaffected.
- Outside, each building gets `door: { x, to, entry }` (x within the sprite); the door rect sits at
  the bottom of the building's footprint; it fires only while the player swims upward into it.
- The world skips tufts, rice, scatter, critters, shimmer and fireflies indoors, and draws the
  backdrop instead of the terrain. The parade stays outside (it only runs in the village and
  Highwater's city); Bubble follows you in.
- Saves inside a room load inside the room. `REST.village` and `REST.highwater` wake you at the inn's
  `bed` entry.
- The Load screen and pause goal name the room where they name an area.

### Assets (budget $20)

| ID | Asset | Tool | Notes |
|---|---|---|---|
| R1 | Elder Finn's House room | imagegen2 (high, 1536×1024), refs elder_dwelling + betta | 384×256 native |
| R2 | Fish Mart room | imagegen2, refs fish_mart + betta | |
| R3 | Swishy Solace Inn room | imagegen2, refs swishy_solace_inn + betta | |
| R4 | Bubble's Home room | imagegen2, refs bubble_home + bubble | also a Highwater home, recoloured |
| R5 | Kelpie's Inn room | imagegen2, refs highwater_inn + betta | |
| R6 | Lock House room | imagegen2, refs lock_house + betta | |
| S1 | Door (in and out): a soft wooden door with a bubbly whoosh | audiogen | |
| S2 | Shop bell: a small shell wind-chime | audiogen | Fish Mart only |
| M1 | Indoors: a cosy, quiet loop | audiogen music | all rooms |

Estimated about $3 to $5 of art (six rooms, retries included) and the audio from ElevenLabs credits.
Cut list: if a room won't come out right after two takes and a change of approach, it reuses
another room recoloured; the music falls back to the village theme played softer.

### Done when

- Every listed building can be entered and left, at every screen size, by keys, controller and
  touch; every villager inside can be talked to; shops and inns work from inside.
- A new game starts in Finn's house and the whole game plays through (the recorded routes updated to
  swim in and out of doors; the full-game run passes).
- A save made inside a room loads inside it; waking after a loss puts you in the inn you last rested at.

### Change 5 after review (round 1): what's settled

- **Rooms are their own table**: `ROOMS = { id: { parent, name } }` in config.js. Saves accept room ids; save
  migrations and "Swim home" go by the parent area; the Load screen says "Paddy Village: Fish Mart". Loading a
  room save checks the spot is free (solids included) and falls back to the room's door entry. The save tests
  get a room save.
- **Room geometry**: each room has `shapes: [['r', -20, -20, 424, 296, 1, 0]]` (all water, edges past the
  room, collision only), `safe: true`, and `solid` rects for the walls and furniture (read by `solids()`).
  The decorations (tufts, rice, scatter, critters, shimmer, fireflies) are skipped indoors; the surround is
  dark, not water blue. Bubble is kept out of solids and inside the room.
- **Doors, in numbers**: outside, a door zone 28×14 just below the footprint at the drawn door, tested against
  the betta's head, entered by pushing up (stick or keys, y < -0.4) **or by pressing Talk** (the prompt reads
  "Enter Fish Mart"), so touch and diagonal approaches work. A woven doormat is drawn in code under every door
  that opens. The Inn's two arches are two zones into the same room; the Fish Mart's door is its shopfront's
  middle (its doormat marks it). Inside, the exit is the drawn doormat (bottom centre, the same spot in all
  rooms); the inside landing is more than 16 px outside the exit's slack; the outside landing is 24 px below the
  foot. `tools/check-reach.mjs` (from check-pickups) proves for every area and room: every NPC and examine spot
  can be reached to talk, every exit and door can be reached, every entry is free and clear of every exit.
- **In front and behind**: furniture that keepers stand behind (counters, desks) is cut from the room image as a
  foreground strip drawn in the y-sorted list, so Coral, Seaweed and Kelpie stand *behind* their counters.
  Pip and the teal stall's keeper stay beside their stalls, as now (the stall's art would hide them).
- **Things to look at**: each room has 2 to 4 examine spots using the Talk prompt ("Look at the map"), each with a
  short fishy line; three rooms hide a one-time Betta Bite or two in a jar or pot. Bubble's room gets a small
  code-drawn sign once Bubble has joined ("BUBBLE'S ROOM. Heroes only!" in the dialogue box).
- **Paddy Village stays lively**: three townsfish move into the village street (recoloured townsfolk sprites,
  with their own lines), so the street isn't empty once the shopkeepers go inside.
- **Highwater homes**: a seventh room, a plain townsfish family home (R7, made from R4's layout without the kid's
  things), used for the three Highwater homes; folk1, folk3 and folk6 live in them.
- **Sound**: rooms keep the area's music playing (no restart at the door); door transitions play a door sound
  instead of the area swoosh; the Fish Mart plays a shell bell as you come in. The indoor music track (M1) is
  dropped: the continuous outdoor theme is smoother.
- **Opening**: the new game starts in Finn's house with the swim hint; the "Paddy Village" banner and "The south
  gate is open!" come as you first swim out. After that, leaving a room never shows the area banner; entering
  one shows the room's name as a small toast.
- **Phones**: on touch screens the room sits right of the stick zone, clear of the Talk button.
- **Shadows**: a soft shadow under every fish indoors, so yellow Bubble reads on the sand floors.
- **Debug hook**: `__game.enter(id, entry)` and `__game.rooms()`; `state()` reports the room and its parent.
  `goToLevel(0)` keeps the outdoor village start (for the screen tours); a New Game starts indoors.
- **Routes and tests updated**: area-0, full-game, area-1, area-3, ngplus, peace and the others that visit
  Seaweed, Kelpie or Whorl swim through doors; ngplus and test-saves expect Finn's house after the opening.
- Estimate: rooms by nanogen (about $0.13 a take: seven rooms with a retry or two, about $1.50), sounds about $0.30.
