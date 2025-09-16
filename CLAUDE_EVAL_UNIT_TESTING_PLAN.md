# Betta Fish RPG - Comprehensive Unit Testing Plan

## Executive Summary

This document outlines a modern, thorough testing strategy for the Betta Fish RPG codebase following 2025 best practices. The plan emphasizes practical testing that provides high value while maintaining development velocity.

## Testing Framework Selection: Vitest

### Why Vitest (2025 Best Practices)
- **Native ES6 Module Support**: No transpilation needed, works directly with our webpack setup
- **Performance**: 2-5x faster than Jest/Mocha due to worker thread parallelization
- **Zero Configuration**: Works out-of-the-box with modern JavaScript projects
- **Built-in Mocking**: Comprehensive mocking for browser APIs (Web Audio, Canvas, localStorage)
- **jsdom Integration**: Browser environment simulation without overhead
- **Jest Compatibility**: Easy migration path if needed (85-90% compatibility)
- **Watch Mode**: Instant feedback during development

## Testing Philosophy

### Core Principles
1. **Test Behavior, Not Implementation**: Focus on what the code does, not how
2. **Isolation**: Each unit test should be independent and deterministic
3. **Speed**: Unit tests must run in milliseconds for rapid feedback
4. **Clarity**: Tests serve as living documentation
5. **Maintainability**: Simple tests that are easy to update

### Testing Pyramid Distribution
- **Unit Tests**: 70% (~350 tests) - Fast, isolated, numerous
- **Integration Tests**: 20% (~100 tests) - Module interactions
- **E2E Tests**: 10% (~50 tests) - Critical user paths

## Module-by-Module Testing Strategy

### 1. Player Module (`src/player.js`) - 45 Unit Tests

#### Core Functionality Tests
```javascript
describe('Player', () => {
  describe('Damage System', () => {
    // 8 tests
    - 'applies base damage correctly'
    - 'reduces damage based on armor level'
    - 'armor reduction at level 3 (helmet)'
    - 'armor reduction at level 5 (advanced)'
    - 'armor reduction at level 7 (full metal)'
    - 'minimum 1 damage rule'
    - 'submarine provides complete immunity'
    - 'returns actual damage taken'
  })

  describe('Progression System', () => {
    // 10 tests
    - 'levels up with correct stat gains'
    - 'HP increases by 5 per level'
    - 'MP increases by 2 per level'
    - 'experience carries over after level'
    - 'experience threshold scales by 1.5x'
    - 'max level cap enforcement'
    - 'full heal on level up'
    - 'level bonus damage calculation'
    - 'magic bonus calculation (odd levels)'
    - 'experience gain triggers level check'
  })

  describe('Spell System', () => {
    // 12 tests
    - 'bubble blast unlocks at level 1'
    - 'happy balloon time unlocks at level 3'
    - 'gravel grenade unlocks at level 5'
    - 'MP cost validation for each spell'
    - 'cannot cast without sufficient MP'
    - 'spell damage calculation with magic bonus'
    - 'MP deduction on successful cast'
    - 'hasSpell returns correct availability'
    - 'canCastSpell checks both unlock and MP'
    - 'bubble blast damage range'
    - 'party spell damage range'
    - 'gravel spell damage range'
  })

  describe('Economy System', () => {
    // 6 tests
    - 'canAfford checks Betta Bites balance'
    - 'spendBettaBites deducts correctly'
    - 'cannot spend more than available'
    - 'gainBettaBites adds to balance'
    - 'death penalty loses half Betta Bites'
    - 'death penalty rounds down'
  })

  describe('Equipment System', () => {
    // 5 tests
    - 'submarine acquisition sets flag'
    - 'submarine doubles attack damage'
    - 'getSprite returns correct armor sprite'
    - 'getSprite returns submarine when owned'
    - 'color filter application'
  })

  describe('State Management', () => {
    // 4 tests
    - 'reset returns to initial state'
    - 'setPlayerIdentity updates name and color'
    - 'isAlive checks HP > 0'
    - 'percentage calculations for HP/MP'
  })
})
```

### 2. Combat Module (`src/combat.js`) - 55 Unit Tests

