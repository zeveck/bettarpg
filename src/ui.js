import { GameConfig, GameStrings, StringFormatter } from './config.js'

/**
 * User Interface Module
 *
 * Manages all game screens, user interactions, visual displays, and
 * DOM manipulation. Coordinates between user input and game logic,
 * handles character creation, dialogue systems, and world map rendering.
 */
export class UIManager {
  constructor (player, audioManager, combatManager, worldManager) {
    this.player = player
    this.audio = audioManager
    this.combat = combatManager
    this.world = worldManager
    this.core = null // Set later via setCoreManager
    this.isShowingConfirmation = false

    // UI state
    this.currentScreen = 'start'
    this.shopOpen = false

    // Background caching and pre-rendering
    this.cachedWorldBackground = null
    this.cachedWaterTiles = null
    this.backgroundPreRenderComplete = false
    this.dialogueActive = false
    this.blockVillageExit = false // Prevent immediate exit after village entry
    this.defeatInProgress = false // Prevent duplicate defeat handling

    // World map visual state
    this.ricePaddyPositions = this.generateRicePaddyPositions()
    this.playerMapPosition = { x: 50, y: 50 } // Center of map initially
    this.playerFacing = 'right' // Track which direction player is facing

    // Betta names for character creation - use configuration
    this.bettaNames = GameStrings.CHARACTER_CREATION.RANDOM_NAMES

    // Initialize UI after DOM is ready
    this.initializeUI()

    // Setup event delegation for dynamic content
    this.setupEventDelegation()

    // Apply village background immediately after UI is ready
    setTimeout(() => this.initializeVillageBackground(), 0)
  }

  // Set core reference (called after construction to avoid circular dependency)
  setCoreManager (coreManager) {
    this.core = coreManager
    this.setupVersionInfo() // Update version info with full metadata
  }

  // Setup dynamic version info with link
  setupVersionInfo () {
    const versionElement = document.getElementById('version-info')
    if (versionElement) {
      if (this.core) {
        const versionInfo = this.core.getVersion()
        versionElement.innerHTML = `<a href="${versionInfo.website}" target="_blank">v${versionInfo.version}</a>`
      } else {
        // Fallback when core isn't set yet - will be updated later
        versionElement.innerHTML = `<a href="${GameConfig.GAME.WEBSITE}" target="_blank">v${GameConfig.GAME.VERSION}</a>`
      }
    }
  }

  generateRandomName () {
    const randomIndex = Math.floor(Math.random() * this.bettaNames.length)
    return this.bettaNames[randomIndex]
  }

  // Helper method to check if a button is visible
  isButtonVisible (buttonId) {
    const button = document.getElementById(buttonId)
    return button && button.style.display !== 'none' && !button.disabled
  }

  // Combat action methods (called by keyboard shortcuts and buttons)
  attack () {
    if (this.combat.isCombatActive()) {
      const result = this.combat.attack()
      this.updateCombatDisplay()
      if (result && result.enemyDefeated) {
        this.handleCombatVictory(result)
      }
    }
  }

  useSkill (spellType) {
    if (this.combat.isCombatActive()) {
      const result = this.combat.useSkill(spellType)
      this.updateCombatDisplay()
      if (result && result.enemyDefeated) {
        this.handleCombatVictory(result)
      }
    }
  }

  swimAway () {
    if (this.combat.isCombatActive()) {
      const escaped = this.combat.runAway()
      if (escaped) {
        this.showWorldMap()
      }
      this.updateCombatDisplay()
    }
  }

