# Betta Fish RPG - Game Design Document

## Core Concept

**Genre**: Turn-based RPG  
**Platform**: Web Browser  
**Target Audience**: Casual gamers, RPG enthusiasts  
**Play Time**: 20-45 minutes per session  
**Theme**: Aquatic adventure with mystery elements

## Design Philosophy

### Authenticity
- **Rice Paddy Setting**: Bettas naturally inhabit rice paddies, not oceans
- **Species Accuracy**: Enemy fish are appropriate threats to bettas
- **Environmental Realism**: Water-based ecosystem with realistic elements

### Accessibility
- **No Installation**: Runs directly in any modern browser
- **Keyboard Controls**: Complete keyboard navigation for all screens
- **Quick Start**: Default character options for immediate play
- **Visual Feedback**: Clear danger zones and directional indicators

### Engagement
- **Visual Progression**: Armor upgrades and sprite evolution
- **Mystery Narrative**: Disappearances drive exploration motivation
- **Audio Feedback**: Procedural sounds enhance all actions

## Game Systems

### Character Progression
- **Level-Based Armor**: Visual upgrades at levels 3, 5, 7 with damage reduction
- **Traditional Stats**: HP, MP, Level, EXP with clear progression
- **Alternating Scaling**: Attack improves on even levels, magic on odd levels for balanced growth
- **Armor Protection**: Damage reduction (-1/-2/-3) based on armor tier
- **Special Transformation**: Dunkleosteus submarine overrides armor system
- **Color Persistence**: Player-chosen hue maintained throughout

### Combat Design
- **Turn-Based**: Player action → enemy response cycle
- **Multiple Actions**: Attack, Bubble Blast (3 MP), Gravel Grenade (5 MP, level 5+), flee
- **Level Scaling**: Both player damage and enemy difficulty scale with progression
- **Visual Combat**: Facing sprites with damage animations and color variation
- **Enemy Variety**: 4 species + Gargantuan Gar boss with level-based scaling (1-10)
- **Escape Mechanics**: High-level enemies (5+) make fleeing very difficult

### Economic Balance
- **Betta Bites Currency**: Thematic food-based system
- **Income Sources**: Combat rewards + exploration discoveries
- **Spending Options**: Inn recovery (5), consumables (Kelp Snacks 3, Bubble Water 2), submarine (100)
- **Clickable Shop**: Direct item purchasing with visual affordability indicators
- **Progression Gate**: Submarine requires significant resource accumulation

### World Design
- **Hub Structure**: Safe village with 5 functional NPCs and streamlined interactions
- **Exploration Grid**: 4-directional movement with directional fish sprites
- **Visual Danger Zones**: Three-tier water backgrounds indicating threat levels
- **Safe Village Exit**: Grace period prevents immediate combat after leaving village
- **Edge Zone Challenge**: Guaranteed Level 10 encounters in outer danger zones
- **Environmental Systems**: Dynamic backgrounds and decorative elements
- **Mystery Integration**: NPC dialogue builds narrative tension

## Technical Implementation

### Architecture
- **Modular ES6**: 8-module architecture with clear separation of concerns
- **Configuration-Driven**: Central `GameConfig` and `GameStrings` for all constants and text
- **Screen System**: Modular areas with smooth transitions
- **Event-Driven**: Clean separation of UI and game logic
- **Asset Management**: Efficient sprite and audio handling

### Visual Systems
- **Pixel Art**: Crisp rendering with proper scaling
- **Color Variation**: CSS hue-rotation for enemy and player customization
- **Animation**: Shake effects, floating title sprites, transitions
- **Responsive Design**: Adapts to desktop and mobile layouts

### Audio Implementation
- **Procedural Generation**: Web Audio API creates all sounds
- **Context-Aware**: Different sounds for combat, exploration, UI
- **Graceful Fallback**: Game functions without audio support

## Content Strategy

### NPC Design
- **Functional Diversity**: Story, shop, inn, and atmosphere NPCs
- **Dialogue Depth**: Multiple exchanges revealing world details
- **Service Integration**: Shop and inn provide mechanical value
- **Mystery Building**: Each NPC contributes clues about disappearances

### Enemy Progression
- **Balanced Scaling**: HP (8→18), EXP (15→45), logical difficulty curve
- **Visual Distinction**: Unique sprites for each species
- **Attack Variety**: Thematic combat descriptions per enemy type
- **Color Randomization**: Hue variation creates visual variety

### Environment
- **Rice Paddy Authenticity**: Tiled water backgrounds with vegetation
- **Spatial Logic**: Village center with directional exploration
- **Dynamic Elements**: Random rice tufts, village positioning
- **Visual Hierarchy**: Layered elements with proper z-indexing

## User Experience

### Onboarding
1. **Instant Defaults**: Random name + red color for quick start
2. **Village Safety**: Risk-free NPC interaction before combat
3. **Clear Progression**: Obvious paths and visual feedback
4. **Immediate Rewards**: Early combat success and currency gain

### Interface Design
- **Persistent Stats**: Always-visible player information with sprite
- **Compact Layout**: Efficient use of screen space
- **Visual Feedback**: Immediate response to all interactions
- **Contextual Options**: Relevant actions appear automatically

### Difficulty Balance
- **Graduated Challenge**: Enemy strength increases predictably
- **Resource Management**: Balanced income vs. expenditure
- **Recovery Options**: Inn provides safety net for resource restoration
- **Optional Progression**: Submarine purchase extends gameplay goals

---

## Development Credits

**Created by:** Rich Conlan  
**Code Development:** Entirely written by Claude Code (Anthropic's AI coding assistant)  
**Graphics:** All pixel art generated by ChatGPT  

*Betta Fish RPG delivers authentic aquatic adventure through accessible browser-based gameplay.*