#### Combat Mechanics Tests
```javascript
describe('CombatManager', () => {
  describe('Enemy Generation', () => {
    // 10 tests
    - 'generates appropriate enemy for distance'
    - 'enemy level scales with distance'
    - 'enemy stats scale correctly'
    - 'boss enemies at specific distances'
    - 'prehistoric gar special behavior'
    - 'enemy sprite selection'
    - 'minimum stats enforcement'
    - 'maximum scaling caps'
    - 'random enemy selection from pool'
    - 'befriended species are skipped'
  })

  describe('Damage Calculations', () => {
    // 12 tests
    - 'player attack damage formula'
    - 'enemy attack damage formula'
    - 'critical hit probability'
    - 'miss probability'
    - 'submarine damage bonus'
    - 'armor damage reduction'
    - 'spell damage calculations'
    - 'damage variance ranges'
    - 'minimum damage rules'
    - 'overkill prevention'
    - 'damage rounding'
    - 'special attack multipliers'
  })

  describe('Combat Flow', () => {
    // 15 tests
    - 'turn order alternation'
    - 'player action processing'
    - 'enemy action processing'
    - 'combat victory conditions'
    - 'combat defeat conditions'
    - 'flee success probability'
    - 'flee failure consequences'
    - 'combat reward calculation'
    - 'experience distribution'
    - 'Betta Bites rewards'
    - 'level up detection'
    - 'death handling'
    - 'combat state reset'
    - 'special victory conditions'
    - 'befriending mechanics'
  })

  describe('Spell Effects', () => {
    // 10 tests
    - 'bubble blast damage application'
    - 'happy balloon befriending'
    - 'gravel grenade damage'
    - 'spell animation triggers'
    - 'MP consumption validation'
    - 'spell availability checks'
    - 'spell miss probability'
    - 'spell critical hits'
    - 'area effect calculations'
    - 'status effect application'
  })

  describe('Boss Mechanics', () => {
    // 8 tests
    - 'prehistoric gar roar pattern'
    - 'boss health scaling'
    - 'boss reward multipliers'
    - 'special attack patterns'
    - 'phase transitions'
    - 'immunity phases'
    - 'enrage mechanics'
    - 'unique boss behaviors'
  })
})
```

### 3. World Module (`src/world.js`) - 35 Unit Tests

#### World Management Tests
```javascript
describe('WorldManager', () => {
  describe('Movement System', () => {
    // 10 tests
    - 'north movement updates coordinates'
    - 'south movement updates coordinates'
    - 'east movement updates coordinates'
    - 'west movement updates coordinates'
    - 'boundary enforcement north'
    - 'boundary enforcement south'
    - 'boundary enforcement east'
    - 'boundary enforcement west'
    - 'village entry/exit detection'
    - 'distance from village calculation'
  })

  describe('Encounter System', () => {
    // 12 tests
    - 'encounter probability by distance'
    - 'encounter type distribution'
    - 'combat encounter generation'
    - 'treasure encounter rewards'
    - 'peaceful encounter types'
    - 'mystery encounter outcomes'
    - 'no encounters in village'
    - 'encounter cooldown mechanics'
    - 'forced encounter conditions'
    - 'special location encounters'
    - 'encounter reward scaling'
    - 'rare encounter probability'
  })

  describe('Shop System', () => {
    // 8 tests
    - 'shop inventory generation'
    - 'kelp snack healing amount'
    - 'bubble water MP restoration'
    - 'submarine availability'
    - 'price validation'
    - 'purchase transaction flow'
    - 'inventory refresh mechanics'
    - 'special item conditions'
  })

  describe('NPC Interactions', () => {
    // 5 tests
    - 'dialogue initiation'
    - 'dialogue state management'
    - 'purchase callbacks'
    - 'inn rest mechanics'
    - 'NPC availability by location'
  })
})
```

### 4. NPC Module (`src/npc.js`) - 30 Unit Tests

