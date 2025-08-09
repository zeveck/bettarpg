# Zone System Assessment - Betta RPG

## Current System Overview

The game uses a **30x30 tile map** with the village center at coordinates (15, 15). However, there are **two conflicting zone systems** operating simultaneously:

### 1. Distance-Based Zones (from village center)
- **Safe Zone**: Distance ≤ 17 tiles → spawns levels 1-2
- **Medium Zone**: Distance ≤ 25 tiles → spawns levels 2-4  
- **Dangerous Zone**: Distance > 25 tiles → spawns levels 3-5
- **Extreme Zone**: (supposedly at distance 30) → spawns level 10

### 2. Percentage-Based Edge Zone
- **Edge Zone**: Outer 15% of map boundaries
- Calculated as: x ≤ 4.5 OR x ≥ 25.5 OR y ≤ 4.5 OR y ≥ 25.5
- **Always spawns level 10 Prehistoric Gar** (until defeated)

## The Problem

### Mathematical Reality Check
The maximum possible distance from village center (15,15) to any map corner is:
- Distance to corner (0,0) = √((15-0)² + (15-0)²) = √450 ≈ **21.2 tiles**
- Distance to edge midpoints = 15 tiles
- Distance to edge zone boundary (4.5, y) = 10.5 tiles minimum

### Actual Zone Coverage
Based on the math and your screenshots:

1. **Edge Zone (Dark Water)**: 
   - Starts at coordinates ≤4.5 or ≥25.5 (15% boundaries)
   - Distance from center: **10.5 to 19.1 tiles**
   - **This overlaps with the Safe Zone!**

2. **Accessible Non-Edge Area**:
   - Coordinates between 5-25 on both axes
   - Maximum distance from center: ~14.1 tiles (to corners like (5,5))
   - **This entire area falls within the Safe Zone (≤17 distance)**

3. **Unreachable Zones**:
   - **Medium Zone** (17-25 distance): Mostly unreachable! Only tiny corners exist
   - **Dangerous Zone** (>25 distance): **Completely impossible to reach**

## Visual vs Mechanical Mismatch

The visual presentation suggests three water depths:
1. Light blue water (shallow) - appears to be the central area
2. Medium blue water - middle ring
3. Dark blue water - outer edge (where Gar spawns)

But the mechanics don't align with these visuals at all!

## Root Causes

1. **Map Too Small**: A 30x30 map with center at (15,15) gives maximum radius of ~21 tiles, making distance thresholds of 25+ impossible

2. **Conflicting Zone Systems**: The percentage-based edge zone (for Gar) doesn't align with distance-based zones (for regular enemies)

3. **Config Values Don't Match Map Size**: 
   - Safe radius 17 covers almost the entire accessible map
   - Medium radius 25 exceeds maximum possible distance
   - Dangerous zone threshold >25 is literally unreachable

## Proposed Solutions

### Solution 1: Simplified Three-Zone System (Minimal Changes)
Align the zones with what's actually achievable on a 30x30 map:

```javascript
DANGER_ZONES: {
    SAFE_RADIUS: 8,         // Inner third of accessible area
    DANGEROUS_RADIUS: 14,   // Middle third  
    // Edge zone remains percentage-based (outer 15%)
    LEVEL_SCALING: {
        SAFE: { min: 1, max: 2 },      // Distance ≤8
        DANGEROUS: { min: 3, max: 5 },  // Distance 8-14
        EXTREME: { min: 10, max: 10 }   // Edge zone (percentage-based)
    }
}
```

**Pros**: 
- Works with existing map size
- Three distinct, reachable zones
- Matches visual water depth layers

**Cons**: 
- Loses the Medium zone (levels 2-4)
- Still has two different zone calculation methods

### Solution 2: Unified Distance-Based System (Better Architecture)
Convert everything to distance-based zones and eliminate the percentage system:

```javascript
DANGER_ZONES: {
    SAFE_RADIUS: 7,          // Center area
    MEDIUM_RADIUS: 12,       // Middle ring
    DANGEROUS_RADIUS: 17,    // Outer ring
    EXTREME_RADIUS: 19,      // Edge areas
    LEVEL_SCALING: {
        SAFE: { min: 1, max: 2 },       // Distance ≤7
        MEDIUM: { min: 2, max: 4 },     // Distance 7-12
        DANGEROUS: { min: 3, max: 5 },  // Distance 12-17
        EXTREME: { min: 10, max: 10 }   // Distance >17
    }
}
```

