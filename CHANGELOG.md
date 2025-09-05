# Betta Fish RPG - Changelog

---

## Version 0.4.10 (Current)

### ✅ Event Handler Modernization (FIX-028)
**Complete Migration from onclick to Event Listeners** - Architectural consistency achieved

#### Issue Fixed
- **Problem**: Inconsistent event handling - mix of inline `onclick` attributes in HTML and `addEventListener` calls in JavaScript
- **Before**: HTML used `onclick="if(game) game.swimDirection('north')"` with global game object dependency
- **After**: Clean event delegation pattern with data attributes and single delegated listener

#### Changes Made
- **Removed all onclick attributes** from HTML elements (17 total)
- **Implemented event delegation system** using data-action attributes
- **Fixed querySelector references** that looked for onclick attributes (3 locations)
- **Updated dialogue generation** to use data attributes instead of onclick strings
- **Replaced direct onclick assignment** with addEventListener for popup
- **Updated stale comments** to reflect new event handling patterns

#### Technical Details
- **Event Delegation**: Single document-level click listener routes to appropriate handlers
- **Data Attributes**: `data-action="continue-dialogue"` replaces `onclick="game.ui.continueDialogue()"`
- **Decoupled Architecture**: Eliminated window.game global dependency from HTML
- **Consistent Patterns**: All interactive elements now use the same event handling approach

#### Benefits
- **Better Separation of Concerns**: HTML for structure, JS for behavior
- **Improved Maintainability**: Consistent event handling patterns throughout
- **Enhanced Security**: No onclick injection vectors remain
- **Cleaner Architecture**: Eliminated global object coupling between HTML and JS
- **Future-Proof**: Modern event handling practices for better extensibility

### ✅ Development Workflow Optimization (FIX-022)
**Webpack Dev Server Optimization** - Enhanced development experience for containerized environments

#### Issue Fixed
- **Problem**: Webpack dev server wasn't detecting file changes in Docker/devcontainer environments
- **Before**: Manual server restarts required after every code change, breaking development flow
- **After**: Automatic file watching with optimized polling for container compatibility

#### Changes Made
- **Added Polling Configuration**: `watchOptions` with 3-second polling for Docker/devcontainer compatibility
- **Disabled HMR**: Removed Hot Module Replacement to fix performance issues and graphics loading delays
- **Optimized Build Performance**: Disabled compression for faster development builds
- **Maintained Live Reload**: Files automatically rebuild and browser refreshes on changes

#### Technical Details
```javascript
// webpack.config.js additions
watchOptions: {
  poll: 3000,           // Poll every 3 seconds
  aggregateTimeout: 600, // Batch changes
  ignored: /node_modules/
},
devServer: {
  hot: false,           // Disable HMR for performance
  compress: false       // Faster development builds
}
```

#### Benefits
- **Seamless Development**: No manual restarts needed after code changes
- **Container Optimized**: Proper file watching in Docker/devcontainer environments  
- **Performance Improved**: Graphics load normally without HMR interference
- **Faster Builds**: Optimized configuration for development workflow
- **Professional Tooling**: Industry-standard webpack development experience

---

## Version 0.4.9

### ✅ Configuration Cleanup (FIX-016)  
**Removed Duplicate Color Configuration** - Clean separation of concerns

#### Issue Fixed
- **Problem**: Color names appeared in both GameConfig.UI.COLORS and GameStrings.UI.COLORS
- **Before**: GameConfig contained `{ filter: 'hue-rotate(0deg)', name: 'Red' }` mixing technical config with UI text
- **After**: GameConfig contains only `{ filter: 'hue-rotate(0deg)' }` while GameStrings remains authoritative for display text

#### Changes Made
- Removed 'name' property from all GameConfig.UI.COLORS entries (RED, BLUE, PURPLE, GREEN, ORANGE)
- Updated ui.js line 1021 to use GameStrings.UI.COLORS.RED instead of GameConfig.UI.COLORS.RED.name
- Maintained identical functionality with cleaner architecture

#### Benefits
- **Proper Separation**: Technical configuration vs. user-facing strings
- **Single Source of Truth**: GameStrings authoritative for all display text
- **Better Maintainability**: Clear where to change filters vs. display names
- **Consistent Architecture**: Aligns with existing patterns in codebase

**Files affected**: src/config.js, src/ui.js  
**Build output**: Maintained 89.9 KiB minified script.js

---

## Version 0.4.8

