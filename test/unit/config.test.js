import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { GameConfig, GameStrings, StringFormatter } from '../../src/config.js'

describe('GameConfig Structure', () => {
  it('should provide valid player progression configuration', () => {
    // Test player starting stats
    const stats = GameConfig.PLAYER.STARTING_STATS
    assert.equal(stats.level, 1)
    assert.equal(stats.hp, 20)
    assert.equal(stats.maxHp, 20)
    assert.equal(stats.mp, 10)
    assert.equal(stats.maxMp, 10)
    assert.equal(stats.exp, 0)
    assert.equal(stats.bettaBites, 0)

    // Test progression values
    const progression = GameConfig.PLAYER.PROGRESSION
    assert.equal(progression.EXP_BASE, 100)
    assert.equal(progression.EXP_MULTIPLIER, 1.2)
    assert.equal(progression.HP_GAIN_PER_LEVEL, 5)
    assert.equal(progression.MP_GAIN_PER_LEVEL, 2)
  })

  it('should provide valid spell configurations with correct unlock levels', () => {
    const spells = GameConfig.COMBAT.SPELLS

    // Test Bubble Blast
    assert.equal(spells.BUBBLE_BLAST.name, 'Bubble Blast')
    assert.equal(spells.BUBBLE_BLAST.unlockLevel, 1)
    assert.equal(spells.BUBBLE_BLAST.mpCost, 3)
    assert.ok(spells.BUBBLE_BLAST.damageMin > 0)
    assert.ok(spells.BUBBLE_BLAST.damageMax >= spells.BUBBLE_BLAST.damageMin)

    // Test Gravel Grenade
    assert.equal(spells.GRAVEL_GRENADE.unlockLevel, 4)
    assert.equal(spells.GRAVEL_GRENADE.mpCost, 5)

    // Test Happy Balloon Time
    assert.equal(spells.HAPPY_BALLOON_TIME.unlockLevel, 7)
    assert.equal(spells.HAPPY_BALLOON_TIME.mpCost, 7)
  })

  it('should provide valid enemy definitions with required properties', () => {
    const enemies = GameConfig.ENEMIES

    // Test that all enemies have required properties
    const enemyNames = ['AGGRESSIVE_GUPPY', 'TERRITORIAL_ANGELFISH', 'SNEAKY_CATFISH', 'FIERCE_CICHLID', 'PREHISTORIC_GAR']

    enemyNames.forEach(enemyName => {
      const enemy = enemies[enemyName]
      assert.ok(enemy, `Enemy ${enemyName} should exist`)
      assert.ok(typeof enemy.name === 'string')
      assert.ok(typeof enemy.baseHp === 'number')
      assert.ok(typeof enemy.baseDamage === 'number')
      assert.ok(typeof enemy.baseExp === 'number')
      assert.ok(Array.isArray(enemy.attacks))
      assert.ok(enemy.attacks.length > 0)
    })
  })

  it('should provide valid world configuration', () => {
    const world = GameConfig.WORLD

    // Test world dimensions
    assert.equal(typeof world.MAP_SIZE, 'number')
    assert.ok(world.MAP_SIZE > 0)

    // Test village center
    assert.ok(world.VILLAGE_CENTER)
    assert.equal(typeof world.VILLAGE_CENTER.x, 'number')
    assert.equal(typeof world.VILLAGE_CENTER.y, 'number')

    // Test danger zones
    assert.ok(world.DANGER_ZONES)
    assert.ok(typeof world.DANGER_ZONES.SAFE_RADIUS === 'number')
    assert.ok(typeof world.DANGER_ZONES.DANGEROUS_RADIUS === 'number')
    assert.ok(world.DANGER_ZONES.LEVEL_SCALING)
  })

  it('should provide consistent game version information', () => {
    const gameInfo = GameConfig.GAME

    assert.ok(typeof gameInfo.VERSION === 'string')
    assert.ok(gameInfo.VERSION.match(/^\d+\.\d+\.\d+$/)) // Should match X.Y.Z format
    assert.ok(typeof gameInfo.WEBSITE === 'string')
    assert.ok(gameInfo.WEBSITE.startsWith('http'))
  })
})

describe('StringFormatter', () => {
  it('should format strings with variable substitution', () => {
    const template = 'Hello {name}!'
    const formatted = StringFormatter.format(template, { name: 'World' })
    assert.equal(formatted, 'Hello World!')
  })

  it('should handle multiple variables in templates', () => {
    const template = '{player} dealt {damage} damage to {enemy}!'
    const formatted = StringFormatter.format(template, {
      player: 'Hero',
      damage: 15,
      enemy: 'Guppy'
    })
    assert.equal(formatted, 'Hero dealt 15 damage to Guppy!')
  })

  it('should leave unmatched variables unchanged', () => {
    const template = 'Hello {name}, you have {missing} items!'
    const formatted = StringFormatter.format(template, { name: 'Player' })
    assert.equal(formatted, 'Hello Player, you have {missing} items!')
  })

  it('should process button texts with keyboard shortcuts', () => {
    const buttons = ['Attack', 'Block', 'Cast Spell']
    const processed = StringFormatter.processButtonTexts(buttons)

    assert.equal(processed.length, 3)

    // Should underline unique letters and assign keys
    assert.equal(processed[0].html, '<u>A</u>ttack')
    assert.equal(processed[0].key, 'a')

    assert.equal(processed[1].html, '<u>B</u>lock')
    assert.equal(processed[1].key, 'b')

    assert.equal(processed[2].html, '<u>C</u>ast Spell')
    assert.equal(processed[2].key, 'c')
  })

  it('should handle duplicate letters in button text processing', () => {
    const buttons = ['Apple', 'Apricot', 'Avocado']
    const processed = StringFormatter.processButtonTexts(buttons)

    // First button gets 'a', second gets 'p', third gets 'v'
    assert.equal(processed[0].key, 'a')
    assert.equal(processed[1].key, 'p') // 'a' already used, so use 'p'
    assert.equal(processed[2].key, 'v') // 'a' already used, so use 'v'
  })
})

describe('GameStrings', () => {
  it('should provide UI text configurations', () => {
    assert.ok(GameStrings.UI)
    assert.ok(typeof GameStrings.UI === 'object')
  })

  it('should provide combat message templates', () => {
    assert.ok(GameStrings.COMBAT)
    assert.ok(Array.isArray(GameStrings.COMBAT.ATTACK_DESCRIPTIONS))
    assert.ok(GameStrings.COMBAT.ATTACK_DESCRIPTIONS.length > 0)
  })

  it('should provide location and NPC text', () => {
    assert.ok(GameStrings.LOCATIONS)
    assert.ok(GameStrings.NPCS)
  })
})