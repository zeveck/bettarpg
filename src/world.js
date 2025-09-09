import { GameConfig, GameStrings, StringFormatter } from './config.js'

/**
 * World Management Module
 *
 * Handles world map generation, player movement, and encounter systems.
 * Manages village state, world exploration, treasure discovery, and
 * coordinates encounter generation based on player location.
 */
export class WorldManager {
  constructor (player, audioManager, combatManager, npcManager) {
    this.player = player
    this.audio = audioManager
    this.combat = combatManager
    this.npcs = npcManager

    // World state
    this.currentX = GameConfig.WORLD.VILLAGE_CENTER.x // Starting position - village center
    this.currentY = GameConfig.WORLD.VILLAGE_CENTER.y
    this.inVillage = true

    // World configuration from GameConfig
    this.WORLD_SIZE = GameConfig.WORLD.MAP_SIZE
    this.VILLAGE_CENTER = GameConfig.WORLD.VILLAGE_CENTER
    this.ENCOUNTER_RATES = GameConfig.WORLD.ENCOUNTER_RATES
  }

  // Movement methods

  /**
   * Moves player in specified direction and handles encounters
   * Clamps movement to world boundaries and manages village entry/exit
   * @param {string} direction - Direction to move ('north', 'south', 'east', 'west')
   * @returns {Object} Movement result with success flag, encounters, and location data
   */
  movePlayer (direction) {
    let newX = this.currentX
    let newY = this.currentY

    switch (direction) {
      case 'north': newY--; break
      case 'south': newY++; break
      case 'east': newX++; break
      case 'west': newX--; break
    }

    // Clamp movement to world boundaries instead of blocking
    // Allow movement to the edge zone where Gar spawns (coordinates 1-19 with 21x21 grid)
    newX = Math.max(1, Math.min(this.WORLD_SIZE - 2, newX))
    newY = Math.max(1, Math.min(this.WORLD_SIZE - 2, newY))

    // Move player
    this.currentX = newX
    this.currentY = newY

    // Check if entering/leaving village (center tile only)
    const wasInVillage = this.inVillage
    this.inVillage = (newX === this.VILLAGE_CENTER.x && newY === this.VILLAGE_CENTER.y)

    // Village entry message
    if (!wasInVillage && this.inVillage) {
      return {
        success: true,
        message: GameStrings.EXPLORATION.VILLAGE_MESSAGES.RETURN_TO_SAFETY,
        location: this.getCurrentLocation()
      }
    }

    // Edge exploration congratulations are shown via max level combat victory

    // Encounter check (only outside village) - always generates encounter
    if (!this.inVillage) {
      const encounter = this.checkForEncounter()
      return {
        success: true,
        encounter,
        location: this.getCurrentLocation()
      }
    }

    return {
      success: true,
      location: this.getCurrentLocation()
    }
  }

  // Encounter system
  /**
   * Determines what type of encounter occurs when player moves to a location
   * Uses distance-based logic and probability tables for encounter generation
   * @returns {Object} Encounter object with type and relevant data
   */
  checkForEncounter () {
    // In extreme zone (dark water): guaranteed combat encounters
    const distance = this.getDistanceFromVillage()
    if (distance > GameConfig.WORLD.DANGER_ZONES.DANGEROUS_RADIUS) {
      return this.createCombatEncounter()
    }

    // Normal encounter logic for safe areas: uses configured rates
    const encounterChance = Math.random()
    const rates = this.ENCOUNTER_RATES

    if (encounterChance < rates.COMBAT) {
      return this.createCombatEncounter()
    } else if (encounterChance < rates.COMBAT + rates.TREASURE) {
      return this.createTreasureEncounter()
    } else if (encounterChance < rates.COMBAT + rates.TREASURE + rates.PEACEFUL) {
      return this.createPeacefulEncounter()
    } else {
      return this.createMysteryEncounter()
    }
  }

  /**
   * Creates a combat encounter with appropriate enemy for current location
   * Handles distance-based enemy scaling and danger zone warnings
   * @returns {Object} Combat encounter with enemy data and optional warning message
   */
  createCombatEncounter () {
    const enemy = this.combat.startRandomEncounter(this.currentX, this.currentY)

    // If no enemy spawned (all species are friends in this zone), convert to peaceful encounter
    if (!enemy) {
      return {
        type: 'peaceful',
        message: 'Your fish friends swim by peacefully!',
        effectMessage: null
      }
    }

    // Add extreme zone warning message if in dark water
    let message = null
    const distance = this.getDistanceFromVillage()
    if (distance > GameConfig.WORLD.DANGER_ZONES.DANGEROUS_RADIUS) {
      message = GameStrings.EXPLORATION.DANGER_WARNINGS.EDGE_ZONE
    }

    return {
      type: 'combat',
      enemy,
      message
    }
  }

