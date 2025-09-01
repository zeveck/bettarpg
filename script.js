// Betta Fish RPG v0.4 - Generated from modules

// === CONFIG MODULE ===
/**
 * Game Configuration Module
 * 
 * Centralized configuration management for Betta Fish RPG. Contains all game
 * constants, balance settings, UI configurations, strings, and feature flags.
 * Provides type-safe access to configuration values and enables easy
 * balance tweaking without hunting through multiple files.
 */
class GameConfig {
    
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
            EXP_MULTIPLIER: 1.2,    // Multiplier for next level EXP requirement
            HP_GAIN_PER_LEVEL: 5,   // HP increase on level up
            MP_GAIN_PER_LEVEL: 2,   // MP increase on level up
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
                unlockLevel: 4,
                sound: 'gravel'
            },
            HAPPY_BALLOON_TIME: {
                name: 'Happy Balloon Time',
                mpCost: 7,
                damageMin: 0,  // No damage - befriend instead
                damageMax: 0,  // No damage - befriend instead
                unlockLevel: 7,
                sound: 'party'
            }
        },
        
        PLAYER_DAMAGE: {
            baseMin: 3,                  // Minimum base damage
            baseMax: 10,                 // Maximum base damage
        },
        
        ENEMY_SCALING: {
            HP_BASE_MULTIPLIER: 1.0,
            HP_LEVEL_MULTIPLIER: 0.5,      // HP = base * (1.0 + level * 0.5)
            DAMAGE_BASE_MULTIPLIER: 1.0,
            DAMAGE_LEVEL_MULTIPLIER: 0.3,  // Damage = base * (1.0 + level * 0.3)
            EXP_LEVEL_MULTIPLIER: 0.2,
            BETTA_BITES_REWARDS: {
                baseMin: 1,
                baseMax: 5,
                levelBonusMin: 1,
                levelBonusMax: 2
            }
        },
        
        RUN_AWAY: {
            difficultEnemyLevel: 5,       // Enemies at this level+ are harder to escape from
            difficultEscapeChance: 0.1    // 10% chance to escape from difficult enemies
        },
        
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
                'darts forward with surprising speed!',
                'attempts to nip at your fins!',
                'swims in an erratic pattern, then strikes!'
            ]
        },
        
        TERRITORIAL_ANGELFISH: {
            name: 'Territorial Angelfish',
            baseHp: 12,
            baseDamage: 4,
            baseExp: 25,
            sprite: 'territorial-angelfish.png',
            attacks: [
                'spreads its fins menacingly!',
                'defends its territory with a fierce attack!',
                'glides forward with elegant aggression!'
            ]
        },
        
        SNEAKY_CATFISH: {
            name: 'Sneaky Catfish',
            baseHp: 15,
            baseDamage: 4,
            baseExp: 35,
            sprite: 'sneaky_catfish.png',
            attacks: [
                'strikes from the shadows!',
                'uses its whiskers to sense your movement, then attacks!',
                'lurks near the bottom, then lunges upward!'
            ]
        },
        
        FIERCE_CICHLID: {
            name: 'Fierce Cichlid',
            baseHp: 18,
            baseDamage: 6,
            baseExp: 45,
            sprite: 'fierce_cichlid.png',
            attacks: [
                'charges with incredible force!',
                'displays bright colors before attacking!',
                'uses its powerful jaws in a devastating bite!'
            ]
        },
        
        PREHISTORIC_GAR: {
            name: 'Prehistoric Gar',
            baseHp: 25,
            baseDamage: 22,
            baseExp: 200,
            sprite: 'prehistoric_gar.png',
            isBoss: true,
            special: {
                roarTurns: [1, 4, 7],  // Turns when Gar roars instead of attacking
                roarSound: 'roar',
                gargantuanAttack: {
                    turn: 3,
                    name: 'GARGANTUAN GAR',
                    damage: 100,
                    channelMessage: '⚡ The Prehistoric Gar channels ancient power! ⚡',
                    attackMessage: '🐉 GARGANTUAN GAR! 🐉',
                    defenseMessage: 'The ancient submarine armor withstands even the Gargantuan Gar!',
                    damageMessage: 'The GARGANTUAN GAR deals {damage} devastating damage!',
                    visualEffect: 'giant_gar',
                    sound: 'roar',
                    delay: 1000  // Delay before damage in milliseconds
                }
            },
            attacks: [
                'opens its ancient jaws!',
                'unleashes its prehistoric fury!',
                'strikes with primordial power!'
            ]
        }
    };
    
    // === WORLD GENERATION ===
    static WORLD = {
        MAP_SIZE: 21,
        VILLAGE_CENTER: { x: 10, y: 10 },
        
        ENCOUNTER_RATES: {
            COMBAT: 0.30,      // 30% chance
            TREASURE: 0.30,    // 30% chance  
            PEACEFUL: 0.30,    // 30% chance
            MYSTERY: 0.10      // 10% chance
        },
        
        DANGER_ZONES: {
            SAFE_RADIUS: 4,         // Distance from village center - Light blue water
            DANGEROUS_RADIUS: 7,    // Medium danger zone - Medium blue water
            LEVEL_SCALING: {
                SAFE: { min: 1, max: 2 },       // Light blue water
                DANGEROUS: { min: 3, max: 5 },  // Medium blue water  
                EXTREME: { min: 10, max: 10 }   // Dark blue water
            }
        }
    };
    
    // === ECONOMY SYSTEM ===
    static ECONOMY = {
        
        SERVICES: {
            INN_REST: {
                cost: 5,
                effect: 'full_restore'
            }
        },
        
        INCOME_SOURCES: {
            TREASURE_BASE: { min: 1, max: 3 }
        }
    };
    
    // === GAME METADATA ===
    static GAME = {
        VERSION: '0.4.3',
        WEBSITE: 'https://github.com/zeveck/bettarpg'
    };
    
    // === SHOP CONFIGURATION ===
    static SHOP = {
        SUBMARINE: { cost: 100, id: 'submarine' },
        KELP_SNACK: { cost: 3, id: 'kelp_snack' },
        BUBBLE_WATER: { cost: 2, id: 'bubble_water' },
        INN_REST: { cost: 5, id: 'rest' }
    };
    
    // === UI CONFIGURATION ===
    static UI = {
        COLORS: {
            RED: { filter: 'hue-rotate(0deg) saturate(1.2)', name: 'Red' },
            BLUE: { filter: 'hue-rotate(180deg) saturate(1.3)', name: 'Blue' },
            PURPLE: { filter: 'hue-rotate(270deg) saturate(1.8)', name: 'Purple' },
            GREEN: { filter: 'hue-rotate(140deg) saturate(1.2) brightness(0.85)', name: 'Green' },
            ORANGE: { filter: 'hue-rotate(30deg) saturate(1.8) brightness(1.1)', name: 'Orange' }
        }
    };
    
}

// === GAME STRINGS ===
class GameStrings {
    
    // === UI LABELS & BUTTONS ===
    static UI = {
        BUTTONS: {
            START_GAME: "Swim to Village", 
            START_ADVENTURE: "Start Adventure",
            CONTINUE: "Continue...",
            GOODBYE: "Goodbye",
            BROWSE_ITEMS: "Browse Items",
            MAYBE_LATER: "Maybe later",
            ATTACK: "Attack",
            SWIM_AWAY: "Swim Away",
            REST: "Rest ({cost} Betta Bites)",
            REST_WITH_COST: "Rest ({cost} Betta Bites)",
            CLOSE: "Close",
            OK: "OK",
            YES: "Yes",
            NO: "No",
            THANKS: "Thanks!",
            AMAZING: "Amazing!",
            NEW_NAME: "New Name",
            CONTINUE_SWIMMING: "Continue Swimming"
        },
        
        DIALOGUE_OPTIONS: {
            REST_SUFFIX: " - Not enough Betta Bites"
        },
        
        LABELS: {
            NAME_YOUR_BETTA: "Name your betta:",
            CHOOSE_COLOR: "Choose your color:",
            ENTER_NAME: "Enter name",
            ENTER_NAME_AND_CHOOSE_COLOR: "Enter name and choose color",
            HP: "HP",
            MP: "MP", 
            LEVEL: "Level",
            EXP: "EXP",
            BETTA_BITES: "Betta Bites",
            NAME_PREVIEW: "Name:",
            COLOR_PREVIEW: "Color:",
            UNKNOWN_NAME: "???",
            CHOOSE_A_COLOR: "Choose a color"
        },
        
        SCREENS: {
            TITLE: "Betta Fish RPG",
            SUBTITLE: "Adventure awaits in the aquatic realm!",
            CREATE_YOUR_BETTA: "Create Your Betta",
            COMBAT_TITLE: "Combat!",
            VILLAGE_TITLE: "Paddy Village"
        },
        
        COLORS: {
            RED: "Red",
            BLUE: "Blue", 
            PURPLE: "Purple",
            GREEN: "Green",
            ORANGE: "Orange"
        }
    };
    
    // === LOCATIONS & DESCRIPTIONS ===
    static LOCATIONS = {
        VILLAGE: {
            NAME: "Paddy Village",
            DESCRIPTION: "Rice stalks sway gently in the water above, providing shelter for various bettas going about their daily lives.",
            
            BUILDINGS: {
                ELDER_DWELLING: "🏛️ Elder's Dwelling",
                FISH_MART: "🛒 Fish Mart", 
                VILLAGE_GUARD: "⚔️ Village Guard",
                BUBBLES_HOME: "✨ Bubble's Home",
                SWISHY_SOLACE_INN: "🏨 Swishy Solace Inn",
                EXIT_TO_PADDIES: "🗺️ Exit to Rice Paddies (↓)"
            }
        },
        
        WORLD_MAP: {
            NAME: "The Rice Paddies", 
            DESCRIPTION: "You swim through the interconnected rice paddies. Tall stalks create a maze of waterways where danger and adventure lurk.",
            
            MOVEMENT: {
                SWIM_NORTH: "⬆️ Swim North",
                SWIM_SOUTH: "⬇️ Swim South", 
                SWIM_EAST: "➡️ Swim East",
                SWIM_WEST: "⬅️ Swim West",
                RETURN_TO_VILLAGE: "🏠 Return to Village"
            }
        }
    };
    
    // === NPC DIALOGUES ===
    static NPCS = {
        ELDER_FINN: {
            NAME: "Elder Finn",
            DIALOGUES: [
                "Welcome, young one. I sense great potential in you.",
                "There have been strange happenings lately... fish have been disappearing from the outer paddies.", 
                "The rumors speak of dark shadows that come when the rice stalks sway. Perhaps you could investigate?",
                "Be careful out there, little betta. The paddies hold many dangers."
            ]
        },
        
        SHOPKEEPER_CORAL: {
            NAME: "Shopkeeper Coral",
            DIALOGUES: [
                "Welcome to my shop! Though I'm afraid business has been slow lately.",
                "With all these disappearances, fewer fish dare to venture between the rice stalks.",
                "I've heard whispers of something lurking in the deeper paddies...",
                "I do have one special item - an ancient Dunkleosteus submarine for {cost} Betta Bites! Would you like to see my wares?"
            ]
        },
        
        GUARD_CAPTAIN_REEF: {
            NAME: "Guard Captain Reef",
            DIALOGUES: [
                "Halt! State your business, young betta.",
                "I've been keeping watch, but these mysterious abductions have me worried.", 
                "Three of our villagers vanished last week while foraging near the tall rice. No trace, no struggle... just gone.",
                "If you're thinking of investigating, be very careful. Whatever's out there is dangerous."
            ]
        },
        
        BUBBLE_THE_BRAVE: {
            NAME: "Bubble the Brave",
            DIALOGUES: [
                "Hey there! I'm Bubble! I've been wanting to explore the outer paddies forever!",
                "My fins are strong and I know the waterways better than anyone my age!",
                "I dream of swimming up to the big city on the next terrace! They say it's amazing up there!",
                "When you decide to investigate these disappearances... well, I'd love to come with you!"
            ]
        },
        
        INNKEEPER_SEAWEED: {
            NAME: "Innkeeper Seaweed", 
            DIALOGUES: [
                "Welcome to the Swishy Solace Inn! You look tired, young betta.",
                "A good rest in our soft kelp beds will restore your strength.",
                "For just {cost} Betta Bites, you can sleep safely and wake up refreshed!",
                "Would you like to rest? (This will fully restore your HP and MP for {cost} Betta Bites)"
            ]
        }
    };
    
    // === COMBAT MESSAGES ===
    static COMBAT = {
        COMBAT_BEGINS: "Combat begins! {playerName} vs {enemyName}",
        ENEMY_APPEARS: "A wild {enemyName} (Level {level}) appears!",
        ENEMY_DEFEATED: "Defeated {enemyName}!",
        ENEMY_BEFRIENDED: "You befriended {enemyName}!",
        VICTORY_REWARDS: "Victory! You gained {exp} EXP and {bettaBites} Betta Bites!",
        LEVEL_UP: "Level up! Now level {newLevel}!",
        HP_MP_INCREASE: "HP increased by {hpIncrease}! MP increased by {mpIncrease}!",
        ARMOR_HELMET: "You've gained a protective helmet!",
        ARMOR_ADVANCED: "Your armor has been upgraded to advanced protection!",
        ARMOR_PROTECTIVE: "You're now wearing advanced protective armor!",
        ARMOR_FULL_METAL: "You've achieved full metal armor! Maximum protection!",
        GAINED_EXP: "Gained {exp} EXP!",
        GAINED_BETTA_BITES: "Found {amount} Betta Bites!",
        
        NOT_ENOUGH_MP: "Not enough MP to cast {spellName}!",
        SPELL_UNLOCKED_AT_LEVEL: "{spellName} unlocks at level {level}!",
        
        PLAYER_DEFEATED: "You have been defeated!",
        PLAYER_LOST_BETTA_BITES: "You lost {amount} Betta Bites...",
        PLAYER_RECOVERY: "You wake up back in the village, feeling groggy but alive.",
        ESCAPE_SUCCESS: "You managed to escape!",
        ESCAPE_FAILED: "You try to escape, but the enemy is too fast!",
        ESCAPE_BARELY_SUCCESS: "You barely manage to slip away!",
        DEFEAT_RECOVERY: "You wake up back in the village, rescued by other bettas. You feel fully recovered!",
        DEFEAT_RECOVERY_RESCUED: "You wake up back in the village, rescued by other bettas.",
        DEFEAT_RECOVERY_LOSS: "You lost {amount} Betta Bites but feel fully recovered!",
        
        PREHISTORIC_GAR_ROAR: "🦕 The Prehistoric Gar lets out a thunderous roar instead of attacking! 🦕",
        
        ATTACK_DESCRIPTIONS: [
            "strikes with swift fins",
            "lunges forward aggressively", 
            "delivers a powerful tail slap",
            "bites with determination",
            "charges with fierce intensity"
        ],
        
        BUBBLE_DESCRIPTIONS: [
            "unleashes a torrent of magical bubbles",
            "creates a swirling vortex of powerful bubbles",
            "summons a burst of explosive bubbles",
            "channels energy into a devastating bubble storm"
        ],
        
        GRAVEL_DESCRIPTIONS: [
            "hurls a barrage of sharp gravel",
            "creates a devastating stone storm",
            "launches a powerful gravel grenade",
            "summons a whirlwind of crushing rocks"
        ],
        
        BALLOON_DESCRIPTIONS: [
            "throws a magical party with colorful balloons",
            "creates an irresistible celebration",
            "starts a friendship festival",
            "channels pure joy and happiness"
        ],
        
        ENEMY_ATTACK_DEFLECTED: "{enemyName} {attackDescription} but the ancient armor deflects all damage!",
        ENEMY_ATTACK_DAMAGE: "{enemyName} {attackDescription} for {damage} damage!",
        
        MADE_FRIEND: "You made a friend!"
    };
    
    // === WORLD EXPLORATION ===
    static EXPLORATION = {
        MOVEMENT: {
            DIRECTIONS: {
                NORTH: "You swim north through the rice stalks, water becoming murkier.",
                SOUTH: "You swim south where the water runs clearer near the village.",
                EAST: "You swim east toward the morning sun, rice casting long shadows.",
                WEST: "You swim west where the rice grows thickest and oldest."
            },
            
            VILLAGE_EXIT: "You venture into the rice paddies, leaving the safety of Paddy Village behind.",
            VILLAGE_RETURN: "You return to the safety of Paddy Village."
        },
        
        ENCOUNTERS: {
            PEACEFUL: [
                "You find a peaceful stretch of water between the rice stalks.",
                "The water here is calm and refreshing.",
                "You rest briefly in the gentle current.",
                "The rice stalks sway gently overhead."
            ],
            
            TREASURE: [
                "You discover {amount} Betta Bites hidden among the rice roots!",
                "A glint catches your eye - {amount} Betta Bites floating near a rice stalk!",
                "You nose around the mud and find {amount} delicious Betta Bites!",
                "Lucky you! {amount} Betta Bites were tucked behind some algae!"
            ],
            
            MYSTERY: [
                "You sense something mysterious in these waters...",
                "Strange shadows move between the rice stalks.",
                "An eerie feeling washes over you.",
                "You notice disturbed mud and broken rice stems... something was here recently."
            ]
        },
        
        DANGER_WARNINGS: {
            EDGE_ZONE: "The water here teems with dangerous predators!"
        },
        
        VILLAGE_MESSAGES: {
            RETURN_TO_SAFETY: "You return to the safety of the village.",
            WELCOME_TO_VILLAGE: "Welcome to the Betta village! You are safe here.",
            NEED_TO_BE_AT_CENTER: "You need to be at the village center to enter.",
            ALREADY_OUTSIDE: "You're already outside the village.",
            SAFELY_RETURNED: "You return safely to the village."
        }
    };
    
    // === SHOP & ECONOMY ===
    static SHOP = {
        HEADER: "🛒 Fish Mart Inventory",
        
        ITEMS: {
            SUBMARINE: {
                NAME: "🚀 Dunkleosteus Submarine",
                DESCRIPTION: "An ancient submarine that protects from Giant Gar attacks",
                PRICE: "{cost} Betta Bites"
            },
            
            KELP_SNACK: {
                NAME: "🌿 Kelp Snack", 
                DESCRIPTION: "A crunchy kelp snack that fully restores HP!",
                PRICE: "{cost} Betta Bites"
            },
            
            BUBBLE_WATER: {
                NAME: "💧 Bubble Water",
                DESCRIPTION: "Fizzy bubble water that fully restores MP", 
                PRICE: "{cost} Betta Bites"
            }
        },
        
        ERRORS: {
            ITEM_NOT_FOUND: "Item not found!",
            NOT_ENOUGH_BETTA_BITES: "You don't have enough Betta Bites!",
            UNKNOWN_ITEM_EFFECT: "Unknown item effect!",
            INSUFFICIENT_FUNDS_FOR_REST: "You don't have enough Betta Bites! Rest costs {cost} Betta Bites."
        },
        
        CONFIRMATIONS: {
            SUBMARINE: "Excellent choice! The mysterious ancient vessel is now yours! You feel its power transforming your very essence. You are no longer just a betta - you are a legendary sea creature!",
            KELP_SNACK: "You munch on the crunchy kelp snack! It restores {hpHealed} HP to full! Delicious!",
            BUBBLE_WATER: "You sip the fizzy bubble water! It restores {mpRestored} MP to full! Refreshing!"
        },
        
        INLINE_SHOP: {
            HEADER: "🛒 Fish Mart Inventory",
            FOOTER: "Your Betta Bites: {bettaBites}",
            COST_SUFFIX: " Betta Bites"
        }
    };
    
