# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CURRENT STATE: MODULAR ARCHITECTURE (v0.4)

**IMPORTANT**: This project has completed the refactoring from v0.3 to v0.4, implementing a modular ES6 architecture.

### Refactoring Guidelines
- **Goal**: Transform monolithic script.js into modern, modular JavaScript architecture
- **Behavior preservation**: New modular code must match behavior of orig-* reference files exactly
- **Reference files**: `orig-index.html`, `orig-script.js`, `orig-style.css` are READ-ONLY references
- **DO NOT modify orig-* files** - they are the authoritative behavior reference
- **Current focus**: Refactor only, no new features or behavior changes

### Working with Files During Refactor
- **Avoid reading script.js directly** except to verify build output (use grep/search if needed)
- **Work in src/ modules** for all code changes
- **Use orig-* files** as reference for expected behavior
- **Build frequently** to verify refactored modules produce correct output

## Build and Development Commands

### Essential Commands
- **Build game**: `node build.mjs` - Combines all src/ modules into script.js
- **Run dev server**: `python devServer.py` - Serves game on http://localhost:5000
- **Install Python deps**: `pip install flask` or `pipenv install`

### Development Workflow
- If you make code changes you should always build the script unless there's some reason to think it's worth waiting, in which case, always ask.

### Testing During Refactor
- **Manual testing**: Open index.html in browser after building
- **Behavior comparison**: Compare against orig-index.html behavior
- **Check build output**: Use grep/search on script.js to verify modules combined correctly
- **No automated tests**: This is a browser-based game requiring manual QA
- **Note on testing reliability**: Ad hoc testing during refactor has been unreliable - focus on code structure over extensive testing for now

## Architecture Overview

### Modular Structure (v0.4+)
The game uses an **8-module architecture** with a simple build system that concatenates modules into a single script.js file:

```
src/
├── config.js    - GameConfig & GameStrings (centralized constants & text)
├── audio.js     - AudioManager (Web Audio API, procedural sounds)
├── player.js    - Player (stats, progression, economy)
├── npc.js       - NPCManager (village characters, dialogue trees)  
├── dialog.js    - DialogManager (modal dialogs, user prompts)
├── combat.js    - CombatManager (battles, enemies, visual effects)
├── world.js     - WorldManager (exploration, encounters, map generation)
├── ui.js        - UIManager (DOM manipulation, screen management)
└── core.js      - BettaRPG (coordination, initialization)
```

### Build System
- **Simple concatenation** approach (not webpack/bundlers)
- **Zero runtime dependencies** - maintains double-click-to-play simplicity
- **Module order matters**: Config → Audio → Player → NPC → Dialog → Combat → World → UI → Core
- **Export stripping**: ES6 exports removed for browser compatibility

### Module Dependencies
```
Core (BettaRPG)
├── Config (independent - provides constants & strings)
├── Player (depends on: Config)
├── Audio (independent)
├── NPC (depends on: Config)
├── Dialog (depends on: Audio)
├── Combat (depends on: Player, Audio, Config)
├── World (depends on: Player, Audio, Combat, NPC, Config)
└── UI (depends on: Player, Audio, Combat, World)
```

### Key Design Patterns
- **Player as single source of truth** for all character state
- **Dependency injection** through Core module
- **Clear separation of concerns** between data (Player) and presentation (UI)
- **No circular dependencies** - clean, testable architecture

## Core Systems

### Player State Management
The Player class is the **authoritative source** for all character data:
- Stats (HP, MP, level, exp, bettaBites)
- All stat modifications (damage, healing, progression)
- Armor system and damage calculations
- Economy transactions

**Never modify player state directly** - always use Player class methods like `takeDamage()`, `gainExp()`, `spendBettaBites()`.

### Combat System
CombatManager handles:
- 5 enemy types with level-based scaling
- Turn-based battle flow
- Special boss mechanics (Prehistoric Gar)
- Visual effects (bubble/gravel spells, animations)
- Distance-based enemy level calculation

### Graphics System
- **CSS filter approach**: Hue rotation for color variations instead of multiple sprites
- **Sprite progression**: Changes based on level and equipment
- **Layered backgrounds**: CSS pseudo-elements for depth and danger zones
- **Procedural audio**: Web Audio API generation, no audio files

### World Design
- **30x30 procedural map** with concentric danger zones
- **Encounter probabilities**: 30% combat, 30% treasure, 30% peaceful, 10% mystery
- **Distance-based scaling**: Enemy difficulty increases with distance from village center

## Development Guidelines

### When Working with Modules During Refactor
1. **Always build after changes**: Run `node build.mjs` before testing
2. **Respect module boundaries**: Don't create circular dependencies
3. **Use Player methods**: Never directly modify player properties
4. **Test incrementally**: Build and test after each module change
5. **Preserve exact behavior**: Compare against orig-* files to ensure no behavior changes
6. **Focus on modular structure**: Priority is clean, maintainable code that matches original functionality

### Code Conventions
- **ES6+ syntax**: Classes, arrow functions, template literals
- **Clear method names**: `updatePlayerStats()`, `canAfford()`, `createScaledEnemy()`
- **Graceful fallbacks**: Handle missing DOM elements and unsupported APIs
- **No external dependencies**: Maintain zero-dependency design

### Graphics and Assets
- **Pixel art style**: Use `image-rendering: pixelated` for crisp sprites
- **Organized structure**: graphics/main_fish/, graphics/enemies/, graphics/map/
- **Color system**: CSS hue-rotate() for variations, not multiple files

## Important Files and Context

### Documentation
- `REFACTOR.md` - Complete architectural migration plan (v0.3 → v0.4)
- `TECHNICAL_DOCS.md` - Implementation details and system explanations
- `GAME_DESIGN.md` - Game mechanics and balance decisions

### Key Implementation Details
- **Zero-dependency design**: No npm packages, libraries, or frameworks
- **Browser compatibility**: Modern ES6+ features, no polyfills
- **Mobile responsive**: Touch-friendly interface with keyboard controls
- **Save/load system**: LocalStorage-based game state persistence

### Audio System
Uses Web Audio API for procedural sound generation:
- 17 different sound types (attack, magic, victory, etc.)
- No audio files - everything generated at runtime
- Graceful fallback when Web Audio unavailable

## Common Development Tasks

### Adding New Features
1. Identify the appropriate module (usually Combat, World, or UI)
2. Implement in src/ module files using existing patterns
3. Build with `node build.mjs`
4. Test thoroughly in browser

### Modifying Player Progression
- Edit Player class methods in `src/player.js`
- Update UI display logic in `src/ui.js` if needed
- Rebuild and verify stat displays update correctly

### Adding New Enemies or NPCs
- Enemy definitions go in `src/combat.js`
- NPC dialogues and interactions go in `src/ui.js`
- Add corresponding graphics to graphics/ subdirectories

## Clarifications and Conventions

### Configuration Usage
- When asked if a config is "used", this means the values drive game logic
- Merely being referenced without affecting game behavior is not considered "used"
- Configs should actively influence game mechanics, enemy scaling, or player interactions

## Server and Development Warnings

### Server Management
- You have a terrible track record of using the server to determine anything. If you think you've fixed it, let me know and I can check. Don't start your own servers unless I say to.

The codebase prioritizes **simplicity, maintainability, and zero dependencies** while providing a complete RPG experience that runs in any modern browser.