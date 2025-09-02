# Betta Fish RPG v0.4.6 - Technical Documentation

## Architecture Overview

### Core Technologies
- **HTML5**: Semantic structure with responsive design
- **CSS3**: Grid/flexbox layouts, animations, layered backgrounds, order-based positioning
- **Vanilla JavaScript**: ES6+ modular classes, no external dependencies, comprehensive keyboard handling
- **Web Audio API**: Procedural sound generation with fallbacks
- **Configuration System**: Centralized GameConfig and GameStrings for constants and localization

### Design Patterns
- **Modular Architecture**: 9-module ES6 system with clear boundaries
- **Configuration-Driven**: Central constants and strings management
- **Dependency Injection**: Clean module initialization and wiring
- **State Machine**: Screen-based navigation system
- **Event-Driven**: UI updates trigger game logic changes

## File Structure

### index.html (195 lines)
- **Screen Organization**: 6 main game screens (title, creation, village, dialogue, world-map, combat)
- **UI Components**: Stats panel, combat interface with swim-away section, village locations
- **Event Handlers**: Inline onclick handlers for game interactions
- **Graphics Integration**: Image elements for sprites and layered backgrounds
- **Accessibility**: Keyboard shortcut indicators with underlined letters

### style.css (1193 lines)
- **Layout Systems**: Flexbox with order-based combat positioning, CSS Grid for responsive design
- **Screen Management**: Absolute positioning with active state classes
- **Background Layering**: CSS pseudo-elements for three-tier danger zone visualization
- **Visual Effects**: Shake animations, floating sprites, directional transforms
- **Shop Interface**: Interactive item styling with hover states and affordability indicators
- **Responsive Design**: Mobile breakpoints and adaptive layouts

### src/ modules (9 ES6 modules)
- **config.js**: GameConfig and GameStrings - centralized constants and text
- **audio.js**: AudioManager - Web Audio API wrapper
- **player.js**: Player - character state, progression, combat mechanics
- **npc.js**: NPCManager - village characters and dialogue trees
- **dialog.js**: DialogManager - modal dialog system
- **combat.js**: CombatManager - battle system and enemy management
- **world.js**: WorldManager - exploration, encounters, map generation
- **ui.js**: UIManager - DOM manipulation and screen management
- **core.js**: BettaRPG - module coordination and public API

### script.js (generated)
- **Built File**: Concatenated modules with exports stripped for browser compatibility
- **Build System**: Simple module concatenation via build.mjs

## Core Systems

### Configuration System
```javascript
// All game constants centralized
GameConfig.PLAYER.STARTING_STATS = { hp: 20, mp: 10, level: 1, ... }
GameConfig.COMBAT.SPELLS.BUBBLE_BLAST = { mpCost: 3, damageMin: 5, ... }
GameConfig.ENEMIES.FIERCE_CICHLID = { baseHp: 18, baseDamage: 8, ... }
// Shop items are hardcoded in world.js - see FIX-004 in fix plan

// All game text centralized
GameStrings.NPCS.ELDER_FINN.DIALOGUES = ['Welcome, young one...', ...]
GameStrings.COMBAT.ENEMY_APPEARS = 'A wild {enemyName} (Level {level}) appears!'
GameStrings.UI.BUTTONS.START_ADVENTURE = 'Start Adventure'
```

### Character System
```javascript
// Player class uses configuration
class Player {
    constructor() {
        const stats = GameConfig.PLAYER.STARTING_STATS;
        this.hp = stats.hp;
        this.level = stats.level;
        // ...
    }
}
```

### Combat Architecture
```javascript
// Combat Flow
startRandomEncounter() → updateCombatDisplay() → playerAction() → enemyTurn() → checkVictory()

// Visual Elements
- Player sprite (left, facing right)
- Enemy sprite (right, facing left, random hue)
- HP bars with real-time updates
- Combat log with narrative descriptions
```

