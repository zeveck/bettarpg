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
