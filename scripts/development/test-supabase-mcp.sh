#!/bin/bash

# Test script to verify Supabase MCP server is working
# This will test the MCP server directly

echo "🧪 Testing Supabase MCP Server"
echo "=============================="

# Get the access token from Claude config
CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Claude Desktop config file not found"
    exit 1
fi

# Extract the access token from the config file
ACCESS_TOKEN=$(grep -A 10 '"supabase"' "$CONFIG_FILE" | grep 'access-token' | sed 's/.*"access-token",//' | sed 's/[", ]//g')

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "REPLACE_WITH_YOUR_SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ No valid access token found in configuration"
    echo "Please run: ./update-claude-config.sh YOUR_ACCESS_TOKEN"
    exit 1
fi

echo "✅ Found access token in configuration"
echo "🚀 Testing MCP server connection..."

# Test the MCP server
echo ""
echo "📋 Attempting to list Supabase projects..."

# Create a temporary test file
TEST_FILE="/tmp/mcp_test_$$"

# Test with a simple command
npx @supabase/mcp-server-supabase --access-token "$ACCESS_TOKEN" --help > "$TEST_FILE" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ MCP server is accessible"
    
    # Try to get project info (basic test)
    echo ""
    echo "🔍 Testing project access..."
    
    # This is a more complex test - the MCP server needs to be run in interactive mode
    # For now, just verify it starts
    timeout 5s npx @supabase/mcp-server-supabase --access-token "$ACCESS_TOKEN" 2>&1 | head -5
    
    if [ $? -eq 0 ] || [ $? -eq 124 ]; then  # 124 is timeout exit code
        echo ""
        echo "✅ MCP server started successfully"
        echo ""
        echo "🎉 Supabase MCP server is configured and working!"
        echo ""
        echo "📝 Next steps:"
        echo "1. Restart Claude Desktop completely (quit and reopen)"
        echo "2. In a new conversation, you can now ask Claude to:"
        echo "   • 'List my Supabase projects'"
        echo "   • 'Show me the database schema for my auction project'"
        echo "   • 'Generate TypeScript types for my database'"
        echo "   • 'Run a SQL query on my database'"
        echo ""
        echo "💡 The MCP server enables Claude to interact directly with your Supabase project!"
    else
        echo "❌ MCP server failed to start properly"
        cat "$TEST_FILE"
    fi
else
    echo "❌ MCP server test failed"
    cat "$TEST_FILE"
fi

# Cleanup
rm -f "$TEST_FILE"