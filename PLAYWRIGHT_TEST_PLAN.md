# Betta Fish RPG - Comprehensive Playwright Test Plan

## Executive Summary

This document outlines a comprehensive test plan for the Betta Fish RPG using Playwright MCP to thoroughly evaluate both desktop and mobile experiences. The plan covers all game mechanics, UI interactions, keyboard shortcuts, and user experience aspects.

## Test Environment

- **URL**: http://localhost:5555
- **Desktop Resolution**: 1280x720
- **Mobile Resolution**: 375x667 (iPhone SE)
- **Browser**: Chromium (via Playwright)

## Testing Approach

### 1. Progressive Gameplay Testing
Test the game as a real player would experience it, from character creation through boss defeat.

### 2. Interface Testing
Verify all clickable elements and keyboard shortcuts work as expected.

### 3. State Management Testing
Ensure game state is properly maintained across screens and actions.

### 4. Visual/UX Evaluation
Take screenshots and provide feedback on design, usability, and accessibility.

## Detailed Test Scenarios

### Phase 1: Initial Setup & Character Creation

#### 1.1 Game Launch
- Navigate to localhost:5555
- Verify title screen loads correctly
- Screenshot: Title screen presentation
- Test audio toggle functionality (if present)

#### 1.2 Character Creation
- Click "Start Game" button
- Test character name input:
  - Enter custom name
  - Test random name generator button
  - Verify name validation (empty, special characters)
- Test color selection:
  - Click through all available colors
  - Verify sprite preview updates with color changes
- Test keyboard navigation:
  - Tab through form elements
  - Enter key to submit
- Click "Create Character" button
- Screenshot: Character creation screen

### Phase 2: Village Hub Exploration

#### 2.1 Village Screen Overview
- Verify arrival in village after character creation
- Screenshot: Village main screen
- Check player stats display (HP, MP, Level, EXP, Betta Bites)
- Verify all village buildings are visible and clickable

#### 2.2 NPC Interactions - Complete Coverage

**Elder's Dwelling**
- Click on Elder's Dwelling (or press assigned key)
- Navigate through all dialogue options
- Test dialogue tree branches
- Verify any lore or tutorial information
- Screenshot: Elder dialogue

**Fish Mart (Shopkeeper)**
- Click on Fish Mart (or press assigned key)
- View shop inventory
- Check item prices and descriptions
- Test purchase flow:
  - With sufficient Betta Bites
  - With insufficient funds
- Test submarine availability (if applicable)
- Screenshot: Shop interface

**Innkeeper (Swishy Solace Inn)**
- Click on Inn (or press assigned key)
- Check rest cost display
- Test rest functionality:
  - With sufficient funds
  - With insufficient funds
- Verify HP/MP restoration after rest
- Screenshot: Inn interface

**Village Guard**
- Click on Guard (or press assigned key)
- Test dialogue options
- Check for combat tips or warnings
- Screenshot: Guard dialogue

