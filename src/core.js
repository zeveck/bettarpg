import { GameConfig } from './config.js'
import { AudioManager } from './audio.js'
import { Player } from './player.js'
import { NPCManager } from './npc.js'
import { CombatManager } from './combat.js'
import { WorldManager } from './world.js'
import { UIManager } from './ui.js'

/**
 * Core Game Module
 *
 * Main game controller that coordinates all other modules and handles
 * high-level game operations. Acts as the central hub for module
 * communication and provides the public API for HTML interactions.
 */
export class BettaRPG {
  /**
   * Initializes the complete game system by creating and wiring all modules
   * Sets up dependency relationships and prepares game for user interaction
   */
  constructor () {
    // Initialize modules in correct dependency order
    this.player = new Player()
    this.audio = new AudioManager()
    this.npcs = new NPCManager()
    this.combat = new CombatManager(this.player, this.audio)
    this.world = new WorldManager(this.player, this.audio, this.combat, this.npcs)
    this.combat.setWorldManager(this.world) // Set world reference after creation
    this.ui = new UIManager(this.player, this.audio, this.combat, this.world)
    this.ui.setCoreManager(this) // Set core reference for version info
    this.combat.setUIManager(this.ui) // Set UI reference for death handling

    // Attach event listeners for all interactive elements
    this.attachEventListeners()

    // Pre-render world background for smooth user experience
    this.initializeAssets()
  }

  // Initialize heavy assets in background during game startup
  /**
   * Preloads game assets and generates backgrounds for optimal performance
   * Handles asynchronous asset loading and provides graceful error handling
   * @async
   */
  async initializeAssets () {
    try {
      // Pre-load all background images
      this.preloadBackgroundImages()
      // Pre-render world background
      await this.ui.preRenderWorldBackground()
    } catch (error) {
      // Silent fallback - assets will load on-demand
    }
  }

  // Pre-load all background images to avoid first-load delays
  preloadBackgroundImages () {
    const backgroundImages = [
      'graphics/map/water-tile-dark.png', // Village background
      'graphics/map/water-tile2.png', // Light water (world/combat)
      'graphics/map/water-tile-darkish.png' // Medium water (world/combat)
    ]

    backgroundImages.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }

  // Attach event listeners for all interactive elements
  /**
   * Sets up all DOM event listeners for buttons and interactive elements
   * Creates connections between HTML interface and game logic methods
   */
  attachEventListeners () {
    // Start screen
    document.getElementById('start-game-btn').addEventListener('click',
      () => this.startCharacterCreation())

    // Village locations
    document.getElementById('elder-dwelling').addEventListener('click',
      () => this.talkToNPC('elder'))
    document.getElementById('fish-mart').addEventListener('click',
      () => this.talkToNPC('merchant'))
    document.getElementById('village-guard').addEventListener('click',
      () => this.talkToNPC('guard'))
    document.getElementById('bubbles-home').addEventListener('click',
      () => this.talkToNPC('bubble'))
    document.getElementById('swishy-solace-inn').addEventListener('click',
      () => this.talkToNPC('innkeeper'))
    document.getElementById('exit-to-paddies').addEventListener('click',
      () => this.exitVillage())

    // Movement buttons
    document.getElementById('swim-north-btn').addEventListener('click',
      () => this.swimDirection('north'))
    document.getElementById('swim-west-btn').addEventListener('click',
      () => this.swimDirection('west'))
    document.getElementById('swim-east-btn').addEventListener('click',
      () => this.swimDirection('east'))
    document.getElementById('swim-south-btn').addEventListener('click',
      () => this.swimDirection('south'))
    document.getElementById('return-village-btn').addEventListener('click',
      () => this.returnToVillage())

    // Combat buttons
    document.getElementById('attack-btn').addEventListener('click',
      () => this.attack())
    document.getElementById('bubble-blast-btn').addEventListener('click',
      () => this.useSkill('bubble'))
    document.getElementById('gravel-grenade-btn').addEventListener('click',
      () => this.useSkill('gravel'))
    document.getElementById('happy-balloon-btn').addEventListener('click',
      () => this.useSkill('party'))
    document.getElementById('swim-away-btn').addEventListener('click',
      () => this.runAway())
  }

  // Start character creation (called from HTML)
  startCharacterCreation () {
    this.ui.startNewGame()
  }

  // NPC interaction (called from HTML)
  talkToNPC (npcId) {
    this.ui.talkToNPC(npcId)
  }

  // Village exit (called from HTML)
  exitVillage () {
    this.ui.leaveVillage()
  }

  // Movement methods (called from HTML)
  swimDirection (direction) {
    this.ui.movePlayer(direction)
  }

  returnToVillage () {
    this.ui.returnToVillage()
  }

  // Combat methods (called from HTML)
  attack () {
    this.ui.playerAttack()
  }

  useSkill (skillType) {
    this.ui.playerCastSpell(skillType)
  }

  runAway () {
    this.ui.playerRunAway()
  }

  // Reset game to initial state
  /**
   * Resets all game modules to initial state and starts fresh game session
   * Clears all player progress, world state, and combat data for new playthrough
   */
  newGame () {
    // Reset all modules
    this.player.reset()
    this.world.reset()
    this.combat.reset()
    this.ui.showStartScreen()
  }

  // Get game version info
  getVersion () {
    return {
      version: GameConfig.GAME.VERSION,
      website: GameConfig.GAME.WEBSITE
    }
  }
}

// Initialize game after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BettaRPG() // eslint-disable-line no-new
})
