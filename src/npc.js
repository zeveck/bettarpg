import { GameConfig, GameStrings, StringFormatter } from './config.js';

/**
 * NPC Management Module
 * 
 * Handles all Non-Player Character data, dialogue trees, and interaction logic.
 * Manages village NPCs, their conversations, shop services, inn services, and
 * dialogue state progression. Provides clean interfaces for character interaction
 * without exposing internal NPC data structures.
 */
export class NPCManager {
    constructor() {
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
        };
        
        // Dialogue state tracking
        this.currentNPC = null;
        this.currentDialogueIndex = 0;
    }
    
    // Helper method to process dialogue with templates
    processDialogue(dialogue, npc) {
        if (npc.isShop) {
            // For shop NPCs, use submarine cost for merchant dialogue templates
            return StringFormatter.format(dialogue, { cost: GameConfig.SHOP.SUBMARINE.cost });
        } else if (npc.isInn) {
            // For inn NPCs, use rest cost for inn dialogue templates
            return StringFormatter.format(dialogue, { cost: GameConfig.SHOP.INN_REST.cost });
        }
        // Return as-is for NPCs that don't use cost templates
        return dialogue;
    }

    // Core NPC interaction methods
    talkToNPC(npcId) {
        const npc = this.npcs[npcId];
        if (!npc) return { success: false, message: "NPC not found!" };
        
        this.currentNPC = npcId;
        this.currentDialogueIndex = 0;
        
        const rawDialogue = npc.dialogues[this.currentDialogueIndex];
        const processedDialogue = this.processDialogue(rawDialogue, npc);
        
        return {
            success: true,
            npc: npc,
            dialogue: processedDialogue,
            isShop: npc.isShop || false,
            isInn: npc.isInn || false,
            hasMoreDialogue: this.currentDialogueIndex < npc.dialogues.length - 1
        };
    }
    
    nextDialogue() {
        if (!this.currentNPC) return { success: false };
        
        const npc = this.npcs[this.currentNPC];
        this.currentDialogueIndex++;
        
        if (this.currentDialogueIndex >= npc.dialogues.length) {
            // Reached end of dialogue
            return {
                success: true,
                finished: true,
                isShop: npc.isShop || false,
                isInn: npc.isInn || false
            };
        }
        
        const rawDialogue = npc.dialogues[this.currentDialogueIndex];
        const processedDialogue = this.processDialogue(rawDialogue, npc);
        
        return {
            success: true,
            npc: npc,
            dialogue: processedDialogue,
            isShop: npc.isShop || false,
            isInn: npc.isInn || false,
            hasMoreDialogue: this.currentDialogueIndex < npc.dialogues.length - 1
        };
    }
    
    endDialogue() {
        this.currentNPC = null;
        this.currentDialogueIndex = 0;
        return { success: true };
    }
    
    // State query methods
    getCurrentDialogueState() {
        if (!this.currentNPC) return null;
        
        const npc = this.npcs[this.currentNPC];
        return {
            npcId: this.currentNPC,
            npc: npc,
            dialogueIndex: this.currentDialogueIndex,
            isShop: npc.isShop || false,
            isInn: npc.isInn || false,
            hasMoreDialogue: this.currentDialogueIndex < npc.dialogues.length - 1
        };
    }
    
    // Reset method for game state management
    reset() {
        this.currentNPC = null;
        this.currentDialogueIndex = 0;
    }
}