/**
 * String Configuration Extension for GameConfig
 * 
 * Centralizes ALL game text for localization, consistency, and easy editing.
 * Enables translation, A/B testing of copy, and ensures no hardcoded strings
 * scattered throughout the codebase.
 */

// Addition to GameConfig class:
export const GameStrings = {
    
    // === UI LABELS & BUTTONS ===
    UI: {
        BUTTONS: {
            START_ADVENTURE: "Start Adventure",
            BEGIN_ADVENTURE: "Begin Adventure", 
            CONTINUE: "Continue...",
            GOODBYE: "Goodbye",
            BROWSE_ITEMS: "Browse Items",
            MAYBE_LATER: "Maybe later",
            RANDOM_NAME: "Random Name",
            ATTACK: "Attack",
            SWIM_AWAY: "Swim Away",
            REST: "Rest ({cost} Betta Bites)",
            BUY: "Buy",
            CLOSE: "Close"
        },
        
        LABELS: {
            NAME_YOUR_BETTA: "Name your betta:",
            CHOOSE_COLOR: "Choose your color:",
            ENTER_NAME: "Enter name",
            HP: "HP",
            MP: "MP", 
            LEVEL: "Level",
            EXP: "EXP",
            BETTA_BITES: "Betta Bites",
            DAMAGE: "Damage"
        },
        
        PLACEHOLDERS: {
            BETTA_NAME: "Enter name"
        },
        
        SCREENS: {
            TITLE: "Betta Fish RPG",
            SUBTITLE: "Adventure awaits in the aquatic realm!",
            CREATE_YOUR_BETTA: "Create Your Betta",
            COMBAT_TITLE: "Combat!",
            VILLAGE_TITLE: "Paddy Village",
            WORLD_MAP_TITLE: "The Rice Paddies"
        }
    },
    
    // === LOCATIONS & DESCRIPTIONS ===
    LOCATIONS: {
        VILLAGE: {
            NAME: "Paddy Village",
            DESCRIPTION: "Rice stalks sway gently in the water above, providing shelter for various bettas going about their daily lives.",
            
            BUILDINGS: {
                ELDER_DWELLING: "🏛️ <u>E</u>lder's Dwelling",
                FISH_MART: "🛒 <u>F</u>ish Mart", 
                VILLAGE_GUARD: "⚔️ Village <u>G</u>uard",
                BUBBLES_HOME: "✨ <u>B</u>ubble's Home",
                SWISHY_SOLACE_INN: "🏨 Swishy Solace <u>I</u>nn",
                EXIT_TO_PADDIES: "🗺️ E<u>x</u>it to Rice Paddies (↓)"
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
    },
    
    // === NPC DIALOGUES ===
    NPCS: {
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
                "I do have one special item - an ancient Dunkleosteus submarine for {submarineCost} Betta Bites! Would you like to see my wares?"
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
                "For just {innCost} Betta Bites, you can sleep safely and wake up refreshed!",
                "Would you like to rest? (This will fully restore your HP and MP for {innCost} Betta Bites)"
            ]
        }
    },
    
    // === COMBAT MESSAGES ===
    COMBAT: {
        ENEMY_APPEARS: "A wild {enemyName} (Level {level}) appears!",
        PLAYER_ATTACKS: "{playerName} attacks!",
        PLAYER_DEALS_DAMAGE: "{playerName} deals {damage} damage!",
        PLAYER_CASTS_SPELL: "{playerName} casts {spellName}!",
        PLAYER_SPELL_DAMAGE: "The {spellName} deals {damage} damage!",
        
        ENEMY_ATTACKS: "{enemyName} attacks!",
        ENEMY_DEALS_DAMAGE: "{enemyName} deals {damage} damage!",
        ENEMY_DEFEATED: "Defeated {enemyName}!",
        
        LEVEL_UP: "Level up! Now level {newLevel}!",
        GAINED_EXP: "Gained {exp} EXP!",
        GAINED_BETTA_BITES: "Found {amount} Betta Bites!",
        
        NOT_ENOUGH_MP: "Not enough MP to cast {spellName}!",
        SPELL_UNLOCKED_AT_LEVEL: "{spellName} unlocks at level {level}!",
        
        SWIM_AWAY_SUCCESS: "{playerName} swims away quickly!",
        SWIM_AWAY_BLOCKED: "⚡ The enemy is too fast to escape! ⚡",
        
        PLAYER_DEFEATED: "You have been defeated!",
        PLAYER_LOST_BETTA_BITES: "You lost {amount} Betta Bites...",
        PLAYER_RECOVERY: "You wake up back in the village, feeling groggy but alive.",
        
        // Enemy-specific attack messages
        ENEMY_ATTACKS: {
            AGGRESSIVE_GUPPY: [
                "The Aggressive Guppy darts forward with surprising speed!",
                "The Aggressive Guppy attempts to nip at your fins!", 
                "The guppy swims in an erratic pattern, then strikes!"
            ],
            
            TERRITORIAL_ANGELFISH: [
                "The Territorial Angelfish spreads its fins menacingly!",
                "The angelfish defends its territory with a fierce attack!",
                "The angelfish glides forward with elegant aggression!"
            ],
            
            SNEAKY_CATFISH: [
                "The Sneaky Catfish strikes from the shadows!",
                "The catfish uses its whiskers to sense your movement, then attacks!",
                "The catfish lurks near the bottom, then lunges upward!"
            ],
            
            FIERCE_CICHLID: [
                "The Fierce Cichlid charges with incredible force!",
                "The cichlid displays bright colors before attacking!",
                "The fierce fish uses its powerful jaws in a devastating bite!"
            ],
            
            PREHISTORIC_GAR: [
                "The massive Prehistoric Gar opens its ancient jaws!",
                "The Gar's prehistoric fury is unleashed!",
                "The ancient predator strikes with primordial power!",
                "🦕 The Prehistoric Gar lets out a thunderous roar instead of attacking! 🦕"
            ]
        }
    },
    
    // === WORLD EXPLORATION ===
    EXPLORATION: {
        MOVEMENT: {
            DIRECTIONS: {
                NORTH: "You swim north through the rice paddies.",
                SOUTH: "You swim south through the rice paddies.", 
                EAST: "You swim east through the rice paddies.",
                WEST: "You swim west through the rice paddies."
            },
            
            VILLAGE_EXIT: "You venture into the rice paddies, leaving the safety of Paddy Village behind.",
            VILLAGE_RETURN: "You return to the safety of Paddy Village."
        },
        
        ENCOUNTERS: {
            PEACEFUL: [
                "You find a peaceful stretch of water between the rice stalks.",
                "The water here is calm and refreshing.",
                "Small minnows swim peacefully nearby.", 
                "You rest briefly in the gentle current.",
                "The rice stalks sway gently overhead."
            ],
            
            TREASURE: [
                "You discover some floating food pellets!",
                "A cache of Betta Bites hidden in the rice stalks!",
                "You find some nutritious algae worth collecting!",
                "Hidden treasure among the roots!"
            ],
            
            MYSTERY: [
                "You sense something mysterious in these waters...",
                "Strange shadows move between the rice stalks.",
                "An eerie feeling washes over you.",
                "The water here feels different somehow."
            ]
        },
        
        DANGER_WARNINGS: {
            EDGE_ZONE: "The water here teems with dangerous predators!",
            HIGH_DANGER: "You sense powerful enemies nearby.",
            MEDIUM_DANGER: "The waters grow more treacherous here."
        }
    },
    
    // === SHOP & ECONOMY ===
    SHOP: {
        HEADER: "🛒 Fish Mart Inventory",
        WELCOME: "Welcome to my shop!",
        NOT_ENOUGH_CURRENCY: "You don't have enough Betta Bites!",
        PURCHASE_SUCCESS: "Purchase successful!",
        
        ITEMS: {
            SUBMARINE: {
                NAME: "🚢 <u>D</u>unkleosteus Submarine",
                DESCRIPTION: "An ancient vessel that transforms you into a legendary sea creature! Provides complete protection from damage.",
                PRICE: "{cost} Betta Bites"
            },
            
            KELP_SNACK: {
                NAME: "🌿 <u>K</u>elp Snack", 
                DESCRIPTION: "Restores full HP. Crunchy and nutritious!",
                PRICE: "{cost} Betta Bites"
            },
            
            BUBBLE_WATER: {
                NAME: "💧 <u>B</u>ubble Water",
                DESCRIPTION: "Restores full MP. Fizzy and refreshing!", 
                PRICE: "{cost} Betta Bites"
            }
        },
        
        CONFIRMATIONS: {
            SUBMARINE: "Excellent choice! The mysterious ancient vessel is now yours! You feel its power transforming your very essence. You are no longer just a betta - you are a legendary sea creature!",
            KELP_SNACK: "You munch on the crunchy kelp snack. Your HP is fully restored!",
            BUBBLE_WATER: "You drink the fizzy bubble water. Your MP is fully restored!"
        }
    },
    
    // === INN SERVICES ===
    INN: {
        WELCOME: "Welcome to the Swishy Solace Inn!",
        REST_OFFER: "A good rest will restore your strength for {cost} Betta Bites.",
        REST_SUCCESS: "You pay {cost} Betta Bites and rest in the soft kelp beds. You wake up completely refreshed! HP and MP fully restored.",
        NOT_ENOUGH_CURRENCY: "You don't have enough Betta Bites to rest here.",
        
        CONFIRMATION: "You rest peacefully in the soft kelp beds. You feel completely refreshed!"
    },
    
    // === CHARACTER CREATION ===
    CHARACTER_CREATION: {
        PREVIEW: {
            NAME_LABEL: "Name: {name}",
            COLOR_LABEL: "Color: {color}",
            UNKNOWN_NAME: "???",
            CHOOSE_COLOR: "Choose a color"
        },
        
        COLORS: {
            RED: "Red",
            BLUE: "Blue", 
            PURPLE: "Purple",
            GREEN: "Green",
            GOLD: "Gold"
        },
        
        WELCOME_MESSAGE: "Welcome, {playerName}! Your adventure begins now.",
        
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
    },
    
    // === SYSTEM MESSAGES ===
    SYSTEM: {
        LOADING: "Loading...",
        SAVING: "Saving...",
        ERROR: "An error occurred.",
        SUCCESS: "Success!",
        CONFIRMATION_REQUIRED: "Are you sure?",
        
        CHEATS: {
            BETTA_BITES_ADDED: "Cheat: Added {amount} Betta Bites!",
            LEVEL_UP_APPLIED: "Cheat: Level up applied!"
        },
        
        GAME_OVER: "Game Over",
        VICTORY: "Victory!",
        CONGRATULATIONS: "🎉 CONGRATULATIONS! 🎉",
        EDGE_REACHED: "You've explored to your paddy's edge!",
        MORE_ADVENTURES: "What lies beyond? More adventures await!",
        IN_DEVELOPMENT: "(In Development)"
    },
    
    // === VALIDATION MESSAGES ===
    VALIDATION: {
        NAME_REQUIRED: "Please enter a name for your betta.",
        COLOR_REQUIRED: "Please choose a color for your betta.",
        NAME_TOO_LONG: "Name must be 15 characters or less.",
        INVALID_INPUT: "Invalid input."
    },
    
    // === ACCESSIBILITY ===
    ACCESSIBILITY: {
        SCREEN_READER: {
            COMBAT_START: "Combat has begun with {enemyName}",
            PLAYER_TURN: "Your turn in combat",
            ENEMY_TURN: "{enemyName}'s turn",
            COMBAT_END: "Combat has ended",
            LEVEL_UP: "You have leveled up to level {level}",
            NAVIGATION: "Use arrow keys to navigate the rice paddies"
        }
    }
};

