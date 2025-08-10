/**
 * Core Game Module
 * 
 * Main game controller that coordinates all other modules and handles
 * high-level game operations. Acts as the central hub for module 
 * communication and provides the public API for HTML interactions.
 */
export class BettaRPG {
    constructor() {
        // Initialize modules in correct dependency order
        this.player = new Player();
        this.audio = new AudioManager();
        this.npcs = new NPCManager();
        this.combat = new CombatManager(this.player, this.audio);
        this.world = new WorldManager(this.player, this.audio, this.combat, this.npcs);
        this.combat.setWorldManager(this.world); // Set world reference after creation
        this.ui = new UIManager(this.player, this.audio, this.combat, this.world);
        this.ui.setCoreManager(this); // Set core reference for version info
        this.combat.setUIManager(this.ui); // Set UI reference for death handling
        
    }
    
    
    
    // Start character creation (called from HTML)
    startCharacterCreation() {
        this.ui.startNewGame();
    }
    
    // NPC interaction (called from HTML)
    talkToNPC(npcId) {
        this.ui.talkToNPC(npcId);
    }
    
    // Village exit (called from HTML)
    exitVillage() {
        this.ui.leaveVillage();
    }
    
    // Movement methods (called from HTML)
    swimDirection(direction) {
        this.ui.movePlayer(direction);
    }
    
    returnToVillage() {
        this.ui.returnToVillage();
    }
    
    // Combat methods (called from HTML)
    attack() {
        this.ui.playerAttack();
    }
    
    useSkill(skillType) {
        this.ui.playerCastSpell(skillType);
    }
    
    runAway() {
        this.ui.playerRunAway();
    }
    
    // Reset game to initial state
    newGame() {
        // Reset all modules
        this.player.reset();
        this.world.reset();
        this.combat.reset();
        this.ui.showStartScreen();
    }
    
    // Get game version info
    getVersion() {
        return {
            version: GameConfig.GAME.VERSION,
            website: GameConfig.GAME.WEBSITE
        };
    }
}