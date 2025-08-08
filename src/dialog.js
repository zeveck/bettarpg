/**
 * Dialog System Module
 * 
 * Manages modal dialog boxes and user choice prompts. Provides a
 * fallback system for browsers that don't support modern UI features,
 * handling user input validation and audio feedback.
 */
export class DialogManager {
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
        this.show(StringFormatter.format(GameStrings.INN.REST_SUCCESS, { cost: GameConfig.ECONOMY.SERVICES.INN_REST.cost }), [
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