import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { Player } from '../../src/player.js'
import { CombatManager } from '../../src/combat.js'
import { WorldManager } from '../../src/world.js'
import { GameConfig } from '../../src/config.js'

// Mock audio manager
const createMockAudio = () => ({
  playSound: () => {},
  toggleAudio: () => true
})

// Mock NPC manager
const createMockNPC = () => ({
  startDialogue: () => {},
  getCurrentDialogue: () => null,
  isDialogueActive: () => false,
  reset: () => {}
})

// Mock UI manager
const createMockUI = () => ({
  updateCombatDisplay: () => {},
  showDamage: () => {},
  showMessage: () => {},
  hideElement: () => {},
  showElement: () => {},
  updatePlayerSpritesWithPartyHat: () => {},
  applyRainbowHPEffect: () => {},
  updateLocationDisplay: () => {},
  updateWorldDisplay: () => {},
  showTreasureMessage: () => {}
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

describe('Player Progression Integration', () => {
  let player, combat, world, mockAudio, mockNPC, mockUI

  beforeEach(() => {
    createMockDOM()
    player = new Player()
    mockAudio = createMockAudio()
    mockNPC = createMockNPC()
    mockUI = createMockUI()

    combat = new CombatManager(player, mockAudio)
    combat.ui = mockUI

    world = new WorldManager(player, mockAudio, combat, mockNPC)
    world.ui = mockUI
    combat.world = world
  })

  it('should handle complete level up sequence during combat', () => {
    // Set player close to level up
    player.level = 1
    player.exp = 95 // Close to 100 needed for level 2
    player.hp = 15
    player.mp = 8
    const initialMaxHp = player.maxHp
    const initialMaxMp = player.maxMp

    // Give enough EXP to level up
    const canLevelUp = player.gainExp(10) // Now has 105 EXP
    assert.equal(canLevelUp, true)

    // Manually trigger level up (simulating UI interaction)
    const levelUpResult = player.levelUp()

    // Verify level up effects
    assert.equal(player.level, 2)
    assert.equal(player.exp, 5) // 105 - 100 = 5 remaining
    assert.equal(player.maxHp, initialMaxHp + 5)
    assert.equal(player.maxMp, initialMaxMp + 2)
    assert.equal(player.hp, player.maxHp) // Should be full HP after level up
    assert.equal(player.mp, player.maxMp) // Should be full MP after level up
    assert.equal(levelUpResult.hpIncrease, 5)
    assert.equal(levelUpResult.mpIncrease, 2)
  })

  it('should unlock spells at correct levels and allow casting', () => {
    // Start at level 1 - should have Bubble Blast
    player.level = 1
    player.mp = 10
    assert.equal(player.hasSpell('bubble'), true)
    assert.equal(player.canCastSpell('bubble'), true)
    assert.equal(player.hasSpell('gravel'), false)
    assert.equal(player.hasSpell('party'), false)

    // Level up to 4 - should unlock Gravel Grenade
    player.level = 4
    player.mp = 10
    assert.equal(player.hasSpell('gravel'), true)
    assert.equal(player.canCastSpell('gravel'), true)
    assert.equal(player.hasSpell('party'), false)

    // Level up to 7 - should unlock Happy Balloon Time
    player.level = 7
    player.mp = 10
    assert.equal(player.hasSpell('party'), true)
    assert.equal(player.canCastSpell('party'), true)

    // Test spell casting actually consumes MP
    const initialMp = player.mp
    const castSuccess = player.castSpell('bubble')
    assert.equal(castSuccess, true)
    assert.equal(player.mp, initialMp - 3) // Bubble Blast costs 3 MP
  })

  it('should handle armor progression and damage reduction', () => {
    // Level 1: No armor (0 reduction)
    player.level = 1
    player.hp = 20
    const damage1 = player.takeDamage(10)
    assert.equal(damage1, 10) // Full damage

    // Level 3: Helmet (1 reduction)
    player.level = 3
    player.hp = 20
    const damage3 = player.takeDamage(10)
    assert.equal(damage3, 9) // 10 - 1 = 9

    // Level 5: Advanced Armor (2 reduction)
    player.level = 5
    player.hp = 20
    const damage5 = player.takeDamage(10)
    assert.equal(damage5, 8) // 10 - 2 = 8

    // Level 7: Full Metal Armor (3 reduction)
    player.level = 7
    player.hp = 20
    const damage7 = player.takeDamage(10)
    assert.equal(damage7, 7) // 10 - 3 = 7

    // Test minimum damage rule
    player.level = 10 // High armor
    player.hp = 20
    const minDamage = player.takeDamage(1)
    assert.equal(minDamage, 1) // Should always take at least 1 damage
  })
})

describe('Combat Integration', () => {
  let player, combat, world, mockAudio, mockNPC, mockUI

  beforeEach(() => {
    createMockDOM()
    player = new Player()
    mockAudio = createMockAudio()
    mockNPC = createMockNPC()
    mockUI = createMockUI()

    combat = new CombatManager(player, mockAudio)
    combat.ui = mockUI

    world = new WorldManager(player, mockAudio, combat, mockNPC)
    world.ui = mockUI
    combat.world = world
  })

  it('should handle complete combat sequence from start to victory', () => {
    // Start combat encounter
    const encounter = combat.startRandomEncounter(15, 15) // Far from village
    assert.ok(combat.currentEnemy)
    assert.equal(combat.combatActive, true)

    const enemy = combat.currentEnemy
    const initialEnemyHp = enemy.hp
    const initialPlayerHp = player.hp

    // Player attacks enemy
    const attackResult = combat.attack()
    assert.ok(enemy.hp < initialEnemyHp) // Enemy should take damage

    // If enemy is still alive, they counter-attack
    if (enemy.hp > 0 && combat.combatActive) {
      combat.enemyTurn()
      // Player might take damage (unless they have submarine)
      if (!player.hasSubmarine()) {
        assert.ok(player.hp <= initialPlayerHp)
      }
    }

    // Combat should continue until one side wins
    assert.ok(typeof combat.combatActive === 'boolean')
  })

  it('should handle spell casting in combat with proper effects', () => {
    // Set up player with spell capability
    player.level = 8 // Has all spells
    player.mp = 20

    // Start combat
    combat.startRandomEncounter(10, 10)
    const enemy = combat.currentEnemy
    const initialEnemyHp = enemy.hp
    const initialMp = player.mp

    // Cast Bubble Blast spell
    const spellResult = combat.useSkill('bubble')

    // Verify spell effects
    assert.ok(player.mp < initialMp) // MP should be consumed
    assert.ok(enemy.hp < initialEnemyHp) // Enemy should take damage
  })

  it('should handle enemy scaling based on distance from village', () => {
    // Test enemy at village (distance 0)
    const level1 = combat.calculateEnemyLevel(10, 10) // Village center

    // Test enemy far from village
    const level2 = combat.calculateEnemyLevel(1, 1) // Far from village

    // Far enemies should generally be higher level
    assert.ok(typeof level1 === 'number')
    assert.ok(typeof level2 === 'number')
    assert.ok(level1 >= 1)
    assert.ok(level2 >= 1)

    // Test enemy stat scaling
    const baseEnemy = {
      name: 'Test Enemy',
      hp: 10,
      maxHp: 10,
      attack: 3,
      exp: 25,
      attacks: ['bites']
    }

    const scaledEnemy = combat.scaleEnemyWithLevel(baseEnemy, 5)
    assert.ok(scaledEnemy.hp > baseEnemy.hp)
    assert.ok(scaledEnemy.attack > baseEnemy.attack)
    assert.ok(scaledEnemy.exp >= baseEnemy.exp)
  })
})

describe('World Integration', () => {
  let player, combat, world, mockAudio, mockNPC, mockUI

  beforeEach(() => {
    createMockDOM()
    player = new Player()
    mockAudio = createMockAudio()
    mockNPC = createMockNPC()
    mockUI = createMockUI()

    combat = new CombatManager(player, mockAudio)
    combat.ui = mockUI

    world = new WorldManager(player, mockAudio, combat, mockNPC)
    world.ui = mockUI
    combat.world = world
  })

  it('should handle movement and encounter generation', () => {
    // Start in village
    assert.equal(world.inVillage, true)

    // Leave village
    world.leaveVillage()
    assert.equal(world.inVillage, false)

    // Move away from village center
    world.movePlayer('north')
    world.movePlayer('north')
    world.movePlayer('east')

    // Check that we're away from village
    const distance = world.getDistanceFromVillage()
    assert.ok(distance > 0)

    // Try to generate encounters (probabilistic)
    const location = world.getCurrentLocation()
    assert.ok(typeof location.x === 'number')
    assert.ok(typeof location.y === 'number')
    assert.equal(location.inVillage, false)
  })

  it('should handle treasure encounters with player economy', () => {
    const initialBites = player.bettaBites

    // Create treasure encounter
    const treasure = world.createTreasureEncounter()

    // Verify treasure encounter structure
    assert.equal(treasure.type, 'treasure')
    assert.ok(typeof treasure.amount === 'number')
    assert.ok(treasure.amount > 0)
    assert.ok(typeof treasure.message === 'string')

    // Verify player gained Betta Bites
    assert.ok(player.bettaBites > initialBites)
    assert.equal(player.bettaBites, initialBites + treasure.amount)
  })

  it('should handle village entry requirements', () => {
    // Start in village, then leave
    world.leaveVillage()
    assert.equal(world.inVillage, false)

    // Try to enter village from wrong location
    world.currentX = 5
    world.currentY = 5
    const failedEntry = world.enterVillage()
    assert.equal(failedEntry.success, false)
    assert.equal(world.inVillage, false)

    // Move to village center and enter
    world.currentX = 10 // Village center
    world.currentY = 10
    const successfulEntry = world.enterVillage()
    assert.equal(successfulEntry.success, true)
    assert.equal(world.inVillage, true)
  })
})

describe('Economy Integration', () => {
  let player, combat, world, mockAudio, mockNPC, mockUI

  beforeEach(() => {
    createMockDOM()
    player = new Player()
    mockAudio = createMockAudio()
    mockNPC = createMockNPC()
    mockUI = createMockUI()

    combat = new CombatManager(player, mockAudio)
    combat.ui = mockUI

    world = new WorldManager(player, mockAudio, combat, mockNPC)
    world.ui = mockUI
    combat.world = world
  })

  it('should handle death penalty and recovery', () => {
    // Give player some Betta Bites
    player.gainBettaBites(100)
    player.hp = 1 // Low HP

    const initialBites = player.bettaBites

    // Simulate death
    const bettaBitesLost = player.die()

    // Verify death effects
    assert.equal(player.hp, player.maxHp) // Should be revived with full HP
    assert.equal(player.mp, player.maxMp) // Should have full MP
    assert.equal(bettaBitesLost, Math.floor(initialBites / 2)) // Should lose half
    assert.equal(player.bettaBites, initialBites - bettaBitesLost)
    assert.ok(player.isAlive) // Should be alive again
  })

  it('should handle shop transactions', () => {
    // Give player enough Betta Bites
    player.gainBettaBites(50)

    const kelpCost = 3 // From GameConfig.SHOP.KELP_SNACK.cost
    const bubbleCost = 2 // From GameConfig.SHOP.BUBBLE_WATER.cost

    // Test affordability
    assert.equal(player.canAfford(kelpCost), true)
    assert.equal(player.canAfford(100), false) // Too expensive

    // Test purchase
    const initialBites = player.bettaBites
    const purchaseSuccess = player.spendBettaBites(kelpCost)

    assert.equal(purchaseSuccess, true)
    assert.equal(player.bettaBites, initialBites - kelpCost)

    // Test insufficient funds
    player.bettaBites = 1 // Very low
    const failedPurchase = player.spendBettaBites(kelpCost)
    assert.equal(failedPurchase, false)
  })

  it('should handle submarine acquisition and effects', () => {
    // Initially no submarine
    assert.equal(player.hasSubmarine(), false)

    // Acquire submarine
    const acquisition = player.acquireSubmarine()
    assert.equal(acquisition.success, true)
    assert.ok(typeof acquisition.message === 'string')
    assert.equal(player.hasSubmarine(), true)

    // Test submarine effects on damage
    player.hp = 20
    const damageWithSub = player.takeDamage(100) // Massive damage
    assert.equal(damageWithSub, 0) // Should take no damage
    assert.equal(player.hp, 20) // HP should be unchanged

    // Test submarine sprite
    const sprite = player.getSprite()
    assert.ok(sprite.includes('dunkleosteus_sub'))
  })
})

describe('Full Game Flow Integration', () => {
  let player, combat, world, mockAudio, mockNPC, mockUI

  beforeEach(() => {
    createMockDOM()
    player = new Player()
    mockAudio = createMockAudio()
    mockNPC = createMockNPC()
    mockUI = createMockUI()

    combat = new CombatManager(player, mockAudio)
    combat.ui = mockUI

    world = new WorldManager(player, mockAudio, combat, mockNPC)
    world.ui = mockUI
    combat.world = world
  })

  it('should handle complete exploration and combat cycle', () => {
    // Start state verification
    assert.equal(player.level, 1)
    assert.equal(world.inVillage, true)
    assert.equal(combat.combatActive, false)

    // Leave village to explore
    world.leaveVillage()
    assert.equal(world.inVillage, false)

    // Move around the world
    world.movePlayer('north')
    world.movePlayer('east')

    // Generate a treasure encounter
    const treasure = world.createTreasureEncounter()
    const initialBites = player.bettaBites

    // Player should have gained treasure
    assert.ok(player.bettaBites >= initialBites)

    // Return to village
    world.currentX = 10
    world.currentY = 10
    world.enterVillage()
    assert.equal(world.inVillage, true)
  })

  it('should handle game reset properly', () => {
    // Modify game state
    player.level = 5
    player.hp = 15
    player.mp = 8
    player.gainBettaBites(50)
    player.acquireSubmarine()
    world.currentX = 15
    world.currentY = 15
    world.inVillage = false

    // Reset player
    player.reset()

    // Verify reset state
    assert.equal(player.level, 1)
    assert.equal(player.hp, 20) // Starting HP
    assert.equal(player.maxHp, 20)
    assert.equal(player.mp, 10) // Starting MP
    assert.equal(player.maxMp, 10)
    assert.equal(player.exp, 0)
    assert.equal(player.bettaBites, 0)
    assert.equal(player.hasSubmarine(), false)

    // Reset world
    world.reset()
    assert.equal(world.inVillage, true)
    assert.equal(world.currentX, 10) // Village center
    assert.equal(world.currentY, 10)
  })

  it('should maintain data consistency across module interactions', () => {
    // Test that player stats remain consistent across different operations
    const initialState = {
      level: player.level,
      hp: player.hp,
      mp: player.mp,
      bettaBites: player.bettaBites
    }

    // Perform various operations
    player.gainExp(50)
    player.gainBettaBites(25)
    player.takeDamage(5)

    // Verify state changes are logical
    assert.equal(player.level, initialState.level) // Shouldn't level up yet
    assert.equal(player.exp, 50) // Should have gained EXP
    assert.equal(player.bettaBites, initialState.bettaBites + 25)
    assert.equal(player.hp, initialState.hp - 5) // Should have taken damage

    // Test healing
    player.healHP(10)
    assert.equal(player.hp, Math.min(player.maxHp, initialState.hp - 5 + 10))
  })
})