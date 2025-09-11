import { GameConfig, GameStrings } from './config.js'

/**
 * Player Character Module
 *
 * Manages player character state including stats, progression, combat
 * mechanics, and equipment. Handles level-ups, damage calculations,
 * spell casting, and visual representation (sprites, colors).
 */
export class Player {
  constructor () {
    const startingStats = GameConfig.PLAYER.STARTING_STATS
    this.name = ''
    this.color = ''
    this.level = startingStats.level
    this.hp = startingStats.hp
    this.maxHp = startingStats.maxHp
    this.mp = startingStats.mp
    this.maxMp = startingStats.maxMp
    this.exp = startingStats.exp
    this.expToNext = GameConfig.PLAYER.PROGRESSION.EXP_BASE
    this.bettaBites = startingStats.bettaBites
    this.hasDunkleosteusSub = false
    this.befriendedSpecies = new Set() // Track which enemy types are friends
  }

  // Combat
  /**
   * Applies damage to the player with armor reduction and submarine protection
   * Calculates final damage based on level-based armor system and equipment
   * @param {number} amount - Raw damage amount before reductions
   * @returns {number} Actual damage taken after all reductions (minimum 1, 0 if submarine)
   */
  takeDamage (amount) {
    // Submarine provides complete damage protection
    if (this.hasDunkleosteusSub) {
      return 0 // No damage taken with submarine
    }

    // Armor reduces damage based on level
    let armorReduction = 0
    const armorLevels = GameConfig.PLAYER.ARMOR_SYSTEM.LEVELS

    // Check armor levels in descending order (highest first)
    const armorLevelKeys = Object.keys(armorLevels).map(Number).sort((a, b) => b - a)
    for (const armorLevel of armorLevelKeys) {
      if (this.level >= armorLevel) {
        armorReduction = armorLevels[armorLevel].reduction
        break
      }
    }

    const finalDamage = Math.max(1, amount - armorReduction) // Minimum 1 damage
    this.hp = Math.max(0, this.hp - finalDamage)

    return finalDamage // Return actual damage taken for logging
  }

  /**
   * Heals player HP
   * @param {number} amount - Amount of HP to restore
   * @returns {number} Actual HP healed (capped at max HP)
   */
  healHP (amount) {
    const actualHeal = Math.min(amount, this.maxHp - this.hp)
    this.hp = Math.min(this.maxHp, this.hp + amount)
    return actualHeal
  }

  /**
   * Heals player MP
   * @param {number} amount - Amount of MP to restore
   * @returns {number} Actual MP healed (capped at max MP)
   */
  healMP (amount) {
    const actualHeal = Math.min(amount, this.maxMp - this.mp)
    this.mp = Math.min(this.maxMp, this.mp + amount)
    return actualHeal
  }

  /**
   * Restores player HP and MP to full and returns amount healed
   * @returns {Object} Healing amounts
   * @returns {number} returns.hpHealed - HP restored
   * @returns {number} returns.mpHealed - MP restored
   */
  fullHeal () {
    const hpHealed = this.maxHp - this.hp
    const mpHealed = this.maxMp - this.mp
    this.hp = this.maxHp
    this.mp = this.maxMp
    return { hpHealed, mpHealed }
  }

  /**
   * Advances player to next level, increasing stats and resetting HP/MP to full
   * Uses GameConfig.PLAYER.PROGRESSION for HP/MP gain and EXP scaling
   * @returns {Object} Stat gains from leveling up
   * @returns {number} returns.hpIncrease - HP gained this level
   * @returns {number} returns.mpIncrease - MP gained this level
   */
  levelUp () {
    this.level++
    this.exp -= this.expToNext
    this.expToNext = Math.floor(this.expToNext * GameConfig.PLAYER.PROGRESSION.EXP_MULTIPLIER)

    const hpIncrease = GameConfig.PLAYER.PROGRESSION.HP_GAIN_PER_LEVEL
    const mpIncrease = GameConfig.PLAYER.PROGRESSION.MP_GAIN_PER_LEVEL

    this.maxHp += hpIncrease
    this.maxMp += mpIncrease
    this.hp = this.maxHp
    this.mp = this.maxMp

    return { hpIncrease, mpIncrease }
  }

  /**
   * Adds experience points and checks if player can level up
   * @param {number} amount - Experience points to add
   * @returns {boolean} True if player has enough EXP to level up, false otherwise
   */
  gainExp (amount) {
    this.exp += amount
    return this.exp >= this.expToNext // Return true if level up is available
  }

