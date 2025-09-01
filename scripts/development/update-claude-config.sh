#!/bin/bash

# Script to update Claude Desktop configuration with your Supabase access token
# Usage: ./update-claude-config.sh YOUR_ACCESS_TOKEN

CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

if [ $# -eq 0 ]; then
    echo "❌ Error: No access token provided"
    echo ""
    echo "Usage: $0 YOUR_ACCESS_TOKEN"
    echo ""
    echo "To get your access token:"
    echo "1. Visit: https://supabase.com/dashboard/account/tokens"
    echo "2. Click 'Generate New Token'"
    echo "3. Copy the token and run this script with it"
    echo ""
    echo "Example: $0 sbp_1234567890abcdef..."
    exit 1
fi

ACCESS_TOKEN=$1

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Error: Claude Desktop config file not found at:"
    echo "$CONFIG_FILE"
    echo ""
    echo "Make sure Claude Desktop is installed and has been run at least once."
    exit 1
fi

echo "🔧 Updating Claude Desktop configuration..."
echo "📍 Config file: $CONFIG_FILE"

# Create backup
cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
echo "💾 Backup created"

# Replace the placeholder with the actual token
if grep -q "REPLACE_WITH_YOUR_SUPABASE_ACCESS_TOKEN" "$CONFIG_FILE"; then
    sed -i.tmp "s/REPLACE_WITH_YOUR_SUPABASE_ACCESS_TOKEN/$ACCESS_TOKEN/g" "$CONFIG_FILE"
    rm "$CONFIG_FILE.tmp"
    echo "✅ Successfully updated configuration with your access token"
else
    echo "⚠️  Warning: Placeholder not found. The token might already be set."
    echo "Current configuration:"
    cat "$CONFIG_FILE"
fi

echo ""
echo "🎉 Configuration complete!"
echo ""
echo "Next steps:"
echo "1. Restart Claude Desktop completely (quit and reopen)"
echo "2. The Supabase MCP server will be available in new conversations"
echo "3. You can now ask Claude to interact with your Supabase database"
echo ""
echo "Test it by asking Claude: 'List my Supabase projects' or 'Show me the database schema'"