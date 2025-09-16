# Betta Fish RPG - Practical Testing Plan

## Executive Summary

This document outlines a practical testing strategy for the Betta Fish RPG using Node Test Runner and Playwright. The plan focuses on testing actual game features that exist, preventing real bugs, and maintaining simplicity.

### Goals
- **Primary**: Test the core game mechanics that actually exist
- **Quality**: Prevent game-breaking bugs players would encounter
- **Maintainability**: Simple, zero-dependency testing approach
- **Performance**: Fast test execution (<30 seconds for full suite)

### Success Metrics
- 60-80 tests covering actual game features
- Tests catch real bugs before release
- Zero test dependencies beyond Node.js built-ins
- Can refactor code with confidence

## What the Game Actually Has

Based on the current codebase, the game includes:

✅ **Character Creation** - Name and color selection
✅ **Combat System** - Turn-based battles with spells
✅ **World Exploration** - Movement with boundaries (-50 to 50)
✅ **Village NPCs** - Elder, Innkeeper, Shopkeeper interactions
✅ **Level Progression** - Stats increase, armor unlocks, spells
✅ **Economy** - Betta Bites currency for purchases
✅ **Submarine** - End-game equipment with immunity

❌ **Save/Load System** - Does not exist
❌ **Complex UI frameworks** - Vanilla JavaScript only
❌ **External APIs** - Self-contained browser game

## Testing Architecture

### Simple Stack
- **Unit/Integration Tests**: Node Test Runner (built-in, zero dependencies)
- **E2E Tests**: Playwright (real browser validation)
- **Assertions**: node:assert/strict (built-in)
- **Mocking**: node:test mock utilities (minimal usage)

### Project Structure
```
test/
├── unit/                   # Unit tests for game logic
│   ├── player.test.js      # Player mechanics
│   ├── combat.test.js      # Combat system
│   ├── world.test.js       # Movement and encounters
│   └── config.test.js      # Configuration access
├── integration/            # Module interaction tests
│   ├── player-combat.test.js
│   ├── world-combat.test.js
│   └── npc-interactions.test.js
└── e2e/                   # Browser tests
    ├── game-flow.spec.js   # Critical player journeys
    └── combat.spec.js      # Combat user experience
```

## Test Specifications

### Player Module (src/player.js) - 12 Tests

The core character mechanics that affect gameplay.

#### Damage System (4 tests)
```javascript
describe('Player Damage System', () => {
  it('should take full damage at level 1 (no armor)')
  it('should reduce damage by 2 at level 5 (armor)')
  it('should enforce minimum 1 damage rule')
  it('should grant complete immunity with submarine')
})
```

#### Level Progression (3 tests)
```javascript
describe('Player Progression', () => {
  it('should increase maxHP by 5 and maxMP by 2 per level')
  it('should carry over excess experience')
  it('should unlock spells at correct levels')
})
```

#### Death and Economy (5 tests)
```javascript
describe('Player Economy and Death', () => {
  it('should die when HP reaches 0')
  it('should spend Betta Bites correctly')
  it('should gain Betta Bites from combat')
  it('should lose half Betta Bites on death')
  it('should validate purchase affordability')
})
```

### Combat Module (src/combat.js) - 15 Tests

Turn-based combat mechanics and enemy management.

#### Enemy Generation (3 tests)
```javascript
describe('Combat Enemy Generation', () => {
  it('should scale enemy stats with distance from village')
  it('should exclude befriended species from encounters')
  it('should generate Gar boss at appropriate distances')
})
```

#### Combat Flow (4 tests)
```javascript
describe('Combat Flow', () => {
  it('should handle player attack sequence')
  it('should process enemy counterattack')
  it('should allow fleeing with success probability')
  it('should detect victory and defeat conditions')
})
```

#### Spell System (3 tests)
```javascript
describe('Combat Spells', () => {
  it('should cast Bubble Blast with MP cost and damage')
  it('should befriend enemies with Happy Balloon Time')
  it('should prevent casting without sufficient MP')
})
```

#### Boss Mechanics (2 tests)
```javascript
describe('Gar Boss Combat', () => {
  it('should handle Gar special attack mechanics')
  it('should award submarine access on victory')
})
```

#### Combat Rewards (3 tests)
```javascript
describe('Combat Rewards', () => {
  it('should award experience and Betta Bites on victory')
  it('should trigger level up during combat if enough exp')
  it('should handle level up stat increases correctly')
})
```

### World Module (src/world.js) - 8 Tests

Movement and encounter mechanics.

#### Movement System (4 tests)
```javascript
describe('World Movement', () => {
  it('should prevent movement beyond north boundary (50)')
  it('should prevent movement beyond south boundary (-50)')
  it('should prevent movement beyond east boundary (50)')
  it('should prevent movement beyond west boundary (-50)')
})
```

#### Encounter System (4 tests)
```javascript
describe('World Encounters', () => {
  it('should calculate distance from village correctly')
  it('should increase encounter probability with distance')
  it('should generate different encounter types')
  it('should detect village entry/exit correctly')
})
```

### Config Module (src/config.js) - 5 Tests

Configuration data validation.

```javascript
describe('Game Configuration', () => {
  it('should provide access to player starting stats')
  it('should provide access to enemy definitions')
  it('should format strings with variable substitution')
  it('should provide spell configurations')
  it('should provide armor system definitions')
})
```

## Integration Tests (15-20 Tests)

