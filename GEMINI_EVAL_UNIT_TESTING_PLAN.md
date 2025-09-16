# Unit Testing Strategy for BettarPG

This document outlines a comprehensive plan for introducing unit and integration tests to the BettarPG codebase. It considers multiple approaches, from foundational unit testing of pure logic to end-to-end testing of user interactions.

## 1. Current State Analysis

The project has a modular structure within the `src/` directory, which is highly beneficial for testing. The code can be broadly categorized into two types:

1.  **Pure Game Logic:** Modules that handle state, calculations, and data manipulation without direct dependency on the browser's DOM or rendering engine.
    *   **Files:** `combat.js`, `player.js`, `npc.js`, `core.js` (partially), `config.js`.
    *   **Characteristics:** These are the best candidates for classic unit testing. Their functions likely take data, process it, and return a result or modify a state object.

2.  **Browser-Dependent Logic:** Modules that interact directly with browser APIs, the DOM, canvas, and audio.
    *   **Files:** `ui.js`, `world.js`, `audio.js`.
    *   **Characteristics:** These are difficult to test in a pure Node.js environment. They require either a simulated browser environment (like JSDOM) or a real browser to run tests.

The project currently lacks any testing framework, test runner, or assertion library according to the `package.json` file.

## 2. Proposed Testing Strategy

A hybrid approach is recommended, tackling the "Pure Game Logic" first and then building up to testing browser interactions.

### Phase 1: Foundational Unit Testing with Jest

This phase focuses on getting the highest return on investment by testing the core game mechanics.

**Tooling:**
*   **Jest:** A popular, all-in-one testing framework for JavaScript.
    *   **Why Jest?** It includes a test runner, an assertion library (`expect`), and powerful mocking capabilities out of the box. It also includes **JSDOM**, which allows us to test some DOM-interacting code without a full browser. It requires minimal configuration to get started.

**Implementation Steps:**

1.  **Installation:**
    ```bash
    npm install --save-dev jest
    ```

2.  **Configuration:**
    *   Create a `jest.config.js` file in the root directory. This will be necessary to tell Jest how to handle the ES modules (`import`/`export`) used in the `src/` directory. We may also need Babel to transpile modern JavaScript features.
    ```javascript
    // jest.config.js (Example)
    module.exports = {
      testEnvironment: 'jsdom', // Use JSDOM for a simulated browser environment
      // We might need a transform configuration if we use syntax not supported by Node
      // transform: {
      //   '^.+\.js$': 'babel-jest',
      // },
    };
    ```
    *   Add a test script to `package.json`:
    ```json
    "scripts": {
      "test": "jest"
    }
    ```

3.  **Writing Initial Tests:**
    *   Create a `tests/` directory.
    *   Start with the most critical and isolated logic: `combat.js`.
    *   Create `tests/combat.test.js`.
    *   **Example Test Case (Conceptual):**
        ```javascript
        // tests/combat.test.js
        import { calculateDamage } from '../src/combat.js';

        describe('Combat Logic', () => {
          it('should calculate damage correctly based on attacker and defender stats', () => {
            const attacker = { attack: 50, level: 5 };
            const defender = { defense: 20 };
            const damage = calculateDamage(attacker, defender);
            expect(damage).toBeGreaterThan(0);
            // Add more specific assertions based on the actual formula
          });
        });
        ```
    *   **Mocking:** Use Jest's mocking capabilities (`jest.fn()`, `jest.spyOn()`) to isolate functions. For example, when testing a function in `core.js` that calls a function in `player.js`, we can mock the `player.js` function to ensure we are only testing the logic within `core.js`.

**Priority Test Targets for Phase 1:**
1.  `combat.js`: All damage, accuracy, and effect calculations.
2.  `player.js` / `npc.js`: State changes (taking damage, gaining XP, using items).
3.  `core.js`: Game state transitions (e.g., `startGame`, `enterCombat`).

### Phase 2: Integration and End-to-End (E2E) Testing with Playwright

This phase addresses the browser-dependent code and ensures all modules work together correctly.

**Tooling:**
*   **Playwright:** A modern E2E testing framework from Microsoft.
    *   **Why Playwright?** It runs tests in a real browser (Chromium, Firefox, WebKit), allowing us to test the application exactly as a user would experience it. It can interact with DOM elements, run scripts, and even take screenshots for visual regression testing. This is the best way to validate `ui.js`, canvas rendering in `world.js`, and user flows.

**Implementation Steps:**

1.  **Installation:**
    ```bash
    npm install --save-dev @playwright/test
    npx playwright install # Downloads browser binaries
    ```

2.  **Configuration:**
    *   Playwright comes with a simple setup wizard. It will create a `playwright.config.js` file and an `e2e/` directory for tests.
    *   We will need a way to serve the application locally for Playwright to visit, which can be done with a simple package like `http-server` or by adding a development server command.

3.  **Writing E2E Tests:**
    *   Create `e2e/game.spec.js`.
    *   Tests will simulate user actions and assert the results on the page.
    *   **Example Test Case (Conceptual):**
        ```javascript
        // e2e/game.spec.js
        import { test, expect } from '@playwright/test';

        test.beforeEach(async ({ page }) => {
          // Navigate to the game's URL before each test
          await page.goto('http://localhost:8080'); // Assuming a local server
        });

        test('game loads and player can attack an enemy', async ({ page }) => {
          // 1. Verify the game world is visible
          await expect(page.locator('#game-container')).toBeVisible();

          // 2. Find an enemy and click it to initiate combat (hypothetical UI)
          await page.locator('.enemy').first().click();
          await expect(page.locator('#combat-screen')).toBeVisible();

          // 3. Click the attack button
          const initialEnemyHealth = await page.locator('#enemy-health-bar').getAttribute('value');
          await page.locator('#attack-button').click();

          // 4. Assert that the enemy's health has decreased
          const newEnemyHealth = await page.locator('#enemy-health-bar').getAttribute('value');
          expect(Number(newEnemyHealth)).toBeLessThan(Number(initialEnemyHealth));
        });
        ```

## 3. Summary and Recommendations

| Approach | Tool | Perspective | Pros | Cons |
|---|---|---|---|---|
| **Unit Testing** | **Jest** | Tests individual functions/modules in isolation. | - Fast execution<br>- Pinpoints exact source of bugs<br>- Encourages decoupled code | - Doesn't test integration<br>- Can't verify visual output or real browser behavior |
| **E2E Testing** | **Playwright** | Tests the application from the user's perspective in a real browser. | - High confidence in overall functionality<br>- Tests the integration of all modules<br>- Can catch visual bugs | - Slower execution<br>- More brittle; can fail due to minor UI changes<br>- Harder to debug the root cause |

**Recommended Path Forward:**

1.  **Start with Jest (Phase 1).** Build a solid foundation of unit tests for the core game logic (`combat.js`, `player.js`, etc.). This will provide immediate value by protecting the most complex parts of the codebase from regressions.
2.  **Test UI with JSDOM.** Use the JSDOM environment provided by Jest to write basic tests for `ui.js`. For example, you can test that calling `updateHealthBar(50)` correctly sets the style or value of the corresponding DOM element in the simulated environment.
3.  **Introduce Playwright (Phase 2).** Once the unit test foundation is in place, add Playwright to create a few critical "smoke tests" for the main user journeys:
    *   Does the game load?
    *   Can the player move?
    *   Can the player initiate and complete a combat sequence?
4.  **Expand Coverage.** Gradually expand both unit and E2E test suites as new features are added.

This dual-pronged strategy provides the best of both worlds: the speed and precision of unit tests for core logic, and the confidence of E2E tests for user-facing functionality.
