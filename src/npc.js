import { GameConfig, GameStrings, StringFormatter } from './config.js'

/**
 * NPC Management Module
 *
 * Handles all Non-Player Character data, dialogue trees, and interaction logic.
 * Manages village NPCs, their conversations, shop services, inn services, and
 * dialogue state progression. Provides clean interfaces for character interaction
 * without exposing internal NPC data structures.
 */
export class NPCManager {
  constructor () {
    // NPC Database with dialogue trees and service flags
    this.npcs = {
      elder: {
        name: GameStrings.NPCS.ELDER_FINN.NAME,
        dialogues: GameStrings.NPCS.ELDER_FINN.DIALOGUES
      },
      merchant: {
        name: GameStrings.NPCS.SHOPKEEPER_CORAL.NAME,
        dialogues: GameStrings.NPCS.SHOPKEEPER_CORAL.DIALOGUES,
        isShop: true
      },
      guard: {
        name: GameStrings.NPCS.GUARD_CAPTAIN_REEF.NAME,
        dialogues: GameStrings.NPCS.GUARD_CAPTAIN_REEF.DIALOGUES
      },
      bubble: {
        name: GameStrings.NPCS.BUBBLE_THE_BRAVE.NAME,
        dialogues: GameStrings.NPCS.BUBBLE_THE_BRAVE.DIALOGUES
      },
      innkeeper: {
        name: GameStrings.NPCS.INNKEEPER_SEAWEED.NAME,
        dialogues: GameStrings.NPCS.INNKEEPER_SEAWEED.DIALOGUES,
        isInn: true
      }
    }

    // Dialogue state tracking
    this.currentNPC = null
    this.currentDialogueIndex = 0
  }


  // Core NPC interaction methods
  /**
   * Initiates dialogue with specified NPC and returns initial conversation state
   * Sets up dialogue tracking and processes first dialogue with template substitution
   * @param {string} npcId - Unique identifier for NPC (elder, merchant, guard, etc.)
   * @returns {Object} Dialogue initiation result with NPC data and conversation state
   */
  talkToNPC (npcId) {
    const npc = this.npcs[npcId]
    if (!npc) return { success: false, message: 'NPC not found!' }

    this.currentNPC = npcId
    this.currentDialogueIndex = 0

    const rawDialogue = npc.dialogues[this.currentDialogueIndex]
    // Process dialogue with cost substitution if needed
    let processedDialogue = rawDialogue
    if (npc.isShop) {
      // Shop NPC (Shopkeeper Coral) mentions submarine cost in dialogue
      processedDialogue = StringFormatter.format(rawDialogue, { cost: GameConfig.SHOP.SUBMARINE.cost })
    } else if (npc.isInn) {
      // Inn NPC mentions rest cost in dialogue
      processedDialogue = StringFormatter.format(rawDialogue, { cost: GameConfig.SHOP.INN_REST.cost })
    }

    return {
      success: true,
      npc,
      dialogue: processedDialogue,
      isShop: npc.isShop || false,
      isInn: npc.isInn || false,
      hasMoreDialogue: this.currentDialogueIndex < npc.dialogues.length - 1
    }
  }

  /**
   * Advances to next dialogue line for current NPC conversation
   * Handles dialogue progression, template processing, and conversation completion
   * @returns {Object} Dialogue progression result with next dialogue or completion state
   */
  nextDialogue () {
    if (!this.currentNPC) return { success: false }

    const npc = this.npcs[this.currentNPC]
    this.currentDialogueIndex++

    if (this.currentDialogueIndex >= npc.dialogues.length) {
      // Reached end of dialogue
      return {
        success: true,
        finished: true,
        isShop: npc.isShop || false,
        isInn: npc.isInn || false
      }
    }

    const rawDialogue = npc.dialogues[this.currentDialogueIndex]
    // Process dialogue with cost substitution if needed
    let processedDialogue = rawDialogue
    if (npc.isShop) {
      // Shop NPC (Shopkeeper Coral) mentions submarine cost in dialogue
      processedDialogue = StringFormatter.format(rawDialogue, { cost: GameConfig.SHOP.SUBMARINE.cost })
    } else if (npc.isInn) {
      // Inn NPC mentions rest cost in dialogue
      processedDialogue = StringFormatter.format(rawDialogue, { cost: GameConfig.SHOP.INN_REST.cost })
    }

    return {
      success: true,
      npc,
      dialogue: processedDialogue,
      isShop: npc.isShop || false,
      isInn: npc.isInn || false,
      hasMoreDialogue: this.currentDialogueIndex < npc.dialogues.length - 1
    }
  }

  /**
   * Terminates current dialogue conversation and resets NPC manager state
   * Clears dialogue tracking and returns NPC manager to idle state
   * @returns {Object} Success confirmation for dialogue termination
   */
  endDialogue () {
    this.currentNPC = null
    this.currentDialogueIndex = 0
    return { success: true }
  }

  // State query methods
  /**
   * Retrieves current dialogue state for UI display and conversation management
   * Provides comprehensive conversation state including progress and NPC type flags
   * @returns {Object|null} Current dialogue state or null if no active conversation
   */
  getCurrentDialogueState () {
    if (!this.currentNPC) return null

    const npc = this.npcs[this.currentNPC]
    return {
      npcId: this.currentNPC,
      npc,
      dialogueIndex: this.currentDialogueIndex,
      isShop: npc.isShop || false,
      isInn: npc.isInn || false,
      hasMoreDialogue: this.currentDialogueIndex < npc.dialogues.length - 1
    }
  }

  // Reset method for game state management
  reset () {
    this.currentNPC = null
    this.currentDialogueIndex = 0
  }
}
