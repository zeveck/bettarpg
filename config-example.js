/**
 * Game Configuration Module
 * 
 * Centralized configuration management for Betta Fish RPG. Contains all game
 * constants, balance settings, UI configurations, and feature flags.
 * Provides type-safe access to configuration values and enables easy
 * balance tweaking without hunting through multiple files.
 */
export class GameConfig {
    constructor() {
        // Allow runtime configuration overrides for testing/balancing
        this.overrides = new Map();
    }
    
    // === PLAYER PROGRESSION ===
    static PLAYER = {
        STARTING_STATS: {
            level: 1,
            hp: 20,
            maxHp: 20,
            mp: 10,
            maxMp: 10,
            exp: 0,
            bettaBites: 0
        },
        
        PROGRESSION: {
            EXP_BASE: 100,          // Base EXP needed for level 2
            EXP_MULTIPLIER: 1.5,    // EXP scaling per level (100, 150, 225, etc.)
            HP_GAIN_PER_LEVEL: 5,   // HP increase on level up
            MP_GAIN_PER_LEVEL: 2,   // MP increase on level up
            MAX_LEVEL: 10           // Level cap
        },
        
        ARMOR_SYSTEM: {
            LEVELS: {
                1: { sprite: 'player_betta.png', reduction: 0, name: 'No Armor' },
                3: { sprite: 'player_betta_with_helmet.png', reduction: 1, name: 'Helmet' },
                5: { sprite: 'player_betta_with_almost_armor.png', reduction: 2, name: 'Advanced Armor' },
                7: { sprite: 'player_betta_full_metal.png', reduction: 3, name: 'Full Metal Armor' }
            },
            SUBMARINE: {
                sprite: 'dunkleosteus_sub.png',
                invulnerable: true,
                name: 'Ancient Submarine'
            }
        }
    };
    
    // === COMBAT SYSTEM ===
    static COMBAT = {
        PLAYER_DAMAGE: {
            BASE_MIN: 3,
            BASE_MAX: 8,
            LEVEL_BONUS: 1,         // +1 damage per level
            CRIT_CHANCE: 0.1,       // 10% critical hit chance
            CRIT_MULTIPLIER: 1.5    // 1.5x damage on crit
        },
        
        SPELLS: {
            BUBBLE_BLAST: {
                name: 'Bubble Blast',
                mpCost: 3,
                damageMin: 5,
                damageMax: 12,
                unlockLevel: 1,
                sound: 'bubble'
            },
            GRAVEL_GRENADE: {
                name: 'Gravel Grenade', 
                mpCost: 5,
                damageMin: 8,
                damageMax: 15,
                unlockLevel: 5,
                sound: 'gravel'
            }
        },
        
        ENEMY_SCALING: {
            HP_BASE_MULTIPLIER: 1.0,
            HP_LEVEL_MULTIPLIER: 0.5,      // HP = base * (1.0 + level * 0.5)
            DAMAGE_BASE_MULTIPLIER: 1.0,
            DAMAGE_LEVEL_MULTIPLIER: 0.3,  // Damage = base * (1.0 + level * 0.3)
            EXP_LEVEL_MULTIPLIER: 1.5,     // EXP reward scales with enemy level
            BETTA_BITES_LEVEL_BONUS: 2     // +2 betta bites per enemy level
        },
        
        ESCAPE_SYSTEM: {
            ALWAYS_SUCCESS_UNDER_LEVEL: 5,  // Can always escape from enemies < level 5
            IMPOSSIBLE_AT_LEVEL: 5,         // Cannot escape from enemies >= level 5
            BASE_SUCCESS_RATE: 0.7          // 70% base escape chance (unused currently)
        }
    };
    
