/**
 * Player Character Module
 * 
 * Manages player character state including stats, progression, combat
 * mechanics, and equipment. Handles level-ups, damage calculations,
 * spell casting, and visual representation (sprites, colors).
 */
export class Player {
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
    
    // Interface for UI display management (replacing direct HP manipulation)
    getDisplayHP(overrideHP = null) {
        return overrideHP !== null ? overrideHP : this.hp;
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