### 🏗️ Major Build System Migration - Webpack Implementation
- **Completed FIX-027**: Migrated from simple concatenation build to modern webpack bundler
- **ES6 module system**: All source files now use proper `import`/`export` statements for explicit dependencies
- **Modern tooling**: Industry-standard webpack build pipeline with minification and optimization
- **Enhanced development workflow**: Added `npm run build` for production builds and `npm run dev` for development with watch mode
- **Package.json infrastructure**: Established npm project structure with webpack as development dependency

### 🔧 Technical Improvements
- **Explicit dependencies**: Every module now declares its imports, eliminating global scope dependency issues
- **Better IDE support**: Autocomplete and navigation work properly with explicit imports
- **Minified output**: Production builds are optimized to 89.9 KiB (down from previous unminified builds)
- **Module isolation**: Each class is properly encapsulated within its module
- **Global game exposure**: Maintains backward compatibility with HTML onclick handlers via `window.game`

### 📊 Build System Comparison
- **Before**: Simple concatenation via `node build.mjs` (208 lines of build script)
- **After**: Webpack bundling via `npm run build` (modern configuration-based approach)
- **Dependencies**: Added webpack and webpack-cli as devDependencies (zero runtime dependencies maintained)
- **Output quality**: Minified, optimized, and more maintainable codebase
- **Development experience**: Watch mode, better error reporting, industry-standard tooling

### 🛠️ Developer Experience Enhancements
- **npm run build**: Production build with minification
- **npm run dev**: Development build with watch mode for rapid iteration
- **Proper module resolution**: No more manual dependency ordering
- **Future-ready**: Easy to add code splitting, tree shaking, and other optimizations

---

## Version 0.4.7

### 🏗️ Major Architectural Cleanup - DialogManager Removal
- **Completed FIX-015**: Eliminated DialogManager's broken container reference issue by removing the entire class
- **Completed FIX-024**: Resolved DialogManager naming confusion - no more conflict between NPC dialogues and modal confirmations
- **Architectural unification**: All dialogue handling now consolidated in UIManager for cleaner, more maintainable code
- **Code reduction**: Removed 208 lines of DialogManager code, added ~25 lines of inline confirmation handling
- **Net improvement**: 183 lines removed with zero functionality loss
- **Simplified architecture**: Eliminated confusing three-way split between NPCManager (data), UIManager (display), and DialogManager (confirmations)

### 🔧 Technical Improvements
- **Purchase confirmations**: Submarine, item, and inn rest confirmations now display directly in dialogue screen
- **Event handling**: Added `endConfirmation()` method and `isShowingConfirmation` flag for consistent state management
- **Build system**: Updated build.mjs to remove dialog.js from module compilation
- **Testing maintained**: All confirmation flows continue to work identically for end users

### 📊 Code Quality Impact
- **Files modified**: 2 (src/ui.js, build.mjs)
- **Files deleted**: 1 (src/dialog.js)
- **Build verification**: Successfully rebuilt script.js without DialogManager references
- **Functionality preserved**: All three confirmation scenarios (submarine purchase, item purchase, inn rest) work as before

---

## Version 0.4.6

### 🧹 Dead Code Removal & Code Cleanup
- **Completed dead code removal (Phase 3)**: Systematically removed all identified unused functions and references
- **Removed dead functions**: Eliminated `canMoveTo()`, `isShopNPC()`, `isInnNPC()`, and `getStats()` methods
- **Cleaned up event listeners**: Removed event listeners for non-existent button elements (northBtn, southBtn, etc.)
- **Eliminated dead DOM references**: Removed references to non-existent combatArea and movementControls elements
- **Removed dead function**: Eliminated entire updateMovementButtons() function that operated on non-existent buttons and served no purpose due to screen isolation
- **Confirmed FIX-006 resolution**: Verified that duplicate condition was already fixed with worldMap removal (FIX-005)

### 🧹 Dead Code Removal & Code Cleanup
- **Completed dead code removal (Phase 3)**: Systematically removed all identified unused functions and references
- **Removed dead functions**: Eliminated `canMoveTo()`, `isShopNPC()`, `isInnNPC()`, and `getStats()` methods
- **Cleaned up event listeners**: Removed event listeners for non-existent button elements (northBtn, southBtn, etc.)
- **Eliminated dead DOM references**: Removed references to non-existent combatArea and movementControls elements
- **Removed dead function**: Eliminated entire updateMovementButtons() function that operated on non-existent buttons and served no purpose due to screen isolation
- **Confirmed FIX-006 resolution**: Verified that duplicate condition was already fixed with worldMap removal (FIX-005)

### 📊 Code Quality Improvements
- **Line reduction**: Removed ~50 lines of dead code across 4 files
- **Cleaner architecture**: Eliminated confusing unused methods and references
- **Better maintainability**: Code now contains only actively used functions and elements
- **Documentation accuracy**: Updated FIX_PLAN with completion status for all dead code fixes

