import { GameConfig, GameStrings, StringFormatter } from './config.js'

/**
 * Combat System Module
 *
 * Manages all combat mechanics including enemy generation, turn-based
 * fighting, spell casting, victory/defeat handling, and visual effects.
 * Handles enemy scaling, special attacks, and combat animations.
 */
export class CombatManager {
  constructor (player, audioManager) {
    this.player = player
    this.audio = audioManager
    this.world = null // Will be set after WorldManager is created
    this.ui = null // Will be set after UIManager is created

    // Combat state
    this.currentEnemy = null
    this.defeatedEnemy = null // Store defeated enemy for async victory processing
    this.combatLog = []
    this.combatActive = false
    this.hasDefeatedGar = false
    this.garTurnCounter = 0
    this.lastVictoryWasLevel10 = false
    this.hasReachedEdge = false // Track edge exploration achievement
    this.levelUpTimeout = null // Track level up timeout to clear if needed
    this.playerHasPartyHat = false // Track if player has party hat visual during combat
    this.currentCombatBefriending = false // Track if current combat is befriending with HBT
    this.hasAchievedPeace = false // Track if all enemies are peaceful

    // Enemy definitions from configuration
    this.enemies = [
      this.createEnemyFromConfig(GameConfig.ENEMIES.AGGRESSIVE_GUPPY),
      this.createEnemyFromConfig(GameConfig.ENEMIES.TERRITORIAL_ANGELFISH),
      this.createEnemyFromConfig(GameConfig.ENEMIES.SNEAKY_CATFISH),
      this.createEnemyFromConfig(GameConfig.ENEMIES.FIERCE_CICHLID),
      this.createEnemyFromConfig(GameConfig.ENEMIES.PREHISTORIC_GAR)
    ]
  }

  // Helper method to convert config enemy to combat format
  createEnemyFromConfig (enemyConfig) {
    return {
      name: enemyConfig.name,
      hp: enemyConfig.baseHp,
      maxHp: enemyConfig.baseHp,
      attack: enemyConfig.baseDamage,
      exp: enemyConfig.baseExp,
      sprite: `graphics/enemies/${enemyConfig.sprite}`,
      attacks: enemyConfig.attacks
    }
  }

  // Module interface: Set world manager reference after construction
  setWorldManager (worldManager) {
    this.world = worldManager
  }

  // Module interface: Set UI manager reference after construction
  setUIManager (uiManager) {
    this.ui = uiManager
  }

  /**
   * Calculates enemy level based on distance from village center using danger zones
   * Uses GameConfig.WORLD.DANGER_ZONES to determine appropriate level ranges
   * @param {number} x - World X coordinate of encounter
   * @param {number} y - World Y coordinate of encounter
   * @returns {number} Enemy level (1-10) based on distance from village
   */
  calculateEnemyLevel (x, y) {
    // Calculate actual distance from village center
    const distance = this.world.getDistanceFromVillage(x, y)

    // Use config-defined danger zones based on distance only
    const zones = GameConfig.WORLD.DANGER_ZONES
    let levelRange

    if (distance <= zones.SAFE_RADIUS) {
      levelRange = zones.LEVEL_SCALING.SAFE // Light blue water
    } else if (distance <= zones.DANGEROUS_RADIUS) {
      levelRange = zones.LEVEL_SCALING.DANGEROUS // Medium blue water
    } else {
      levelRange = zones.LEVEL_SCALING.EXTREME // Dark blue water
    }

    // Random level within the range for this zone
    const randomLevel = Math.floor(Math.random() * (levelRange.max - levelRange.min + 1)) + levelRange.min

    return randomLevel
  }

