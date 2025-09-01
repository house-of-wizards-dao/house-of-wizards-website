# Supabase MCP Server Setup Guide

## What is Supabase MCP?

The Supabase MCP (Model Context Protocol) server allows AI assistants like Claude Desktop to interact directly with your Supabase projects. It provides over 20 tools for database management, migrations, and project configuration.

## Installation Status

✅ **Installed**: `@supabase/mcp-server-supabase@0.4.5`

## Configuration Steps

### 1. Create a Supabase Personal Access Token

1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate New Token"
3. Give it a descriptive name (e.g., "MCP Server")
4. Copy the token (you won't be able to see it again)

### 2. Configure Claude Desktop (if using Claude Desktop app)

Add to your Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "YOUR_PERSONAL_ACCESS_TOKEN"
      ]
    }
  }
}
```

### 3. Environment Variables (Alternative Setup)

Add to your `.env.local`:
```bash
SUPABASE_ACCESS_TOKEN=your_personal_access_token_here
```

## Available MCP Tools

Once configured, the MCP server provides these tools:

### Database Operations
- `list_projects` - List all Supabase projects
- `get_project` - Get details about a specific project
- `execute_sql` - Run SQL queries
- `get_schema` - Retrieve database schema
- `create_table` - Create new tables
- `alter_table` - Modify existing tables
- `drop_table` - Delete tables

### Migration Tools
- `create_migration` - Generate migration files
- `apply_migration` - Apply migrations
- `list_migrations` - View migration history

### Project Management
- `create_project` - Create new Supabase projects
- `delete_project` - Delete projects
- `pause_project` - Pause project
- `resume_project` - Resume project

### Development Tools
- `generate_types` - Generate TypeScript types from schema
- `get_logs` - Retrieve project logs
- `create_branch` - Create database branches

## Using MCP with this Project

### Current Project Details
- **Project URL**: `https://gptihsbiexsdxpkxkkwy.supabase.co`
- **Database**: PostgreSQL with auction system schema
- **Storage Buckets**: files, avatars, proposals, talent-avatars

### Example Commands

1. **Check database schema**:
```javascript
// MCP will execute this through the server
mcp.execute_sql({
  query: "SELECT * FROM information_schema.tables WHERE table_schema = 'public'"
})
```

2. **Generate TypeScript types**:
```javascript
mcp.generate_types({
  project_id: "gptihsbiexsdxpkxkkwy"
})
```

3. **Create a migration**:
```javascript
mcp.create_migration({
  name: "add_auction_features",
  sql: "ALTER TABLE auctions ADD COLUMN featured BOOLEAN DEFAULT false;"
})
```

## Testing the MCP Server

Run this command to test the connection:
```bash
npx @supabase/mcp-server-supabase --access-token YOUR_TOKEN --test
```

## Security Notes

- **Never commit** your personal access token to version control
- Store tokens in environment variables or secure credential managers
- Use project-specific tokens with minimal required permissions
- Rotate tokens regularly

## Troubleshooting

### Common Issues

1. **Token not working**: Ensure the token has the necessary permissions
2. **Connection errors**: Check your internet connection and Supabase service status
3. **Command not found**: Ensure `@supabase/mcp-server-supabase` is installed globally

### Debug Mode

Run with debug output:
```bash
DEBUG=* npx @supabase/mcp-server-supabase --access-token YOUR_TOKEN
```

## Resources

- [MCP Documentation](https://modelcontextprotocol.io/docs)
- [Supabase MCP GitHub](https://github.com/supabase/mcp-server)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Blog Post](https://supabase.com/blog/mcp-server)

## Next Steps

1. Create your personal access token
2. Configure your MCP client (Claude Desktop, Cursor, etc.)
3. Test the connection
4. Start using MCP tools for database management

---

**Note**: The MCP server enhances AI assistant capabilities but should be used carefully in production environments. Always review generated SQL and migrations before applying them.