    // === INN SERVICES ===
    static INN = {
        REST_SUCCESS: "You pay {cost} Betta Bites and rest in the soft kelp beds. You wake up completely refreshed! HP and MP fully restored.",
        CONFIRMATION: "You rest peacefully in the soft kelp beds. You feel completely refreshed!",
        REST_NOT_ENOUGH: "You don't have enough Betta Bites to rest. ({cost} Betta Bites required)"
    };
    
    // === CHARACTER CREATION ===
    static CHARACTER_CREATION = {
        PREVIEW: {
            NAME_LABEL: "Name: {name}",
            COLOR_LABEL: "Color: {color}",
            UNKNOWN_NAME: "???",
            CHOOSE_COLOR: "Choose a color"
        },
        
        WELCOME_MESSAGE: "Welcome to Paddy Village, {playerName}! Your adventure begins here.",
        
        // Random name pool
        RANDOM_NAMES: [
            "Bubbles", "Finley", "Shimmer", "Sparkle", "Azure", "Coral", "Pearl",
            "Splash", "Ripple", "Current", "Flow", "Wave", "Tide", "Marina",
            "Ruby", "Sapphire", "Emerald", "Topaz", "Amber", "Crystal", "Diamond",
            "Sunny", "Misty", "Stormy", "Windy", "Cloudy", "Rainy", "Dewy",
            "Happy", "Lucky", "Brave", "Swift", "Gentle", "Proud", "Noble",
            "Zippy", "Peppy", "Snappy", "Flippy", "Swishy", "Splashy", "Bubbly",
            "Aqua", "Cyan", "Teal", "Turquoise", "Indigo", "Violet", "Magenta",
            "Finn", "Gil", "Scale", "Reef", "Kelp", "Algae", "Plankton",
            "Nemo", "Dory", "Ariel", "Flounder", "Sebastian", "Ursula", "Triton",
            "Alpha", "Beta", "Gamma", "Delta", "Sigma", "Omega", "Zeta"
        ]
    };
    
    // === SYSTEM MESSAGES ===
    static SYSTEM = {
        CHEATS: {
            BETTA_BITES_ADDED: "💰 Cheat activated! +100 Betta Bites!",
            LEVEL_UP_APPLIED: "⬆️ Cheat activated! Level up applied!",
            HP_MP_RESTORED: "💊 Cheat activated! HP and MP fully restored!"
        },
        
        CONGRATULATIONS: {
            TITLE: "🎉 CONGRATULATIONS! 🎉",
            EDGE_REACHED: "You've explored to your paddy's edge!",
            MORE_ADVENTURES: "What lies beyond? More adventures await!",
            IN_DEVELOPMENT: "(In Development)",
            ALL_FRIENDS_TITLE: "🌟 PEACE IN THE PADDIES! 🌟",
            ALL_FRIENDS_MESSAGE: "You've made the rice paddies safe for you and all your new friends!",
            ALL_FRIENDS_SUBTITLE: "The waters are now peaceful and full of friendship!"
        },
        
        
        TEXT_CHECKS: {
            CHOOSE_COLOR_TEXT: "Choose your color",
            SHOP_INVENTORY_TEXT: "Fish Mart Inventory"
        }
    };
}

// === STRING INTERPOLATION HELPER ===
class StringFormatter {
    static format(template, variables = {}) {
        return template.replace(/\{(\w+)\}/g, (match, key) => {
            return variables[key] !== undefined ? variables[key] : match;
        });
    }
    
    // Process button texts to automatically generate HTML with underlines and keys
    static processButtonTexts(buttonTexts) {
        const usedKeys = new Set();
        
        return buttonTexts.map(text => {
            // Find first available letter
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const key = char.toLowerCase();
                
                // Skip non-letters and already used keys
                if (!key.match(/[a-z]/) || usedKeys.has(key)) {
                    continue;
                }
                
                usedKeys.add(key);
                const html = text.substring(0, i) + '<u>' + char + '</u>' + text.substring(i + 1);
                return { html, key };
            }
            
            // Fallback if no available letter found
            return { html: text, key: null };
        });
    }
}

// === AUDIO MODULE ===
/**
 * Audio Management Module
 * 
 * Handles all game audio including sound effects and music generation.
 * Uses Web Audio API to create procedural sounds for combat, spells,
 * environmental effects, and victory fanfares.
 */
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.isInitialized = false;
        this.isEnabled = true; // Audio enabled by default
    }
    
    initAudio() {
        if (this.isInitialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
        } catch (e) {
            // Web Audio API not supported - graceful fallback
        }
    }
    
    toggleAudio() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }
    
    setAudioEnabled(enabled) {
        this.isEnabled = enabled;
    }
    
    isAudioEnabled() {
        return this.isEnabled;
    }
    
    playSound(type) {
        // Don't play if audio is disabled
        if (!this.isEnabled) return;
        
        // Initialize audio context on first user interaction
        if (!this.isInitialized) {
            this.initAudio();
        }
        
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        switch(type) {
            case 'attack':
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;
                
            case 'bubble':
                // Bubbling sound effect
                oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(250, this.audioContext.currentTime + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(180, this.audioContext.currentTime + 0.2);
                oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.3);
                oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.4);
                gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.08, this.audioContext.currentTime + 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.5);
                break;
                
            case 'gravel':
                // Gravel/stone crashing sound - low frequency with noise-like characteristics
                oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(120, this.audioContext.currentTime + 0.05);
                oscillator.frequency.exponentialRampToValueAtTime(60, this.audioContext.currentTime + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.15);
                oscillator.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.25);
                oscillator.type = 'sawtooth'; // Harsher sound for rocks
                gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.15, this.audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.3);
                break;
                
            case 'party':
                // Happy party sound with cute melody
                const partyNotes = [523, 659, 784, 659, 523, 784, 1047, 784]; // C-E-G pattern (happy arpeggios)
                const noteDuration = 0.15;
                
                partyNotes.forEach((freq, i) => {
                    const noteOsc = this.audioContext.createOscillator();
                    const noteGain = this.audioContext.createGain();
                    
                    noteOsc.connect(noteGain);
                    noteGain.connect(this.audioContext.destination);
                    
                    noteOsc.type = 'sine';
                    noteOsc.frequency.setValueAtTime(freq, this.audioContext.currentTime + i * noteDuration);
                    
                    // Bouncy volume envelope
                    noteGain.gain.setValueAtTime(0, this.audioContext.currentTime + i * noteDuration);
                    noteGain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + i * noteDuration + 0.02);
                    noteGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * noteDuration + noteDuration);
                    
                    noteOsc.start(this.audioContext.currentTime + i * noteDuration);
                    noteOsc.stop(this.audioContext.currentTime + i * noteDuration + noteDuration);
                });
                
                // Add a party noise/whistle at the end
                const whistle = this.audioContext.createOscillator();
                const whistleGain = this.audioContext.createGain();
                whistle.connect(whistleGain);
                whistleGain.connect(this.audioContext.destination);
                
                whistle.type = 'sine';
                whistle.frequency.setValueAtTime(800, this.audioContext.currentTime + partyNotes.length * noteDuration);
                whistle.frequency.exponentialRampToValueAtTime(1600, this.audioContext.currentTime + partyNotes.length * noteDuration + 0.3);
                
                whistleGain.gain.setValueAtTime(0.15, this.audioContext.currentTime + partyNotes.length * noteDuration);
                whistleGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + partyNotes.length * noteDuration + 0.3);
                
                whistle.start(this.audioContext.currentTime + partyNotes.length * noteDuration);
                whistle.stop(this.audioContext.currentTime + partyNotes.length * noteDuration + 0.3);
                break;
                
            case 'fanfare':
                // Play a longer victory fanfare
                const fanfareNotes = [262, 330, 392, 523, 659, 523]; // C, E, G, C, E, C
                fanfareNotes.forEach((freq, i) => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);
                    
                    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + i * 0.12);
                    gain.gain.setValueAtTime(0.25, this.audioContext.currentTime + i * 0.12);
                    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * 0.12 + 0.2);
                    osc.start(this.audioContext.currentTime + i * 0.12);
                    osc.stop(this.audioContext.currentTime + i * 0.12 + 0.2);
                });
                break;
                
            case 'levelup':
                // Play ascending scale for level up
                const levelUpNotes = [262, 294, 330, 349, 392, 440, 494, 523]; // C major scale
                levelUpNotes.forEach((freq, i) => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);
                    
                    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + i * 0.08);
                    gain.gain.setValueAtTime(0.15, this.audioContext.currentTime + i * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * 0.08 + 0.15);
                    osc.start(this.audioContext.currentTime + i * 0.08);
                    osc.stop(this.audioContext.currentTime + i * 0.08 + 0.15);
                });
                break;
                
            case 'combatstart':
                // Play dramatic "dun dun" sound
                const combatNotes = [98, 98]; // Low G notes
                combatNotes.forEach((freq, i) => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);
                    
                    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + i * 0.3);
                    gain.gain.setValueAtTime(0.4, this.audioContext.currentTime + i * 0.3);
                    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * 0.3 + 0.25);
                    osc.start(this.audioContext.currentTime + i * 0.3);
                    osc.stop(this.audioContext.currentTime + i * 0.3 + 0.25);
                });
                break;
                
            case 'wound':
                // Play a quick damage sound
                oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.15);
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.15);
                break;
                
            case 'roar':
                // Play a terrifying roar sound
                oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(120, this.audioContext.currentTime + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.4);
                oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.8);
                oscillator.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 1.2);
                gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.6, this.audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.3, this.audioContext.currentTime + 0.4);
                gainNode.gain.exponentialRampToValueAtTime(0.5, this.audioContext.currentTime + 0.8);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5);
                oscillator.type = 'sawtooth';
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 1.5);
                break;
                
            case 'found':
                // Play the "found" sound for treasure discovery - simple cheerful notes
                const foundNotes = [392, 523]; // G, C - simple "da da!" sound
                foundNotes.forEach((freq, i) => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);
                    
                    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + i * 0.15);
                    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime + i * 0.15);
                    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * 0.15 + 0.3);
                    osc.start(this.audioContext.currentTime + i * 0.15);
                    osc.stop(this.audioContext.currentTime + i * 0.15 + 0.3);
                });
                break;
                
        }
    }
}

// === PLAYER MODULE ===
/**
 * Player Character Module
 * 
 * Manages player character state including stats, progression, combat
 * mechanics, and equipment. Handles level-ups, damage calculations,
 * spell casting, and visual representation (sprites, colors).
 */
class Player {
    constructor() {
        const startingStats = GameConfig.PLAYER.STARTING_STATS;
        this.name = '';
        this.color = '';
        this.level = startingStats.level;
        this.hp = startingStats.hp;
        this.maxHp = startingStats.maxHp;
        this.mp = startingStats.mp;
        this.maxMp = startingStats.maxMp;
        this.exp = startingStats.exp;
        this.expToNext = GameConfig.PLAYER.PROGRESSION.EXP_BASE;
        this.bettaBites = startingStats.bettaBites;
        this.hasDunkleosteusSub = false;
        this.befriendedSpecies = new Set(); // Track which enemy types are friends
    }
    
    // Combat
    takeDamage(amount) {
        // Submarine provides complete damage protection
        if (this.hasDunkleosteusSub) {
            return 0; // No damage taken with submarine
        }
        
        // Armor reduces damage based on level
        let armorReduction = 0;
        const armorLevels = GameConfig.PLAYER.ARMOR_SYSTEM.LEVELS;
        
        // Check armor levels in descending order (highest first)
        const armorLevelKeys = Object.keys(armorLevels).map(Number).sort((a, b) => b - a);
        for (const armorLevel of armorLevelKeys) {
            if (this.level >= armorLevel) {
                armorReduction = armorLevels[armorLevel].reduction;
                break;
            }
        }
        
        const finalDamage = Math.max(1, amount - armorReduction); // Minimum 1 damage
        this.hp = Math.max(0, this.hp - finalDamage);
        
        return finalDamage; // Return actual damage taken for logging
    }
    
    // Healing
    healHP(amount) {
        const actualHeal = Math.min(amount, this.maxHp - this.hp);
        this.hp = Math.min(this.maxHp, this.hp + amount);
        return actualHeal;
    }
    
    healMP(amount) {
        const actualHeal = Math.min(amount, this.maxMp - this.mp);
        this.mp = Math.min(this.maxMp, this.mp + amount);
        return actualHeal;
    }
    
    fullHeal() {
        const hpHealed = this.maxHp - this.hp;
        const mpHealed = this.maxMp - this.mp;
        this.hp = this.maxHp;
        this.mp = this.maxMp;
        return { hpHealed, mpHealed };
    }
    
    // Progression  
    levelUp() {
        this.level++;
        this.exp -= this.expToNext;
        this.expToNext = Math.floor(this.expToNext * GameConfig.PLAYER.PROGRESSION.EXP_MULTIPLIER);
        
        const hpIncrease = GameConfig.PLAYER.PROGRESSION.HP_GAIN_PER_LEVEL;
        const mpIncrease = GameConfig.PLAYER.PROGRESSION.MP_GAIN_PER_LEVEL;
        
        this.maxHp += hpIncrease;
        this.maxMp += mpIncrease;
        this.hp = this.maxHp;
        this.mp = this.maxMp;
        
        return { hpIncrease, mpIncrease };
    }
    
    gainExp(amount) {
        this.exp += amount;
        return this.exp >= this.expToNext; // Return true if level up is available
    }
    
    // Economy
    canAfford(cost) {
        return this.bettaBites >= cost;
    }
    
    spendBettaBites(amount) {
        if (this.canAfford(amount)) {
            this.bettaBites -= amount;
            return true;
        }
        return false;
    }
    
    gainBettaBites(amount) {
        this.bettaBites += amount;
    }
    
    // Combat utilities
    hasSpell(spellType) {
        if (spellType === 'bubble') {
            const spell = GameConfig.COMBAT.SPELLS.BUBBLE_BLAST;
            return this.level >= spell.unlockLevel;
        }
        if (spellType === 'party') {
            const spell = GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME;
            return this.level >= spell.unlockLevel;
        }
        if (spellType === 'gravel') {
            const spell = GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE;
            return this.level >= spell.unlockLevel;
        }
        return false;
    }
    
    canCastSpell(spellType) {
        if (!this.hasSpell(spellType)) return false;
        
        if (spellType === 'bubble') {
            const spell = GameConfig.COMBAT.SPELLS.BUBBLE_BLAST;
            return this.mp >= spell.mpCost;
        }
        if (spellType === 'party') {
            const spell = GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME;
            return this.mp >= spell.mpCost;
        }
        if (spellType === 'gravel') {
            const spell = GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE;
            return this.mp >= spell.mpCost;
        }
        return false;
    }
    
    castSpell(spellType) {
        if (!this.canCastSpell(spellType)) return false;
        
        if (spellType === 'bubble') {
            this.mp -= GameConfig.COMBAT.SPELLS.BUBBLE_BLAST.mpCost;
            return true;
        }
        if (spellType === 'party') {
            this.mp -= GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME.mpCost;
            return true;
        }
        if (spellType === 'gravel') {
            this.mp -= GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE.mpCost;
            return true;
        }
        return false;
    }
    
    // Damage calculations
    calculateAttackDamage() {
        // Base damage scales with level: +1 on even levels (2, 4, 6, 8, 10)
        const damageConfig = GameConfig.COMBAT.PLAYER_DAMAGE;
        const baseDamage = Math.floor(Math.random() * (damageConfig.baseMax - damageConfig.baseMin + 1)) + damageConfig.baseMin;
        const levelBonus = Math.floor(this.level / 2); // +1 damage on even levels
        let playerDamage = baseDamage + levelBonus;
        
        // Submarine doubles attack damage
        if (this.hasDunkleosteusSub) {
            playerDamage *= 2;
        }
        
        return playerDamage;
    }
    
    calculateMagicDamage(spellType) {
        const magicBonus = Math.floor((this.level + 1) / 2); // +1 on odd levels
        
        if (spellType === 'bubble') {
            const spell = GameConfig.COMBAT.SPELLS.BUBBLE_BLAST;
            const minDamage = spell.damageMin + magicBonus;
            const maxDamage = spell.damageMax + magicBonus;
            return Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
        }
        
        if (spellType === 'party') {
            const spell = GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME;
            const minDamage = spell.damageMin + magicBonus;
            const maxDamage = spell.damageMax + magicBonus;
            return Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
        }
        
        if (spellType === 'gravel') {
            const spell = GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE;
            const minDamage = spell.damageMin + magicBonus;
            const maxDamage = spell.damageMax + magicBonus;
            return Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
        }
        
        return 0;
    }
    
    // Death handling
    die() {
        // Calculate Betta Bites loss (half, rounded down)
        const bettaBitesLost = Math.floor(this.bettaBites / 2);
        this.bettaBites -= bettaBitesLost;
        
        // Reset to full HP and MP
        this.hp = this.maxHp;
        this.mp = this.maxMp;
        
        return bettaBitesLost;
    }
    
    // Reset to initial state
    reset() {
        const startingStats = GameConfig.PLAYER.STARTING_STATS;
        this.name = '';
        this.color = '';
        this.level = startingStats.level;
        this.hp = startingStats.hp;
        this.maxHp = startingStats.maxHp;
        this.mp = startingStats.mp;
        this.maxMp = startingStats.maxMp;
        this.exp = startingStats.exp;
        this.expToNext = GameConfig.PLAYER.PROGRESSION.EXP_BASE;
        this.bettaBites = 0;
        this.hasDunkleosteusSub = false;
    }
    
    // Acquire special items
    acquireSubmarine() {
        this.hasDunkleosteusSub = true;
        return {
            success: true,
            message: GameStrings.SHOP.CONFIRMATIONS.SUBMARINE
        };
    }
    
    // Check if player has submarine
    hasSubmarine() {
        return this.hasDunkleosteusSub;
    }
    
    // Getters for UI
    get hpPercentage() { 
        return (this.hp / this.maxHp) * 100; 
    }
    
    get mpPercentage() { 
        return (this.mp / this.maxMp) * 100; 
    }
    
    // Getters for UI
    getLevel() { return this.level; }
    getExp() { return this.exp; }
    getExpToNext() { return this.expToNext; }
    getBettaBites() { return this.bettaBites; }
    getHP() { return this.hp; }
    getMaxHP() { return this.maxHp; }
    getMP() { return this.mp; }
    getMaxMP() { return this.maxMp; }
    getName() { return this.name; }
    getColor() { return this.color; }
    
    // Befriended species management
    addBefriendedSpecies(speciesName) {
        this.befriendedSpecies.add(speciesName);
    }
    
    isFriendsWith(speciesName) {
        return this.befriendedSpecies.has(speciesName);
    }
    
    // Set player identity
    setPlayerIdentity(name, color) {
        this.name = name;
        this.color = color;
    }
    
    // Interface for getting comprehensive stats (for UI updates)
    getStats() {
        return {
            name: this.name,
            level: this.level,
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.mp,
            maxMp: this.maxMp,
            exp: this.exp,
            expToNext: this.expToNext,
            bettaBites: this.bettaBites,
            hpPercentage: this.hpPercentage,
            mpPercentage: this.mpPercentage
        };
    }
    
    get isAlive() {
        return this.hp > 0;
    }
    
