# Assets log

## Price lookup (2026-11-19)

- **imagegen2 (OpenAI GPT Image):** neither imagegen2's `SKILL.md` nor its `reference.md` (v2026.11.6)
  gives a per-token or per-image rate ("For exact current costs, use the OpenAI pricing page"),
  so per the design the **assumed $0.45 per take** is used for `gpt-image-2.6-flare --quality high
  --size 1536x1024`. Each take's reported token `usage` is logged below so it can be re-priced
  once a rate is looked up. `gpt-image-2.5-flare` is "about 4x cheaper" (reference.md), so
  **$0.11 per take** is assumed for MK10b.
  MK6 take 1 reported usage: 1,338 input tokens (1,024 image + 314 text), 1,353 output image tokens.
- **nanogen (Gemini):** `gemini-3-pro-image` 2K = **$0.134 per image** (nanogen reference.md,
  "verified 2026-06-19").

### Re-plan after MK6 (before any other imagegen2 call)

At $0.45/take: MK1–MK4 2 takes each, 8 x $0.134 = $1.07; MK5a–MK10a (8 sheets) 2 takes each,
16 x $0.45 = $7.20; MK10b 2 x $0.11 = $0.22. Plan $8.49 + $1.35 reserve = **$9.84 <= $10**, so
no sheet moves to gpt-image-2.5-flare. The reserve pays for 3rd (single-subject) takes.

## Mockups (MK1–MK10b)