// === STRING INTERPOLATION HELPER ===
export class StringFormatter {
    static format(template, variables = {}) {
        return template.replace(/\{(\w+)\}/g, (match, key) => {
            return variables[key] !== undefined ? variables[key] : match;
        });
    }
    
    // Usage examples:
    // StringFormatter.format(GameStrings.COMBAT.ENEMY_APPEARS, { 
    //     enemyName: "Fierce Cichlid", 
    //     level: 5 
    // });
    // Result: "A wild Fierce Cichlid (Level 5) appears!"
}

// === LOCALIZATION SUPPORT ===
export class LocalizationManager {
    constructor(defaultLocale = 'en') {
        this.currentLocale = defaultLocale;
        this.strings = {
            'en': GameStrings,
            // 'es': SpanishGameStrings,  // Future
            // 'fr': FrenchGameStrings,   // Future
        };
    }
    
    getString(path, variables = {}) {
        const keys = path.split('.');
        let current = this.strings[this.currentLocale];
        
        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Missing string: ${path} for locale ${this.currentLocale}`);
                return path; // Fallback to path as string
            }
            current = current[key];
        }
        
        return StringFormatter.format(current, variables);
    }
    
    setLocale(locale) {
        if (this.strings[locale]) {
            this.currentLocale = locale;
        } else {
            console.warn(`Unsupported locale: ${locale}`);
        }
    }
}

// === USAGE EXAMPLES ===
/*
// Basic usage:
const message = GameStrings.COMBAT.ENEMY_APPEARS
    .replace('{enemyName}', 'Fierce Cichlid')
    .replace('{level}', '5');

// With formatter:
const message = StringFormatter.format(GameStrings.COMBAT.ENEMY_APPEARS, {
    enemyName: 'Fierce Cichlid',
    level: 5
});

// With localization:
const localization = new LocalizationManager();
const message = localization.getString('COMBAT.ENEMY_APPEARS', {
    enemyName: 'Fierce Cichlid', 
    level: 5
});

// In module code:
// Instead of: this.addToCombatLog(`A wild ${enemy.name} (Level ${level}) appears!`);
// Use: this.addToCombatLog(StringFormatter.format(GameStrings.COMBAT.ENEMY_APPEARS, {
//     enemyName: enemy.name,
//     level: level
// }));
*/