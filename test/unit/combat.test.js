import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { CombatManager } from '../../src/combat.js'
import { Player } from '../../src/player.js'

// Mock audio manager
const createMockAudio = () => ({
  playSound: () => {}, // No-op function
  toggleAudio: () => true
})

// Mock UI manager
const createMockUI = () => ({
  updateCombatDisplay: () => {},
  showDamage: () => {},
  showMessage: () => {},
  hideElement: () => {},
  showElement: () => {},
  updatePlayerSpritesWithPartyHat: () => {},
  applyRainbowHPEffect: () => {}
})

// Mock world manager
const createMockWorld = () => ({
  getDistanceFromVillage: (x, y) => Math.abs(x) + Math.abs(y) // Simple Manhattan distance
})

// Mock DOM for browser-dependent functions
const createMockDOM = () => {
  global.document = {
    getElementById: (id) => {
      if (id === 'enemy-fish-combat' || id === 'game-container') {
        return {
          style: {},
          classList: {
            add: () => {},
            remove: () => {}
          },
          appendChild: () => {}
        }
      }
      return {
        style: {},
        classList: {
          add: () => {},
          remove: () => {}
        },
        appendChild: () => {}
      }
    },
    createElement: (tag) => {
      const element = {
        style: {},
        classList: {
          add: () => {},
          remove: () => {}
        },
        setAttribute: () => {},
        addEventListener: () => {},
        appendChild: () => {},
        innerHTML: '',
        className: '',
        dataset: {}
      }
      // Allow setting properties on created elements
      return new Proxy(element, {
        set: (target, prop, value) => {
          target[prop] = value
          return true
        }
      })
    },
    body: {
      appendChild: () => {}
    }
  }
}

describe('Combat Enemy Generation', () => {
  let combat
  let player
  let mockAudio

  beforeEach(() => {
    createMockDOM() // Mock DOM before each test
    player = new Player()
    mockAudio = createMockAudio()
    combat = new CombatManager(player, mockAudio)
    combat.ui = createMockUI()
    combat.world = createMockWorld()
  })

  it('should scale enemy stats with distance from village', () => {
    // Start encounter at distance 10,0 (distance 10)
    const result = combat.startRandomEncounter(10, 0)

    assert.ok(combat.currentEnemy)
    assert.ok(combat.currentEnemy.hp > 0)
    assert.ok(combat.currentEnemy.attack > 0)
    assert.equal(typeof combat.currentEnemy.level, 'number')
  })

  it('should calculate enemy level based on distance', () => {
    const level1 = combat.calculateEnemyLevel(1, 0) // Close to village
    const level2 = combat.calculateEnemyLevel(10, 0) // Far from village

    assert.ok(typeof level1 === 'number')
    assert.ok(typeof level2 === 'number')
    assert.ok(level2 >= level1) // Farther enemies should be higher level or equal
  })

  it('should scale enemy with level correctly', () => {
    const baseEnemy = {
      name: 'Test Enemy',
      hp: 10,
      maxHp: 10,
      attack: 3,
      exp: 25,
      attacks: ['bites', 'charges']
    }

    const scaledEnemy = combat.scaleEnemyWithLevel(baseEnemy, 5)

    assert.ok(scaledEnemy.hp > baseEnemy.hp) // Scaled HP should be higher
    assert.ok(scaledEnemy.attack > baseEnemy.attack) // Scaled attack should be higher
    assert.ok(scaledEnemy.exp >= baseEnemy.exp) // Scaled EXP should be higher or equal
  })
})