  /**
   * Creates a treasure discovery encounter with randomized Betta Bites reward
   * Awards currency to player and plays discovery sound effect
   * @returns {Object} Treasure encounter with amount found and discovery message
   */
  createTreasureEncounter () {
    const treasureConfig = GameConfig.ECONOMY.INCOME_SOURCES.TREASURE_BASE
    const bettaBitesFound = Math.floor(Math.random() * (treasureConfig.max - treasureConfig.min + 1)) + treasureConfig.min
    this.player.gainBettaBites(bettaBitesFound)
    this.audio.playSound('found')

    // Use treasure discovery texts from configuration
    const treasureMessages = GameStrings.EXPLORATION.ENCOUNTERS.TREASURE
    const randomMessage = treasureMessages[Math.floor(Math.random() * treasureMessages.length)]
    const findText = StringFormatter.format(randomMessage, { amount: bettaBitesFound })

    return {
      type: 'treasure',
      amount: bettaBitesFound,
      message: findText
    }
  }

  createPeacefulEncounter () {
    const peacefulMessages = GameStrings.EXPLORATION.ENCOUNTERS.PEACEFUL
    const randomMessage = peacefulMessages[Math.floor(Math.random() * peacefulMessages.length)]

    return {
      type: 'peaceful',
      message: randomMessage
    }
  }

  createMysteryEncounter () {
    const mysteryMessages = GameStrings.EXPLORATION.ENCOUNTERS.MYSTERY
    const randomMessage = mysteryMessages[Math.floor(Math.random() * mysteryMessages.length)]

    return {
      type: 'mystery',
      message: randomMessage
    }
  }

  // Location information
  getCurrentLocation () {
    return {
      x: this.currentX,
      y: this.currentY,
      inVillage: this.inVillage
    }
  }

  // Village interactions
  /**
   * Attempts to enter the village if player is at the center coordinates
   * Provides safety and access to NPCs, shops, and services
   * @returns {Object} Entry result with success flag and appropriate message
   */
  enterVillage () {
    if (this.currentX === this.VILLAGE_CENTER.x && this.currentY === this.VILLAGE_CENTER.y) {
      this.inVillage = true
      return {
        success: true,
        message: GameStrings.EXPLORATION.VILLAGE_MESSAGES.WELCOME_TO_VILLAGE
      }
    }
    return {
      success: false,
      message: GameStrings.EXPLORATION.VILLAGE_MESSAGES.NEED_TO_BE_AT_CENTER
    }
  }

  /**
   * Exits the village and places player one tile south for exploration
   * Transitions from safe village environment to dangerous wilderness
   * @returns {Object} Exit result with success flag and movement message
   */
  leaveVillage () {
    if (this.inVillage) {
      // Position player south of village when exiting
      // Village is just center tile, so place one tile south
      this.currentX = this.VILLAGE_CENTER.x // Keep X at village center
      this.currentY = this.VILLAGE_CENTER.y + 1 // Move one tile south of village
      this.inVillage = false
      return {
        success: true,
        message: GameStrings.EXPLORATION.MOVEMENT.VILLAGE_EXIT
      }
    }
    return {
      success: false,
      message: GameStrings.EXPLORATION.VILLAGE_MESSAGES.ALREADY_OUTSIDE
    }
  }

  // Shop interactions (for UI module to use)
  getShopItems () {
    return [
      {
        name: GameStrings.SHOP.ITEMS.SUBMARINE.NAME,
        description: GameStrings.SHOP.ITEMS.SUBMARINE.DESCRIPTION,
        cost: GameConfig.SHOP.SUBMARINE.cost,
        id: GameConfig.SHOP.SUBMARINE.id
      },
      {
        name: GameStrings.SHOP.ITEMS.KELP_SNACK.NAME,
        description: GameStrings.SHOP.ITEMS.KELP_SNACK.DESCRIPTION,
        cost: GameConfig.SHOP.KELP_SNACK.cost,
        id: GameConfig.SHOP.KELP_SNACK.id
      },
      {
        name: GameStrings.SHOP.ITEMS.BUBBLE_WATER.NAME,
        description: GameStrings.SHOP.ITEMS.BUBBLE_WATER.DESCRIPTION,
        cost: GameConfig.SHOP.BUBBLE_WATER.cost,
        id: GameConfig.SHOP.BUBBLE_WATER.id
      }
    ]
  }

