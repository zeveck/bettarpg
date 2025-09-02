## Betta Fish RPG – Fix Plan (guided by GPT5_EVAL.md, GPT5_EVAL2.md, and CLAUDE_EVAL.md)

### Goals and scope

- Focus first on functional correctness and configuration-driven maintenance wins.
- Defer DOM-structure edits and most DOM-touching changes (per guidance).
- Timing constants: leave in code for now; treat moving them to config as optional/later.

### Priorities overview

1) Must-fix functional issues (no DOM changes required):
   - Victory payload name mismatch (level-up delay not triggering)
   - Post-combat encounter skip flag not honored
   - Unreachable `world.js` branch (duplicate condition)
   - World thresholds inconsistent with config (visual/semantic alignment)
   - Broken/unused NPC list APIs in `WorldManager`
   - Centralize shop item costs and use templated prices in dialogues
   - Map size assumption comments/usage sanity
   - Cache background generation to avoid repeat cost

2) Medium priority, non-DOM maintenance:
   - Remove or consolidate dead/unused logic (safe deletions only)
   - Reduce config duplication for colors (optional)

3) Deferred (DOM or policy-sensitive):
   - Duplicate `version-info` ID (HTML change)
   - Nonexistent element IDs in `UIManager` (`combatArea`, `movementControls`, `northBtn` set)
   - Dialog container ID mismatch
   - Audio autoplay/resume-on-gesture handlers
   - Consolidating timing constants to config

---

### Detailed tasks

#### 1. Align victory payload property name

- Problem: `CombatManager.processVictoryImmediate` returns `{ didLevelUp: true/false }`, but `UIManager.handleVictory` checks `victoryResult.levelUp`.
- Change: Update UI to check `victoryResult.didLevelUp` (single-site change, minimal ripple).
- Files: `src/ui.js`
- Acceptance:
  - When a level-up occurs after victory, the UI takes the level-up branch and delays `endCombat()` accordingly.

#### 2. Honor `justExitedCombat` flag for encounter skipping

- Problem: Flag is set in `WorldManager.setCombatExitFlag()` but never used, causing immediate re-encounters after combat.
- Change: In `WorldManager.movePlayer()`, if `this.justExitedCombat` is true and player is outside village, set it false and return a success movement result without generating an encounter (preserve location update). Alternatively, short-circuit in `checkForEncounter()` to return a peaceful/no-encounter once, then clear.
- Files: `src/world.js`
- Acceptance:
  - After combat ends, the immediate next move does not spawn an encounter.
  - Subsequent moves behave normally.

#### 3. Remove unreachable world-map branch (duplicate condition)

- Problem: Duplicate `(x === center.x && y === center.y)` condition creates an unreachable `else if` block.
- Change: Remove the second branch or merge intent.
- Files: `src/world.js`
- Acceptance: No functional change; code is cleaner and less confusing.

#### 4. Align world generation thresholds with config

- Problem: `generateWorldMap()` uses hardcoded thresholds `< 5`, `< 10`, diverging from `GameConfig.WORLD.DANGER_ZONES` (SAFE=4, DANGEROUS=7). UI’s tile-renderer already uses config-based distance.
- Change: Compute distance zones using `GameConfig.WORLD.DANGER_ZONES` to determine `shallow/medium/deep` tile selection for consistency with encounter levels and UI background.
- Files: `src/world.js`
- Acceptance:
  - Visual depth classification aligns with danger zones defined in config.
  - Edge cases at radius boundaries appear consistent across UI and logic.

#### 5. Centralize shop costs and template dialogue prices

- Problems:
  - Shop costs are hardcoded in `WorldManager.getShopItems()`.
  - Prices are embedded in NPC dialogue strings (e.g., “100 Betta Bites”, “5 Betta Bites”).
- Changes:
  - Add `GameConfig.ECONOMY.SHOP_ITEMS` with item IDs and costs (SUBMARINE, KELP_SNACK, BUBBLE_WATER), and reuse existing `ECONOMY.SERVICES.INN_REST.cost` for inn.
  - Update `WorldManager.getShopItems()` to read costs from config instead of literals.
  - Convert price-bearing dialogue strings in `GameStrings` to include placeholders (e.g., `{submarineCost}`, `{innCost}`) and ensure code that displays these lines formats via `StringFormatter.format()` with values from `GameConfig`.
    - Note: This modifies strings and their formatting calls, not the DOM structure.