### Player + Combat Integration (5 tests)
```javascript
describe('Player Combat Integration', () => {
  it('should apply player damage with armor reduction in combat')
  it('should gain experience and level up from combat victory')
  it('should handle player death in combat correctly')
  it('should consume MP when casting spells in combat')
  it('should award Betta Bites for combat victory')
})
```

### World + Combat Integration (3 tests)
```javascript
describe('World Combat Integration', () => {
  it('should trigger combat encounters based on movement')
  it('should scale enemy difficulty with distance')
  it('should return to world after combat completion')
})
```

### NPC Interactions (4 tests)
```javascript
describe('NPC Interactions', () => {
  it('should heal player at inn for cost')
  it('should sell items from shop inventory')
  it('should provide submarine after Gar defeat')
  it('should handle insufficient funds gracefully')
})
```

### Game Initialization (3 tests)
```javascript
describe('Game Initialization', () => {
  it('should create new player with correct starting stats')
  it('should initialize all managers with proper dependencies')
  it('should transition to village screen after character creation')
})
```

## End-to-End Tests (10 Tests)

Critical player journeys in real browser environment.

### Core Game Flow (5 tests)
```javascript
// test/e2e/game-flow.spec.js
describe('Core Game Experience', () => {
  test('should create character and start game')
  test('should move around world and trigger encounters')
  test('should complete combat encounter successfully')
  test('should visit inn and heal after taking damage')
  test('should purchase items from village shop')
})
```

### Combat Experience (5 tests)
```javascript
// test/e2e/combat.spec.js
describe('Combat User Experience', () => {
  test('should win combat by defeating enemy')
  test('should lose combat and respawn in village')
  test('should cast spells during combat')
  test('should flee from combat successfully')
  test('should level up during extended combat')
})
```

## Implementation Setup

### Package.json Scripts
```json
{
  "scripts": {
    "test": "node --test",
    "test:unit": "node --test test/unit/",
    "test:integration": "node --test test/integration/",
    "test:e2e": "playwright test",
    "test:coverage": "node --test --test-coverage",
    "test:watch": "node --test --watch"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

### Basic Test Example
```javascript
// test/unit/player.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Player } from '../../src/player.js';

describe('Player damage system', () => {
  it('should take full damage at level 1', () => {
    const player = new Player();
    player.hp = 20;

    const damage = player.takeDamage(10);

    assert.equal(damage, 10);
    assert.equal(player.hp, 10);
  });

  it('should reduce damage with level 5 armor', () => {
    const player = new Player();
    player.level = 5;
    player.hp = 20;

    const damage = player.takeDamage(10);

    assert.equal(damage, 8); // 10 - 2 armor reduction
    assert.equal(player.hp, 12);
  });
});
```

### Simple Mocking Strategy
```javascript
// Only mock what we must - browser APIs
const mockAudio = {
  playSound: () => {}, // No-op function
  toggleAudio: () => true
};

// Mock DOM elements for headless testing
const mockElement = {
  innerHTML: '',
  style: {},
  addEventListener: () => {}
};
```

## Implementation Roadmap

### Week 1: Core Mechanics (20 tests)
- Set up test structure and basic tooling
- Player damage, healing, and progression tests (12 tests)
- Basic combat flow tests (8 tests)

### Week 2: Complete Units (20 tests)
- Remaining combat tests (spell system, rewards)
- World movement and encounter tests
- Config validation tests

### Week 3: Integration (15-20 tests)
- Player + Combat interaction tests
- World + Combat integration tests
- NPC interaction tests
- Game initialization tests

### Week 4: E2E & Polish (10 tests)
- Playwright setup and configuration
- Critical path E2E tests
- Documentation and cleanup

## Testing Guidelines

### Best Practices
1. **Test Behaviors, Not Implementation**: Focus on what the game does, not how it does it
2. **Use Real Data**: Test with actual game configuration values when possible
3. **Keep Tests Simple**: Each test should verify one specific behavior
4. **Mock Minimally**: Only mock browser APIs (AudioContext, localStorage if needed)

### What NOT to Test
- UI rendering details (covered by E2E tests)
- CSS animations and visual effects
- Audio playback verification
- Image loading mechanics
- Internal private methods

### Coverage Goals
- **Critical Modules**: 80%+ (Player, Combat)
- **Supporting Modules**: 60%+ (World, Config)
- **Overall Target**: 70% code coverage
- **Focus**: Game logic over presentation layer

## Success Metrics

### Quantitative Goals
- **Test Count**: 60-80 total tests
- **Execution Time**: <30 seconds (unit/integration), <2 minutes (E2E)
- **Code Coverage**: 70% overall, focusing on game logic
- **CI Success Rate**: 100% on main branch

### Qualitative Goals
- **Regression Prevention**: Catch game-breaking bugs before release
- **Refactoring Confidence**: Safe to modify code with tests as safety net
- **Documentation**: Tests clearly show how game mechanics work
- **Maintainability**: Tests are easy to understand and update

## Conclusion

This testing plan provides thorough coverage of the Betta Fish RPG's actual features while maintaining simplicity and practicality. By focusing on real game mechanics and using Node.js built-in testing capabilities, we achieve comprehensive validation without over-engineering.

The plan prioritizes preventing actual bugs players would encounter, supports confident refactoring, and creates a foundation for future feature development - all while keeping the testing infrastructure simple and maintainable.