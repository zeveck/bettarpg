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
        this.enterPressed = false; // Track Enter key state
        this.selectedColor = '';
        this.currentEnemy = null;
        this.combatLog = [];
        this.combatActive = false;
        this.ricePaddyPositions = [];
        this.playerMapPosition = { x: 45, y: 55 }; // Start near village
        this.playerFacing = 'right'; // Track which direction player is facing
        this.isInEdgeZone = false;
        this.hasReachedEdge = false;
        this.hasDunkleosteusSub = false;
        this.hasDefeatedGar = false;
        this.garTurnCounter = 0;
        
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
            bubble: {
                name: "Bubble the Brave",
                dialogues: [
                    "Hey there! I'm Bubble! I've been wanting to explore the outer paddies forever!",
                    "My fins are strong and I know the waterways better than anyone my age!",
                    "I dream of swimming up to the big city on the next terrace! They say it's amazing up there!",
                    "When you decide to investigate these disappearances... well, I'd love to come with you!"
                ]
            },
            innkeeper: {
                name: "Innkeeper Seaweed",
                dialogues: [
                    "Welcome to the Swishy Solace Inn! You look tired, young betta.",
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
            },
            { 
                name: "Prehistoric Gar", 
                hp: 25, 
                maxHp: 25, 
                attack: 8, 
                exp: 75,
                sprite: "graphics/enemies/prehistoric_gar.png",
                attacks: ["strikes like lightning with razor teeth", "lunges with prehistoric fury", "snaps its ancient jaws with deadly precision", "attacks with the speed of a living torpedo"]
            }
        ];
        
        this.initializeEventListeners();
        this.generateRicePaddyPositions();
        this.setupKeyboardControls();
        this.setupCongratulationsPopup();
        
        this.betteNames = [
            "Bubbles", "Finley", "Shimmer", "Sparkle", "Azure", "Coral", "Pearl", "Splash", 
            "Ripple", "Glimmer", "Whiskers", "Sunny", "Moonbeam", "Starfish", "Rainbow", 
            "Blossom", "Dewdrop", "Crystal", "Sapphire", "Ruby", "Emerald", "Goldie", 
            "Snowy", "Misty", "Cloudy", "Stormy", "Breezy", "Flicker", "Twinkle", "Dazzle",
            "Pepper", "Cinnamon", "Honey", "Sugar", "Vanilla", "Cocoa", "Mocha", "Caramel",
            "Jasmine", "Rose", "Lily", "Daisy", "Violet", "Iris", "Poppy", "Tulip",
            "Button", "Pebble", "Shell", "Tide", "Wave", "Flow", "Drift",
            "Zigzag", "Swirl", "Spiral", "Whoosh", "Zoom", "Flash", "Dash", "Bolt",
            "Puddle", "Stream", "Brook", "River", "Lake", "Ocean", "Bay", "Cove",
            "Gentle", "Sweet", "Happy", "Lucky", "Brave", "Noble", "Proud", "Swift"
        ];
    }
    
    generateRicePaddyPositions() {
        this.ricePaddyPositions = [];
        const numTufts = Math.floor(Math.random() * 12) + 15; // 15-26 tufts
        
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
            
            // Title screen controls
            if (this.currentScreen === 'title-screen') {
                switch(event.key) {
                    case 'Enter':
                        event.preventDefault();
                        this.enterPressed = true; // Mark that Enter was just pressed
                        this.startCharacterCreation();
                        break;
                }
                return; // Prevent further processing
            }
            
            // Character creation controls
            if (this.currentScreen === 'character-creation') {
                switch(event.key) {
                    case 'Enter':
                        event.preventDefault();
                        // Prevent the same Enter keypress that brought us to this screen
                        if (this.enterPressed) {
                            this.enterPressed = false; // Reset flag and ignore this keypress
                            return;
                        }
                        // Only start if character is valid
                        if (this.selectedColor && document.getElementById('betta-name').value.trim()) {
                            this.createCharacter();
                        }
                        break;
                }
                return; // Prevent further processing
            }
            
            // Dialogue controls
            if (this.currentScreen === 'dialogue') {
                const dialogueOptions = document.querySelectorAll('.dialogue-option');
                
                switch(key) {
                    case 'c':
                        event.preventDefault();
                        // Continue dialogue if available
                        const continueBtn = [...dialogueOptions].find(btn => btn.innerHTML.includes('<u>C</u>ontinue'));
                        if (continueBtn) continueBtn.click();
                        break;
                    case 'r':
                        event.preventDefault();
                        // Rest at inn if available
                        const restBtn = [...dialogueOptions].find(btn => btn.innerHTML.includes('<u>R</u>est'));
                        if (restBtn) restBtn.click();
                        break;
                    case 'b':
                        event.preventDefault();
                        // First check if we're in shop mode by looking for shop items
                        const bubbleWater = [...document.querySelectorAll('.shop-item-buyable .item-name')].find(item => item.innerHTML.includes('<u>B</u>ubble'));
                        if (bubbleWater) {
                            // We're in shop mode, buy Bubble Water
                            bubbleWater.parentElement.click();
                        } else {
                            // We're in dialogue mode, Browse items
                            const browseBtn = [...dialogueOptions].find(btn => btn.innerHTML.includes('<u>B</u>rowse'));
                            if (browseBtn) browseBtn.click();
                        }
                        break;
                    case 'g':
                        event.preventDefault();
                        // Goodbye
                        const goodbyeBtn = [...dialogueOptions].find(btn => btn.innerHTML.includes('<u>G</u>oodbye'));
                        if (goodbyeBtn) goodbyeBtn.click();
                        break;
                    case 'i':
                        event.preventDefault();
                        // I understand or I'll come back later
                        const iBtn = [...dialogueOptions].find(btn => btn.innerHTML.includes('<u>I</u>'));
                        if (iBtn) iBtn.click();
                        break;
                    case 't':
                        event.preventDefault();
                        // Thank you
                        const thankBtn = [...dialogueOptions].find(btn => btn.innerHTML.includes('<u>T</u>hank'));
                        if (thankBtn) thankBtn.click();
                        break;
                    case 'h':
                        event.preventDefault();
                        // Thanks (with h underlined)
                        const thanksBtn = [...dialogueOptions].find(btn => btn.innerHTML.includes('T<u>h</u>anks'));
                        if (thanksBtn) thanksBtn.click();
                        break;
                    case 'a':
                        event.preventDefault();
                        // Amazing or Ahh
                        const aBtn = [...dialogueOptions].find(btn => btn.innerHTML.includes('<u>A</u>'));
                        if (aBtn) aBtn.click();
                        break;
                    case 'm':
                        event.preventDefault();
                        // Maybe later
                        const maybeBtn = [...dialogueOptions].find(btn => btn.innerHTML.includes('<u>M</u>aybe'));
                        if (maybeBtn) maybeBtn.click();
                        break;
                    case 'd':
                        event.preventDefault();
                        // Dunkleosteus Submarine (if affordable and clickable)
                        const dunkleosteusSub = document.querySelector('.shop-item-buyable .item-name');
                        if (dunkleosteusSub && dunkleosteusSub.innerHTML.includes('<u>D</u>unkleosteus')) {
                            dunkleosteusSub.parentElement.click();
                        }
                        break;
                    case 'k':
                        event.preventDefault();
                        // Kelp Snack (if affordable and clickable)
                        const kelpSnack = [...document.querySelectorAll('.shop-item-buyable .item-name')].find(item => item.innerHTML.includes('<u>K</u>elp'));
                        if (kelpSnack) {
                            kelpSnack.parentElement.click();
                        }
                        break;
                }
                
                // Enter key: click first option if there's only one, or the Continue button if available
                switch(event.key) {
                    case 'Enter':
                        event.preventDefault();
                        if (dialogueOptions.length === 1) {
                            dialogueOptions[0].click();
                        } else {
                            // Prefer Continue button if available
                            const continueBtn = [...dialogueOptions].find(btn => btn.innerHTML.includes('<u>C</u>ontinue'));
                            if (continueBtn) {
                                continueBtn.click();
                            } else {
                                // Otherwise click first option as default
                                dialogueOptions[0].click();
                            }
                        }
                        break;
                }
                return; // Prevent further processing
            }
            
            // Congratulations popup controls
            if (document.getElementById('congratulations-popup').classList.contains('show')) {
                switch(key) {
                    case 'c':
                    case 'enter':
                        event.preventDefault();
                        event.stopPropagation();
                        this.hideCongratulationsPopup();
                        return;
                }
                return; // Prevent further processing
            }
            
            // Village controls
            if (this.currentScreen === 'village') {
                switch(key) {
                    case 'e':
                        event.preventDefault();
                        this.talkToNPC('elder');
                        break;
                    case 'f':
                        event.preventDefault();
                        this.talkToNPC('merchant');
                        break;
                    case 'g':
                        event.preventDefault();
                        this.talkToNPC('guard');
                        break;
                    case 'x':
                        event.preventDefault();
                        this.exitVillage();
                        break;
                    case 'b':
                        event.preventDefault();
                        this.talkToNPC('bubble');
                        break;
                    case 'i':
                        event.preventDefault();
                        this.talkToNPC('innkeeper');
                        break;
                }
                switch(event.key) {
                    case 'ArrowDown':
                        event.preventDefault();
                        this.exitVillage();
                        break;
                }
            }
            
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
                        this.useSkill('bubble'); // Bubble Blast
                        break;
                    case 'g':
                        event.preventDefault();
                        this.useSkill('gravel'); // Gravel Grenade
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
            
            // Cheat code for Level Up
            if (key === '%') {
                event.preventDefault();
                // Set EXP to exactly what's needed to level up, then level up naturally
                this.player.exp = this.player.expToNext;
                this.levelUp();
                this.updatePlayerStats(); // Immediately update display
                if (this.currentScreen === 'world-map' || this.currentScreen === 'village') {
                    this.addToEncounterLog("⚡ Cheat activated! Level up!");
                }
            }
        });
    }
    
    setupCongratulationsPopup() {
        document.getElementById('close-popup').addEventListener('click', () => {
            this.hideCongratulationsPopup();
        });
    }
    
    showCongratulationsPopup() {
        const popup = document.getElementById('congratulations-popup');
        popup.classList.add('show');
        
        // Play victory fanfare
        this.playSound('fanfare');
    }
    
    hideCongratulationsPopup() {
        const popup = document.getElementById('congratulations-popup');
        popup.classList.remove('show');
    }
    
    showScreen(screenId) {
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
            this.enterPressed = false; // Reset Enter key state on screen change
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
        document.querySelectorAll('.rice-paddy-tuft, .betta-village, .map-player, .danger-zone-border, .safe-water-zone').forEach(element => element.remove());
        
        // Clean up any dynamic styles
        const existingStyle = document.getElementById('dynamic-world-style');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        if (screenId === 'world-map') {
            // Create layered background with dark edges and normal center
            this.createLayeredWorldBackground();
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
        player.className = this.hasDunkleosteusSub ? 'map-player submarine' : 'map-player';
        player.style.position = 'absolute';
        player.style.left = `${this.playerMapPosition.x}%`;
        player.style.top = `${this.playerMapPosition.y}%`;
        // Apply facing direction transform
        const flipTransform = this.playerFacing === 'left' ? 'scaleX(-1)' : '';
        player.style.transform = `translate(-50%, -50%) ${flipTransform}`;
        player.style.pointerEvents = 'none';
        player.style.zIndex = '3';
        player.style.imageRendering = 'pixelated';
        if (this.hasDunkleosteusSub) {
            player.style.filter = 'none';
        } else {
            player.style.filter = this.getColorFilter(this.player.color);
        }
        worldMapScreen.appendChild(player);
        
        // Background is now handled in setScreenBackground
    }
    
    createLayeredWorldBackground() {
        const gameContainer = document.getElementById('game-container');
        const worldMapScreen = document.getElementById('world-map');
        
        // Base layer - dark water for entire background (outermost danger zone)
        gameContainer.style.backgroundImage = 'url(graphics/map/water-tile-dark.png)';
        gameContainer.style.backgroundRepeat = 'repeat';
        gameContainer.style.backgroundSize = '64px 64px';
        
        // Create three-layer system: light center, medium frame, dark edges (expanded inward)
        const style = document.createElement('style');
        style.textContent = `
            #world-map::before {
                content: '';
                position: absolute;
                top: 15%;
                left: 15%;
                width: 70%;
                height: 70%;
                background-image: url(graphics/map/water-tile-darkish.png);
                background-repeat: repeat;
                background-size: 64px 64px;
                z-index: -2;
                pointer-events: none;
            }
            #world-map::after {
                content: '';
                position: absolute;
                top: 30%;
                left: 30%;
                width: 40%;
                height: 40%;
                background-image: url(graphics/map/water-tile2.png);
                background-repeat: repeat;
                background-size: 64px 64px;
                z-index: -1;
                pointer-events: none;
            }
        `;
        
        // Remove any existing dynamic styles
        const existingStyle = document.getElementById('dynamic-world-style');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.id = 'dynamic-world-style';
        document.head.appendChild(style);
    }
    
    startCharacterCreation() {
        this.showScreen('character-creation');
        // Set defaults so user can quickly hit Enter again
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
        
        if (level >= 7) {
            return 'graphics/main_fish/player_betta_full_metal.png';
        } else if (level >= 5) {
            return 'graphics/main_fish/player_betta_with_almost_armor.png';
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
        const nameInput = document.getElementById('betta-name');
        
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
        this.updatePlayerStats();
        
        // Add welcome message to encounter log
        this.addToEncounterLog(`Welcome to Paddy Village, ${this.player.name}! Your adventure begins here.`);
        
        this.showScreen('village');
    }
    
    updatePlayerStats() {
        document.getElementById('player-name-display').textContent = this.player.name || 'Player';
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
            continueOption.innerHTML = '<u>C</u>ontinue...';
            continueOption.onclick = () => this.nextDialogue();
            optionsDiv.appendChild(continueOption);
        } else {
            if (npc.isInn) {
                const restOption = document.createElement('div');
                restOption.className = 'dialogue-option';
                restOption.innerHTML = '<u>R</u>est (Restore HP/MP)';
                restOption.onclick = () => this.restAtInn();
                optionsDiv.appendChild(restOption);
            }
            
            if (npc.isShop) {
                const shopOption = document.createElement('div');
                shopOption.className = 'dialogue-option';
                shopOption.innerHTML = '<u>B</u>rowse Items';
                shopOption.onclick = () => this.showShop();
                optionsDiv.appendChild(shopOption);
            }
            
            const endOption = document.createElement('div');
            endOption.className = 'dialogue-option';
            endOption.innerHTML = '<u>G</u>oodbye';
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
            endOption.innerHTML = '<u>I</u>\'ll come back later';
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
        endOption.innerHTML = '<u>T</u>hank you!';
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
            endOption.innerHTML = '<u>I</u> understand';
            endOption.onclick = () => this.endDialogue();
            optionsDiv.appendChild(endOption);
            return;
        }
        
        document.getElementById('dialogue-text').innerHTML = `
            <div class="shop-header">🛒 Fish Mart Inventory</div>
            <div class="shop-items">
                <div class="shop-item ${this.player.bettaBites >= 100 ? 'shop-item-buyable' : 'shop-item-disabled'}" 
                     ${this.player.bettaBites >= 100 ? 'onclick="game.buyDunkleosteusSub()"' : ''}>
                    <div class="item-name">🚀 <u>D</u>unkleosteus Submarine</div>
                    <div class="item-description">A mysterious ancient vessel that protects from harm.</div>
                    <div class="item-price">100 Betta Bites</div>
                </div>
                <div class="shop-item ${this.player.bettaBites >= 3 ? 'shop-item-buyable' : 'shop-item-disabled'}"
                     ${this.player.bettaBites >= 3 ? 'onclick="game.buyKelpSnack()"' : ''}>
                    <div class="item-name">🌿 <u>K</u>elp Snack</div>
                    <div class="item-description">Restores full HP. Crunchy and nutritious!</div>
                    <div class="item-price">3 Betta Bites</div>
                </div>
                <div class="shop-item ${this.player.bettaBites >= 2 ? 'shop-item-buyable' : 'shop-item-disabled'}"
                     ${this.player.bettaBites >= 2 ? 'onclick="game.buyBubbleWater()"' : ''}>
                    <div class="item-name">💧 <u>B</u>ubble Water</div>
                    <div class="item-description">Restores full MP. Fizzy and refreshing!</div>
                    <div class="item-price">2 Betta Bites</div>
                </div>
            </div>
            <div class="shop-footer">Your Betta Bites: ${this.player.bettaBites}</div>
        `;
        
        const optionsDiv = document.getElementById('dialogue-options');
        optionsDiv.innerHTML = '';
        
        const backOption = document.createElement('div');
        backOption.className = 'dialogue-option';
        backOption.innerHTML = '<u>M</u>aybe later';
        backOption.onclick = () => this.endDialogue();
        optionsDiv.appendChild(backOption);
    }
    
    buyDunkleosteusSub() {
        this.player.bettaBites -= 100;
        this.hasDunkleosteusSub = true;
        this.updatePlayerStats();
        
        this.playSound('treasure');
        
        document.getElementById('dialogue-text').textContent = "Excellent choice! The mysterious ancient vessel is now yours! You feel its power transforming your very essence. You are no longer just a betta - you are a legendary sea creature!";
        
        const optionsDiv = document.getElementById('dialogue-options');
        optionsDiv.innerHTML = '';
        
        const endOption = document.createElement('div');
        endOption.className = 'dialogue-option';
        endOption.innerHTML = '<u>A</u>mazing!';
        endOption.onclick = () => this.endDialogue();
        optionsDiv.appendChild(endOption);
    }
    
    buyKelpSnack() {
        this.player.bettaBites -= 3;
        const healAmount = this.player.maxHp - this.player.hp;
        this.player.hp = this.player.maxHp;
        this.updatePlayerStats();
        
        this.playSound('treasure');
        
        document.getElementById('dialogue-text').textContent = `You munch on the crunchy kelp snack! It restores ${healAmount} HP to full! Delicious!`;
        
        const optionsDiv = document.getElementById('dialogue-options');
        optionsDiv.innerHTML = '';
        
        const endOption = document.createElement('div');
        endOption.className = 'dialogue-option';
        endOption.innerHTML = 'T<u>h</u>anks!';
        endOption.onclick = () => this.endDialogue();
        optionsDiv.appendChild(endOption);
    }
    
    buyBubbleWater() {
        this.player.bettaBites -= 2;
        const restoreAmount = this.player.maxMp - this.player.mp;
        this.player.mp = this.player.maxMp;
        this.updatePlayerStats();
        
        this.playSound('treasure');
        
        document.getElementById('dialogue-text').textContent = `You sip the fizzy bubble water! It restores ${restoreAmount} MP to full! Refreshing!`;
        
        const optionsDiv = document.getElementById('dialogue-options');
        optionsDiv.innerHTML = '';
        
        const endOption = document.createElement('div');
        endOption.className = 'dialogue-option';
        endOption.innerHTML = '<u>A</u>hh, refreshing!';
        endOption.onclick = () => this.endDialogue();
        optionsDiv.appendChild(endOption);
    }
    
    endDialogue() {
        this.showScreen('village');
    }
    
    exitVillage() {
        // Reset player position directly south of village when exiting
        this.playerMapPosition = { x: 50, y: 58 };
        this.justExitedVillage = true; // Flag to skip encounter on first move
        this.showScreen('world-map');
        this.addToEncounterLog("You venture into the rice paddies, leaving the safety of Paddy Village behind.");
    }
    
    returnToVillage() {
        this.showScreen('village');
    }
    
    checkVillageOverlap() {
        // Simpler approach: check if player position is close enough to village center (50%, 50%)
        const playerX = this.playerMapPosition.x;
        const playerY = this.playerMapPosition.y;
        const villageX = 50;  // Village center X in percentage
        const villageY = 50;  // Village center Y in percentage
        
        // Calculate distance from village center in percentage units
        const distanceX = Math.abs(playerX - villageX);
        const distanceY = Math.abs(playerY - villageY);
        
        // Entry zone: within 2.5% of village center in both directions
        const entryZone = 2.5;
        
        return (distanceX <= entryZone && distanceY <= entryZone);
    }
    
    checkEdgeStatus() {
        const x = this.playerMapPosition.x;
        const y = this.playerMapPosition.y;
        
        // Check village overlap using proper rectangle detection
        if (this.checkVillageOverlap()) {
            this.returnToVillage();
            return { atEdge: false, inEdgeZone: false };
        }
        
        // Check if at actual edge (within 2% of boundary)
        const atEdge = (x <= 7 || x >= 93 || y <= 7 || y >= 93);
        
        // Check if in edge zone (within 10% of boundary - closer to actual edge)
        const inEdgeZone = (x <= 15 || x >= 85 || y <= 15 || y >= 85);
        
        this.isInEdgeZone = inEdgeZone;
        
        return { atEdge, inEdgeZone };
    }
    
    showEdgeMessage() {
        this.showCongratulationsPopup();
        this.hasReachedEdge = true;
    }
    
    swimDirection(direction) {
        const directionTexts = {
            north: "You swim north through the rice stalks, water becoming murkier.",
            south: "You swim south where the water runs clearer near the village.",
            east: "You swim east toward the morning sun, rice casting long shadows.",
            west: "You swim west where the rice grows thickest and oldest."
        };
        
        // Move player position and update facing direction
        const moveDistance = 3; // 3% of screen for smaller steps
        switch(direction) {
            case 'north': this.playerMapPosition.y = Math.max(5, this.playerMapPosition.y - moveDistance); break;
            case 'south': this.playerMapPosition.y = Math.min(95, this.playerMapPosition.y + moveDistance); break;
            case 'east': 
                this.playerMapPosition.x = Math.min(95, this.playerMapPosition.x + moveDistance);
                this.playerFacing = 'right';
                break;
            case 'west': 
                this.playerMapPosition.x = Math.max(5, this.playerMapPosition.x - moveDistance);
                this.playerFacing = 'left';
                break;
        }
        
        // Update player position on map
        this.showPlayerOnMap();
        
        // Check edge status (this may trigger village entry)
        const { atEdge, inEdgeZone } = this.checkEdgeStatus();
        
        // If we entered the village, don't continue with encounter logic
        if (this.currentScreen === 'village') {
            return;
        }
        
        this.addToEncounterLog(directionTexts[direction]);
        
        // Skip encounter on first move after exiting village
        if (this.justExitedVillage) {
            this.justExitedVillage = false; // Reset flag after first move
            return;
        }
        
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
        
        // Normal encounter logic for safe areas: 30% combat, 30% treasure, 30% peaceful, 10% mystery
        const encounterChance = Math.random();
        
        if (encounterChance < 0.3) {
            this.startRandomEncounter();
        } else if (encounterChance < 0.6) {
            this.findBettaBites();
        } else if (encounterChance < 0.9) {
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
        const enemyLevel = this.calculateEnemyLevel();
        let baseEnemy;
        
        // Level 10 spawns the Prehistoric Gar boss only once
        if (enemyLevel === 10 && !this.hasDefeatedGar) {
            baseEnemy = this.enemies[4]; // Prehistoric Gar (index 4)
        } else {
            // All other cases spawn from the first 4 enemies (including Level 10 after Gar is defeated)
            baseEnemy = this.enemies[Math.floor(Math.random() * 4)];
        }
        
        this.currentEnemy = this.scaleEnemyWithLevel(baseEnemy, enemyLevel);
        
        // Apply color variation to all enemies
        this.currentEnemy.randomHue = Math.floor(Math.random() * 360);
        
        this.combatActive = true;
        this.garTurnCounter = 0; // Reset Gar turn counter for each battle
        
        const levelText = enemyLevel > 1 ? ` (Level ${enemyLevel})` : '';
        const encounterMessage = enemyLevel === 10 ? 
            `The legendary ${baseEnemy.name} emerges from the depths!` :
            `A wild ${baseEnemy.name}${levelText} appears!`;
        this.addToEncounterLog(encounterMessage);
        
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
        playerFish.className = this.hasDunkleosteusSub ? 'submarine' : '';
        if (this.hasDunkleosteusSub) {
            playerFish.style.filter = 'none';
        } else {
            playerFish.style.filter = this.getColorFilter(this.player.color);
        }
        
        // Set enemy fish appearance
        const enemyFish = document.getElementById('enemy-fish-combat');
        enemyFish.src = this.currentEnemy.sprite;
        
        // Apply color variation to all enemies (including Level 10 bosses)
        enemyFish.style.filter = `hue-rotate(${this.currentEnemy.randomHue}deg) saturate(1.3)`;
        
        enemyFish.style.transform = 'scaleX(-1)'; // Reset to normal facing left orientation
        
        // Show swim away warning for high level enemies
        const swimAwayBtn = document.getElementById('swim-away-btn');
        const swimAwayMessage = document.getElementById('swim-away-message');
        
        swimAwayBtn.disabled = false; // Always enabled
        if (this.currentEnemy.level >= 5) {
            swimAwayMessage.textContent = "⚡ Escape is very difficult! ⚡";
        } else {
            swimAwayMessage.textContent = "";
        }
        
        // Show/hide Gravel Grenade button based on level
        const gravelBtn = document.getElementById('gravel-grenade-btn');
        if (this.player.level >= 5) {
            gravelBtn.style.display = 'inline-block';
        } else {
            gravelBtn.style.display = 'none';
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
        
        // Base damage scales with level: +1 on even levels (2, 4, 6, 8, 10)
        const baseDamage = Math.floor(Math.random() * 8) + 3;
        const levelBonus = Math.floor(this.player.level / 2); // +1 damage on even levels
        let playerDamage = baseDamage + levelBonus;
        
        // Double damage when using submarine
        if (this.hasDunkleosteusSub) {
            playerDamage *= 2;
        }
        
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
        // Update player stats panel
        this.updatePlayerStats();
        
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
    
    useSkill(spellType = 'bubble') {
        if (!this.combatActive) return;
        
        let mpCost, skillDamage, actions, actionType;
        
        if (spellType === 'bubble') {
            mpCost = 3;
            if (this.player.mp < mpCost) {
                this.addToCombatLog("Not enough MP for Bubble Blast!");
                return;
            }
            // Base: 5-16, scales to 10-26 at level 10 (+1 on odd levels: 1, 3, 5, 7, 9)
            const magicBonus = Math.floor((this.player.level + 1) / 2); // +1 on odd levels
            const randomComponent = 12 + magicBonus;
            const additiveComponent = 5 + magicBonus;
            skillDamage = Math.floor(Math.random() * randomComponent) + additiveComponent;
            actions = [
                "unleashes a torrent of magical bubbles",
                "creates a swirling vortex of powerful bubbles", 
                "summons a burst of explosive bubbles",
                "channels energy into a devastating bubble storm"
            ];
            actionType = 'magic';
        } else if (spellType === 'gravel') {
            mpCost = 5;
            if (this.player.mp < mpCost) {
                this.addToCombatLog("Not enough MP for Gravel Grenade!");
                return;
            }
            // Base: 8-25, scales to 13-35 at level 10 (+1 on odd levels: 1, 3, 5, 7, 9)
            const magicBonus = Math.floor((this.player.level + 1) / 2); // +1 on odd levels  
            const randomComponent = 18 + magicBonus;
            const additiveComponent = 8 + magicBonus;
            skillDamage = Math.floor(Math.random() * randomComponent) + additiveComponent;
            actions = [
                "hurls a barrage of sharp gravel",
                "creates a devastating stone storm", 
                "launches a powerful gravel grenade",
                "summons a whirlwind of crushing rocks"
            ];
            actionType = 'gravel';
        }
        
        if (spellType === 'bubble') {
            this.playSound('bubble');
        } else if (spellType === 'gravel') {
            this.playSound('gravel');
        } else {
            this.playSound('magic');
        }
        
        this.player.mp -= mpCost;
        this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - skillDamage);
        
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        this.addToCombatLog(`${this.player.name} ${randomAction} for ${skillDamage} damage!`);
        
        // Update player stats immediately after MP deduction
        this.updatePlayerStats();
        
        // Trigger visual effects
        if (spellType === 'bubble') {
            this.createBubbleEffect();
        } else if (spellType === 'gravel') {
            this.createGravelEffect();
        }
        
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
    
    runAway() {
        if (!this.combatActive) return;
        
        // Check if escape is possible for high level enemies (1 in 20 chance)
        if (this.currentEnemy.level >= 5) {
            const escapeChance = Math.floor(Math.random() * 20); // 0-19
            if (escapeChance !== 0) { // 19/20 chance of failure
                this.addToCombatLog("You try to escape, but the enemy is too fast!");
                this.enemyTurn();
                return;
            }
            // 1/20 chance of success - continue to escape code below
            this.addToCombatLog("You barely manage to slip away!");
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
    
    createBubbleEffect() {
        // Create 8-12 bubbles rising from bottom
        const numBubbles = Math.floor(Math.random() * 5) + 8;
        
        for (let i = 0; i < numBubbles; i++) {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.className = 'bubble-effect';
                bubble.style.left = Math.random() * 100 + 'vw';
                bubble.style.bottom = '0px';
                document.body.appendChild(bubble);
                
                // Remove bubble after animation
                setTimeout(() => {
                    if (bubble.parentNode) {
                        bubble.parentNode.removeChild(bubble);
                    }
                }, 2000);
            }, i * 100); // Stagger bubble creation
        }
    }
    
    createGravelEffect() {
        // Create gravel container
        const container = document.createElement('div');
        container.className = 'gravel-container';
        document.body.appendChild(container);
        
        // Create many gravel particles over time
        let particlesCreated = 0;
        const maxParticles = 150;
        
        const createGravelParticle = () => {
            if (particlesCreated >= maxParticles) return;
            
            const particle = document.createElement('div');
            particle.className = 'gravel-particle';
            
            const startX = Math.random() * window.innerWidth;
            const drift = (Math.random() - 0.5) * 100; // Random horizontal drift
            const fallDuration = Math.random() * 3 + 2; // 2-5 seconds
            
            particle.style.left = startX + 'px';
            particle.style.top = '-10px';
            particle.style.setProperty('--drift', drift + 'px');
            particle.style.animation = `gravel-fall ${fallDuration}s linear forwards`;
            
            container.appendChild(particle);
            particlesCreated++;
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, fallDuration * 1000);
        };
        
        // Create particles continuously for 10 seconds
        const particleInterval = setInterval(createGravelParticle, 50);
        
        // Store interval and container for cleanup
        this.currentGravelInterval = particleInterval;
        this.currentGravelContainer = container;
        
        setTimeout(() => {
            clearInterval(particleInterval);
            this.currentGravelInterval = null;
            // Remove container after all particles are done
            setTimeout(() => {
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                }
                this.currentGravelContainer = null;
            }, 5000);
        }, 10000);
    }
    
    cleanupGravelEffect() {
        if (this.currentGravelInterval) {
            clearInterval(this.currentGravelInterval);
            this.currentGravelInterval = null;
        }
        if (this.currentGravelContainer && this.currentGravelContainer.parentNode) {
            this.currentGravelContainer.parentNode.removeChild(this.currentGravelContainer);
            this.currentGravelContainer = null;
        }
    }
    
    gargantuanGarAttack() {
        this.addToCombatLog("⚡ The Prehistoric Gar channels ancient power! ⚡");
        this.addToCombatLog("🐉 GARGANTUAN GAR! 🐉");
        
        // Play terrifying roar
        this.playSound('roar');
        
        // Create giant Gar visual effect
        this.createGiantGarEffect();
        
        // Deal massive damage after a delay
        setTimeout(() => {
            if (this.hasDunkleosteusSub) {
                this.addToCombatLog("The ancient submarine armor withstands even the Gargantuan Gar!");
                this.playSound('attack');
            } else {
                const massiveDamage = 100;
                this.player.hp = Math.max(0, this.player.hp - massiveDamage);
                this.addToCombatLog(`The GARGANTUAN GAR deals ${massiveDamage} devastating damage!`);
                
                // Update HP display immediately
                this.updateCombatHP();
                this.updatePlayerStats();
                
                this.playSound('wound');
                const playerFish = document.getElementById('player-fish-combat');
                playerFish.classList.add('shake');
                setTimeout(() => playerFish.classList.remove('shake'), 500);
            }
            
            // Check if player died
            if (this.player.hp <= 0) {
                setTimeout(() => this.loseCombat(), 1000);
            }
        }, 2000); // Wait for visual effect
    }
    
    createGiantGarEffect() {
        const giantGar = document.createElement('img');
        giantGar.src = 'graphics/enemies/prehistoric_gar.png';
        giantGar.style.position = 'fixed';
        giantGar.style.top = '30vh';
        giantGar.style.right = '-600px';
        giantGar.style.width = '600px';
        giantGar.style.height = '300px';
        giantGar.style.zIndex = '9999';
        giantGar.style.imageRendering = 'pixelated';
        giantGar.style.filter = `hue-rotate(${this.currentEnemy.randomHue}deg)`;
        giantGar.style.animation = 'giant-gar-swim 3s ease-in-out forwards';
        
        document.body.appendChild(giantGar);
        
        // Remove after animation
        setTimeout(() => {
            if (giantGar.parentNode) {
                giantGar.parentNode.removeChild(giantGar);
            }
        }, 3000);
    }
    
    enemyTurn() {
        // Don't process enemy turn if enemy is already dead
        if (!this.combatActive || this.currentEnemy.hp <= 0) {
            return;
        }
        
        // Increment Gar turn counter
        if (this.currentEnemy.name === "Prehistoric Gar") {
            this.garTurnCounter++;
        }
        
        // Special Gar attack on third turn
        if (this.currentEnemy.name === "Prehistoric Gar" && this.garTurnCounter === 3) {
            this.gargantuanGarAttack();
            return;
        }
        
        // Get random attack description
        const attackDesc = this.currentEnemy.attacks[Math.floor(Math.random() * this.currentEnemy.attacks.length)];
        
        if (this.hasDunkleosteusSub) {
            // Dunkleosteus submarine is invulnerable
            this.addToCombatLog(`${this.currentEnemy.name} ${attackDesc} but the ancient armor deflects all damage!`);
            this.playSound('attack'); // Different sound for deflection
        } else {
            // Normal damage calculation with armor reduction
            const baseDamage = Math.floor(Math.random() * this.currentEnemy.attack) + 1;
            
            // Armor reduces damage based on level (helmet at 3+, armor at 5+, full metal at 7+)
            let armorReduction = 0;
            if (this.player.level >= 7) armorReduction = 3; // Full metal armor: -3 damage
            else if (this.player.level >= 5) armorReduction = 2; // Advanced armor: -2 damage  
            else if (this.player.level >= 3) armorReduction = 1; // Helmet: -1 damage
            
            const enemyDamage = Math.max(1, baseDamage - armorReduction); // Minimum 1 damage
            this.player.hp = Math.max(0, this.player.hp - enemyDamage);
            
            this.addToCombatLog(`${this.currentEnemy.name} ${attackDesc} for ${enemyDamage} damage!`);
            
            // Update HP display immediately after damage
            this.updateCombatHP();
            this.updatePlayerStats();
            
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
        
        // Mark Gar as defeated if this was the Gar
        if (this.currentEnemy.name === "Prehistoric Gar") {
            this.hasDefeatedGar = true;
        }
        
        // Show congratulations message for first Level 10 victory
        if (this.currentEnemy.level === 10 && !this.hasReachedEdge) {
            this.hasReachedEdge = true;
            setTimeout(() => {
                this.showEdgeMessage();
                setTimeout(() => {
                    this.cleanupGravelEffect();
                    this.showScreen('world-map');
                    this.addToEncounterLog(`Defeated ${this.currentEnemy.name}!`);
                    this.updatePlayerStats();
                }, 2000); // Extra delay to read congratulations
            }, 2000);
        } else {
            setTimeout(() => {
                this.cleanupGravelEffect();
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
            this.addToCombatLog("Your armor has been upgraded to advanced protection!");
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
                
                this.cleanupGravelEffect();
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
        
        // Prepend to put newest at top
        log.insertBefore(entry, log.firstChild);
        
        // Scroll to top to show newest message
        log.scrollTop = 0;
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
                
                // Prepend to put newest at top
                log.insertBefore(entry, log.firstChild);
                
                // Scroll to top to show newest message
                log.scrollTop = 0;
            }
        });
    }
}

let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new BettaRPG();
});