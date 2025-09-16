import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Player } from '../../src/player.js'

describe('Player Damage System', () => {
  it('should take full damage at level 1 (no armor)', () => {
    const player = new Player()
    player.hp = 20

    const damage = player.takeDamage(10)

    assert.equal(damage, 10)
    assert.equal(player.hp, 10)
  })

  it('should reduce damage by 2 at level 5 (armor)', () => {
    const player = new Player()
    player.level = 5
    player.hp = 20

    const damage = player.takeDamage(10)

    assert.equal(damage, 8) // 10 - 2 armor reduction
    assert.equal(player.hp, 12)
  })

  it('should enforce minimum 1 damage rule', () => {
    const player = new Player()
    player.level = 10 // Should have high armor
    player.hp = 20

    const damage = player.takeDamage(1)

    assert.equal(damage, 1) // Minimum damage should be 1
    assert.equal(player.hp, 19)
  })

  it('should grant complete immunity with submarine', () => {
    const player = new Player()
    player.hasDunkleosteusSub = true
    player.hp = 20

    const damage = player.takeDamage(100)

    assert.equal(damage, 0) // No damage with submarine
    assert.equal(player.hp, 20) // HP unchanged
  })
})

describe('Player Progression', () => {
  it('should increase maxHP by 5 and maxMP by 2 per level', () => {
    const player = new Player()
    const initialMaxHp = player.maxHp
    const initialMaxMp = player.maxMp

    const result = player.levelUp()

    assert.equal(player.level, 2)
    assert.equal(player.maxHp, initialMaxHp + 5)
    assert.equal(player.maxMp, initialMaxMp + 2)
    assert.equal(result.hpIncrease, 5)
    assert.equal(result.mpIncrease, 2)
  })

  it('should carry over excess experience', () => {
    const player = new Player()
    const expNeeded = player.expToNext

    // Give more exp than needed for level up
    const canLevelUp = player.gainExp(expNeeded + 25)
    assert.equal(canLevelUp, true) // Should indicate level up is available

    // Manually trigger level up
    player.levelUp()

    assert.equal(player.level, 2)
    assert.equal(player.exp, 25) // Excess exp should carry over
  })

  it('should unlock spells at correct levels', () => {
    const player = new Player()

    // Test Bubble Blast unlocks at level 1
    player.level = 1
    assert.ok(player.hasSpell('bubble'))

    // Test Gravel Grenade unlocks at level 4
    player.level = 4
    assert.ok(player.hasSpell('gravel'))

    // Test Happy Balloon Time unlocks at level 7
    player.level = 7
    assert.ok(player.hasSpell('party'))
  })
})

describe('Player Economy and Death', () => {
  it('should die when HP reaches 0', () => {
    const player = new Player()

    player.takeDamage(player.hp) // Take all HP as damage

    assert.equal(player.hp, 0)
    assert.equal(player.isAlive, false)
  })

  it('should spend Betta Bites correctly', () => {
    const player = new Player()
    player.bettaBites = 100

    const canAfford = player.canAfford(30)
    const success = player.spendBettaBites(30)

    assert.equal(canAfford, true)
    assert.equal(success, true)
    assert.equal(player.bettaBites, 70)
  })

  it('should gain Betta Bites from combat', () => {
    const player = new Player()
    const initialBites = player.bettaBites

    player.gainBettaBites(50)

    assert.equal(player.bettaBites, initialBites + 50)
  })

  it('should lose half Betta Bites on death', () => {
    const player = new Player()
    player.bettaBites = 100

    player.die()

    assert.equal(player.bettaBites, 50) // Half of original amount
  })

  it('should validate purchase affordability', () => {
    const player = new Player()
    player.bettaBites = 50

    assert.equal(player.canAfford(30), true)
    assert.equal(player.canAfford(60), false)

    // Should not spend if can't afford
    const success = player.spendBettaBites(60)
    assert.equal(success, false)
    assert.equal(player.bettaBites, 50) // Amount unchanged
  })
})