#### NPC System Tests
```javascript
describe('NPCManager', () => {
  describe('Dialogue System', () => {
    // 12 tests
    - 'dialogue tree navigation'
    - 'option selection validation'
    - 'dialogue state tracking'
    - 'multi-branch conversations'
    - 'dialogue completion detection'
    - 'option availability logic'
    - 'dialogue reset on completion'
    - 'cost substitution in text'
    - 'variable interpolation'
    - 'dialogue history tracking'
    - 'special dialogue conditions'
    - 'dialogue action callbacks'
  })

  describe('NPC Types', () => {
    // 10 tests
    - 'villager dialogue trees'
    - 'elder special dialogue'
    - 'shopkeeper inventory'
    - 'innkeeper services'
    - 'trainer tips system'
    - 'fisherman stories'
    - 'NPC sprite selection'
    - 'NPC availability times'
    - 'NPC location mapping'
    - 'special event NPCs'
  })

  describe('Transaction System', () => {
    // 8 tests
    - 'purchase validation'
    - 'insufficient funds handling'
    - 'successful purchase flow'
    - 'inn rest cost calculation'
    - 'inn healing mechanics'
    - 'submarine purchase special'
    - 'item delivery confirmation'
    - 'transaction rollback on error'
  })
})
```

### 5. Audio Module (`src/audio.js`) - 20 Unit Tests

#### Audio System Tests
```javascript
describe('AudioManager', () => {
  describe('Audio Context', () => {
    // 5 tests
    - 'initialization on first interaction'
    - 'browser compatibility fallback'
    - 'context reuse after init'
    - 'audio enable/disable toggle'
    - 'graceful degradation without support'
  })

  describe('Sound Generation', () => {
    // 15 tests
    - 'attack sound parameters'
    - 'bubble sound parameters'
    - 'gravel sound parameters'
    - 'party sound melody'
    - 'fanfare sequence'
    - 'level up ascending scale'
    - 'combat start sound'
    - 'wound sound effect'
    - 'roar sound parameters'
    - 'treasure found sound'
    - 'oscillator configuration'
    - 'gain node configuration'
    - 'frequency ramping'
    - 'sound duration control'
    - 'multiple note sequences'
  })
})
```

### 6. Config Module (`src/config.js`) - 25 Unit Tests

#### Configuration Tests
```javascript
describe('GameConfig', () => {
  describe('Configuration Access', () => {
    // 10 tests
    - 'player starting stats'
    - 'progression multipliers'
    - 'combat damage ranges'
    - 'spell configurations'
    - 'enemy definitions'
    - 'shop prices'
    - 'world boundaries'
    - 'UI color mappings'
    - 'game version'
    - 'nested config access'
  })

  describe('StringFormatter', () => {
    // 10 tests
    - 'simple substitution'
    - 'multiple substitutions'
    - 'missing variable handling'
    - 'number formatting'
    - 'nested substitutions'
    - 'special characters'
    - 'empty string handling'
    - 'null value handling'
    - 'cost substitution'
    - 'complex templates'
  })

  describe('GameStrings', () => {
    // 5 tests
    - 'UI string access'
    - 'dialogue string access'
    - 'combat message access'
    - 'error message access'
    - 'localization structure'
  })
})
```

### 7. UI Module (`src/ui.js`) - 60 Unit Tests

#### UI Management Tests
```javascript
describe('UIManager', () => {
  describe('Screen Management', () => {
    // 15 tests
    - 'title screen display'
    - 'character creation screen'
    - 'village screen display'
    - 'world map screen'
    - 'combat screen display'
    - 'dialogue screen display'
    - 'game over screen'
    - 'screen transition logic'
    - 'screen state persistence'
    - 'modal overlay handling'
    - 'screen cleanup on exit'
    - 'background rendering'
    - 'sprite display updates'
    - 'animation triggers'
    - 'screen-specific controls'
  })

  describe('Input Handling', () => {
    // 15 tests
    - 'keyboard navigation'
    - 'combat action keys'
    - 'dialogue option selection'
    - 'movement controls'
    - 'menu navigation'
    - 'hotkey shortcuts'
    - 'input validation'
    - 'input state management'
    - 'disabled input contexts'
    - 'multi-key combinations'
    - 'key repeat prevention'
    - 'focus management'
    - 'tab navigation'
    - 'escape key handling'
    - 'enter key contexts'
  })

  describe('Display Updates', () => {
    // 20 tests
    - 'HP bar updates'
    - 'MP bar updates'
    - 'EXP bar updates'
    - 'level display'
    - 'Betta Bites counter'
    - 'enemy health display'
    - 'combat log updates'
    - 'status effect icons'
    - 'equipment display'
    - 'map position indicator'
    - 'NPC name display'
    - 'dialogue text rendering'
    - 'option button generation'
    - 'sprite transformations'
    - 'color filter application'
    - 'animation frame updates'
    - 'particle effects'
    - 'screen shake effects'
    - 'fade transitions'
    - 'notification popups'
  })

  describe('State Synchronization', () => {
    // 10 tests
    - 'player stat sync'
    - 'combat state sync'
    - 'world position sync'
    - 'dialogue state sync'
    - 'save/load UI updates'
    - 'error state display'
    - 'loading indicators'
    - 'tooltip updates'
    - 'help text display'
    - 'version info display'
  })
})
```