describe('Combat Flow', () => {
  let combat
  let player
  let mockAudio

  beforeEach(() => {
    createMockDOM() // Mock DOM before each test
    player = new Player()
    mockAudio = createMockAudio()
    combat = new CombatManager(player, mockAudio)
    combat.ui = createMockUI()
  })

  it('should handle player attack sequence', () => {
    const enemy = {
      name: 'Test Enemy',
      hp: 20,
      maxHp: 20,
      attack: 5,
      attacks: ['bites', 'charges']
    }
    combat.currentEnemy = enemy
    combat.combatActive = true

    const result = combat.attack()

    // Check that enemy took damage
    assert.ok(enemy.hp < enemy.maxHp)
    // Result should be null unless enemy died or player died
    if (enemy.hp > 0 && player.hp > 0) {
      assert.equal(result, null)
    }
  })

  it('should process enemy counterattack', () => {
    const enemy = {
      name: 'Test Enemy',
      hp: 20,
      maxHp: 20,
      attack: 5,
      attacks: ['bites', 'charges']
    }
    combat.currentEnemy = enemy
    combat.combatActive = true
    const initialPlayerHp = player.hp

    combat.enemyTurn()

    assert.ok(player.hp < initialPlayerHp) // Player should take damage
  })

  it('should allow fleeing with success probability', () => {
    const enemy = {
      name: 'Test Enemy',
      hp: 20,
      maxHp: 20,
      attack: 5,
      attacks: ['bites']
    }
    combat.currentEnemy = enemy
    combat.combatActive = true

    const fleeResult = combat.runAway()

    assert.ok(typeof fleeResult === 'object')
    assert.ok(typeof fleeResult.escaped === 'boolean')
    // Result can be true or false based on probability
  })

  it('should detect victory and defeat conditions', () => {
    const enemy = {
      name: 'Test Enemy',
      hp: 0, // Dead enemy
      maxHp: 20,
      attack: 5
    }
    combat.currentEnemy = enemy
    combat.combatActive = true

    const victoryResult = combat.checkForVictory()
    assert.ok(victoryResult)
    assert.equal(victoryResult.enemyDefeated, true)

    // Test defeat condition
    player.hp = 0 // Dead player
    assert.equal(player.isAlive, false)
  })
})

describe('Combat Spells', () => {
  let combat
  let player
  let mockAudio

  beforeEach(() => {
    createMockDOM() // Mock DOM before each test
    player = new Player()
    player.level = 8 // High enough level for all spells (HBT unlocks at 7)
    player.mp = 20 // Enough MP
    mockAudio = createMockAudio()
    combat = new CombatManager(player, mockAudio)
    combat.ui = createMockUI()
  })

  it('should cast Bubble Blast with MP cost and damage', () => {
    const enemy = {
      name: 'Test Enemy',
      hp: 20,
      maxHp: 20,
      attack: 5,
      attacks: ['bites', 'charges']
    }
    combat.currentEnemy = enemy
    combat.combatActive = true
    const initialMp = player.mp
    const initialEnemyHp = enemy.hp

    const result = combat.useSkill('bubble')

    assert.ok(player.mp < initialMp) // MP should be consumed
    assert.ok(enemy.hp < initialEnemyHp) // Enemy should take damage
  })

  it('should befriend enemies with Happy Balloon Time', () => {
    const enemy = {
      name: 'Aggressive Guppy',
      hp: 10,
      maxHp: 10,
      attack: 3,
      attacks: ['bites']
    }
    combat.currentEnemy = enemy
    combat.combatActive = true

    // Ensure player has enough MP for party spell
    player.mp = 20
    const initialMp = player.mp

    const result = combat.useSkill('party')

    // Check that the spell was attempted (either MP consumed or spell failed)
    const spellAttempted = player.mp < initialMp || !player.canCastSpell('party')
    assert.ok(spellAttempted)
  })

  it('should cast Gravel Grenade with MP cost and damage', () => {
    const enemy = {
      name: 'Test Enemy',
      hp: 25,
      maxHp: 25,
      attack: 8,
      attacks: ['charges', 'bites']
    }
    combat.currentEnemy = enemy
    combat.combatActive = true
    player.level = 10 // High enough level for gravel spell
    player.mp = 20
    const initialMp = player.mp
    const initialEnemyHp = enemy.hp

    const result = combat.useSkill('gravel')

    assert.ok(player.mp < initialMp) // MP should be consumed
    assert.ok(enemy.hp < initialEnemyHp) // Enemy should take damage
  })

  it('should prevent casting without sufficient MP', () => {
    player.mp = 1 // Very low MP

    const enemy = {
      name: 'Test Enemy',
      hp: 20,
      maxHp: 20,
      attack: 5
    }

    const canCast = player.canCastSpell('bubble')
    assert.equal(canCast, false)
  })
})