### Graphics Management
```javascript
// Sprite selection from configuration
getSprite() {
    if (this.hasDunkleosteusSub) {
        return `graphics/artifacts/${GameConfig.PLAYER.ARMOR_SYSTEM.SUBMARINE.sprite}`;
    }
    const armorLevels = GameConfig.PLAYER.ARMOR_SYSTEM.LEVELS;
    // Returns appropriate sprite based on level
}

// Color System from configuration
getColorFilter() {
    const colorConfig = GameConfig.UI.COLORS[this.color?.toUpperCase()];
    return colorConfig ? colorConfig.filter : 'none';
}
```

### Audio Implementation
```javascript
playSound(type) {
    // Procedural generation using Web Audio API
    // Sound types: attack, bubble, gravel, party, fanfare,
    //              levelup, combatstart, wound, roar, found
    // Plus additional sounds like 'befriend', 'victory', 'defeat'
    // Graceful fallback if audio unavailable
}
```

### Economy System
```javascript
// Shop items are hardcoded in world.js getShopItems()
// Costs: Submarine (100), Kelp Snack (3), Bubble Water (2)
// Note: This is identified as FIX-004 in the fix plan

GameConfig.ECONOMY.SERVICES = {
    INN_REST: { cost: 5, effect: 'full_restore' }
};

GameConfig.ECONOMY.INCOME_SOURCES = {
    TREASURE_BASE: { min: 1, max: 3 }  // Used for treasure encounters
};

GameConfig.COMBAT.ENEMY_SCALING.BETTA_BITES_REWARDS = {
    baseMin: 1, baseMax: 5,           // Base combat rewards
    levelBonusMin: 1, levelBonusMax: 2 // Per enemy level
};
```

## Screen Management

### Navigation System
```javascript
showScreen(screenId) {
    // Hide all screens (force display: none)
    // Show target screen (force display: block)
    // Update stats panel visibility
    // Set dynamic backgrounds and decorations
}
```

### Background Systems
- **World Map**: `water-tile2.png` with random rice tufts
- **Combat**: `water-tile.png` background
- **Village/Other**: Gradient backgrounds only

### UI Layout
- **Stats Panel**: Flexbox layout with sprite + stats columns
- **Village Grid**: 2-column layout with centered odd items
- **Combat Interface**: Facing sprites with action buttons below

## Data Structures

### NPCs
```javascript
// NPCs defined in configuration
GameStrings.NPCS.ELDER_FINN = {
    NAME: "Elder Finn",
    DIALOGUES: [
        "Welcome, young one. I sense great potential in you.",
        "There have been strange happenings lately...",
        // ...
    ]
};

// NPCManager uses configuration
class NPCManager {
    constructor() {
        this.npcs = {
            elder: {
                name: GameStrings.NPCS.ELDER_FINN.NAME,
                dialogues: GameStrings.NPCS.ELDER_FINN.DIALOGUES
            }
        };
    }
}
```

### Enemies
```javascript
// Enemies defined in configuration
GameConfig.ENEMIES.FIERCE_CICHLID = {
    name: 'Fierce Cichlid',
    baseHp: 18,
    baseDamage: 8,
    baseExp: 45,
    sprite: 'fierce_cichlid.png',
    attacks: [
        'The Fierce Cichlid charges with incredible force!',
        'The cichlid displays bright colors before attacking!',
        'The fierce fish uses its powerful jaws in a devastating bite!'
    ]
};

// CombatManager converts config to runtime format
createEnemyFromConfig(enemyConfig) {
    return {
        name: enemyConfig.name,
        hp: enemyConfig.baseHp,
        maxHp: enemyConfig.baseHp,
        attack: enemyConfig.baseDamage,
        exp: enemyConfig.baseExp,
        sprite: `graphics/enemies/${enemyConfig.sprite}`,
        attacks: enemyConfig.attacks
    };
}
```

### Name Generation
```javascript
// Names defined in configuration
GameStrings.CHARACTER_CREATION.RANDOM_NAMES = [
    "Bubbles", "Finley", "Shimmer", "Sparkle", "Azure", "Coral", "Pearl",
    // 72 total names across categories: aquatic, gems, nature, personality, fun
];

// Used during character creation
generateRandomName() {
    const names = GameStrings.CHARACTER_CREATION.RANDOM_NAMES;
    return names[Math.floor(Math.random() * names.length)];
}
```

