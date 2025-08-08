import fs from 'fs';
import path from 'path';

const modules = [
    'src/config.js',
    'src/audio.js',
    'src/player.js',
    'src/npc.js', 
    'src/dialog.js',
    'src/combat.js',
    'src/world.js',
    'src/ui.js',
    'src/core.js'
];

let combined = '// Betta Fish RPG v0.4 - Generated from modules\n\n';

modules.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const moduleName = path.basename(file, '.js').toUpperCase();
    
    combined += `// === ${moduleName} MODULE ===\n`;
    // Strip export statements for concatenation
    const strippedContent = content
        .replace(/^export class /gm, 'class ')
        .replace(/^export function /gm, 'function ')
        .replace(/^export const /gm, 'const ');
    
    combined += strippedContent + '\n\n';
});

// Add initialization
combined += '// === INITIALIZATION ===\n';
combined += 'let game;\n';
combined += 'document.addEventListener("DOMContentLoaded", () => {\n';
combined += '    game = new BettaRPG();\n';
combined += '});\n';

fs.writeFileSync('script.js', combined);
console.log('✅ Built script.js from modules');