/**
 * Combat System Module
 * 
 * Manages all combat mechanics including enemy generation, turn-based
 * fighting, spell casting, victory/defeat handling, and visual effects.
 * Handles enemy scaling, special attacks, and combat animations.
 */
export class CombatManager {
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
        const scaledEnemy = { ...enemy };
        
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
        
        // Prehistoric Gar spawns in extreme zone (dark water) until defeated
        const distance = this.world.getDistanceFromVillage(playerX, playerY);
        const isExtremeZone = distance > GameConfig.WORLD.DANGER_ZONES.DANGEROUS_RADIUS;
        
        if (isExtremeZone && !this.hasDefeatedGar) {
            enemyIndex = 4; // Prehistoric Gar
        } else {
            // All other cases spawn from the first 4 enemies
            enemyIndex = Math.floor(Math.random() * 4);
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
            
            // Special friendship message
            this.addToCombatLog(`${this.player.getName()} throws a magical party!`);
            this.addToCombatLog(`${this.currentEnemy.name} is having such a good time!`);
            
            // Set enemy HP to 0 to trigger victory, but mark as befriended
            this.currentEnemy.befriended = true;
            this.currentEnemy.hp = 0;
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
        if (this.currentEnemy.hp <= 0) {
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
        }
        
        this.player.gainExp(exp);
        this.player.gainBettaBites(bettaBites);
        
        if (enemy.befriended) {
            this.addToCombatLog(`${enemy.name} becomes your friend! You gained ${exp} EXP and ${bettaBites} Betta Bites!`);
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
            didLevelUp: willLevelUp
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
        return {
            victory: true,
            showCongratulations: this.lastVictoryWasLevel10
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
                    width: ${size}px;
                    height: ${size * 1.2}px;
                    background: radial-gradient(ellipse at 30% 30%, ${color}, ${color}dd);
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    left: ${startX}%;
                    bottom: -100px;
                    opacity: 0.9;
                    animation: balloon-rise ${Math.random() * 2 + 3}s ease-out forwards;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
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
        
        // Clean up after animation
        setTimeout(() => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }, 5000);
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
    
    addPartyHatToEnemy() {
        const enemyFish = document.getElementById('enemy-fish-combat');
        if (!enemyFish) return;
        
        // Create party hat element
        const partyHat = document.createElement('div');
        partyHat.className = 'party-hat';
        partyHat.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-bottom: 40px solid #FFD700;
            top: -35px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
        `;
        
        // Add stripes to the hat
        const stripe1 = document.createElement('div');
        stripe1.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 30px solid #FF69B4;
            top: 10px;
            left: -15px;
        `;
        partyHat.appendChild(stripe1);
        
        // Add pom-pom on top
        const pompom = document.createElement('div');
        pompom.style.cssText = `
            position: absolute;
            width: 12px;
            height: 12px;
            background: #FF0000;
            border-radius: 50%;
            top: -8px;
            left: -6px;
        `;
        partyHat.appendChild(pompom);
        
        // Position the hat relative to the enemy sprite
        enemyFish.style.position = 'relative';
        enemyFish.appendChild(partyHat);
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
    
    // Proper interfaces for UI interaction (no direct method exposure)
    displayCombatMessage(message) {
        this.addToCombatLog(message);
    }
    
    processCombatVictory(callback) {
        // Delegate to the established method but with proper interface
        this.completeEnemyDefeat(callback);
    }
}