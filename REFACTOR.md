# Betta Fish RPG v0.3 → v0.4 Refactoring Proposal

## Refactoring Goal

**Transform the monolithic 1100+ line script.js into a modular, maintainable architecture while preserving the exact same user experience and functionality.**

The current single-file approach has served us well through v0.3, but continued development requires better code organization. This refactoring will break the code into logical modules with clear responsibilities, making future enhancements easier while maintaining the game's zero-dependency, double-click-to-play simplicity.

## Current State Analysis

**Current Architecture:**
- Single `script.js` file (1100+ lines)
- Monolithic `BettaRPG` class containing all functionality
- All state managed through `this.property` references
- No module separation or clear boundaries

**Problems:**
- Difficult to maintain and understand
- Hard to work on specific features in isolation
- Large context window makes AI assistance challenging
- No clear separation of concerns

## Proposed Module Structure

### Core Modules (6 files)

```
src/
├── audio.js        - Sound generation and management
├── player.js       - Character progression and state
├── combat.js       - Battle system and mechanics
├── world.js        - Map navigation and encounters
├── ui.js          - NPCs, dialogues, shops, DOM
└── core.js        - Main game coordination and screens
```

### Module Responsibilities

#### `audio.js`
```javascript
export class AudioManager {
    constructor() { /* Initialize Web Audio API */ }
    playSound(type) { /* Generate procedural sounds */ }
    initAudio() { /* Setup audio context */ }
}
```

**Responsibilities:**
- Web Audio API management
- Procedural sound generation (attack, magic, victory, etc.)
- Audio context initialization and error handling
- No dependencies on other game modules

#### `player.js`
```javascript
export class Player {
    constructor() { /* Initialize stats */ }
    
    // Combat
    takeDamage(amount) { /* Apply damage with armor reduction */ }
    
    // Healing
    healHP(amount) { /* Restore HP, cap at maxHp */ }
    healMP(amount) { /* Restore MP, cap at maxMp */ }
    fullHeal() { /* Restore both HP and MP to max */ }
    
    // Progression  
    levelUp() { /* Handle leveling, includes fullHeal() */ }
    gainExp(amount) { /* Experience management */ }
    
    // Economy
    canAfford(cost) { /* Check Betta Bites */ }
    spendBettaBites(amount) { /* Deduct currency */ }
    gainBettaBites(amount) { /* Add currency */ }
    
    // Getters for UI
    get hpPercentage() { return (this.hp / this.maxHp) * 100; }
    get mpPercentage() { return (this.mp / this.maxMp) * 100; }
}
```

**Responsibilities:**
- Character stats (HP, MP, level, exp, bettaBites)
- All stat modifications (damage, healing, progression)
- Armor system and damage reduction calculations
- Economy transactions (spending/gaining Betta Bites)
- **Single source of truth** for all player state changes
- **No UI concerns** - just data and logic

#### `combat.js`
```javascript
export class CombatManager {
    constructor(player, audioManager) { 
        this.enemyDefinitions = [ /* All enemy data */ ];
        // ... other initialization
    }
    
    // Battle flow
    startBattle(enemy) { /* Initialize combat state */ }
    playerAttack() { /* Handle player attack turn */ }
    playerMagic(spellType) { /* Magic spells (bubble, gravel) */ }
    playerEscape() { /* Flee attempt with level-based difficulty */ }
    
    // Enemy management
    createScaledEnemy(baseEnemy, level) { /* Apply level scaling */ }
    enemyTurn() { /* AI behavior - normal attacks + special abilities */ }
    executeGargantuanAttack() { /* Boss special attack */ }
    
    // Battle resolution
    checkVictory() { /* Win/lose conditions */ }
    endBattle(victory) { /* Cleanup and reward distribution */ }
    
    // Visual effects
    createBubbleEffect() { /* Bubble spell animation */ }
    createGravelEffect() { /* Gravel spell animation */ }
    createGiantGarEffect() { /* Boss special attack */ }
}
```

**Responsibilities:**
- All battle mechanics (attack, magic, escape)
- **Enemy definitions and scaling logic**
- **Enemy AI with normal attacks and special abilities**
- Damage calculations with level scaling
- Combat visual effects and animations
- Turn management and battle state
- Victory/defeat handling and rewards
- **~400-500 lines including enemy system**

#### `world.js`
```javascript
export class WorldManager {
    constructor(player, audioManager, combatManager) { /* Dependencies */ }
    swimDirection(direction) { /* Handle movement */ }
    calculateEnemyLevel() { /* Distance-based scaling */ }
    generateEncounter() { /* 30% combat, 30% treasure, etc. */ }
    startRandomEncounter() { /* Select enemy type, delegate to combat */ }
    findBettaBites() { /* Treasure discovery */ }
    checkVillageOverlap() { /* Village entry detection */ }
}
```