  /**
   * Scales enemy stats (HP, attack, EXP) based on level using config multipliers
   * Creates a clean copy to avoid contaminating the base enemy template
   * @param {Object} enemy - Base enemy template from GameConfig.ENEMIES
   * @param {number} level - Enemy level (typically 1-10)
   * @returns {Object} Scaled enemy with level-appropriate stats
   */
  scaleEnemyWithLevel (enemy, level) {
    // Create a clean copy without any combat-specific flags
    // This prevents contamination of the base enemy template
    const scaledEnemy = {
      name: enemy.name,
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      attack: enemy.attack,
      exp: enemy.exp,
      sprite: enemy.sprite,
      attacks: [...enemy.attacks] // Deep copy the attacks array
      // Explicitly NOT copying: befriended, hasPartyHat, or any other combat-specific flags
    }

    // HP scaling from configuration
    const scaling = GameConfig.COMBAT.ENEMY_SCALING
    const hpMultiplier = scaling.HP_BASE_MULTIPLIER + (level - 1) * scaling.HP_LEVEL_MULTIPLIER
    scaledEnemy.hp = Math.floor(enemy.hp * hpMultiplier)
    scaledEnemy.maxHp = scaledEnemy.hp

    // Damage scaling from configuration
    const damageMultiplier = scaling.DAMAGE_BASE_MULTIPLIER + (level - 1) * scaling.DAMAGE_LEVEL_MULTIPLIER
    scaledEnemy.attack = Math.floor(enemy.attack * damageMultiplier)

    // EXP scaling from configuration
    const expMultiplier = 1 + (level - 1) * GameConfig.COMBAT.ENEMY_SCALING.EXP_LEVEL_MULTIPLIER
    scaledEnemy.exp = Math.floor(enemy.exp * expMultiplier)

    return scaledEnemy
  }