  /**
   * Processes shop item purchase including affordability check and item effects
   * Different items have different effects (submarine acquisition, HP/MP restoration)
   * @param {string} itemId - Item identifier (e.g., 'submarine', 'kelp_snack', 'bubble_water')
   * @returns {Object} Purchase result with success flag and confirmation message
   * @returns {boolean} returns.success - Whether purchase was successful
   * @returns {string} returns.message - Confirmation or error message
   */
  buyItem (itemId) {
    const items = this.getShopItems()
    const item = items.find(i => i.id === itemId)

    if (!item) {
      return { success: false, message: GameStrings.SHOP.ERRORS.ITEM_NOT_FOUND }
    }

    if (!this.player.canAfford(item.cost)) {
      return { success: false, message: GameStrings.SHOP.ERRORS.NOT_ENOUGH_BETTA_BITES }
    }

    this.player.spendBettaBites(item.cost)

    // Apply item effects
    switch (itemId) {
      case 'submarine':
        // Acquire submarine
        return this.player.acquireSubmarine()

      case 'kelp_snack': {
        const hpHealed = this.player.healHP(this.player.getMaxHP())
        const message = StringFormatter.format(GameStrings.SHOP.CONFIRMATIONS.KELP_SNACK, { hpHealed })
        return {
          success: true,
          message
        }
      }

      case 'bubble_water': {
        const actualRestore = this.player.healMP(this.player.getMaxMP())
        return {
          success: true,
          message: StringFormatter.format(GameStrings.SHOP.CONFIRMATIONS.BUBBLE_WATER, { mpRestored: actualRestore })
        }
      }
    }

    return { success: false, message: GameStrings.SHOP.ERRORS.UNKNOWN_ITEM_EFFECT }
  }

  // Utility methods
  /**
   * Calculates Euclidean distance from given coordinates to village center
   * Used for determining danger zones and enemy scaling factors
   * @param {number} x - X coordinate (defaults to current player X)
   * @param {number} y - Y coordinate (defaults to current player Y)
   * @returns {number} Distance from village center as floating point value
   */
  getDistanceFromVillage (x = this.currentX, y = this.currentY) {
    return Math.sqrt((x - this.VILLAGE_CENTER.x) * (x - this.VILLAGE_CENTER.x) + (y - this.VILLAGE_CENTER.y) * (y - this.VILLAGE_CENTER.y))
  }

  // NPC Interaction Delegation Methods
  talkToNPC (npcId) {
    return this.npcs.talkToNPC(npcId)
  }

  nextDialogue () {
    return this.npcs.nextDialogue()
  }

  /**
   * Processes inn rest service including cost deduction and full healing
   * Fully restores player HP and MP for the configured inn cost
   * @returns {Object} Rest result with success flag and confirmation message
   * @returns {boolean} returns.success - Whether rest was successful (always true if affordable)
   * @returns {string} returns.message - Confirmation message
   */
  restAtInn () {
    const innCost = GameConfig.SHOP.INN_REST.cost

    if (!this.player.canAfford(innCost)) {
      return {
        success: false,
        message: StringFormatter.format(GameStrings.SHOP.ERRORS.INSUFFICIENT_FUNDS_FOR_REST, {
          cost: innCost
        })
      }
    }

    this.player.spendBettaBites(innCost)
    this.player.fullHeal()

    return {
      success: true,
      message: GameStrings.INN.CONFIRMATION
    }
  }

  endDialogue () {
    return this.npcs.endDialogue()
  }

  getCurrentDialogueState () {
    return this.npcs.getCurrentDialogueState()
  }

  // Teleport player to village
  /**
   * Instantly transports player to village center (used after death/defeat)
   * Ensures player safety by placing them directly in the safe zone
   * @returns {Object} Teleport result with success confirmation message
   */
  teleportToVillage () {
    this.currentX = this.VILLAGE_CENTER.x
    this.currentY = this.VILLAGE_CENTER.y
    this.inVillage = true
    return {
      success: true,
      message: GameStrings.EXPLORATION.VILLAGE_MESSAGES.SAFELY_RETURNED
    }
  }

  // Reset to initial state
  reset () {
    this.currentX = this.VILLAGE_CENTER.x
    this.currentY = this.VILLAGE_CENTER.y
    this.inVillage = true
    this.npcs.reset()
  }

  // Getters for UI
  isInVillage () { return this.inVillage }
}
