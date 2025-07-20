class BettaRPG {
    constructor() {
        this.player = {
            name: '',
            color: '',
            level: 1,
            hp: 20,
            maxHp: 20,
            mp: 10,
            maxMp: 10,
            exp: 0,
            expToNext: 100,
            bettaBites: 0
        };
        
        this.currentScreen = 'title-screen';
        this.selectedColor = '';
        this.currentEnemy = null;
        this.combatLog = [];
        this.combatActive = false;
        this.ricePaddyPositions = [];
        this.playerMapPosition = { x: 45, y: 55 }; // Start near village
        this.isInEdgeZone = false;
        this.hasReachedEdge = false;
        this.hasDunkleosteusSub = false;
        
        // Initialize audio context for sound effects
        this.audioContext = null;
        this.initAudio();
        
        this.npcs = {
            elder: {
                name: "Elder Finn",
                dialogues: [
                    "Welcome, young one. I sense great potential in you.",
                    "There have been strange happenings lately... fish have been disappearing from the outer paddies.",
                    "The rumors speak of dark shadows that come when the rice stalks sway. Perhaps you could investigate?",
                    "Be careful out there, little betta. The paddies hold many dangers."
                ]
            },
            merchant: {
                name: "Shopkeeper Coral",
                dialogues: [
                    "Welcome to my shop! Though I'm afraid business has been slow lately.",
                    "With all these disappearances, fewer fish dare to venture between the rice stalks.",
                    "I've heard whispers of something lurking in the deeper paddies...",
                    "I do have one special item - an ancient Dunkleosteus submarine for 100 Betta Bites! Would you like to see my wares?"
                ],
                isShop: true
            },
            guard: {
                name: "Guard Captain Reef",
                dialogues: [
                    "Halt! State your business, young betta.",
                    "I've been keeping watch, but these mysterious abductions have me worried.",
                    "Three of our villagers vanished last week while foraging near the tall rice. No trace, no struggle... just gone.",
                    "If you're thinking of investigating, be very careful. Whatever's out there is dangerous."
                ]
            },
            fisherman: {
                name: "Old Fisher Koi",
                dialogues: [
                    "Been fishing these paddies for forty seasons, I have.",
                    "The water tastes different now... metallic, wrong. The insects avoid certain areas.",
                    "I've seen strange ripples in the water where no fish should be swimming.",
                    "Something's stirring up the mud in the deep channels. Mark my words."
                ]
            },
            healer: {
                name: "Sage Lily",
                dialogues: [
                    "The water plants have been dying in patches lately. Most troubling.",
                    "I've been treating more fish for strange bite marks - nothing I recognize.",
                    "The rice above grows strangely twisted in some areas, as if the water itself is tainted.",
                    "If you venture out, take some algae medicine. Something tells me you'll need it."
                ]
            },
            bubble: {
                name: "Bubble the Brave",
                dialogues: [
                    "Hey there! I'm Bubble! I've been wanting to explore the outer paddies forever!",
                    "My fins are strong and I know the waterways better than anyone my age!",
                    "When you decide to investigate these disappearances... well, I'd love to come with you!",
                    "Two bettas are better than one, right? Think about it!"
                ]
            },
            innkeeper: {
                name: "Innkeeper Seaweed",
                dialogues: [
                    "Welcome to the Restful Inn! You look tired, young betta.",
                    "A good rest in our soft kelp beds will restore your strength.",
                    "For just 5 Betta Bites, you can sleep safely and wake up refreshed!",
                    "Would you like to rest? (This will fully restore your HP and MP for 5 Betta Bites)"
                ],
                isInn: true
            }
        };
        
        this.enemies = [
            { 
                name: "Aggressive Guppy", 
                hp: 8, 
                maxHp: 8, 
                attack: 3, 
                exp: 15,
                sprite: "graphics/enemies/aggressive_guppy.png",
                attacks: ["nips at you with tiny teeth", "darts forward in a quick strike", "flails wildly with its tail"]
            },
            { 
                name: "Territorial Angelfish", 
                hp: 12, 
                maxHp: 12, 
                attack: 4, 
                exp: 25,
                sprite: "graphics/enemies/territorial-angelfish.png",
                attacks: ["slashes with its sharp fins", "rams into you aggressively", "spreads its fins menacingly and attacks"]
            },
            { 
                name: "Sneaky Catfish", 
                hp: 15, 
                maxHp: 15, 
                attack: 5, 
                exp: 35,
                sprite: "graphics/enemies/sneaky_catfish.png",
                attacks: ["whips you with its barbels", "lunges from the mud below", "uses its whiskers like whips"]
            },
            { 
                name: "Fierce Cichlid", 
                hp: 18, 
                maxHp: 18, 
                attack: 6, 
                exp: 45,
                sprite: "graphics/enemies/fierce_cichlid.png",
                attacks: ["chomps down with powerful jaws", "charges with incredible force", "delivers a crushing bite"]
            }
        ];
        
        this.initializeEventListeners();
        this.generateRicePaddyPositions();
        this.setupKeyboardControls();
        
        this.betteNames = [
            "Bubbles", "Finley", "Shimmer", "Sparkle", "Azure", "Coral", "Pearl", "Splash", 
            "Ripple", "Glimmer", "Whiskers", "Sunny", "Moonbeam", "Starfish", "Rainbow", 
            "Blossom", "Dewdrop", "Crystal", "Sapphire", "Ruby", "Emerald", "Goldie", 
            "Snowy", "Misty", "Cloudy", "Stormy", "Breezy", "Flicker", "Twinkle", "Dazzle",
            "Pepper", "Cinnamon", "Honey", "Sugar", "Vanilla", "Cocoa", "Mocha", "Caramel",
            "Jasmine", "Rose", "Lily", "Daisy", "Violet", "Iris", "Poppy", "Tulip",
            "Button", "Pebble", "Shell", "Tide", "Wave", "Current", "Flow", "Drift",
            "Zigzag", "Swirl", "Spiral", "Whoosh", "Zoom", "Flash", "Dash", "Bolt",
            "Puddle", "Stream", "Brook", "River", "Lake", "Ocean", "Bay", "Cove",
            "Gentle", "Sweet", "Happy", "Lucky", "Brave", "Noble", "Proud", "Swift"
        ];
    }
    
    generateRicePaddyPositions() {
        this.ricePaddyPositions = [];
        const numTufts = Math.floor(Math.random() * 8) + 5; // 5-12 tufts
        
        for (let i = 0; i < numTufts; i++) {
            this.ricePaddyPositions.push({
                x: Math.random() * 80 + 10, // 10% to 90% of screen width
                y: Math.random() * 70 + 15, // 15% to 85% of screen height
                scale: Math.random() * 0.5 + 0.5 // 0.5x to 1x scale
            });
        }
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    playSound(type) {
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
                
            case 'magic':
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.3);
                break;
                
            case 'victory':
                // Play a short victory tune
                const victoryNotes = [262, 330, 392]; // C, E, G
                victoryNotes.forEach((freq, i) => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);
                    
                    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + i * 0.1);
                    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime + i * 0.1);
                    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * 0.1 + 0.15);
                    osc.start(this.audioContext.currentTime + i * 0.1);
                    osc.stop(this.audioContext.currentTime + i * 0.1 + 0.15);
                });
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
                
            case 'treasure':
                // Play a cheerful "da da!" sound for finding treasure
                const treasureNotes = [392, 523]; // G, C
                treasureNotes.forEach((freq, i) => {
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
    
    enableCombatButtons() {
        document.querySelectorAll('.combat-actions button').forEach(button => {
            button.disabled = false;
        });
    }
    
    disableCombatButtons() {
        document.querySelectorAll('.combat-actions button').forEach(button => {
            button.disabled = true;
        });
    }
    
    initializeEventListeners() {
        document.getElementById('betta-name').addEventListener('input', () => {
            this.updateCharacterPreview();
        });
        
        document.getElementById('random-name-btn').addEventListener('click', () => {
            this.generateRandomName();
        });
        
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectColor(e.target.dataset.color);
            });
        });
        
        document.getElementById('create-character').addEventListener('click', () => {
            this.createCharacter();
        });
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            
            // World map controls
            if (this.currentScreen === 'world-map') {
                switch(event.key) {
                    case 'ArrowUp':
                        event.preventDefault();
                        this.swimDirection('north');
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        this.swimDirection('south');
                        break;
                    case 'ArrowLeft':
                        event.preventDefault();
                        this.swimDirection('west');
                        break;
                    case 'ArrowRight':
                        event.preventDefault();
                        this.swimDirection('east');
                        break;
                    case 'Home':
                        event.preventDefault();
                        this.returnToVillage();
                        break;
                }
            }
            
            // Combat controls
            if (this.currentScreen === 'combat' && this.combatActive) {
                switch(key) {
                    case 'a':
                        event.preventDefault();
                        this.attack();
                        break;
                    case 'b':
                        event.preventDefault();
                        this.useSkill(); // Bubble Blast
                        break;
                    case 's':
                        event.preventDefault();
                        this.runAway(); // Swim Away
                        break;
                }
            }
            
            // Cheat code for Betta Bites
            if (key === '$') {
                event.preventDefault();
                this.player.bettaBites += 100;
                this.updatePlayerStats();
                if (this.currentScreen === 'world-map' || this.currentScreen === 'village') {
                    this.addToEncounterLog("💰 Cheat activated! +100 Betta Bites!");
                }
            }
        });
    }
    
    showScreen(screenId) {
        console.log(`Switching to screen: ${screenId}`);
        
        // Force hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none';
        });
        
        // Force show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.style.display = 'block';
            this.currentScreen = screenId;
            console.log(`Successfully switched to: ${screenId}`);
        } else {
            console.error(`Screen not found: ${screenId}`);
        }
        
        // Show/hide player stats based on screen
        const playerStats = document.getElementById('player-stats');
        if (screenId === 'title-screen' || screenId === 'character-creation') {
            playerStats.classList.remove('show');
        } else {
            playerStats.classList.add('show');
        }
        
        // Set background and decorations based on screen
        this.setScreenBackground(screenId);
    }
    
    setScreenBackground(screenId) {
        const gameContainer = document.getElementById('game-container');
        
        // Remove existing decorations
        document.querySelectorAll('.rice-paddy-tuft, .betta-village, .map-player').forEach(element => element.remove());
        
        if (screenId === 'world-map') {
            gameContainer.style.backgroundImage = 'url(graphics/map/water-tile2.png)';
            gameContainer.style.backgroundRepeat = 'repeat';
            gameContainer.style.backgroundSize = '64px 64px';
            this.showRicePaddies();
        } else if (screenId === 'combat') {
            gameContainer.style.backgroundImage = 'url(graphics/map/water-tile.png)';
            gameContainer.style.backgroundRepeat = 'repeat';
            gameContainer.style.backgroundSize = '64px 64px';
        } else {
            gameContainer.style.backgroundImage = '';
            gameContainer.style.backgroundRepeat = '';
            gameContainer.style.backgroundSize = '';
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
        
        // Add village
        const village = document.createElement('img');
        village.src = 'graphics/map/bettahome.png';
        village.className = 'betta-village';
        village.style.position = 'absolute';
        village.style.left = '50%';
        village.style.top = '50%';
        village.style.transform = 'translate(-50%, -50%)';
        village.style.pointerEvents = 'none';
        village.style.zIndex = '2';
        village.style.imageRendering = 'pixelated';
        worldMapScreen.appendChild(village);
        
        // Add player on map
        this.showPlayerOnMap();
    }
    
    showPlayerOnMap() {
        const worldMapScreen = document.getElementById('world-map');
        
        // Remove existing player marker
        const existingPlayer = document.querySelector('.map-player');
        if (existingPlayer) existingPlayer.remove();
        
        const player = document.createElement('img');
        player.src = this.getPlayerSprite();
        player.className = 'map-player';
        player.style.position = 'absolute';
        player.style.left = `${this.playerMapPosition.x}%`;
        player.style.top = `${this.playerMapPosition.y}%`;
        player.style.transform = 'translate(-50%, -50%)';
        player.style.pointerEvents = 'none';
        player.style.zIndex = '3';
        player.style.imageRendering = 'pixelated';
        if (this.hasDunkleosteusSub) {
            player.style.filter = 'none';
        } else {
            player.style.filter = this.getColorFilter(this.player.color);
        }
        worldMapScreen.appendChild(player);
    }
    
    startCharacterCreation() {
        this.showScreen('character-creation');
        // Set defaults
        this.generateRandomName();
        this.selectColor('red');
    }
    
    generateRandomName() {
        const randomIndex = Math.floor(Math.random() * this.betteNames.length);
        const randomName = this.betteNames[randomIndex];
        document.getElementById('betta-name').value = randomName;
        this.updateCharacterPreview();
    }
    
    selectColor(color) {
        this.selectedColor = color;
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-color="${color}"]`).classList.add('selected');
        this.updateCharacterPreview();
    }
    
    updateCharacterPreview() {
        const nameValue = document.getElementById('betta-name').value.trim();
        const name = nameValue || '???';
        const color = this.selectedColor || 'Choose a color';
        
        document.getElementById('preview-name').textContent = name;
        document.getElementById('preview-color').textContent = color;
        
        const createButton = document.getElementById('create-character');
        createButton.disabled = !nameValue || !this.selectedColor;
        
        if (this.selectedColor) {
            const preview = document.getElementById('betta-preview');
            preview.style.filter = this.getColorFilter(this.selectedColor);
        }
    }
    
    getPlayerSprite() {
        if (this.hasDunkleosteusSub) {
            return 'graphics/artifacts/dunkleosteus_sub.png';
        }
        
        const level = this.player.level;
        
        if (level >= 10) {
            return 'graphics/main_fish/player_betta_full_metal.png';
        } else if (level >= 7) {
            return 'graphics/main_fish/player_betta_with_almost_armor.png';
        } else if (level >= 5) {
            return 'graphics/main_fish/player_betta_with_helmet_and_fin_guards.png';
        } else if (level >= 3) {
            return 'graphics/main_fish/player_betta_with_helmet.png';
        } else {
            return 'graphics/main_fish/player_betta.png';
        }
    }
    
    getColorFilter(color) {
        const filters = {
            red: 'hue-rotate(0deg) saturate(1.2)',
            blue: 'hue-rotate(180deg) saturate(1.3)',
            purple: 'hue-rotate(270deg) saturate(1.8)',
            green: 'hue-rotate(130deg) saturate(1.6)',
            gold: 'hue-rotate(50deg) saturate(2) brightness(1.2)'
        };
        return filters[color] || 'none';
    }
    
    createCharacter() {
        console.log('createCharacter called');
        const nameInput = document.getElementById('betta-name');
        console.log('Name input:', nameInput ? nameInput.value : 'not found');
        console.log('Selected color:', this.selectedColor);
        
        if (!nameInput || !nameInput.value.trim()) {
            alert('Please enter a name for your betta!');
            return;
        }
        if (!this.selectedColor) {
            alert('Please select a color for your betta!');
            return;
        }
        
        this.player.name = nameInput.value.trim();
        this.player.color = this.selectedColor;
        console.log('Player created:', this.player);
        this.updatePlayerStats();
        console.log('About to switch to village screen');
        
        // Add welcome message to encounter log
        this.addToEncounterLog(`Welcome to Paddy Village, ${this.player.name}! Your adventure begins here.`);
        
        this.showScreen('village');
    }
    
    updatePlayerStats() {
        document.getElementById('hp').textContent = this.player.hp;
        document.getElementById('max-hp').textContent = this.player.maxHp;
        document.getElementById('mp').textContent = this.player.mp;
        document.getElementById('max-mp').textContent = this.player.maxMp;
        document.getElementById('level').textContent = this.player.level;
        document.getElementById('exp').textContent = this.player.exp;
        document.getElementById('exp-next').textContent = this.player.expToNext;
        document.getElementById('betta-bites').textContent = this.player.bettaBites;
        
        // Update stats panel sprite
        const statsSprite = document.getElementById('stats-player-sprite');
        if (statsSprite && this.player.color) {
            statsSprite.src = this.getPlayerSprite();
            if (this.hasDunkleosteusSub) {
                statsSprite.style.filter = 'none';
            } else {
                statsSprite.style.filter = this.getColorFilter(this.player.color);
            }
        }
    }
    
    talkToNPC(npcId) {
        const npc = this.npcs[npcId];
        if (!npc) return;
        
        this.showScreen('dialogue');
        this.currentNPC = npcId;
        this.currentDialogueIndex = 0;
        
        document.getElementById('npc-name').textContent = npc.name;
        this.showDialogue();
    }
    
    showDialogue() {
        const npc = this.npcs[this.currentNPC];
        const dialogue = npc.dialogues[this.currentDialogueIndex];
        
        document.getElementById('dialogue-text').textContent = dialogue;
        
        const optionsDiv = document.getElementById('dialogue-options');
        optionsDiv.innerHTML = '';
        
        if (this.currentDialogueIndex < npc.dialogues.length - 1) {
            const continueOption = document.createElement('div');
            continueOption.className = 'dialogue-option';
            continueOption.textContent = 'Continue...';
            continueOption.onclick = () => this.nextDialogue();
            optionsDiv.appendChild(continueOption);
        } else {
            if (npc.isInn) {
                const restOption = document.createElement('div');
                restOption.className = 'dialogue-option';
                restOption.textContent = 'Rest (Restore HP/MP)';
                restOption.onclick = () => this.restAtInn();
                optionsDiv.appendChild(restOption);
            }
            
            if (npc.isShop) {
                const shopOption = document.createElement('div');
                shopOption.className = 'dialogue-option';
                shopOption.textContent = 'Browse Items';
                shopOption.onclick = () => this.showShop();
                optionsDiv.appendChild(shopOption);
            }
            
            const endOption = document.createElement('div');
            endOption.className = 'dialogue-option';
            endOption.textContent = 'Goodbye';
            endOption.onclick = () => this.endDialogue();
            optionsDiv.appendChild(endOption);
        }
    }
    
    nextDialogue() {
        this.currentDialogueIndex++;
        this.showDialogue();
    }
    
    restAtInn() {
        const innCost = 5;
        
        if (this.player.bettaBites < innCost) {
            document.getElementById('dialogue-text').textContent = `You need ${innCost} Betta Bites to rest here. You only have ${this.player.bettaBites}.`;
            
            const optionsDiv = document.getElementById('dialogue-options');
            optionsDiv.innerHTML = '';
            
            const endOption = document.createElement('div');
            endOption.className = 'dialogue-option';
            endOption.textContent = 'I\'ll come back later';
            endOption.onclick = () => this.endDialogue();
            optionsDiv.appendChild(endOption);
            return;
        }
        
        this.player.bettaBites -= innCost;
        this.player.hp = this.player.maxHp;
        this.player.mp = this.player.maxMp;
        this.updatePlayerStats();
        
        document.getElementById('dialogue-text').textContent = `You pay ${innCost} Betta Bites and rest in the soft kelp beds. You wake up completely refreshed! HP and MP fully restored.`;
        
        const optionsDiv = document.getElementById('dialogue-options');
        optionsDiv.innerHTML = '';
        
        const endOption = document.createElement('div');
        endOption.className = 'dialogue-option';
        endOption.textContent = 'Thank you!';
        endOption.onclick = () => this.endDialogue();
        optionsDiv.appendChild(endOption);
    }
    
    showShop() {
        if (this.hasDunkleosteusSub) {
            document.getElementById('dialogue-text').textContent = "Sorry, I've sold my only special item! Come back if I get more inventory.";
            
            const optionsDiv = document.getElementById('dialogue-options');
            optionsDiv.innerHTML = '';
            
            const endOption = document.createElement('div');
            endOption.className = 'dialogue-option';
            endOption.textContent = 'I understand';
            endOption.onclick = () => this.endDialogue();
            optionsDiv.appendChild(endOption);
            return;
        }
        
        document.getElementById('dialogue-text').textContent = `Dunkleosteus Submarine - A mysterious ancient vessel that transforms your appearance completely! Price: 100 Betta Bites. You have ${this.player.bettaBites} Betta Bites.`;
        
        const optionsDiv = document.getElementById('dialogue-options');
        optionsDiv.innerHTML = '';
        
        if (this.player.bettaBites >= 100) {
            const buyOption = document.createElement('div');
            buyOption.className = 'dialogue-option';
            buyOption.textContent = 'Buy Dunkleosteus Submarine (100 Betta Bites)';
            buyOption.onclick = () => this.buyDunkleosteusSub();
            optionsDiv.appendChild(buyOption);
        }
        
        const backOption = document.createElement('div');
        backOption.className = 'dialogue-option';
        backOption.textContent = 'Maybe later';
        backOption.onclick = () => this.endDialogue();
        optionsDiv.appendChild(backOption);
    }
    
    buyDunkleosteusSub() {
        this.player.bettaBites -= 100;
        this.hasDunkleosteusSub = true;
        this.updatePlayerStats();
        
        this.playSound('treasure');
        
        document.getElementById('dialogue-text').textContent = "Excellent choice! The ancient Dunkleosteus submarine is now yours! You feel its power transforming your very essence. You are no longer just a betta - you are a legendary sea creature!";
        
        const optionsDiv = document.getElementById('dialogue-options');
        optionsDiv.innerHTML = '';
        
        const endOption = document.createElement('div');
        endOption.className = 'dialogue-option';
        endOption.textContent = 'Amazing!';
        endOption.onclick = () => this.endDialogue();
        optionsDiv.appendChild(endOption);
    }
    
    endDialogue() {
        this.showScreen('village');
    }
    
    exitVillage() {
        // Reset player position near village when exiting
        this.playerMapPosition = { x: 45, y: 55 };
        this.showScreen('world-map');
        this.addToEncounterLog("You venture into the rice paddies, leaving the safety of Paddy Village behind.");
    }
    
    returnToVillage() {
        this.showScreen('village');
    }
    
    checkEdgeStatus() {
        const x = this.playerMapPosition.x;
        const y = this.playerMapPosition.y;
        
        // Check if at actual edge (within 2% of boundary)
        const atEdge = (x <= 7 || x >= 93 || y <= 7 || y >= 93);
        
        // Check if in edge zone (within 10% of boundary - closer to actual edge)
        const inEdgeZone = (x <= 15 || x >= 85 || y <= 15 || y >= 85);
        
        this.isInEdgeZone = inEdgeZone;
        
        return { atEdge, inEdgeZone };
    }
    
    showEdgeMessage() {
        this.addToEncounterLog("🌟 ══════════════════════════════════════ 🌟");
        this.addToEncounterLog("    🎉 CONGRATULATIONS! 🎉");
        this.addToEncounterLog("  You've reached the edge of your paddy!");
        this.addToEncounterLog("    What lies beyond? More adventures await!");
        this.addToEncounterLog("           (In Development)");
        this.addToEncounterLog("🌟 ══════════════════════════════════════ 🌟");
        this.hasReachedEdge = true;
    }
    
    swimDirection(direction) {
        const directionTexts = {
            north: "You swim north through the rice stalks, water becoming murkier.",
            south: "You swim south where the water runs clearer near the village.",
            east: "You swim east toward the morning sun, rice casting long shadows.",
            west: "You swim west where the rice grows thickest and oldest."
        };
        
        // Move player position
        const moveDistance = 3; // 3% of screen for smaller steps
        switch(direction) {
            case 'north': this.playerMapPosition.y = Math.max(5, this.playerMapPosition.y - moveDistance); break;
            case 'south': this.playerMapPosition.y = Math.min(95, this.playerMapPosition.y + moveDistance); break;
            case 'east': this.playerMapPosition.x = Math.min(95, this.playerMapPosition.x + moveDistance); break;
            case 'west': this.playerMapPosition.x = Math.max(5, this.playerMapPosition.x - moveDistance); break;
        }
        
        // Update player position on map
        this.showPlayerOnMap();
        
        // Check edge status
        const { atEdge, inEdgeZone } = this.checkEdgeStatus();
        
        this.addToEncounterLog(directionTexts[direction]);
        
        // Show edge message if player reached the edge for the first time
        if (atEdge && !this.hasReachedEdge) {
            this.showEdgeMessage();
            return; // Skip encounter generation when showing edge message
        }
        
        // In edge zone: guaranteed encounters
        if (inEdgeZone) {
            this.addToEncounterLog("The water here teems with dangerous predators!");
            this.startRandomEncounter();
            return;
        }
        
        // Normal encounter logic for safe areas
        const encounterChance = Math.random();
        
        if (encounterChance < 0.4) {
            this.startRandomEncounter();
        } else if (encounterChance < 0.6) {
            this.findBettaBites();
        } else if (encounterChance < 0.8) {
            this.addToEncounterLog("You find a peaceful stretch of water between the rice stalks.");
        } else {
            this.addToEncounterLog("You notice disturbed mud and broken rice stems... something was here recently.");
        }
    }
    
    findBettaBites() {
        const bettaBitesFound = Math.floor(Math.random() * 3) + 1; // 1-3 Betta Bites
        this.player.bettaBites += bettaBitesFound;
        this.updatePlayerStats();
        
        this.playSound('treasure');
        
        const findTexts = [
            `You discover ${bettaBitesFound} Betta Bites hidden among the rice roots!`,
            `A glint catches your eye - ${bettaBitesFound} Betta Bites floating near a rice stalk!`,
            `You nose around the mud and find ${bettaBitesFound} delicious Betta Bites!`,
            `Lucky you! ${bettaBitesFound} Betta Bites were tucked behind some algae!`
        ];
        
        const findText = findTexts[Math.floor(Math.random() * findTexts.length)];
        this.addToEncounterLog(findText);
    }
    
    calculateEnemyLevel() {
        // Calculate distance from village center (50%, 50%)
        const centerX = 50;
        const centerY = 50;
        const distanceX = Math.abs(this.playerMapPosition.x - centerX);
        const distanceY = Math.abs(this.playerMapPosition.y - centerY);
        const maxDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Edge zone gets special level 10 enemies
        if (this.isInEdgeZone) {
            return 10;
        }
        
        // Convert distance to a level between 1-5
        // Close to town (distance 0-10): mostly level 1
        // Far from town (distance 35+): mostly level 5
        let baseLevel = 1;
        if (maxDistance > 10) baseLevel = 2;
        if (maxDistance > 20) baseLevel = 3;
        if (maxDistance > 30) baseLevel = 4;
        if (maxDistance > 35) baseLevel = 5;
        
        // Add some randomness but keep it reasonable
        const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const finalLevel = Math.max(1, Math.min(5, baseLevel + variation));
        
        return finalLevel;
    }
    
    scaleEnemyWithLevel(enemy, level) {
        const scaledEnemy = { ...enemy };
        
        // Scale HP: base HP * (1 + (level-1) * 0.5)
        // Level 1: 1.0x, Level 2: 1.5x, Level 3: 2.0x, Level 4: 2.5x, Level 5: 3.0x
        const hpMultiplier = 1 + (level - 1) * 0.5;
        scaledEnemy.hp = Math.floor(enemy.hp * hpMultiplier);
        scaledEnemy.maxHp = scaledEnemy.hp;
        
        // Scale damage: base attack * (1 + (level-1) * 0.3)
        // Level 1: 1.0x, Level 2: 1.3x, Level 3: 1.6x, Level 4: 1.9x, Level 5: 2.2x
        const damageMultiplier = 1 + (level - 1) * 0.3;
        scaledEnemy.attack = Math.floor(enemy.attack * damageMultiplier);
        
        // Scale EXP slightly: base exp * (1 + (level-1) * 0.2)
        const expMultiplier = 1 + (level - 1) * 0.2;
        scaledEnemy.exp = Math.floor(enemy.exp * expMultiplier);
        
        scaledEnemy.level = level;
        
        return scaledEnemy;
    }
    
    startRandomEncounter() {
        const baseEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
        const enemyLevel = this.calculateEnemyLevel();
        
        this.currentEnemy = this.scaleEnemyWithLevel(baseEnemy, enemyLevel);
        this.currentEnemy.randomHue = Math.floor(Math.random() * 360); // Random hue for color variation
        this.combatActive = true;
        
        const levelText = enemyLevel > 1 ? ` (Level ${enemyLevel})` : '';
        this.addToEncounterLog(`A wild ${baseEnemy.name}${levelText} appears!`);
        
        // Update combat display BEFORE showing screen to prevent flash of old enemy
        this.updateCombatDisplay();
        this.showScreen('combat');
        
        // Remove combat-over class for new battle
        document.getElementById('combat').classList.remove('combat-over');
        
        this.enableCombatButtons();
        
        // Play combat start sound
        this.playSound('combatstart');
    }
    
    updateCombatDisplay() {
        document.getElementById('player-name-combat').textContent = this.player.name;
        
        // Show enemy name and level separately
        document.getElementById('enemy-name').textContent = this.currentEnemy.name;
        document.getElementById('enemy-level').textContent = `Level ${this.currentEnemy.level}`;
        
        // Set player fish appearance
        const playerFish = document.getElementById('player-fish-combat');
        playerFish.src = this.getPlayerSprite();
        if (this.hasDunkleosteusSub) {
            playerFish.style.filter = 'none';
        } else {
            playerFish.style.filter = this.getColorFilter(this.player.color);
        }
        
        // Set enemy fish appearance
        const enemyFish = document.getElementById('enemy-fish-combat');
        enemyFish.src = this.currentEnemy.sprite;
        enemyFish.style.filter = `hue-rotate(${this.currentEnemy.randomHue}deg) saturate(1.3)`;
        enemyFish.style.transform = 'scaleX(-1)'; // Reset to normal facing left orientation
        
        // Disable swim away button for high level enemies
        const swimAwayBtn = document.getElementById('swim-away-btn');
        const swimAwayMessage = document.getElementById('swim-away-message');
        
        if (this.currentEnemy.level >= 5) {
            swimAwayBtn.disabled = true;
            swimAwayMessage.textContent = "⚡ The enemy is too fast to escape! ⚡";
            this.addToCombatLog("The enemy is too fast to escape from!");
        } else {
            swimAwayBtn.disabled = false;
            swimAwayMessage.textContent = "";
        }
        
        this.updateCombatHP();
        this.addToCombatLog(`Combat begins! ${this.player.name} vs ${this.currentEnemy.name}`);
    }
    
    updateCombatHP() {
        const playerHpPercent = (this.player.hp / this.player.maxHp) * 100;
        const enemyHpPercent = (this.currentEnemy.hp / this.currentEnemy.maxHp) * 100;
        
        document.getElementById('player-hp-bar').style.width = `${playerHpPercent}%`;
        document.getElementById('enemy-hp-bar').style.width = `${enemyHpPercent}%`;
        
        document.getElementById('player-hp-text').textContent = `${this.player.hp}/${this.player.maxHp}`;
        document.getElementById('enemy-hp-text').textContent = `${this.currentEnemy.hp}/${this.currentEnemy.maxHp}`;
    }
    
    attack() {
        if (!this.combatActive) return;
        
        this.playSound('attack');
        
        const playerDamage = Math.floor(Math.random() * 8) + 3;
        this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - playerDamage);
        
        const attackActions = [
            "strikes with swift fins",
            "lunges forward aggressively", 
            "delivers a powerful tail slap",
            "bites with determination",
            "charges with fierce intensity"
        ];
        const attackAction = attackActions[Math.floor(Math.random() * attackActions.length)];
        
        this.addToCombatLog(`${this.player.name} ${attackAction} for ${playerDamage} damage!`);
        
        // Update HP display first
        this.updateCombatHP();
        
        // Enemy damage animation
        const enemyFish = document.getElementById('enemy-fish-combat');
        enemyFish.classList.add('shake');
        setTimeout(() => {
            enemyFish.classList.remove('shake');
        }, 500);
        
        if (this.currentEnemy.hp <= 0) {
            // Flip enemy fish to show defeat
            setTimeout(() => {
                enemyFish.style.transform = 'scaleX(-1) scaleY(-1)';
            }, 250); // Delay to show HP drop first
            this.winCombat();
            return;
        }
        
        this.enemyTurn();
    }
    
    useSkill() {
        if (!this.combatActive) return;
        
        if (this.player.mp < 3) {
            this.addToCombatLog("Not enough MP!");
            return;
        }
        
        this.playSound('magic');
        
        this.player.mp -= 3;
        const skillDamage = Math.floor(Math.random() * 12) + 5;
        this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - skillDamage);
        
        const bubbleActions = [
            "unleashes a torrent of magical bubbles",
            "creates a swirling vortex of powerful bubbles", 
            "summons a burst of explosive bubbles",
            "channels energy into a devastating bubble storm"
        ];
        const bubbleAction = bubbleActions[Math.floor(Math.random() * bubbleActions.length)];
        
        this.addToCombatLog(`${this.player.name} ${bubbleAction} for ${skillDamage} damage!`);
        
        // Update HP display first
        this.updateCombatHP();
        
        // Enemy damage animation
        const enemyFish = document.getElementById('enemy-fish-combat');
        enemyFish.classList.add('shake');
        setTimeout(() => {
            enemyFish.classList.remove('shake');
        }, 500);
        
        if (this.currentEnemy.hp <= 0) {
            // Flip enemy fish to show defeat
            setTimeout(() => {
                enemyFish.style.transform = 'scaleX(-1) scaleY(-1)';
            }, 250); // Delay to show HP drop first
            this.winCombat();
            return;
        }
        
        this.enemyTurn();
        this.updateCombatHP();
        this.updatePlayerStats();
    }
    
    runAway() {
        if (!this.combatActive) return;
        
        // Check if escape is disabled for high level enemies
        if (this.currentEnemy.level >= 5) {
            this.addToCombatLog("You try to escape, but the enemy is too fast!");
            this.enemyTurn();
            return;
        }
        
        // For levels 1-3, escape should always work (no enemy turn on success)
        this.combatActive = false;
        this.disableCombatButtons();
        this.addToCombatLog(`${this.player.name} swims away quickly!`);
        setTimeout(() => {
            this.showScreen('world-map');
            this.addToEncounterLog("You managed to escape!");
        }, 1500);
    }
    
    enemyTurn() {
        // Get random attack description
        const attackDesc = this.currentEnemy.attacks[Math.floor(Math.random() * this.currentEnemy.attacks.length)];
        
        if (this.hasDunkleosteusSub) {
            // Dunkleosteus submarine is invulnerable
            this.addToCombatLog(`${this.currentEnemy.name} ${attackDesc} but the ancient armor deflects all damage!`);
            this.playSound('attack'); // Different sound for deflection
        } else {
            // Normal damage calculation
            const enemyDamage = Math.floor(Math.random() * this.currentEnemy.attack) + 1;
            this.player.hp = Math.max(0, this.player.hp - enemyDamage);
            
            this.addToCombatLog(`${this.currentEnemy.name} ${attackDesc} for ${enemyDamage} damage!`);
            
            // Play wound sound and shake animation
            this.playSound('wound');
            const playerFish = document.getElementById('player-fish-combat');
            playerFish.classList.add('shake');
            setTimeout(() => {
                playerFish.classList.remove('shake');
            }, 500);
            
            if (this.player.hp <= 0) {
                // Update HP display to show 0 before calling loseCombat
                this.updateCombatHP();
                this.updatePlayerStats();
                this.loseCombat();
                return;
            }
        }
    }
    
    winCombat() {
        this.combatActive = false;
        this.disableCombatButtons();
        
        // Add combat-over class to show waiting cursor everywhere
        document.getElementById('combat').classList.add('combat-over');
        
        this.playSound('fanfare');
        
        const expGained = this.currentEnemy.exp;
        
        // Scale Betta Bites based on enemy level
        // Base: 1-5 Betta Bites, +1-2 per level above 1
        const baseBites = Math.floor(Math.random() * 5) + 1; // 1-5 Betta Bites
        const levelBonus = (this.currentEnemy.level - 1) * (Math.floor(Math.random() * 2) + 1); // 1-2 per level
        const bettaBitesGained = baseBites + levelBonus;
        
        this.player.exp += expGained;
        this.player.bettaBites += bettaBitesGained;
        
        this.addToCombatLog(`Victory! Gained ${expGained} EXP and ${bettaBitesGained} Betta Bites!`);
        
        // Show congratulations message for first Level 10 victory
        if (this.currentEnemy.level === 10 && !this.hasReachedEdge) {
            this.hasReachedEdge = true;
            setTimeout(() => {
                this.showEdgeMessage();
                setTimeout(() => {
                    this.showScreen('world-map');
                    this.addToEncounterLog(`Defeated ${this.currentEnemy.name}!`);
                    this.updatePlayerStats();
                }, 2000); // Extra delay to read congratulations
            }, 2000);
        } else {
            setTimeout(() => {
                this.showScreen('world-map');
                this.addToEncounterLog(`Defeated ${this.currentEnemy.name}!`);
                this.updatePlayerStats();
            }, 3000);
        }
        
        if (this.player.exp >= this.player.expToNext) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.player.level++;
        this.player.exp -= this.player.expToNext;
        this.player.expToNext = Math.floor(this.player.expToNext * 1.2);
        
        const hpIncrease = Math.floor(Math.random() * 5) + 3;
        const mpIncrease = Math.floor(Math.random() * 3) + 1;
        
        this.player.maxHp += hpIncrease;
        this.player.maxMp += mpIncrease;
        this.player.hp = this.player.maxHp;
        this.player.mp = this.player.maxMp;
        
        // Play level up sound after a short delay so it comes after victory fanfare
        setTimeout(() => {
            this.playSound('levelup');
        }, 1000);
        
        this.addToCombatLog(`Level up! Now level ${this.player.level}!`);
        this.addToCombatLog(`HP increased by ${hpIncrease}! MP increased by ${mpIncrease}!`);
        
        // Check for armor upgrades
        const newLevel = this.player.level;
        if (newLevel === 3) {
            this.addToCombatLog("You've gained a protective helmet!");
        } else if (newLevel === 5) {
            this.addToCombatLog("Your armor has been upgraded with fin guards!");
        } else if (newLevel === 7) {
            this.addToCombatLog("You're now wearing advanced protective armor!");
        } else if (newLevel === 10) {
            this.addToCombatLog("You've achieved full metal armor! Maximum protection!");
        }
    }
    
    loseCombat() {
        this.combatActive = false;
        this.disableCombatButtons();
        
        // Add combat-over class to show waiting cursor everywhere
        document.getElementById('combat').classList.add('combat-over');
        
        this.addToCombatLog("You have been defeated...");
        
        // Flip player fish to show death (combat screen)
        const playerFish = document.getElementById('player-fish-combat');
        playerFish.style.transform = 'scaleY(-1)';
        
        // Also flip player fish in stats panel
        const statsSprite = document.getElementById('stats-player-sprite');
        if (statsSprite) {
            statsSprite.style.transform = 'scaleY(-1)';
        }
        
        setTimeout(() => {
            // Calculate Betta Bites loss (half, rounded down)
            const bettaBitesLost = Math.floor(this.player.bettaBites / 2);
            const bettaBitesRemaining = this.player.bettaBites - bettaBitesLost;
            
            // Reset to full HP and MP
            this.player.hp = this.player.maxHp;
            this.player.mp = this.player.maxMp;
            this.player.bettaBites = bettaBitesRemaining;
            
            // Show loss message in combat log before switching screens
            if (bettaBitesLost > 0) {
                this.addToCombatLog(`You lost ${bettaBitesLost} Betta Bites...`);
            }
            
            // Brief delay to let player see the loss before switching to village
            setTimeout(() => {
                // Reset player fish orientation (both locations)
                playerFish.style.transform = '';
                if (statsSprite) {
                    statsSprite.style.transform = '';
                }
                
                this.showScreen('village');
                
                if (bettaBitesLost > 0) {
                    this.addToEncounterLog(`You wake up back in the village, rescued by other bettas. You lost ${bettaBitesLost} Betta Bites but feel fully recovered!`);
                } else {
                    this.addToEncounterLog("You wake up back in the village, rescued by other bettas. You feel fully recovered!");
                }
                
                this.updatePlayerStats();
            }, 1500); // Additional delay to see the loss message
        }, 2000);
    }
    
    addToCombatLog(message) {
        const log = document.getElementById('combat-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = message;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }
    
    addToEncounterLog(message) {
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
                log.appendChild(entry);
                log.scrollTop = log.scrollHeight;
            }
        });
    }
}

let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new BettaRPG();
});