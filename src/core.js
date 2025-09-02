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
        
        // Pre-render world background for smooth user experience
        this.initializeAssets();
    }
    
    // Initialize heavy assets in background during game startup
    async initializeAssets() {
        try {
            // Pre-load all background images
            this.preloadBackgroundImages();
            // Pre-render world background
            await this.ui.preRenderWorldBackground();
        } catch (error) {
            // Silent fallback - assets will load on-demand
        }
    }
    
    // Pre-load all background images to avoid first-load delays
    preloadBackgroundImages() {
        const backgroundImages = [
            'graphics/map/water-tile-dark.png',      // Village background
            'graphics/map/water-tile2.png',         // Light water (world/combat)
            'graphics/map/water-tile-darkish.png'   // Medium water (world/combat)
        ];
        
        backgroundImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
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