    // === ENEMY DEFINITIONS ===
    static ENEMIES = {
        AGGRESSIVE_GUPPY: {
            name: 'Aggressive Guppy',
            baseHp: 8,
            baseDamage: 2,
            baseExp: 15,
            sprite: 'aggressive_guppy.png',
            attacks: [
                'The Aggressive Guppy darts forward with surprising speed!',
                'The Aggressive Guppy attempts to nip at your fins!',
                'The guppy swims in an erratic pattern, then strikes!'
            ]
        },
        
        TERRITORIAL_ANGELFISH: {
            name: 'Territorial Angelfish',
            baseHp: 12,
            baseDamage: 4,
            baseExp: 25,
            sprite: 'territorial-angelfish.png',
            attacks: [
                'The Territorial Angelfish spreads its fins menacingly!',
                'The angelfish defends its territory with a fierce attack!',
                'The angelfish glides forward with elegant aggression!'
            ]
        },
        
        SNEAKY_CATFISH: {
            name: 'Sneaky Catfish',
            baseHp: 15,
            baseDamage: 6,
            baseExp: 35,
            sprite: 'sneaky_catfish.png',
            attacks: [
                'The Sneaky Catfish strikes from the shadows!',
                'The catfish uses its whiskers to sense your movement, then attacks!',
                'The catfish lurks near the bottom, then lunges upward!'
            ]
        },
        
        FIERCE_CICHLID: {
            name: 'Fierce Cichlid',
            baseHp: 18,
            baseDamage: 8,
            baseExp: 45,
            sprite: 'fierce_cichlid.png',
            attacks: [
                'The Fierce Cichlid charges with incredible force!',
                'The cichlid displays bright colors before attacking!',
                'The fierce fish uses its powerful jaws in a devastating bite!'
            ]
        },
        
        PREHISTORIC_GAR: {
            name: 'Prehistoric Gar',
            baseHp: 99,
            baseDamage: 22,
            baseExp: 200,
            sprite: 'prehistoric_gar.png',
            isBoss: true,
            special: {
                roarTurns: [1, 4, 7],  // Turns when Gar roars instead of attacking
                roarSound: 'roar',
                defeatSound: 'victory'
            },
            attacks: [
                'The massive Prehistoric Gar opens its ancient jaws!',
                'The Gar\'s prehistoric fury is unleashed!',
                'The ancient predator strikes with primordial power!'
            ]
        }
    };
    
    // === WORLD GENERATION ===
    static WORLD = {
        MAP_SIZE: 30,
        VILLAGE_CENTER: { x: 15, y: 15 },
        
        ENCOUNTER_RATES: {
            COMBAT: 0.30,      // 30% chance
            TREASURE: 0.30,    // 30% chance  
            PEACEFUL: 0.30,    // 30% chance
            MYSTERY: 0.10      // 10% chance
        },
        
        TREASURE_REWARDS: {
            MIN_BETTA_BITES: 1,
            MAX_BETTA_BITES: 3,
            DISCOVERY_MESSAGES: [
                'You discover some floating food pellets!',
                'A cache of Betta Bites hidden in the rice stalks!',
                'You find some nutritious algae worth collecting!'
            ]
        },
        
        PEACEFUL_MESSAGES: [
            'You find a peaceful stretch of water between the rice stalks.',
            'The water here is calm and refreshing.',
            'Small minnows swim peacefully nearby.',
            'You rest briefly in the gentle current.',
            'The rice stalks sway gently overhead.'
        ],
        
        DANGER_ZONES: {
            SAFE_RADIUS: 17,        // Distance from village center
            MEDIUM_RADIUS: 25,      // Medium danger zone
            EXTREME_RADIUS: 30,     // Edge zones
            LEVEL_SCALING: {
                SAFE: { min: 1, max: 2 },
                MEDIUM: { min: 2, max: 4 },
                DANGEROUS: { min: 3, max: 5 },
                EXTREME: { min: 10, max: 10 }  // Always level 10
            }
        }
    };
    
