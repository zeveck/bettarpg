#!/bin/bash
set -e

echo "🔧 Installing Claude Code..."
npm install -g @anthropic-ai/claude-code --yes

echo "📦 Installing Playwright package..."
npm install -g @playwright/test --yes

echo "🎭 Installing Playwright browsers..."
npx playwright install --with-deps chromium

echo "📦 Setting up MCP servers..."
# Clean slate approach - remove any existing config
rm -f .mcp.json

# Now add servers fresh
claude mcp add playwright --scope project npx @playwright/mcp@latest
claude mcp add context7 --scope project npx @upstash/context7-mcp@latest

echo "✅ Setup complete!"