| ID | File | Tool | Model / quality | Prompt (short) | Tries | Est. cost | Running total | Verdict |
|---|---|---|---|---|---|---|---|---|
| MK6 t1 | .gamegen/candidates/mk6-take1.png | imagegen2 | 2.6-flare high 1536x1024 transparent | 5 villagers, ref betta | 1 | $0.450 | $0.45 | **accepted** -> villagers/*.png (grid-sampled); Coral snaps orange-ish |
| MK1 t1 | .gamegen/candidates/mk1-take1.jpg | nanogen | pro 2K 16:9, refs betta+tuft | title backdrop | 1 | $0.134 | $0.58 | **accepted** -> backdrops/title.png (box 6.37 px) |
| MK2 t1 | .gamegen/candidates/mk2-take1.jpg | nanogen | pro 2K 16:9, refs betta+tuft | Shallows backdrop | 1 | $0.134 | $0.72 | **accepted** -> backdrops/shallows.png |
| MK3 t1 | .gamegen/candidates/mk3-take1.jpg | nanogen | pro 2K 16:9, refs betta+tuft | Murk backdrop | 1 | $0.134 | $0.85 | rejected: too bright/blue, not murky |
| MK4 t1 | .gamegen/candidates/mk4-take1.jpg | nanogen | pro 2K 16:9, refs betta+tuft | Gar's pool backdrop | 1 | $0.134 | $0.99 | rejected: shore/sky above, mud not concrete |
| MK6 t2 | .gamegen/candidates/mk6-take2.png | imagegen2 | 2.6-flare high 1536x1024 transparent | 5 villagers (same prompt) | 2 | $0.450 | $1.44 | good; kept as alternative (Reef more gold) |
| MK5a t1 | .gamegen/candidates/mk5a-take1.png | imagegen2 | 2.6-flare high 1536x1024 transparent | Elder/Mart/Inn, refs bettahome+betta | 1 | $0.450 | $1.89 | rejected: blue domes (copied bettahome's night colours) vanish on blue water |
| MK5b t1 | .gamegen/candidates/mk5b-take1.png | imagegen2 | 2.6-flare high 1536x1024 transparent | guard post/Bubble home/south gate | 1 | $0.450 | $2.34 | **accepted** -> buildings/guard_post, bubble_home, south_gate |
| MK7 t1 | .gamegen/candidates/mk7-take1.png | imagegen2 | 2.6-flare high 1536x1024 transparent | nymph + crayfish | 1 | $0.450 | $2.79 | weak outlines, soft antennae |
| MK1 t2 | .gamegen/candidates/mk1-take2.jpg | nanogen | pro 2K 16:9 | title, terraces stepped | 2 | $0.134 | $2.92 | rejected: shows sky and banks above water |
| MK2 t2 | .gamegen/candidates/mk2-take2.jpg | nanogen | pro 2K 16:9 | Shallows (same) | 2 | $0.134 | $3.05 | ok, reeds fill lower middle; t1 kept |
| MK3 t2 | .gamegen/candidates/mk3-take2.jpg | nanogen | pro 2K 16:9 | Murk, 'entirely underwater, mostly murk' | 2 | $0.134 | $3.19 | **accepted** -> backdrops/murk.png |
| MK4 t2 | .gamegen/candidates/mk4-take2.jpg | nanogen | pro 2K 16:9 | Gar's pool, 'entirely underwater, grey concrete' | 2 | $0.134 | $3.32 | **accepted** -> backdrops/gar_pool.png (still a waterline across the middle) |
| MK5a t2 | .gamegen/candidates/mk5a-take2.png | imagegen2 | 2.6-flare high 1536x1024 transparent | + 'warm colours, NOT blue', bold outline | 2 | $0.450 | $3.77 | **accepted** -> buildings/elder_dwelling, fish_mart, swishy_solace_inn |
| MK5b t2 | .gamegen/candidates/mk5b-take2.png | imagegen2 | 2.6-flare high 1536x1024 transparent | + bold outline | 2 | $0.450 | $4.22 | rejected: Bubble's home blue again; t1 kept |
| MK7 t2 | .gamegen/candidates/mk7-take2.png | imagegen2 | 2.6-flare high 1536x1024 transparent | + bold outline, no wispy details | 2 | $0.450 | $4.67 | **accepted** crayfish -> enemies/snapping_crayfish; nymph unreadable after extraction (eye lost) |
| MK8 t1 | .gamegen/candidates/mk8-take1.png | imagegen2 | 2.6-flare high 1536x1024 transparent | Gargantuan Gar, refs prehistoric_gar+betta | 1 | $0.450 | $5.12 | rejected: copied the small ref as a 2nd figure; big one only ~38 cells |
| MK9a t1 | .gamegen/candidates/mk9a-take1.png | imagegen2 | 2.6-flare high 1536x1024 transparent | Highwater inn/Pip stall/lock house | 1 | $0.450 | $5.57 | **accepted** -> buildings/highwater_inn, pip_stall, lock_house (lilac awning snaps pink) |
| MK9b t1 | .gamegen/candidates/mk9b-take1.png | imagegen2 | 2.6-flare high 1536x1024 transparent | drain gate, Whorl, Pip | 1 | $0.450 | $6.02 | **accepted** -> buildings/drain_gate, villagers/whorl, villagers/pip |
| MK10a t1 | .gamegen/candidates/mk10a-take1.png | imagegen2 | 2.6-flare high 1536x1024 transparent | 10 props | 1 | $0.450 | $6.47 | **accepted** -> props/*.png (drew an extra plain stump: skipped) |
| MK10b t1 | .gamegen/candidates/mk10b-take1.png | imagegen2 | 2.5-flare high 1024x1024 transparent | 8 icons | 1 | $0.110 | $6.58 | rejected: bubble water and fizzy water look the same |
| MK8 t2 | .gamegen/candidates/mk8-take2.png | imagegen2 | 2.6-flare high 1536x1024 transparent | 'exactly ONE gar', finer grid | 2 | $0.450 | $7.03 | **accepted** -> boss/gargantuan_gar.png 92x31 (grid-sampled) |
| MK10b t2 | .gamegen/candidates/mk10b-take2.png | imagegen2 | 2.5-flare high 1024x1024 transparent | icons, distinct fizzy bottle | 2 | $0.110 | $7.14 | **accepted** -> icons/*.png (uniform 20 px cell); lantern muddled |
| MK7 t3 | .gamegen/candidates/mk7-take3.png | imagegen2 | 2.6-flare high 1024x1024 transparent | single subject: nymph | 3 | $0.450 | $7.59 | **accepted** -> enemies/dragonfly_nymph.png 35x16 |
| MK10b t3 | .gamegen/candidates/mk10b-take3.png | imagegen2 | 2.5-flare high 1024x1024 transparent | single subject: moss lantern | 3 | $0.110 | $7.70 | **accepted** -> icons/moss_lantern.png 7x13 |

**Mockups running total: $7.70 of $10** (25 takes: 8 nanogen pro at $0.134, 14 gpt-image-2.6-flare at the assumed $0.45, 3 gpt-image-2.5-flare at the assumed $0.11). No sheet moved to 2.5-flare.

Second takes were skipped for MK9a, MK9b and MK10a (first takes passed extraction), saving $1.35.

## Extraction and mock screens

- Kept art: `tools/extract-native.py --kept` -> `game/assets/native/original/` (same subfolders; water tiles skipped,
  they are palette sources only). Detected cells match the design table (betta 45x37, helmet 39x35, tuft 22x18,
  bettahome 111x88 after its vignette is thresholded). Cichlid frame and grid lines gone.
- Snap palette `tools/palette.png`: 14 design colours + 34 kept colours (20 by median cut over the distinct kept
  colours, 14 by max-coverage so the light greys, near-white, pinks and yellows get slots).
- Generated items: `tools/targets/*.json` (per-take overrides: `mk10a-take1.json` skips the extra stump and puts both
  cages on a 5 px cell; icons use one 20 px cell, kelp 24).
- Mock screens: `tools/compose-mockups.py` -> `design/mockups/screen-*.png` (844x390 logical, x2 nearest).
  Text is DejaVu Sans Bold with anti-aliasing off, standing in for the bundled pixel font (F1).

## Build: audio (2026-11-20)

# Audio log

Prices (audiogen table): music $0.30/min, SFX $0.12 per generation. Plan: ElevenLabs Creator (no credit line).

| File | Prompt (short) | Length | Tries | Est. cost | Verdict |
|---|---|---|---|---|---|
| music/village.mp3 | cozy plucky marimba + bamboo flute, 96 BPM 4/4 | 75.05 s take; loop file 71.02 s, loopEnd 70.023 (28 bars) | 1 | $0.375 | OK: 96.0 BPM measured, peak -0.9 dB, no clipping |
| music/paddies.mp3 | bright flowing marimba/kalimba/flute/guitar, 112 BPM 4/4 | 150.05 s take; loop file 146.73 s, loopEnd 145.738 (68 bars) | 1 | $0.75 | OK: 112.0 BPM, quieter 16-bar intro then full band |
| music/highwater.mp3 | bustling market town, marimba/flute/clarinet/light brass, 104 BPM 4/4 | 75.05 s take; loop file 74.85 s, loopEnd 73.855 (32 bars) | 1 | $0.375 | OK: 104.0 BPM |
| music/murk.mp3 | low mysterious bass/celesta/drips/pads, 72 BPM 4/4 | 75.05 s take; loop file 68.15 s, loopEnd 66.66 (20 bars) | 1 | $0.375 | OK: 72.0 BPM, 2-bar loud/quiet pattern |
| music/battle.mp3 | bouncy tense staccato strings/marimba/drums, 132 BPM 4/4 | 75.05 s take; loop file 73.25 s, loopEnd 72.75 (40 bars) | 1 | $0.375 | OK: 132.0 BPM, 8-bar lighter intro |
| music/gar.mp3 | big ancient taiko/low strings/horns, 90 BPM 6/8 | 75.05 s take; loop file 72.77 s, loopEnd 72.028 (36 bars of 2.0 s) | 1 | $0.375 | OK: 90 BPM, bar 2.0 s from onset autocorrelation |
| music/title.mp3 | hopeful gentle music box/celesta/marimba/flute, 96 BPM 4/4 | 75.05 s take; loop file 71.04 s, loopEnd 70.052 (28 bars) | 1 | $0.375 | OK: 96.0 BPM, soft 8-bar opening |
| music/ending.mp3 | warm celebratory marimba/flute/strings, 96 BPM, resolves | 75.05 s (no loop) | 1 | $0.375 | OK: ends with a clean decay to silence |
| sfx/bite.mp3 | Cute bright pickup sound for a cozy game: a small fish snaps up a tast... | 0.49 s | 1 | $0.12 | OK; peak -1.26 dB, rms -20.6 dB |
| sfx/hit.mp3 | Punchy cartoon impact for a cozy fish RPG battle: a fish headbutt hit,... | 0.33 s | 1 | $0.12 | OK; peak -1.39 dB, rms -21.1 dB |
| sfx/miss.mp3 | Quick whiffing swoosh through water, an attack that misses, light airy... | 0.48 s | 1 | $0.12 | OK; peak -1.59 dB, rms -19.6 dB |
| sfx/bubble_blast.mp3 | Magic water spell: a burst of many bubbles fired forward, bubbly whoos... | 1.02 s | 1 | $0.12 | OK; peak -0.94 dB, rms -21.2 dB |
| sfx/gravel_grenade.mp3 | loud crunchy gravel burst + muffled boom (PI 0.6) | 1.11 s | 2 | $0.24 | take 1 weak, no burst; take 2 punchy crunchy burst; peak -0.95 dB, rms -18.7 dB |
| sfx/party.mp3 | Cheerful party celebration: a paper party horn blowing, then a quick b... | 1.75 s | 1 | $0.12 | OK; peak -1.13 dB, rms -18.6 dB |
| sfx/befriend.mp3 | Warm happy befriend sound: a rising sparkly chime arpeggio with a soft... | 1.15 s | 1 | $0.12 | OK; peak -1.96 dB, rms -17.4 dB |
| sfx/befriend_fail.mp3 | balloon raspberry squeak dropping, fizzles out (PI 0.5) | 1.28 s | 3 | $0.36 | takes 1-2 got louder to an abrupt cut; take 3 fizzles out to silence; peak -2.33 dB, rms -18.4 dB |
| sfx/enemy_defeated.mp3 | Cartoon fish enemy defeated: a soft poof with a descending bubbly warb... | 0.81 s | 1 | $0.12 | OK; peak -1.23 dB, rms -22.1 dB |
| sfx/hurt.mp3 | Player takes damage in a cozy game: a short muffled bump with a soft l... | 0.40 s | 1 | $0.12 | OK; peak -1.42 dB, rms -17.7 dB |
| sfx/item.mp3 | loud wet gulp + twinkle (PI 0.6) | 0.60 s | 2 | $0.24 | take 1 nearly inaudible (-40 dB gulp, no chime); take 2 clear gulp + twinkle; peak -1.42 dB, rms -22.7 dB |
| sfx/level_up.mp3 | Level up jingle for a cozy RPG: a quick ascending marimba and glockens... | 1.80 s | 1 | $0.12 | OK; peak -1.61 dB, rms -23.5 dB |
| sfx/armor.mp3 | Equipping light metal armor: a satisfying metallic clank and clink of ... | 0.57 s | 1 | $0.12 | OK; peak -1.35 dB, rms -21.0 dB |
| sfx/buy.mp3 | Shop purchase: a cheerful coin clink and a little cash-register ding, ... | 0.63 s | 1 | $0.12 | OK; peak -1.47 dB, rms -23.2 dB |
| sfx/inn.mp3 | Restful inn sleep: a soft gentle lullaby chime of three descending the... | 2.48 s | 1 | $0.12 | OK; peak -2.46 dB, rms -18.4 dB |
| sfx/swim_away.mp3 | A small fish fleeing fast: quick rushing water whoosh with a tail flic... | 0.71 s | 1 | $0.12 | +14.6 dB gain; peak -1.21 dB, rms -27.4 dB |
| sfx/gar_roar.mp3 | Huge ancient prehistoric fish roar underwater: deep rumbling bellow, b... | 2.14 s | 1 | $0.12 | OK; peak -1.96 dB, rms -14.6 dB |
| sfx/gar_charge.mp3 | Massive prehistoric fish charging forward: heavy rushing water surge, ... | 1.48 s | 1 | $0.12 | OK; peak -2.39 dB, rms -15.6 dB |
| sfx/sub_dive.mp3 | Small submarine diving underwater: mechanical hum, valve hiss and a ru... | 2.00 s | 1 | $0.12 | OK; peak -1.46 dB, rms -21.2 dB |
| sfx/notice.mp3 | Enemy notices you: a quick sharp alert sting, a cartoon surprise blip ... | 0.19 s | 1 | $0.12 | 0.19 s after tail trim (quick alert blip); peak -1.74 dB, rms -13.3 dB |
| sfx/bubble_chirp.mp3 | Tiny cute fish friend chirps and nips: a high squeaky happy chirp with... | 0.31 s | 1 | $0.12 | OK; peak -1.96 dB, rms -17.0 dB |
| sfx/bubble_dizzy.mp3 | Cartoon dizzy sound: a little fish seeing stars, a wobbly spinning war... | 0.89 s | 1 | $0.12 | OK; peak -1.41 dB, rms -24.3 dB |
| sfx/shell_crack.mp3 | A hard crustacean shell cracking: sharp crunchy crack and splinter, sl... | 0.56 s | 1 | $0.12 | OK; peak -1.52 dB, rms -31.6 dB |
| sfx/transition.mp3 | Screen transition into a battle or new area: a rising watery ripple sw... | 1.00 s | 1 | $0.12 | OK; peak -2.25 dB, rms -18.5 dB |
| sfx/fanfare.mp3 | Short victory fanfare for a cozy RPG battle win: bright cheerful marim... | 2.22 s | 1 | $0.12 | OK; peak -1.79 dB, rms -22.5 dB |
| sfx/swish.mp3 | A small fish swimming: a gentle soft swish of a tail fin through water... | 0.53 s | 1 | $0.12 | +17 dB gain (quiet take); peak -1.27 dB, rms -21.9 dB |
| sfx/ambience_murk.mp3 | Dark murky underwater ambience: low muffled water drone, distant slow ... | 20.00 s | 1 | $0.12 | --loop, 20.00 s; audiogen file as-is, seam clean; peak -9.59 dB, rms -28.3 dB |
| sfx/ambience_paddy.mp3 | Peaceful sunny rice paddy water ambience: gentle shallow water lapping... | 20.00 s | 1 | $0.12 | --loop, 20.00 s; +13 dB gain (very quiet take), seam clean; peak -1.31 dB, rms -34.4 dB |

**Totals:** music 8 tracks, 1 take each, 11.25 min ≈ **$3.375**; SFX 28 sounds + 4 retakes = 32 generations ≈ **$3.84**. **Total ≈ $7.22** (share $8). Failed 429 calls (concurrency limit 2) made no audio and aren't counted.

**Processing (free, local ffmpeg from pip `imageio-ffmpeg`; the system has no ffmpeg):** music loop files are cut at loopEnd + crossfade with a baked `esin` fade-out (see `game/assets/audio/loops.json`); SFX have leading silence (< -50 dB) and trailing silence (< -60 dB) trimmed, a 10 ms end fade, and positive gain only toward -18 dB RMS with peaks ≤ -1 dB; re-encoded mp3 128 kbps 44.1 kHz. Untouched takes stay in `.gamegen/candidates/audio/`. Seam previews (4 s before loopEnd + the next copy) are in `.gamegen/candidates/audio/seams/` for a listen-check.

**Not checked by ear:** I can't listen, so mood and the absence of vocals are by prompt (`--force-instrumental`) only. Tempo, bar grid, levels, clipping, silence and seams were measured.

## Build: art (2026-11-20)

# Build art log (to merge into design/ASSETS.md)

Price assumptions as ASSETS.md: gpt-image-2.6-flare high = $0.45/take (assumed), gpt-image-2.5-flare high = $0.11/take, nanogen pro 2K = $0.134/image.
Starting total (mockups): $7.70. This agent's cap: $10.

| ID | File | Tool | Model / quality | Prompt (short) | Tries | Est. cost | Running (this agent) | Verdict |
|---|---|---|---|---|---|---|---|---|
| P1 | tools/palette.png | extract-native.py --palette | — | 14 design + 6 reserved (salmon F2827A, olive 6E7432, lilac B89AD8, near-black 2A2A2C, mint 9ED8B4, light grey C8C8C8) + cream-white E1DDD1 pinned + 27 from kept art (16 median cut, 11 max-coverage) | 1 | $0 | $0.00 | **accepted**; re-extracted all accepted candidates to .gamegen/reextract/, by eye: Coral now salmon-pink (clear of orange), Reef black (was navy), Pip pinker, Highwater inn awning lilac -> copied to native. Pip's stall shell lost its peach stripes, kept old; Finn/Bubble/Seaweed/whorl, other buildings, props, icons, backdrops ~unchanged, kept old (old version in .gamegen/backup-native-pre-art/) |
| A-gar t1 | .gamegen/candidates/gar-take1.png | imagegen2 | 2.6-flare high 1536x1024 transparent, refs prehistoric_gar + betta | ONE gargantuan gar, >2x as long and 2x as tall as the betta, ~120x48, heavy deep body | 1 | $0.450 | $0.45 | **accepted** -> boss/gargantuan_gar.png 141x60 (drawn grid 10.63 px, +17.5% of 120, inside +-20%; flipped to face right like the kept gar). 3.1x the betta's length, 1.6x its height: reads gargantuan |
| BG4 t1 | .gamegen/candidates/murk-take1.jpg | nanogen | pro 2K 16:9, refs betta+tuft | Murk: no surface/sky/clouds, dim teal glow middle band, roots at edges, detail top 2/3 | 1 | $0.134 | $0.58 | **accepted** -> backdrops/murk.png (box 6.37; snapped with --exclude greys so roots stay brown) |
| E1n t1 | .gamegen/candidates/nymph-take1.png | imagegen2 | 2.6-flare high 1024x1024 transparent, ref betta | single nymph ~40 px, dark olive body vs cream gill plates, big eye | 1 | $0.450 | $1.03 | good contrast, but drawn on a coarse ~29 px grid; box 24 -> 39x18 irregular, small eye |
| BG2 t1 | .gamegen/candidates/reedwater-take1.jpg | nanogen | pro 2K 16:9, refs betta+tuft | Reedwater reeds, middle plain, bottom plain floor | 1 | $0.134 | $1.17 | rejected: flat horizontal teal slab under the floor line; distant 'skyline' blocks snap grey |
| BG3 t1 | .gamegen/candidates/spillway-take1.jpg | nanogen | pro 2K 16:9, refs betta+tuft | Spillway steps, pouring white water, bubbles | 1 | $0.134 | $1.30 | **accepted** -> backdrops/spillway.png (detail top half, plain blue band for fighters, sand floor; --exclude greys) |
| UI2f t1 | .gamegen/candidates/endfriend-take1.jpg | nanogen | pro 2K 16:9, refs betta+tuft+bettahome(shape) | friendship ending: village festival at dusk, lanterns, pennants, confetti | 1 | $0.134 | $1.44 | **accepted** -> backdrops/ending_friendship.png (purple dusk edges snap to teal-grey; still reads warm) |
| UI2w t1 | .gamegen/candidates/endfins-take1.jpg | nanogen | pro 2K 16:9, refs betta+tuft+bettahome(shape) | fins ending: village dawn welcome | 1 | $0.134 | $1.57 | rejected: copied bettahome's oval vignette and night-blue domes; peach rays snap to a flat cream block |
| E1n t2 | .gamegen/candidates/nymph-take2.png | imagegen2 | 2.6-flare high 1024x1024 transparent, ref betta | + fine grid (1/40 of length), 5 px eye on a light head patch, sturdy legs | 2 | $0.450 | $2.02 | **accepted** -> enemies/dragonfly_nymph.png 38x17 (drawn grid 25.7 px): even pixels, pale gills vs olive body, eye readable |
| BG2 t2 | .gamegen/candidates/reedwater-take2.jpg | nanogen | pro 2K 16:9 | 'one continuous scene, no bands', reeds framing, floor thin strip | 2 | $0.134 | $2.15 | rejected: good layout but pale green-teal water bands badly on the palette, rays snap to cream blocks |
| UI2w t2 | .gamegen/candidates/endfins-take2.jpg | nanogen | pro 2K 16:9, refs betta+tuft (no bettahome) | + no vignette, warm (not blue) domes, sun-gold rays over blue | 2 | $0.134 | $2.29 | **accepted** -> backdrops/ending_fins.png (--exclude greys + lilac so hut walls stay cream) |
| BG2 t3 | .gamegen/candidates/reedwater-take3.jpg | nanogen | pro 2K 16:9 | + water clear BLUE per palette, not green/turquoise | 3 | $0.134 | $2.42 | **accepted** -> backdrops/reedwater.png (reeds frame both sides, open blue middle, thin gold rays) |
| N4t t1 | .gamegen/candidates/townsfolk-take1.png | imagegen2 | 2.6-flare high 1536x1024 transparent, refs betta + Seaweed hi-res crop | 3 townsfolk (dalmatian+satchel, chocolate/mustard+sun hat, rose/silver+scarf) + Kelpie lilac-white Seaweed, 2x2 | 1 | $0.450 | $2.87 | good designs, but coarse grids (16-21 px): 36-44 wide, only 26-31 tall; mustard bands snap rust |
| N4t t2 | .gamegen/candidates/townsfolk-take2.png | imagegen2 | 2.6-flare high 1536x1024 transparent, refs betta + Seaweed hi-res crop | same 4, MK6-style layout (3 top, 1 below), '45x37 like the betta', golden-yellow bands | 2 | $0.450 | $3.32 | **accepted** -> villagers/townsfolk_1..3.png, kelpie.png (44x38-43, grid 10.6-12 px or box 11; townsfolk_2 extracted with --exclude 69212E AC2A12 so its body is chocolate, not maroon) |
| A2 | .gamegen/anim/.anim8gen/runs/betta-swim/raw/frame-00{1,3}.retry-001.png | anim8gen (imagegen2) | 2.6-flare high 1024x1024 native-alpha, ref = kept player_betta.png | 4-frame swim in place: 0 = kept sprite, 1 tail up, 2 = reuse 0, 3 tail down; body steady | 1 each (2 generated) | $0.900 | $4.22 | **accepted** -> anim/betta_swim_0..3.png 45x39 (frame 0 = native betta at (0,1)). Raw frames were brighter with a rounder head; tools/anim-native.py: sampled on the drawn grid (19.3/18.9), snapped to frame 0's own colours, luminance-matched (all 83.8-84.1), front 38 % (head) taken from frame 0 so the body stays steady; tail/fins from the generated frames. anim8gen validate: passed, 0 warnings |
| A1 | .gamegen/anim/.anim8gen/runs/gar-lunge/raw/frame-00{1,2,3}.retry-001.png | anim8gen (imagegen2) | 2.6-flare high 1536x1024 native-alpha, ref = gar-take1.png | 4-frame lunge: 0 = idle (the boss sprite), 1 coil, 2 lunge jaws open, 3 recover | 1 each (3 generated) | $1.350 | $5.57 | **accepted** -> anim/gar_lunge_0..3.png 145x67 facing right (frame 0 = native gargantuan_gar at (1,7)); box 10.63, snapped to frame 0's colours, luminance-matched (raw drifted 84 -> 104, now 84.5-84.7), registered on the tail so the lunge thrusts forward. anim8gen validate: passed, 5 motion warnings (expected for a lunge) |

**This agent's total: $5.57** (10 gpt-image-2.6-flare high at the assumed $0.45 = $4.50; 8 nanogen pro 2K at $0.134 = $1.07). Game art total: $7.70 + $5.57 = **$13.27**.

### Notes for the lead
- Palette: `tools/extract-native.py` now has `RESERVED_COLOURS` (6 + cream-white) and `--exclude HEX...`; backdrops were snapped with `--exclude A19D9D C8C8C8 565C56 2A2A2C` (the fins ending also `B89AD8`), else rays/haze snap to grey blocks.
- Re-extract commands: Gar `--sheet .gamegen/candidates/gar-take1.png --targets tools/targets/gar-b.json` then mirror; Nymph `nymph-take2.png` with tools/targets/nymph-b.json; townsfolk `townsfolk-take2.png` with tools/targets/townsfolk-take2.json (townsfolk_2 with `--only townsfolk_2 --exclude 69212E AC2A12`).
- New tools: tools/contact.py (contact sheet beside the betta), tools/backdrop-preview.py, tools/anim-native.py (anim frames onto the native grid).
- Gar is 141x60 (not 120x48): the drawn grid, +17.5 % of target, kept un-resampled. At x2 in battle it is 282x120 logical.
- Animation frame canvases are larger than the static sprite: betta 45x39 (static at (0,1)), gar 145x67 (static at (1,7)).
- anim8gen's align-frames step errors on its own relative-path handling (alignment-metrics.json); its validation, contact sheet and GIFs ran. The game frames come from tools/anim-native.py, not from anim8gen's aligned/ output.

## Extra job: rice props (lead request, cap $2)

| ID | File | Tool | Model / quality | Prompt (short) | Tries | Est. cost | Running (this agent) | Verdict |
|---|---|---|---|---|---|---|---|---|
| T4 | .gamegen/candidates/rice-take1.png | imagegen2 | 2.6-flare high 1536x1024 transparent, refs betta + rice_paddy_tuft (from source-art/) | 4 clumps of 5-7 young rice stalks, ~16x24 big px, bright green, lighter tips, darker base, bold outline, in one row | 1 | $0.450 | $6.02 | **accepted** -> props/rice_stalks.png 18x24 (clump a) and props/rice_row.png 64x25 (clumps a, c, d, a-mirrored centred every 16 px; pixels past the edges wrap, so rows tile seamlessly; tools/rice-row.py). Drawn grids 17-20 px. Plain palette snap gave olive/tan straw (no light yellow-green or dark green in the palette), so the fill was remapped by luminance to palette greens: base 2E6F80 (water teal), mid 5B8C3A, tip 3AB435 (tools/tone-remap.py); outline 2A1A12 kept |

**This agent's total: $6.02**; game art total $7.70 + $6.02 = **$13.72**.
Note: game/assets/original/ is gone (the builder moved the full-size kept art to source-art/); refs were taken from there.

## Change 5: rooms (2026-11-23, budget $20)

| ID | File | Tool | Settings | What | Takes | Cost | Running | Status |
|---|---|---|---|---|---|---|---|---|
| R1 | .gamegen/candidates/rooms/finn-take1.jpg | nanogen | pro 2K 3:2, refs elder_dwelling x6, betta x8, village screenshot | Elder Finn's study (style anchor for the rooms) | 1 | $0.134 | $0.13 | **accepted** -> interiors/finn.png 384x256 (box 6.58 px, greys excluded) |
| R2 | .gamegen/candidates/rooms/mart-take1.jpg | nanogen | pro 2K 3:2, refs R1 + fish_mart x6 | The Fish Mart | 1 | $0.134 | $0.27 | **accepted** -> interiors/mart.png |
| R3 | .gamegen/candidates/rooms/inn-take1.jpg | nanogen | pro 2K 3:2, refs R1 + swishy_solace_inn x6 | The Swishy Solace Inn | 1 | $0.134 | $0.40 | **accepted** -> interiors/inn.png |
| R4 | .gamegen/candidates/rooms/bubble-take1.jpg | nanogen | pro 2K 3:2, refs R1 + bubble_home x6 | Bubble's Home | 1 | $0.134 | $0.54 | **accepted** -> interiors/bubble.png |
| R5 | .gamegen/candidates/rooms/hwinn-take1.jpg | nanogen | pro 2K 3:2, refs R1 + highwater_inn x6 | Kelpie's Inn | 1 | $0.134 | $0.67 | **accepted** -> interiors/hwinn.png |
| R6 | .gamegen/candidates/rooms/lock-take1.jpg | nanogen | pro 2K 3:2, refs R1 + lock_house x6 | The Lock House | 1 | $0.134 | $0.80 | **accepted** -> interiors/lock.png |
| R7 | .gamegen/candidates/rooms/home-take1.jpg | nanogen | pro 2K 3:2, edit of R4 | A Highwater family home (three homes use it; Minnow's uses R1) | 1 | $0.134 | $0.94 | **accepted** -> interiors/home.png (kept the fish drawings on the wall) |
| S1 | sfx/door.mp3 | audiogen | sfx 1.0 s, influence 0.5 | Door: soft wooden door, bubbly whoosh | 1 | ~$0.12 (credits) | $1.06 | **accepted**; peak -6.9 dB, rms -25.9 dB; played at full volume in place of the area swoosh |
| S2 | sfx/shop_bell.mp3 | audiogen | sfx 1.2 s, influence 0.5 | Shop bell: shell wind-chime (Fish Mart) | 1 | ~$0.12 (credits) | $1.18 | **accepted**; peak -10.0 dB, rms -24.3 dB |

Code-drawn: doormats outside every door, the exit chevron, Bubble's room sign, shadows under fish indoors.
Dropped after review: M1 (indoor music): rooms keep the area's music playing, so nothing restarts at a door.

## Change 6: Minnow's own room (2026-11-25, budget $20)

| # | Candidate | Tool | Settings | What | Takes | Est. cost | Running | Result |
|---|---|---|---|---|---|---|---|---|
| R8 | .gamegen/candidates/rooms/minnow-take1.jpg | nanogen | pro 2K 3:2, refs R1 + R7 | Minnow's den in Highwater (map with the Lock House circled, toy water-wheels, model lock gate, sponge bed) | 1 | $0.134 | $0.13 | **accepted** -> interiors/minnow.png 384x256 (box 6.58 px); hwHome3 no longer reuses Finn's room |


## Change 7: Dace's coral room (2026-11-25, budget $20)

| # | Candidate | Tool | Settings | What | Takes | Est. cost | Running | Result |
|---|---|---|---|---|---|---|---|---|
| R9 | .gamegen/candidates/rooms/dace-take1.jpg | nanogen | pro 2K 3:2, refs R7 + R1 | Dace's coral den in Highwater | 1 | $0.134 | $0.13 | rejected: the pipe sketch came out as a smoking pipe |
| R9b | .gamegen/candidates/rooms/dace-take2.jpg | nanogen | pro 2K 3:2, edit of R9 | the sketch redrawn as a drainage pipe | 1 | $0.134 | $0.27 | **accepted** -> interiors/dace.png 384x256 (box 6.58 px); the palette has no orange, so the snapped pinks were shifted to hue 17 (saturation x1.45) to match the coral house outside |