### 📝 Maintenance
- Updated version number to 0.4.6
- Updated CLAUDE_EVAL_FIX_PLAN.md with completion status (15/28 fixes now complete)
- Rebuilt script.js with all dead code removed

---

## Version 0.4.5

### 🧹 Code Cleanup & Architecture Improvements
- **Fixed threshold mismatch (FIX-005)**: Removed unused worldMap data structure that was causing confusion
- **Dead code elimination**: Removed 59 lines of unused world generation code and 441 unused objects
- **Memory optimization**: Eliminated unnecessary 21x21 tile array that was never accessed
- **Architecture cleanup**: Simplified getCurrentLocation() to return only needed coordinates
- **Code clarity**: Removed conflicting threshold systems, UI rendering already used correct config values

### 🏗️ Technical Improvements
- **Simplified WorldManager**: Cleaner class structure with single responsibility
- **Reduced memory footprint**: Eliminated storage of unused tile objects and sprite paths
- **Single source of truth**: UI system is now the only tile rendering authority
- **Better maintainability**: Fewer moving parts, clearer code flow

### 📝 Maintenance
- Updated version number to 0.4.5
- Updated all documentation to reflect architectural cleanup

---

## Version 0.4.4

### 🚀 Performance & Architecture Improvements
- **Fixed background rendering performance (FIX-025)**: Implemented comprehensive background caching and pre-rendering system
- **New UI architecture**: Separate background containers for village and world screens eliminate CSS switching
- **Pre-rendering system**: World map background generates during game initialization, eliminating first-view flash
- **Enhanced UX**: Smooth transitions between screens with zero visual artifacts or rendering glitches
- **Performance boost**: Background operations moved to game startup when user isn't waiting

### 🏗️ Technical Improvements
- **Container separation**: Village and world screens use dedicated background container elements
- **CSS optimization**: Fixed background properties eliminate dynamic style switching
- **Synchronous caching**: Cached backgrounds apply instantly without Promise delays
- **Graceful fallbacks**: Pre-rendering failures fall back to on-demand generation

### 📝 Maintenance
- Updated version number to 0.4.4
- Updated all documentation to reflect performance improvements

---

## Version 0.4.3

### ⚙️ Configuration Improvements
- **Fixed hardcoded prices (FIX-004)**: Created centralized GameConfig.SHOP configuration for all pricing
- **Single source of truth**: Shop costs, inn costs, and dialogue pricing now managed in one location  
- **Template-based dialogues**: NPC conversations use {cost} placeholders processed dynamically
- **Enhanced maintainability**: Changing prices requires updating only GameConfig.SHOP values

### 📝 Maintenance  
- Updated version number to 0.4.3
- Updated all documentation to reflect configuration improvements

---

## Version 0.4.2

### 🎵 Audio Improvements  
- **Fixed audio autoplay policy compliance**: Audio context now initializes on first user interaction instead of page load (FIX-020)
- **Added audio toggle control**: Subtle speaker icon in bottom-left corner allows users to toggle audio on/off
- **Enhanced user experience**: Audio respects browser policies and provides intuitive user control

### 📝 Maintenance
- Updated version number to 0.4.2
- Updated all documentation to reflect audio improvements

---

## Version 0.4.1

### 🐛 Bug Fixes
- **Removed broken getNPCList method**: Deleted non-functional method that would cause runtime error if called (FIX-003)
- **Fixed duplicate HTML IDs**: Removed duplicate version-info element to ensure valid HTML (FIX-002)

### 📝 Maintenance
- Updated version number to 0.4.1
- Organized evaluation documents into EVALS subfolder

---

## Version 0.4

### 🛒 Shop System Overhaul
- **Clickable Items**: Shop items become interactive buttons when affordable
- **Visual States**: Blue tint for buyable items, normal appearance when disabled
- **Expanded Inventory**: Added Kelp Snack (3 Betta Bites) and Bubble Water (2 Betta Bites)
- **Compact Design**: Eliminated separate purchase buttons for cleaner UI

### 🏘️ Village Improvements
- **Streamlined NPCs**: Removed Old Fisherman and Village Healer to focus gameplay
- **Enhanced Dialogue**: Bubble now mentions dreams of exploring terraced cities
- **Renamed Inn**: "Restful Inn" became "Swishy Solace Inn" for more personality

### 💰 Economy Balance
- **Strategic Pricing**: Inn (5) vs Kelp Snack (3) + Bubble Water (2) = value vs convenience
- **Consumable Items**: Full HP/MP restoration items for tactical planning
- **Economic Flow**: Regular combat income supports item purchases

