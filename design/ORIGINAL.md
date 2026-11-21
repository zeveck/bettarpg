# The original: Betta RPG v0.4.10

Surveyed from github.com/zeveck/bettarpg (39 commits, July–Aug 2025; built with Claude Code,
art by ChatGPT). Played in a browser on 2026-11-19: loads with no console errors.

## What it is

A browser turn-based RPG. You make a betta (name + one of 5 colors), start in Paddy Village
(5 NPCs as buttons: Elder Finn, Shopkeeper Coral's Fish Mart, Guard Captain Reef, Bubble the
Brave, Innkeeper Seaweed at the Swishy Solace Inn), then "swim" N/S/E/W by buttons or arrow
keys across a grid of rice paddies. Random encounters start turn-based battles (Attack,
Bubble Blast 3 MP, Gravel Grenade 5 MP from L4, Happy Balloon Time 7 MP from L7 which
befriends instead of hurting; Swim Away). Enemies: Aggressive Guppy, Territorial Angelfish,
Sneaky Catfish, Fierce Cichlid, and the Prehistoric Gar boss ("GARGANTUAN GAR" special).
Currency is Betta Bites; the Fish Mart sells Kelp Snack (3), Bubble Water (2) and the
Dunkleosteus Submarine (100), which overrides armor and shrugs off the Gar's special.
Armor sprites change at L3/5/7. Befriending everything gives "PEACE IN THE PADDIES!".

## What works

- The whole loop: create → village → paddies → battle → level up → shop → boss.
- Clean, configurable code (GameConfig/GameStrings), keyboard play, mute toggle.
- The art: 26 consistent chunky pixel-art sprites (see below). This is the best part.

## What's broken or thin

- Moving is pressing buttons over a static background; the "world" is a grid of numbers.
- The story stops at the setup: fish are disappearing, nobody finds out why.
- Bubble asks to come along, never can. The "big city on the next terrace" never appears.
- NPCs cycle fixed lines and never react (the DIALOGUE_SYSTEM_PROPOSAL wanted this fixed).
- Difficulty spikes: a Level-4 Fierce Cichlid met at Level 1 a few steps from the village.
- Phones: layout overflows in combat (the original's own mobile evals show it).
- Audio is synthesized beeps.
- Cheat keys `$` (Betta Bites) and `%` (level up) are live in the public game.

## Possibly intended quirks (keep)

- The Gar roars instead of attacking on turns 1, 4 and 7.
- Edge zones always hold Level-10 enemies.
- Fleeing from Level 5+ enemies is very hard (10%).
- Home key returns you to the village from anywhere (outside battle).
- Party hats appear on befriended fish (and on you).
- Pick-your-color betta, kept through every armor stage (hue-rotated).

## Agreed changes

- Smooth the early difficulty.
- Cheat keys only in a debug mode (`?debug`), not in the public game.

## Assets (all kept, copied to source-art/)

| Asset | Keep? |
|---|---|
| player_betta (4 armor stages) + party-hat versions | keep: style anchor |
| aggressive_guppy, territorial-angelfish, sneaky_catfish, fierce_cichlid, prehistoric_gar + party-hat versions | keep |
| dunkleosteus_sub (+ party hat), partyhat | keep |
| bettahome (village), rice_paddy_tuft | keep (village may be improved/extended to match new map) |
| water tiles (4) | replace: noisy, not seamless at game scale |