### 8. Core Module (`src/core.js`) - 25 Unit Tests

#### Core System Tests
```javascript
describe('BettaRPG', () => {
  describe('Initialization', () => {
    // 8 tests
    - 'manager creation'
    - 'manager linking'
    - 'DOM verification'
    - 'event listener setup'
    - 'initial screen display'
    - 'asset preloading'
    - 'error handling'
    - 'browser compatibility'
  })

  describe('Game Flow', () => {
    // 10 tests
    - 'new game creation'
    - 'character creation flow'
    - 'game loop management'
    - 'save game functionality'
    - 'load game functionality'
    - 'pause/resume mechanics'
    - 'game over handling'
    - 'victory conditions'
    - 'achievement triggers'
    - 'statistics tracking'
  })

  describe('Integration', () => {
    // 7 tests
    - 'manager communication'
    - 'event propagation'
    - 'state consistency'
    - 'error recovery'
    - 'memory management'
    - 'performance monitoring'
    - 'debug mode features'
  })
})
```

## Mock Strategy

### Browser API Mocks

```javascript
// test/mocks/browser.js
export const setupBrowserMocks = () => {
  // Web Audio API Mock
  global.AudioContext = vi.fn(() => ({
    createOscillator: vi.fn(() => ({
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn()
      },
      type: 'sine'
    })),
    createGain: vi.fn(() => ({
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn()
      }
    })),
    destination: {},
    currentTime: 0
  }))

  // localStorage Mock
  const localStorageMock = {
    store: {},
    getItem: vi.fn(key => localStorageMock.store[key] || null),
    setItem: vi.fn((key, value) => localStorageMock.store[key] = value.toString()),
    removeItem: vi.fn(key => delete localStorageMock.store[key]),
    clear: vi.fn(() => localStorageMock.store = {}),
    key: vi.fn(index => Object.keys(localStorageMock.store)[index] || null),
    get length() { return Object.keys(this.store).length }
  }
  global.localStorage = localStorageMock

  // Canvas Mock
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: [] })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => []),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    translate: vi.fn(),
    transform: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1
  }))

  HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock')
}
```

### DOM Element Mocks

```javascript
// test/mocks/dom.js
export const createMockElement = (id, tagName = 'div') => {
  const element = document.createElement(tagName)
  element.id = id
  element.style = {}
  element.classList = {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn(() => false),
    toggle: vi.fn()
  }
  element.addEventListener = vi.fn()
  element.removeEventListener = vi.fn()
  element.innerHTML = ''
  element.textContent = ''
  return element
}

export const setupGameDOM = () => {
  // Create all necessary DOM elements
  const elements = [
    'game-container', 'title-screen', 'character-creation',
    'village-screen', 'world-screen', 'combat-screen',
    'dialogue-screen', 'game-over-screen', 'player-name',
    'player-hp', 'player-mp', 'player-level', 'player-exp',
    'player-betta-bites', 'enemy-name', 'enemy-hp',
    'combat-log', 'dialogue-text', 'dialogue-options'
  ]

  elements.forEach(id => {
    document.body.appendChild(createMockElement(id))
  })
}
```

## Test Utilities

### Test Data Factories

```javascript
// test/factories/player.js
export const createTestPlayer = (overrides = {}) => ({
  name: 'TestFish',
  color: 'blue',
  level: 1,
  hp: 20,
  maxHp: 20,
  mp: 10,
  maxMp: 10,
  exp: 0,
  expToNext: 100,
  bettaBites: 0,
  hasDunkleosteusSub: false,
  befriendedSpecies: new Set(),
  ...overrides
})

// test/factories/enemy.js
export const createTestEnemy = (overrides = {}) => ({
  name: 'Test Snail',
  type: 'snail',
  level: 1,
  hp: 10,
  maxHp: 10,
  attackPower: 3,
  expReward: 25,
  bettaBitesReward: 5,
  sprite: 'snail.png',
  ...overrides
})
```