## Performance Optimizations

### DOM Management
- **Element Reuse**: Combat sprites updated vs. recreated
- **Batch Updates**: Multiple style changes applied together
- **Event Delegation**: Efficient listener management
- **Memory Cleanup**: Remove old decorative elements

### Graphics Optimization
- **Pixelated Rendering**: `image-rendering: pixelated` for crisp sprites
- **CSS Filters**: Hue rotation instead of multiple sprite files
- **Z-Index Layering**: Efficient element stacking (rice < village < player < UI)

### Audio Efficiency
- **Procedural Generation**: No large audio files to load
- **Automatic Cleanup**: Oscillator nodes garbage collected
- **Conditional Loading**: Audio context created only when supported

## Browser Compatibility

### Modern Web Standards
- **ES6+ Features**: Classes, arrow functions, template literals
- **CSS Grid/Flexbox**: Modern layout techniques
- **Web Audio API**: With graceful degradation
- **No Polyfills**: Targets current browser versions

### Responsive Design
- **Desktop**: Full layout with proper spacing
- **Mobile**: Stacked layouts, smaller sprites, reduced gaps
- **Touch**: Large touch targets for mobile interaction

## Development Guidelines

### Code Organization
- **Modular Architecture**: 9 ES6 modules with clear separation of concerns
- **Configuration-Driven**: All constants and strings centralized in GameConfig/GameStrings
- **Method Naming**: Clear, descriptive function names
- **State Management**: Distributed across specialized modules with clean interfaces
- **Error Handling**: Graceful fallbacks for missing elements

### Asset Management
- **Graphics Structure**: Organized folders (main_fish, enemies, map, artifacts)
- **Naming Conventions**: Descriptive filenames matching enemy names
- **Path Management**: Relative paths for portability

### Testing Approach
- **Manual Testing**: All user interaction paths verified
- **Edge Cases**: Empty inputs, audio unavailable, rapid clicking
- **Cross-Platform**: Desktop and mobile browser testing
- **Performance**: No memory leaks or performance degradation

## Version 0.4.3 Updates

### Configuration Improvements
- **FIX-004: Consolidated Hardcoded Prices**: Created centralized GameConfig.SHOP configuration for all pricing
- **Single Source of Truth**: Shop costs, inn costs, and dialogue pricing now use one configuration location
- **Template-based Dialogues**: NPC conversations use {cost} placeholders processed by StringFormatter
- **Maintainable Pricing**: Changing prices now requires updating only GameConfig.SHOP values

## Version 0.4.2 Updates

### Audio Improvements
- **FIX-020: Audio Context Initialization**: Fixed browser autoplay policy compliance by deferring audio context creation until first user interaction
- **Audio Toggle Control**: Added subtle speaker icon in bottom-left corner allowing users to toggle audio on/off
- **Enhanced User Experience**: Audio respects browser policies and provides user control without cluttering the interface

## Version 0.4.1 Updates

### Bug Fixes
- **Removed broken getNPCList method**: Deleted non-functional method in world.js that would cause runtime error if called
- **Fixed duplicate HTML IDs**: Removed duplicate version-info element to ensure valid HTML

### Known Issues (To Be Fixed)
- **Shop prices hardcoded**: Item costs are hardcoded in world.js rather than using configuration (see FIX-004)
- **World distance thresholds**: Map generation uses hardcoded values instead of config constants (see FIX-005)
- **Previous enemy sprite flash**: Brief display of previous enemy sprite when entering combat (see FIX-018)
- **Audio context initialization**: May be blocked by browser autoplay policies (see FIX-020)

---

## Development Credits

**Created by:** Rich Conlan  
**Code Development:** Entirely written by Claude Code (Anthropic's AI coding assistant)  
**Graphics:** All pixel art generated by ChatGPT  

*Complete technical reference for Betta Fish RPG implementation and maintenance.*