### 🎨 UI Polish
- **Consistent Theming**: Blue interactive elements match dialogue buttons
- **Enhanced Readability**: No desaturation on disabled items
- **Smooth Animations**: Hover effects and lift transitions
- **Professional Styling**: Clean shop card design with proper visual hierarchy

---

## Version 0.2

### 🔥 Major New Features
- **Enemy Level System (1-10)**: Distance-based enemy scaling with visual level indicators
- **Edge Zone Mechanics**: Level 10 enemies in dangerous outer areas with guaranteed encounters
- **Keyboard Controls**: Full keyboard support for world map navigation and combat
- **Enhanced Death System**: Proper HP visualization, Betta Bites penalties, and death animations
- **Submarine Invulnerability**: Dunkleosteus submarine provides complete damage immunity

### ⚔️ Combat Improvements
- **Level-Based Escape**: Swim Away disabled for Level 5+ enemies with visual feedback
- **Enemy Damage Animations**: Enemies shake and flip when taking damage/dying
- **Improved Combat Flow**: HP bars update properly, better visual feedback
- **Global Waiting Cursor**: Consistent cursor behavior during post-combat processing

### 🎮 User Experience Enhancements
- **Village Encounter Log**: Messages now visible in both village and world map
- **Welcome Message**: Personalized greeting when starting adventure
- **Keyboard Shortcuts**: Arrow keys for movement, A/B/S for combat actions, Home for village
- **Text Selection Prevention**: No accidental highlighting during dialogue clicks
- **Congratulations Trigger**: Now shows on first Level 10 victory instead of map edge

### 🐛 Bug Fixes & Polish
- **Enemy Graphics Flash**: Fixed brief display of previous enemy graphics
- **HP Display on Death**: HP bar properly shows 0 before recovery
- **Log Height Adjustment**: Village log sized to prevent page scrollbars
- **Death Timing**: Added delay so players can see losses before village return
- **UI Label Clarity**: "Betta Bites" instead of emoji in stats panel

### 🎯 Cheat Features
- **Developer Cheat**: Press '$' key for +100 Betta Bites (testing purposes)

### 📊 Balance Changes
- **Movement Speed**: Reduced world map steps from 5% to 3% for finer control
- **Edge Zone Boundaries**: Adjusted from 20% to 15% of screen boundaries
- **Escape Success**: Guaranteed success for enabled Swim Away (Levels 1-4)
- **Betta Bites Scaling**: Higher level enemies provide significantly more currency

---

## Version 0.1 (Foundation)

### 🎮 Core Game Features
- **Character Creation**: Name input with random generator, 5 color choices
- **Village Hub**: 7 unique NPCs with branching dialogue trees
- **World Map Exploration**: 4-directional movement through rice paddies
- **Turn-Based Combat**: Attack, Bubble Blast skill, and flee mechanics
- **RPG Progression**: HP/MP/Level/EXP system with armor upgrades

### 🎨 Visual & Audio
- **Pixel Art Graphics**: Complete sprite system replacing emoji placeholders
- **Progressive Armor**: Visual upgrades at levels 3, 5, 7
- **Procedural Audio**: Web Audio API sound generation for all actions
- **Dynamic Backgrounds**: Tiled water with random rice paddy decorations
- **Color Customization**: CSS hue-rotation for player and enemy variety

### 🏪 Economy System
- **Betta Bites Currency**: Thematic food-based economy
- **Inn Services**: HP/MP restoration for 5 Betta Bites
- **Shop System**: Dunkleosteus submarine for 100 Betta Bites
- **Income Sources**: Combat victories and exploration discoveries

### 🎵 Audio Experience
- **8 Sound Types**: Attack, magic, victory, level up, combat start, damage, treasure
- **Dynamic Music**: Context-aware audio for different game states
- **Graceful Degradation**: Game functions without audio support

### 🏗️ Technical Foundation
- **Vanilla JavaScript**: ES6+ class-based architecture, no dependencies
- **Responsive Design**: Desktop and mobile layouts
- **Screen Management**: Smooth transitions between game areas
- **State Persistence**: Complete game state management
- **Development Server**: Flask server with network access

### 📚 Documentation
- **Complete Docs**: README, Game Design, Technical Docs, Development Diary
- **Asset Organization**: Structured graphics folders and file naming
- **Code Quality**: Clear architecture with comprehensive comments

---

## Development Credits

**Created by:** Rich Conlan  
**Code Development:** Entirely written by Claude Code (Anthropic's AI coding assistant)  
**Graphics:** All pixel art generated by ChatGPT  

*Betta Fish RPG continues to evolve with each version, adding new features while maintaining the core aquatic adventure experience.*