### Custom Matchers

```javascript
// test/matchers/game.js
export const gameMatchers = {
  toBeWithinRange(received, min, max) {
    const pass = received >= min && received <= max
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to be within range [${min}, ${max}]`
        : `Expected ${received} to be within range [${min}, ${max}]`
    }
  },
  
  toHaveValidStats(received) {
    const valid = 
      received.hp >= 0 && received.hp <= received.maxHp &&
      received.mp >= 0 && received.mp <= received.maxMp &&
      received.exp >= 0 && received.level > 0
    return {
      pass: valid,
      message: () => valid
        ? `Expected player not to have valid stats`
        : `Expected player to have valid stats`
    }
  }
}
```

## Implementation Phases

### Phase 1: Infrastructure (Week 1)
1. Install Vitest and dependencies
2. Configure vitest.config.js
3. Set up test directory structure
4. Create mock utilities
5. Implement test factories
6. Add custom matchers
7. Configure coverage reporting

### Phase 2: Core Module Tests (Week 2)
1. Player module tests (45 tests)
2. Config module tests (25 tests)
3. Audio module tests (20 tests)

### Phase 3: Game Logic Tests (Week 3)
1. Combat module tests (55 tests)
2. World module tests (35 tests)
3. NPC module tests (30 tests)

### Phase 4: UI and Integration (Week 4)
1. UI module tests (60 tests)
2. Core module tests (25 tests)
3. Integration tests (100 tests)

### Phase 5: E2E and Polish (Week 5)
1. E2E test scenarios (50 tests)
2. Performance benchmarks
3. Coverage gap analysis
4. Documentation updates

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
    
    - name: Archive test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-results
        path: |
          coverage/
          test-results/
```

## Coverage Goals

### Minimum Coverage Requirements
- **Overall**: 80% coverage
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 85%
- **Lines**: 80%

### Module-Specific Goals
- **Player**: 95% (critical game state)
- **Combat**: 90% (core gameplay)
- **Config**: 95% (game constants)
- **World**: 85% (game world logic)
- **NPC**: 80% (dialogue system)
- **Audio**: 70% (non-critical)
- **UI**: 75% (DOM interaction)
- **Core**: 85% (initialization)

## Best Practices Checklist

### Test Quality
- [ ] Each test has a single assertion focus
- [ ] Test names clearly describe behavior
- [ ] Arrange-Act-Assert pattern used
- [ ] No complex logic in tests
- [ ] Tests are deterministic
- [ ] Tests run in isolation

### Performance
- [ ] Unit tests complete in <2 seconds
- [ ] Integration tests complete in <10 seconds
- [ ] E2E tests complete in <30 seconds
- [ ] Parallel execution enabled
- [ ] Test data is minimal

### Maintainability
- [ ] Tests grouped logically
- [ ] Shared setup extracted
- [ ] Mock complexity minimized
- [ ] Test utilities documented
- [ ] Coverage reports reviewed
- [ ] Flaky tests eliminated

## Monitoring and Metrics

### Key Metrics to Track
1. **Test Execution Time**: Target <5 seconds for full unit suite
2. **Coverage Trends**: Monitor coverage changes per PR
3. **Test Flakiness**: Track and fix intermittent failures
4. **Test-to-Code Ratio**: Maintain 2:1 test-to-code lines
5. **Defect Escape Rate**: Measure bugs found in production

### Reporting Dashboard
- Coverage badges in README
- Test results in PR comments
- Weekly coverage reports
- Monthly quality metrics
- Quarterly test health review

## Conclusion

This comprehensive testing plan provides a robust foundation for ensuring the quality and reliability of the Betta Fish RPG. By following these guidelines and leveraging modern testing tools like Vitest, the project can maintain high quality while enabling rapid, confident development.

The plan balances thorough coverage with practical maintainability, ensuring tests provide value without becoming a burden. With proper implementation, this testing strategy will catch bugs early, document behavior clearly, and enable safe refactoring throughout the project's lifecycle.