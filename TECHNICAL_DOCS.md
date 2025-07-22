# Betta Fish RPG v0.3 - Technical Documentation

## Architecture Overview

### Core Technologies
- **HTML5**: Semantic structure with responsive design
- **CSS3**: Grid/flexbox layouts, animations, layered backgrounds, order-based positioning
- **Vanilla JavaScript**: ES6+ classes, no external dependencies, comprehensive keyboard handling
- **Web Audio API**: Procedural sound generation with fallbacks

### Design Patterns
- **Singleton**: Single game instance manages all state
- **State Machine**: Screen-based navigation system
- **Event-Driven**: UI updates trigger game logic changes
- **Module Pattern**: Encapsulated functionality within class methods

## File Structure

### index.html (175+ lines)
- **Screen Organization**: 6 main game screens (title, creation, village, dialogue, world-map, combat)
- **UI Components**: Stats panel, combat interface with swim-away section, village locations
- **Event Handlers**: Inline onclick handlers for game interactions
- **Graphics Integration**: Image elements for sprites and layered backgrounds
- **Accessibility**: Keyboard shortcut indicators with underlined letters

### style.css (620+ lines)
- **Layout Systems**: Flexbox with order-based combat positioning, CSS Grid for responsive design
- **Screen Management**: Absolute positioning with active state classes
- **Background Layering**: CSS pseudo-elements for three-tier danger zone visualization
- **Visual Effects**: Shake animations, floating sprites, directional transforms
- **Shop Interface**: Interactive item styling with hover states and affordability indicators
- **Responsive Design**: Mobile breakpoints and adaptive layouts

### script.js (1100+ lines)
- **BettaRPG Class**: Main game controller with complete state management
- **Data Structures**: Player stats, NPC dialogues, enemy definitions with level scaling
- **Core Systems**: Combat with level-based damage/armor, progression, economy, audio, graphics
- **Keyboard System**: Comprehensive key handling for all screens with context-aware controls
- **Visual Systems**: Directional sprites, layered backgrounds, dynamic CSS pseudo-elements
- **Event Management**: User interactions, screen transitions, and state persistence

## Core Systems

### Character System
```javascript
player: {
    name: string,           // Auto-generated or user input
    color: string,          // Hue filter selection
    level: number,          // Progression level (1+)
    hp/maxHp: number,       // Health points
    mp/maxMp: number,       // Magic points  
    exp/expToNext: number,  // Experience system
    bettaBites: number      // Currency
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
getPlayerSprite() {
    // Returns appropriate sprite based on:
    // 1. Dunkleosteus submarine (if owned)
    // 2. Armor level (levels 3, 5, 7+)
    // 3. Base betta sprite
}

// Color System
CSS hue-rotate() + saturation for:
- Player color customization (5 preset options)
- Enemy color randomization (0-360° hue)
- No filters for submarine sprite
```

### Audio Implementation
```javascript
playSound(type) {
    // Procedural generation using Web Audio API
    // Sound types: attack, magic, victory, levelup, 
    //              combatstart, wound, treasure
    // Graceful fallback if audio unavailable
}
```

### Economy System
```javascript
// Income Sources
- Combat victories: 1-5 Betta Bites
- Exploration finds: 1-3 Betta Bites (random)

// Spending Options  
- Inn rest: 5 Betta Bites (full HP/MP restore)
- Dunkleosteus submarine: 100 Betta Bites (permanent transformation)
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
npcs: {
    [id]: {
        name: string,
        dialogues: string[],
        isInn?: boolean,      // Service flag
        isShop?: boolean      // Service flag
    }
}
```

### Enemies
```javascript
enemies: [
    {
        name: string,
        hp/maxHp: number,
        attack: number,
        exp: number,
        sprite: string,       // Graphics path
        attacks: string[]     // Combat descriptions
    }
]
```

### Name Generation
```javascript
betteNames: [72 entries]
// Categories: aquatic, gems, nature, personality, fun
// Random selection on character creation
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
- **Single Class**: All game logic in BettaRPG class
- **Method Naming**: Clear, descriptive function names
- **State Management**: Centralized player and game state
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

---

## Development Credits

**Created by:** Rich Conlan  
**Code Development:** Entirely written by Claude Code (Anthropic's AI coding assistant)  
**Graphics:** All pixel art generated by ChatGPT  

*Complete technical reference for Betta Fish RPG implementation and maintenance.*