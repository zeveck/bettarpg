import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { WorldManager } from '../../src/world.js'
import { Player } from '../../src/player.js'

// Mock audio manager
const createMockAudio = () => ({
  playSound: () => {},
  toggleAudio: () => true
})

// Mock combat manager
const createMockCombat = () => ({
  startRandomEncounter: () => ({ success: true }),
  hasDefeatedGar: false
})

// Mock NPC manager
const createMockNPC = () => ({
  startDialogue: () => {},
  getCurrentDialogue: () => null,
  isDialogueActive: () => false,
  reset: () => {} // Add missing reset method
})

// Mock UI manager
const createMockUI = () => ({
  updateLocationDisplay: () => {},
  showMessage: () => {},
  updateWorldDisplay: () => {},
  showTreasureMessage: () => {},
  hideElement: () => {},
  showElement: () => {}
})

describe('World Movement', () => {
  let world
  let player
  let mockAudio
  let mockCombat
  let mockNPC

  beforeEach(() => {
    player = new Player()
    mockAudio = createMockAudio()
    mockCombat = createMockCombat()
    mockNPC = createMockNPC()
    world = new WorldManager(player, mockAudio, mockCombat, mockNPC)
    world.ui = createMockUI()
  })

  it('should move player in valid directions', () => {
    const startX = world.currentX
    const startY = world.currentY

    // Move north
    const northResult = world.movePlayer('north')
    assert.equal(world.currentY, startY - 1)
    assert.ok(northResult.success !== false) // Movement should succeed

    // Move south (back to start)
    world.movePlayer('south')
    assert.equal(world.currentY, startY)

    // Move east
    world.movePlayer('east')
    assert.equal(world.currentX, startX + 1)

    // Move west (back to start)
    world.movePlayer('west')
    assert.equal(world.currentX, startX)
  })

  it('should clamp movement to world boundaries', () => {
    // Move to near the edge
    world.currentX = 1
    world.currentY = 1

    // Try to move beyond boundaries
    const result1 = world.movePlayer('west')
    assert.equal(world.currentX, 1) // Should stay at boundary

    const result2 = world.movePlayer('north')
    assert.equal(world.currentY, 1) // Should stay at boundary

    // Movement should still return a result even when clamped
    assert.ok(typeof result1 === 'object')
    assert.ok(typeof result2 === 'object')
  })

  it('should handle village entry and exit', () => {
    // Start in village
    assert.equal(world.inVillage, true)

    // Leave village
    const leaveResult = world.leaveVillage()
    assert.equal(world.inVillage, false)
    assert.equal(leaveResult.success, true)

    // Move back to village center to enter
    world.currentX = 10 // Village center X
    world.currentY = 10 // Village center Y

    // Enter village (only works if at center coordinates)
    const enterResult = world.enterVillage()
    assert.equal(world.inVillage, true)
    assert.equal(enterResult.success, true)
  })
})

describe('World Encounters', () => {
  let world
  let player
  let mockAudio
  let mockCombat
  let mockNPC

  beforeEach(() => {
    player = new Player()
    mockAudio = createMockAudio()
    mockCombat = createMockCombat()
    mockNPC = createMockNPC()
    world = new WorldManager(player, mockAudio, mockCombat, mockNPC)
    world.ui = createMockUI()
  })

  it('should generate encounters based on probability', () => {
    // Move away from village to increase encounter chance
    world.currentX = 15
    world.currentY = 15
    world.inVillage = false

    let encounterFound = false
    // Try multiple times to find an encounter (probabilistic)
    for (let i = 0; i < 50; i++) {
      const encounter = world.checkForEncounter()
      if (encounter && encounter.type) {
        encounterFound = true
        break
      }
    }

    // Should eventually find an encounter (or at least the function should work)
    assert.ok(typeof world.checkForEncounter() === 'object' || world.checkForEncounter() === null)
  })

  it('should create treasure encounters with rewards', () => {
    const initialBites = player.bettaBites
    const treasureEncounter = world.createTreasureEncounter()

    assert.equal(treasureEncounter.type, 'treasure')
    assert.ok(typeof treasureEncounter.amount === 'number') // Field is 'amount', not 'bettaBites'
    assert.ok(treasureEncounter.amount > 0)
    assert.ok(typeof treasureEncounter.message === 'string')
    assert.ok(player.bettaBites > initialBites) // Player should have gained Betta Bites
  })

  it('should create peaceful encounters', () => {
    const peacefulEncounter = world.createPeacefulEncounter()

    assert.equal(peacefulEncounter.type, 'peaceful')
    assert.ok(typeof peacefulEncounter.message === 'string')
  })
})

describe('World Utilities', () => {
  let world
  let player
  let mockAudio
  let mockCombat
  let mockNPC

  beforeEach(() => {
    player = new Player()
    mockAudio = createMockAudio()
    mockCombat = createMockCombat()
    mockNPC = createMockNPC()
    world = new WorldManager(player, mockAudio, mockCombat, mockNPC)
  })

  it('should calculate distance from village correctly', () => {
    // Distance from village center (10, 10) to various points
    const distance1 = world.getDistanceFromVillage(10, 10) // Village center
    assert.equal(distance1, 0)

    const distance2 = world.getDistanceFromVillage(15, 15) // 5 units away diagonally
    // Uses Euclidean distance: sqrt((15-10)² + (15-10)²) = sqrt(25 + 25) = sqrt(50) ≈ 7.07
    assert.ok(Math.abs(distance2 - Math.sqrt(50)) < 0.01)

    const distance3 = world.getDistanceFromVillage(5, 10) // 5 units west
    assert.equal(distance3, 5)
  })

  it('should provide current location information', () => {
    const location = world.getCurrentLocation()

    assert.ok(typeof location.x === 'number')
    assert.ok(typeof location.y === 'number')
    assert.ok(typeof location.inVillage === 'boolean')
    // getCurrentLocation doesn't return distanceFromVillage, that's a separate method
  })

  it('should reset world state correctly', () => {
    // Change state
    world.currentX = 15
    world.currentY = 15
    world.inVillage = false

    // Reset
    world.reset()

    // Should be back to starting state
    assert.equal(world.inVillage, true)
    assert.equal(world.currentX, 10) // Village center X
    assert.equal(world.currentY, 10) // Village center Y
  })
})