    // === ECONOMY SYSTEM ===
    static ECONOMY = {
        SHOP_ITEMS: {
            SUBMARINE: {
                id: 'submarine',
                name: 'Ancient Dunkleosteus Submarine',
                cost: 100,
                description: 'An ancient vessel that transforms you into a legendary sea creature! Provides complete protection from damage.',
                effect: 'submarine_transformation',
                icon: '🚢'
            },
            
            KELP_SNACK: {
                id: 'kelp_snack',
                name: 'Kelp Snack',
                cost: 3,
                description: 'Restores full HP. Crunchy and nutritious!',
                effect: 'restore_hp',
                icon: '🌿'
            },
            
            BUBBLE_WATER: {
                id: 'bubble_water',
                name: 'Bubble Water',
                cost: 2,
                description: 'Restores full MP. Fizzy and refreshing!',
                effect: 'restore_mp',
                icon: '💧'
            }
        },
        
        SERVICES: {
            INN_REST: {
                cost: 5,
                description: 'Rest in soft kelp beds - fully restores HP and MP',
                effect: 'full_restore'
            }
        },
        
        INCOME_SOURCES: {
            COMBAT_BASE: { min: 1, max: 5 },
            COMBAT_LEVEL_BONUS: 1,  // Additional betta bites per enemy level
            TREASURE_BASE: { min: 1, max: 3 },
            CHEAT_AMOUNT: 100       // $ key cheat
        }
    };
    
    // === NPC SYSTEM ===
    static NPCS = {
        ELDER: {
            id: 'elder',
            name: 'Elder Finn',
            portrait: null, // Could add portrait images later
            personality: 'wise',
            dialogues: [
                'Welcome, young one. I sense great potential in you.',
                'There have been strange happenings lately... fish have been disappearing from the outer paddies.',
                'The rumors speak of dark shadows that come when the rice stalks sway. Perhaps you could investigate?',
                'Be careful out there, little betta. The paddies hold many dangers.'
            ]
        },
        
        MERCHANT: {
            id: 'merchant',
            name: 'Shopkeeper Coral',
            personality: 'merchant',
            isShop: true,
            dialogues: [
                'Welcome to my shop! Though I\'m afraid business has been slow lately.',
                'With all these disappearances, fewer fish dare to venture between the rice stalks.',
                'I\'ve heard whispers of something lurking in the deeper paddies...',
                'I do have one special item - an ancient Dunkleosteus submarine for 100 Betta Bites! Would you like to see my wares?'
            ]
        }
        // ... other NPCs would follow same pattern
    };
    
    // === UI CONFIGURATION ===
    static UI = {
        SCREENS: {
            TITLE: 'title-screen',
            CHARACTER_CREATION: 'character-creation',
            VILLAGE: 'village',
            WORLD_MAP: 'world-map',
            COMBAT: 'combat',
            DIALOGUE: 'dialogue'
        },
        
        COLORS: {
            RED: { filter: 'hue-rotate(0deg) saturate(1.2)', name: 'Red' },
            BLUE: { filter: 'hue-rotate(180deg) saturate(1.3)', name: 'Blue' },
            PURPLE: { filter: 'hue-rotate(270deg) saturate(1.8)', name: 'Purple' },
            GREEN: { filter: 'hue-rotate(130deg) saturate(1.6)', name: 'Green' },
            GOLD: { filter: 'hue-rotate(50deg) saturate(2) brightness(1.2)', name: 'Gold' }
        },
        
        KEYBOARD_SHORTCUTS: {
            VILLAGE: {
                'e': 'elder',
                'f': 'merchant', 
                'g': 'guard',
                'b': 'bubble',
                'i': 'innkeeper',
                'x': 'exit_village'
            },
            COMBAT: {
                'a': 'attack',
                'b': 'bubble_blast',
                'g': 'gravel_grenade',
                's': 'swim_away'
            },
            WORLD: {
                'ArrowUp': 'north',
                'ArrowDown': 'south', 
                'ArrowLeft': 'west',
                'ArrowRight': 'east',
                'Home': 'return_village'
            },
            CHEATS: {
                '$': 'add_betta_bites',
                '%': 'level_up'
            }
        },
        
        ANIMATIONS: {
            DAMAGE_SHAKE_DURATION: 500,  // milliseconds
            DEATH_FLIP_DELAY: 1000,
            COMBAT_DELAY: 1500,
            FANFARE_DELAY: 800
        }
    };
    
