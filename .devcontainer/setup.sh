#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Installing Claude Code..."
npm install -g @anthropic-ai/claude-code --yes

echo "🎭 Installing Playwright core..."
npm install -g @playwright/test --yes

# Where Playwright stores downloaded browsers
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/home/vscode/.cache/ms-playwright}"
mkdir -p "$PLAYWRIGHT_BROWSERS_PATH"

echo "📥 Installing Chrome for Testing (plus OS deps)..."
# NOTE: NOT chromium. We intentionally install 'chrome' to satisfy MCP's default.
npx playwright install --with-deps chrome

# Resolve the actual Chrome binary Playwright just downloaded.
# It lives under PLAYWRIGHT_BROWSERS_PATH; grab the first match.
CHROME_BIN="$(find "$PLAYWRIGHT_BROWSERS_PATH" -type f -path '*/chrome-linux*/chrome' | head -n1 || true)"

if [[ -z "${CHROME_BIN}" || ! -x "${CHROME_BIN}" ]]; then
  echo "❌ Could not locate Chrome for Testing binary under $PLAYWRIGHT_BROWSERS_PATH"
  echo "Contents of browsers dir for debugging:"
  find "$PLAYWRIGHT_BROWSERS_PATH" -maxdepth 3 -type f | sed 's#^#  #'
  exit 1
fi

echo "✅ Chrome binary: ${CHROME_BIN}"

echo "🧹 Removing any old MCP 'playwright' entries..."
claude mcp remove playwright --scope user || true
claude mcp remove playwright --scope project || true
rm -f .mcp.json

echo "📝 Writing Playwright MCP config (explicit executablePath, headless)..."
cat > .playwright-mcp.json <<JSON
{
  "browser": {
    "browserName": "chromium",
    "isolated": true,
    "launchOptions": {
      "headless": true,
      "executablePath": "${CHROME_BIN}",
      "args": ["--no-sandbox", "--disable-dev-shm-usage"]
    }
  }
}
JSON

echo "🔌 Registering MCP server (ensure same env at runtime)..."
# Use env so the server process runs with the same HOME and browsers path.
claude mcp add playwright --scope project -- \
  env HOME=/home/vscode PLAYWRIGHT_BROWSERS_PATH="$PLAYWRIGHT_BROWSERS_PATH" \
  npx @playwright/mcp@latest --config /workspaces/bettarpg/.playwright-mcp.json

echo "✅ Setup complete."
