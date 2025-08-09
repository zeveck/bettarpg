/**
 * World Management Module
 * 
 * Handles world map generation, player movement, and encounter systems.
 * Manages village state, world exploration, treasure discovery, and
 * coordinates encounter generation based on player location.
 */
export class WorldManager {
    constructor(player, audioManager, combatManager, npcManager) {
        this.player = player;
        this.audio = audioManager;
        this.combat = combatManager;
        this.npcs = npcManager;
        
        // World state
        this.currentX = GameConfig.WORLD.VILLAGE_CENTER.x; // Starting position - village center
        this.currentY = GameConfig.WORLD.VILLAGE_CENTER.y;
        this.inVillage = true;
        this.worldMap = this.generateWorldMap();
        this.justExitedCombat = false; // Flag to skip encounter on first move after combat
        
        // World configuration from GameConfig
        this.WORLD_SIZE = GameConfig.WORLD.MAP_SIZE;
        this.VILLAGE_CENTER = GameConfig.WORLD.VILLAGE_CENTER;
        this.ENCOUNTER_RATES = GameConfig.WORLD.ENCOUNTER_RATES;
    }
    
    // Generate procedural world map
    generateWorldMap() {
        const map = [];
        
        for (let y = 0; y < this.WORLD_SIZE; y++) {
            map[y] = [];
            for (let x = 0; x < this.WORLD_SIZE; x++) {
                // Village center
                if (x === this.VILLAGE_CENTER.x && y === this.VILLAGE_CENTER.y) {
                    map[y][x] = {
                        type: 'village',
                        sprite: 'graphics/map/bettahome.png'
                    };
                }
                // Village area (just center tile)
                else if (x === this.VILLAGE_CENTER.x && y === this.VILLAGE_CENTER.y) {
                    map[y][x] = {
                        type: 'village_area',
                        sprite: 'graphics/map/water-tile.png'
                    };
                }
                // Water tiles with varying depths
                else {
                    const distance = Math.sqrt((x - this.VILLAGE_CENTER.x) * (x - this.VILLAGE_CENTER.x) + (y - this.VILLAGE_CENTER.y) * (y - this.VILLAGE_CENTER.y));
                    let tileType, sprite;
                    
                    if (distance < 5) {
                        tileType = 'shallow';
                        sprite = 'graphics/map/water-tile.png';
                    } else if (distance < 10) {
                        tileType = 'medium';  
                        sprite = 'graphics/map/water-tile2.png';
                    } else {
                        tileType = 'deep';
                        sprite = 'graphics/map/water-tile-darkish.png';
                    }
                    
                    map[y][x] = {
                        type: tileType,
                        sprite: sprite
                    };
                    
                    // Add rice paddy tufts randomly in shallow areas
                    if (tileType === 'shallow' && Math.random() < 0.15) {
                        map[y][x].hasRiceTuft = true;
                        map[y][x].sprite = 'graphics/map/rice_paddy_tuft.png';
                    }
                }
            }
        }
        
        return map;
    }
    
    // Movement methods
    canMoveTo(x, y) {
        return x >= 0 && x < this.WORLD_SIZE && y >= 0 && y < this.WORLD_SIZE;
    }
    
    
    
    movePlayer(direction) {
        let newX = this.currentX;
        let newY = this.currentY;
        
        switch (direction) {
            case 'north': newY--; break;
            case 'south': newY++; break;
            case 'east': newX++; break;
            case 'west': newX--; break;
        }
        
        // Clamp movement to world boundaries instead of blocking
        // Allow movement to the edge zone where Gar spawns (coordinates 1-28 inclusive)
        newX = Math.max(1, Math.min(this.WORLD_SIZE - 2, newX));
        newY = Math.max(1, Math.min(this.WORLD_SIZE - 2, newY));
        
        // Move player
        this.currentX = newX;
        this.currentY = newY;
        
        // Check if entering/leaving village (center tile only)
        const wasInVillage = this.inVillage;
        this.inVillage = (newX === this.VILLAGE_CENTER.x && newY === this.VILLAGE_CENTER.y);
        
        // Village entry message
        if (!wasInVillage && this.inVillage) {
            return { 
                success: true, 
                message: GameStrings.EXPLORATION.VILLAGE_MESSAGES.RETURN_TO_SAFETY,
                location: this.getCurrentLocation()
            };
        }
        
        // Edge exploration congratulations are shown via max level combat victory
        
        // Encounter check (only outside village) - always generates encounter
        if (!this.inVillage) {
            const encounter = this.checkForEncounter();
            return {
                success: true,
                encounter: encounter,
                location: this.getCurrentLocation()
            };
        }
        
        return { 
            success: true, 
            location: this.getCurrentLocation()
        };
    }
    
