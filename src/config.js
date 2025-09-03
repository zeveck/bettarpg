/**
 * Game Configuration Module
 * 
 * Centralized configuration management for Betta Fish RPG. Contains all game
 * constants, balance settings, UI configurations, strings, and feature flags.
 * Provides type-safe access to configuration values and enables easy
 * balance tweaking without hunting through multiple files.
 */
export class GameConfig {
    
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
        VERSION: '0.4.7',
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
export class GameStrings {
    
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
export class StringFormatter {
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