**Pros**:
- Single, consistent zone calculation method
- All zones are reachable
- Better progression curve
- Could add visual indicators (colored water rings) at these exact distances

**Cons**:
- Requires changing the edge zone detection logic
- Extreme zone would be a thin outer ring (might feel cramped)

## Critical Issue: Visual Water Depths Don't Match ANY Zone System

The current visual water implementation (`src/ui.js:1822-1852`) uses **hardcoded CSS percentages**:
- **Light water** (water-tile2.png): 30-70% area (center 40% of map)
- **Medium water** (water-tile-darkish.png): 15-85% area (middle 70% of map)  
- **Dark water** (water-tile-dark.png): Outer 15% (edges)

These percentages translate to coordinates:
- Light: x,y between 9-21 (40% of 30 tiles)
- Medium: x,y between 4.5-25.5 (70% of 30 tiles)
- Dark: x,y ≤4.5 or ≥25.5 (outer 15%)

**The problem**: These visual boundaries don't align with either solution's zones!

### Solution 2 Updated: Unified Distance System with Visual Alignment

To make Solution 2 work, we need to **dynamically generate water depth visuals** based on actual distance calculations:

```javascript
DANGER_ZONES: {
    SAFE_RADIUS: 7,          // Center area - Light water
    MEDIUM_RADIUS: 12,       // Middle ring - Medium water  
    DANGEROUS_RADIUS: 17,    // Outer ring - Darkish water
    EXTREME_RADIUS: 19,      // Edge areas - Dark water
    LEVEL_SCALING: {
        SAFE: { min: 1, max: 2 },       // Distance ≤7
        MEDIUM: { min: 2, max: 4 },     // Distance 7-12
        DANGEROUS: { min: 3, max: 5 },  // Distance 12-17
        EXTREME: { min: 10, max: 10 }   // Distance >17
    }
}
```

**Required Visual Changes**:
1. Replace the CSS percentage-based water layers with distance-based circles
2. Calculate the visual boundaries as percentages from actual distance radii:
   - Safe zone visual: Circle with radius (7/15) × 50% = 23.3% of container
   - Medium zone visual: Circle with radius (12/15) × 50% = 40% of container
   - Dangerous zone visual: Circle with radius (17/15) × 50% = 56.7% of container
   - Dark water: Everything beyond

**Implementation approach**:
```javascript
// In showWorldWaterDepths():
const centerPercent = 50; // Village at center
const mapRadius = 15; // Distance from center to edge

// Convert distance radii to visual percentages
const safeRadiusPercent = (7 / mapRadius) * 50;
const mediumRadiusPercent = (12 / mapRadius) * 50;
const dangerousRadiusPercent = (17 / mapRadius) * 50;

// Generate concentric water depth circles
// Using radial gradients or multiple overlapping divs
```

## Recommendation

I recommend **Solution 2 with Visual Realignment** because:

1. **Consistency**: Single distance-based calculation for both mechanics and visuals
2. **Visual Honesty**: Water depths will actually match the danger levels
3. **Player Understanding**: What you see is what you get - dark water = dangerous
4. **Maintainability**: Zones and visuals updated from one config location
5. **Progressive Difficulty**: All four difficulty tiers are accessible

### Why Visual Alignment Matters

Currently, players see water get darker but it means nothing mechanically. With Solution 2:
- **Light blue water** = Safe Zone (levels 1-2) at distance ≤7
- **Medium blue water** = Medium Zone (levels 2-4) at distance 7-12
- **Dark blue water** = Dangerous Zone (levels 3-5) at distance 12-17
- **Very dark water** = Extreme Zone (level 10) at distance >17

This creates **trust between visuals and mechanics** - essential for good game design.

## Alternative: Keep Current Visuals, Adjust Zones

If changing the visual system is too complex, we could instead **match the zones to existing visual boundaries**:

```javascript
// Match zones to current CSS percentages
DANGER_ZONES: {
    SAFE_RADIUS: 9,          // Matches inner 40% (light water)
    MEDIUM_RADIUS: 21,       // Matches 70% boundary (medium water)
    // Dark water at 15% boundary = coordinates ≤4.5 or ≥25.5
    LEVEL_SCALING: {
        SAFE: { min: 1, max: 3 },       // Light water
        MEDIUM: { min: 3, max: 5 },     // Medium water
        EXTREME: { min: 10, max: 10 }   // Dark water (edge)
    }
}
```