    // Set flag to skip next encounter (called when combat ends)
    setCombatExitFlag() {
        this.justExitedCombat = true;
    }
    
    // Encounter system
    checkForEncounter() {
        // In extreme zone (dark water): guaranteed combat encounters
        const distance = this.getDistanceFromVillage();
        if (distance > GameConfig.WORLD.DANGER_ZONES.DANGEROUS_RADIUS) {
            return this.createCombatEncounter();
        }
        
        // Normal encounter logic for safe areas: uses configured rates
        const encounterChance = Math.random();
        const rates = this.ENCOUNTER_RATES;
        
        if (encounterChance < rates.COMBAT) {
            return this.createCombatEncounter();
        } else if (encounterChance < rates.COMBAT + rates.TREASURE) {
            return this.createTreasureEncounter();
        } else if (encounterChance < rates.COMBAT + rates.TREASURE + rates.PEACEFUL) {
            return this.createPeacefulEncounter();
        } else {
            return this.createMysteryEncounter();
        }
    }
    
    createCombatEncounter() {
        const enemy = this.combat.startRandomEncounter(this.currentX, this.currentY);
        
        // Add extreme zone warning message if in dark water
        let message = null;
        const distance = this.getDistanceFromVillage();
        if (distance > GameConfig.WORLD.DANGER_ZONES.DANGEROUS_RADIUS) {
            message = GameStrings.EXPLORATION.DANGER_WARNINGS.EDGE_ZONE;
        }
        
        return {
            type: 'combat',
            enemy: enemy,
            message: message
        };
    }
    
    createTreasureEncounter() {
        const treasureConfig = GameConfig.ECONOMY.INCOME_SOURCES.TREASURE_BASE;
        const bettaBitesFound = Math.floor(Math.random() * (treasureConfig.max - treasureConfig.min + 1)) + treasureConfig.min;
        this.player.gainBettaBites(bettaBitesFound);
        this.audio.playSound('found');
        
        // Use treasure discovery texts from configuration
        const treasureMessages = GameStrings.EXPLORATION.ENCOUNTERS.TREASURE;
        const randomMessage = treasureMessages[Math.floor(Math.random() * treasureMessages.length)];
        const findText = StringFormatter.format(randomMessage, { amount: bettaBitesFound });
        
        return {
            type: 'treasure',
            amount: bettaBitesFound,
            message: findText
        };
    }
    
    createPeacefulEncounter() {
        const peacefulMessages = GameStrings.EXPLORATION.ENCOUNTERS.PEACEFUL;
        const randomMessage = peacefulMessages[Math.floor(Math.random() * peacefulMessages.length)];
        
        return {
            type: 'peaceful',
            message: randomMessage
        };
    }
    
    createMysteryEncounter() {
        const mysteryMessages = GameStrings.EXPLORATION.ENCOUNTERS.MYSTERY;
        const randomMessage = mysteryMessages[Math.floor(Math.random() * mysteryMessages.length)];
        
        return {
            type: 'mystery',
            message: randomMessage
        };
    }
    
    
    // Location information
    getCurrentLocation() {
        // Safety check for initialization
        if (!this.worldMap || !this.worldMap[this.currentY] || !this.worldMap[this.currentY][this.currentX]) {
            return {
                x: this.currentX,
                y: this.currentY,
                tile: { type: 'village' },
                inVillage: this.inVillage
            };
        }
        
        const tile = this.worldMap[this.currentY][this.currentX];
        return {
            x: this.currentX,
            y: this.currentY,
            tile: tile,
            inVillage: this.inVillage
        };
    }
    
    
    // Village interactions
    enterVillage() {
        if (this.currentX === this.VILLAGE_CENTER.x && this.currentY === this.VILLAGE_CENTER.y) {
            this.inVillage = true;
            return {
                success: true,
                message: GameStrings.EXPLORATION.VILLAGE_MESSAGES.WELCOME_TO_VILLAGE
            };
        }
        return {
            success: false,
            message: GameStrings.EXPLORATION.VILLAGE_MESSAGES.NEED_TO_BE_AT_CENTER
        };
    }
    
    leaveVillage() {
        if (this.inVillage) {
            // Position player south of village when exiting
            // Village is just center tile, so place south of center
            this.currentX = this.VILLAGE_CENTER.x; // Keep X at village center
            this.currentY = this.VILLAGE_CENTER.y + 2; // Move south of village area
            this.inVillage = false;
            return {
                success: true,
                message: GameStrings.EXPLORATION.MOVEMENT.VILLAGE_EXIT
            };
        }
        return {
            success: false,
            message: GameStrings.EXPLORATION.VILLAGE_MESSAGES.ALREADY_OUTSIDE
        };
    }
    