  // Start a random encounter
  /**
   * Initiates a random combat encounter at the given world coordinates
   * Generates appropriate enemy based on distance from village and manages spawn rates
   * @param {number} playerX - World X coordinate
   * @param {number} playerY - World Y coordinate
   * @returns {Object|null} Generated enemy object or null if all species are befriended
   */
  startRandomEncounter (playerX, playerY) {
    let enemyIndex

    // Calculate enemy level based on distance from village
    const enemyLevel = this.calculateEnemyLevel(playerX, playerY)

    // Check if we're in extreme zone
    const distance = this.world.getDistanceFromVillage(playerX, playerY)
    const isExtremeZone = distance > GameConfig.WORLD.DANGER_ZONES.DANGEROUS_RADIUS

    // Prehistoric Gar spawns in extreme zone (dark water) until defeated
    if (isExtremeZone && !this.hasDefeatedGar) {
      enemyIndex = 4 // Prehistoric Gar
    } else {
      // Try to find a non-befriended enemy
      const maxAttempts = 10
      for (let i = 0; i < maxAttempts; i++) {
        enemyIndex = Math.floor(Math.random() * 4)
        const enemyName = this.enemies[enemyIndex].name

        // If not befriended, use this enemy
        if (!this.player.isFriendsWith(enemyName)) {
          break
        }

        // If all species are befriended, return null (no combat)
        if (i === maxAttempts - 1) {
          return null
        }
      }
    }

    // Store base enemy for encounter message
    const baseEnemy = this.enemies[enemyIndex]

    // Create scaled enemy
    this.currentEnemy = this.scaleEnemyWithLevel(baseEnemy, enemyLevel)
    this.currentEnemy.level = enemyLevel

    // Apply color variation to all enemies (consistent per game, random per encounter)
    this.currentEnemy.randomHue = Math.floor(Math.random() * 360)

    this.combatActive = true
    this.garTurnCounter = 0
    this.currentCombatBefriending = false // Reset befriending flag for new combat

    // Reset fish sprite orientations (in case previous combat had death flips)
    const playerFish = document.getElementById('player-fish-combat')
    if (playerFish) {
      playerFish.style.transform = 'none'
    }
    const statsSprite = document.getElementById('stats-player-sprite')
    if (statsSprite) {
      statsSprite.style.transform = 'none'
    }
    const enemyFish = document.getElementById('enemy-fish-combat')
    if (enemyFish) {
      enemyFish.style.transform = 'scaleX(-1)'
    }

    // Play combat start sound
    this.audio.playSound('combatstart')

    this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.COMBAT_BEGINS, {
      playerName: this.player.getName(),
      enemyName: this.currentEnemy.name
    }))

    return this.currentEnemy
  }

  // Player attacks
  /**
   * Executes player's physical attack against current enemy
   * Calculates damage, applies it to enemy, and triggers combat progression
   * @returns {Object|null} Victory result if enemy defeated, defeat result if player died, or null if combat continues
   */
  attack () {
    if (!this.combatActive || !this.currentEnemy) return

    const damage = this.player.calculateAttackDamage()
    this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - damage)

    // Random attack descriptions from configuration
    const attackDescriptions = GameStrings.COMBAT.ATTACK_DESCRIPTIONS
    const attackDescription = attackDescriptions[Math.floor(Math.random() * attackDescriptions.length)]

    this.audio.playSound('attack')
    this.addToCombatLog(`${this.player.getName()} ${attackDescription} for ${damage} damage!`)

    // Add shake animation to enemy sprite when taking damage
    this.shakeEnemySprite()

    return this.checkForVictory()
  }

  // Player uses magic skill
  /**
   * Executes player's spell/skill attack against current enemy
   * Handles MP consumption, damage calculation, and visual effects
   * @param {string} spellType - Type of spell to use ('bubble', 'party', 'gravel')
   * @returns {Object|null} Victory result if enemy defeated, defeat result if player died, or null if combat continues
   */
  useSkill (spellType) {
    if (!this.combatActive || !this.currentEnemy) return
    if (!this.player.canCastSpell(spellType)) return

    this.player.castSpell(spellType)
    this.audio.playSound(spellType)

    if (spellType === 'bubble') {
      const damage = this.player.calculateMagicDamage(spellType)
      this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - damage)
      this.shakeEnemySprite()

      // Random bubble spell descriptions from configuration
      const bubbleDescriptions = GameStrings.COMBAT.BUBBLE_DESCRIPTIONS
      const bubbleDescription = bubbleDescriptions[Math.floor(Math.random() * bubbleDescriptions.length)]

      this.createBubbleEffect()
      this.addToCombatLog(`${this.player.getName()} ${bubbleDescription} for ${damage} damage!`)
    } else if (spellType === 'party') {
      // Happy Balloon Time - befriend the enemy instead of damaging
      this.createBalloonEffect()
      this.addPartyHatToEnemy()
      this.addPartyHatToPlayer()
      this.applyRainbowHP()

      // Special friendship message
      this.addToCombatLog(`${this.player.getName()} throws a magical party!`)
      this.addToCombatLog(`${this.currentEnemy.name} is having such a good time!`)

      // Mark as befriended but keep HP > 0 for rainbow effect
      this.currentEnemy.befriended = true
      this.currentCombatBefriending = true // Track that we're befriending in this combat
      // Set HP to 1 so bar stays visible for rainbow effect
      this.currentEnemy.hp = 1
    } else if (spellType === 'gravel') {
      const damage = this.player.calculateMagicDamage(spellType)
      this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - damage)
      this.shakeEnemySprite()

      // Random gravel spell descriptions from configuration
      const gravelDescriptions = GameStrings.COMBAT.GRAVEL_DESCRIPTIONS
      const gravelDescription = gravelDescriptions[Math.floor(Math.random() * gravelDescriptions.length)]

      this.createGravelEffect()
      this.addToCombatLog(`${this.player.getName()} ${gravelDescription} for ${damage} damage!`)
    }

    return this.checkForVictory()
  }

  /**
   * Checks for enemy defeat and handles victory logic including rewards and level up
   * Processes befriending, EXP gain, loot, edge exploration achievement
   * @returns {Object|null} Victory result object with rewards and flags, or null if combat continues
   * @returns {number} returns.exp - Experience points gained
   * @returns {number} returns.bettaBites - Currency gained
   * @returns {boolean} returns.levelUp - Whether player leveled up
   * @returns {boolean} returns.showPeaceMessage - Whether to show peace achievement message
   */
  checkForVictory () {
    if (this.currentEnemy.hp <= 0 || this.currentEnemy.befriended) {
      // Enemy defeated - immediately stop combat to prevent duplicate processing
      this.combatActive = false
      this.defeatedEnemy = { ...this.currentEnemy } // Store a copy

      // Process victory immediately - sounds, EXP, level up
      const victoryResult = this.processVictoryImmediate(this.defeatedEnemy)

      return {
        enemyDefeated: true,
        enemy: this.defeatedEnemy,
        victoryResult
      }
    } else {
      this.enemyTurn()
      // Check if player died after enemy turn
      if (!this.player.isAlive) {
        return { playerDefeated: true }
      }
    }
    return null
  }

  // Enemy's turn
  enemyTurn () {
    if (!this.combatActive || !this.currentEnemy) return

    // Increment Gar turn counter
    if (this.currentEnemy.name === 'Prehistoric Gar') {
      this.garTurnCounter++
    }

    // Check for Prehistoric Gar special attacks
    if (this.currentEnemy.name === 'Prehistoric Gar') {
      const garConfig = GameConfig.ENEMIES.PREHISTORIC_GAR.special

      // Check for Gargantuan Gar attack
      if (garConfig.gargantuanAttack && this.garTurnCounter === garConfig.gargantuanAttack.turn) {
        this.executeGargantuanAttack(garConfig.gargantuanAttack)
        return
      }

      // Check for roar turns
      if (garConfig.roarTurns && garConfig.roarTurns.includes(this.garTurnCounter)) {
        this.executeGarRoar(garConfig)
        return
      }
    }

    // Regular enemy attack
    const attackIndex = Math.floor(Math.random() * this.currentEnemy.attacks.length)
    const attackDescription = this.currentEnemy.attacks[attackIndex]

    const damage = this.player.takeDamage(this.currentEnemy.attack)

    if (damage === 0 && this.player.hasSubmarine()) {
      // Submarine protection message
      this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.ENEMY_ATTACK_DEFLECTED, {
        enemyName: this.currentEnemy.name,
        attackDescription
      }))
      this.audio.playSound('attack') // Different sound for deflection
    } else {
      this.audio.playSound('wound')
      this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.ENEMY_ATTACK_DAMAGE, {
        enemyName: this.currentEnemy.name,
        attackDescription,
        damage
      }))

      // Add shake animation to player sprite when taking damage
      this.shakePlayerSprite()
    }

    // Don't call loseCombat here - let UI handle player death
  }

  // Execute Gargantuan Gar attack using configuration
  /**
   * Executes the Gar's special "Gargantuan Bite" multi-hit attack
   * Performs 3 separate attacks with visual effects and screen shake
   * @param {Object} attackConfig - Configuration object with attack parameters
   */
  executeGargantuanAttack (attackConfig) {
    this.addToCombatLog(attackConfig.channelMessage)
    this.addToCombatLog(attackConfig.attackMessage)

    // Play configured sound
    this.audio.playSound(attackConfig.sound)

    // Create visual effect
    if (attackConfig.visualEffect === 'giant_gar') {
      this.createGiantGarEffect()
    }

    // Deal damage after configured delay
    setTimeout(() => {
      if (this.player.hasSubmarine()) {
        this.addToCombatLog(attackConfig.defenseMessage)
        this.audio.playSound('attack')
      } else {
        this.player.takeDamage(attackConfig.damage)
        const damageMessage = StringFormatter.format(attackConfig.damageMessage, {
          damage: attackConfig.damage
        })
        this.addToCombatLog(damageMessage)

        this.audio.playSound('wound')
        this.shakePlayerSprite()

        // Check if player died from this delayed attack
        if (!this.player.isAlive) {
          // Notify UI that player has been defeated
          if (this.ui) {
            this.ui.checkAndHandlePlayerDefeat()
          }
        }
      }
    }, attackConfig.delay)
  }

  // Execute Gar roar using configuration
  executeGarRoar (garConfig) {
    const roarMessage = GameStrings.COMBAT.PREHISTORIC_GAR_ROAR
    this.addToCombatLog(roarMessage)
    this.audio.playSound(garConfig.roarSound)
    // Roar turn - no damage dealt
  }

  // Try to run away from combat
  /**
   * Attempts to escape from combat with success chance based on enemy type
   * Gar encounters have 0% escape chance, others have 75% success rate
   * @returns {Object} Escape result with escaped boolean and optional message
   */
  runAway () {
    if (!this.combatActive) return { escaped: false }

    // High level enemies are harder to escape from
    const escapeConfig = GameConfig.COMBAT.RUN_AWAY
    if (this.currentEnemy.level >= escapeConfig.difficultEnemyLevel) {
      if (Math.random() > escapeConfig.difficultEscapeChance) {
        this.addToCombatLog(GameStrings.COMBAT.ESCAPE_FAILED)
        this.enemyTurn()
        // Check if player died after enemy attack on failed escape
        if (!this.player.isAlive) {
          return { escaped: false, playerDefeated: true }
        }
        return { escaped: false }
      }
    }

    this.combatActive = false
    this.currentEnemy = null
    this.addToCombatLog(GameStrings.COMBAT.ESCAPE_BARELY_SUCCESS)
    return { escaped: true }
  }

  // UI calls this to show enemy death animation and complete victory
  /**
   * Completes enemy defeat processing including rewards and special conditions
   * Handles EXP distribution, Betta Bites rewards, and edge exploration achievements
   * @param {Function} victoryCallback - Callback function to execute after victory processing
   */
  completeEnemyDefeat (victoryCallback) {
    // Use stored defeated enemy to avoid null reference issues
    const defeatedEnemy = this.defeatedEnemy
    if (!defeatedEnemy) {
      console.error('completeEnemyDefeat called but no defeated enemy stored')
      return
    }

    // Clear defeated enemy immediately to prevent duplicate calls
    this.defeatedEnemy = null

    // Complete the victory after animation delay and return result to UI
    // Enemy fish flip animation already happened in processVictoryImmediate
    setTimeout(() => {
      const victoryResult = this.winCombatWithEnemy(defeatedEnemy)
      // Add defeated enemy info to victory result for UI logging
      victoryResult.defeatedEnemy = defeatedEnemy
      // Call the provided callback to handle victory
      if (victoryCallback) {
        victoryCallback(victoryResult)
      }
    }, 500) // Brief delay to show death animation
  }

  // Process victory immediately when enemy dies (plays sounds, updates stats)
  /**
   * Processes immediate victory effects including EXP gain and loot calculation
   * Handles befriending mechanics and determines if player levels up
   * @param {Object} enemy - The defeated enemy object
   * @returns {Object} Victory result object with rewards and status flags
   */
  processVictoryImmediate (enemy) {
    const exp = enemy.exp

    // Only flip enemy fish if defeated, not befriended
    if (!enemy.befriended) {
      const enemyFish = document.getElementById('enemy-fish-combat')
      if (enemyFish) {
        enemyFish.style.transform = 'scaleX(-1) scaleY(-1)'
      }
    }

    // Calculate Betta Bites rewards using configuration
    const config = GameConfig.COMBAT.ENEMY_SCALING.BETTA_BITES_REWARDS
    const baseBites = Math.floor(Math.random() * (config.baseMax - config.baseMin + 1)) + config.baseMin
    const levelMultiplier = Math.floor(Math.random() * (config.levelBonusMax - config.levelBonusMin + 1)) + config.levelBonusMin
    const levelBonus = (enemy.level - 1) * levelMultiplier
    const bettaBites = baseBites + levelBonus

    // Check if this was the Giant Gar
    if (enemy.name === 'Prehistoric Gar' && enemy.level >= 8) {
      this.hasDefeatedGar = true

      // Check if we've achieved peace (all enemies befriended/defeated)
      if (!this.hasAchievedPeace && this.areAllEnemiesPeaceful()) {
        this.hasAchievedPeace = true
      }
    }

    this.player.gainExp(exp)
    this.player.gainBettaBites(bettaBites)

    if (enemy.befriended) {
      // Add this species to player's befriended list
      this.player.addBefriendedSpecies(enemy.name)
      this.addToCombatLog(`${enemy.name} becomes your friend! You gained ${exp} EXP and ${bettaBites} Betta Bites!`)

      // Check if we've achieved peace after befriending this enemy
      if (!this.hasAchievedPeace && this.areAllEnemiesPeaceful()) {
        this.hasAchievedPeace = true
      }
    } else {
      this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.VICTORY_REWARDS, {
        exp,
        bettaBites
      }))
    }

    // Check for level up but don't do it yet
    const willLevelUp = this.player.gainExp(0) // Check without adding more exp

    // Check for max level enemy victory (edge exploration achievement)
    // Only show congratulations for first max level victory
    const extremeLevel = GameConfig.WORLD.DANGER_ZONES.LEVEL_SCALING.EXTREME.min
    const isLevel10Victory = enemy.level === extremeLevel && !this.hasReachedEdge
    if (isLevel10Victory) {
      this.hasReachedEdge = true // Mark edge as reached
    }
    this.lastVictoryWasLevel10 = isLevel10Victory

    // Play victory sounds immediately
    this.audio.playSound('fanfare')

    // If leveling up, trigger fanfare first, THEN do level up
    if (willLevelUp) {
      // Add level up messages first (but don't level up yet)
      this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.LEVEL_UP, {
        newLevel: this.player.getLevel() + 1
      }))

      // Brief delay for fanfare to play, then do level up and play level up sound
      this.levelUpTimeout = setTimeout(() => {
        // NOW do the actual level up (HP increase happens here, after fanfare has played)
        const gains = this.player.levelUp()
        this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.HP_MP_INCREASE, {
          hpIncrease: gains.hpIncrease,
          mpIncrease: gains.mpIncrease
        }))

        // Armor upgrade messages - use config-defined armor levels
        const armorLevels = GameConfig.PLAYER.ARMOR_SYSTEM.LEVELS
        if (armorLevels[this.player.getLevel()]) {
          const armorLevelKeys = Object.keys(armorLevels).map(Number).sort()
          const currentArmorIndex = armorLevelKeys.indexOf(this.player.getLevel())

          const armorMessages = [
            null, // Level 1 has no upgrade message
            GameStrings.COMBAT.ARMOR_HELMET,
            GameStrings.COMBAT.ARMOR_ADVANCED,
            GameStrings.COMBAT.ARMOR_FULL_METAL
          ]

          if (currentArmorIndex >= 0 && currentArmorIndex < armorMessages.length && armorMessages[currentArmorIndex]) {
            this.addToCombatLog(armorMessages[currentArmorIndex])
          }
        }

        // Play levelup sound after HP increase
        this.audio.playSound('levelup')
        this.levelUpTimeout = null // Clear the timeout reference
      }, 500) // Shorter delay - enough for fanfare to start but not too long
    }

    return {
      victory: true,
      showCongratulations: isLevel10Victory,
      showPeaceMessage: this.hasAchievedPeace,
      levelUp: willLevelUp
    }
  }

  // Win combat with specific enemy data (called after animation delay)
  /**
   * Handles complete victory sequence including cleanup and UI updates
   * Processes defeat, manages combat state, and triggers UI victory display
   * @param {Object} enemy - The defeated enemy object
   * @returns {Object} Victory result with success flag and enemy information
   */
  winCombatWithEnemy (enemy) {
    if (!enemy) {
      console.error('winCombatWithEnemy called with null enemy')
      return { victory: false }
    }

    // Victory was already processed in processVictoryImmediate
    this.currentEnemy = null

    // Return victory information for UI handling
    // Don't show peace message here as it's already shown from processVictoryImmediate
    return {
      victory: true,
      showCongratulations: this.lastVictoryWasLevel10,
      showPeaceMessage: false
    }
  }

  // Lose combat
  /**
   * Handles player defeat in combat including death penalties and recovery
   * Triggers player death mechanics and returns to village safely
   * @returns {Object} Defeat result with loss information
   * @returns {boolean} returns.defeated - Always true
   * @returns {number} returns.bettaBitesLost - Amount of currency lost
   * @returns {Object|null} returns.defeatedByEnemy - Enemy that defeated player
   */
  loseCombat () {
    // Store enemy info before clearing it (for UI logging)
    const defeatedByEnemy = this.currentEnemy ? { ...this.currentEnemy } : null

    const bettaBitesLost = this.player.die()

    // Flip player fish to show death
    const playerFish = document.getElementById('player-fish-combat')
    if (playerFish) {
      playerFish.style.transform = 'scaleY(-1)'
    }

    // Also flip player fish in stats panel
    const statsSprite = document.getElementById('stats-player-sprite')
    if (statsSprite) {
      statsSprite.style.transform = 'scaleY(-1)'
    }

    this.addToCombatLog(GameStrings.COMBAT.PLAYER_DEFEATED)

    if (bettaBitesLost > 0) {
      this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.PLAYER_LOST_BETTA_BITES, {
        amount: bettaBitesLost
      }))
    }

    this.combatActive = false
    this.currentEnemy = null

    // Return defeat info for UI to handle screen transition and final message
    return {
      defeated: true,
      bettaBitesLost,
      defeatedByEnemy
    }
  }

  // Visual Effects
  /**
   * Creates visual bubble effect for Bubble Blast spell
   * Spawns animated bubbles with physics and lifecycle management
   */
  createBubbleEffect () {
    const bubbleCounts = [4, 5, 6, 7, 8] // Random 4-8 bubbles
    const bubbleCount = bubbleCounts[Math.floor(Math.random() * bubbleCounts.length)]

    for (let i = 0; i < bubbleCount; i++) {
      setTimeout(() => {
        const bubble = document.createElement('div')
        bubble.className = 'bubble'
        bubble.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 15 + 10}px;
                    height: ${Math.random() * 15 + 10}px;  
                    background: radial-gradient(circle, lightblue, rgba(173,216,230,0.8));
                    border-radius: 50%;
                    left: ${Math.random() * 90 + 5}%;
                    top: 100%;
                    pointer-events: none;
                    z-index: 9998;
                    animation: bubble-rise 2s ease-out forwards;
                `

        document.getElementById('game-container').appendChild(bubble)

        setTimeout(() => {
          if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble)
          }
        }, 2000)
      }, i * 150)
    }
  }

  /**
   * Creates visual gravel effect for Gravel Grenade spell
   * Spawns animated gravel particles with impact effects
   */
  createGravelEffect () {
    const container = document.createElement('div')
    container.className = 'gravel-container'
    container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `

    document.getElementById('game-container').appendChild(container)

    // Create multiple gravel particles
    const particleCount = Math.floor(Math.random() * 15) + 20 // 20-35 particles

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const particle = document.createElement('div')
        particle.className = 'gravel-particle'
        particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 8 + 4}px;
                    height: ${Math.random() * 8 + 4}px;
                    background: linear-gradient(45deg, #8B4513, #A0522D, #696969);
                    border-radius: ${Math.random() * 3}px;
                    left: ${Math.random() * 100}%;
                    top: -20px;
                    animation: gravelFall ${Math.random() * 0.5 + 1}s ease-in forwards;
                `

        container.appendChild(particle)
      }, i * 50)
    }

    // Clean up container after animation
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
    }, 2000)
  }

  /**
   * Creates visual balloon effect for Happy Balloon Time spell
   * Spawns colorful balloon particles with floating animation
   */
  createBalloonEffect () {
    const container = document.createElement('div')
    container.className = 'balloon-container'
    container.dataset.createdAt = Date.now() // Track when created
    container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9998;
        `

    document.getElementById('game-container').appendChild(container)

    // Create many colorful balloons
    const balloonCount = Math.floor(Math.random() * 10) + 15 // 15-25 balloons
    const colors = ['#FF69B4', '#FFD700', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C', '#FF6347', '#40E0D0']

    for (let i = 0; i < balloonCount; i++) {
      setTimeout(() => {
        const balloon = document.createElement('div')
        balloon.className = 'party-balloon'
        const color = colors[Math.floor(Math.random() * colors.length)]
        const size = Math.random() * 30 + 25 // 25-55px
        const startX = Math.random() * 100

        balloon.style.cssText = `
                    position: absolute;
                    width: ${size * 1.2}px;
                    height: ${size * 1.5}px;
                    background: radial-gradient(ellipse at 35% 25%, ${color}ee, ${color}cc, ${color}aa);
                    border-radius: 50%;
                    left: ${startX}%;
                    bottom: -100px;
                    opacity: 0.85;
                    animation: balloon-smooth-rise ${Math.random() * 2 + 4}s linear forwards;
                    box-shadow: 0 3px 15px rgba(0,0,0,0.15), inset -5px -5px 10px rgba(255,255,255,0.3);
                `

        // Add balloon string
        const string = document.createElement('div')
        string.style.cssText = `
                    position: absolute;
                    width: 1px;
                    height: 50px;
                    background: #666;
                    left: 50%;
                    top: 100%;
                    transform: translateX(-50%);
                `
        balloon.appendChild(string)

        container.appendChild(balloon)
      }, i * 100)
    }

    // Clean up after animation completes (max animation is 6s)
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
    }, 6500)
  }

  createGiantGarEffect () {
    const giantGar = document.createElement('img')
    giantGar.src = 'graphics/enemies/prehistoric_gar.png'
    giantGar.style.cssText = `
            position: fixed;
            top: 30vh;
            right: -600px;
            width: 600px;
            height: 300px;
            z-index: 9999;
            image-rendering: pixelated;
            filter: hue-rotate(${this.currentEnemy.randomHue}deg);
            animation: giant-gar-swim 3s ease-in-out forwards;
        `

    document.body.appendChild(giantGar)

    setTimeout(() => {
      if (giantGar.parentNode) {
        giantGar.parentNode.removeChild(giantGar)
      }
    }, 3000)
  }

  // Helper to convert any sprite path to its party hat variant
  getPartyHatSprite (spritePath) {
    if (!spritePath) return null

    // All party hat variants are in a 'partyhat' subfolder
    // e.g., graphics/enemies/x.png -> graphics/enemies/partyhat/x_partyhat.png
    // e.g., graphics/main_fish/x.png -> graphics/main_fish/partyhat/x_partyhat.png

    const parts = spritePath.split('/')
    const filename = parts.pop().replace('.png', '')
    const folder = parts.join('/')

    return `${folder}/partyhat/${filename}_partyhat.png`
  }

  addPartyHatToEnemy () {
    const enemyFish = document.getElementById('enemy-fish-combat')
    if (!enemyFish || !this.currentEnemy) return

    const partyHatSprite = this.getPartyHatSprite(this.currentEnemy.sprite)
    if (partyHatSprite) {
      enemyFish.src = partyHatSprite
      // Mark that we've applied party hat so UI doesn't reset it
      this.currentEnemy.hasPartyHat = true
    }
  }

  addPartyHatToPlayer () {
    // Just mark that player has party hat - UI will handle the visual update
    this.playerHasPartyHat = true

    // Let UI handle the actual sprite updates through its update methods
    if (this.ui) {
      this.ui.updatePlayerSpritesWithPartyHat()
    }
  }

  applyRainbowHP () {
    // Let UI handle the visual rainbow effect
    if (this.ui) {
      this.ui.applyRainbowHPEffect()
    }
  }

  // Combat log management
  addToCombatLog (message) {
    this.combatLog.unshift(message) // Add to beginning
    if (this.combatLog.length > 10) {
      this.combatLog = this.combatLog.slice(0, 10) // Keep only last 10 messages
    }
  }

  // Reset to initial state
  // Helper method to shake any sprite element
  shakeSprite (elementId, duration = 500) {
    const sprite = document.getElementById(elementId)
    if (sprite) {
      sprite.classList.add('shake')
      setTimeout(() => {
        sprite.classList.remove('shake')
      }, duration)
    }
  }

  // Shake player sprite when taking damage
  shakePlayerSprite () {
    // Shake both combat sprite and stats panel sprite
    this.shakeSprite('player-fish-combat')
    this.shakeSprite('stats-player-sprite')
  }

  // Shake enemy sprite when taking damage
  shakeEnemySprite () {
    this.shakeSprite('enemy-fish-combat')
  }

  /**
   * Resets combat manager to initial state for new game
   * Clears all combat state, effects, and enemy data
   */
  reset () {
    this.currentEnemy = null
    this.defeatedEnemy = null
    this.combatLog = []
    this.combatActive = false
    this.hasDefeatedGar = false
    this.garTurnCounter = 0
    this.lastVictoryWasLevel10 = false
    this.hasReachedEdge = false
    this.playerHasPartyHat = false
    this.currentCombatBefriending = false
    this.hasAchievedPeace = false

    // Clear any pending level up timeout
    if (this.levelUpTimeout) {
      clearTimeout(this.levelUpTimeout)
      this.levelUpTimeout = null
    }
  }

  // Getters for UI
  getCombatLog () {
    return this.combatLog
  }

  getCurrentEnemy () {
    return this.currentEnemy
  }

  isCombatActive () {
    return this.combatActive
  }

  shouldShowCongratulations () {
    return this.lastVictoryWasLevel10
  }

  clearCongratulationsFlag () {
    this.lastVictoryWasLevel10 = false
  }

  shouldShowPeaceMessage () {
    return this.hasAchievedPeace
  }

  clearPeaceMessageFlag () {
    this.hasAchievedPeace = false
  }

  isBefriendingCurrentEnemy () {
    return this.currentCombatBefriending
  }

  // Check if all enemies are peaceful (all regular enemies befriended and Gar defeated)
  /**
   * Checks if all possible enemies are befriended or defeated (complete world peace)
   * Used to determine if player has achieved the peace condition victory
   * @returns {boolean} True if all enemies are peaceful, false if any can still be fought
   */
  areAllEnemiesPeaceful () {
    // Check if Gar is defeated
    if (!this.hasDefeatedGar) {
      return false
    }

    // Check if all 4 regular enemy types are befriended
    const regularEnemies = [
      'Aggressive Guppy',
      'Territorial Angelfish',
      'Sneaky Catfish',
      'Fierce Cichlid'
    ]

    for (const enemyName of regularEnemies) {
      if (!this.player.isFriendsWith(enemyName)) {
        return false
      }
    }

    return true
  }

  // Proper interfaces for UI interaction (no direct method exposure)
  displayCombatMessage (message) {
    this.addToCombatLog(message)
  }

  processCombatVictory (callback) {
    // Delegate to the established method but with proper interface
    this.completeEnemyDefeat(callback)
  }
}