This is simpler to implement but loses the 4-tier progression.

## Solution 3: Tile-Based Visual Rendering with Zone Awareness

Instead of CSS percentage overlays, **render each tile individually** with the appropriate water texture based on its actual distance from village:

### How It Would Work

1. **Calculate once per game load**:
   ```javascript
   for (let y = 0; y < 30; y++) {
       for (let x = 0; x < 30; x++) {
           const distance = getDistanceFromVillage(x, y);
           let tileType;
           
           if (distance <= 7) tileType = 'water-tile2.png';        // Light (Safe)
           else if (distance <= 12) tileType = 'water-tile.png';   // Medium (Medium)
           else if (distance <= 17) tileType = 'water-tile-darkish.png'; // Dark (Dangerous)
           else tileType = 'water-tile-dark.png';                  // Very Dark (Extreme)
           
           // Create tile element at position (x,y) with appropriate texture
       }
   }
   ```

2. **Visual result**: Natural-looking concentric water depths that **exactly match** the mechanical zones
   - Not perfect circles (good! more organic)
   - Square tiles create a nice "Manhattan distance" look
   - Corners naturally become darker (matching the actual distance math)

### Pros
- **Perfect visual-mechanical alignment**: Each tile's appearance matches its actual danger level
- **Maintains current aesthetic**: Still uses the same water tile textures, just placed more precisely
- **No circles**: Keeps the rectangular tile-based look you prefer
- **Clear zone boundaries**: Players can see exactly where zones change
- **Scalable**: Works at any screen size (tiles just scale)

### Cons  
- **Performance**: Rendering 900 individual tiles vs 3 CSS layers
- **Complexity**: More code to manage tile grid
- **Resize handling**: Need to recalculate tile sizes on window resize
- **Memory usage**: 900 DOM elements vs 3 CSS pseudo-elements

### Optimization Options

1. **Canvas rendering**: Draw tiles to a canvas instead of DOM elements (better performance)
2. **Chunk system**: Group 3x3 or 5x5 tiles that share the same texture
3. **Pre-rendered backgrounds**: Generate the full map as an image server-side
4. **CSS Grid**: Use CSS Grid with data attributes for water depth
5. **Background image generation**: Create a single composite background image dynamically

### Detailed Performance Analysis for Solution 3

#### DOM Element Approach (Worst Case)
- **30x30**: 900 `<div>` elements with background images
- **20x20**: 400 `<div>` elements 
- **Memory**: ~50-100KB for DOM structure
- **Render time**: 10-50ms on modern browsers
- **Acceptable for**: Desktop, modern mobile
- **Issues**: Can be sluggish on older devices

#### CSS Grid Approach (Better)
```css
.world-grid {
    display: grid;
    grid-template-columns: repeat(30, 1fr);
    grid-template-rows: repeat(30, 1fr);
}
.tile { background-image: var(--tile-texture); }
```
- **Pros**: Browser-optimized layout, easier responsive handling
- **Cons**: Still 900 DOM elements
- **Performance**: ~20% better than absolute positioning

#### Canvas Rendering (Best Performance)
```javascript
// Draw all 900 tiles to a single canvas
const canvas = document.getElementById('world-canvas');
const ctx = canvas.getContext('2d');

for (let y = 0; y < 30; y++) {
    for (let x = 0; x < 30; x++) {
        const tileTexture = getTileForDistance(x, y);
        ctx.drawImage(tileTexture, x * tileSize, y * tileSize);
    }
}
```

**Pros:**
- Single DOM element, hardware accelerated
- Smooth scaling and crisp pixel art rendering
- Excellent performance (renders in ~5ms)
- Can add tile-based effects, animations, transitions
- Easy to implement dynamic lighting, weather effects
- Perfect for future features like fog of war, tile highlighting

**Cons:**
- **Layer management complexity**: Player, rice paddies, village need to be separate layers
- **Event handling**: Need to translate mouse clicks to tile coordinates manually
- **Responsive design**: Requires manual handling of canvas scaling/resizing
- **Accessibility**: Screen readers can't interpret canvas content (need aria-labels)
- **CSS integration**: Can't use CSS for styling overlays as easily
- **Browser compatibility**: Very old browsers might have issues (IE11-)
- **Memory usage**: Large canvases use more GPU memory than DOM elements
- **Debugging**: Harder to inspect individual tiles in dev tools