**Young Betta (Bubble's Home)**
- Click on Bubble's Home (or press assigned key)
- Navigate dialogue tree
- Check for any side quests or information
- Screenshot: Young Betta dialogue

#### 2.3 Village Navigation Testing
- Test "Exit to Paddies" button (or press assigned key)
- Test returning to village from world map
- Verify ArrowDown key exits village (when not blocked)
- Test immediate re-entry prevention after village entry

### Phase 3: World Exploration

#### 3.1 Movement System
- Exit village to world map
- Screenshot: World map initial view
- Test directional movement:
  - Click "Swim North" button / Press ArrowUp
  - Click "Swim South" button / Press ArrowDown
  - Click "Swim East" button / Press ArrowRight
  - Click "Swim West" button / Press ArrowLeft
- Test boundary detection (try to move beyond map edges)
- Test "Return to Village" button / Press Home key
- Verify coordinate display updates
- Track distance from village

#### 3.2 Encounter System
- Move around world to trigger encounters
- Document encounter types found:
  - Combat encounters
  - Treasure encounters
  - Peaceful encounters
  - Mystery encounters
- Verify encounter rate increases with distance
- Screenshot: Each encounter type

### Phase 4: Combat System - Comprehensive Testing

#### 4.1 Basic Combat Flow
- Trigger combat encounter
- Screenshot: Combat screen layout
- Verify enemy sprite display
- Check enemy name and level
- Verify player and enemy HP displays

#### 4.2 Combat Actions - All Options

**Basic Attack**
- Click "Attack" button / Press 'A' key
- Verify damage dealt to enemy
- Check damage numbers display
- Verify enemy retaliation
- Test armor damage reduction (if applicable)

**Spell Testing - All Spells**

*Bubble Blast (Level 1)*
- Click spell button / Press 'B' key
- Verify MP consumption (3 MP)
- Check spell damage (5-12)
- Test with insufficient MP
- Verify spell animation/effects

*Gravel Grenade (Level 4)*
- Once unlocked, click button / Press 'G' key
- Verify MP consumption (5 MP)
- Check spell damage (8-15)
- Test with insufficient MP
- Verify spell effects

*Happy Balloon Time (Level 7)*
- Once unlocked, click button / Press 'H' key
- Verify MP consumption (7 MP)
- Test befriending mechanics
- Verify befriended species tracking
- Check that befriended species don't appear as enemies

**Flee Mechanics**
- Click "Swim Away" button / Press 'S' key
- Test flee success rate
- Test flee from difficult enemies (level 5+)
- Verify return to world map on successful flee

#### 4.3 Combat Outcomes
- Test victory:
  - Verify EXP gain
  - Check Betta Bites reward
  - Test victory fanfare/effects
- Test defeat:
  - Verify respawn in village
  - Check Betta Bites penalty (lose half)
  - Verify HP/MP state after defeat
- Screenshot: Victory and defeat screens

### Phase 5: Progression System

#### 5.1 Leveling Mechanics
- Gain experience through combat
- Test level up:
  - Verify stat increases (+5 HP, +2 MP)
  - Check full heal on level up
  - Verify level up effects/sounds
  - Screenshot: Level up notification

#### 5.2 Spell Unlocks
- Reach level 4:
  - Verify Gravel Grenade unlock
  - Test new spell in combat
- Reach level 7:
  - Verify Happy Balloon Time unlock
  - Test new spell functionality

#### 5.3 Armor Progression
- Level 3: Verify helmet acquisition (1 damage reduction)
- Level 5: Verify advanced armor (2 damage reduction)
- Level 7: Verify full metal armor (3 damage reduction)
- Test damage reduction in combat
- Verify sprite changes with armor upgrades
- Screenshot: Each armor tier

### Phase 6: Economy System

#### 6.1 Currency Management
- Track Betta Bites accumulation from combat
- Test spending at shop
- Test spending at inn
- Verify balance updates correctly
- Test death penalty (lose half Betta Bites)

#### 6.2 Shop Purchases
- Return to village with funds
- Purchase items from shop
- Verify item effects
- Test submarine purchase (if available):
  - Check immunity in combat
  - Verify sprite change
  - Test special mechanics

### Phase 7: Boss Battle - Prehistoric Gar

#### 7.1 Boss Encounter
- Navigate to deep water areas
- Trigger Gar encounter
- Screenshot: Boss battle screen
- Document boss mechanics:
  - HP and attack patterns
  - Special abilities
  - Difficulty scaling

#### 7.2 Boss Strategy Testing
- Test different combat approaches:
  - Basic attacks only
  - Spell combinations
  - Befriending attempt (if possible)
- Document effective strategies
- Test defeat and retry mechanics

#### 7.3 Victory Conditions
- Defeat the Gar
- Document rewards
- Check for special dialogue or endings
- Screenshot: Victory screen

### Phase 8: Advanced Features

#### 8.1 Save/Load System
- Test save game functionality (if present)
- Verify load game restores correct state
- Test multiple save slots (if available)

#### 8.2 Cheat Codes (if discovered)
- Test '$' key: +100 Betta Bites
- Test '%' key: Level up
- Test '+' key: Full heal
- Document any other discovered cheats

#### 8.3 Audio System
- Test audio toggle button
- Verify sound effects for:
  - Combat actions
  - Spell casting
  - Level up
  - Victory/defeat
  - Menu interactions

### Phase 9: UI/UX Evaluation

#### 9.1 Visual Design Assessment
- Evaluate 16-bit art style consistency
- Check sprite quality and animations
- Review color palette and theming
- Assess visual hierarchy
- Screenshot: Key visual elements

#### 9.2 Interface Usability
- Test all clickable elements
- Verify hover states
- Check button responsiveness
- Test keyboard shortcut indicators
- Evaluate text readability
- Check for visual feedback on actions

#### 9.3 Information Architecture
- Assess stat display clarity
- Review combat log readability
- Check dialogue presentation
- Evaluate menu organization
- Test navigation flow between screens

#### 9.4 Accessibility Considerations
- Test keyboard-only navigation
- Check color contrast
- Evaluate text size
- Test for colorblind accessibility
- Check for motion sensitivity issues

### Phase 10: Mobile Testing (375x667)

#### 10.1 Responsive Design
- Set viewport to mobile dimensions
- Screenshot: Mobile title screen
- Verify all UI elements scale properly
- Check text remains readable
- Test button sizes for touch targets

#### 10.2 Touch Interactions
- Test all buttons with touch/click
- Verify touch areas are appropriately sized
- Test swipe gestures (if implemented)
- Check for accidental touch prevention
- Test dialogue navigation on mobile

#### 10.3 Mobile-Specific UX
- Evaluate portrait orientation layout
- Test virtual keyboard interactions (name input)
- Check scrolling behavior (if needed)
- Verify no horizontal overflow
- Test all game features on mobile
- Screenshot: Key mobile screens

#### 10.4 Performance on Mobile
- Check for smooth animations
- Test combat responsiveness
- Verify no lag in UI updates
- Check load times

## Bug Categories to Track

### Critical Bugs
- Game crashes or freezes
- Progression blockers
- Save/load corruption
- Combat system failures
- Incorrect damage calculations

### Major Bugs
- UI elements not responding
- Incorrect stat displays
- Missing sprites or graphics
- Audio playback issues
- Dialogue tree breaks

### Minor Bugs
- Visual glitches
- Text overflow
- Inconsistent styling
- Minor animation issues
- Tooltip problems

### UX Issues
- Confusing navigation
- Unclear instructions
- Poor visual feedback
- Inconsistent interactions
- Accessibility problems

## Performance Metrics

### Load Times
- Initial page load
- Screen transitions
- Combat initialization
- Sprite loading

### Responsiveness
- Input lag measurement
- Animation frame rates
- UI update speed
- Combat action delays

## Deliverables

### 1. INITIAL_PLAYWRIGHT_DESKTOP_EVAL.md
Comprehensive evaluation report including:
- Detailed test execution results
- Screenshots with commentary
- Bug report with severity levels
- UX improvement recommendations
- Performance observations
- Gameplay balance feedback

### 2. INITIAL_PLAYWRIGHT_MOBILE_EVAL.md
Mobile-specific evaluation including:
- Responsive design assessment
- Touch interaction testing
- Mobile UX recommendations
- Performance on mobile viewport
- Comparison with desktop experience

## Test Execution Checklist

### Desktop Testing
- [ ] Title screen and game launch
- [ ] Character creation flow
- [ ] All NPC dialogues in village
- [ ] World map navigation
- [ ] All movement directions and boundaries
- [ ] Combat with various enemies
- [ ] All spell types
- [ ] Flee mechanics
- [ ] Level progression to 7+
- [ ] Armor upgrades
- [ ] Shop purchases
- [ ] Inn services
- [ ] Boss battle with Gar
- [ ] Death and respawn
- [ ] All keyboard shortcuts
- [ ] All click interactions
- [ ] Audio system
- [ ] Visual design evaluation
- [ ] Performance assessment

### Mobile Testing
- [ ] Responsive layout at 375x667
- [ ] Touch target sizes
- [ ] All game features on mobile
- [ ] Text readability
- [ ] Navigation on small screen
- [ ] Performance on mobile viewport
- [ ] Portrait orientation testing
- [ ] Virtual keyboard interaction
- [ ] Mobile-specific UX issues

## Success Criteria

### Functional Success
- All game features work as designed
- No critical or major bugs found
- Progression system functions correctly
- Combat mechanics work properly
- All NPCs and dialogues accessible

### UX Success
- Intuitive navigation
- Clear visual feedback
- Consistent interactions
- Readable text at all sizes
- Accessible via keyboard and mouse/touch

### Performance Success
- Smooth gameplay (no lag)
- Quick screen transitions
- Responsive controls
- Stable performance over extended play

## Notes for Testers

1. **Document Everything**: Take screenshots liberally, especially of issues
2. **Think Like a Player**: Note confusion points and friction in gameplay
3. **Test Edge Cases**: Try unexpected actions and sequences
4. **Compare Platforms**: Note differences between desktop and mobile
5. **Provide Solutions**: Don't just identify problems, suggest improvements
6. **Check Consistency**: Ensure similar actions behave similarly throughout
7. **Test Thoroughly**: Don't skip "obvious" tests - verify everything works

This comprehensive test plan ensures thorough evaluation of the Betta Fish RPG across all systems, mechanics, and platforms.