    // === AUDIO CONFIGURATION ===
    static AUDIO = {
        SOUNDS: {
            ATTACK: { type: 'sweep', startFreq: 200, endFreq: 100, duration: 0.1 },
            MAGIC: { type: 'sweep', startFreq: 400, endFreq: 800, duration: 0.3 },
            BUBBLE: { type: 'complex', pattern: [150, 250, 180, 300, 200], duration: 0.5 },
            GRAVEL: { type: 'harsh', baseFreq: 80, duration: 0.3, waveType: 'sawtooth' },
            VICTORY: { type: 'chord', notes: [262, 330, 392], duration: 0.15 },
            LEVELUP: { type: 'scale', notes: [262, 294, 330, 349, 392, 440, 494, 523], duration: 0.08 },
            FANFARE: { type: 'melody', notes: [262, 330, 392, 523, 659, 523], duration: 0.12 },
            COMBATSTART: { type: 'dramatic', freq: 98, repeat: 2, duration: 0.25 },
            WOUND: { type: 'sweep', startFreq: 150, endFreq: 80, duration: 0.15 },
            TREASURE: { type: 'cheerful', notes: [392, 523], duration: 0.15 },
            ROAR: { type: 'complex', baseFreq: 60, duration: 1.5, waveType: 'sawtooth' }
        },
        
        SETTINGS: {
            MASTER_VOLUME: 0.3,
            SFX_VOLUME: 1.0,
            MUSIC_VOLUME: 0.8,
            ENABLE_AUDIO: true,
            GRACEFUL_FALLBACK: true
        }
    };
    
    // === FEATURE FLAGS ===
    static FEATURES = {
        DEVELOPMENT: {
            ENABLE_CHEATS: true,
            DEBUG_LOGGING: false,
            SKIP_INTRO: false
        },
        
        GAMEPLAY: {
            ENABLE_CRITICALS: false,        // Future feature
            ENABLE_EQUIPMENT: false,        // Future feature  
            ENABLE_MULTIPLAYER: false,      // Future feature
            ENABLE_ACHIEVEMENTS: false      // Future feature
        },
        
        UI_FEATURES: {
            SHOW_DAMAGE_NUMBERS: false,     // Future feature
            ENABLE_TOOLTIPS: false,         // Future feature
            DARK_MODE: false                // Future feature
        }
    };
    
    // === RUNTIME CONFIGURATION METHODS ===
    
    // Get configuration value with optional override support
    static get(path, defaultValue = null) {
        const keys = path.split('.');
        let current = GameConfig;
        
        for (const key of keys) {
            if (current[key] === undefined) {
                return defaultValue;
            }
            current = current[key];
        }
        
        return current;
    }
    
    // Override configuration for testing/balancing
    static override(path, value) {
        console.log(`Config override: ${path} = ${JSON.stringify(value)}`);
        // Implementation would store overrides and apply them in get()
    }
    
    // Validate configuration integrity (for development)
    static validate() {
        const errors = [];
        
        // Validate enemy definitions
        for (const [key, enemy] of Object.entries(GameConfig.ENEMIES)) {
            if (!enemy.name || !enemy.sprite) {
                errors.push(`Enemy ${key} missing required fields`);
            }
        }
        
        // Validate shop items have valid costs
        for (const [key, item] of Object.entries(GameConfig.ECONOMY.SHOP_ITEMS)) {
            if (!item.cost || item.cost <= 0) {
                errors.push(`Shop item ${key} has invalid cost`);
            }
        }
        
        if (errors.length > 0) {
            console.warn('Configuration validation errors:', errors);
        }
        
        return errors.length === 0;
    }
    
    // Export configuration for external tools (balance spreadsheets, etc.)
    static export() {
        return {
            version: '0.4',
            timestamp: new Date().toISOString(),
            config: {
                player: GameConfig.PLAYER,
                combat: GameConfig.COMBAT,
                enemies: GameConfig.ENEMIES,
                world: GameConfig.WORLD,
                economy: GameConfig.ECONOMY
            }
        };
    }
}