#### Pre-rendered Composite (Simplest)
Generate a single 960x960px background image with all tiles:
```javascript
// At game start, create composite background
const compositeCanvas = document.createElement('canvas');
// ... render all tiles to canvas
const backgroundUrl = compositeCanvas.toDataURL();
document.getElementById('world-map').style.backgroundImage = `url(${backgroundUrl})`;
```
- **Pros**: Zero ongoing performance cost, works like current CSS system
- **Cons**: Fixed resolution, harder to make responsive
- **Best for**: Your use case where the map doesn't change during play

### Implementation Complexity Estimates

#### Low Complexity: Pre-rendered Background
```javascript
// ~50 lines of code
function generateWorldBackground() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const distance = getDistanceFromVillage(x, y);
            const tileType = getTileTypeForDistance(distance);
            drawTileAt(ctx, x, y, tileType);
        }
    }
    
    return canvas.toDataURL();
}
```

#### Medium Complexity: CSS Grid
```javascript
// ~100-150 lines
function createTileGrid() {
    const container = document.getElementById('world-map');
    container.className = 'world-grid';
    
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.style.backgroundImage = getTileTexture(i);
        container.appendChild(tile);
    }
}
```

#### High Complexity: Canvas with Overlays
```javascript
// ~200-300 lines
// Need to handle canvas rendering, player positioning, rice paddies, etc.
```

### Real-World Performance Testing

Modern browser benchmarks for tile rendering:
- **400 tiles (20x20)**: Negligible performance impact on any device from 2015+
- **900 tiles (30x30)**: Fine on desktop, slight lag on older mobile
- **Canvas approach**: Handles 10,000+ tiles smoothly

### Recommendation for Solution 3

**Start with Pre-rendered Background approach:**
1. Generate composite background at game load
2. Use it exactly like current CSS system
3. Perfect visual-mechanical alignment
4. Minimal performance impact
5. Easy to implement (~1-2 hours work)

**If that works well, consider upgrading to:**
- CSS Grid for easier maintenance
- Canvas for maximum performance and effects

**Grid size recommendation for Solution 3:**
- **20x20** if you want to be conservative (400 tiles, definitely no performance issues)
- **30x30** if you like the current exploration space (900 tiles, probably fine)
- **25x25** as a compromise (625 tiles, good balance)

### Canvas Rendering Specific Considerations for Your Game

**Your current overlay elements that would need special handling:**
1. **Player sprite**: Currently positioned with CSS transforms
2. **Rice paddy tufts**: Scattered decorative elements
3. **Village building**: Central sprite
4. **UI elements**: Movement buttons, stats panel

**Solutions for overlay complexity:**
1. **Layered approach**: Canvas background + DOM overlays (recommended)
2. **All-canvas**: Render everything to canvas (more work)
3. **Hybrid**: Canvas tiles + CSS/DOM for interactive elements

**Canvas-specific challenges for your game:**
- **Player movement animation**: Would need to redraw canvas or use separate layer
- **Mouse interaction**: Rice paddy clicking would need coordinate translation
- **Screen scaling**: Canvas needs explicit resize handling vs CSS auto-scaling
- **HiDPI displays**: Need devicePixelRatio handling for crisp rendering

**Why canvas might NOT be worth it for you:**
- Your current CSS system already works well
- You're not doing real-time tile updates or animations
- The visual quality difference would be minimal
- Added complexity for marginal benefit

**When canvas WOULD be worth it:**
- If you want to add tile-based effects later (water ripples, shadows, etc.)
- If you plan dynamic tile changes (seasonal changes, day/night, etc.)
- If you want perfect pixel-level control over tile positioning
- If you need to support very large maps (100x100+) efficiently

## Comparison of All Three Solutions

| Aspect | Solution 1: Simple 3-Zone | Solution 2: Distance Circles | Solution 3: Tile Rendering |
|--------|---------------------------|------------------------------|----------------------------|
| **Visual Style** | Keeps current rectangles | Changes to circles | Keeps rectangles, more precise |
| **Implementation** | Easy - just config changes | Medium - new CSS generation | Hard - full rendering rewrite |
| **Performance** | Best (no changes) | Good (just CSS) | Worst (many elements) or Medium (canvas) |
| **Visual-Mechanical Match** | Poor (arbitrary) | Perfect (generated) | Perfect (calculated per tile) |
| **Zone Clarity** | Unclear boundaries | Very clear circles | Clear tile-by-tile |
| **Resize Handling** | Perfect (CSS percentages) | Good (percentages) | Needs recalculation |
| **Number of Zones** | 3 only | 4 zones | 4 zones |
| **Maintenance** | Easy | Medium | Complex |

