# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

### Essential Commands
- **Build game**: `node build.mjs` - Combines all src/ modules into script.js
- **Run dev server**: `python devServer.py` - Serves game on http://localhost:5555
- **Install Python deps**: `pip install flask` or `pipenv install`

### Development Workflow
- If you make code changes you should always build the script unless there's some reason to think it's worth waiting, in which case, always ask.
- If you fix a bug or add a feature or otherwise materially change the code you should ensure all docs, particularly CHANGELOG.md and CLAUDE_EVAL_FIX_PLAN.md are up to date and adequately reflect the changes.
- Always report changes to the user.

### Testing
- **No automated tests**: This is a browser-based game requiring manual QA
- **Manual testing focus**: Test actual gameplay after changes rather than relying on code inspection

## Architecture Overview

### Modular Structure
The game uses a modular ES6 architecture with modules in `src/` that are concatenated into `script.js`:

- **config.js** - GameConfig & GameStrings (centralized constants & text)
- **audio.js** - AudioManager (Web Audio API, procedural sounds)
- **player.js** - Player (stats, progression, economy)
- **npc.js** - NPCManager (village characters, dialogue trees)  
- **combat.js** - CombatManager (battles, enemies, visual effects)
- **world.js** - WorldManager (exploration, encounters, map generation)
- **ui.js** - UIManager (DOM manipulation, screen management)
- **core.js** - BettaRPG (coordination, initialization)

### Build System
- **Simple concatenation** approach (not webpack/bundlers)
- **Zero runtime dependencies** - maintains deployment simplicity
- **Module order matters**: Config → Audio → Player → NPC → Combat → World → UI → Core
- **Export stripping**: ES6 exports removed for browser compatibility

### Key Design Principles
- **Player as single source of truth** for all character state
- **Separation of concerns** between data (Player) and presentation (UI)
- **No circular dependencies** - maintain clean architecture
- **Configuration-driven** - use GameConfig/GameStrings for constants

## Core Systems

### Player State Management
The Player class is the **authoritative source** for all character data.

**Never modify player state directly** - always use Player class methods like `takeDamage()`, `gainExp()`, `spendBettaBites()`.

### Combat System
- **Turn-based battle flow** with player and enemy alternating
- **Distance-based scaling**: Enemy level/difficulty increases with distance from village
- **Boss mechanics**: Special behaviors for unique enemies (e.g., Prehistoric Gar)
- **Visual effects**: Spell animations, screen shake, sprite transformations

### World System
- **Procedural map generation** with concentric danger zones
- **Encounter system**: Different encounter types (combat, treasure, peaceful, mystery)
- **Distance-based content**: Harder enemies and better rewards farther from village
- **Village hub**: Safe zone with NPCs, shops, and services

### Graphics Approach
- **CSS filters for variations**: Use hue-rotate() instead of multiple sprite files
- **Sprite progression**: Player appearance changes with level/equipment
- **Layered backgrounds**: CSS pseudo-elements for depth effects
- **Pixel art style**: `image-rendering: pixelated` for crisp retro look

### Audio System
- **Procedural generation**: All sounds created at runtime via Web Audio API
- **No audio files**: Zero external assets, everything generated
- **Graceful degradation**: Game works without audio support

## Core Guidelines

### Adding Content
- **Enemies**: Define in config.js, implement logic in combat.js
- **NPCs**: Define dialogues in config.js, implement in npc.js
- **Items/Shops**: Define in config.js, implement in world.js
- **Graphics**: Add to appropriate graphics/ subdirectory

### Code Conventions
- **ES6+ syntax**: Classes, arrow functions, template literals
- **Descriptive method names**: `updatePlayerStats()`, `canAfford()`, etc.
- **Graceful fallbacks**: Handle missing DOM elements and unsupported APIs
- **No external dependencies**: Maintain zero-dependency design

### Graphics and Audio
- **Pixel art style**: Use `image-rendering: pixelated` for crisp sprites
- **CSS filters for variations**: Use hue-rotate() instead of multiple sprite files
- **Procedural audio**: All sounds generated via Web Audio API, no audio files

## Important Documentation

- **TECHNICAL_DOCS.md** - Current implementation details and system specifications
- **GAME_DESIGN.md** - Game mechanics and balance decisions
- **CLAUDE_EVAL_FIX_PLAN.md** - Known issues and fixes to implement
- **CHANGELOG.md** - User-visible changes by version
- **REFACTOR.md** - Historical v0.3 → v0.4 migration details

For specific counts, dimensions, or implementation details, refer to TECHNICAL_DOCS.md.

## Key Implementation Details

- **Zero-dependency design**: No npm packages, libraries, or frameworks
- **Browser compatibility**: Modern ES6+ features, no polyfills required
- **Mobile responsive**: Touch-friendly interface with keyboard controls
- **Save/load system**: LocalStorage-based game state persistence
- **Server-based deployment**: Run `python devServer.py` for full functionality (built script.js is committed)

## Common Development Tasks

### Adding New Features
1. Identify the appropriate module (usually Combat, World, or UI)
2. Implement in src/ module files using existing patterns
3. Build with `node build.mjs`
4. Test thoroughly in browser
5. Update CHANGELOG.md and relevant docs

### Modifying Player Progression
- Edit Player class methods in `src/player.js`
- Update UI display logic in `src/ui.js` if needed
- Rebuild and verify stat displays update correctly

### Adding New Enemies or NPCs
- Define enemy/NPC data in `src/config.js`
- Implement enemy logic in `src/combat.js`
- Implement NPC interactions in `src/npc.js`
- Add graphics to appropriate `graphics/` subdirectory

### Configuration Note
When asked if a config is "used", this means the values actively drive game logic, not just being referenced without affecting behavior.

## Common Pitfalls

### Configuration vs Hardcoding
- Check if values are already defined in GameConfig before hardcoding
- Use StringFormatter for text that includes dynamic values

### Module Dependencies
- Check module dependencies before importing
- Avoid creating circular dependencies
- When in doubt, check the build order in build.mjs

### Server Management
- Don't start servers without explicit user permission
- Manual testing via user's browser is preferred over automated testing

## Philosophy

The codebase prioritizes **simplicity, maintainability, and zero dependencies** while providing a complete RPG experience that runs in any modern browser. When making changes:

1. Preserve the zero-dependency nature
2. Keep the simple deployment model
3. Follow existing patterns and conventions
4. Update relevant documentation
5. Report all changes to the user