  // Method called by event delegation
  buyItem (itemId) {
    const result = this.world.buyItem(itemId)
    const dialogueTextElement = document.getElementById('dialogue-text')
    const dialogueOptionsElement = document.getElementById('dialogue-options')

    if (!dialogueTextElement || !dialogueOptionsElement) return

    this.isShowingConfirmation = true

    if (itemId === 'submarine') {
      // Submarine purchase confirmation
      dialogueTextElement.textContent = GameStrings.SHOP.CONFIRMATIONS.SUBMARINE
      const [button] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.AMAZING])
      dialogueOptionsElement.innerHTML =
                `<div class="dialogue-option" data-action="end-confirmation">${button.html}</div>`
    } else {
      // Regular item purchase confirmation
      dialogueTextElement.textContent = result.message
      const [button] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.THANKS])
      dialogueOptionsElement.innerHTML =
                `<div class="dialogue-option" data-action="end-confirmation">${button.html}</div>`
    }
  }

  initializeUI () {
    this.setupEventListeners()
    this.initializeStrings()
    this.showStartScreen()
    this.updateAllDisplays()
    this.setupVersionInfo()
  }

  initializeStrings () {
    // Screen titles
    const villageTitle = document.getElementById('village-title')
    if (villageTitle) villageTitle.textContent = GameStrings.LOCATIONS.VILLAGE.NAME

    const worldMapTitle = document.getElementById('world-map-title')
    if (worldMapTitle) worldMapTitle.textContent = GameStrings.LOCATIONS.WORLD_MAP.NAME

    const combatTitle = document.getElementById('combat-title')
    if (combatTitle) combatTitle.textContent = GameStrings.UI.SCREENS.COMBAT_TITLE

    // Location descriptions
    const villageDescription = document.getElementById('village-description')
    if (villageDescription) villageDescription.textContent = GameStrings.LOCATIONS.VILLAGE.DESCRIPTION

    const worldMapDescription = document.getElementById('world-map-description')
    if (worldMapDescription) worldMapDescription.textContent = GameStrings.LOCATIONS.WORLD_MAP.DESCRIPTION

    // Village locations - use automatic button processing for consistent shortcuts
    this.villageButtons = StringFormatter.processButtonTexts([
      GameStrings.LOCATIONS.VILLAGE.BUILDINGS.ELDER_DWELLING,
      GameStrings.LOCATIONS.VILLAGE.BUILDINGS.FISH_MART,
      GameStrings.LOCATIONS.VILLAGE.BUILDINGS.VILLAGE_GUARD,
      GameStrings.LOCATIONS.VILLAGE.BUILDINGS.BUBBLES_HOME,
      GameStrings.LOCATIONS.VILLAGE.BUILDINGS.SWISHY_SOLACE_INN,
      GameStrings.LOCATIONS.VILLAGE.BUILDINGS.EXIT_TO_PADDIES
    ])

    const elderDwelling = document.getElementById('elder-dwelling')
    if (elderDwelling) elderDwelling.innerHTML = this.villageButtons[0].html

    const fishMart = document.getElementById('fish-mart')
    if (fishMart) fishMart.innerHTML = this.villageButtons[1].html

    const villageGuard = document.getElementById('village-guard')
    if (villageGuard) villageGuard.innerHTML = this.villageButtons[2].html

    const bubblesHome = document.getElementById('bubbles-home')
    if (bubblesHome) bubblesHome.innerHTML = this.villageButtons[3].html

    const swishySolaceInn = document.getElementById('swishy-solace-inn')
    if (swishySolaceInn) swishySolaceInn.innerHTML = this.villageButtons[4].html

    const exitToPaddies = document.getElementById('exit-to-paddies')
    if (exitToPaddies) exitToPaddies.innerHTML = this.villageButtons[5].html

    // Combat buttons
    const attackBtn = document.getElementById('attack-btn')
    if (attackBtn) {
      const [attackButtonText] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.ATTACK])
      attackBtn.innerHTML = attackButtonText.html
      attackBtn.dataset.key = attackButtonText.key
    }

    const swimAwayBtn = document.getElementById('swim-away-btn')
    if (swimAwayBtn) {
      const [swimAwayButtonText] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.SWIM_AWAY])
      swimAwayBtn.innerHTML = swimAwayButtonText.html
      swimAwayBtn.dataset.key = swimAwayButtonText.key
    }

    // Navigation buttons - use automated system for shortcuts
    const navigationButtons = StringFormatter.processButtonTexts([
      GameStrings.LOCATIONS.WORLD_MAP.MOVEMENT.SWIM_NORTH,
      GameStrings.LOCATIONS.WORLD_MAP.MOVEMENT.SWIM_SOUTH,
      GameStrings.LOCATIONS.WORLD_MAP.MOVEMENT.SWIM_EAST,
      GameStrings.LOCATIONS.WORLD_MAP.MOVEMENT.SWIM_WEST,
      GameStrings.LOCATIONS.WORLD_MAP.MOVEMENT.RETURN_TO_VILLAGE
    ])

    const swimNorthBtn = document.getElementById('swim-north-btn')
    if (swimNorthBtn) {
      swimNorthBtn.innerHTML = navigationButtons[0].html
      swimNorthBtn.dataset.key = navigationButtons[0].key
    }

    const swimSouthBtn = document.getElementById('swim-south-btn')
    if (swimSouthBtn) {
      swimSouthBtn.innerHTML = navigationButtons[1].html
      swimSouthBtn.dataset.key = navigationButtons[1].key
    }

    const swimEastBtn = document.getElementById('swim-east-btn')
    if (swimEastBtn) {
      swimEastBtn.innerHTML = navigationButtons[2].html
      swimEastBtn.dataset.key = navigationButtons[2].key
    }

    const swimWestBtn = document.getElementById('swim-west-btn')
    if (swimWestBtn) {
      swimWestBtn.innerHTML = navigationButtons[3].html
      swimWestBtn.dataset.key = navigationButtons[3].key
    }

    const returnVillageBtn = document.getElementById('return-village-btn')
    if (returnVillageBtn) {
      returnVillageBtn.innerHTML = navigationButtons[4].html
      returnVillageBtn.dataset.key = navigationButtons[4].key
    }

    // Spell buttons - these will be updated dynamically with MP costs
    this.updateSpellButtons()

    // Character creation strings
    const nameLabel = document.querySelector('label[for="betta-name"]')
    if (nameLabel) nameLabel.textContent = GameStrings.UI.LABELS.NAME_YOUR_BETTA

    const nameInput = document.getElementById('betta-name')
    if (nameInput) nameInput.placeholder = GameStrings.UI.LABELS.ENTER_NAME

    const randomNameBtn = document.getElementById('random-name-btn')
    if (randomNameBtn) {
      const [newNameButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.NEW_NAME])
      randomNameBtn.innerHTML = newNameButton.html
      randomNameBtn.dataset.key = newNameButton.key
    }

    const colorLabels = document.querySelectorAll('label')
    colorLabels.forEach(label => {
      if (label.textContent.includes(GameStrings.SYSTEM.TEXT_CHECKS.CHOOSE_COLOR_TEXT)) {
        label.textContent = GameStrings.UI.LABELS.CHOOSE_COLOR
      }
    })

    const createCharacterBtn = document.getElementById('create-character')
    if (createCharacterBtn) {
      const [startGameButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.START_GAME])
      createCharacterBtn.innerHTML = startGameButton.html
      createCharacterBtn.dataset.key = startGameButton.key
      createCharacterBtn.disabled = true // Initially disabled until name and color are selected
    }

    // Character preview labels
    const namePreviewLabel = document.querySelector('#character-preview p:first-child')
    if (namePreviewLabel && namePreviewLabel.textContent.startsWith('Name:')) {
      namePreviewLabel.innerHTML = `${GameStrings.UI.LABELS.NAME_PREVIEW} <span id="preview-name">${GameStrings.UI.LABELS.UNKNOWN_NAME}</span>`
    }

    const colorPreviewLabel = document.querySelector('#character-preview p:last-child')
    if (colorPreviewLabel && colorPreviewLabel.textContent.startsWith('Color:')) {
      colorPreviewLabel.innerHTML = `${GameStrings.UI.LABELS.COLOR_PREVIEW} <span id="preview-color">${GameStrings.UI.LABELS.CHOOSE_A_COLOR}</span>`
    }

    // Color option labels - now using automated system
    const colorOptions = document.querySelectorAll('.color-option')
    const colorTexts = []
    const colorMap = {}

    colorOptions.forEach(option => {
      const color = option.dataset.color
      if (color === 'red') {
        colorTexts.push(GameStrings.UI.COLORS.RED)
        colorMap.red = colorTexts.length - 1
      } else if (color === 'blue') {
        colorTexts.push(GameStrings.UI.COLORS.BLUE)
        colorMap.blue = colorTexts.length - 1
      } else if (color === 'purple') {
        colorTexts.push(GameStrings.UI.COLORS.PURPLE)
        colorMap.purple = colorTexts.length - 1
      } else if (color === 'green') {
        colorTexts.push(GameStrings.UI.COLORS.GREEN)
        colorMap.green = colorTexts.length - 1
      } else if (color === 'orange') {
        colorTexts.push(GameStrings.UI.COLORS.ORANGE)
        colorMap.orange = colorTexts.length - 1
      }
    })

    const processedColors = StringFormatter.processButtonTexts(colorTexts)

    colorOptions.forEach(option => {
      const color = option.dataset.color
      const index = colorMap[color]
      if (index !== undefined) {
        option.innerHTML = processedColors[index].html
        option.dataset.key = processedColors[index].key
      }
    })

    // Congratulations popup
    const congratsTitle = document.querySelector('#congratulations-popup h1')
    if (congratsTitle) congratsTitle.textContent = GameStrings.SYSTEM.CONGRATULATIONS.TITLE

    const congratsMessage1 = document.querySelector('#congratulations-popup p:nth-of-type(1)')
    if (congratsMessage1) congratsMessage1.textContent = GameStrings.SYSTEM.CONGRATULATIONS.EDGE_REACHED

    const congratsMessage2 = document.querySelector('#congratulations-popup p.subtitle')
    if (congratsMessage2) congratsMessage2.textContent = GameStrings.SYSTEM.CONGRATULATIONS.MORE_ADVENTURES

    const congratsDevNote = document.querySelector('#congratulations-popup p.dev-note')
    if (congratsDevNote) congratsDevNote.textContent = GameStrings.SYSTEM.CONGRATULATIONS.IN_DEVELOPMENT

    // Setup version info with link (using core reference if available)
    this.setupVersionInfo()

    const [congratsButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.CONTINUE_SWIMMING])
    const congratsBtn = document.getElementById('close-popup')
    if (congratsBtn) {
      congratsBtn.innerHTML = congratsButton.html
      congratsBtn.dataset.key = congratsButton.key
    }

    // Title screen strings
    const titleH1 = document.querySelector('#title-screen h1')
    if (titleH1) titleH1.textContent = GameStrings.UI.SCREENS.TITLE

    const titleSubtitle = document.querySelector('#title-screen p')
    if (titleSubtitle) titleSubtitle.textContent = GameStrings.UI.SCREENS.SUBTITLE

    const startBtn = document.getElementById('start-game-btn')
    if (startBtn) {
      const [startButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.START_ADVENTURE])
      startBtn.innerHTML = startButton.html
      startBtn.dataset.key = startButton.key
    }

    // Character creation screen title
    const charCreationTitle = document.querySelector('#character-creation h2')
    if (charCreationTitle) charCreationTitle.textContent = GameStrings.UI.SCREENS.CREATE_YOUR_BETTA
  }

  updateSpellButtons () {
    const bubbleBtn = document.getElementById('bubble-blast-btn')
    if (bubbleBtn) {
      const spell = GameConfig.COMBAT.SPELLS.BUBBLE_BLAST
      const [bubbleButton] = StringFormatter.processButtonTexts([`Bubble Blast (${spell.mpCost} MP)`])
      bubbleBtn.innerHTML = bubbleButton.html
      bubbleBtn.dataset.key = bubbleButton.key
    }

    const balloonBtn = document.getElementById('happy-balloon-btn')
    if (balloonBtn) {
      const spell = GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME
      const [balloonButton] = StringFormatter.processButtonTexts([`Happy Balloon Time (${spell.mpCost} MP)`])
      balloonBtn.innerHTML = balloonButton.html
      balloonBtn.dataset.key = balloonButton.key
    }

    const gravelBtn = document.getElementById('gravel-grenade-btn')
    if (gravelBtn) {
      const spell = GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE
      const [gravelButton] = StringFormatter.processButtonTexts([`Gravel Grenade (${spell.mpCost} MP)`])
      gravelBtn.innerHTML = gravelButton.html
      gravelBtn.dataset.key = gravelButton.key
    }
  }

  setupEventListeners () {
    // Movement buttons (handled by event listeners in core.js)

    // NPC interaction buttons (will be added dynamically)

    // Audio toggle
    document.getElementById('audio-toggle')?.addEventListener('click', () => this.toggleAudio())

    // Keyboard controls
    document.addEventListener('keydown', (e) => this.handleKeyboard(e))

    // Enter key handlers for different screens
    document.addEventListener('keydown', (e) => this.handleGlobalKeyboard(e))
  }

  // Setup event delegation for dynamic content
  setupEventDelegation () {
    // Single delegated listener for all dynamic dialogue and shop interactions
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]')
      if (!target) return

      const action = target.dataset.action
      const params = target.dataset

      // Route to appropriate handler
      switch (action) {
        case 'continue-dialogue':
          this.continueDialogue()
          break
        case 'end-dialogue':
          this.endDialogue()
          break
        case 'end-confirmation':
          this.endConfirmation()
          break
        case 'buy-item':
          this.buyItem(params.itemId)
          break
        case 'open-shop':
          this.openShopFromDialogue()
          break
        case 'rest-at-inn':
          this.restAtInnFromDialogue()
          break
      }
    })
  }

  /**
   * Handles global keyboard input for all game screens and contexts
   * Routes key presses to appropriate handlers based on current game state
   * @param {KeyboardEvent} event - Browser keyboard event object
   */
  handleGlobalKeyboard (event) {
    const key = event.key.toLowerCase()

    // Handle congratulations popup first (highest priority)
    const popup = document.getElementById('congratulations-popup')
    if (popup && popup.classList.contains('show')) {
      if (key === 'c' || event.key === 'Enter') {
        event.preventDefault()
        event.stopPropagation()
        this.hideCongratulationsPopup()
        return
      }
      return // Prevent further processing when popup is shown
    }

    // Handle purchase confirmation keyboard shortcuts (within dialogue screen)
    if (this.isShowingConfirmation) {
      this.handleConfirmationKeyboard(event)
      return
    }

    // Handle dialogue keyboard shortcuts
    if (this.dialogueActive) {
      this.handleDialogueKeyboard(event)
      return
    }

    // Handle shop keyboard shortcuts
    if (this.shopOpen) {
      this.handleShopKeyboard(event)
      return
    }

    // Handle character creation arrow keys and shortcuts (but not when typing in name field)
    if (this.currentScreen === 'character-creation') {
      const nameInput = document.getElementById('betta-name')
      const isNameFieldFocused = document.activeElement === nameInput

      // Tab key to toggle name field focus
      if (key === 'tab') {
        event.preventDefault()
        if (nameInput) {
          if (isNameFieldFocused) {
            // If already focused, blur to allow other shortcuts
            nameInput.blur()
          } else {
            // If not focused, focus the field
            nameInput.focus()
          }
        }
        return
      }

      // Arrow keys for color cycling (only when not in name field)
      if (!isNameFieldFocused && (key === 'arrowleft' || key === 'arrowright')) {
        event.preventDefault()
        this.cycleColorSelection(key === 'arrowright' ? 1 : -1)
        return
      }

      // Check button shortcuts using data-key attributes from automated system
      // Only process shortcuts when not typing in the name field
      if (!isNameFieldFocused) {
        const buttons = document.querySelectorAll('button[data-key]')
        buttons.forEach(button => {
          if (button.dataset.key === key && !button.disabled) {
            event.preventDefault()
            button.click()
          }
        })
      }

      // Letter keys for color selection (only when not in name field)
      // Now using the automated key assignments from processButtonTexts
      if (!isNameFieldFocused) {
        const colorOptions = document.querySelectorAll('.color-option')
        colorOptions.forEach(option => {
          if (option.dataset.key === key) {
            event.preventDefault()
            option.click()
          }
        })
      }
    }

    // Handle title screen shortcuts
    if (this.currentScreen === 'title-screen' && key === 's') {
      event.preventDefault()
      const startButton = document.getElementById('start-game-btn')
      if (startButton) startButton.click()
      return
    }

    // Handle Enter key for different screens
    if (event.key === 'Enter') {
      switch (this.currentScreen) {
        case 'title-screen': {
          // Trigger Start Adventure button
          const startButton = document.getElementById('start-game-btn')
          if (startButton) startButton.click()
          break
        }

        case 'character-creation': {
          // Trigger Begin Adventure button if enabled
          const createButton = document.getElementById('create-character')
          if (createButton && !createButton.disabled) {
            createButton.click()
          }
          break
        }
      }
    }
  }

  handleDialogueKeyboard (event) {
    const key = event.key.toLowerCase()
    const dialogueOptions = document.querySelectorAll('#dialogue-options .dialogue-option:not(.disabled), #dialogue-options button')

    // Check if we're in shop mode within dialogue (shop content is showing)
    const dialogueText = document.getElementById('dialogue-text')
    const isInShopMode = dialogueText && dialogueText.innerHTML.includes(GameStrings.SYSTEM.TEXT_CHECKS.SHOP_INVENTORY_TEXT)

    // Handle shop-specific keys when in shop mode
    if (isInShopMode) {
      // Handle Maybe Later button
      if (key === 'm' || key === 'enter') {
        event.preventDefault()
        this.endDialogue()
        return
      }

      // Handle dynamic shop item keys
      const shopItems = document.querySelectorAll('.shop-item[data-key]')
      for (const item of shopItems) {
        if (item.dataset.key === key && item.classList.contains('shop-item-buyable')) {
          event.preventDefault()
          item.click() // Trigger the event listener
          return
        }
      }
    }

    switch (key) {
      case 'c': {
        event.preventDefault()
        // Continue dialogue if available
        const continueBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('continue'))
        if (continueBtn) continueBtn.click()
        break
      }

      case 'enter': {
        event.preventDefault()
        // Default Enter behavior based on context
        const dialogueState = this.world.getCurrentDialogueState()

        // First check for Continue button (works for all NPCs)
        const enterContinueBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('continue'))
        if (enterContinueBtn) {
          enterContinueBtn.click()
        } else if (dialogueState && dialogueState.isShop) {
          // In shop NPC final dialogue: Enter = Browse Items, or Goodbye if no Browse
          const browseBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('browse'))
          if (browseBtn) {
            browseBtn.click()
          } else {
            const goodbyeBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('goodbye'))
            if (goodbyeBtn) goodbyeBtn.click()
          }
        } else if (dialogueState && dialogueState.isInn) {
          // In inn NPC final dialogue: Enter = Rest (if affordable), otherwise Goodbye
          const allOptions = document.querySelectorAll('#dialogue-options .dialogue-option, #dialogue-options button')
          const restBtn = [...allOptions].find(btn => btn.textContent.toLowerCase().includes('rest') && !btn.classList.contains('disabled'))
          if (restBtn) {
            restBtn.click()
          } else {
            const goodbyeBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('goodbye'))
            if (goodbyeBtn) goodbyeBtn.click()
          }
        } else {
          // Regular NPC final dialogue: Enter = Goodbye
          const goodbyeBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('goodbye'))
          if (goodbyeBtn) goodbyeBtn.click()
        }
        break
      }

      case 'r': {
        event.preventDefault()
        // Rest at inn if available and affordable - check all options including disabled
        const allDialogueOptions = document.querySelectorAll('#dialogue-options .dialogue-option, #dialogue-options button')
        const restBtn = [...allDialogueOptions].find(btn => btn.textContent.toLowerCase().includes('rest') && !btn.classList.contains('disabled'))
        if (restBtn) {
          restBtn.click()
        } else {
          // Check if we're at inn and show message if not enough bites
          const innDialogueState = this.world.getCurrentDialogueState()
          if (innDialogueState && innDialogueState.isInn) {
            const costMessage = StringFormatter.format(GameStrings.INN.REST_NOT_ENOUGH, { cost: GameConfig.SHOP.INN_REST.cost })
            this.displayMessage(costMessage)
          }
        }
        break
      }

      case 'b': {
        event.preventDefault()
        // Browse items if available
        const browseBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('browse'))
        if (browseBtn) {
          browseBtn.click()
        }
        break
      }

      case 'g': {
        event.preventDefault()
        // Goodbye
        const goodbyeBtn = [...dialogueOptions].find(btn => btn.textContent.toLowerCase().includes('goodbye'))
        if (goodbyeBtn) goodbyeBtn.click()
        break
      }

      case 'd': {
        event.preventDefault()
        // Dunkleosteus Submarine (if affordable and clickable)
        const dunkleosteusSub = document.querySelector('.shop-item-buyable .item-name')
        if (dunkleosteusSub && dunkleosteusSub.innerHTML.includes('Dunkleosteus')) {
          dunkleosteusSub.closest('.shop-item').click()
        }
        break
      }

      case 'k': {
        event.preventDefault()
        // Kelp Snack (if affordable and clickable)
        const kelpSnack = [...document.querySelectorAll('.shop-item-buyable .item-name')].find(item =>
          item.innerHTML.includes('Kelp'))
        if (kelpSnack) {
          kelpSnack.closest('.shop-item').click()
        }
        break
      }
    }
  }

  handleConfirmationKeyboard (event) {
    const key = event.key.toLowerCase()
    const dialogueOptions = document.querySelectorAll('#dialogue-options .dialogue-option')

    // Handle Enter key - click the confirmation button
    if (key === 'enter') {
      event.preventDefault()
      if (dialogueOptions.length > 0) {
        dialogueOptions[0].click()
      }
      return
    }

    // Handle underlined letter shortcuts
    for (const option of dialogueOptions) {
      const underlinedMatch = option.innerHTML.match(/<u>([a-zA-Z])<\/u>/)
      if (underlinedMatch && underlinedMatch[1].toLowerCase() === key) {
        event.preventDefault()
        option.click()
        return
      }
    }
  }

  handleShopKeyboard (event) {
    const key = event.key.toLowerCase()

    switch (key) {
      case 'l':
      case 'enter':
        event.preventDefault()
        // Leave shop
        this.toggleShop()
        break

      case 'd':
        event.preventDefault()
        // Buy Dunkleosteus Submarine
        this.buyItem('submarine')
        break

      case 'k':
        event.preventDefault()
        // Buy Kelp Snack
        this.buyItem('kelp_snack')
        break

      case 'b':
        event.preventDefault()
        // Buy Bubble Water
        this.buyItem('bubble_water')
        break
    }
  }

  handleKeyboard (event) {
    if (this.dialogueActive || this.currentScreen === 'start' || this.isShowingConfirmation) return

    const key = event.key.toLowerCase()

    // Combat controls (highest priority when in combat)
    if (this.currentScreen === 'combat' && this.combat.isCombatActive()) {
      switch (key) {
        case 'a':
          event.preventDefault()
          this.playerAttack()
          break
        case 'b':
          event.preventDefault()
          if (this.isButtonVisible('bubble-blast-btn') && this.player.canCastSpell('bubble')) {
            this.playerCastSpell('bubble')
          } else if (!this.player.canCastSpell('bubble')) {
            this.combat.displayCombatMessage(StringFormatter.format(GameStrings.COMBAT.NOT_ENOUGH_MP, { spellName: GameConfig.COMBAT.SPELLS.BUBBLE_BLAST.name }))
            this.updateCombatLog()
          }
          break
        case 'h':
          event.preventDefault()
          if (this.player.hasSpell('party')) {
            if (this.player.canCastSpell('party')) {
              this.playerCastSpell('party')
            } else {
              // Not enough MP
              this.combat.displayCombatMessage(StringFormatter.format(GameStrings.COMBAT.NOT_ENOUGH_MP, { spellName: GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME.name }))
              this.updateCombatLog()
            }
          }
          // If player doesn't have spell yet, silently ignore
          break
        case 'g':
          event.preventDefault()
          if (this.player.hasSpell('gravel')) {
            if (this.player.canCastSpell('gravel')) {
              this.playerCastSpell('gravel')
            } else {
              // Not enough MP
              this.combat.displayCombatMessage(StringFormatter.format(GameStrings.COMBAT.NOT_ENOUGH_MP, { spellName: GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE.name }))
              this.updateCombatLog()
            }
          }
          // If player doesn't have spell yet, silently ignore
          break
        case 's':
          event.preventDefault()
          this.playerRunAway()
          break
      }
      return // Don't process other keys during combat
    }

    // World map controls
    if (this.currentScreen === 'world-map') {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          this.movePlayer('north')
          break
        case 'ArrowDown':
          event.preventDefault()
          this.movePlayer('south')
          break
        case 'ArrowLeft':
          event.preventDefault()
          this.movePlayer('west')
          break
        case 'ArrowRight':
          event.preventDefault()
          this.movePlayer('east')
          break
        case 'Home':
          event.preventDefault()
          this.returnToVillage()
          break
      }
    }

    // Village controls - use automatically assigned keys
    if (this.currentScreen === 'village') {
      // Handle dynamically assigned village building shortcuts
      if (this.villageButtons) {
        const actions = ['elder', 'merchant', 'guard', 'bubble', 'innkeeper', 'exit']

        this.villageButtons.forEach((button, index) => {
          if (button.key === key) {
            event.preventDefault()
            if (index === 5) { // Exit to paddies
              this.leaveVillage()
            } else {
              this.talkToNPC(actions[index])
            }
          }
        })
      }
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          // Only exit village if not blocked (prevents immediate exit after entry)
          if (!this.blockVillageExit) {
            this.leaveVillage()
          }
          return // Prevent further processing of this keypress
      }
    }

    // Cheat codes (work on any screen except dialogue/start)
    if (key === '$') {
      event.preventDefault()
      this.player.gainBettaBites(100)
      this.displayMessage(GameStrings.SYSTEM.CHEATS.BETTA_BITES_ADDED)
      this.updateAllDisplays()
    }

    if (key === '%') {
      event.preventDefault()
      const expNeeded = this.player.getExpToNext() - this.player.getExp()
      if (this.player.gainExp(expNeeded)) {
        this.player.levelUp()
        this.audio.playSound('levelup')
        this.displayMessage(GameStrings.SYSTEM.CHEATS.LEVEL_UP_APPLIED)
        this.updateAllDisplays()
      }
    }

    if (key === '+') {
      event.preventDefault()
      this.player.fullHeal()
      this.displayMessage(GameStrings.SYSTEM.CHEATS.HP_MP_RESTORED)
      this.updateAllDisplays()
    }
  }

  // Screen management
  showScreen (screenId) {
    const screenMap = {
      'title-screen': 'title-screen',
      'character-creation': 'character-creation',
      village: 'village',
      'world-map': 'world-map',
      dialogue: 'dialogue',
      combat: 'combat'
    }

    this.currentScreen = screenId
    this.hideAllScreens()

    // Hide all background containers
    document.querySelectorAll('.background-container').forEach(container => {
      container.classList.remove('active')
    })

    const elementId = screenMap[screenId] || 'gameArea'
    this.showElement(elementId)

    // Screen-specific setup and background container activation
    switch (screenId) {
      case 'title-screen':
        break
      case 'character-creation':
        // Character creation screen setup (no circular call)
        break
      case 'village':
        document.getElementById('village-container')?.classList.add('active')
        this.showVillageScreen()
        break
      case 'world-map':
        document.getElementById('world-container')?.classList.add('active')
        this.showWorldMapScreen()
        break
      case 'dialogue':
        // Dialogue overlay handled separately - keep current background
        this.determineDialogueBackground()
        break
      case 'combat':
        // Combat inherits current location's background
        this.determineCombatBackground()
        this.showCombatScreen()
        break
    }

    this.updateAllDisplays()
  }

  showStartScreen () {
    this.showScreen('title-screen')
    this.hideStatsPanel()
  }

  showGameScreen () {
    // Determine screen based on current location
    if (this.world.isInVillage()) {
      this.showScreen('village')
    } else {
      this.showScreen('world-map')
    }
  }

  /**
   * Displays village interface with NPC interactions and safe zone features
   * Shows village background and enables access to shops, inn, and dialogue
   */
  showVillageScreen () {
    // Village-specific UI setup - background is now handled by CSS
    // Clean up world map dynamic styles
    const existingStyle = document.getElementById('dynamic-world-style')
    if (existingStyle) {
      existingStyle.remove()
    }

    this.showStatsPanel()
  }

  /**
   * Displays world map exploration interface with movement controls
   * Shows current location and enables directional movement for exploration
   */
  showWorldMapScreen () {
    // World map specific UI setup (don't auto-display message - only show when actually leaving village)
    this.createLayeredWorldBackground()
    this.showRicePaddies()
    this.showPlayerOnMap()
    this.showStatsPanel()
  }

  /**
   * Displays combat screen interface and initializes combat UI elements
   * Sets up combat background, enables combat controls, and shows stats panel
   */
  showCombatScreen () {
    // Clear enemy sprite immediately to prevent flash of previous enemy
    const enemySprite = document.getElementById('enemy-fish-combat')
    if (enemySprite) {
      enemySprite.style.visibility = 'hidden'
      enemySprite.src = ''
    }

    // Combat screen setup
    this.showStatsPanel() // Show stats during combat
    this.updateCombatDisplay()
    this.enableCombatButtons()
  }

  hideAllScreens () {
    const screens = ['title-screen', 'character-creation', 'village', 'world-map', 'dialogue', 'combat']
    screens.forEach(id => this.hideElement(id))
  }

  showElement (id) {
    const element = document.getElementById(id)
    if (element) {
      element.classList.add('active')
      element.style.display = 'block'
    }
  }

  hideElement (id) {
    const element = document.getElementById(id)
    if (element) {
      element.classList.remove('active')
      element.style.display = 'none'
    }
  }

  // Game initialization
  /**
   * Initializes new game by displaying character creation screen
   * Resets all game managers and begins fresh game session
   */
  startNewGame () {
    this.showCharacterCreation()
  }

  showCharacterCreation () {
    // Show the proper character creation screen
    this.showScreen('character-creation')
    this.hideStatsPanel()

    // Set up character creation form
    this.setupCharacterCreationForm()
  }

  setupCharacterCreationForm () {
    // Initialize form state with defaults
    let selectedColor = 'red' // Default color
    const defaultName = this.generateRandomName() // Random default name

    // Get elements
    const nameInput = document.getElementById('betta-name')
    const previewName = document.getElementById('preview-name')
    const createButton = document.getElementById('create-character')
    const randomNameBtn = document.getElementById('random-name-btn')
    const colorOptions = document.querySelectorAll('.color-option')
    const previewColor = document.getElementById('preview-color')
    const bettaPreview = document.getElementById('betta-preview')

    // Clear any existing event listeners by cloning elements (only if they exist)
    if (nameInput && nameInput.parentNode) {
      const newNameInput = nameInput.cloneNode(true)
      nameInput.parentNode.replaceChild(newNameInput, nameInput)
    }
    if (createButton && createButton.parentNode) {
      const newCreateButton = createButton.cloneNode(true)
      createButton.parentNode.replaceChild(newCreateButton, createButton)
    }
    if (randomNameBtn && randomNameBtn.parentNode) {
      const newRandomBtn = randomNameBtn.cloneNode(true)
      randomNameBtn.parentNode.replaceChild(newRandomBtn, randomNameBtn)
    }

    // Re-get elements after cloning
    const nameInputNew = document.getElementById('betta-name')
    const createButtonNew = document.getElementById('create-character')
    const randomNameBtnNew = document.getElementById('random-name-btn')

    // Set default values AFTER cloning
    if (nameInputNew) nameInputNew.value = defaultName
    if (previewName) previewName.textContent = defaultName
    if (previewColor) previewColor.textContent = GameStrings.UI.COLORS.RED

    // Set default color selection (red)
    colorOptions.forEach(option => {
      if (option.dataset.color === 'red') {
        option.classList.add('selected')
        if (bettaPreview) {
          bettaPreview.style.filter = 'hue-rotate(0deg) saturate(1.2)'
        }
      } else {
        option.classList.remove('selected')
      }
    })

    // Enable the create button with defaults
    this.updateCreateButtonState(defaultName, selectedColor)

    // Name input handler
    if (nameInputNew) {
      nameInputNew.addEventListener('input', () => {
        const name = nameInputNew.value.trim()
        if (previewName) previewName.textContent = name || GameStrings.CHARACTER_CREATION.PREVIEW.UNKNOWN_NAME
        this.updateCreateButtonState(name, selectedColor)
      })

      // Handle Enter key in name field
      nameInputNew.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const createButton = document.getElementById('create-character')
          if (createButton && !createButton.disabled) {
            createButton.click()
          }
        }
      })
    }

    // Random name button
    if (randomNameBtnNew) {
      randomNameBtnNew.addEventListener('click', () => {
        const randomName = this.generateRandomName()
        if (nameInputNew) nameInputNew.value = randomName
        if (previewName) previewName.textContent = randomName
        this.updateCreateButtonState(randomName, selectedColor)
      })
    }

    // Color selection handlers
    colorOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove previous selection
        colorOptions.forEach(opt => opt.classList.remove('selected'))

        // Add selection to clicked option
        option.classList.add('selected')

        // Update preview
        selectedColor = option.dataset.color
        if (previewColor) {
          previewColor.textContent = selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)
        }

        // Update betta preview with color filter
        if (bettaPreview) {
          const filters = {
            red: 'hue-rotate(0deg) saturate(1.2)',
            blue: 'hue-rotate(180deg) saturate(1.3)',
            purple: 'hue-rotate(270deg) saturate(1.8)',
            green: 'hue-rotate(140deg) saturate(1.2) brightness(0.85)',
            orange: 'hue-rotate(30deg) saturate(1.8) brightness(1.1)'
          }
          bettaPreview.style.filter = filters[selectedColor] || 'none'
        }

        const currentName = nameInputNew ? nameInputNew.value.trim() : ''
        this.updateCreateButtonState(currentName, selectedColor)
      })
    })

    // Create character button
    if (createButtonNew) {
      createButtonNew.addEventListener('click', () => {
        const name = nameInputNew ? nameInputNew.value.trim() : ''
        if (name && selectedColor) {
          this.player.setPlayerIdentity(name, selectedColor)

          this.showScreen('village')
          this.displayMessage(StringFormatter.format(GameStrings.CHARACTER_CREATION.WELCOME_MESSAGE, { playerName: name }))
        }
      })
    }
  }

  updateCreateButtonState (name, color) {
    const createButton = document.getElementById('create-character')
    if (createButton) {
      if (name && color) {
        createButton.disabled = false
        const [startButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.START_GAME])
        createButton.innerHTML = startButton.html
        createButton.dataset.key = startButton.key
      } else {
        createButton.disabled = true
        createButton.textContent = name ? GameStrings.UI.LABELS.CHOOSE_COLOR : color ? GameStrings.UI.LABELS.ENTER_NAME : GameStrings.UI.LABELS.ENTER_NAME_AND_CHOOSE_COLOR
      }
    }
  }

  cycleColorSelection (direction) {
    const colorOptions = document.querySelectorAll('.color-option')
    const colors = Array.from(colorOptions).map(opt => opt.dataset.color)

    // Find currently selected color
    let currentIndex = -1
    colorOptions.forEach((opt, index) => {
      if (opt.classList.contains('selected')) {
        currentIndex = index
      }
    })

    // If no selection, start at first
    if (currentIndex === -1) currentIndex = 0

    // Calculate new index with wrapping
    let newIndex = currentIndex + direction
    if (newIndex < 0) newIndex = colors.length - 1
    if (newIndex >= colors.length) newIndex = 0

    // Click the new color option to trigger all the update logic
    if (colorOptions[newIndex]) {
      colorOptions[newIndex].click()
    }
  }

  // Select color by name
  selectColorByName (colorName) {
    const colorOptions = document.querySelectorAll('.color-option')

    // Find the color option with matching data-color attribute
    colorOptions.forEach(option => {
      if (option.dataset.color === colorName) {
        option.click()
      }
    })
  }

  // Movement handling
  /**
   * Handles player movement input and coordinates with world manager
   * Prevents movement during combat or dialogue and manages screen transitions
   * @param {string} direction - Direction to move ('north', 'south', 'east', 'west')
   */
  movePlayer (direction) {
    if (this.combat.isCombatActive() || this.dialogueActive) return

    // Update facing direction
    if (direction === 'east') {
      this.playerFacing = 'right'
    } else if (direction === 'west') {
      this.playerFacing = 'left'
    }

    // Show directional movement messages before moving
    if (!this.world.isInVillage()) {
      const directionTexts = {
        north: GameStrings.EXPLORATION.MOVEMENT.DIRECTIONS.NORTH,
        south: GameStrings.EXPLORATION.MOVEMENT.DIRECTIONS.SOUTH,
        east: GameStrings.EXPLORATION.MOVEMENT.DIRECTIONS.EAST,
        west: GameStrings.EXPLORATION.MOVEMENT.DIRECTIONS.WEST
      }
      this.displayMessage(directionTexts[direction])
    }

    const result = this.world.movePlayer(direction)

    if (!result.success) {
      this.displayMessage(result.reason)
      return
    }

    // Update screen based on location change
    const wasInVillage = this.currentScreen === 'village'
    const nowInVillage = this.world.isInVillage()

    if (wasInVillage && !nowInVillage) {
      this.showScreen('world-map')
    } else if (!wasInVillage && nowInVillage) {
      this.showScreen('village')
      // Block village exit briefly to prevent immediate exit
      this.blockVillageExit = true
      setTimeout(() => {
        this.blockVillageExit = false
      }, 100)
    }

    // Handle movement result
    if (result.message) {
      this.displayMessage(result.message)
    }

    // Handle edge congratulations
    if (result.showCongratulations) {
      this.showCongratulationsPopup()
    }

    // Handle encounters
    if (result.encounter) {
      this.handleEncounter(result.encounter)
    }

    // Update player position on map
    this.updatePlayerMapPosition()

    this.updateAllDisplays()
  }

  // Encounter handling
  /**
   * Processes encounter results from world exploration and displays appropriate UI
   * Handles different encounter types (combat, treasure, peaceful, mystery)
   * @param {Object} encounter - Encounter object with type and relevant data
   */
  handleEncounter (encounter) {
    switch (encounter.type) {
      case 'combat':
        // Display edge zone warning if present
        if (encounter.message) {
          this.displayMessage(encounter.message)
        }
        this.startCombat(encounter.enemy)
        break

      case 'treasure':
        this.displayMessage(encounter.message)
        break

      case 'peaceful':
        this.displayMessage(encounter.message)
        break

      case 'mystery':
        this.displayMessage(encounter.message)
        if (encounter.effectMessage) {
          const MYSTERY_MESSAGE_DELAY = 1000 // Delay before showing second mystery message
          setTimeout(() => this.displayMessage(encounter.effectMessage), MYSTERY_MESSAGE_DELAY)
        }
        break
    }
  }

  // Combat UI
  startCombat (enemy) {
    this.showScreen('combat')

    // Clear any lingering rainbow effects and friendship messages from previous combats
    const enemyHPBar = document.getElementById('enemy-hp-bar')
    if (enemyHPBar) {
      enemyHPBar.classList.remove('rainbow-friendship')
      enemyHPBar.style.width = '' // Reset width to default
    }

    // Reset the HP container text to proper format
    const enemyHPContainer = document.querySelector('.enemy-combat > div:last-child')
    if (enemyHPContainer) {
      // Restore the HP: prefix if it was replaced with friendship message
      if (!enemyHPContainer.innerHTML.includes('HP:')) {
        enemyHPContainer.innerHTML = 'HP: <span id="enemy-hp-text"></span>'
      }
    }

    this.updateCombatDisplay()
    this.enableCombatButtons()

    // Remove combat-over class for new battle
    document.getElementById('combat')?.classList.remove('combat-over')
  }

  endCombat () {
    // Store whether we need to show peace message after congratulations
    const needsPeaceMessage = this.combat.shouldShowPeaceMessage()

    // Check for max level victory congratulations before ending combat
    if (this.combat.shouldShowCongratulations()) {
      this.showCongratulationsPopup(() => {
        // Callback when congratulations is closed
        if (needsPeaceMessage) {
          this.showPeaceMessage()
          this.combat.clearPeaceMessageFlag()
        }
      })
      this.combat.clearCongratulationsFlag()
    } else if (needsPeaceMessage) {
      // Show peace message immediately if no congratulations
      this.showPeaceMessage()
      this.combat.clearPeaceMessageFlag()
    }

    // Clean up only old balloon effects (older than 3 seconds)
    // This preserves balloons during the celebration but removes lingering ones
    const balloonContainers = document.querySelectorAll('.balloon-container')
    balloonContainers.forEach(container => {
      const createdAt = parseInt(container.dataset.createdAt || 0)
      const age = Date.now() - createdAt
      if (age > 3000) { // Only remove if older than 3 seconds
        container.remove()
      }
    })

    this.disableCombatButtons()

    // Return to appropriate screen after combat
    this.showGameScreen()

    // Reset party hat flag and update sprites to remove party hat
    this.combat.playerHasPartyHat = false

    // Force update player stats to reset combat sprite
    this.updatePlayerStats()
  }

  /**
   * Updates all combat UI elements including HP bars, stats, and enemy display
   * Refreshes player and enemy health, MP, and combat status indicators
   */
  updateCombatDisplay () {
    const enemy = this.combat.getCurrentEnemy()
    if (!enemy) return

    // Update player name in combat
    this.setTextContent('player-name-combat', this.player.getName())

    // Update enemy info (using correct HTML IDs)
    this.setTextContent('enemy-name', enemy.name)
    this.setTextContent('enemy-level', `Level ${enemy.level}`)

    // Update HP bars
    this.updateHPBar('player-hp-bar', this.player.getHP(), this.player.getMaxHP())

    // Special handling for befriended enemies - don't update HP bar (let rainbow effect stay)
    // Check if we're actively befriending in THIS combat, not just if enemy has befriended flag
    if (!this.combat.isBefriendingCurrentEnemy()) {
      this.updateHPBar('enemy-hp-bar', enemy.hp, enemy.maxHp)
      this.setTextContent('enemy-hp-text', `${enemy.hp}/${enemy.maxHp}`)
    } else {
      // For enemies being befriended in this combat, replace entire HP text with friendship message
      const enemyHPContainer = document.querySelector('.enemy-combat > div:last-child')
      if (enemyHPContainer && enemyHPContainer.textContent.includes('HP:')) {
        enemyHPContainer.textContent = GameStrings.COMBAT.MADE_FRIEND
      }
    }

    // Update player stats (this will handle party hat preservation)
    this.updatePlayerStats()

    // Update combat log
    this.updateCombatLog()

    // Update enemy sprite only if no party hat (using correct HTML ID)
    if (!enemy.hasPartyHat) {
      const enemySprite = document.getElementById('enemy-fish-combat')
      if (enemySprite) {
        // Clear sprite first to prevent flash of previous enemy
        enemySprite.style.visibility = 'hidden'
        enemySprite.src = enemy.sprite
        // Apply random hue rotation for color variation
        enemySprite.style.filter = enemy.randomHue ? `hue-rotate(${enemy.randomHue}deg)` : 'none'
        // Show sprite after setting new image
        enemySprite.style.visibility = 'visible'
      }
    }

    // Update swim away difficulty warning
    const swimAwayMessage = document.getElementById('swim-away-message')
    if (swimAwayMessage) {
      if (enemy.level >= GameConfig.COMBAT.RUN_AWAY.difficultEnemyLevel) {
        swimAwayMessage.textContent = '⚡ Escape is very difficult! ⚡'
      } else {
        swimAwayMessage.textContent = ''
      }
    }

    // Update player sprite in combat
    const playerSprite = document.getElementById('player-fish-combat')
    if (playerSprite) {
      playerSprite.src = this.player.getSprite()
      playerSprite.style.filter = this.player.getColorFilter()
    }

    // Manage spell button visibility and states
    const bubbleBtn = document.getElementById('bubble-blast-btn')
    const balloonBtn = document.getElementById('happy-balloon-btn')
    const gravelBtn = document.getElementById('gravel-grenade-btn')

    if (bubbleBtn) {
      bubbleBtn.disabled = !this.player.canCastSpell('bubble')
    }

    if (balloonBtn) {
      // Show/hide balloon button based on spell availability
      if (this.player.hasSpell('party')) {
        balloonBtn.style.display = 'inline-block'
        balloonBtn.disabled = !this.player.canCastSpell('party')
      } else {
        balloonBtn.style.display = 'none'
      }
    }

    if (gravelBtn) {
      // Show/hide gravel button based on spell availability
      if (this.player.hasSpell('gravel')) {
        gravelBtn.style.display = 'inline-block'
        gravelBtn.disabled = !this.player.canCastSpell('gravel')
      } else {
        gravelBtn.style.display = 'none'
      }
    }
  }

  updateCombatLog () {
    const logElement = document.getElementById('combat-log')
    if (!logElement) return

    const log = this.combat.getCombatLog()
    logElement.innerHTML = log.map(message => `<div class="log-entry">${message}</div>`).join('')
    logElement.scrollTop = 0 // Scroll to top (newest messages)
  }

  enableCombatButtons () {
    // Attack button is always enabled (handled by event listener in core.js)

    // Always enable spell buttons - let click handlers show MP messages
    const bubbleBtn = document.getElementById('bubble-blast-btn')
    const balloonBtn = document.getElementById('happy-balloon-btn')
    const gravelBtn = document.getElementById('gravel-grenade-btn')

    if (bubbleBtn) {
      bubbleBtn.removeAttribute('disabled')
      bubbleBtn.style.display = 'block'
    }

    if (balloonBtn) {
      // Show balloon button if player has the spell
      if (this.player.hasSpell('party')) {
        balloonBtn.removeAttribute('disabled')
        balloonBtn.style.display = 'block'
      } else {
        balloonBtn.style.display = 'none' // Hide until spell is available
      }
    }

    if (gravelBtn) {
      // Show gravel button if player has the spell
      if (this.player.hasSpell('gravel')) {
        gravelBtn.removeAttribute('disabled')
        gravelBtn.style.display = 'block'
      } else {
        gravelBtn.style.display = 'none' // Hide until spell is available
      }
    }

    // Swim away button (always enabled)
    document.getElementById('swim-away-btn')?.removeAttribute('disabled')
  }

  disableCombatButtons () {
    const buttons = ['bubble-blast-btn', 'happy-balloon-btn', 'gravel-grenade-btn', 'swim-away-btn']
    buttons.forEach(id => {
      document.getElementById(id)?.setAttribute('disabled', 'true')
    })
  }

  // Combat actions
  playerAttack () {
    const result = this.combat.attack()

    // Check if player died during enemy response
    if (result && result.playerDefeated) {
      this.checkAndHandlePlayerDefeat()
      return
    }

    // Check if enemy was defeated
    if (result && result.enemyDefeated) {
      // Update display to show enemy HP at 0
      this.updateCombatDisplay()
      this.updateCombatLog()

      // Brief delay for attack, then show death animation
      setTimeout(() => {
        this.combat.processCombatVictory((victoryResult) => {
          this.handleVictory(victoryResult)
        })
      }, 250)
      return
    }

    // Regular combat continues - update display
    if (this.combat.isCombatActive()) {
      this.updateCombatDisplay()
    } else {
      // If combat ended for other reasons, show final updates
      this.updateCombatLog()
      const COMBAT_END_DELAY = 1500 // Give player time to see final combat state
      setTimeout(() => this.endCombat(), COMBAT_END_DELAY)
    }
  }

  // Check for player defeat and handle death sequence if needed
  checkAndHandlePlayerDefeat () {
    if (!this.player.isAlive && !this.defeatInProgress) {
      this.defeatInProgress = true
      // Update display to show player HP at 0 first
      this.updateCombatDisplay()
      this.updateCombatLog()

      // After a brief delay for HP to show 0, trigger death animation
      setTimeout(() => {
        this.handlePlayerDefeat()
      }, 250)
      return true // Player is defeated
    }
    return false // Player is still alive
  }

  playerCastSpell (spellType) {
    // Check if spell can be cast first and provide feedback
    if (!this.player.canCastSpell(spellType)) {
      // Since UI only shows available spells based on level, failure must be insufficient MP
      let spellName
      if (spellType === 'bubble') {
        spellName = GameConfig.COMBAT.SPELLS.BUBBLE_BLAST.name
      } else if (spellType === 'party') {
        spellName = GameConfig.COMBAT.SPELLS.HAPPY_BALLOON_TIME.name
      } else {
        spellName = GameConfig.COMBAT.SPELLS.GRAVEL_GRENADE.name
      }
      this.combat.displayCombatMessage(StringFormatter.format(GameStrings.COMBAT.NOT_ENOUGH_MP, { spellName }))
      this.updateCombatLog()
      return
    }

    const result = this.combat.useSkill(spellType)

    // Check if player died during enemy response
    if (result && result.playerDefeated) {
      this.checkAndHandlePlayerDefeat()
      return
    }

    // Check if enemy was defeated
    if (result && result.enemyDefeated) {
      // Update display to show enemy HP at 0
      this.updateCombatDisplay()
      this.updateCombatLog()

      // If enemy was befriended, re-apply party hat visual after updates
      if (result.enemy && result.enemy.befriended && this.combat.playerHasPartyHat) {
        const playerFishCombat = document.getElementById('player-fish-combat')
        const statsSprite = document.getElementById('stats-player-sprite')
        const currentSprite = this.player.getSprite()
        const partyHatSprite = this.combat.getPartyHatSprite(currentSprite)

        if (partyHatSprite) {
          if (playerFishCombat) {
            playerFishCombat.src = partyHatSprite
          }
          if (statsSprite) {
            statsSprite.src = partyHatSprite
          }
        }
      }

      // Wait for spell animations to complete before showing death animation
      setTimeout(() => {
        this.combat.processCombatVictory((victoryResult) => {
          this.handleVictory(victoryResult)
        })
      }, 2000) // 2s delay for spell animations to complete
      return
    }

    // Regular combat continues - update display
    if (this.combat.isCombatActive()) {
      this.updateCombatDisplay()
    } else {
      // If combat ended for other reasons, show final updates
      this.updateCombatLog()
      const COMBAT_END_DELAY = 1500 // Give player time to see final combat state
      setTimeout(() => this.endCombat(), COMBAT_END_DELAY)
    }
  }

  playerRunAway () {
    const result = this.combat.runAway()
    this.updateCombatDisplay()
    this.updateCombatLog() // Update combat log to show swim away message

    // Check if player died from retaliation attack
    if (result.playerDefeated) {
      this.checkAndHandlePlayerDefeat()
      return
    }

    // If escape succeeded, end combat
    if (result.escaped || !this.combat.isCombatActive()) {
      // Show swim away message and add to encounter log
      this.displayMessage(GameStrings.COMBAT.ESCAPE_SUCCESS)
      const ESCAPE_MESSAGE_DELAY = 1000 // Wait for escape message to be read
      setTimeout(() => this.endCombat(), ESCAPE_MESSAGE_DELAY)
    }
  }

  /**
   * Handles combat victory processing and displays victory screen with rewards
   * Shows EXP/currency gains, level up notifications, and special achievements
   * @param {Object} victoryResult - Victory data including rewards and bonuses
   */
  handleVictory (victoryResult) {
    // Add combat-over class to show waiting cursor
    document.getElementById('combat')?.classList.add('combat-over')

    // Add combat messages to world map log
    if (victoryResult.defeatedEnemy) {
      // Add in reverse order since newest messages appear at top
      this.displayMessage(StringFormatter.format(GameStrings.COMBAT.ENEMY_APPEARS, {
        enemyName: victoryResult.defeatedEnemy.name,
        level: victoryResult.defeatedEnemy.level
      }))

      // Use befriended message if enemy was befriended, defeated message otherwise
      const message = victoryResult.defeatedEnemy.befriended
        ? GameStrings.COMBAT.ENEMY_BEFRIENDED
        : GameStrings.COMBAT.ENEMY_DEFEATED
      this.displayMessage(StringFormatter.format(message, { enemyName: victoryResult.defeatedEnemy.name }))
    }

    // Don't show congratulations here - it will be shown in endCombat() on world map
    // This prevents showing it twice

    // Don't show peace message here either - it will be shown in endCombat()
    // This prevents showing it twice

    // Check if enemy was befriended via Happy Balloon Time
    const wasBefriended = victoryResult.defeatedEnemy && victoryResult.defeatedEnemy.befriended

    // If there was a level up, wait for level up sound to complete before ending combat
    if (victoryResult.levelUp) {
      const LEVEL_UP_SEQUENCE_DELAY = 1000 // Wait for level up fanfare and messages
      setTimeout(() => this.endCombat(), LEVEL_UP_SEQUENCE_DELAY)
    } else if (wasBefriended) {
      // If enemy was befriended, delay to show party hats
      const FRIENDSHIP_CELEBRATION_DELAY = 2000 // Show party hats for 2 seconds
      setTimeout(() => this.endCombat(), FRIENDSHIP_CELEBRATION_DELAY)
    } else {
      // End combat immediately if no level up and not befriended
      this.endCombat()
    }
  }

  /**
   * Handles player defeat in combat and displays death screen with penalties
   * Shows Betta Bites lost and manages transition back to village safely
   */
  handlePlayerDefeat () {
    // Add combat-over class to show waiting cursor
    document.getElementById('combat')?.classList.add('combat-over')

    // Get defeat information from combat
    const defeatInfo = this.combat.loseCombat()

    // Add "last thing you remember" message to world map log
    if (defeatInfo.defeatedByEnemy) {
      this.displayMessage(`The last thing you remember is a wild ${defeatInfo.defeatedByEnemy.name}!`)
    }

    // Update combat display to show defeat (HP at 0 and death animation)
    this.updateCombatDisplay()
    this.updateCombatLog()

    // Wait, then transition to village with revival message
    setTimeout(() => {
      // Properly teleport player back to village (resets world coordinates)
      this.world.teleportToVillage()
      this.showScreen('village')

      // Reset player sprite orientation (right side up)
      const playerFish = document.getElementById('player-fish-combat')
      if (playerFish) {
        playerFish.style.transform = 'none'
      }
      const statsSprite = document.getElementById('stats-player-sprite')
      if (statsSprite) {
        statsSprite.style.transform = 'none'
      }

      // Show revival message
      if (defeatInfo.bettaBitesLost > 0) {
        this.displayMessage(GameStrings.COMBAT.DEFEAT_RECOVERY_RESCUED)
        this.displayMessage(StringFormatter.format(GameStrings.COMBAT.DEFEAT_RECOVERY_LOSS, {
          amount: defeatInfo.bettaBitesLost
        }))
      } else {
        this.displayMessage(GameStrings.COMBAT.DEFEAT_RECOVERY)
      }

      // Reset defeat flag for next combat
      this.defeatInProgress = false

      this.updateAllDisplays()
    }, 3500) // Delay for death animation
  }

  // Village interactions
  enterVillage () {
    const result = this.world.enterVillage()
    this.displayMessage(result.message)

    if (result.success) {
      this.showScreen('village')
    }

    this.updateAllDisplays()
  }

  // Return to village from anywhere (for Home key and Return button)
  returnToVillage () {
    // Use proper world interface for teleportation
    const result = this.world.teleportToVillage()
    this.displayMessage(result.message)
    this.showScreen('village')
    this.updateAllDisplays()
  }

  leaveVillage () {
    const result = this.world.leaveVillage()
    this.displayMessage(result.message)

    if (result.success) {
      this.showScreen('world-map')
      // Update player map position after leaving village
      this.updatePlayerMapPosition()
    }

    this.updateAllDisplays()
  }

  exitVillage () {
    // Exit to paddies method
    this.leaveVillage()
  }

  toggleShop () {
    this.shopOpen = !this.shopOpen

    if (this.shopOpen) {
      this.showShop()
    } else {
      this.hideShop()
    }
  }

  toggleAudio () {
    if (!this.audio) return

    const isEnabled = this.audio.toggleAudio()
    const toggleButton = document.getElementById('audio-toggle')

    if (toggleButton) {
      toggleButton.textContent = isEnabled ? '🔊' : '🔇'
      toggleButton.classList.toggle('muted', !isEnabled)
      toggleButton.title = isEnabled ? 'Toggle Audio (On)' : 'Toggle Audio (Off)'
    }
  }

  showShop () {
    const shopElement = document.getElementById('shopArea')
    if (!shopElement) return

    shopElement.style.display = 'block'

    const shopItems = this.world.getShopItems()
    const itemsHTML = shopItems.map(item => {
      const canAfford = this.player.canAfford(item.cost)
      return `
                <div class="shop-item ${canAfford ? 'shop-item-buyable' : 'shop-item-unavailable'}">
                    <h4 class="item-name">${item.name}</h4>
                    <p>${item.description}</p>
                    <p>Cost: ${item.cost} Betta Bites</p>
                    ${canAfford ? `<button data-action="buy-item" data-item-id="${item.id}">Buy</button>` : ''}
                </div>
            `
    }).join('')

    const shopItemsElement = document.getElementById('shopItems')
    if (shopItemsElement) {
      shopItemsElement.innerHTML = itemsHTML
    }
  }

  hideShop () {
    const shopElement = document.getElementById('shopArea')
    if (shopElement) {
      shopElement.style.display = 'none'
    }
  }

  // NPC Interaction Methods
  talkToNPC (npcId) {
    const result = this.world.talkToNPC(npcId)
    if (!result.success) {
      this.displayMessage(result.message)
      return
    }

    this.showDialogueScreen(result)
  }

  showDialogueScreen (dialogueData) {
    this.showScreen('dialogue')
    this.dialogueActive = true

    // Create or update dialogue UI
    this.displayDialogue(dialogueData)
  }

  displayDialogue (dialogueData) {
    // Use the HTML dialogue screen structure
    this.showEnhancedDialogue(dialogueData)
  }

  showEnhancedDialogue (dialogueData) {
    // Set up the dialogue screen HTML elements
    const npcNameElement = document.getElementById('npc-name')
    const dialogueTextElement = document.getElementById('dialogue-text')
    const dialogueOptionsElement = document.getElementById('dialogue-options')

    if (npcNameElement) npcNameElement.textContent = dialogueData.npc.name
    if (dialogueTextElement) dialogueTextElement.textContent = dialogueData.dialogue

    // Generate dialogue options with proper styling
    let optionsHTML = ''

    if (dialogueData.hasMoreDialogue) {
      const buttons = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.CONTINUE])
      optionsHTML += `<div class="dialogue-option" data-action="continue-dialogue">${buttons[0].html}</div>`
    } else {
      // Collect button texts
      const buttonTexts = []
      const actions = []

      if (dialogueData.isShop) {
        buttonTexts.push(GameStrings.UI.BUTTONS.BROWSE_ITEMS)
        actions.push('open-shop')
      }
      if (dialogueData.isInn) {
        if (this.player.canAfford(GameConfig.SHOP.INN_REST.cost)) {
          buttonTexts.push(StringFormatter.format(GameStrings.UI.BUTTONS.REST_WITH_COST, { cost: GameConfig.SHOP.INN_REST.cost }))
          actions.push('rest-at-inn')
        } else {
          // Handle disabled state separately since it doesn't get automatic processing
          optionsHTML += `<div class="dialogue-option disabled">${StringFormatter.format(GameStrings.UI.BUTTONS.REST, { cost: GameConfig.SHOP.INN_REST.cost })}${GameStrings.UI.DIALOGUE_OPTIONS.REST_SUFFIX}</div>`
        }
      }
      buttonTexts.push(GameStrings.UI.BUTTONS.GOODBYE)
      actions.push('end-dialogue')

      // Process buttons and generate HTML
      const buttons = StringFormatter.processButtonTexts(buttonTexts)
      buttons.forEach((button, index) => {
        optionsHTML += `<div class="dialogue-option" data-action="${actions[index]}">${button.html}</div>`
      })
    }

    if (dialogueOptionsElement) {
      dialogueOptionsElement.innerHTML = optionsHTML
    }
  }

  continueDialogue () {
    const result = this.world.nextDialogue()
    if (!result.success) {
      this.endDialogue()
      return
    }

    this.showEnhancedDialogue(result)
  }

  openShopFromDialogue () {
    // Show shop inline in the dialogue text area
    const dialogueTextElement = document.getElementById('dialogue-text')
    const dialogueOptionsElement = document.getElementById('dialogue-options')

    if (dialogueTextElement) {
      // Get shop items from world manager (which uses configuration)
      const shopItems = this.world.getShopItems()

      // Use automatic button processing for shop item names
      const itemNames = shopItems.map(item => item.name)
      const processedItems = StringFormatter.processButtonTexts(itemNames)

      let shopItemsHTML = ''
      shopItems.forEach((item, index) => {
        const canAfford = this.player.canAfford(item.cost)
        const clickHandler = canAfford ? `data-action="buy-item" data-item-id="${item.id}"` : ''
        const itemClass = canAfford ? 'shop-item-buyable' : 'shop-item-unavailable'
        const processedItem = processedItems[index]

        shopItemsHTML += `
                    <div class="shop-item ${itemClass}" ${clickHandler} data-key="${processedItem.key}">
                        <div class="item-name">${processedItem.html}</div>
                        <div class="item-description">${item.description}</div>
                        <div class="item-price">${item.cost}${GameStrings.SHOP.INLINE_SHOP.COST_SUFFIX}</div>
                    </div>
                `
      })

      dialogueTextElement.innerHTML = `
                <div class="shop-header">${GameStrings.SHOP.INLINE_SHOP.HEADER}</div>
                <div class="shop-items">
                    ${shopItemsHTML}
                </div>
                <div class="shop-footer">${StringFormatter.format(GameStrings.SHOP.INLINE_SHOP.FOOTER, { bettaBites: this.player.getBettaBites() })}</div>
            `
    }

    if (dialogueOptionsElement) {
      const [maybeLaterButton] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.MAYBE_LATER])
      dialogueOptionsElement.innerHTML = `<div class="dialogue-option" data-action="end-dialogue">${maybeLaterButton.html}</div>`
    }
  }

  restAtInnFromDialogue () {
    const result = this.world.restAtInn()

    if (result.success) {
      this.updateAllDisplays()
      const dialogueTextElement = document.getElementById('dialogue-text')
      const dialogueOptionsElement = document.getElementById('dialogue-options')

      if (dialogueTextElement && dialogueOptionsElement) {
        this.isShowingConfirmation = true
        dialogueTextElement.textContent = StringFormatter.format(
          GameStrings.INN.REST_SUCCESS,
          { cost: GameConfig.SHOP.INN_REST.cost }
        )
        const [button] = StringFormatter.processButtonTexts([GameStrings.UI.BUTTONS.CLOSE])
        dialogueOptionsElement.innerHTML =
                    `<div class="dialogue-option" data-action="end-confirmation">${button.html}</div>`
      }
    } else {
      this.displayMessage(result.message)
      this.endDialogue()
    }
  }

  endConfirmation () {
    this.isShowingConfirmation = false
    this.endDialogue()
  }

  endDialogue () {
    this.world.endDialogue()
    this.dialogueActive = false

    // Return to appropriate screen after dialogue
    this.showGameScreen()
    this.updateAllDisplays()
  }

  // Congratulations popup system
  showCongratulationsPopup (onCloseCallback) {
    const popup = document.getElementById('congratulations-popup')
    if (popup) {
      popup.classList.add('show')
      // Store callback for when popup is closed
      this.congratsCloseCallback = onCloseCallback
      // Victory fanfare already played by combat system
    }
  }

  hideCongratulationsPopup () {
    const popup = document.getElementById('congratulations-popup')
    if (popup) {
      popup.classList.remove('show')
      // Execute callback if one was provided
      if (this.congratsCloseCallback) {
        const callback = this.congratsCloseCallback
        this.congratsCloseCallback = null
        setTimeout(() => callback(), 500) // Small delay for transition
      }
    }
  }

  showPeaceMessage () {
    // Create a special popup for the peace achievement
    const popup = document.createElement('div')
    popup.className = 'peace-popup'
    popup.innerHTML = `
            <h2 style="margin-bottom: 1.5rem;">${GameStrings.SYSTEM.CONGRATULATIONS.ALL_FRIENDS_TITLE}</h2>
            <p style="margin-bottom: 1rem;">${GameStrings.SYSTEM.CONGRATULATIONS.ALL_FRIENDS_MESSAGE}</p>
            <p style="margin-bottom: 2rem;">${GameStrings.SYSTEM.CONGRATULATIONS.ALL_FRIENDS_SUBTITLE}</p>
            <button id="peace-continue-btn"><u>C</u>ontinue</button>
        `
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
        `
    document.body.appendChild(popup)

    // Set up button click handler
    const continueBtn = document.getElementById('peace-continue-btn')
    continueBtn.addEventListener('click', () => popup.remove())

    // Set up keyboard handlers
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === 'c' || e.key === 'C') {
        popup.remove()
        document.removeEventListener('keydown', handleKeyPress)
      }
    }
    document.addEventListener('keydown', handleKeyPress)

    // Focus the button so Enter works
    continueBtn.focus()

    // Play a special sound for achieving peace
    this.audio.playSound('fanfare')
  }

  // Show NPC interaction options when in village

  // Display updates
  updateAllDisplays () {
    this.updatePlayerStats()
    this.updateVillageButtons()

    // Update world map player sprite if on world map (for armor changes etc)
    if (this.currentScreen === 'world-map') {
      this.showPlayerOnMap()
    }
  }

  updatePlayerStats () {
    // Update player stats using proper interfaces (no direct property access)
    this.setTextContent('player-name-display', this.player.getName())
    this.setTextContent('level', this.player.getLevel())
    this.setTextContent('exp', this.player.getExp())
    this.setTextContent('exp-next', this.player.getExpToNext())
    this.setTextContent('betta-bites', this.player.getBettaBites())

    this.setTextContent('hp', this.player.getHP())
    this.setTextContent('max-hp', this.player.getMaxHP())
    this.setTextContent('mp', this.player.getMP())
    this.setTextContent('max-mp', this.player.getMaxMP())

    // Update combat stats if in combat
    this.setTextContent('player-name-combat', this.player.getName())
    this.setTextContent('player-hp-text', `${this.player.getHP()}/${this.player.getMaxHP()}`)

    // Update sprites based on party hat state
    const playerSprite = document.getElementById('stats-player-sprite')
    const combatSprite = document.getElementById('player-fish-combat')

    if (!this.combat.playerHasPartyHat) {
      // No party hat - update both sprites normally
      if (playerSprite) {
        playerSprite.src = this.player.getSprite()
        playerSprite.style.filter = this.player.getColorFilter()
      }
      if (combatSprite) {
        combatSprite.src = this.player.getSprite()
        combatSprite.style.filter = this.player.getColorFilter()
      }
    }
    // If party hat is active, preserve it (don't update sprites)

    // Update HP bar in combat
    this.updateHPBar('player-hp-bar', this.player.getHP(), this.player.getMaxHP())
  }

  updateVillageButtons () {
    const inVillage = this.world.isInVillage()
    const enterBtn = document.getElementById('enterVillageBtn')
    const leaveBtn = document.getElementById('leaveVillageBtn')
    const shopBtn = document.getElementById('shopBtn')
    if (enterBtn) {
      enterBtn.style.display = inVillage ? 'none' : 'block'
    }
    if (leaveBtn) {
      leaveBtn.style.display = inVillage ? 'block' : 'none'
    }
    if (shopBtn) {
      shopBtn.style.display = inVillage ? 'block' : 'none'
    }
  }

  updateHPBar (elementId, current, max) {
    const bar = document.getElementById(elementId)
    if (!bar) return

    const percentage = (current / max) * 100
    bar.style.width = `${percentage}%`

    // Color coding
    if (percentage > 60) {
      bar.style.backgroundColor = '#4CAF50' // Green
    } else if (percentage > 30) {
      bar.style.backgroundColor = '#FF9800' // Orange
    } else {
      bar.style.backgroundColor = '#F44336' // Red
    }
  }

  // Utility functions
  setTextContent (elementId, text) {
    const element = document.getElementById(elementId)
    if (element) {
      element.textContent = text
    }
  }

  displayMessage (message) {
    // Add to both encounter logs (world map and village)
    const logs = [
      document.getElementById('encounter-log'),
      document.getElementById('village-encounter-log')
    ]

    logs.forEach(log => {
      if (log) {
        const entry = document.createElement('div')
        entry.className = 'log-entry'
        entry.textContent = message

        // Insert at the beginning
        log.insertBefore(entry, log.firstChild)

        // Keep only the last 8 messages
        while (log.children.length > 8) {
          log.removeChild(log.lastChild)
        }

        // Scroll to top to show newest message
        log.scrollTop = 0
      }
    })
  }

  updatePlayerSpritesWithPartyHat () {
    const currentSprite = this.player.getSprite()
    const partyHatSprite = this.combat.getPartyHatSprite(currentSprite)
    if (!partyHatSprite) return

    // Update both combat sprite AND stats panel during combat
    const playerFishCombat = document.getElementById('player-fish-combat')
    const statsSprite = document.getElementById('stats-player-sprite')

    if (playerFishCombat) {
      playerFishCombat.src = partyHatSprite
    }

    if (statsSprite) {
      statsSprite.src = partyHatSprite
    }
  }

  applyRainbowHPEffect () {
    const enemyHPBar = document.getElementById('enemy-hp-bar')
    if (enemyHPBar) {
      // Add rainbow animation class
      enemyHPBar.classList.add('rainbow-friendship')
      // Keep the bar at full width
      enemyHPBar.style.width = '100%'
    }
  }

  // World Map Visual Methods
  generateRicePaddyPositions () {
    // Generate consistent random positions for rice paddies
    const positions = []
    const seed = 12345 // Fixed seed for consistent generation
    let rng = seed

    // Simple seeded random number generator
    const seededRandom = () => {
      rng = (rng * 9301 + 49297) % 233280
      return rng / 233280
    }

    for (let i = 0; i < 25; i++) {
      positions.push({
        x: seededRandom() * 80 + 10, // 10-90% of screen width
        y: seededRandom() * 80 + 10, // 10-90% of screen height
        scale: seededRandom() * 0.4 + 0.8 // 0.8-1.2 scale
      })
    }
    return positions
  }

  createLayeredWorldBackground () {
    // Remove existing decorations
    document.querySelectorAll('.rice-paddy-tuft, .betta-village, .map-player, .danger-zone-border, .safe-water-zone').forEach(element => element.remove())

    // Clean up any dynamic styles
    const existingStyle = document.getElementById('dynamic-world-style')
    if (existingStyle) {
      existingStyle.remove()
    }

    // If pre-rendering is complete, background is already set
    if (this.backgroundPreRenderComplete) {
      return
    }

    // Fallback: generate on-demand (shouldn't happen if pre-rendering worked)
    const worldContainer = document.getElementById('world-container')
    if (this.cachedWorldBackground) {
      worldContainer.style.backgroundImage = `url(${this.cachedWorldBackground})`
    } else {
      this.generateTiledBackground().then(backgroundUrl => {
        worldContainer.style.backgroundImage = `url(${backgroundUrl})`
      }).catch(error => {
        console.error('Failed to generate tile background:', error)
        // Fallback to simple water background
        worldContainer.style.backgroundImage = 'url(graphics/map/water-tile-dark.png)'
        worldContainer.style.backgroundRepeat = 'repeat'
        worldContainer.style.backgroundSize = '64px 64px'
      })
    }
  }

  /**
   * Generates a tiled background for the world map using cached water tiles
   * Creates a canvas with tiles colored based on danger zones (safe, dangerous, extreme)
   * Uses GameConfig.WORLD.DANGER_ZONES to determine tile colors by distance from village
   * @async
   * @returns {Promise<string>} Data URL of the generated background canvas image
   * @throws {Error} If image loading fails or canvas creation fails
   */
  async generateTiledBackground () {
    // Return cached version if available
    if (this.cachedWorldBackground) {
      return this.cachedWorldBackground
    }

    const mapSize = GameConfig.WORLD.MAP_SIZE
    const tileSize = 64 // Each tile is 64x64 pixels
    const canvasSize = mapSize * tileSize

    // Create canvas for rendering
    const canvas = document.createElement('canvas')
    canvas.width = canvasSize
    canvas.height = canvasSize
    const ctx = canvas.getContext('2d')

    // Load water tile images (with caching)
    if (!this.cachedWaterTiles) {
      this.cachedWaterTiles = await this.loadWaterTileImages()
    }
    const waterTiles = this.cachedWaterTiles

    for (let y = 0; y < mapSize; y++) {
      for (let x = 0; x < mapSize; x++) {
        const distance = this.world.getDistanceFromVillage(x, y)
        const tileImage = this.getTileImageForDistance(distance, waterTiles)

        // Draw tile at correct position
        ctx.drawImage(tileImage, x * tileSize, y * tileSize, tileSize, tileSize)
      }
    }

    // Convert canvas to data URL and cache it
    try {
      this.cachedWorldBackground = canvas.toDataURL('image/png')
      return this.cachedWorldBackground
    } catch (error) {
      // Handle CORS/taint errors by falling back to uncached generation
      console.warn('Canvas toDataURL failed (likely CORS), generating without caching:', error)
      return canvas.toDataURL('image/png')
    }
  }

  // Load all water tile images
  async loadWaterTileImages () {
    const imagePromises = [
      this.loadImage('graphics/map/water-tile2.png'), // Light water (safe)
      this.loadImage('graphics/map/water-tile-darkish.png'), // Medium water (dangerous)
      this.loadImage('graphics/map/water-tile-dark.png') // Dark water (extreme)
    ]

    const [lightWater, mediumWater, darkWater] = await Promise.all(imagePromises)

    return {
      light: lightWater,
      medium: mediumWater,
      dark: darkWater
    }
  }

  // Helper to load image as promise
  loadImage (src) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  // Determine which tile image to use based on distance from village
  getTileImageForDistance (distance, waterTiles) {
    const zones = GameConfig.WORLD.DANGER_ZONES

    if (distance <= zones.SAFE_RADIUS) {
      return waterTiles.light // Safe zone: light blue water
    } else if (distance <= zones.DANGEROUS_RADIUS) {
      return waterTiles.medium // Dangerous zone: medium blue water
    } else {
      return waterTiles.dark // Extreme zone: dark blue water
    }
  }

  showRicePaddies () {
    const worldMapScreen = document.getElementById('world-map')

    this.ricePaddyPositions.forEach((position, index) => {
      const tuft = document.createElement('img')
      tuft.src = 'graphics/map/rice_paddy_tuft.png'
      tuft.className = 'rice-paddy-tuft'
      tuft.style.position = 'absolute'
      tuft.style.left = `${position.x}%`
      tuft.style.top = `${position.y}%`
      tuft.style.transform = `scale(${position.scale})`
      tuft.style.pointerEvents = 'none'
      tuft.style.zIndex = '1'
      tuft.style.imageRendering = 'pixelated'
      worldMapScreen.appendChild(tuft)
    })

    // Add village marker - position it in the center of its tile
    const village = document.createElement('img')
    village.src = 'graphics/map/bettahome.png'
    village.className = 'betta-village'
    village.style.position = 'absolute'
    const tileSize = 64
    const villagePixelX = GameConfig.WORLD.VILLAGE_CENTER.x * tileSize + tileSize / 2
    const villagePixelY = GameConfig.WORLD.VILLAGE_CENTER.y * tileSize + tileSize / 2
    // Convert to percentage of container
    const containerSize = GameConfig.WORLD.MAP_SIZE * tileSize
    village.style.left = `${(villagePixelX / containerSize) * 100}%`
    village.style.top = `${(villagePixelY / containerSize) * 100}%`
    village.style.transform = 'translate(-50%, -50%)'
    village.style.pointerEvents = 'none'
    village.style.zIndex = '2'
    village.style.imageRendering = 'pixelated'
    worldMapScreen.appendChild(village)
  }

  showPlayerOnMap () {
    const worldMapScreen = document.getElementById('world-map')

    // Remove existing player marker
    const existingPlayer = document.querySelector('.map-player')
    if (existingPlayer) existingPlayer.remove()

    const player = document.createElement('img')
    player.src = this.player.getSprite()
    player.className = this.player.hasSubmarine() ? 'map-player submarine' : 'map-player'
    player.style.position = 'absolute'

    // Position player in center of their tile
    const location = this.world.getCurrentLocation()
    const tileSize = 64
    const playerPixelX = location.x * tileSize + tileSize / 2
    const playerPixelY = location.y * tileSize + tileSize / 2
    const containerSize = GameConfig.WORLD.MAP_SIZE * tileSize

    player.style.left = `${(playerPixelX / containerSize) * 100}%`
    player.style.top = `${(playerPixelY / containerSize) * 100}%`

    // Apply facing direction transform
    const flipTransform = this.playerFacing === 'left' ? 'scaleX(-1)' : ''
    player.style.transform = `translate(-50%, -50%) ${flipTransform}`
    player.style.zIndex = '10'
    player.style.imageRendering = 'pixelated'
    player.style.width = '48px'
    player.style.height = '48px'

    if (this.player.hasSubmarine()) {
      player.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
    } else {
      player.style.filter = this.player.getColorFilter() + ' drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
    }
    worldMapScreen.appendChild(player)
  }

  // Update player position on map based on world coordinates
  updatePlayerMapPosition () {
    const location = this.world.getCurrentLocation()
    // Convert grid coordinates to percentage based on actual map size
    this.playerMapPosition.x = (location.x / GameConfig.WORLD.MAP_SIZE) * 100
    this.playerMapPosition.y = (location.y / GameConfig.WORLD.MAP_SIZE) * 100

    if (this.currentScreen === 'world-map') {
      this.showPlayerOnMap()
    }
  }

  // Show/hide stats panel
  showStatsPanel () {
    const statsPanel = document.getElementById('player-stats')
    if (statsPanel) {
      statsPanel.classList.add('show')
    }
  }

  hideStatsPanel () {
    const statsPanel = document.getElementById('player-stats')
    if (statsPanel) {
      statsPanel.classList.remove('show')
    }
  }

  // Helper methods for background container management
  determineDialogueBackground () {
    // Dialogue keeps the background of the current game state
    if (this.world.isInVillage()) {
      document.getElementById('village-container')?.classList.add('active')
    } else {
      document.getElementById('world-container')?.classList.add('active')
    }
  }

  determineCombatBackground () {
    // Combat inherits from current location
    if (this.world.isInVillage()) {
      document.getElementById('village-container')?.classList.add('active')
    } else {
      document.getElementById('world-container')?.classList.add('active')
    }
  }

  /**
   * Pre-renders world background during game initialization for smooth user experience
   * Generates the background canvas and applies it to the world container DOM element
   * Sets backgroundPreRenderComplete flag to prevent duplicate rendering
   * @async
   * @returns {Promise<void>} Resolves when background is pre-rendered and applied
   */
  async preRenderWorldBackground () {
    if (this.backgroundPreRenderComplete) {
      return // Already done
    }

    try {
      const backgroundUrl = await this.generateTiledBackground()
      const worldContainer = document.getElementById('world-container')
      if (worldContainer && backgroundUrl) {
        worldContainer.style.backgroundImage = `url(${backgroundUrl})`
        this.backgroundPreRenderComplete = true
      }
    } catch (error) {
      // Silent fallback - will generate on-demand if needed
      // Don't set backgroundPreRenderComplete = true so it will try again later
    }
  }

  // Initialize village background and force initial render to prevent first-view flash
  initializeVillageBackground () {
    const villageContainer = document.getElementById('village-container')
    if (villageContainer) {
      // Set background properties
      villageContainer.style.backgroundImage = 'url(graphics/map/water-tile-dark.png)'
      villageContainer.style.backgroundRepeat = 'repeat'
      villageContainer.style.backgroundSize = '64px 64px'
      villageContainer.style.backgroundPosition = '0 0'

      // Force browser to render background by briefly making element visible
      villageContainer.style.opacity = '0'
      villageContainer.classList.add('active')

      // Force a layout/paint cycle
      villageContainer.offsetHeight // eslint-disable-line no-unused-expressions

      // Hide it again
      villageContainer.classList.remove('active')
      villageContainer.style.opacity = ''
    }
  }
}