## Final Recommendation: Align Zones to Water Colors

Since the water colors ARE the visual cues, we need to make the mechanical zones match exactly what players see.

### Current Visual Water Boundaries (from CSS)

The CSS in `src/ui.js:1822-1852` creates three water layers:

1. **Light Blue Water** (water-tile2.png):
   - CSS: 30% to 70% (center 40% square)
   - Coordinates: x,y from 9 to 21
   - Distance from center: 0 to ~8.5 tiles

2. **Medium Blue Water** (water-tile-darkish.png):  
   - CSS: 15% to 85% (middle 70% square)
   - Coordinates: x,y from 4.5 to 25.5
   - Distance from center: ~8.5 to ~14.8 tiles

3. **Dark Blue Water** (water-tile-dark.png):
   - CSS: 0% to 15% and 85% to 100% (outer edges)
   - Coordinates: x,y ≤4.5 or ≥25.5
   - Distance from center: ~14.8 to ~21.2 tiles

### Proposed Zone Configuration

To match these visual boundaries exactly:

```javascript
DANGER_ZONES: {
    // Use coordinate-based boundaries to match CSS percentages exactly
    SAFE_BOUNDARY: 9,        // Coordinates 9-21 (light water)
    MEDIUM_BOUNDARY: 4.5,    // Coordinates 4.5-25.5 (medium water)
    
    // Alternative: Use distance-based with values that approximate the visuals
    SAFE_RADIUS: 8.5,        // Light water area
    DANGEROUS_RADIUS: 14.8,  // Medium water area
    // Dark water is everything beyond
    
    LEVEL_SCALING: {
        SAFE: { min: 1, max: 2 },       // Light blue water
        DANGEROUS: { min: 3, max: 5 },  // Medium blue water  
        EXTREME: { min: 10, max: 10 }   // Dark blue water (Gar zone)
    }
}
```

### Implementation Options

#### Option A: Coordinate-Based Zones (Matches CSS Exactly)
```javascript
function getZoneType(x, y) {
    // Check if in innermost light water (30-70% = coords 9-21)
    if (x >= 9 && x <= 21 && y >= 9 && y <= 21) {
        return 'SAFE';  // Light blue water
    }
    // Check if in dark water edges (outer 15%)
    else if (x <= 4.5 || x >= 25.5 || y <= 4.5 || y >= 25.5) {
        return 'EXTREME';  // Dark blue water
    }
    // Otherwise in medium water
    else {
        return 'DANGEROUS';  // Medium blue water
    }
}
```

#### Option B: Distance-Based Zones (Cleaner Code)
```javascript
function getZoneType(x, y) {
    const distance = getDistanceFromVillage(x, y);
    
    if (distance <= 8.5) {
        return 'SAFE';      // Light blue water
    } else if (distance <= 14.8) {
        return 'DANGEROUS'; // Medium blue water
    } else {
        return 'EXTREME';   // Dark blue water
    }
}
```

### Visual-Mechanical Alignment Result

With either implementation:
- **Light blue water** → Always spawns level 1-2 enemies (Safe)
- **Medium blue water** → Always spawns level 3-5 enemies (Dangerous)
- **Dark blue water** → Always spawns level 10 Gar until defeated (Extreme)

Players will learn: "Darker water = more dangerous enemies" - a perfect visual language.

### Trade-offs

**Pros:**
- Water color perfectly predicts enemy difficulty
- No visual changes needed
- Simple 3-zone system is easy to understand
- CSS and mechanics finally align

**Cons:**
- Lose the 4-tier progression (no medium zone with levels 2-4)
- Safe zone is relatively large (center 40% of map)
- Jump from level 2 to level 3-5 might feel abrupt

### Mitigation Strategies

To address the cons:
1. **Adjust level scaling within zones**: 
   - Safe could spawn 1-3 instead of 1-2
   - Dangerous could spawn 3-6 instead of 3-5
   
