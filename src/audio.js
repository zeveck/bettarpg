/**
 * Audio Management Module
 * 
 * Handles all game audio including sound effects and music generation.
 * Uses Web Audio API to create procedural sounds for combat, spells,
 * environmental effects, and victory fanfares.
 */
export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            // Web Audio API not supported - graceful fallback
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