# Betta RPG

*Small fish, big paddies. Find the missing fish, with your fins or your friendship.*

You're a young betta from Paddy Village, and fish keep vanishing from the outer paddies.
Swim the sunlit rice-paddy terraces, battle or befriend the fish in your way, gear up from
helmet to full metal, and follow a trail of strange scales up to the city on the next
terrace and down into the dark Murk, where something very old and very lonely is waiting.
Every fight can become a friendship, and the village remembers what you did.

**[▶ Play Betta RPG](https://bettarpg.synapticnoise.com/)** in your browser. No
install, works on desktop and on phones, with keyboard, mouse, touch or a controller.

![Title screen](media/screenshots/title.png)

## The paddies

| | |
|---|---|
| ![Paddy Village](media/screenshots/village.png) | ![The Shallows](media/screenshots/shallows.png) |
| **Paddy Village.** Every house and shop has a door: swim in to find Elder Finn, Shopkeeper Coral, Bubble the Brave and the Swishy Solace Inn at home. | **The Shallows.** Your first fights, your first friend, and the Old Stump, where Bubble finally comes along. |
| ![Elder Finn's House](media/screenshots/finn-house.png) | ![The Fish Mart](media/screenshots/fish-mart.png) |
| **Indoors.** Your adventure starts in Elder Finn's study. Nine rooms in the two towns, each with something to look at (and a few Betta Bites tucked away). | **The Fish Mart**, Coral behind the counter. Shops and inns are inside now, the way an RPG should be. |
| ![A battle](media/screenshots/battle.png) | ![Highwater](media/screenshots/highwater.png) |
| **Battles.** Attack, Bubble Blast, Gravel Grenade, or **Party!**: Happy Balloon Time makes a friend instead of a fight. | **Highwater**, the city on the next terrace, where the Lock-Keeper knows what happened to the drain gate. |
| ![The Murk](media/screenshots/murk.png) | ![The Gargantuan Gar](media/screenshots/gar.png) |
| **The Murk.** Dark water, a borrowed lantern, three lost cogs, and Level-10 fish at the edges. | **The Gargantuan Gar.** Beat it, or bring five friends and throw it a party. |
| ![The Snarl](media/screenshots/snarl.png) | ![Save slots](media/screenshots/load.png) |
| **The Snarl.** A grumpy old crab tangled in a lost fishing net blocks the Spillway. It can tangle you up; rip its net with a Gravel Grenade, then fight it or free it. | **Three save slots,** and **New Game+** after either ending: keep your level and gear, the fish are tougher, and the Gar remembers how you left things. |

![The friendship ending](media/screenshots/ending.png)

## How to play

- **Swim:** arrow keys or WASD. On a phone, drag on the left side of the screen. On a
  controller, the left stick or d-pad.
- **Talk, pick up, confirm:** Space, E or Enter (✕ / A on a controller, the Talk button on a
  phone). The same button looks at things indoors.
- **Go inside:** swim up into a door (look for the doormat), or press Talk at it. Swim down
  through the doormat to go back out.
- **Battle:** Attack, Spells, **Party!**, Items or Swim Away (keys 1 to 5). Party! works
  best once a fish is worn down, and a new friend gives the same rewards as a win. Against
  a fish well below your level, Swim Away becomes **Flare**: spread your fins and scare it off.
- **Items:** I. **Go home to the village:** H or Home. **Pause:** Esc or P. **Mute:** M.
- Keys and controller buttons can be changed in Settings → Controls.
- Plug in a PS5 controller (USB or Bluetooth) and press any button; it works best in Chrome
  or Edge. Xbox and Switch Pro controllers work too.
- On a phone, hold it sideways. You can install the game from your browser's menu to play
  full screen, even offline.
- Found a bug? Pause and pick "Report a bug", or press Ctrl+Shift+F (you'll need a GitHub
  account).

Losing a battle is never the end: you wake at your last rest point (the inn you last slept
at, or a spring) with a few Betta Bites fewer. Progress saves by itself into one of three save slots; Continue picks up the latest,
and Load shows them all. There are two endings, a reward for making friends with every kind
of fish in the paddies, and New Game+ once you've seen an ending. In the village and
Highwater your friends swim along behind you in a parade (Settings → Parade turns it off).

## How it was made

Betta RPG is a remake of [the original Betta RPG](https://github.com/zeveck/bettarpg-original)
(2025), made by [Claude Code](https://claude.com/claude-code) with
[gamegen](https://github.com/zeveck/gamegen), from this request:

> `/gamegen --remake https://github.com/zeveck/bettarpg --leeway lots --plan-only --share-design --mockups $10`

gamegen surveyed and played the original, proposed a plan for the remake (kept exactly: all
of the original's art, names and quirks; new: a world to swim through, Bubble as a
companion, the city on the next terrace, and an answer to the mystery), and, once approved
("Proceed with the plan."), wrote the design, had it reviewed in two rounds by a player, a
builder and an art-and-sound director, and shared it with mock pictures. Then:

> `/gamegen --plans`

put the plan on [the plans page](https://synapticnoise.com/plans/), and

> `/gamegen --continue --budget 50 --gamepad --controls --feedback --art-sheet --publish`

built it, with controller support, changeable controls and a "Report a bug" button. gamegen
made the art and sound with these plugins, built the game, and play-tested it (two rounds of
final review, a polish pass on every screen at every size, and recorded routes that play the
whole game from New Game to the credits):

- [imagegen2](https://github.com/zeveck/imagegen2): the villagers, Highwater's folk, the
  village and Highwater buildings, the Dragonfly Nymph and Snapping Crayfish, the Gargantuan
  Gar, props, rice and item icons, all drawn to match the original sprites' pixel grid.
- [nanogen](https://github.com/zeveck/nanogen): the title, battle and ending backdrops, and the rooms.
- [anim8gen](https://github.com/zeveck/anim8gen): the betta's swim and the Gar's lunge.
- [audiogen](https://github.com/zeveck/audiogen): eight songs and thirty sound effects (the Snarl's net throw and net rip came later).

Before it went online, the name changed:

> It should still just be "Betta RPG" and not "Betta Fish RPG" on the title, etc.

and the original repo was renamed to make room ("Rename and proceed with the full publish."),
and Bubble moved out from behind the betta's tail on the social card ("The social image is
great but it's weird Bubbles is hidden behind the main fish's tail?"). Then:

> Do all three of the recommendations.

added the Snarl (a fishing-net mini-boss on the Spillway), the friends' parade and New Game+,
each reviewed, built and play-tested as a change, and

> Does the game have save slotS? There should be more than just one global save

added three save slots, moving any save from the first published version into slot 1. Two
issues filed on the repo ("Swim Away can become Flare once you're strong enough…") added
Flare and fights that open cleanly. Then a few small changes:

> The rice paddies include lily pads as one of the graphic elements. Let's remove those.

> For some reason when I approach the a cavern in the lower left of the paddie that says "Too dark to swim in there." I see a black rectangle instead of a proper graphic. We need to fix that and publish.

> The pause popup is oddly lower than I'd expect? It seems it should be vertically centered, but it's not, and on my laptop screen it got a scrollbar despite there being plenty of vertical space it could have sized into to avoid. Consider this and how best to fix.

> For the initial shallows I sometimes see a fish snack off in the dirt where it's unreachable. Unless there's some clever puzzle, we shouldn't place unreachable powerups like that.

and then the houses:

> `/gamegen --change Everybetta in the villages looks awesome, and they have cool little houses, but, in a typical RPG they would each be situated in their houses and there'd be entry/exit and interiors. We'd want to keep the pixel style and these are betta fish versions of the same old shops, homes, whatever. We want to evoke familiar interiors while feeling fun and fishy. --budget 20 --publish --no-confirm`

gamegen had the plan reviewed by a player, a builder and an art-and-sound director, made
seven rooms with nanogen (each from its building's outside and the first room, Elder Finn's
study, so they match) and a door sound and shop bell with audiogen, then built the doors and
rooms and re-recorded the routes to swim through them.

Then a bug check, with fresh testers on desktop, phone and controller:

> `/gamegen:gamegen --bugcheck`

> If you find any bugs, do a /gamegen:gamegen --fix all after.

> Actually, if you find any bugs, do a /gamegen:gamegen --fix all --publish --no-confirm after.

It found eight things worth fixing (the worst: on a phone, tapping to close a dialog opened it
again), fixed them all, and replayed every route. Last, Minnow got a room of their own:

> `/gamegen --change give Minnow's Highwater home its own room picture instead of reusing Elder Finn's --publish --no-confirm`

one more nanogen room, from the same first room so it matches.

and then the coral house got its own room too:

> `/gamegen --change give the coral house its own orange room instead of sharing the lilac house's yellow one --publish --no-confirm`

Dace, who watches the old outflow pipe at night, got a coral-orange den with a spyglass at the porthole.

Then an issue, filed and fixed in one go:

> Report an issue that The interior of the The Swishy Solace Inn should have two doors to match its exterior depiction. Make sure we're consistent in general. and then /fix it and publish no-confirm.

gamegen filed [#3](https://github.com/zeveck/bettarpg/issues/3), redrew the inn's room with two doorways
(each door now leads to its own doorway and back), checked every other building (one door outside,
one doorway in), gave the guard post's gate a "GUARDS ONLY" sign so it no longer just ignores you,
and replayed every route.

The original game's pixel art (the betta in four armor stages, the five enemies, the party
hats, the submarine, Paddy Village and the rice tuft) is used as it was, shrunk to its
native pixels; the full-size originals are in `source-art/`. The design, reviews and asset
notes are in [`design/`](design/).

## Replaying the tests

Every area and both endings have a recorded route in `design/solutions/`, the proof the game
can be finished. Serve the `game` folder, open it with `?debug` on the address (the test
hook only exists then) in a `playwright-cli` session, then replay routes with real key presses:

    tools/run-routes.sh <session> design/solutions/area-1-shallows.json
    tools/run-routes.sh <session> design/solutions/*.json

`tools/check-routes.mjs` checks every route's waypoints are in open water, and
`node tools/check-reach.mjs` checks every pickup, villager, door, room exit and thing to look
at can be reached.
`node tools/sim-battles.mjs` plays every tuning fight 4,000 times and checks the balance
targets (both paths, fins and friendship), against the design's own
`tools/sim_design.py`.

## Playing locally

Betta RPG is a plain web page with no build step. Serve the `game` folder with any
static web server, for example:

    cd game
    python3 -m http.server 8000

then open http://localhost:8000.

## Credits

Idea and original game by Rich Conlan. Font: BettaPixel, made from Pixelify Sans (SIL Open
Font License, `game/fonts/OFL.txt`).