2. **Add sub-zones within water colors**:
   - Inner safe zone (distance ≤4): Level 1
   - Outer safe zone (distance 4-8.5): Level 2-3
   - But this adds complexity without visual distinction

3. **Accept the 3-zone simplicity**:
   - Many successful games use 3 difficulty tiers
   - Clear visual communication > complex progression

## Grid Size Analysis: 30x30 vs 20x20

### Current 30x30 Grid
- **900 tiles** total (if rendering individually)
- Village at (15,15), max distance to corner = 21.2 tiles
- Allows for distance-based zones up to ~21 tiles

### Alternative: 20x20 Grid
- **400 tiles** total - 56% fewer tiles!
- Village at (10,10), max distance to corner = 14.1 tiles
- More manageable for tile-based rendering

### Impact of 20x20 Grid

**Pros:**
- **Performance**: 400 tiles is much more reasonable than 900
- **Simplicity**: Easier to work with round numbers (center at 10,10)
- **Visual clarity**: Fewer tiles means each can be slightly larger
- **Memory**: Significantly less DOM elements or canvas operations

**Cons:**
- **Reduced exploration space**: 44% less area to explore
- **Tighter zones**: Maximum distance only 14.1 tiles
- **Less room for variance**: Fewer unique positions for encounters
- **Existing coordinate system**: Would need to update village center, spawn points, etc.

### Revised Zone Boundaries for 20x20

With a 20x20 grid and village at (10,10):

```javascript
// For 20x20 grid
DANGER_ZONES: {
    SAFE_RADIUS: 5,          // Light water (distance ≤5)
    DANGEROUS_RADIUS: 9,     // Medium water (distance 5-9)
    // Dark water (distance >9, up to max 14.1)
    
    LEVEL_SCALING: {
        SAFE: { min: 1, max: 2 },
        DANGEROUS: { min: 3, max: 5 },
        EXTREME: { min: 10, max: 10 }
    }
}
```

### Visual CSS Adjustments for 20x20

The CSS percentages would need slight adjustment:
- **Light water**: 25% to 75% (center 50% = tiles 5-15)
- **Medium water**: 10% to 90% (middle 80% = tiles 2-18)
- **Dark water**: Outer 10% (tiles 0-2 and 18-20)

### Is 20x20 "Bad"?

**Not at all!** Many successful games use smaller grids:
- Original Pokemon Red/Blue: Town maps were often 20x20 or smaller
- Classic RPGs: Many used 16x16 or 24x24 for dungeons
- Tactics games: Often 10x10 to 20x20 for battlefields

**20x20 is actually quite reasonable** for a browser-based RPG, especially considering:
1. The entire map is visible at once (no scrolling)
2. Movement is one tile at a time
3. The game focuses on encounters, not exploration minutiae
4. Simpler is often better for indie games

### Recommendation for Grid Size

**Stick with 30x30 for now** because:
1. All current content is balanced around it
2. The CSS visual system already works with it
3. We're not actually rendering individual tiles (using CSS layers)

**But if implementing tile-based rendering (Solution 3):**
- 20x20 would be perfectly fine
- Could even consider 25x25 as a middle ground (625 tiles)
- The smaller grid would make tile rendering much more viable

The grid size isn't sacred - it's just a coordinate system. What matters is that zones, visuals, and gameplay align properly.

## Additional Considerations

### Screen Size Responsiveness
The current system displays the entire map scaled to fit the browser window. This means:
- On small screens, tiles appear tiny
- On large screens, tiles appear huge
- But the gameplay area remains the same regardless

Consider implementing a **viewport system** where only a portion of the map is visible, allowing for:
- Larger effective world (50x50 or 100x100)
- Consistent tile size across devices
- True exploration feeling
- Room for more zone variety

### Visual Water Depth Indicators
Currently, the water depth CSS seems to be decorative rather than functional. We should:
- Make water color gradients match exact zone boundaries
- Add visual boundary markers (like seaweed walls) at zone transitions
- Show current zone name in UI ("Safe Waters", "Dangerous Depths", etc.)

## Testing Checklist
After implementing either solution:
- [ ] Verify all zones are reachable
- [ ] Confirm enemy levels match zone specifications  
- [ ] Check that visual water matches mechanical zones
- [ ] Test Gar spawning in appropriate zone only
- [ ] Validate progression feels balanced
- [ ] Ensure zone indicators are clear to players