  // Economy
  /**
   * Checks if player has enough Betta Bites to afford a purchase
   * @param {number} cost - Cost in Betta Bites
   * @returns {boolean} True if player can afford the cost, false otherwise
   */
  canAfford (cost) {
    return this.bettaBites >= cost
  }

  /**
   * Attempts to spend Betta Bites if player can afford it
   * @param {number} amount - Amount of Betta Bites to spend
   * @returns {boolean} True if purchase was successful, false if insufficient funds
   */
  spendBettaBites (amount) {
    if (this.canAfford(amount)) {
      this.bettaBites -= amount
      return true
    }
    return false
  }

  /**
   * Adds Betta Bites to player's currency
   * @param {number} amount - Amount of Betta Bites to add
   */
  gainBettaBites (amount) {
    this.bettaBites += amount
  }

  // Combat utilities
  /**
   * Checks if player has unlocked a specific spell based on level requirements
   * @param {string} spellType - Type of spell ('bubble', 'party', 'gravel')
   * @returns {boolean} True if spell is unlocked, false otherwise
   */
  hasSpell (spellType) {
    if (spellType === 'bubble') {
      const spell = GameConfig.COMBAT.SPELLS.BUBBLE_BLAST
      return this.level >= spell.unlockLevel
    }
    if (spellType === 'party') {
      const spell = GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME
      return this.level >= spell.unlockLevel
    }
    if (spellType === 'gravel') {
      const spell = GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE
      return this.level >= spell.unlockLevel
    }
    return false
  }

  /**
   * Checks if player can currently cast a spell (has it unlocked and enough MP)
   * @param {string} spellType - Type of spell ('bubble', 'party', 'gravel')
   * @returns {boolean} True if spell can be cast, false otherwise
   */
  canCastSpell (spellType) {
    if (!this.hasSpell(spellType)) return false

    if (spellType === 'bubble') {
      const spell = GameConfig.COMBAT.SPELLS.BUBBLE_BLAST
      return this.mp >= spell.mpCost
    }
    if (spellType === 'party') {
      const spell = GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME
      return this.mp >= spell.mpCost
    }
    if (spellType === 'gravel') {
      const spell = GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE
      return this.mp >= spell.mpCost
    }
    return false
  }

  /**
   * Casts a spell, consuming the required MP
   * @param {string} spellType - Type of spell ('bubble', 'party', 'gravel')
   * @returns {boolean} True if spell was successfully cast, false if cannot cast
   */
  castSpell (spellType) {
    if (!this.canCastSpell(spellType)) return false

    if (spellType === 'bubble') {
      this.mp -= GameConfig.COMBAT.SPELLS.BUBBLE_BLAST.mpCost
      return true
    }
    if (spellType === 'party') {
      this.mp -= GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME.mpCost
      return true
    }
    if (spellType === 'gravel') {
      this.mp -= GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE.mpCost
      return true
    }
    return false
  }

  // Damage calculations
  /**
   * Calculates physical attack damage with level scaling and equipment bonuses
   * Base damage is random, with +1 damage every 2 levels, doubled if player has submarine
   * @returns {number} Final attack damage value
   */
  calculateAttackDamage () {
    // Base damage scales with level: +1 on even levels (2, 4, 6, 8, 10)
    const damageConfig = GameConfig.COMBAT.PLAYER_DAMAGE
    const baseDamage = Math.floor(Math.random() * (damageConfig.baseMax - damageConfig.baseMin + 1)) + damageConfig.baseMin
    const levelBonus = Math.floor(this.level / 2) // +1 damage on even levels
    let playerDamage = baseDamage + levelBonus

    // Submarine doubles attack damage
    if (this.hasDunkleosteusSub) {
      playerDamage *= 2
    }

    return playerDamage
  }

  /**
   * Calculates spell damage with level-based magic bonus
   * Magic bonus increases on odd levels (1, 3, 5, etc.)
   * @param {string} spellType - Type of spell ('bubble', 'party', 'gravel')
   * @returns {number} Final spell damage value, 0 if invalid spell type
   */
  calculateMagicDamage (spellType) {
    const magicBonus = Math.floor((this.level + 1) / 2) // +1 on odd levels

    if (spellType === 'bubble') {
      const spell = GameConfig.COMBAT.SPELLS.BUBBLE_BLAST
      const minDamage = spell.damageMin + magicBonus
      const maxDamage = spell.damageMax + magicBonus
      return Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage
    }

    if (spellType === 'party') {
      const spell = GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME
      const minDamage = spell.damageMin + magicBonus
      const maxDamage = spell.damageMax + magicBonus
      return Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage
    }

    if (spellType === 'gravel') {
      const spell = GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE
      const minDamage = spell.damageMin + magicBonus
      const maxDamage = spell.damageMax + magicBonus
      return Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage
    }

    return 0
  }