    // Shop interactions (for UI module to use)
    getShopItems() {
        return [
            {
                name: GameStrings.SHOP.ITEMS.SUBMARINE.NAME,
                description: GameStrings.SHOP.ITEMS.SUBMARINE.DESCRIPTION,
                cost: 100,
                id: "submarine"
            },
            {
                name: GameStrings.SHOP.ITEMS.KELP_SNACK.NAME,
                description: GameStrings.SHOP.ITEMS.KELP_SNACK.DESCRIPTION,
                cost: 3,
                id: "kelp_snack"
            },
            {
                name: GameStrings.SHOP.ITEMS.BUBBLE_WATER.NAME,
                description: GameStrings.SHOP.ITEMS.BUBBLE_WATER.DESCRIPTION,
                cost: 2,
                id: "bubble_water"
            }
        ];
    }
    
    buyItem(itemId) {
        const items = this.getShopItems();
        const item = items.find(i => i.id === itemId);
        
        if (!item) {
            return { success: false, message: GameStrings.SHOP.ERRORS.ITEM_NOT_FOUND };
        }
        
        if (!this.player.canAfford(item.cost)) {
            return { success: false, message: GameStrings.SHOP.ERRORS.NOT_ENOUGH_BETTA_BITES };
        }
        
        this.player.spendBettaBites(item.cost);
        
        // Apply item effects
        switch (itemId) {
            case "submarine":
                // Acquire submarine
                return this.player.acquireSubmarine();
                
            case "kelp_snack":
                const hpHealed = this.player.healHP(this.player.getMaxHP());
                const message = StringFormatter.format(GameStrings.SHOP.CONFIRMATIONS.KELP_SNACK, { hpHealed });
                return { 
                    success: true, 
                    message: message
                };
                
            case "bubble_water":
                const mpBefore = this.player.getMP();
                const actualRestore = this.player.healMP(this.player.getMaxMP());
                return { 
                    success: true, 
                    message: StringFormatter.format(GameStrings.SHOP.CONFIRMATIONS.BUBBLE_WATER, { mpRestored: actualRestore })
                };
        }
        
        return { success: false, message: GameStrings.SHOP.ERRORS.UNKNOWN_ITEM_EFFECT };
    }
    
    // Utility methods
    getDistanceFromVillage(x = this.currentX, y = this.currentY) {
        return Math.sqrt((x - this.VILLAGE_CENTER.x) * (x - this.VILLAGE_CENTER.x) + (y - this.VILLAGE_CENTER.y) * (y - this.VILLAGE_CENTER.y));
    }
    
    
    // NPC Interaction Delegation Methods
    talkToNPC(npcId) {
        return this.npcs.talkToNPC(npcId);
    }
    
    nextDialogue() {
        return this.npcs.nextDialogue();
    }
    
    restAtInn() {
        const innCost = GameConfig.ECONOMY.SERVICES.INN_REST.cost;
        
        if (!this.player.canAfford(innCost)) {
            return { 
                success: false, 
                message: StringFormatter.format(GameStrings.SHOP.ERRORS.INSUFFICIENT_FUNDS_FOR_REST, { 
                    cost: innCost 
                }) 
            };
        }
        
        this.player.spendBettaBites(innCost);
        const heals = this.player.fullHeal();
        
        return {
            success: true,
            message: GameStrings.INN.CONFIRMATION
        };
    }
    
    endDialogue() {
        return this.npcs.endDialogue();
    }
    
    getNPCList() {
        return this.npcs.getNPCList();
    }
    
    getCurrentDialogueState() {
        return this.npcs.getCurrentDialogueState();
    }
    
    // Teleport player to village
    teleportToVillage() {
        this.currentX = this.VILLAGE_CENTER.x;
        this.currentY = this.VILLAGE_CENTER.y;
        this.inVillage = true;
        this.justExitedCombat = false;
        return {
            success: true,
            message: GameStrings.EXPLORATION.VILLAGE_MESSAGES.SAFELY_RETURNED
        };
    }
    
    // Reset to initial state
    reset() {
        this.currentX = this.VILLAGE_CENTER.x;
        this.currentY = this.VILLAGE_CENTER.y;
        this.inVillage = true;
        this.justExitedCombat = false;
        this.npcs.reset();
        // Note: worldMap doesn't need reset as it's static
    }
    
    // Getters for UI
    getCurrentX() { return this.currentX; }
    getCurrentY() { return this.currentY; }
    isInVillage() { return this.inVillage; }
    getWorldSize() { return this.WORLD_SIZE; }
    
    // NPC access interfaces (delegated to NPCManager)
    getNPCName(npcId) {
        return this.npcs.getNPCName(npcId);
    }
    
    getNPCIds() {
        return this.npcs.getNPCIds();
    }
}