**Responsibilities:**
- Map navigation and positioning
- Encounter generation and probability (30% combat, 30% treasure, 30% peaceful, 10% mystery)
- Enemy level calculation based on distance from village
- Enemy type selection (but not enemy creation/scaling)
- Treasure discovery mechanics
- Village entry/exit logic
- **Pure exploration system - delegates all combat to CombatManager**

#### `ui.js`
```javascript
export class UIManager {
    constructor(player, audioManager) { /* Dependencies */ }
    talkToNPC(npcId) { /* Dialogue system */ }
    showShop() { /* Shop interface */ }
    updatePlayerStats() { /* DOM updates */ }
    handleKeyboard(event) { /* Input management */ }
}
```

**Responsibilities:**
- All DOM manipulation
- NPC dialogues and shop interactions
- Keyboard input handling
- Screen updates and visual feedback
- Inn services and item purchasing

#### `core.js`
```javascript
export class BettaRPG {
    constructor() {
        this.player = new Player();
        this.audio = new AudioManager();
        this.combat = new CombatManager(this.player, this.audio);
        this.world = new WorldManager(this.player, this.audio, this.combat);
        this.ui = new UIManager(this.player, this.audio);
    }
    
    showScreen(screenId) { /* Screen management */ }
    startCharacterCreation() { /* Game flow */ }
}
```

**Responsibilities:**
- Module coordination and dependency injection
- Screen management and game flow
- High-level game state
- Initialization and setup

## Build System

### File Structure
```
betta-rpg/
├── src/
│   ├── audio.js
│   ├── player.js
│   ├── combat.js
│   ├── world.js
│   ├── ui.js
│   └── core.js
├── build.mjs          - Build script
├── script.js          - Generated output
├── index.html
└── style.css
```

### Build Script (`build.mjs`)
```javascript
import fs from 'fs';
import path from 'path';

const modules = [
    'src/audio.js',
    'src/player.js', 
    'src/combat.js',
    'src/world.js',
    'src/ui.js',
    'src/core.js'
];

let combined = '// Betta Fish RPG - Generated from modules\n\n';

modules.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const moduleName = path.basename(file, '.js').toUpperCase();
    
    combined += `// === ${moduleName} MODULE ===\n`;
    // Strip export statements for concatenation
    const strippedContent = content
        .replace(/^export class /gm, 'class ')
        .replace(/^export function /gm, 'function ')
        .replace(/^export const /gm, 'const ');
    
    combined += strippedContent + '\n\n';
});

// Add initialization
combined += '// === INITIALIZATION ===\n';
combined += 'let game;\n';
combined += 'document.addEventListener("DOMContentLoaded", () => {\n';
combined += '    game = new BettaRPG();\n';
combined += '});\n';

fs.writeFileSync('script.js', combined);
console.log('✅ Built script.js from modules');
```

**Usage:** `node build.mjs`

## Build System Decision: Simple Concatenation vs Webpack

**Considered:** Using webpack or other bundlers for module compilation.

**Decision:** Simple concatenation script because:

### **Both Require Building**
- **Concatenation**: `node build.mjs` → `script.js`  
- **Webpack**: `npm run build` → `script.js`
- **User experience identical** - still double-click `index.html`

### **Why Simple Concatenation Wins**
- **Zero dependencies** - only requires Node.js (already needed for development)
- **Readable output** - generated `script.js` is clean and debuggable
- **Easy to understand** - ~20 line build script vs complex webpack config
- **Simple maintenance** - easy to modify build process as needed
- **Fast builds** - no bundler overhead or plugin processing

### **Webpack Trade-offs**
- **Benefits we don't need**: Tree shaking, hot reload, advanced optimizations
- **Complexity we avoid**: Configuration files, loader setup, plugin ecosystem
- **Dependencies we skip**: webpack + plugins in package.json

For a game of this size and complexity, simple concatenation provides all the benefits of modular development without adding unnecessary tooling complexity.

## Cross-Module Interactions

### Player as Single Source of Truth
The Player class handles all stat modifications, while other modules call its methods:

```javascript
// UI Module - Inn rest
if (this.player.canAfford(5)) {
    this.player.spendBettaBites(5);
    this.player.fullHeal();
    this.audioManager.playSound('treasure');
}

// UI Module - Item purchases
buyKelpSnack() {
    if (this.player.canAfford(3)) {
        this.player.spendBettaBites(3);
        this.player.healHP(this.player.maxHp); // Full HP restore
        this.updatePlayerStats(); // Refresh UI
    }
}

// World Module - Encounter generation
startRandomEncounter() {
    const enemyType = Math.floor(Math.random() * 4); // Select enemy type
    const enemyLevel = this.calculateEnemyLevel(); // Distance-based
    this.combatManager.startBattle(enemyType, enemyLevel); // Delegate to combat
}