- Files: `src/config.js` (add SHOP_ITEMS); `src/world.js` (cost sourcing); `src/config.js` (dialogue strings to placeholders); `src/ui.js`/`src/npc.js` (ensure formatting variables passed when showing dialogues).
- Acceptance:
  - Changing costs in config updates both shop entries and NPC dialogue prices automatically.
  - No change to DOM structure or shop UI interactions.

#### 6. Remove/repair broken world→NPC API methods

- Problem: `WorldManager.getNPCList()`/`getNPCIds()` call non-existent `NPCManager` methods; unused and broken.
- Change: Remove these methods from `WorldManager`. If future use is desired, implement corresponding read-only list accessors in `NPCManager` and wire them properly later.
- Files: `src/world.js`
- Acceptance:
  - Build succeeds; no references to these methods remain.

#### 7. Map size assumption sanity

- Problem: Comment in `UIManager.updatePlayerMapPosition()` assumes 30×30 grid while using `GameConfig.WORLD.MAP_SIZE` (currently 21). Logic is correct; comment is misleading.
- Change: Update the comment to reflect dynamic sizing; verify all percentage computations already rely on config (they do).
- Files: `src/ui.js`
- Acceptance: Comment clarity; no behavior change.

#### 8. Cache world background generation

- Problem: `generateTiledBackground()` loads tile images and redraws each time the world map shows.
- Change: Cache loaded images and the generated data URL per `MAP_SIZE`/tile set. Recompute only if inputs change.
- Files: `src/ui.js`
- Acceptance:
  - First open performs rendering; subsequent opens reuse cached background.
  - No visible flicker or delayed load after first render.

---

### Medium-priority cleanups (non-DOM)

- Remove dead `canMoveTo()` if not used anywhere; if kept, integrate where boundaries are enforced for clarity.
- Optional: Reduce color config duplication by treating `GameConfig.UI.COLORS` as source-of-truth and using string names purely for labels.

---

### Deferred (DOM or policy-sensitive)

- Duplicate `version-info` in `index.html`: leave for a later HTML sweep.
- Non-existent IDs used by UI (`combatArea`, `movementControls`, `northBtn` set) – leave until DOM pass.
- Dialog container ID mismatch: leave until DOM pass.
- Audio autoplay (resume-on-gesture): consider later (may require user-interaction wiring and testing).
- Timing constants: leave in code for now; we can introduce optional config sections later if desired.

---

### Risks and mitigations

- Dialogue templating risk (placeholders): Ensure all code paths that render price-bearing lines call `StringFormatter.format()` with the necessary variables. Leave default formatter behavior as-is (unknown placeholders pass through unchanged) to avoid runtime failures.
- Threshold alignment: Changing distance thresholds may slightly alter visuals/encounters near boundaries. Validate with a manual pass.
- Background caching: Guard caches behind feature-safe checks (e.g., recompute when `MAP_SIZE` or image sources change).

---

### Implementation sequencing and effort estimate

1) Level-up payload alignment (XS)
2) Honor `justExitedCombat` (S)
3) Remove unreachable branch (XS)
4) Align world thresholds (S)
5) Centralize shop costs + dialogue templating (M)
6) Remove broken NPC API methods (XS)
7) Map size comment fix (XS)
8) Background caching (S)

Total engineering effort: ~0.5–1.5 days, depending on validation depth.

---

### Test plan (manual smoke tests)

- Character creation → enter village → exit to paddies.
- Trigger combat and win with enough EXP to level: verify level-up delay sequence occurs (post-fix).
- After combat ends, make one move: verify no encounter fires (skip applied), then subsequent move may encounter.
- Move near danger zone boundaries: verify level scaling and tile shading feel consistent with zones.
- Open shop: verify item prices match `GameConfig` values.
- Talk to merchant/innkeeper: verify dialogue shows prices matching config (templated correctly).
- Re-enter world map multiple times: verify background rendering occurs once, then reuses cached image.

---

### Notes relative to CLAUDE_EVAL.md

- Adopt its recommendations to consolidate shop costs and remove hardcoded price strings (implemented via templating here).
- Defer large-scale timing/visual constants consolidation and DOM sweeps as requested.