    // Sprite selection
    getSprite() {
        if (this.hasDunkleosteusSub) {
            return `graphics/artifacts/${GameConfig.PLAYER.ARMOR_SYSTEM.SUBMARINE.sprite}`;
        }
        
        const armorLevels = GameConfig.PLAYER.ARMOR_SYSTEM.LEVELS;
        
        // Find the highest armor level the player qualifies for
        const armorLevelKeys = Object.keys(armorLevels).map(Number).sort((a, b) => b - a);
        for (const armorLevel of armorLevelKeys) {
            if (this.level >= armorLevel) {
                return `graphics/main_fish/${armorLevels[armorLevel].sprite}`;
            }
        }
        
        // Fallback (shouldn't happen since level 1 armor should always qualify)
        return `graphics/main_fish/${armorLevels[1].sprite}`;
    }
    
    // Color filter
    getColorFilter() {
        const colorConfig = GameConfig.UI.COLORS[this.color?.toUpperCase()];
        return colorConfig ? colorConfig.filter : 'none';
    }
}

// === NPC MODULE ===
/**
 * NPC Management Module
 * 
 * Handles all Non-Player Character data, dialogue trees, and interaction logic.
 * Manages village NPCs, their conversations, shop services, inn services, and
 * dialogue state progression. Provides clean interfaces for character interaction
 * without exposing internal NPC data structures.
 */
class NPCManager {
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
    
    // Service type checking
    isShopNPC(npcId) {
        const npc = this.npcs[npcId];
        return npc ? (npc.isShop || false) : false;
    }
    
    isInnNPC(npcId) {
        const npc = this.npcs[npcId];
        return npc ? (npc.isInn || false) : false;
    }
    
    
    // Reset method for game state management
    reset() {
        this.currentNPC = null;
        this.currentDialogueIndex = 0;
    }
}

// === DIALOG MODULE ===
/**
 * Dialog System Module
 * 
 * Manages modal dialog boxes and user choice prompts. Provides a
 * fallback system for browsers that don't support modern UI features,
 * handling user input validation and audio feedback.
 */
class DialogManager {
    constructor(audioManager) {
        this.audio = audioManager;
        this.isActive = false;
        this.currentOptions = [];
        this.keyHandlers = new Map();
        
        // DOM elements
        this.dialogueContainer = null;
        this.dialogueTextElement = null;
        this.dialogueOptionsElement = null;
        
        this.initializeElements();
        this.setupKeyboardHandling();
    }
    
    initializeElements() {
        this.dialogueContainer = document.getElementById('dialogue-container');
        this.dialogueTextElement = document.getElementById('dialogue-text');
        this.dialogueOptionsElement = document.getElementById('dialogue-options');
    }
    
    setupKeyboardHandling() {
        document.addEventListener('keydown', (event) => {
            if (!this.isActive) return;
            
            const key = event.key.toLowerCase();
            
            // Handle Enter key
            if (key === 'enter') {
                event.preventDefault();
                this.handleEnterKey();
                return;
            }
            
            // Handle underlined letter shortcuts
            if (this.keyHandlers.has(key)) {
                event.preventDefault();
                const handler = this.keyHandlers.get(key);
                handler();
            }
        });
    }
    
    show(text, options = []) {
        this.isActive = true;
        this.currentOptions = options;
        this.keyHandlers.clear();
        
        // Show dialogue container
        if (this.dialogueContainer) {
            this.dialogueContainer.style.display = 'flex';
        }
        
        // Set text
        if (this.dialogueTextElement) {
            this.dialogueTextElement.textContent = text;
        }
        
        // Create option buttons
        if (this.dialogueOptionsElement) {
            this.dialogueOptionsElement.innerHTML = '';
            
            options.forEach((option, index) => {
                const button = document.createElement('div');
                button.className = 'dialogue-option';
                if (option.disabled) {
                    button.classList.add('disabled');
                }
                
                // Set button HTML with underlined shortcut key
                button.innerHTML = option.html || option.text;
                
                // Add click handler
                button.onclick = () => {
                    if (!option.disabled && option.action) {
                        option.action();
                    }
                };
                
                // Register keyboard shortcut
                if (option.key && !option.disabled) {
                    this.keyHandlers.set(option.key.toLowerCase(), () => {
                        if (option.action) {
                            option.action();
                        }
                    });
                }
                
                // Mark first non-disabled option as default for Enter key
                if (!this.defaultAction && !option.disabled && option.action) {
                    this.defaultAction = option.action;
                }
                
                this.dialogueOptionsElement.appendChild(button);
            });
        }
    }
    
    handleEnterKey() {
        // Find the first non-disabled option or use default action
        const firstAvailableOption = this.currentOptions.find(opt => !opt.disabled && opt.action);
        if (firstAvailableOption) {
            firstAvailableOption.action();
        }
    }
    
    hide() {
        this.isActive = false;
        this.currentOptions = [];
        this.keyHandlers.clear();
        this.defaultAction = null;
        
        if (this.dialogueContainer) {
            this.dialogueContainer.style.display = 'none';
        }
    }
    
    isDialogActive() {
        return this.isActive;
    }
    
    // Utility methods for common dialog types
    showMessage(text, callback) {
        const [okButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.OK]);
        this.show(text, [
            {
                html: okButton.html,
                key: okButton.key,
                action: () => {
                    this.hide();
                    if (callback) callback();
                }
            }
        ]);
    }
    
    showConfirmation(text, onConfirm, onCancel) {
        const [confirmButton, cancelButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.YES, GameStrings.UI.BUTTONS.NO]);
        this.show(text, [
            {
                html: confirmButton.html,
                key: confirmButton.key,
                action: () => {
                    this.hide();
                    if (onConfirm) onConfirm();
                }
            },
            {
                html: cancelButton.html,
                key: cancelButton.key,
                action: () => {
                    this.hide();
                    if (onCancel) onCancel();
                }
            }
        ]);
    }
    
    showPurchaseConfirmation(message, callback) {
        const [button] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.THANKS]);
        this.show(message, [
            {
                html: button.html,
                key: button.key,
                action: () => {
                    this.hide();
                    if (callback) callback();
                }
            }
        ]);
    }
    
    showSubmarinePurchase(callback) {
        const [button] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.AMAZING]);
        this.show(GameStrings.SHOP.CONFIRMATIONS.SUBMARINE, [
            {
                html: button.html,
                key: button.key,
                action: () => {
                    this.hide();
                    if (callback) callback();
                }
            }
        ]);
    }
    
    showRestConfirmation(callback) {
        const [button] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.CLOSE]);
        this.show(StringFormatter.format(GameStrings.INN.REST_SUCCESS, { cost: GameConfig.SHOP.INN_REST.cost }), [
            {
                html: button.html,
                key: button.key,
                action: () => {
                    this.hide();
                    if (callback) callback();
                }
            }
        ]);
    }
}

// === COMBAT MODULE ===
/**
 * Combat System Module
 * 
 * Manages all combat mechanics including enemy generation, turn-based
 * fighting, spell casting, victory/defeat handling, and visual effects.
 * Handles enemy scaling, special attacks, and combat animations.
 */
class CombatManager {
    constructor(player, audioManager) {
        this.player = player;
        this.audio = audioManager;
        this.world = null; // Will be set after WorldManager is created
        this.ui = null; // Will be set after UIManager is created
        
        // Combat state
        this.currentEnemy = null;
        this.defeatedEnemy = null; // Store defeated enemy for async victory processing
        this.combatLog = [];
        this.combatActive = false;
        this.hasDefeatedGar = false;
        this.garTurnCounter = 0;
        this.lastVictoryWasLevel10 = false;
        this.hasReachedEdge = false; // Track edge exploration achievement
        this.levelUpTimeout = null; // Track level up timeout to clear if needed
        this.playerHasPartyHat = false; // Track if player has party hat visual during combat
        this.currentCombatBefriending = false; // Track if current combat is befriending with HBT
        this.hasAchievedPeace = false; // Track if all enemies are peaceful
        
        // Enemy definitions from configuration
        this.enemies = [
            this.createEnemyFromConfig(GameConfig.ENEMIES.AGGRESSIVE_GUPPY),
            this.createEnemyFromConfig(GameConfig.ENEMIES.TERRITORIAL_ANGELFISH),
            this.createEnemyFromConfig(GameConfig.ENEMIES.SNEAKY_CATFISH),
            this.createEnemyFromConfig(GameConfig.ENEMIES.FIERCE_CICHLID),
            this.createEnemyFromConfig(GameConfig.ENEMIES.PREHISTORIC_GAR)
        ];
    }
    
    // Helper method to convert config enemy to combat format
    createEnemyFromConfig(enemyConfig) {
        return {
            name: enemyConfig.name,
            hp: enemyConfig.baseHp,
            maxHp: enemyConfig.baseHp,
            attack: enemyConfig.baseDamage,
            exp: enemyConfig.baseExp,
            sprite: `graphics/enemies/${enemyConfig.sprite}`,
            attacks: enemyConfig.attacks
        };
    }
    
    // Module interface: Set world manager reference after construction
    setWorldManager(worldManager) {
        this.world = worldManager;
    }
    
    // Module interface: Set UI manager reference after construction
    setUIManager(uiManager) {
        this.ui = uiManager;
    }
    
    
    // Calculate enemy level based on distance from village center using config
    calculateEnemyLevel(x, y) {
        // Calculate actual distance from village center
        const distance = this.world.getDistanceFromVillage(x, y);
        
        // Use config-defined danger zones based on distance only
        const zones = GameConfig.WORLD.DANGER_ZONES;
        let levelRange;
        
        if (distance <= zones.SAFE_RADIUS) {
            levelRange = zones.LEVEL_SCALING.SAFE;        // Light blue water
        } else if (distance <= zones.DANGEROUS_RADIUS) {
            levelRange = zones.LEVEL_SCALING.DANGEROUS;   // Medium blue water
        } else {
            levelRange = zones.LEVEL_SCALING.EXTREME;     // Dark blue water
        }
        
        // Random level within the range for this zone
        const randomLevel = Math.floor(Math.random() * (levelRange.max - levelRange.min + 1)) + levelRange.min;
        
        return randomLevel;
    }
    
    // Scale enemy stats based on level
    scaleEnemyWithLevel(enemy, level) {
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
        };
        
        // HP scaling from configuration
        const scaling = GameConfig.COMBAT.ENEMY_SCALING;
        const hpMultiplier = scaling.HP_BASE_MULTIPLIER + (level - 1) * scaling.HP_LEVEL_MULTIPLIER;
        scaledEnemy.hp = Math.floor(enemy.hp * hpMultiplier);
        scaledEnemy.maxHp = scaledEnemy.hp;
        
        // Damage scaling from configuration
        const damageMultiplier = scaling.DAMAGE_BASE_MULTIPLIER + (level - 1) * scaling.DAMAGE_LEVEL_MULTIPLIER;
        scaledEnemy.attack = Math.floor(enemy.attack * damageMultiplier);
        
        // EXP scaling from configuration
        const expMultiplier = 1 + (level - 1) * GameConfig.COMBAT.ENEMY_SCALING.EXP_LEVEL_MULTIPLIER;
        scaledEnemy.exp = Math.floor(enemy.exp * expMultiplier);
        
