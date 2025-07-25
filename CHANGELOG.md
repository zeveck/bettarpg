# Betta Fish RPG - Changelog

---

## Version 0.3 (Current)

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