// Combat Module - Battle initialization
startBattle(enemyType, level) {
    const baseEnemy = this.enemyDefinitions[enemyType];
    this.currentEnemy = this.createScaledEnemy(baseEnemy, level);
    // Initialize combat UI, etc.
}

// Combat Module - Player turn
playerAttack() {
    const damage = this.calculatePlayerDamage();
    this.currentEnemy.hp -= damage;
    
    if (this.currentEnemy.hp <= 0) {
        this.endBattle(true); // Victory
    } else {
        this.enemyTurn();
    }
}

// Combat Module - Enemy turn  
enemyTurn() {
    const attackDesc = this.currentEnemy.attacks[Math.floor(Math.random() * this.currentEnemy.attacks.length)];
    const damage = this.calculateEnemyDamage();
    this.player.takeDamage(damage); // Player handles armor reduction
}
```

### Dependency Flow
```
Core → (creates) → Player, Audio, Combat, World, UI
Combat → (uses) → Player, Audio  
World → (uses) → Player, Audio, Combat
UI → (uses) → Player, Audio
```

No circular dependencies - clean, testable architecture.

## Design Decision: 6 Modules vs 7

**Considered:** Separate EnemyManager module for enemy definitions, AI, and attacks.

**Decision:** Keep enemies within CombatManager because:
- **Tight coupling** - enemies only exist during combat, managed by combat state
- **Appropriate complexity** - enemy logic (~100-150 lines) fits well within combat module
- **Simpler dependencies** - avoids additional module coordination
- **Combat context** - enemy AI decisions need access to combat state (turn counters, battle flow)

This maintains clean separation without over-engineering. Combat becomes the complete battle system including enemy management.

## Migration Strategy

### Phase 1: Extract Independent Systems
1. **Audio first** - completely self-contained
2. **Player data** - minimal dependencies
3. Test thoroughly after each extraction

### Phase 2: Refactor Interdependent Systems
1. **Combat system** - battle mechanics and visual effects
2. **World system** - exploration and encounter generation  
3. **UI system** - DOM manipulation and events
4. Resolve any remaining dependencies

### Phase 3: Core Coordination
1. **Main class** becomes coordinator
2. Clean up interfaces between modules
3. Final testing and optimization

## Benefits of This Approach

### Development Benefits
- **Clearer responsibilities** - each module has one job
- **Easier testing** - can test modules in isolation
- **Better AI context** - smaller files fit in context windows
- **Parallel development** - multiple people could work on different modules

### Maintenance Benefits
- **Reduced cognitive load** - understand one system at a time
- **Cleaner interfaces** - explicit dependencies
- **Better debugging** - easier to isolate issues
- **Future expansion** - clear places to add features

### User Benefits
- **Same experience** - still just double-click index.html
- **Same performance** - concatenated file is identical to current
- **Zero dependencies** - no build requirements for end users

## Potential Challenges

### State Management
- Current code heavily uses `this` references
- Need to pass dependencies between modules
- Risk of circular dependencies

### DOM Coupling
- Current code mixes logic and DOM manipulation
- Need to separate concerns carefully
- Event handling needs coordination

### Testing During Migration
- Need to maintain working game at each step
- Risk of breaking existing functionality
- Requires careful incremental approach

## Alternative Approach: Gradual Extraction

If full refactoring seems too risky, we could:

1. **Keep current structure** but extract large functions
2. **Create utility modules** (audio, constants) first
3. **Gradually move** functionality as confidence builds
4. **Maintain compatibility** throughout process

## Recommendation

I recommend **proceeding with the full modular approach** because:

1. **Current size** (1100+ lines) makes maintenance difficult
2. **Clear module boundaries** exist in the current code
3. **Build system is simple** and maintains user experience
4. **Benefits outweigh risks** for long-term maintainability

The migration can be done incrementally to minimize risk while achieving better code organization.

## Version Impact

This refactoring represents a **major architectural change** warranting the v0.4 version bump:
- **Internal**: Complete code reorganization with new build system
- **External**: Zero user impact - same functionality and performance
- **Development**: Significantly improved maintainability and extensibility

## Next Steps

If approved:
1. Create `src/` directory structure  
2. Set up build system (`build.mjs`)
3. Start with audio module extraction (lowest risk)
4. Build and test incrementally after each module
5. Update all documentation to reflect new architecture
6. Tag as v0.4 when complete

## Risk Assessment

**Low Risk:**
- Build system is simple and well-tested approach
- User experience unchanged (same generated `script.js`)
- Can revert to v0.3 at any point during migration

**Medium Risk:**
- State management changes require careful testing
- Module boundaries need to be validated through use

**Mitigation:**
- Incremental migration with testing at each step
- Keep working v0.3 codebase until v0.4 is complete

What are your thoughts on this approach?