        return scaledEnemy;
    }
    
    // Start a random encounter
    startRandomEncounter(playerX, playerY) {
        let enemyIndex;
        
        // Calculate enemy level based on distance from village
        const enemyLevel = this.calculateEnemyLevel(playerX, playerY);
        
        // Check if we're in extreme zone
        const distance = this.world.getDistanceFromVillage(playerX, playerY);
        const isExtremeZone = distance > GameConfig.WORLD.DANGER_ZONES.DANGEROUS_RADIUS;
        
        // Prehistoric Gar spawns in extreme zone (dark water) until defeated
        if (isExtremeZone && !this.hasDefeatedGar) {
            enemyIndex = 4; // Prehistoric Gar
        } else {
            // Try to find a non-befriended enemy
            const maxAttempts = 10;
            for (let i = 0; i < maxAttempts; i++) {
                enemyIndex = Math.floor(Math.random() * 4);
                const enemyName = this.enemies[enemyIndex].name;
                
                // If not befriended, use this enemy
                if (!this.player.isFriendsWith(enemyName)) {
                    break;
                }
                
                // If all species are befriended, return null (no combat)
                if (i === maxAttempts - 1) {
                    return null;
                }
            }
        }
        
        // Store base enemy for encounter message
        const baseEnemy = this.enemies[enemyIndex];
        
        // Create scaled enemy
        this.currentEnemy = this.scaleEnemyWithLevel(baseEnemy, enemyLevel);
        this.currentEnemy.level = enemyLevel;
        
        // Apply color variation to all enemies (consistent per game, random per encounter)
        this.currentEnemy.randomHue = Math.floor(Math.random() * 360);
        
        this.combatActive = true;
        this.garTurnCounter = 0;
        this.currentCombatBefriending = false; // Reset befriending flag for new combat
        
        // Reset fish sprite orientations (in case previous combat had death flips)
        const playerFish = document.getElementById('player-fish-combat');
        if (playerFish) {
            playerFish.style.transform = 'none';
        }
        const statsSprite = document.getElementById('stats-player-sprite');
        if (statsSprite) {
            statsSprite.style.transform = 'none';
        }
        const enemyFish = document.getElementById('enemy-fish-combat');
        if (enemyFish) {
            enemyFish.style.transform = 'scaleX(-1)';
        }
        
        // Play combat start sound
        this.audio.playSound('combatstart');
        
        this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.COMBAT_BEGINS, {
            playerName: this.player.getName(),
            enemyName: this.currentEnemy.name
        }));
        
        return this.currentEnemy;
    }
    
    // Player attacks
    attack() {
        if (!this.combatActive || !this.currentEnemy) return;
        
        const damage = this.player.calculateAttackDamage();
        this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - damage);
        
        // Random attack descriptions from configuration
        const attackDescriptions = GameStrings.COMBAT.ATTACK_DESCRIPTIONS;
        const attackDescription = attackDescriptions[Math.floor(Math.random() * attackDescriptions.length)];
        
        this.audio.playSound('attack');
        this.addToCombatLog(`${this.player.getName()} ${attackDescription} for ${damage} damage!`);
        
        // Add shake animation to enemy sprite when taking damage
        this.shakeEnemySprite();
        
        return this.checkForVictory();
    }
    
    // Player uses magic skill
    useSkill(spellType) {
        if (!this.combatActive || !this.currentEnemy) return;
        if (!this.player.canCastSpell(spellType)) return;
        
        this.player.castSpell(spellType);
        this.audio.playSound(spellType);
        
        if (spellType === 'bubble') {
            const damage = this.player.calculateMagicDamage(spellType);
            this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - damage);
            this.shakeEnemySprite();
            
            // Random bubble spell descriptions from configuration
            const bubbleDescriptions = GameStrings.COMBAT.BUBBLE_DESCRIPTIONS;
            const bubbleDescription = bubbleDescriptions[Math.floor(Math.random() * bubbleDescriptions.length)];
            
            this.createBubbleEffect();
            this.addToCombatLog(`${this.player.getName()} ${bubbleDescription} for ${damage} damage!`);
        } else if (spellType === 'party') {
            // Happy Balloon Time - befriend the enemy instead of damaging
            this.createBalloonEffect();
            this.addPartyHatToEnemy();
            this.addPartyHatToPlayer();
            this.applyRainbowHP();
            
            // Special friendship message
            this.addToCombatLog(`${this.player.getName()} throws a magical party!`);
            this.addToCombatLog(`${this.currentEnemy.name} is having such a good time!`);
            
            // Mark as befriended but keep HP > 0 for rainbow effect
            this.currentEnemy.befriended = true;
            this.currentCombatBefriending = true; // Track that we're befriending in this combat
            // Set HP to 1 so bar stays visible for rainbow effect
            this.currentEnemy.hp = 1;
        } else if (spellType === 'gravel') {
            const damage = this.player.calculateMagicDamage(spellType);
            this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - damage);
            this.shakeEnemySprite();
            
            // Random gravel spell descriptions from configuration
            const gravelDescriptions = GameStrings.COMBAT.GRAVEL_DESCRIPTIONS;
            const gravelDescription = gravelDescriptions[Math.floor(Math.random() * gravelDescriptions.length)];
            
            this.createGravelEffect();
            this.addToCombatLog(`${this.player.getName()} ${gravelDescription} for ${damage} damage!`);
        }
        
        return this.checkForVictory();
    }
    
    // Helper method to check for enemy defeat and handle victory logic
    checkForVictory() {
        if (this.currentEnemy.hp <= 0 || this.currentEnemy.befriended) {
            // Enemy defeated - immediately stop combat to prevent duplicate processing
            this.combatActive = false;
            this.defeatedEnemy = { ...this.currentEnemy }; // Store a copy
            
            
            // Process victory immediately - sounds, EXP, level up
            const victoryResult = this.processVictoryImmediate(this.defeatedEnemy);
            
            return {
                enemyDefeated: true,
                enemy: this.defeatedEnemy,
                victoryResult: victoryResult
            };
        } else {
            this.enemyTurn();
            // Check if player died after enemy turn
            if (!this.player.isAlive) {
                return { playerDefeated: true };
            }
        }
        return null;
    }
    
    // Enemy's turn
    enemyTurn() {
        if (!this.combatActive || !this.currentEnemy) return;
        
        // Increment Gar turn counter
        if (this.currentEnemy.name === "Prehistoric Gar") {
            this.garTurnCounter++;
        }
        
        // Check for Prehistoric Gar special attacks
        if (this.currentEnemy.name === "Prehistoric Gar") {
            const garConfig = GameConfig.ENEMIES.PREHISTORIC_GAR.special;
            
            // Check for Gargantuan Gar attack
            if (garConfig.gargantuanAttack && this.garTurnCounter === garConfig.gargantuanAttack.turn) {
                this.executeGargantuanAttack(garConfig.gargantuanAttack);
                return;
            }
            
            // Check for roar turns
            if (garConfig.roarTurns && garConfig.roarTurns.includes(this.garTurnCounter)) {
                this.executeGarRoar(garConfig);
                return;
            }
        }
        
        // Regular enemy attack
        const attackIndex = Math.floor(Math.random() * this.currentEnemy.attacks.length);
        const attackDescription = this.currentEnemy.attacks[attackIndex];
        
        const damage = this.player.takeDamage(this.currentEnemy.attack);
        
        if (damage === 0 && this.player.hasSubmarine()) {
            // Submarine protection message
            this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.ENEMY_ATTACK_DEFLECTED, {
                enemyName: this.currentEnemy.name,
                attackDescription: attackDescription
            }));
            this.audio.playSound('attack'); // Different sound for deflection
        } else {
            this.audio.playSound('wound');
            this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.ENEMY_ATTACK_DAMAGE, {
                enemyName: this.currentEnemy.name,
                attackDescription: attackDescription,
                damage: damage
            }));
            
            // Add shake animation to player sprite when taking damage
            this.shakePlayerSprite();
        }
        
        // Don't call loseCombat here - let UI handle player death
    }
    
    // Execute Gargantuan Gar attack using configuration
    executeGargantuanAttack(attackConfig) {
        this.addToCombatLog(attackConfig.channelMessage);
        this.addToCombatLog(attackConfig.attackMessage);
        
        // Play configured sound
        this.audio.playSound(attackConfig.sound);
        
        // Create visual effect
        if (attackConfig.visualEffect === 'giant_gar') {
            this.createGiantGarEffect();
        }
        
        // Deal damage after configured delay
        setTimeout(() => {
            if (this.player.hasSubmarine()) {
                this.addToCombatLog(attackConfig.defenseMessage);
                this.audio.playSound('attack');
            } else {
                this.player.takeDamage(attackConfig.damage);
                const damageMessage = StringFormatter.format(attackConfig.damageMessage, {
                    damage: attackConfig.damage
                });
                this.addToCombatLog(damageMessage);
                
                this.audio.playSound('wound');
                this.shakePlayerSprite();
                
                // Check if player died from this delayed attack
                if (!this.player.isAlive) {
                    // Notify UI that player has been defeated
                    if (this.ui) {
                        this.ui.checkAndHandlePlayerDefeat();
                    }
                }
            }
        }, attackConfig.delay);
    }
    
    // Execute Gar roar using configuration
    executeGarRoar(garConfig) {
        const roarMessage = GameStrings.COMBAT.PREHISTORIC_GAR_ROAR;
        this.addToCombatLog(roarMessage);
        this.audio.playSound(garConfig.roarSound);
        // Roar turn - no damage dealt
    }
    
    // Try to run away from combat
    runAway() {
        if (!this.combatActive) return { escaped: false };
        
        // High level enemies are harder to escape from
        const escapeConfig = GameConfig.COMBAT.RUN_AWAY;
        if (this.currentEnemy.level >= escapeConfig.difficultEnemyLevel) {
            if (Math.random() > escapeConfig.difficultEscapeChance) {
                this.addToCombatLog(GameStrings.COMBAT.ESCAPE_FAILED);
                this.enemyTurn();
                // Check if player died after enemy attack on failed escape
                if (!this.player.isAlive) {
                    return { escaped: false, playerDefeated: true };
                }
                return { escaped: false };
            }
        }
        
        this.combatActive = false;
        this.currentEnemy = null;
        this.addToCombatLog(GameStrings.COMBAT.ESCAPE_BARELY_SUCCESS);
        return { escaped: true };
    }
    
    // UI calls this to show enemy death animation and complete victory
    completeEnemyDefeat(victoryCallback) {
        // Use stored defeated enemy to avoid null reference issues
        const defeatedEnemy = this.defeatedEnemy;
        if (!defeatedEnemy) {
            console.error('completeEnemyDefeat called but no defeated enemy stored');
            return;
        }
        
        // Clear defeated enemy immediately to prevent duplicate calls
        this.defeatedEnemy = null;
        
        // Complete the victory after animation delay and return result to UI
        // Enemy fish flip animation already happened in processVictoryImmediate
        setTimeout(() => {
            const victoryResult = this.winCombatWithEnemy(defeatedEnemy);
            // Add defeated enemy info to victory result for UI logging
            victoryResult.defeatedEnemy = defeatedEnemy;
            // Call the provided callback to handle victory
            if (victoryCallback) {
                victoryCallback(victoryResult);
            }
        }, 500); // Brief delay to show death animation
    }
    
    // Process victory immediately when enemy dies (plays sounds, updates stats)
    processVictoryImmediate(enemy) {
        const exp = enemy.exp;
        
        // Only flip enemy fish if defeated, not befriended
        if (!enemy.befriended) {
            const enemyFish = document.getElementById('enemy-fish-combat');
            if (enemyFish) {
                enemyFish.style.transform = 'scaleX(-1) scaleY(-1)';
            }
        }
        
        // Calculate Betta Bites rewards using configuration
        const config = GameConfig.COMBAT.ENEMY_SCALING.BETTA_BITES_REWARDS;
        const baseBites = Math.floor(Math.random() * (config.baseMax - config.baseMin + 1)) + config.baseMin;
        const levelMultiplier = Math.floor(Math.random() * (config.levelBonusMax - config.levelBonusMin + 1)) + config.levelBonusMin;
        const levelBonus = (enemy.level - 1) * levelMultiplier;
        const bettaBites = baseBites + levelBonus;
        
        // Check if this was the Giant Gar
        if (enemy.name === "Prehistoric Gar" && enemy.level >= 8) {
            this.hasDefeatedGar = true;
            
            // Check if we've achieved peace (all enemies befriended/defeated)
            if (!this.hasAchievedPeace && this.areAllEnemiesPeaceful()) {
                this.hasAchievedPeace = true;
            }
        }
        
        this.player.gainExp(exp);
        this.player.gainBettaBites(bettaBites);
        
        if (enemy.befriended) {
            // Add this species to player's befriended list
            this.player.addBefriendedSpecies(enemy.name);
            this.addToCombatLog(`${enemy.name} becomes your friend! You gained ${exp} EXP and ${bettaBites} Betta Bites!`);
            
            // Check if we've achieved peace after befriending this enemy
            if (!this.hasAchievedPeace && this.areAllEnemiesPeaceful()) {
                this.hasAchievedPeace = true;
            }
        } else {
            this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.VICTORY_REWARDS, {
                exp: exp,
                bettaBites: bettaBites
            }));
        }
        
        // Check for level up but don't do it yet
        const willLevelUp = this.player.gainExp(0); // Check without adding more exp
        
        // Check for max level enemy victory (edge exploration achievement)
        // Only show congratulations for first max level victory
        const extremeLevel = GameConfig.WORLD.DANGER_ZONES.LEVEL_SCALING.EXTREME.min;
        const isLevel10Victory = enemy.level === extremeLevel && !this.hasReachedEdge;
        if (isLevel10Victory) {
            this.hasReachedEdge = true; // Mark edge as reached
        }
        this.lastVictoryWasLevel10 = isLevel10Victory;
        
        // Play victory sounds immediately
        this.audio.playSound('fanfare');
        
        // If leveling up, trigger fanfare first, THEN do level up
        if (willLevelUp) {
            // Add level up messages first (but don't level up yet)
            this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.LEVEL_UP, {
                newLevel: this.player.getLevel() + 1
            }));
            
            // Brief delay for fanfare to play, then do level up and play level up sound
            this.levelUpTimeout = setTimeout(() => {
                // NOW do the actual level up (HP increase happens here, after fanfare has played)
                const gains = this.player.levelUp();
                this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.HP_MP_INCREASE, {
                    hpIncrease: gains.hpIncrease,
                    mpIncrease: gains.mpIncrease
                }));
                
                // Armor upgrade messages - use config-defined armor levels
                const armorLevels = GameConfig.PLAYER.ARMOR_SYSTEM.LEVELS;
                if (armorLevels[this.player.getLevel()]) {
                    const armorLevelKeys = Object.keys(armorLevels).map(Number).sort();
                    const currentArmorIndex = armorLevelKeys.indexOf(this.player.getLevel());
                    
                    const armorMessages = [
                        null, // Level 1 has no upgrade message
                        GameStrings.COMBAT.ARMOR_HELMET,
                        GameStrings.COMBAT.ARMOR_ADVANCED,
                        GameStrings.COMBAT.ARMOR_FULL_METAL
                    ];
                    
                    if (currentArmorIndex >= 0 && currentArmorIndex < armorMessages.length && armorMessages[currentArmorIndex]) {
                        this.addToCombatLog(armorMessages[currentArmorIndex]);
                    }
                }
                
                // Play levelup sound after HP increase
                this.audio.playSound('levelup');
                this.levelUpTimeout = null; // Clear the timeout reference
            }, 500); // Shorter delay - enough for fanfare to start but not too long
        }
        
        return {
            victory: true,
            showCongratulations: isLevel10Victory,
            showPeaceMessage: this.hasAchievedPeace,
            levelUp: willLevelUp
        };
    }
    
    // Win combat with specific enemy data (called after animation delay)
    winCombatWithEnemy(enemy) {
        if (!enemy) {
            console.error('winCombatWithEnemy called with null enemy');
            return { victory: false };
        }
        
        // Victory was already processed in processVictoryImmediate
        this.currentEnemy = null;
        
        // Return victory information for UI handling
        // Don't show peace message here as it's already shown from processVictoryImmediate
        return {
            victory: true,
            showCongratulations: this.lastVictoryWasLevel10,
            showPeaceMessage: false
        };
    }
    
    
    // Lose combat
    loseCombat() {
        // Store enemy info before clearing it (for UI logging)
        const defeatedByEnemy = this.currentEnemy ? { ...this.currentEnemy } : null;
        
        const bettaBitesLost = this.player.die();
        
        // Flip player fish to show death
        const playerFish = document.getElementById('player-fish-combat');
        if (playerFish) {
            playerFish.style.transform = 'scaleY(-1)';
        }
        
        // Also flip player fish in stats panel
        const statsSprite = document.getElementById('stats-player-sprite');
        if (statsSprite) {
            statsSprite.style.transform = 'scaleY(-1)';
        }
        
        this.addToCombatLog(GameStrings.COMBAT.PLAYER_DEFEATED);
        
        if (bettaBitesLost > 0) {
            this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.PLAYER_LOST_BETTA_BITES, {
                amount: bettaBitesLost
            }));
        }
        
        this.combatActive = false;
        this.currentEnemy = null;
        
        // Return defeat info for UI to handle screen transition and final message
        return {
            defeated: true,
            bettaBitesLost: bettaBitesLost,
            defeatedByEnemy: defeatedByEnemy
        };
    }
    
    // Visual Effects
    createBubbleEffect() {
        const bubbleCounts = [4, 5, 6, 7, 8]; // Random 4-8 bubbles
        const bubbleCount = bubbleCounts[Math.floor(Math.random() * bubbleCounts.length)];
        
        for (let i = 0; i < bubbleCount; i++) {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
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
                `;
                
                document.getElementById('game-container').appendChild(bubble);
                
                setTimeout(() => {
                    if (bubble.parentNode) {
                        bubble.parentNode.removeChild(bubble);
                    }
                }, 2000);
            }, i * 150);
        }
    }
    
    createGravelEffect() {
        const container = document.createElement('div');
        container.className = 'gravel-container';
        container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.getElementById('game-container').appendChild(container);
        
        // Create multiple gravel particles
        const particleCount = Math.floor(Math.random() * 15) + 20; // 20-35 particles
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'gravel-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 8 + 4}px;
                    height: ${Math.random() * 8 + 4}px;
                    background: linear-gradient(45deg, #8B4513, #A0522D, #696969);
                    border-radius: ${Math.random() * 3}px;
                    left: ${Math.random() * 100}%;
                    top: -20px;
                    animation: gravelFall ${Math.random() * 0.5 + 1}s ease-in forwards;
                `;
                
                container.appendChild(particle);
            }, i * 50);
        }
        
        // Clean up container after animation
        setTimeout(() => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }, 2000);
    }
    
    createBalloonEffect() {
        const container = document.createElement('div');
        container.className = 'balloon-container';
        container.dataset.createdAt = Date.now(); // Track when created
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9998;
        `;
        
        document.getElementById('game-container').appendChild(container);
        
        // Create many colorful balloons
        const balloonCount = Math.floor(Math.random() * 10) + 15; // 15-25 balloons
        const colors = ['#FF69B4', '#FFD700', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C', '#FF6347', '#40E0D0'];
        
        for (let i = 0; i < balloonCount; i++) {
            setTimeout(() => {
                const balloon = document.createElement('div');
                balloon.className = 'party-balloon';
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = Math.random() * 30 + 25; // 25-55px
                const startX = Math.random() * 100;
                
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
                `;
                
                // Add balloon string
                const string = document.createElement('div');
                string.style.cssText = `
                    position: absolute;
                    width: 1px;
                    height: 50px;
                    background: #666;
                    left: 50%;
                    top: 100%;
                    transform: translateX(-50%);
                `;
                balloon.appendChild(string);
                
                container.appendChild(balloon);
            }, i * 100);
        }
        
        // Clean up after animation completes (max animation is 6s)
        setTimeout(() => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }, 6500);
    }
    
    createGiantGarEffect() {
        const giantGar = document.createElement('img');
        giantGar.src = 'graphics/enemies/prehistoric_gar.png';
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
        `;
        
        document.body.appendChild(giantGar);
        
        setTimeout(() => {
            if (giantGar.parentNode) {
                giantGar.parentNode.removeChild(giantGar);
            }
        }, 3000);
    }
    
    // Helper to convert any sprite path to its party hat variant
    getPartyHatSprite(spritePath) {
        if (!spritePath) return null;
        
        // All party hat variants are in a 'partyhat' subfolder
        // e.g., graphics/enemies/x.png -> graphics/enemies/partyhat/x_partyhat.png
        // e.g., graphics/main_fish/x.png -> graphics/main_fish/partyhat/x_partyhat.png
        
        const parts = spritePath.split('/');
        const filename = parts.pop().replace('.png', '');
        const folder = parts.join('/');
        
        return `${folder}/partyhat/${filename}_partyhat.png`;
    }
    
    addPartyHatToEnemy() {
        const enemyFish = document.getElementById('enemy-fish-combat');
        if (!enemyFish || !this.currentEnemy) return;
        
        const partyHatSprite = this.getPartyHatSprite(this.currentEnemy.sprite);
        if (partyHatSprite) {
            enemyFish.src = partyHatSprite;
            // Mark that we've applied party hat so UI doesn't reset it
            this.currentEnemy.hasPartyHat = true;
        }
    }
    
    addPartyHatToPlayer() {
        // Just mark that player has party hat - UI will handle the visual update
        this.playerHasPartyHat = true;
        
        // Let UI handle the actual sprite updates through its update methods
        if (this.ui) {
            this.ui.updatePlayerSpritesWithPartyHat();
        }
    }
    
    applyRainbowHP() {
        // Let UI handle the visual rainbow effect
        if (this.ui) {
            this.ui.applyRainbowHPEffect();
        }
    }
    
    // Combat log management
    addToCombatLog(message) {
        this.combatLog.unshift(message); // Add to beginning
        if (this.combatLog.length > 10) {
            this.combatLog = this.combatLog.slice(0, 10); // Keep only last 10 messages
        }
    }
    
    // Reset to initial state
    // Helper method to shake any sprite element
    shakeSprite(elementId, duration = 500) {
        const sprite = document.getElementById(elementId);
        if (sprite) {
            sprite.classList.add('shake');
            setTimeout(() => {
                sprite.classList.remove('shake');
            }, duration);
        }
    }
    
    // Shake player sprite when taking damage
    shakePlayerSprite() {
        // Shake both combat sprite and stats panel sprite
        this.shakeSprite('player-fish-combat');
        this.shakeSprite('stats-player-sprite');
    }
    
    // Shake enemy sprite when taking damage
    shakeEnemySprite() {
        this.shakeSprite('enemy-fish-combat');
    }
    
    reset() {
        this.currentEnemy = null;
        this.defeatedEnemy = null;
        this.combatLog = [];
        this.combatActive = false;
        this.hasDefeatedGar = false;
        this.garTurnCounter = 0;
        this.lastVictoryWasLevel10 = false;
        this.hasReachedEdge = false;
        this.playerHasPartyHat = false;
        this.currentCombatBefriending = false;
        this.hasAchievedPeace = false;
        
        // Clear any pending level up timeout
        if (this.levelUpTimeout) {
            clearTimeout(this.levelUpTimeout);
            this.levelUpTimeout = null;
        }
    }
    
    // Getters for UI
    getCombatLog() {
        return this.combatLog;
    }
    
    getCurrentEnemy() {
        return this.currentEnemy;
    }
    
    isCombatActive() {
        return this.combatActive;
    }
    
    shouldShowCongratulations() {
        return this.lastVictoryWasLevel10;
    }
    
    clearCongratulationsFlag() {
        this.lastVictoryWasLevel10 = false;
    }
    
    shouldShowPeaceMessage() {
        return this.hasAchievedPeace;
    }
    
    clearPeaceMessageFlag() {
        this.hasAchievedPeace = false;
    }
    
    isBefriendingCurrentEnemy() {
        return this.currentCombatBefriending;
    }
    
    // Check if all enemies are peaceful (all regular enemies befriended and Gar defeated)
    areAllEnemiesPeaceful() {
        // Check if Gar is defeated
        if (!this.hasDefeatedGar) {
            return false;
        }
        
        // Check if all 4 regular enemy types are befriended
        const regularEnemies = [
            'Aggressive Guppy',
            'Territorial Angelfish', 
            'Sneaky Catfish',
            'Fierce Cichlid'
        ];
        
        for (const enemyName of regularEnemies) {
            if (!this.player.isFriendsWith(enemyName)) {
                return false;
            }
        }
        
        return true;
    }
    
    // Proper interfaces for UI interaction (no direct method exposure)
    displayCombatMessage(message) {
        this.addToCombatLog(message);
    }
    
    processCombatVictory(callback) {
        // Delegate to the established method but with proper interface
        this.completeEnemyDefeat(callback);
    }
}

// === WORLD MODULE ===
/**
 * World Management Module
 * 
 * Handles world map generation, player movement, and encounter systems.
 * Manages village state, world exploration, treasure discovery, and
 * coordinates encounter generation based on player location.
 */
class WorldManager {
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
        // Allow movement to the edge zone where Gar spawns (coordinates 1-19 with 21x21 grid)
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
        
        // If no enemy spawned (all species are friends in this zone), convert to peaceful encounter
        if (!enemy) {
            return {
                type: 'peaceful',
                message: "Your fish friends swim by peacefully!",
                effectMessage: null
            };
        }
        
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
            // Village is just center tile, so place one tile south
            this.currentX = this.VILLAGE_CENTER.x; // Keep X at village center
            this.currentY = this.VILLAGE_CENTER.y + 1; // Move one tile south of village
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
        const innCost = GameConfig.SHOP.INN_REST.cost;
        
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
    
    getCurrentDialogueState() {
        return this.npcs.getCurrentDialogueState();
    }
    
    // Teleport player to village
    teleportToVillage() {
        this.currentX = this.VILLAGE_CENTER.x;
        this.currentY = this.VILLAGE_CENTER.y;
        this.inVillage = true;
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
        this.npcs.reset();
        // Note: worldMap doesn't need reset as it's static
    }
    
    // Getters for UI
    isInVillage() { return this.inVillage; }
}

// === UI MODULE ===
/**
 * User Interface Module
 * 
 * Manages all game screens, user interactions, visual displays, and
 * DOM manipulation. Coordinates between user input and game logic,
 * handles character creation, dialogue systems, and world map rendering.
 */
class UIManager {
    constructor(player, audioManager, combatManager, worldManager) {
        this.player = player;
        this.audio = audioManager;
        this.combat = combatManager;
        this.world = worldManager;
        this.core = null; // Set later via setCoreManager
        this.dialog = new DialogManager(audioManager);
        
        // UI state
        this.currentScreen = 'start';
        this.shopOpen = false;
        this.dialogueActive = false;
        this.blockVillageExit = false; // Prevent immediate exit after village entry
        this.defeatInProgress = false; // Prevent duplicate defeat handling
        
        // World map visual state
        this.ricePaddyPositions = this.generateRicePaddyPositions();
        this.playerMapPosition = { x: 50, y: 50 }; // Center of map initially
        this.playerFacing = 'right'; // Track which direction player is facing
        
        // Betta names for character creation - use configuration
        this.betteNames = GameStrings.CHARACTER_CREATION.RANDOM_NAMES;
        
        // Initialize UI after DOM is ready
        this.initializeUI();
    }
    
    // Set core reference (called after construction to avoid circular dependency)
    setCoreManager(coreManager) {
        this.core = coreManager;
        this.setupVersionInfo(); // Update version info with full metadata
    }
    
    // Setup dynamic version info with link
    setupVersionInfo() {
        const versionElement = document.getElementById('version-info');
        if (versionElement) {
            if (this.core) {
                const versionInfo = this.core.getVersion();
                versionElement.innerHTML = `<a href="${versionInfo.website}" target="_blank">v${versionInfo.version}</a>`;
            } else {
                // Fallback when core isn't set yet - will be updated later
                versionElement.innerHTML = `<a href="${GameConfig.GAME.WEBSITE}" target="_blank">v${GameConfig.GAME.VERSION}</a>`;
            }
        }
    }
    
    generateRandomName() {
        const randomIndex = Math.floor(Math.random() * this.betteNames.length);
        return this.betteNames[randomIndex];
    }
    
    // Helper method to check if a button is visible
    isButtonVisible(buttonId) {
        const button = document.getElementById(buttonId);
        return button && button.style.display !== 'none' && !button.disabled;
    }
    
    // Combat action methods (called by keyboard shortcuts and buttons)
    attack() {
        if (this.combat.isCombatActive()) {
            const result = this.combat.attack();
            this.updateCombatDisplay();
            if (result && result.enemyDefeated) {
                this.handleCombatVictory(result);
            }
        }
    }
    
    useSkill(spellType) {
        if (this.combat.isCombatActive()) {
            const result = this.combat.useSkill(spellType);
            this.updateCombatDisplay();
            if (result && result.enemyDefeated) {
                this.handleCombatVictory(result);
            }
        }
    }
    
    swimAway() {
        if (this.combat.isCombatActive()) {
            const escaped = this.combat.runAway();
            if (escaped) {
                this.showWorldMap();
            }
            this.updateCombatDisplay();
        }
    }
    
    // Method called by inline onclick handlers
    buyItem(itemId) {
        const result = this.world.buyItem(itemId);
        if (itemId === 'submarine') {
            // Special handling for submarine purchase
            this.dialog.showSubmarinePurchase(() => {
                this.endDialogue();
            });
        } else {
            // Regular item purchase confirmation
            this.dialog.showPurchaseConfirmation(result.message, () => {
                this.endDialogue();
            });
        }
    }

    initializeUI() {
        this.setupEventListeners();
        this.initializeStrings();
        this.showStartScreen();
        this.updateAllDisplays();
        this.setupVersionInfo();
    }
    
    initializeStrings() {
        // Screen titles
        const villageTitle = document.getElementById('village-title');
        if (villageTitle) villageTitle.textContent = GameStrings.LOCATIONS.VILLAGE.NAME;
        
        const worldMapTitle = document.getElementById('world-map-title');
        if (worldMapTitle) worldMapTitle.textContent = GameStrings.LOCATIONS.WORLD_MAP.NAME;
        
        const combatTitle = document.getElementById('combat-title');
        if (combatTitle) combatTitle.textContent = GameStrings.UI.SCREENS.COMBAT_TITLE;
        
        // Location descriptions
        const villageDescription = document.getElementById('village-description');
        if (villageDescription) villageDescription.textContent = GameStrings.LOCATIONS.VILLAGE.DESCRIPTION;
        
        const worldMapDescription = document.getElementById('world-map-description');
        if (worldMapDescription) worldMapDescription.textContent = GameStrings.LOCATIONS.WORLD_MAP.DESCRIPTION;
        
        // Village locations - use automatic button processing for consistent shortcuts
        this.villageButtons = StringFormatter.processButtonTexts([
            GameStrings.LOCATIONS.VILLAGE.BUILDINGS.ELDER_DWELLING,
            GameStrings.LOCATIONS.VILLAGE.BUILDINGS.FISH_MART,
            GameStrings.LOCATIONS.VILLAGE.BUILDINGS.VILLAGE_GUARD,
            GameStrings.LOCATIONS.VILLAGE.BUILDINGS.BUBBLES_HOME,
            GameStrings.LOCATIONS.VILLAGE.BUILDINGS.SWISHY_SOLACE_INN,
            GameStrings.LOCATIONS.VILLAGE.BUILDINGS.EXIT_TO_PADDIES
        ]);
        
        const elderDwelling = document.getElementById('elder-dwelling');
        if (elderDwelling) elderDwelling.innerHTML = this.villageButtons[0].html;
        
        const fishMart = document.getElementById('fish-mart');
        if (fishMart) fishMart.innerHTML = this.villageButtons[1].html;
        
        const villageGuard = document.getElementById('village-guard');
        if (villageGuard) villageGuard.innerHTML = this.villageButtons[2].html;
        
        const bubblesHome = document.getElementById('bubbles-home');
        if (bubblesHome) bubblesHome.innerHTML = this.villageButtons[3].html;
        
        const swishySolaceInn = document.getElementById('swishy-solace-inn');
        if (swishySolaceInn) swishySolaceInn.innerHTML = this.villageButtons[4].html;
        
        const exitToPaddies = document.getElementById('exit-to-paddies');
        if (exitToPaddies) exitToPaddies.innerHTML = this.villageButtons[5].html;
        
        // Combat buttons
        const attackBtn = document.getElementById('attack-btn');
        if (attackBtn) {
            const [attackButtonText] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.ATTACK]);
            attackBtn.innerHTML = attackButtonText.html;
            attackBtn.dataset.key = attackButtonText.key;
        }
        
        const swimAwayBtn = document.getElementById('swim-away-btn');
        if (swimAwayBtn) {
            const [swimAwayButtonText] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.SWIM_AWAY]);
            swimAwayBtn.innerHTML = swimAwayButtonText.html;
            swimAwayBtn.dataset.key = swimAwayButtonText.key;
        }
        
        // Navigation buttons - use automated system for shortcuts
        const navigationButtons = StringFormatter.processButtonTexts([
            GameStrings.LOCATIONS.WORLD_MAP.MOVEMENT.SWIM_NORTH,
            GameStrings.LOCATIONS.WORLD_MAP.MOVEMENT.SWIM_SOUTH,
            GameStrings.LOCATIONS.WORLD_MAP.MOVEMENT.SWIM_EAST,
            GameStrings.LOCATIONS.WORLD_MAP.MOVEMENT.SWIM_WEST,
            GameStrings.LOCATIONS.WORLD_MAP.MOVEMENT.RETURN_TO_VILLAGE
        ]);
        
        const swimNorthBtn = document.getElementById('swim-north-btn');
        if (swimNorthBtn) {
            swimNorthBtn.innerHTML = navigationButtons[0].html;
            swimNorthBtn.dataset.key = navigationButtons[0].key;
        }
        
        const swimSouthBtn = document.getElementById('swim-south-btn');
        if (swimSouthBtn) {
            swimSouthBtn.innerHTML = navigationButtons[1].html;
            swimSouthBtn.dataset.key = navigationButtons[1].key;
        }
        
        const swimEastBtn = document.getElementById('swim-east-btn');
        if (swimEastBtn) {
            swimEastBtn.innerHTML = navigationButtons[2].html;
            swimEastBtn.dataset.key = navigationButtons[2].key;
        }
        
        const swimWestBtn = document.getElementById('swim-west-btn');
        if (swimWestBtn) {
            swimWestBtn.innerHTML = navigationButtons[3].html;
            swimWestBtn.dataset.key = navigationButtons[3].key;
        }
        
        const returnVillageBtn = document.getElementById('return-village-btn');
        if (returnVillageBtn) {
            returnVillageBtn.innerHTML = navigationButtons[4].html;
            returnVillageBtn.dataset.key = navigationButtons[4].key;
        }
        
        // Spell buttons - these will be updated dynamically with MP costs
        this.updateSpellButtons();
        
        // Character creation strings
        const nameLabel = document.querySelector('label[for="betta-name"]');
        if (nameLabel) nameLabel.textContent = GameStrings.UI.LABELS.NAME_YOUR_BETTA;
        
        const nameInput = document.getElementById('betta-name');
        if (nameInput) nameInput.placeholder = GameStrings.UI.LABELS.ENTER_NAME;
        
        const randomNameBtn = document.getElementById('random-name-btn');
        if (randomNameBtn) {
            const [newNameButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.NEW_NAME]);
            randomNameBtn.innerHTML = newNameButton.html;
            randomNameBtn.dataset.key = newNameButton.key;
        }
        
        const colorLabels = document.querySelectorAll('label');
        colorLabels.forEach(label => {
            if (label.textContent.includes(GameStrings.SYSTEM.TEXT_CHECKS.CHOOSE_COLOR_TEXT)) {
                label.textContent = GameStrings.UI.LABELS.CHOOSE_COLOR;
            }
        });
        
        const createCharacterBtn = document.getElementById('create-character');
        if (createCharacterBtn) {
            const [startGameButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.START_GAME]);
            createCharacterBtn.innerHTML = startGameButton.html;
            createCharacterBtn.dataset.key = startGameButton.key;
            createCharacterBtn.disabled = true; // Initially disabled until name and color are selected
        }
        
        // Character preview labels
        const namePreviewLabel = document.querySelector('#character-preview p:first-child');
        if (namePreviewLabel && namePreviewLabel.textContent.startsWith('Name:')) {
            namePreviewLabel.innerHTML = `${GameStrings.UI.LABELS.NAME_PREVIEW} <span id="preview-name">${GameStrings.UI.LABELS.UNKNOWN_NAME}</span>`;
        }
        
        const colorPreviewLabel = document.querySelector('#character-preview p:last-child');
        if (colorPreviewLabel && colorPreviewLabel.textContent.startsWith('Color:')) {
            colorPreviewLabel.innerHTML = `${GameStrings.UI.LABELS.COLOR_PREVIEW} <span id="preview-color">${GameStrings.UI.LABELS.CHOOSE_A_COLOR}</span>`;
        }
        
        // Color option labels - now using automated system
        const colorOptions = document.querySelectorAll('.color-option');
        const colorTexts = [];
        const colorMap = {};
        
        colorOptions.forEach(option => {
            const color = option.dataset.color;
            if (color === 'red') {
                colorTexts.push(GameStrings.UI.COLORS.RED);
                colorMap['red'] = colorTexts.length - 1;
            } else if (color === 'blue') {
                colorTexts.push(GameStrings.UI.COLORS.BLUE);
                colorMap['blue'] = colorTexts.length - 1;
            } else if (color === 'purple') {
                colorTexts.push(GameStrings.UI.COLORS.PURPLE);
                colorMap['purple'] = colorTexts.length - 1;
            } else if (color === 'green') {
                colorTexts.push(GameStrings.UI.COLORS.GREEN);
                colorMap['green'] = colorTexts.length - 1;
            } else if (color === 'orange') {
                colorTexts.push(GameStrings.UI.COLORS.ORANGE);
                colorMap['orange'] = colorTexts.length - 1;
            }
        });
        
        const processedColors = StringFormatter.processButtonTexts(colorTexts);
        
        colorOptions.forEach(option => {
            const color = option.dataset.color;
            const index = colorMap[color];
            if (index !== undefined) {
                option.innerHTML = processedColors[index].html;
                option.dataset.key = processedColors[index].key;
            }
        });
        
        // Congratulations popup
        const congratsTitle = document.querySelector('#congratulations-popup h1');
        if (congratsTitle) congratsTitle.textContent = GameStrings.SYSTEM.CONGRATULATIONS.TITLE;
        
        const congratsMessage1 = document.querySelector('#congratulations-popup p:nth-of-type(1)');
        if (congratsMessage1) congratsMessage1.textContent = GameStrings.SYSTEM.CONGRATULATIONS.EDGE_REACHED;
        
        const congratsMessage2 = document.querySelector('#congratulations-popup p.subtitle');
        if (congratsMessage2) congratsMessage2.textContent = GameStrings.SYSTEM.CONGRATULATIONS.MORE_ADVENTURES;
        
        const congratsDevNote = document.querySelector('#congratulations-popup p.dev-note');
        if (congratsDevNote) congratsDevNote.textContent = GameStrings.SYSTEM.CONGRATULATIONS.IN_DEVELOPMENT;
        
        // Setup version info with link (using core reference if available)
        this.setupVersionInfo();
        
        const [congratsButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.CONTINUE_SWIMMING]);
        const congratsBtn = document.getElementById('close-popup');
        if (congratsBtn) {
            congratsBtn.innerHTML = congratsButton.html;
            congratsBtn.dataset.key = congratsButton.key;
        }
        
        // Title screen strings
        const titleH1 = document.querySelector('#title-screen h1');
        if (titleH1) titleH1.textContent = GameStrings.UI.SCREENS.TITLE;
        
        const titleSubtitle = document.querySelector('#title-screen p');
        if (titleSubtitle) titleSubtitle.textContent = GameStrings.UI.SCREENS.SUBTITLE;
        
        const startBtn = document.querySelector('button[onclick*="startCharacterCreation"]');
        if (startBtn) {
            const [startButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.START_ADVENTURE]);
            startBtn.innerHTML = startButton.html;
            startBtn.dataset.key = startButton.key;
        }
        
        // Character creation screen title
        const charCreationTitle = document.querySelector('#character-creation h2');
        if (charCreationTitle) charCreationTitle.textContent = GameStrings.UI.SCREENS.CREATE_YOUR_BETTA;
    }
    
    updateSpellButtons() {
        const bubbleBtn = document.getElementById('bubble-blast-btn');
        if (bubbleBtn) {
            const spell = GameConfig.COMBAT.SPELLS.BUBBLE_BLAST;
            const [bubbleButton] = StringFormatter.processButtonTexts([`Bubble Blast (${spell.mpCost} MP)`]);
            bubbleBtn.innerHTML = bubbleButton.html;
            bubbleBtn.dataset.key = bubbleButton.key;
        }
        
        const balloonBtn = document.getElementById('happy-balloon-btn');
        if (balloonBtn) {
            const spell = GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME;
            const [balloonButton] = StringFormatter.processButtonTexts([`Happy Balloon Time (${spell.mpCost} MP)`]);
            balloonBtn.innerHTML = balloonButton.html;
            balloonBtn.dataset.key = balloonButton.key;
        }
        
        const gravelBtn = document.getElementById('gravel-grenade-btn');
        if (gravelBtn) {
            const spell = GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE;
            const [gravelButton] = StringFormatter.processButtonTexts([`Gravel Grenade (${spell.mpCost} MP)`]);
            gravelBtn.innerHTML = gravelButton.html;
            gravelBtn.dataset.key = gravelButton.key;
        }
    }
    
    setupEventListeners() {
        // Movement buttons
        document.getElementById('northBtn')?.addEventListener('click', () => this.movePlayer('north'));
        document.getElementById('southBtn')?.addEventListener('click', () => this.movePlayer('south'));
        document.getElementById('eastBtn')?.addEventListener('click', () => this.movePlayer('east'));
        document.getElementById('westBtn')?.addEventListener('click', () => this.movePlayer('west'));
        
        // Combat buttons
        document.getElementById('attackBtn')?.addEventListener('click', () => this.playerAttack());
        document.getElementById('bubbleBtn')?.addEventListener('click', () => this.playerCastSpell('bubble'));
        document.getElementById('gravelBtn')?.addEventListener('click', () => this.playerCastSpell('gravel'));
        document.getElementById('runBtn')?.addEventListener('click', () => this.playerRunAway());
        
        // Village buttons
        document.getElementById('enterVillageBtn')?.addEventListener('click', () => this.enterVillage());
        document.getElementById('leaveVillageBtn')?.addEventListener('click', () => this.leaveVillage());
        document.getElementById('shopBtn')?.addEventListener('click', () => this.toggleShop());
        
        // NPC interaction buttons (will be added dynamically)
        
        // Start screen
        document.getElementById('startGameBtn')?.addEventListener('click', () => this.startNewGame());
        
        // Audio toggle
        document.getElementById('audio-toggle')?.addEventListener('click', () => this.toggleAudio());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Enter key handlers for different screens
        document.addEventListener('keydown', (e) => this.handleGlobalKeyboard(e));
    }
    
    
    handleGlobalKeyboard(event) {
        const key = event.key.toLowerCase();
        
        // Handle congratulations popup first (highest priority)
        const popup = document.getElementById('congratulations-popup');
        if (popup && popup.classList.contains('show')) {
            if (key === 'c' || event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                this.hideCongratulationsPopup();
                return;
            }
            return; // Prevent further processing when popup is shown
        }
        
        // Skip if modal dialog is active
        if (this.dialog.isDialogActive()) {
            return;
        }
        
        // Handle dialogue keyboard shortcuts
        if (this.dialogueActive && !this.dialog.isDialogActive()) {
            this.handleDialogueKeyboard(event);
            return;
        }
        
        // Handle shop keyboard shortcuts
        if (this.shopOpen) {
            this.handleShopKeyboard(event);
            return;
        }
        
        // Handle character creation arrow keys and shortcuts (but not when typing in name field)
        if (this.currentScreen === 'character-creation') {
            const nameInput = document.getElementById('betta-name');
            const isNameFieldFocused = document.activeElement === nameInput;
            
            // Tab key to toggle name field focus
            if (key === 'tab') {
                event.preventDefault();
                if (nameInput) {
                    if (isNameFieldFocused) {
                        // If already focused, blur to allow other shortcuts
                        nameInput.blur();
                    } else {
                        // If not focused, focus the field
                        nameInput.focus();
                    }
                }
                return;
            }
            
            // Arrow keys for color cycling (only when not in name field)
            if (!isNameFieldFocused && (key === 'arrowleft' || key === 'arrowright')) {
                event.preventDefault();
                this.cycleColorSelection(key === 'arrowright' ? 1 : -1);
                return;
            }
            
            // Check button shortcuts using data-key attributes from automated system
            // Only process shortcuts when not typing in the name field
            if (!isNameFieldFocused) {
                const buttons = document.querySelectorAll('button[data-key]');
                buttons.forEach(button => {
                    if (button.dataset.key === key && !button.disabled) {
                        event.preventDefault();
                        button.click();
                        return;
                    }
                });
            }
            
            // Letter keys for color selection (only when not in name field)
            // Now using the automated key assignments from processButtonTexts
            if (!isNameFieldFocused) {
                const colorOptions = document.querySelectorAll('.color-option');
                colorOptions.forEach(option => {
                    if (option.dataset.key === key) {
                        event.preventDefault();
                        option.click();
                        return;
                    }
                });
            }
        }
        
        // Handle title screen shortcuts
        if (this.currentScreen === 'title-screen' && key === 's') {
            event.preventDefault();
            const startButton = document.querySelector('button[onclick*="startCharacterCreation"]');
            if (startButton) startButton.click();
            return;
        }
        
        // Handle Enter key for different screens
        if (event.key === 'Enter') {
            switch(this.currentScreen) {
                case 'title-screen':
                    // Trigger Start Adventure button
                    const startButton = document.querySelector('button[onclick*="startCharacterCreation"]');
                    if (startButton) startButton.click();
                    break;
                    
                case 'character-creation':
                    // Trigger Begin Adventure button if enabled
                    const createButton = document.getElementById('create-character');
                    if (createButton && !createButton.disabled) {
                        createButton.click();
                    }
                    break;
            }
        }
    }
    
    handleDialogueKeyboard(event) {
        const key = event.key.toLowerCase();
        const dialogueOptions = document.querySelectorAll('#dialogue-options .dialogue-option:not(.disabled), #dialogue-options button');
        
        // Check if we're in shop mode within dialogue (shop content is showing)
        const dialogueText = document.getElementById('dialogue-text');
        const isInShopMode = dialogueText && dialogueText.innerHTML.includes(GameStrings.SYSTEM.TEXT_CHECKS.SHOP_INVENTORY_TEXT);
        
        // Handle shop-specific keys when in shop mode
        if (isInShopMode) {
            // Handle Maybe Later button
            if (key === 'm' || key === 'enter') {
                event.preventDefault();
                this.endDialogue();
                return;
            }
            
            // Handle dynamic shop item keys
            const shopItems = document.querySelectorAll('.shop-item[data-key]');
            for (const item of shopItems) {
                if (item.dataset.key === key && item.classList.contains('shop-item-buyable')) {
                    event.preventDefault();
                    item.click(); // Trigger the onclick handler
                    return;
                }
            }
        }
        
        switch(key) {
            case 'c':
                event.preventDefault();
                // Continue dialogue if available
                const continueBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('continue'));
                if (continueBtn) continueBtn.click();
                break;
                
            case 'enter':
                event.preventDefault();
                // Default Enter behavior based on context
                const dialogueState = this.world.getCurrentDialogueState();
                
                // First check for Continue button (works for all NPCs)
                const enterContinueBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('continue'));
                if (enterContinueBtn) {
                    enterContinueBtn.click();
                } else if (dialogueState && dialogueState.isShop) {
                    // In shop NPC final dialogue: Enter = Browse Items, or Goodbye if no Browse
                    const browseBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('browse'));
                    if (browseBtn) {
                        browseBtn.click();
                    } else {
                        const goodbyeBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('goodbye'));
                        if (goodbyeBtn) goodbyeBtn.click();
                    }
                } else if (dialogueState && dialogueState.isInn) {
                    // In inn NPC final dialogue: Enter = Rest (if affordable), otherwise Goodbye
                    const allOptions = document.querySelectorAll('#dialogue-options .dialogue-option, #dialogue-options button');
                    const restBtn = [...allOptions].find(btn => btn.textContent.toLowerCase().includes('rest') && !btn.classList.contains('disabled'));
                    if (restBtn) {
                        restBtn.click();
                    } else {
                        const goodbyeBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('goodbye'));
                        if (goodbyeBtn) goodbyeBtn.click();
                    }
                } else {
                    // Regular NPC final dialogue: Enter = Goodbye
                    const goodbyeBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('goodbye'));
                    if (goodbyeBtn) goodbyeBtn.click();
                }
                break;
                
            case 'r':
                event.preventDefault();
                // Rest at inn if available and affordable - check all options including disabled
                const allDialogueOptions = document.querySelectorAll('#dialogue-options .dialogue-option, #dialogue-options button');
                const restBtn = [...allDialogueOptions].find(btn => btn.textContent.toLowerCase().includes('rest') && !btn.classList.contains('disabled'));
                if (restBtn) {
                    restBtn.click();
                } else {
                    // Check if we're at inn and show message if not enough bites
                    const innDialogueState = this.world.getCurrentDialogueState();
                    if (innDialogueState && innDialogueState.isInn) {
                        const costMessage = StringFormatter.format(GameStrings.INN.REST_NOT_ENOUGH, { cost: GameConfig.SHOP.INN_REST.cost });
                        this.displayMessage(costMessage);
                    }
                }
                break;
                
            case 'b':
                event.preventDefault();
                // Browse items if available
                const browseBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('browse'));
                if (browseBtn) {
                    browseBtn.click();
                }
                break;
                
            case 'g':
                event.preventDefault();
                // Goodbye
                const goodbyeBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('goodbye'));
                if (goodbyeBtn) goodbyeBtn.click();
                break;
                
            case 'd':
                event.preventDefault();
                // Dunkleosteus Submarine (if affordable and clickable)
                const dunkleosteusSub = document.querySelector('.shop-item-buyable .item-name');
                if (dunkleosteusSub && dunkleosteusSub.innerHTML.includes('Dunkleosteus')) {
                    dunkleosteusSub.closest('.shop-item').click();
                }
                break;
                
            case 'k':
                event.preventDefault();
                // Kelp Snack (if affordable and clickable)
                const kelpSnack = [...document.querySelectorAll('.shop-item-buyable .item-name')].find(item => 
                    item.innerHTML.includes('Kelp'));
                if (kelpSnack) {
                    kelpSnack.closest('.shop-item').click();
                }
                break;
                
        }
    }
    
    handleShopKeyboard(event) {
        const key = event.key.toLowerCase();
        
        switch(key) {
            case 'l':
            case 'enter':
                event.preventDefault();
                // Leave shop
                this.toggleShop();
                break;
                
            case 'd':
                event.preventDefault();
                // Buy Dunkleosteus Submarine
                this.buyItem('submarine');
                break;
                
            case 'k':
                event.preventDefault();
                // Buy Kelp Snack
                this.buyItem('kelp_snack');
                break;
                
            case 'b':
                event.preventDefault();
                // Buy Bubble Water
                this.buyItem('bubble_water');
                break;
        }
    }
    
    handleKeyboard(event) {
        if (this.dialogueActive || this.currentScreen === 'start' || this.dialog.isDialogActive()) return;
        
        const key = event.key.toLowerCase();
        
        // Combat controls (highest priority when in combat)
        if (this.currentScreen === 'combat' && this.combat.isCombatActive()) {
            switch(key) {
                case 'a':
                    event.preventDefault();
                    this.playerAttack();
                    break;
                case 'b':
                    event.preventDefault();
                    if (this.isButtonVisible('bubble-blast-btn') && this.player.canCastSpell('bubble')) {
                        this.playerCastSpell('bubble');
                    } else if (!this.player.canCastSpell('bubble')) {
                        this.combat.displayCombatMessage(StringFormatter.format(GameStrings.COMBAT.NOT_ENOUGH_MP, { spellName: GameConfig.COMBAT.SPELLS.BUBBLE_BLAST.name }));
                        this.updateCombatLog();
                    }
                    break;
                case 'h':
                    event.preventDefault();
                    if (this.player.hasSpell('party')) {
                        if (this.player.canCastSpell('party')) {
                            this.playerCastSpell('party');
                        } else {
                            // Not enough MP
                            this.combat.displayCombatMessage(StringFormatter.format(GameStrings.COMBAT.NOT_ENOUGH_MP, { spellName: GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME.name }));
                            this.updateCombatLog();
                        }
                    }
                    // If player doesn't have spell yet, silently ignore
                    break;
                case 'g':
                    event.preventDefault();
                    if (this.player.hasSpell('gravel')) {
                        if (this.player.canCastSpell('gravel')) {
                            this.playerCastSpell('gravel');
                        } else {
                            // Not enough MP
                            this.combat.displayCombatMessage(StringFormatter.format(GameStrings.COMBAT.NOT_ENOUGH_MP, { spellName: GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE.name }));
                            this.updateCombatLog();
                        }
                    }
                    // If player doesn't have spell yet, silently ignore
                    break;
                case 's':
                    event.preventDefault();
                    this.playerRunAway();
                    break;
            }
            return; // Don't process other keys during combat
        }
        
        // World map controls
        if (this.currentScreen === 'world-map') {
            switch(event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    this.movePlayer('north');
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    this.movePlayer('south');
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    this.movePlayer('west');
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.movePlayer('east');
                    break;
                case 'Home':
                    event.preventDefault();
                    this.returnToVillage();
                    break;
            }
        }
        
        // Village controls - use automatically assigned keys
        if (this.currentScreen === 'village') {
            // Handle dynamically assigned village building shortcuts
            if (this.villageButtons) {
                const actions = ['elder', 'merchant', 'guard', 'bubble', 'innkeeper', 'exit'];
                
                this.villageButtons.forEach((button, index) => {
                    if (button.key === key) {
                        event.preventDefault();
                        if (index === 5) { // Exit to paddies
                            this.leaveVillage();
                        } else {
                            this.talkToNPC(actions[index]);
                        }
                        return;
                    }
                });
            }
            switch(event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    // Only exit village if not blocked (prevents immediate exit after entry)
                    if (!this.blockVillageExit) {
                        this.leaveVillage();
                    }
                    return; // Prevent further processing of this keypress
            }
        }
        
        // Cheat codes (work on any screen except dialogue/start)
        if (key === '$') {
            event.preventDefault();
            this.player.gainBettaBites(100);
            this.displayMessage(GameStrings.SYSTEM.CHEATS.BETTA_BITES_ADDED);
            this.updateAllDisplays();
        }
        
        if (key === '%') {
            event.preventDefault();
            const expNeeded = this.player.getExpToNext() - this.player.getExp();
            if (this.player.gainExp(expNeeded)) {
                const gains = this.player.levelUp();
                this.audio.playSound('levelup');
                this.displayMessage(GameStrings.SYSTEM.CHEATS.LEVEL_UP_APPLIED);
                this.updateAllDisplays();
            }
        }
        
        if (key === '+') {
            event.preventDefault();
            this.player.fullHeal();
            this.displayMessage(GameStrings.SYSTEM.CHEATS.HP_MP_RESTORED);
            this.updateAllDisplays();
        }
        
    }
    
    // Screen management
    showScreen(screenId) {
        const screenMap = {
            'title-screen': 'title-screen',
            'character-creation': 'character-creation',
            'village': 'village',
            'world-map': 'world-map', 
            'dialogue': 'dialogue',
            'combat': 'combat'
        };
        
        this.currentScreen = screenId;
        this.hideAllScreens();
        
        const elementId = screenMap[screenId] || 'gameArea';
        this.showElement(elementId);
        
        // Screen-specific setup
        switch(screenId) {
            case 'title-screen':
                break;
            case 'character-creation':
                // Character creation screen setup (no circular call)
                break;
            case 'village':
                this.showVillageScreen();
                break;
            case 'world-map':
                this.showWorldMapScreen();
                break;
            case 'dialogue':
                // Dialogue overlay handled separately
                break;
            case 'combat':
                this.showCombatScreen();
                break;
        }
        
        this.updateAllDisplays();
    }
    
    showStartScreen() {
        this.showScreen('title-screen');
        this.hideStatsPanel();
    }
    
    showGameScreen() {
        // Determine screen based on current location
        if (this.world.isInVillage()) {
            this.showScreen('village');
        } else {
            this.showScreen('world-map');
        }
    }
    
    showVillageScreen() {
        // Village-specific UI setup - don't show message on every visit
        // Apply water background consistently (looks better than blue gradient)
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.backgroundImage = 'url(graphics/map/water-tile-dark.png)';
            gameContainer.style.backgroundRepeat = 'repeat';
            gameContainer.style.backgroundSize = '64px 64px';
        }
        
        // Clean up world map dynamic styles but keep base water background
        const existingStyle = document.getElementById('dynamic-world-style');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        this.showStatsPanel();
    }
    
    showWorldMapScreen() {
        // World map specific UI setup (don't auto-display message - only show when actually leaving village)
        this.createLayeredWorldBackground();
        this.showRicePaddies();
        this.showPlayerOnMap();
        this.showStatsPanel();
    }
    
    showCombatScreen() {
        // Clear enemy sprite immediately to prevent flash of previous enemy
        const enemySprite = document.getElementById('enemy-fish-combat');
        if (enemySprite) {
            enemySprite.style.visibility = 'hidden';
            enemySprite.src = '';
        }
        
        // Combat screen setup
        this.showStatsPanel(); // Show stats during combat
        this.updateCombatDisplay();
        this.enableCombatButtons();
    }
    
    hideAllScreens() {
        const screens = ['title-screen', 'character-creation', 'village', 'world-map', 'dialogue', 'combat'];
        screens.forEach(id => this.hideElement(id));
    }
    
    showElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('active');
            element.style.display = 'block';
        }
    }
    
    hideElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('active');
            element.style.display = 'none';
        }
    }
    
    // Game initialization
    startNewGame() {
        this.showCharacterCreation();
    }
    
    showCharacterCreation() {
        // Show the proper character creation screen
        this.showScreen('character-creation');
        this.hideStatsPanel();
        
        // Set up character creation form
        this.setupCharacterCreationForm();
    }
    
    setupCharacterCreationForm() {
        // Initialize form state with defaults
        let selectedColor = 'red'; // Default color
        const defaultName = this.generateRandomName(); // Random default name
        
        // Get elements
        const nameInput = document.getElementById('betta-name');
        const previewName = document.getElementById('preview-name');
        const createButton = document.getElementById('create-character');
        const randomNameBtn = document.getElementById('random-name-btn');
        const colorOptions = document.querySelectorAll('.color-option');
        const previewColor = document.getElementById('preview-color');
        const bettaPreview = document.getElementById('betta-preview');
        
        // Clear any existing event listeners by cloning elements (only if they exist)
        if (nameInput && nameInput.parentNode) {
            const newNameInput = nameInput.cloneNode(true);
            nameInput.parentNode.replaceChild(newNameInput, nameInput);
        }
        if (createButton && createButton.parentNode) {
            const newCreateButton = createButton.cloneNode(true);
            createButton.parentNode.replaceChild(newCreateButton, createButton);
        }
        if (randomNameBtn && randomNameBtn.parentNode) {
            const newRandomBtn = randomNameBtn.cloneNode(true);
            randomNameBtn.parentNode.replaceChild(newRandomBtn, randomNameBtn);
        }
        
        // Re-get elements after cloning
        const nameInputNew = document.getElementById('betta-name');
        const createButtonNew = document.getElementById('create-character');
        const randomNameBtnNew = document.getElementById('random-name-btn');
        
        // Set default values AFTER cloning
        if (nameInputNew) nameInputNew.value = defaultName;
        if (previewName) previewName.textContent = defaultName;
        if (previewColor) previewColor.textContent = GameConfig.UI.COLORS.RED.name;
        
        // Set default color selection (red)
        colorOptions.forEach(option => {
            if (option.dataset.color === 'red') {
                option.classList.add('selected');
                if (bettaPreview) {
                    bettaPreview.style.filter = 'hue-rotate(0deg) saturate(1.2)';
                }
            } else {
                option.classList.remove('selected');
            }
        });
        
        // Enable the create button with defaults
        this.updateCreateButtonState(defaultName, selectedColor);
        
        // Name input handler
        if (nameInputNew) {
            nameInputNew.addEventListener('input', () => {
                const name = nameInputNew.value.trim();
                if (previewName) previewName.textContent = name || GameStrings.CHARACTER_CREATION.PREVIEW.UNKNOWN_NAME;
                this.updateCreateButtonState(name, selectedColor);
            });
            
            // Handle Enter key in name field
            nameInputNew.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const createButton = document.getElementById('create-character');
                    if (createButton && !createButton.disabled) {
                        createButton.click();
                    }
                }
            });
        }
        
        // Random name button
        if (randomNameBtnNew) {
            randomNameBtnNew.addEventListener('click', () => {
                const randomName = this.generateRandomName();
                if (nameInputNew) nameInputNew.value = randomName;
                if (previewName) previewName.textContent = randomName;
                this.updateCreateButtonState(randomName, selectedColor);
            });
        }
        
        // Color selection handlers
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove previous selection
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selection to clicked option
                option.classList.add('selected');
                
                // Update preview
                selectedColor = option.dataset.color;
                if (previewColor) {
                    previewColor.textContent = selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1);
                }
                
                // Update betta preview with color filter
                if (bettaPreview) {
                    const filters = {
                        red: 'hue-rotate(0deg) saturate(1.2)',
                        blue: 'hue-rotate(180deg) saturate(1.3)',
                        purple: 'hue-rotate(270deg) saturate(1.8)',
                        green: 'hue-rotate(140deg) saturate(1.2) brightness(0.85)',
                        orange: 'hue-rotate(30deg) saturate(1.8) brightness(1.1)'
                    };
                    bettaPreview.style.filter = filters[selectedColor] || 'none';
                }
                
                const currentName = nameInputNew ? nameInputNew.value.trim() : '';
                this.updateCreateButtonState(currentName, selectedColor);
            });
        });
        
        // Create character button
        if (createButtonNew) {
            createButtonNew.addEventListener('click', () => {
                const name = nameInputNew ? nameInputNew.value.trim() : '';
                if (name && selectedColor) {
                    this.player.setPlayerIdentity(name, selectedColor);
                    
                    this.showScreen('village');
                    this.displayMessage(StringFormatter.format(GameStrings.CHARACTER_CREATION.WELCOME_MESSAGE, { playerName: name }));
                }
            });
        }
    }
    
    updateCreateButtonState(name, color) {
        const createButton = document.getElementById('create-character');
        if (createButton) {
            if (name && color) {
                createButton.disabled = false;
                const [startButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.START_GAME]);
                createButton.innerHTML = startButton.html;
                createButton.dataset.key = startButton.key;
            } else {
                createButton.disabled = true;
                createButton.textContent = name ? GameStrings.UI.LABELS.CHOOSE_COLOR : color ? GameStrings.UI.LABELS.ENTER_NAME : GameStrings.UI.LABELS.ENTER_NAME_AND_CHOOSE_COLOR;
            }
        }
    }
    
    cycleColorSelection(direction) {
        const colorOptions = document.querySelectorAll('.color-option');
        const colors = Array.from(colorOptions).map(opt => opt.dataset.color);
        
        // Find currently selected color
        let currentIndex = -1;
        colorOptions.forEach((opt, index) => {
            if (opt.classList.contains('selected')) {
                currentIndex = index;
            }
        });
        
        // If no selection, start at first
        if (currentIndex === -1) currentIndex = 0;
        
        // Calculate new index with wrapping
        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = colors.length - 1;
        if (newIndex >= colors.length) newIndex = 0;
        
        // Click the new color option to trigger all the update logic
        if (colorOptions[newIndex]) {
            colorOptions[newIndex].click();
        }
    }
    
    // Select color by name
    selectColorByName(colorName) {
        const colorOptions = document.querySelectorAll('.color-option');
        
        // Find the color option with matching data-color attribute
        colorOptions.forEach(option => {
            if (option.dataset.color === colorName) {
                option.click();
            }
        });
    }
    
    // Movement handling
    movePlayer(direction) {
        if (this.combat.isCombatActive() || this.dialogueActive) return;
        
        // Update facing direction
        if (direction === 'east') {
            this.playerFacing = 'right';
        } else if (direction === 'west') {
            this.playerFacing = 'left';
        }
        
        // Show directional movement messages before moving
        if (!this.world.isInVillage()) {
            const directionTexts = {
                north: GameStrings.EXPLORATION.MOVEMENT.DIRECTIONS.NORTH,
                south: GameStrings.EXPLORATION.MOVEMENT.DIRECTIONS.SOUTH,
                east: GameStrings.EXPLORATION.MOVEMENT.DIRECTIONS.EAST,
                west: GameStrings.EXPLORATION.MOVEMENT.DIRECTIONS.WEST
            };
            this.displayMessage(directionTexts[direction]);
        }
        
        const result = this.world.movePlayer(direction);
        
        if (!result.success) {
            this.displayMessage(result.reason);
            return;
        }
        
        
        // Update screen based on location change
        const wasInVillage = this.currentScreen === 'village';
        const nowInVillage = this.world.isInVillage();
        
        if (wasInVillage && !nowInVillage) {
            this.showScreen('world-map');
        } else if (!wasInVillage && nowInVillage) {
            this.showScreen('village');
            // Block village exit briefly to prevent immediate exit
            this.blockVillageExit = true;
            setTimeout(() => {
                this.blockVillageExit = false;
            }, 100);
        }
        
        // Handle movement result
        if (result.message) {
            this.displayMessage(result.message);
        }
        
        // Handle edge congratulations
        if (result.showCongratulations) {
            this.showCongratulationsPopup();
        }
        
        // Handle encounters
        if (result.encounter) {
            this.handleEncounter(result.encounter);
        }
        
        // Update player position on map
        this.updatePlayerMapPosition();
        
        this.updateAllDisplays();
    }
    
    // Encounter handling
    handleEncounter(encounter) {
        switch (encounter.type) {
            case 'combat':
                // Display edge zone warning if present
                if (encounter.message) {
                    this.displayMessage(encounter.message);
                }
                this.startCombat(encounter.enemy);
                break;
                
            case 'treasure':
                this.displayMessage(encounter.message);
                break;
                
            case 'peaceful':
                this.displayMessage(encounter.message);
                break;
                
            case 'mystery':
                this.displayMessage(encounter.message);
                if (encounter.effectMessage) {
                    const MYSTERY_MESSAGE_DELAY = 1000; // Delay before showing second mystery message
                    setTimeout(() => this.displayMessage(encounter.effectMessage), MYSTERY_MESSAGE_DELAY);
                }
                break;
        }
    }
    
    // Combat UI
    startCombat(enemy) {
        this.showScreen('combat');
        
        // Clear any lingering rainbow effects and friendship messages from previous combats
        const enemyHPBar = document.getElementById('enemy-hp-bar');
        if (enemyHPBar) {
            enemyHPBar.classList.remove('rainbow-friendship');
            enemyHPBar.style.width = ''; // Reset width to default
        }
        
        // Reset the HP container text to proper format
        const enemyHPContainer = document.querySelector('.enemy-combat > div:last-child');
        if (enemyHPContainer) {
            // Restore the HP: prefix if it was replaced with friendship message
            if (!enemyHPContainer.innerHTML.includes('HP:')) {
                enemyHPContainer.innerHTML = 'HP: <span id="enemy-hp-text"></span>';
            }
        }
        
        this.updateCombatDisplay();
        this.enableCombatButtons();
        
        // Remove combat-over class for new battle
        document.getElementById('combat')?.classList.remove('combat-over');
    }
    
    endCombat() {
        // Store whether we need to show peace message after congratulations
        const needsPeaceMessage = this.combat.shouldShowPeaceMessage();
        
        // Check for max level victory congratulations before ending combat
        if (this.combat.shouldShowCongratulations()) {
            this.showCongratulationsPopup(() => {
                // Callback when congratulations is closed
                if (needsPeaceMessage) {
                    this.showPeaceMessage();
                    this.combat.clearPeaceMessageFlag();
                }
            });
            this.combat.clearCongratulationsFlag();
        } else if (needsPeaceMessage) {
            // Show peace message immediately if no congratulations
            this.showPeaceMessage();
            this.combat.clearPeaceMessageFlag();
        }
        
        // Clean up only old balloon effects (older than 3 seconds)
        // This preserves balloons during the celebration but removes lingering ones
        const balloonContainers = document.querySelectorAll('.balloon-container');
        balloonContainers.forEach(container => {
            const createdAt = parseInt(container.dataset.createdAt || 0);
            const age = Date.now() - createdAt;
            if (age > 3000) { // Only remove if older than 3 seconds
                container.remove();
            }
        });
        
        this.hideElement('combatArea');
        this.showElement('movementControls');
        this.disableCombatButtons();
        
        // Return to appropriate screen after combat
        this.showGameScreen();
        
        // Reset party hat flag and update sprites to remove party hat
        this.combat.playerHasPartyHat = false;
        
        // Force update player stats to reset combat sprite
        this.updatePlayerStats();
    }
    
    updateCombatDisplay() {
        const enemy = this.combat.getCurrentEnemy();
        if (!enemy) return;
        
        // Update player name in combat
        this.setTextContent('player-name-combat', this.player.getName());
        
        // Update enemy info (using correct HTML IDs)
        this.setTextContent('enemy-name', enemy.name);
        this.setTextContent('enemy-level', `Level ${enemy.level}`);
        
        // Update HP bars
        this.updateHPBar('player-hp-bar', this.player.getHP(), this.player.getMaxHP());
        
        // Special handling for befriended enemies - don't update HP bar (let rainbow effect stay)
        // Check if we're actively befriending in THIS combat, not just if enemy has befriended flag
        if (!this.combat.isBefriendingCurrentEnemy()) {
            this.updateHPBar('enemy-hp-bar', enemy.hp, enemy.maxHp);
            this.setTextContent('enemy-hp-text', `${enemy.hp}/${enemy.maxHp}`);
        } else {
            // For enemies being befriended in this combat, replace entire HP text with friendship message
            const enemyHPContainer = document.querySelector('.enemy-combat > div:last-child');
            if (enemyHPContainer && enemyHPContainer.textContent.includes('HP:')) {
                enemyHPContainer.textContent = GameStrings.COMBAT.MADE_FRIEND;
            }
        }
        
        // Update player stats (this will handle party hat preservation)
        this.updatePlayerStats();
        
        // Update combat log
        this.updateCombatLog();
        
        // Update enemy sprite only if no party hat (using correct HTML ID)
        if (!enemy.hasPartyHat) {
            const enemySprite = document.getElementById('enemy-fish-combat');
            if (enemySprite) {
                // Clear sprite first to prevent flash of previous enemy
                enemySprite.style.visibility = 'hidden';
                enemySprite.src = enemy.sprite;
                // Apply random hue rotation for color variation
                enemySprite.style.filter = enemy.randomHue ? `hue-rotate(${enemy.randomHue}deg)` : 'none';
                // Show sprite after setting new image
                enemySprite.style.visibility = 'visible';
            }
        }
        
        // Update swim away difficulty warning
        const swimAwayMessage = document.getElementById('swim-away-message');
        if (swimAwayMessage) {
            if (enemy.level >= GameConfig.COMBAT.RUN_AWAY.difficultEnemyLevel) {
                swimAwayMessage.textContent = "⚡ Escape is very difficult! ⚡";
            } else {
                swimAwayMessage.textContent = "";
            }
        }
        
        // Update player sprite in combat
        const playerSprite = document.getElementById('player-fish-combat');
        if (playerSprite) {
            playerSprite.src = this.player.getSprite();
            playerSprite.style.filter = this.player.getColorFilter();
        }
        
        // Manage spell button visibility and states
        const bubbleBtn = document.getElementById('bubble-blast-btn');
        const balloonBtn = document.getElementById('happy-balloon-btn');
        const gravelBtn = document.getElementById('gravel-grenade-btn');
        
        if (bubbleBtn) {
            bubbleBtn.disabled = !this.player.canCastSpell('bubble');
        }
        
        if (balloonBtn) {
            // Show/hide balloon button based on spell availability
            if (this.player.hasSpell('party')) {
                balloonBtn.style.display = 'inline-block';
                balloonBtn.disabled = !this.player.canCastSpell('party');
            } else {
                balloonBtn.style.display = 'none';
            }
        }
        
        if (gravelBtn) {
            // Show/hide gravel button based on spell availability
            if (this.player.hasSpell('gravel')) {
                gravelBtn.style.display = 'inline-block';
                gravelBtn.disabled = !this.player.canCastSpell('gravel');
            } else {
                gravelBtn.style.display = 'none';
            }
        }
    }
    
    updateCombatLog() {
        const logElement = document.getElementById('combat-log');
        if (!logElement) return;
        
        const log = this.combat.getCombatLog();
        logElement.innerHTML = log.map(message => `<div class="log-entry">${message}</div>`).join('');
        logElement.scrollTop = 0; // Scroll to top (newest messages)
    }
    
    enableCombatButtons() {
        // Attack button is always enabled (no ID needed, works via onclick)
        
        // Always enable spell buttons - let click handlers show MP messages
        const bubbleBtn = document.getElementById('bubble-blast-btn');
        const balloonBtn = document.getElementById('happy-balloon-btn');
        const gravelBtn = document.getElementById('gravel-grenade-btn');
        
        if (bubbleBtn) {
            bubbleBtn.removeAttribute('disabled');
            bubbleBtn.style.display = 'block';
        }
        
        if (balloonBtn) {
            // Show balloon button if player has the spell
            if (this.player.hasSpell('party')) {
                balloonBtn.removeAttribute('disabled');
                balloonBtn.style.display = 'block';
            } else {
                balloonBtn.style.display = 'none'; // Hide until spell is available
            }
        }
        
        if (gravelBtn) {
            // Show gravel button if player has the spell
            if (this.player.hasSpell('gravel')) {
                gravelBtn.removeAttribute('disabled');
                gravelBtn.style.display = 'block';
            } else {
                gravelBtn.style.display = 'none'; // Hide until spell is available
            }
        }
        
        // Swim away button (always enabled)
        document.getElementById('swim-away-btn')?.removeAttribute('disabled');
    }
    
    disableCombatButtons() {
        const buttons = ['bubble-blast-btn', 'happy-balloon-btn', 'gravel-grenade-btn', 'swim-away-btn'];
        buttons.forEach(id => {
            document.getElementById(id)?.setAttribute('disabled', 'true');
        });
    }
    
    // Combat actions
    playerAttack() {
        const result = this.combat.attack();
        
        // Check if player died during enemy response
        if (result && result.playerDefeated) {
            this.checkAndHandlePlayerDefeat();
            return;
        }
        
        // Check if enemy was defeated
        if (result && result.enemyDefeated) {
            // Update display to show enemy HP at 0
            this.updateCombatDisplay();
            this.updateCombatLog();
            
            
            // Brief delay for attack, then show death animation
            setTimeout(() => {
                this.combat.processCombatVictory((victoryResult) => {
                    this.handleVictory(victoryResult);
                });
            }, 250);
            return;
        }
        
        // Regular combat continues - update display
        if (this.combat.isCombatActive()) {
            this.updateCombatDisplay();
        } else {
            // If combat ended for other reasons, show final updates
            this.updateCombatLog();
            const COMBAT_END_DELAY = 1500; // Give player time to see final combat state
            setTimeout(() => this.endCombat(), COMBAT_END_DELAY);
        }
    }
    
    // Check for player defeat and handle death sequence if needed
    checkAndHandlePlayerDefeat() {
        if (!this.player.isAlive && !this.defeatInProgress) {
            this.defeatInProgress = true;
            // Update display to show player HP at 0 first
            this.updateCombatDisplay();
            this.updateCombatLog();
            
            // After a brief delay for HP to show 0, trigger death animation
            setTimeout(() => {
                this.handlePlayerDefeat();
            }, 250);
            return true; // Player is defeated
        }
        return false; // Player is still alive
    }
    
    playerCastSpell(spellType) {
        // Check if spell can be cast first and provide feedback
        if (!this.player.canCastSpell(spellType)) {
            // Since UI only shows available spells based on level, failure must be insufficient MP
            let spellName;
            if (spellType === 'bubble') {
                spellName = GameConfig.COMBAT.SPELLS.BUBBLE_BLAST.name;
            } else if (spellType === 'party') {
                spellName = GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME.name;
            } else {
                spellName = GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE.name;
            }
            this.combat.displayCombatMessage(StringFormatter.format(GameStrings.COMBAT.NOT_ENOUGH_MP, { spellName }));
            this.updateCombatLog();
            return;
        }
        
        const result = this.combat.useSkill(spellType);
        
        // Check if player died during enemy response
        if (result && result.playerDefeated) {
            this.checkAndHandlePlayerDefeat();
            return;
        }
        
        // Check if enemy was defeated
        if (result && result.enemyDefeated) {
            // Update display to show enemy HP at 0
            this.updateCombatDisplay();
            this.updateCombatLog();
            
            // If enemy was befriended, re-apply party hat visual after updates
            if (result.enemy && result.enemy.befriended && this.combat.playerHasPartyHat) {
                const playerFishCombat = document.getElementById('player-fish-combat');
                const statsSprite = document.getElementById('stats-player-sprite');
                const currentSprite = this.player.getSprite();
                const partyHatSprite = this.combat.getPartyHatSprite(currentSprite);
                
                if (partyHatSprite) {
                    if (playerFishCombat) {
                        playerFishCombat.src = partyHatSprite;
                    }
                    if (statsSprite) {
                        statsSprite.src = partyHatSprite;
                    }
                }
            }
            
            // Wait for spell animations to complete before showing death animation
            setTimeout(() => {
                this.combat.processCombatVictory((victoryResult) => {
                    this.handleVictory(victoryResult);
                });
            }, 2000); // 2s delay for spell animations to complete
            return;
        }
        
        // Regular combat continues - update display
        if (this.combat.isCombatActive()) {
            this.updateCombatDisplay();
        } else {
            // If combat ended for other reasons, show final updates
            this.updateCombatLog();
            const COMBAT_END_DELAY = 1500; // Give player time to see final combat state
            setTimeout(() => this.endCombat(), COMBAT_END_DELAY);
        }
    }
    
    playerRunAway() {
        const result = this.combat.runAway();
        this.updateCombatDisplay();
        this.updateCombatLog(); // Update combat log to show swim away message
        
        // Check if player died from retaliation attack
        if (result.playerDefeated) {
            this.checkAndHandlePlayerDefeat();
            return;
        }
        
        // If escape succeeded, end combat
        if (result.escaped || !this.combat.isCombatActive()) {
            // Show swim away message and add to encounter log
            this.displayMessage(GameStrings.COMBAT.ESCAPE_SUCCESS);
            const ESCAPE_MESSAGE_DELAY = 1000; // Wait for escape message to be read
            setTimeout(() => this.endCombat(), ESCAPE_MESSAGE_DELAY);
        }
    }
    
    handleVictory(victoryResult) {
        // Add combat-over class to show waiting cursor
        document.getElementById('combat')?.classList.add('combat-over');
        
        // Add combat messages to world map log
        if (victoryResult.defeatedEnemy) {
            // Add in reverse order since newest messages appear at top
            this.displayMessage(StringFormatter.format(GameStrings.COMBAT.ENEMY_APPEARS, { 
                enemyName: victoryResult.defeatedEnemy.name, 
                level: victoryResult.defeatedEnemy.level 
            }));
            
            // Use befriended message if enemy was befriended, defeated message otherwise
            const message = victoryResult.defeatedEnemy.befriended 
                ? GameStrings.COMBAT.ENEMY_BEFRIENDED 
                : GameStrings.COMBAT.ENEMY_DEFEATED;
            this.displayMessage(StringFormatter.format(message, { enemyName: victoryResult.defeatedEnemy.name }));
        }
        
        // Don't show congratulations here - it will be shown in endCombat() on world map
        // This prevents showing it twice
        
        // Don't show peace message here either - it will be shown in endCombat()
        // This prevents showing it twice
        
        // Check if enemy was befriended via Happy Balloon Time
        const wasBefriended = victoryResult.defeatedEnemy && victoryResult.defeatedEnemy.befriended;
        
        // If there was a level up, wait for level up sound to complete before ending combat
        if (victoryResult.levelUp) {
            const LEVEL_UP_SEQUENCE_DELAY = 1000; // Wait for level up fanfare and messages
            setTimeout(() => this.endCombat(), LEVEL_UP_SEQUENCE_DELAY);
        } else if (wasBefriended) {
            // If enemy was befriended, delay to show party hats
            const FRIENDSHIP_CELEBRATION_DELAY = 2000; // Show party hats for 2 seconds
            setTimeout(() => this.endCombat(), FRIENDSHIP_CELEBRATION_DELAY);
        } else {
            // End combat immediately if no level up and not befriended
            this.endCombat();
        }
    }
    
    handlePlayerDefeat() {
        // Add combat-over class to show waiting cursor
        document.getElementById('combat')?.classList.add('combat-over');
        
        // Get defeat information from combat
        const defeatInfo = this.combat.loseCombat();
        
        // Add "last thing you remember" message to world map log
        if (defeatInfo.defeatedByEnemy) {
            this.displayMessage(`The last thing you remember is a wild ${defeatInfo.defeatedByEnemy.name}!`);
        }
        
        // Update combat display to show defeat (HP at 0 and death animation)
        this.updateCombatDisplay();
        this.updateCombatLog();
        
        // Wait, then transition to village with revival message
        setTimeout(() => {
            // Properly teleport player back to village (resets world coordinates)
            this.world.teleportToVillage();
            this.showScreen('village');
            
            // Reset player sprite orientation (right side up)
            const playerFish = document.getElementById('player-fish-combat');
            if (playerFish) {
                playerFish.style.transform = 'none';
            }
            const statsSprite = document.getElementById('stats-player-sprite');
            if (statsSprite) {
                statsSprite.style.transform = 'none';
            }
            
            // Show revival message
            if (defeatInfo.bettaBitesLost > 0) {
                this.displayMessage(GameStrings.COMBAT.DEFEAT_RECOVERY_RESCUED);
                this.displayMessage(StringFormatter.format(GameStrings.COMBAT.DEFEAT_RECOVERY_LOSS, { 
                    amount: defeatInfo.bettaBitesLost 
                }));
            } else {
                this.displayMessage(GameStrings.COMBAT.DEFEAT_RECOVERY);
            }
            
            // Reset defeat flag for next combat
            this.defeatInProgress = false;
            
            this.updateAllDisplays();
        }, 3500); // Delay for death animation
    }
    
    // Village interactions  
    enterVillage() {
        const result = this.world.enterVillage();
        this.displayMessage(result.message);
        
        if (result.success) {
            this.showScreen('village');
        }
        
        this.updateAllDisplays();
    }
    
    // Return to village from anywhere (for Home key and Return button)
    returnToVillage() {
        // Use proper world interface for teleportation
        const result = this.world.teleportToVillage();
        this.displayMessage(result.message);
        this.showScreen('village');
        this.updateAllDisplays();
    }
    
    leaveVillage() {
        const result = this.world.leaveVillage();
        this.displayMessage(result.message);
        
        if (result.success) {
            this.showScreen('world-map');
            // Update player map position after leaving village
            this.updatePlayerMapPosition();
        }
        
        this.updateAllDisplays();
    }
    
    exitVillage() {
        // Exit to paddies method
        this.leaveVillage();
    }
    
    toggleShop() {
        this.shopOpen = !this.shopOpen;
        
        if (this.shopOpen) {
            this.showShop();
        } else {
            this.hideShop();
        }
    }
    
    toggleAudio() {
        if (!this.audio) return;
        
        const isEnabled = this.audio.toggleAudio();
        const toggleButton = document.getElementById('audio-toggle');
        
        if (toggleButton) {
            toggleButton.textContent = isEnabled ? '🔊' : '🔇';
            toggleButton.classList.toggle('muted', !isEnabled);
            toggleButton.title = isEnabled ? 'Toggle Audio (On)' : 'Toggle Audio (Off)';
        }
    }
    
    showShop() {
        const shopElement = document.getElementById('shopArea');
        if (!shopElement) return;
        
        shopElement.style.display = 'block';
        
        const shopItems = this.world.getShopItems();
        const itemsHTML = shopItems.map(item => {
            const canAfford = this.player.canAfford(item.cost);
            return `
                <div class="shop-item ${canAfford ? 'shop-item-buyable' : 'shop-item-unavailable'}">
                    <h4 class="item-name">${item.name}</h4>
                    <p>${item.description}</p>
                    <p>Cost: ${item.cost} Betta Bites</p>
                    ${canAfford ? `<button onclick="game.ui.buyItem('${item.id}')">Buy</button>` : ''}
                </div>
            `;
        }).join('');
        
        const shopItemsElement = document.getElementById('shopItems');
        if (shopItemsElement) {
            shopItemsElement.innerHTML = itemsHTML;
        }
    }
    
    hideShop() {
        const shopElement = document.getElementById('shopArea');
        if (shopElement) {
            shopElement.style.display = 'none';
        }
    }
    
    // NPC Interaction Methods
    talkToNPC(npcId) {
        const result = this.world.talkToNPC(npcId);
        if (!result.success) {
            this.displayMessage(result.message);
            return;
        }
        
        this.showDialogueScreen(result);
    }
    
    showDialogueScreen(dialogueData) {
        this.showScreen('dialogue');
        this.dialogueActive = true;
        
        // Create or update dialogue UI
        this.displayDialogue(dialogueData);
    }
    
    displayDialogue(dialogueData) {
        // Use the HTML dialogue screen structure
        this.showEnhancedDialogue(dialogueData);
    }
    
    showEnhancedDialogue(dialogueData) {
        // Set up the dialogue screen HTML elements
        const npcNameElement = document.getElementById('npc-name');
        const dialogueTextElement = document.getElementById('dialogue-text');
        const dialogueOptionsElement = document.getElementById('dialogue-options');
        
        if (npcNameElement) npcNameElement.textContent = dialogueData.npc.name;
        if (dialogueTextElement) dialogueTextElement.textContent = dialogueData.dialogue;
        
        // Generate dialogue options with proper styling
        let optionsHTML = '';
        
        if (dialogueData.hasMoreDialogue) {
            const buttons = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.CONTINUE]);
            optionsHTML += `<div class="dialogue-option" onclick="game.ui.continueDialogue()">${buttons[0].html}</div>`;
        } else {
            // Collect button texts
            const buttonTexts = [];
            const actions = [];
            
            if (dialogueData.isShop) {
                buttonTexts.push(GameStrings.UI.BUTTONS.BROWSE_ITEMS);
                actions.push('game.ui.openShopFromDialogue()');
            }
            if (dialogueData.isInn) {
                if (this.player.canAfford(GameConfig.SHOP.INN_REST.cost)) {
                    buttonTexts.push(StringFormatter.format(GameStrings.UI.BUTTONS.REST_WITH_COST, { cost: GameConfig.SHOP.INN_REST.cost }));
                    actions.push('game.ui.restAtInnFromDialogue()');
                } else {
                    // Handle disabled state separately since it doesn't get automatic processing
                    optionsHTML += `<div class="dialogue-option disabled">${StringFormatter.format(GameStrings.UI.BUTTONS.REST, { cost: GameConfig.SHOP.INN_REST.cost })}${GameStrings.UI.DIALOGUE_OPTIONS.REST_SUFFIX}</div>`;
                }
            }
            buttonTexts.push(GameStrings.UI.BUTTONS.GOODBYE);
            actions.push('game.ui.endDialogue()');
            
            // Process buttons and generate HTML
            const buttons = StringFormatter.processButtonTexts(buttonTexts);
            buttons.forEach((button, index) => {
                optionsHTML += `<div class="dialogue-option" onclick="${actions[index]}">${button.html}</div>`;
            });
        }
        
        if (dialogueOptionsElement) {
            dialogueOptionsElement.innerHTML = optionsHTML;
        }
    }
    
    continueDialogue() {
        const result = this.world.nextDialogue();
        if (!result.success) {
            this.endDialogue();
            return;
        }
        
        this.showEnhancedDialogue(result);
    }
    
    openShopFromDialogue() {
        // Show shop inline in the dialogue text area
        const dialogueTextElement = document.getElementById('dialogue-text');
        const dialogueOptionsElement = document.getElementById('dialogue-options');
        
        if (dialogueTextElement) {
            // Get shop items from world manager (which uses configuration)
            const shopItems = this.world.getShopItems();
            
            // Use automatic button processing for shop item names
            const itemNames = shopItems.map(item => item.name);
            const processedItems = StringFormatter.processButtonTexts(itemNames);
            
            let shopItemsHTML = '';
            shopItems.forEach((item, index) => {
                const canAfford = this.player.canAfford(item.cost);
                const clickHandler = canAfford ? `onclick="game.ui.buyItem('${item.id}')"` : '';
                const itemClass = canAfford ? 'shop-item-buyable' : 'shop-item-unavailable';
                const processedItem = processedItems[index];
                
                shopItemsHTML += `
                    <div class="shop-item ${itemClass}" ${clickHandler} data-key="${processedItem.key}">
                        <div class="item-name">${processedItem.html}</div>
                        <div class="item-description">${item.description}</div>
                        <div class="item-price">${item.cost}${GameStrings.SHOP.INLINE_SHOP.COST_SUFFIX}</div>
                    </div>
                `;
            });
            
            dialogueTextElement.innerHTML = `
                <div class="shop-header">${GameStrings.SHOP.INLINE_SHOP.HEADER}</div>
                <div class="shop-items">
                    ${shopItemsHTML}
                </div>
                <div class="shop-footer">${StringFormatter.format(GameStrings.SHOP.INLINE_SHOP.FOOTER, { bettaBites: this.player.getBettaBites() })}</div>
            `;
        }
        
        if (dialogueOptionsElement) {
            const [maybeLaterButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.MAYBE_LATER]);
            dialogueOptionsElement.innerHTML = `<div class="dialogue-option" onclick="game.ui.endDialogue()">${maybeLaterButton.html}</div>`;
        }
    }
    
    restAtInnFromDialogue() {
        const result = this.world.restAtInn();
        
        if (result.success) {
            this.updateAllDisplays();
            this.dialog.showRestConfirmation(() => {
                this.endDialogue();
            });
        } else {
            this.displayMessage(result.message);
            this.endDialogue();
        }
    }
    
    endDialogue() {
        this.world.endDialogue();
        this.dialogueActive = false;
        
        // Return to appropriate screen after dialogue
        this.showGameScreen();
        this.updateAllDisplays();
    }
    
    // Congratulations popup system
    showCongratulationsPopup(onCloseCallback) {
        const popup = document.getElementById('congratulations-popup');
        if (popup) {
            popup.classList.add('show');
            // Store callback for when popup is closed
            this.congratsCloseCallback = onCloseCallback;
            // Victory fanfare already played by combat system
        }
    }
    
    hideCongratulationsPopup() {
        const popup = document.getElementById('congratulations-popup');
        if (popup) {
            popup.classList.remove('show');
            // Execute callback if one was provided
            if (this.congratsCloseCallback) {
                const callback = this.congratsCloseCallback;
                this.congratsCloseCallback = null;
                setTimeout(() => callback(), 500); // Small delay for transition
            }
        }
    }
    
    showPeaceMessage() {
        // Create a special popup for the peace achievement
        const popup = document.createElement('div');
        popup.className = 'peace-popup';
        popup.innerHTML = `
            <h2 style="margin-bottom: 1.5rem;">${GameStrings.SYSTEM.CONGRATULATIONS.ALL_FRIENDS_TITLE}</h2>
            <p style="margin-bottom: 1rem;">${GameStrings.SYSTEM.CONGRATULATIONS.ALL_FRIENDS_MESSAGE}</p>
            <p style="margin-bottom: 2rem;">${GameStrings.SYSTEM.CONGRATULATIONS.ALL_FRIENDS_SUBTITLE}</p>
            <button id="peace-continue-btn"><u>C</u>ontinue</button>
        `;
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            animation: fadeInScale 0.5s ease-out;
        `;
        document.body.appendChild(popup);
        
        // Set up button click handler
        const continueBtn = document.getElementById('peace-continue-btn');
        continueBtn.onclick = () => popup.remove();
        
        // Set up keyboard handlers
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' || e.key === 'c' || e.key === 'C') {
                popup.remove();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        
        // Focus the button so Enter works
        continueBtn.focus();
        
        // Play a special sound for achieving peace
        this.audio.playSound('fanfare');
    }
    
    // Show NPC interaction options when in village
    
    
    
    // Display updates
    updateAllDisplays() {
        this.updatePlayerStats();
        this.updateVillageButtons();
        this.updateMovementButtons();
        
        // Update world map player sprite if on world map (for armor changes etc)
        if (this.currentScreen === 'world-map') {
            this.showPlayerOnMap();
        }
    }
    
    updatePlayerStats() {
        // Update player stats using proper interfaces (no direct property access)
        this.setTextContent('player-name-display', this.player.getName());
        this.setTextContent('level', this.player.getLevel());
        this.setTextContent('exp', this.player.getExp());
        this.setTextContent('exp-next', this.player.getExpToNext());
        this.setTextContent('betta-bites', this.player.getBettaBites());
        
        this.setTextContent('hp', this.player.getHP());
        this.setTextContent('max-hp', this.player.getMaxHP());
        this.setTextContent('mp', this.player.getMP());
        this.setTextContent('max-mp', this.player.getMaxMP());
        
        // Update combat stats if in combat
        this.setTextContent('player-name-combat', this.player.getName());
        this.setTextContent('player-hp-text', `${this.player.getHP()}/${this.player.getMaxHP()}`);
        
        // Update sprites based on party hat state
        const playerSprite = document.getElementById('stats-player-sprite');
        const combatSprite = document.getElementById('player-fish-combat');
        
        if (!this.combat.playerHasPartyHat) {
            // No party hat - update both sprites normally
            if (playerSprite) {
                playerSprite.src = this.player.getSprite();
                playerSprite.style.filter = this.player.getColorFilter();
            }
            if (combatSprite) {
                combatSprite.src = this.player.getSprite();
                combatSprite.style.filter = this.player.getColorFilter();
            }
        }
        // If party hat is active, preserve it (don't update sprites)
        
        // Update HP bar in combat
        this.updateHPBar('player-hp-bar', this.player.getHP(), this.player.getMaxHP());
    }
    
    
    
    updateVillageButtons() {
        const inVillage = this.world.isInVillage();
        const enterBtn = document.getElementById('enterVillageBtn');
        const leaveBtn = document.getElementById('leaveVillageBtn');
        const shopBtn = document.getElementById('shopBtn');
        if (enterBtn) {
            enterBtn.style.display = inVillage ? 'none' : 'block';
        }
        if (leaveBtn) {
            leaveBtn.style.display = inVillage ? 'block' : 'none';
        }
        if (shopBtn) {
            shopBtn.style.display = inVillage ? 'block' : 'none';
        }
    }
    
    updateMovementButtons() {
        const combatActive = this.combat.isCombatActive();
        const buttons = ['northBtn', 'southBtn', 'eastBtn', 'westBtn'];
        
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                if (combatActive) {
                    btn.setAttribute('disabled', 'true');
                } else {
                    btn.removeAttribute('disabled');
                }
            }
        });
    }
    
    updateHPBar(elementId, current, max) {
        const bar = document.getElementById(elementId);
        if (!bar) return;
        
        const percentage = (current / max) * 100;
        bar.style.width = `${percentage}%`;
        
        // Color coding
        if (percentage > 60) {
            bar.style.backgroundColor = '#4CAF50'; // Green
        } else if (percentage > 30) {
            bar.style.backgroundColor = '#FF9800'; // Orange
        } else {
            bar.style.backgroundColor = '#F44336'; // Red
        }
    }
    
    
    // Utility functions
    setTextContent(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }
    
    displayMessage(message) {
        // Add to both encounter logs (world map and village)
        const logs = [
            document.getElementById('encounter-log'),
            document.getElementById('village-encounter-log')
        ];
        
        logs.forEach(log => {
            if (log) {
                const entry = document.createElement('div');
                entry.className = 'log-entry';
                entry.textContent = message;
                
                // Insert at the beginning
                log.insertBefore(entry, log.firstChild);
                
                // Keep only the last 8 messages
                while (log.children.length > 8) {
                    log.removeChild(log.lastChild);
                }
                
                // Scroll to top to show newest message
                log.scrollTop = 0;
            }
        });
    }
    
    updatePlayerSpritesWithPartyHat() {
        const currentSprite = this.player.getSprite();
        const partyHatSprite = this.combat.getPartyHatSprite(currentSprite);
        if (!partyHatSprite) return;
        
        // Update both combat sprite AND stats panel during combat
        const playerFishCombat = document.getElementById('player-fish-combat');
        const statsSprite = document.getElementById('stats-player-sprite');
        
        if (playerFishCombat) {
            playerFishCombat.src = partyHatSprite;
        }
        
        if (statsSprite) {
            statsSprite.src = partyHatSprite;
        }
    }
    
    applyRainbowHPEffect() {
        const enemyHPBar = document.getElementById('enemy-hp-bar');
        if (enemyHPBar) {
            // Add rainbow animation class
            enemyHPBar.classList.add('rainbow-friendship');
            // Keep the bar at full width
            enemyHPBar.style.width = '100%';
        }
    }
    
    
    
    // World Map Visual Methods
    generateRicePaddyPositions() {
        // Generate consistent random positions for rice paddies
        const positions = [];
        const seed = 12345; // Fixed seed for consistent generation
        let rng = seed;
        
        // Simple seeded random number generator
        const seededRandom = () => {
            rng = (rng * 9301 + 49297) % 233280;
            return rng / 233280;
        };
        
        for (let i = 0; i < 25; i++) {
            positions.push({
                x: seededRandom() * 80 + 10, // 10-90% of screen width
                y: seededRandom() * 80 + 10, // 10-90% of screen height
                scale: seededRandom() * 0.4 + 0.8 // 0.8-1.2 scale
            });
        }
        return positions;
    }
    
    createLayeredWorldBackground() {
        const gameContainer = document.getElementById('game-container');
        const worldMapScreen = document.getElementById('world-map');
        
        // Remove existing decorations
        document.querySelectorAll('.rice-paddy-tuft, .betta-village, .map-player, .danger-zone-border, .safe-water-zone').forEach(element => element.remove());
        
        // Clean up any dynamic styles
        const existingStyle = document.getElementById('dynamic-world-style');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Generate tile-based background
        this.generateTiledBackground().then(backgroundUrl => {
            gameContainer.style.backgroundImage = `url(${backgroundUrl})`;
            gameContainer.style.backgroundRepeat = 'no-repeat';
            gameContainer.style.backgroundSize = '100% 100%';
        }).catch(error => {
            console.error('Failed to generate tile background:', error);
            // Fallback to old system
            gameContainer.style.backgroundImage = 'url(graphics/map/water-tile-dark.png)';
            gameContainer.style.backgroundRepeat = 'repeat';
            gameContainer.style.backgroundSize = '64px 64px';
        });
    }
    
    // Generate a pre-rendered background with tiles based on distance zones
    async generateTiledBackground() {
        const mapSize = GameConfig.WORLD.MAP_SIZE;
        const tileSize = 64; // Each tile is 64x64 pixels
        const canvasSize = mapSize * tileSize;
        
        // Create canvas for rendering
        const canvas = document.createElement('canvas');
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        const ctx = canvas.getContext('2d');
        
        // Load water tile images
        const waterTiles = await this.loadWaterTileImages();
        
        for (let y = 0; y < mapSize; y++) {
            for (let x = 0; x < mapSize; x++) {
                const distance = this.world.getDistanceFromVillage(x, y);
                const tileImage = this.getTileImageForDistance(distance, waterTiles);
                
                // Draw tile at correct position
                ctx.drawImage(tileImage, x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
        
        // Convert canvas to data URL for use as background image
        return canvas.toDataURL('image/png');
    }
    
    // Load all water tile images
    async loadWaterTileImages() {
        const imagePromises = [
            this.loadImage('graphics/map/water-tile2.png'),        // Light water (safe)
            this.loadImage('graphics/map/water-tile-darkish.png'), // Medium water (dangerous)
            this.loadImage('graphics/map/water-tile-dark.png')     // Dark water (extreme)
        ];
        
        const [lightWater, mediumWater, darkWater] = await Promise.all(imagePromises);
        
        return {
            light: lightWater,
            medium: mediumWater,
            dark: darkWater
        };
    }
    
    // Helper to load image as promise
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
    
    // Determine which tile image to use based on distance from village
    getTileImageForDistance(distance, waterTiles) {
        const zones = GameConfig.WORLD.DANGER_ZONES;
        
        if (distance <= zones.SAFE_RADIUS) {
            return waterTiles.light;    // Safe zone: light blue water
        } else if (distance <= zones.DANGEROUS_RADIUS) {
            return waterTiles.medium;   // Dangerous zone: medium blue water
        } else {
            return waterTiles.dark;     // Extreme zone: dark blue water
        }
    }
    
    showRicePaddies() {
        const worldMapScreen = document.getElementById('world-map');
        
        this.ricePaddyPositions.forEach((position, index) => {
            const tuft = document.createElement('img');
            tuft.src = 'graphics/map/rice_paddy_tuft.png';
            tuft.className = 'rice-paddy-tuft';
            tuft.style.position = 'absolute';
            tuft.style.left = `${position.x}%`;
            tuft.style.top = `${position.y}%`;
            tuft.style.transform = `scale(${position.scale})`;
            tuft.style.pointerEvents = 'none';
            tuft.style.zIndex = '1';
            tuft.style.imageRendering = 'pixelated';
            worldMapScreen.appendChild(tuft);
        });
        
        // Add village marker - position it in the center of its tile
        const village = document.createElement('img');
        village.src = 'graphics/map/bettahome.png';
        village.className = 'betta-village';
        village.style.position = 'absolute';
        const tileSize = 64;
        const villagePixelX = GameConfig.WORLD.VILLAGE_CENTER.x * tileSize + tileSize / 2;
        const villagePixelY = GameConfig.WORLD.VILLAGE_CENTER.y * tileSize + tileSize / 2;
        // Convert to percentage of container
        const containerSize = GameConfig.WORLD.MAP_SIZE * tileSize;
        village.style.left = `${(villagePixelX / containerSize) * 100}%`;
        village.style.top = `${(villagePixelY / containerSize) * 100}%`;
        village.style.transform = 'translate(-50%, -50%)';
        village.style.pointerEvents = 'none';
        village.style.zIndex = '2';
        village.style.imageRendering = 'pixelated';
        worldMapScreen.appendChild(village);
    }
    
    showPlayerOnMap() {
        const worldMapScreen = document.getElementById('world-map');
        
        // Remove existing player marker
        const existingPlayer = document.querySelector('.map-player');
        if (existingPlayer) existingPlayer.remove();
        
        const player = document.createElement('img');
        player.src = this.player.getSprite();
        player.className = this.player.hasSubmarine() ? 'map-player submarine' : 'map-player';
        player.style.position = 'absolute';
        
        // Position player in center of their tile
        const location = this.world.getCurrentLocation();
        const tileSize = 64;
        const playerPixelX = location.x * tileSize + tileSize / 2;
        const playerPixelY = location.y * tileSize + tileSize / 2;
        const containerSize = GameConfig.WORLD.MAP_SIZE * tileSize;
        
        player.style.left = `${(playerPixelX / containerSize) * 100}%`;
        player.style.top = `${(playerPixelY / containerSize) * 100}%`;
        
        // Apply facing direction transform
        const flipTransform = this.playerFacing === 'left' ? 'scaleX(-1)' : '';
        player.style.transform = `translate(-50%, -50%) ${flipTransform}`;
        player.style.zIndex = '10';
        player.style.imageRendering = 'pixelated';
        player.style.width = '48px';
        player.style.height = '48px';
        
        if (this.player.hasSubmarine()) {
            player.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))';
        } else {
            player.style.filter = this.player.getColorFilter() + ' drop-shadow(2px 2px 4px rgba(0,0,0,0.5))';
        }
        worldMapScreen.appendChild(player);
    }
    
    // Update player position on map based on world coordinates
    updatePlayerMapPosition() {
        const location = this.world.getCurrentLocation();
        // Convert grid coordinates to percentage based on actual map size
        this.playerMapPosition.x = (location.x / GameConfig.WORLD.MAP_SIZE) * 100;
        this.playerMapPosition.y = (location.y / GameConfig.WORLD.MAP_SIZE) * 100;
        
        if (this.currentScreen === 'world-map') {
            this.showPlayerOnMap();
        }
    }
    
    // Show/hide stats panel
    showStatsPanel() {
        const statsPanel = document.getElementById('player-stats');
        if (statsPanel) {
            statsPanel.classList.add('show');
        }
    }
    
    hideStatsPanel() {
        const statsPanel = document.getElementById('player-stats');
        if (statsPanel) {
            statsPanel.classList.remove('show');
        }
    }
}

// === CORE MODULE ===
/**
 * Core Game Module
 * 
 * Main game controller that coordinates all other modules and handles
 * high-level game operations. Acts as the central hub for module 
 * communication and provides the public API for HTML interactions.
 */
class BettaRPG {
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

// === INITIALIZATION ===
let game;
document.addEventListener("DOMContentLoaded", () => {
    game = new BettaRPG();
});
