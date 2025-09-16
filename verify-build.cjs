#!/usr/bin/env node

/**
 * Build Verification Script for Betta Fish RPG
 * 
 * Validates that webpack builds produce working, deployable code.
 * Checks file existence, size limits, syntax, and module presence.
 */

const fs = require('fs')
const path = require('path')

// ANSI color codes for better output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

// Configuration
const config = {
  scriptPath: path.join(__dirname, 'script.js'),
  packagePath: path.join(__dirname, 'package.json'),
  minSize: 50 * 1024, // 50KB minimum (indicates modules are included)
  maxSize: 100 * 1024, // 100KB maximum (performance target)
  requiredModules: [
    'Player', // Player class should be preserved
    'PLAYER_DAMAGE', // Config constants that should be present
    'ENEMY_SCALING', // More config constants
    'BUBBLE_BLAST', // Spell configurations
    'handleGlobalKeyboard', // Key UI method that should be preserved
    'calculateAttackDamage', // Important game logic methods
    'startRandomEncounter' // Combat system methods
  ]
}

let exitCode = 0

/**
 * Print colored status message
 */
function print (message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

/**
 * Print test result with icon
 */
function printResult (test, passed, details = '') {
  const icon = passed ? '✅' : '❌'
  const color = passed ? 'green' : 'red'
  print(`${icon} ${test}`, color)
  if (details) {
    print(`   ${details}`, passed ? 'reset' : 'yellow')
  }
  if (!passed) exitCode = 1
}

/**
 * Format file size for display
 */
function formatSize (bytes) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  return `${kb.toFixed(1)} KB`
}

/**
 * Check if script.js exists and get its stats
 */
function checkFileExists () {
  try {
    if (!fs.existsSync(config.scriptPath)) {
      printResult('Build output exists', false, 'script.js not found')
      return null
    }
    
    const stats = fs.statSync(config.scriptPath)
    printResult('Build output exists', true, `script.js found (${formatSize(stats.size)})`)
    return stats
  } catch (error) {
    printResult('Build output exists', false, `Error reading script.js: ${error.message}`)
    return null
  }
}

/**
 * Check if file size is within acceptable bounds
 */
function checkFileSize (stats) {
  const size = stats.size
  
  // Check minimum size
  if (size < config.minSize) {
    printResult('Minimum size check', false, 
      `File is ${formatSize(size)}, minimum is ${formatSize(config.minSize)}`)
    return false
  } else {
    printResult('Minimum size check', true, 
      `${formatSize(size)} meets minimum ${formatSize(config.minSize)}`)
  }
  
  // Check maximum size
  if (size > config.maxSize) {
    printResult('Maximum size check', false, 
      `File is ${formatSize(size)}, maximum is ${formatSize(config.maxSize)}`)
    return false
  } else {
    printResult('Maximum size check', true, 
      `${formatSize(size)} under maximum ${formatSize(config.maxSize)}`)
  }
  
  return true
}

/**
 * Check if the build output is syntactically valid JavaScript
 */
function checkSyntax () {
  try {
    const content = fs.readFileSync(config.scriptPath, 'utf8')
    
    // Basic syntax check - try to parse as JavaScript
    // We don't actually execute it, just check if it parses
    new Function(content) // eslint-disable-line no-new-func
    
    printResult('JavaScript syntax check', true, 'Valid JavaScript syntax')
    return content
  } catch (error) {
    printResult('JavaScript syntax check', false, `Syntax error: ${error.message}`)
    return null
  }
}

/**
 * Check if required game modules are present in the build
 */
function checkModules (content) {
  const missingModules = []
  const foundModules = []
  
  for (const module of config.requiredModules) {
    // Check for class definitions or references
    const patterns = [
      new RegExp(`class\\s+${module}\\s*\\{`), // class definition
      new RegExp(`export\\s+class\\s+${module}`), // export class
      new RegExp(`${module}\\s*=\\s*class`), // assignment
      new RegExp(`${module}`) // general reference
    ]
    
    const found = patterns.some(pattern => pattern.test(content))
    
    if (found) {
      foundModules.push(module)
    } else {
      missingModules.push(module)
    }
  }
  
  if (missingModules.length === 0) {
    printResult('Required modules check', true, 
      `All ${config.requiredModules.length} modules found: ${foundModules.join(', ')}`)
    return true
  } else {
    printResult('Required modules check', false, 
      `Missing modules: ${missingModules.join(', ')}`)
    return false
  }
}

/**
 * Check version consistency between package.json and build
 */
function checkVersion (content) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(config.packagePath, 'utf8'))
    const packageVersion = packageJson.version
    
    // Look for version string in the build output
    const versionPattern = new RegExp(`["']${packageVersion}["']`)
    const hasVersion = versionPattern.test(content)
    
    if (hasVersion) {
      printResult('Version consistency', true, `Version ${packageVersion} found in build`)
    } else {
      printResult('Version consistency', false, `Version ${packageVersion} not found in build`)
    }
    
    return hasVersion
  } catch (error) {
    printResult('Version consistency', false, `Error checking version: ${error.message}`)
    return false
  }
}

/**
 * Main verification function
 */
function verifyBuild () {
  print(`${colors.bold}🔍 Betta Fish RPG Build Verification${colors.reset}\n`)
  
  // Check file existence
  const stats = checkFileExists()
  if (!stats) return
  
  // Check file size
  checkFileSize(stats)
  
  // Check syntax
  const content = checkSyntax()
  if (!content) return
  
  // Check modules
  checkModules(content)
  
  // Check version
  checkVersion(content)
  
  // Final result
  print(`\n${colors.bold}📋 Verification Summary${colors.reset}`)
  if (exitCode === 0) {
    print('🎉 Build verification PASSED - Ready for deployment!', 'green')
  } else {
    print('💥 Build verification FAILED - Do not deploy!', 'red')
  }
}

// Run verification
verifyBuild()
process.exit(exitCode)