  // Death handling
  /**
   * Handles player death, applying Betta Bites penalty and restoring HP/MP to full
   * Player loses half their Betta Bites (rounded down) but keeps all other progress
   * @returns {number} Amount of Betta Bites lost due to death
   */
  die () {
    // Calculate Betta Bites loss (half, rounded down)
    const bettaBitesLost = Math.floor(this.bettaBites / 2)
    this.bettaBites -= bettaBitesLost

    // Reset to full HP and MP
    this.hp = this.maxHp
    this.mp = this.maxMp

    return bettaBitesLost
  }

  // Reset to initial state
  /**
   * Resets player to starting state for new game
   * Clears all progress including level, stats, currency, and special items
   */
  reset () {
    const startingStats = GameConfig.PLAYER.STARTING_STATS
    this.name = ''
    this.color = ''
    this.level = startingStats.level
    this.hp = startingStats.hp
    this.maxHp = startingStats.maxHp
    this.mp = startingStats.mp
    this.maxMp = startingStats.maxMp
    this.exp = startingStats.exp
    this.expToNext = GameConfig.PLAYER.PROGRESSION.EXP_BASE
    this.bettaBites = 0
    this.hasDunkleosteusSub = false
  }

  // Acquire special items
  /**
   * Grants player the Dunkleosteus Submarine, providing damage immunity and attack bonus
   * This is a major gameplay upgrade affecting both defense and offense
   * @returns {Object} Success confirmation with message
   * @returns {boolean} returns.success - Always true for successful acquisition
   * @returns {string} returns.message - Confirmation message for UI display
   */
  acquireSubmarine () {
    this.hasDunkleosteusSub = true
    return {
      success: true,
      message: GameStrings.SHOP.CONFIRMATIONS.SUBMARINE
    }
  }

  // Check if player has submarine
  /**
   * Checks if player owns the Dunkleosteus Submarine
   * @returns {boolean} True if player has submarine, false otherwise
   */
  hasSubmarine () {
    return this.hasDunkleosteusSub
  }

  // Getters for UI
  get hpPercentage () {
    return (this.hp / this.maxHp) * 100
  }

  get mpPercentage () {
    return (this.mp / this.maxMp) * 100
  }

  // Getters for UI
  getLevel () { return this.level }
  getExp () { return this.exp }
  getExpToNext () { return this.expToNext }
  getBettaBites () { return this.bettaBites }
  getHP () { return this.hp }
  getMaxHP () { return this.maxHp }
  getMP () { return this.mp }
  getMaxMP () { return this.maxMp }
  getName () { return this.name }
  getColor () { return this.color }

  // Befriended species management
  addBefriendedSpecies (speciesName) {
    this.befriendedSpecies.add(speciesName)
  }

  isFriendsWith (speciesName) {
    return this.befriendedSpecies.has(speciesName)
  }

  // Set player identity
  /**
   * Sets player's name and color for character customization
   * @param {string} name - Player's chosen name
   * @param {string} color - Player's chosen color (affects sprite rendering)
   */
  setPlayerIdentity (name, color) {
    this.name = name
    this.color = color
  }

  get isAlive () {
    return this.hp > 0
  }

  // Sprite selection
  /**
   * Determines the appropriate sprite path based on player level and equipment
   * Returns submarine sprite if owned, otherwise returns armor sprite based on level
   * @returns {string} File path to the player's current sprite image
   */
  getSprite () {
    if (this.hasDunkleosteusSub) {
      return `graphics/artifacts/${GameConfig.PLAYER.ARMOR_SYSTEM.SUBMARINE.sprite}`
    }

    const armorLevels = GameConfig.PLAYER.ARMOR_SYSTEM.LEVELS

    // Find the highest armor level the player qualifies for
    const armorLevelKeys = Object.keys(armorLevels).map(Number).sort((a, b) => b - a)
    for (const armorLevel of armorLevelKeys) {
      if (this.level >= armorLevel) {
        return `graphics/main_fish/${armorLevels[armorLevel].sprite}`
      }
    }

    // Fallback (shouldn't happen since level 1 armor should always qualify)
    return `graphics/main_fish/${armorLevels[1].sprite}`
  }

  // Color filter
  /**
   * Gets the CSS filter string for player's chosen color customization
   * Converts color name to hue-rotate filter for sprite recoloring
   * @returns {string} CSS filter string or 'none' if no color selected
   */
  getColorFilter () {
    const colorConfig = GameConfig.UI.COLORS[this.color?.toUpperCase()]
    return colorConfig ? colorConfig.filter : 'none'
  }
}
